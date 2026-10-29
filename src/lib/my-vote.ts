export const MY_VOTE_STORAGE_KEY="capivara-my-vote-v1";
export const MY_VOTE_SCHEMA_VERSION=1;

export const officeSlots=["PRESIDENT","GOVERNOR","FEDERAL_DEPUTY","STATE_DEPUTY","DISTRICT_DEPUTY","SENATOR_1","SENATOR_2"] as const;
export type OfficeSlot=typeof officeSlots[number];
export type ApiOffice="PRESIDENT"|"GOVERNOR"|"FEDERAL_DEPUTY"|"STATE_DEPUTY"|"DISTRICT_DEPUTY"|"SENATOR";

export type MyVoteChoice={id:number;name:string;party:string;image?:string};
export type MyVoteState={
  schemaVersion:1;
  edition:2026;
  territory:string;
  choices:Partial<Record<OfficeSlot,MyVoteChoice>>;
  alertsEnabled:boolean;
};

export type OverviewPerson={id:number;name:string;party:string;imageUrl?:string};
export type OverviewNews={id:number;title:string;summary:string;imageUrl?:string;source:string;publishedAt?:string;relatedCandidateIds:number[]};
export type OverviewParticipant={candidateId:number;originalVote?:string;position?:string;secret:boolean};
export type OverviewVote={house:"CAMARA"|"SENADO"|string;proposalId:string;votingId:string;identification:string;description:string;votedOn?:string;participants:OverviewParticipant[]};
export type VoteCoverageHouse={house:string;availability:string;updatedAt?:string;stale:boolean;partial:boolean};
export type VoteCoverage={candidateId:number;identityStatus:string;houses:VoteCoverageHouse[]};
export type TrendingNews={id:string;title:string;source:string;link?:string;publishedAt?:string};
export type OverviewTrending={candidateId:number;nome:string;partido:string;imagem?:string;mentions24h:number;news:TrendingNews[]};
export type SectionStatus="AVAILABLE"|"UNAVAILABLE"|"PARTIAL"|string;
export type MyVoteOverview={
  people:OverviewPerson[];
  news:{items:OverviewNews[];nextCursor:string|null;hasMore:boolean;status:SectionStatus};
  votes:{items:OverviewVote[];coverage:VoteCoverage[];status:SectionStatus;hasMore:boolean};
  trending:{items:OverviewTrending[];calculatedAt?:string;stale:boolean;windowHours:number;status:SectionStatus};
};

export type TimelineType="ALL"|"NEWS"|"VOTES"|"TRENDING";
export type TimelineItem=
  |{kind:"NEWS";date?:string;people:number[];item:OverviewNews}
  |{kind:"VOTES";date?:string;people:number[];item:OverviewVote}
  |{kind:"TRENDING";date?:string;people:number[];item:OverviewTrending;calculatedAt?:string;stale:boolean;windowHours:number};

type Json=Record<string,unknown>;
type StorageLike={getItem(key:string):string|null;setItem(key:string,value:string):void;removeItem(key:string):void};
const asObject=(value:unknown):Json=>value&&typeof value==="object"&&!Array.isArray(value)?value as Json:{};
const asArray=(value:unknown):unknown[]=>Array.isArray(value)?value:[];
const stringValue=(value:unknown,fallback="")=>typeof value==="string"?value:fallback;
const positiveId=(value:unknown)=>{const id=Number(value);return Number.isInteger(id)&&id>0?id:0};
const safeUrl=(value:unknown)=>{if(typeof value!=="string")return undefined;try{const url=new URL(value);return url.protocol==="https:"||url.protocol==="http:"?url.toString():undefined}catch{return undefined}};

export const emptyMyVoteState=():MyVoteState=>({schemaVersion:1,edition:2026,territory:"",choices:{},alertsEnabled:false});

export function apiOffice(slot:OfficeSlot):ApiOffice{return slot==="SENATOR_1"||slot==="SENATOR_2"?"SENATOR":slot}
export function slotsForTerritory(territory:string):OfficeSlot[]{return["PRESIDENT","GOVERNOR","FEDERAL_DEPUTY",territory==="DF"?"DISTRICT_DEPUTY":"STATE_DEPUTY","SENATOR_1","SENATOR_2"]}
export function officeLabel(slot:OfficeSlot){return({PRESIDENT:"Presidente",GOVERNOR:"Governador",FEDERAL_DEPUTY:"Deputado federal",STATE_DEPUTY:"Deputado estadual",DISTRICT_DEPUTY:"Deputado distrital",SENATOR_1:"Senador · primeira escolha",SENATOR_2:"Senador · segunda escolha"} as Record<OfficeSlot,string>)[slot]}

function normalizeChoice(value:unknown):MyVoteChoice|undefined{
  const data=asObject(value);const id=positiveId(data.id);const name=stringValue(data.name).trim();
  if(!id||!name)return undefined;
  return{id,name,party:stringValue(data.party,"—").trim()||"—",image:safeUrl(data.image)};
}

