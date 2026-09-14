export type DailySummaryCandidate={id:number;name:string;party:string};
export type DailySummarySlide={type:"COVER"|"NEWS"|"FINISH";title:string;description:string;feedId?:number|null;imageUrl?:string|null;category?:string|null;sourceName?:string|null;impactLevel?:string|null;candidates:DailySummaryCandidate[]};
export type DailySummaryResponse={date:string;title:string;description:string;estimatedReadingMinutes?:number;generatedAt?:string|null;available:boolean;availableAt?:string|null;slides:DailySummarySlide[]};

type UnknownRecord=Record<string,unknown>;
const record=(value:unknown):UnknownRecord=>value!==null&&typeof value==="object"&&!Array.isArray(value)?value as UnknownRecord:{};
const string=(value:unknown,fallback="")=>typeof value==="string"?value.trim()||fallback:fallback;
const optionalString=(value:unknown)=>typeof value==="string"&&value.trim()?value.trim():null;
const safeImage=(value:unknown)=>{const candidate=optionalString(value);if(!candidate)return null;try{const url=new URL(candidate);return url.protocol==="http:"||url.protocol==="https:"?url.toString():null}catch{return null}};

export function saoPauloDateParts(date:Date){const parts=new Intl.DateTimeFormat("en-CA",{timeZone:"America/Sao_Paulo",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",hourCycle:"h23"}).formatToParts(date);const get=(type:Intl.DateTimeFormatPartTypes)=>parts.find(part=>part.type===type)?.value??"";return{date:`${get("year")}-${get("month")}-${get("day")}`,hour:Number(get("hour"))}}
export function isDailySummaryWindowOpen(date:Date){return saoPauloDateParts(date).hour>=20}
export function hasNewsSlides(summary:DailySummaryResponse|null|undefined){return Boolean(summary?.slides.some(slide=>slide.type==="NEWS"))}

export function normalizeDailySummary(value:unknown):DailySummaryResponse{
  const root=record(value);const rawSlides=Array.isArray(root.slides)?root.slides:[];
  const slides=rawSlides.reduce<DailySummarySlide[]>((result,item)=>{const slide=record(item);const type=string(slide.type).toUpperCase();if(type!=="COVER"&&type!=="NEWS"&&type!=="FINISH")return result;const rawCandidates=Array.isArray(slide.candidates)?slide.candidates:[];const candidates=rawCandidates.map(candidate=>{const current=record(candidate);return{id:Number(current.id),name:string(current.name),party:string(current.party)}}).filter(candidate=>Number.isFinite(candidate.id)&&candidate.name);const rawFeedId=slide.feedId===null?null:Number(slide.feedId);result.push({type,title:string(slide.title),description:string(slide.description),feedId:Number.isFinite(rawFeedId)?rawFeedId:null,imageUrl:safeImage(slide.imageUrl),category:optionalString(slide.category),sourceName:optionalString(slide.sourceName),impactLevel:optionalString(slide.impactLevel),candidates});return result},[]);
  const minutes=Number(root.estimatedReadingMinutes);
  return{date:string(root.date),title:string(root.title,"Capivara Hoje"),description:string(root.description,"As principais notícias do dia, resumidas pelo Capivara."),estimatedReadingMinutes:Number.isFinite(minutes)&&minutes>0?minutes:undefined,generatedAt:optionalString(root.generatedAt),available:root.available===undefined?true:root.available===true,availableAt:optionalString(root.availableAt),slides};
}

export async function getDailySummaryForHome():Promise<DailySummaryResponse|null>{
  try{const response=await fetch("https://bff-capivara.fly.dev/api/feed/daily-summary",{cache:"no-store",headers:{accept:"application/json"}});if(!response.ok)throw new Error(`Daily summary ${response.status}`);const summary=normalizeDailySummary(await response.json());if(!summary.available||!hasNewsSlides(summary))return null;return summary}catch(error){console.error("[daily-summary] Não foi possível carregar o resumo diário.",error);return null}
}
