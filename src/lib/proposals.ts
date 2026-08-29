import { API } from "@/lib/data";

export const AI_DISCLAIMER = "Síntese gerada por IA com base nas propostas disponíveis. O conteúdo pode conter limitações e não representa recomendação eleitoral.";
export const PERCENTAGE_DISCLAIMER = "Os percentuais representam a distribuição temática das propostas. Não indicam qualidade, viabilidade, desempenho ou recomendação de candidato.";

export type ProposalQuestion = { id:number; title:string; question:string; position:number };
export type ProposalSource = { title:string; url?:string };
export type ProposalAnswer = { text:string; sources:ProposalSource[] };
export type ComparisonCandidate = { id:number; name:string; party?:string; number?:string };
export type ComparisonTheme = { theme:string; candidateAPercentage:number; candidateBPercentage:number };
export type ProposalComparison = { candidateA:ComparisonCandidate; candidateB:ComparisonCandidate; themes:ComparisonTheme[]; methodology:string };

type Json = Record<string, unknown>;
const asObject=(value:unknown):Json=>value&&typeof value==="object"&&!Array.isArray(value)?value as Json:{};
const asText=(...values:unknown[])=>values.find(value=>typeof value==="string"&&value.trim()) as string|undefined;
const asNumber=(...values:unknown[])=>{const value=values.find(item=>Number.isFinite(Number(item)));return value===undefined?undefined:Number(value)};
const unwrap=(value:unknown)=>{const object=asObject(value);return object.data??object};
const validUrl=(value:unknown)=>{if(typeof value!=="string")return undefined;try{const url=new URL(value);return url.protocol==="http:"||url.protocol==="https:"?url.toString():undefined}catch{return undefined}};

export async function getProposalQuestions():Promise<ProposalQuestion[]>{
  const response=await fetch(`${API}/proposals/suggested-questions`,{next:{revalidate:3600}});
  if(!response.ok)throw new Error("Não foi possível carregar as perguntas sugeridas.");
  const json=asObject(await response.json());
  const nestedQuestions=asObject(json.data).questions;
  const raw:unknown[]=Array.isArray(json.questions)?json.questions:Array.isArray(nestedQuestions)?nestedQuestions:[];
  return raw.map((item,index)=>{const q=asObject(item);return{id:Number(q.id),title:asText(q.title)??`Pergunta ${index+1}`,question:asText(q.question)??"",position:Number(q.position??index+1)}}).filter(q=>Number.isInteger(q.id)&&q.question).sort((a,b)=>a.position-b.position);
}

export function normalizeAnswer(value:unknown):ProposalAnswer{
  const root=asObject(unwrap(value));
  const answer=asText(root.answer,root.response,root.resposta,root.summary,root.content);
  if(!answer)throw new Error("A resposta da IA veio vazia.");
  const rawSources=root.sources??root.fontes??root.references;
  const list=Array.isArray(rawSources)?rawSources:rawSources?[rawSources]:[];
  const sources=list.map((source,index)=>{
    if(typeof source==="string"){const url=validUrl(source);return{title:url?`Fonte ${index+1}`:source,...(url?{url}:{})}}
    const item=asObject(source);const url=validUrl(item.url??item.link??item.href);return{title:asText(item.title,item.titulo,item.name,item.nome)??(url?`Fonte ${index+1}`:"Fonte"),...(url?{url}:{})};
  }).filter(source=>source.title);
  return{text:answer,sources};
}

const normalizeCandidate=(value:unknown,fallbackId:number):ComparisonCandidate=>{const item=asObject(value);return{id:asNumber(item.id,item.candidateId)??fallbackId,name:asText(item.name,item.nome,item.candidateName)??`Candidato ${fallbackId}`,party:asText(item.party,item.partido),number:asText(item.number,item.numero)??(item.number!==undefined?String(item.number):undefined)}};
const normalizeTheme=(value:unknown):ComparisonTheme|null=>{const item=asObject(value);const theme=asText(item.theme,item.tema,item.name,item.nome,item.title);if(!theme)return null;const candidateA=asObject(item.candidateA??item.candidatoA);const candidateB=asObject(item.candidateB??item.candidatoB);return{theme,candidateAPercentage:asNumber(item.candidateAPercent,item.candidateAPercentage,item.percentageA,item.percentA,candidateA.percentage,candidateA.percent,candidateA.value)??0,candidateBPercentage:asNumber(item.candidateBPercent,item.candidateBPercentage,item.percentageB,item.percentB,candidateB.percentage,candidateB.percent,candidateB.value)??0}};

export function normalizeComparison(value:unknown,candidateAId:number,candidateBId:number):ProposalComparison{
  const root=asObject(unwrap(value));
  const rawThemes=root.themes??root.temas??root.comparison??root.comparacao;
  const themes=(Array.isArray(rawThemes)?rawThemes:[]).map(normalizeTheme).filter((theme):theme is ComparisonTheme=>Boolean(theme));
  return{candidateA:normalizeCandidate(root.candidateA??root.candidatoA,candidateAId),candidateB:normalizeCandidate(root.candidateB??root.candidatoB,candidateBId),themes,methodology:asText(root.methodology,root.metodologia)??"Análise temática automatizada das propostas disponíveis."};
}

export async function bffAsk(candidateId:number,questionId:number,question:string){const response=await fetch(`${API}/proposals/ask`,{method:"POST",headers:{"content-type":"application/json",accept:"application/json"},body:JSON.stringify({candidateId,questionId,question}),cache:"no-store"});if(!response.ok)throw new Error(`Serviço de propostas indisponível (${response.status}).`);return normalizeAnswer(await response.json())}
export async function bffCompare(candidateAId:number,candidateBId:number){const response=await fetch(`${API}/proposals/compare`,{method:"POST",headers:{"content-type":"application/json",accept:"application/json"},body:JSON.stringify({candidateAId,candidateBId}),cache:"no-store"});if(!response.ok)throw new Error(`Serviço de comparação indisponível (${response.status}).`);return normalizeComparison(await response.json(),candidateAId,candidateBId)}

export function orientComparison(comparison:ProposalComparison,requestedA:number){if(comparison.candidateA.id===requestedA)return comparison;return{...comparison,candidateA:comparison.candidateB,candidateB:comparison.candidateA,themes:comparison.themes.map(theme=>({...theme,candidateAPercentage:theme.candidateBPercentage,candidateBPercentage:theme.candidateAPercentage}))}}