export function normalizeMyVoteState(value:unknown):MyVoteState{
  const data=asObject(value);
  if(data.schemaVersion!==MY_VOTE_SCHEMA_VERSION||data.edition!==2026)return emptyMyVoteState();
  const rawChoices=asObject(data.choices);const choices:MyVoteState["choices"]={};
  for(const slot of officeSlots){const choice=normalizeChoice(rawChoices[slot]);if(choice&&!Object.values(choices).some(item=>item?.id===choice.id))choices[slot]=choice}
  return{schemaVersion:1,edition:2026,territory:/^[A-Z]{2}$/.test(stringValue(data.territory))?stringValue(data.territory):"",choices,alertsEnabled:data.alertsEnabled===true};
}

export function loadMyVoteState(storage:StorageLike|null|undefined):MyVoteState{
  if(!storage)return emptyMyVoteState();
  try{const raw=storage.getItem(MY_VOTE_STORAGE_KEY);return raw?normalizeMyVoteState(JSON.parse(raw)):emptyMyVoteState()}catch{return emptyMyVoteState()}
}

export function saveMyVoteState(storage:StorageLike|null|undefined,state:MyVoteState){
  if(!storage)return false;
  try{storage.setItem(MY_VOTE_STORAGE_KEY,JSON.stringify(normalizeMyVoteState(state)));return true}catch{return false}
}

export function clearMyVoteState(storage:StorageLike|null|undefined){try{storage?.removeItem(MY_VOTE_STORAGE_KEY);return true}catch{return false}}

export function changeTerritory(state:MyVoteState,territory:string):MyVoteState{
  const president=state.choices.PRESIDENT;
  return{...state,territory,choices:president?{PRESIDENT:president}:{}};
}

export function setMyVoteChoice(state:MyVoteState,slot:OfficeSlot,choice:MyVoteChoice):{state:MyVoteState;duplicate:boolean}{
  const duplicate=Object.entries(state.choices).some(([key,value])=>key!==slot&&value?.id===choice.id);
  return duplicate?{state,duplicate:true}:{state:{...state,choices:{...state.choices,[slot]:choice}},duplicate:false};
}

export function removeMyVoteChoice(state:MyVoteState,slot:OfficeSlot):MyVoteState{const choices={...state.choices};delete choices[slot];return{...state,choices}}
export function selectedCandidateIds(state:MyVoteState){return[...new Set(Object.values(state.choices).map(choice=>choice?.id).filter((id):id is number=>Boolean(id)))]}

function normalizePerson(value:unknown):OverviewPerson|undefined{const item=asObject(value);const id=positiveId(item.id);if(!id)return;return{id,name:stringValue(item.name??item.nome,"Pessoa acompanhada"),party:stringValue(item.party??item.partido,"—"),imageUrl:safeUrl(item.imageUrl??item.imagem)}}
function normalizeNews(value:unknown):OverviewNews|undefined{const item=asObject(value);const id=positiveId(item.id);if(!id)return;return{id,title:stringValue(item.title??item.titulo,"Notícia"),summary:stringValue(item.summary??item.resumo),imageUrl:safeUrl(item.imageUrl??item.imagem),source:stringValue(item.source??item.fonte,"Capivara"),publishedAt:stringValue(item.publishedAt??item.publicadoEm)||undefined,relatedCandidateIds:[...new Set(asArray(item.relatedCandidateIds??item.candidateIds).map(positiveId).filter(Boolean))]}}
function normalizeParticipant(value:unknown):OverviewParticipant|undefined{const item=asObject(value);const candidateId=positiveId(item.candidateId);if(!candidateId)return;return{candidateId,originalVote:stringValue(item.originalVote??item.votoOriginal)||undefined,position:stringValue(item.position??item.posicao)||undefined,secret:item.secret===true}}
function normalizeVote(value:unknown):OverviewVote|undefined{const item=asObject(value);const proposalId=String(item.proposalId??"");const votingId=String(item.votingId??"");if(!proposalId||!votingId)return;return{house:stringValue(item.house??item.casa,"—"),proposalId,votingId,identification:stringValue(item.identification??item.identificacao,"Proposta"),description:stringValue(item.description??item.descricao),votedOn:stringValue(item.votedOn??item.votadoEm)||undefined,participants:asArray(item.participants??item.participantes).map(normalizeParticipant).filter((participant):participant is OverviewParticipant=>Boolean(participant))}}
function normalizeCoverage(value:unknown):VoteCoverage|undefined{const item=asObject(value);const candidateId=positiveId(item.candidateId);if(!candidateId)return;return{candidateId,identityStatus:stringValue(item.identityStatus,"UNKNOWN"),houses:asArray(item.houses??item.casas).map(value=>{const house=asObject(value);return{house:stringValue(house.house??house.casa,"—"),availability:stringValue(house.availability??house.disponibilidade,"UNAVAILABLE"),updatedAt:stringValue(house.updatedAt??house.atualizadoEm)||undefined,stale:house.stale===true,partial:house.partial===true}})}}
function normalizeTrendingNews(value:unknown):TrendingNews|undefined{const item=asObject(value);const id=String(item.id??"");if(!id)return;return{id,title:stringValue(item.title??item.titulo,"Notícia relacionada"),source:stringValue(item.source??item.fonte,"Fonte não informada"),link:safeUrl(item.link??item.url),publishedAt:stringValue(item.publishedAt??item.publicadoEm)||undefined}}
function normalizeTrending(value:unknown):OverviewTrending|undefined{const item=asObject(value);const candidateId=positiveId(item.candidateId??item.id);if(!candidateId)return;return{candidateId,nome:stringValue(item.nome??item.name,"Pessoa acompanhada"),partido:stringValue(item.partido??item.party,"—"),imagem:safeUrl(item.imagem??item.imageUrl),mentions24h:Number(item.mentions24h??item.mencoes24h??0)||0,news:asArray(item.news??item.noticias).map(normalizeTrendingNews).filter((news):news is TrendingNews=>Boolean(news))}}

