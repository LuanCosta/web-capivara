export const API = "https://bff-capivara.onrender.com/api";

export type News = { id: string; title: string; summary: string; category: string; source: string; date: string; image?: string; content?: string; politicians?: string[] };
export type Politician = { id: string; name: string; party: string; number?: string; initials: string; role: string; image?: string; mentions?: number; growth?: number };

export const fallbackNews: News[] = [
  { id:"flavio-bolsonaro-visitas", category:"JUSTIÇA", title:"Moraes suspende visitas de Flávio Bolsonaro ao pai por 90 dias", summary:"Decisão foi tomada após Flávio Bolsonaro ler, durante uma transmissão ao vivo, uma carta escrita pelo ex-presidente.", source:"UOL Notícias", date:"15 jul 2026", image:"/flavio-senado.jpg", politicians:["Flávio Bolsonaro"] },
  { id:"escala-6x1", category:"VOTAÇÃO", title:"Veja quais deputados votaram contra mudança na escala 6×1", summary:"Votação gera repercussão e reacende o debate sobre jornadas de trabalho.", source:"Câmara dos Deputados", date:"14 jul 2026", politicians:["Câmara"] },
  { id:"crime-organizado", category:"SEGURANÇA", title:"Novo programa de combate ao crime organizado é anunciado", summary:"Governo detalha ações integradas e investimento em inteligência policial.", source:"Agência Brasil", date:"14 jul 2026" },
  { id:"orcamento", category:"ECONOMIA", title:"Governo bloqueia R$ 22 bilhões do orçamento para cumprir meta fiscal", summary:"Corte atinge diferentes ministérios após aumento nas despesas obrigatórias.", source:"BBC Brasil", date:"13 jul 2026" },
];

export const fallbackPoliticians: Politician[] = [
  {id:"lula",name:"Lula",party:"PT",number:"13",initials:"LL",role:"Presidência 2026",mentions:87,growth:94},
  {id:"flavio-bolsonaro",name:"Flávio Bolsonaro",party:"PL",number:"12",initials:"FB",role:"Senador • RJ",image:"/flavio-profile.jpg",mentions:76,growth:76},
  {id:"renan-santos",name:"Renan Santos",party:"Partido Missão",number:"15",initials:"RS",role:"Presidência 2026",mentions:63,growth:60},
  {id:"aldo-rebelo",name:"Aldo Rebelo",party:"Democracia Cristã",number:"16",initials:"AR",role:"Presidência 2026",mentions:54,growth:56},
  {id:"romeu-zema",name:"Romeu Zema",party:"Novo",number:"21",initials:"RZ",role:"Presidência 2026"},
];

type Raw = Record<string, unknown>;
const text=(v:unknown,fallback="")=>typeof v==="string"&&v.trim()?v:fallback;
const validImage=(v:unknown)=>typeof v==="string"&&/^https?:\/\//.test(v)?v:undefined;
const initials=(name:string)=>name.split(/\s+/).slice(0,2).map(x=>x[0]).join("").toUpperCase();
const date=(v:unknown)=>{if(typeof v!=="string")return "Agora";const d=new Date(v);return Number.isNaN(d.valueOf())?v:new Intl.DateTimeFormat("pt-BR",{day:"2-digit",month:"short",year:"numeric"}).format(d)};

async function raw(path:string):Promise<Raw[]>{const r=await fetch(`${API}${path}`,{next:{revalidate:300}});if(!r.ok)throw new Error(`API ${r.status}`);const json=await r.json();const value=json.data??json;return Array.isArray(value)?value:[]}
const mapNews=(n:Raw,i=0):News=>({id:String(n.id??i),title:text(n.titulo??n.title,"Notícia do Capivara"),summary:text(n.resumo??n.summary,"Abra para entender os principais pontos desta notícia."),content:text(n.conteudo),category:text(n.categoria??n.category,"POLÍTICA"),source:text(n.fonte_nome??n.source,"Capivara"),date:date(n.criado_em??n.date),image:validImage(n.imagem_url??n.image),politicians:Array.isArray(n.feed_candidates)?(n.feed_candidates as Raw[]).map(p=>text(p.nome)).filter(Boolean):[]});
export async function getNews():Promise<News[]>{try{return (await raw("/feed")).map(mapNews)}catch{return fallbackNews}}
export async function getCandidateNews(id:string):Promise<News[]>{try{const r=await fetch(`${API}/candidates/${id}/feed`,{next:{revalidate:300}});if(!r.ok)throw new Error(`API ${r.status}`);const json=await r.json();const value=json.data??json;return (Array.isArray(value)?value:[value]).filter(Boolean).map(mapNews)}catch{return []}}
export async function getPoliticians():Promise<Politician[]>{try{return (await raw("/candidates")).map((p,i)=>{const name=text(p.nome??p.name,"Político");return{id:String(p.id??i),name,party:text(p.partido??p.party,"—"),number:p.numero?String(p.numero):undefined,initials:initials(name),role:text(p.bio??p.cargo,"Perfil político"),image:validImage(p.imagem??p.imagem_url)}})}catch{return fallbackPoliticians}}
export async function getTrending():Promise<Politician[]>{try{return (await raw("/trending")).map((p,i)=>{const name=text(p.nome??p.name,"Político");return{id:String(p.candidateId??p.id??i),name,party:text(p.partido??p.party,"—"),initials:initials(name),role:"Menções nas últimas 24h",image:validImage(p.imagem??p.imagem_url),mentions:Number(p.mentions24h??0),growth:Number(p.displayPercent??p.growthPercent??0)}})}catch{return fallbackPoliticians.slice(0,4)}}
export const getNewsById=async(id:string)=>(await getNews()).find(n=>String(n.id)===id) ?? fallbackNews.find(n=>n.id===id) ?? fallbackNews[0];
export const getPolitician=async(id:string)=>(await getPoliticians()).find(p=>String(p.id)===id) ?? fallbackPoliticians.find(p=>p.id===id) ?? fallbackPoliticians[0];