export function normalizeMyVoteOverview(value:unknown):MyVoteOverview{
  const data=asObject(value);const news=asObject(data.news);const votes=asObject(data.votes);const trending=asObject(data.trending);
  return{
    people:asArray(data.people??data.pessoas).map(normalizePerson).filter((person):person is OverviewPerson=>Boolean(person)),
    news:{items:asArray(news.items).map(normalizeNews).filter((item):item is OverviewNews=>Boolean(item)),nextCursor:typeof news.nextCursor==="string"?news.nextCursor:null,hasMore:news.hasMore===true,status:stringValue(news.status,"UNAVAILABLE")},
    votes:{items:asArray(votes.items).map(normalizeVote).filter((item):item is OverviewVote=>Boolean(item)),coverage:asArray(votes.coverage).map(normalizeCoverage).filter((item):item is VoteCoverage=>Boolean(item)),status:stringValue(votes.status,"UNAVAILABLE"),hasMore:votes.hasMore===true},
    trending:{items:asArray(trending.items).map(normalizeTrending).filter((item):item is OverviewTrending=>Boolean(item)),calculatedAt:stringValue(trending.calculatedAt??trending.calculadoEm)||undefined,stale:trending.stale===true,windowHours:Number(trending.windowHours??trending.janelaHoras??24)||24,status:stringValue(trending.status,"UNAVAILABLE")},
  };
}

export function mergeNews(current:OverviewNews[],incoming:OverviewNews[]){const map=new Map(current.map(item=>[item.id,item]));for(const item of incoming)map.set(item.id,item);return[...map.values()]}
export function voteKey(vote:OverviewVote){return`${vote.house}|${vote.proposalId}|${vote.votingId}`}
export function mergeVotes(current:OverviewVote[],incoming:OverviewVote[]){const map=new Map(current.map(item=>[voteKey(item),item]));for(const item of incoming)map.set(voteKey(item),item);return[...map.values()]}

export function buildTimeline(overview:MyVoteOverview,personId:number|null,type:TimelineType):TimelineItem[]{
  const allowed=(ids:number[])=>personId==null||ids.includes(personId);const items:TimelineItem[]=[];
  if(type==="ALL"||type==="NEWS")for(const item of overview.news.items)if(allowed(item.relatedCandidateIds))items.push({kind:"NEWS",date:item.publishedAt,people:item.relatedCandidateIds,item});
  if(type==="ALL"||type==="VOTES")for(const item of overview.votes.items){const people=[...new Set(item.participants.map(p=>p.candidateId))];if(allowed(people))items.push({kind:"VOTES",date:item.votedOn,people,item})}
  if(type==="ALL"||type==="TRENDING")for(const item of overview.trending.items)if(allowed([item.candidateId]))items.push({kind:"TRENDING",date:overview.trending.calculatedAt,people:[item.candidateId],item,calculatedAt:overview.trending.calculatedAt,stale:overview.trending.stale,windowHours:overview.trending.windowHours});
  return items.sort((a,b)=>(Date.parse(b.date||"")||0)-(Date.parse(a.date||"")||0));
}

export const votePositionLabel=(participant:OverviewParticipant)=>participant.secret?"Votação secreta":({FOR:"A favor",AGAINST:"Contra",ABSTENTION:"Abstenção",OBSTRUCTION:"Obstrução",PRESENCE:"Presença"} as Record<string,string>)[participant.position||""]||participant.originalVote||"Posição não informada";

export function withTimeout<T>(promise:Promise<T>,milliseconds:number,message="A operação demorou mais que o esperado."){return new Promise<T>((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error(message)),milliseconds);promise.then(value=>{clearTimeout(timer);resolve(value)},error=>{clearTimeout(timer);reject(error)})})}
