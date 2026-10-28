import { API } from "./data";

export type Office={key:string;name:string};
export type Territory={code:string;name:string;scope:string;offices:Office[]};
export type Mandate={id:number;office:string;scope:string;stateCode?:string;startsOn?:string;endsOn?:string;status?:string;sourceUrl?:string;sourceUpdatedOn?:string};
export type Representative={id:number;nome:string;partido:string;imagem?:string;numero?:number;mandate?:Mandate};
export type RepresentativesPage={compositionDate?:string;territory:string;office?:string|null;representatives:Representative[];limit:number;offset:number;hasNext:boolean;nextOffset?:number|null};
export type RepresentativeProfile={compositionDate?:string;candidate:Representative&{bio?:string;origem?:string;contexto?:string;tragetoria?:string};mandates:Mandate[]};
export type VoteTotals={for:number|null;against:number|null;abstention:number|null;obstruction:number|null;presence:number|null;president:number|null;absence:number|null;other:number|null;totalVotes:number|null;recordCount:number|null;complete:boolean;source:string};
export type AffectedProfile={profile:string;possibleImpact:string;impactDirection:"POSSIBLE_BENEFIT"|"POSSIBLE_COST"|"MIXED"|"UNCERTAIN";conditions:string|null};
export type Explanation={title?:string;proposalExplanation?:string;votingExplanation?:string;resultExplanation?:string;limitations?:string[];explanationVersion?:string;affectedProfiles?:AffectedProfile[]};
export type GroupedVoting={house:string;proposalId:string;identification:string;description:string;votingId:string;votedOn?:string;votingDescription:string;originalVote?:string;position?:string;secret?:boolean;officialParty?:string;decisionType?:string;isSubstantive?:boolean;voteTotals?:VoteTotals;explanation?:Explanation;source?:{publicUrl?:string;dataUrl?:string}};
export type ProposalGroup={house:string;proposalId:string;identification:string;description:string;lastVotedOn?:string;voteCount:number;votings:GroupedVoting[];source?:{publicUrl?:string;dataUrl?:string}};
export type Voter={candidateId:number;name:string;imageUrl?:string;houses:string[];voteCount:number;lastVotedOn?:string;party?:string};
export type VotersPage={coverage:string;items:Voter[];total:number;offset:number;limit:number;hasNext:boolean;nextOffset?:number|null;parties:string[]};
export type GroupedVotesPage={politician:{candidateId:number;name:string;imageUrl?:string};identityStatus:string;coverage:string;items:ProposalGroup[];total:number;totalVotes:number;offset:number;limit:number;hasNext:boolean;nextOffset?:number|null};
export type ProposalDetail={id:string;identification:string;type?:string;description:string;presentedOn?:string;authors?:{name:string;house:string;officialId?:string}[];source?:{publicUrl?:string;dataUrl?:string};votings:{id:string;votedOn?:string;description:string;originalResult?:string;secret?:boolean|null;individualVotes?:unknown[];totalRecordedVotes?:number;nextVotesOffset?:number|null;explanation?:Explanation;explanationStatus?:string;voteTotals?:VoteTotals;individualVotesComplete?:boolean;decisionType?:string;isSubstantive?:boolean;source?:{publicUrl?:string;dataUrl?:string}}[]};

async function getJson<T>(path:string):Promise<T>{const response=await fetch(`${API}${path}`,{next:{revalidate:300}});if(!response.ok)throw new Error(`API ${response.status}`);return response.json() as Promise<T>}
const nationalOffices:Office[]=[{key:"PRESIDENT",name:"Presidência"},{key:"SENATOR",name:"Senador"},{key:"FEDERAL_DEPUTY",name:"Deputado federal"}];
const stateOffices:Office[]=[{key:"GOVERNOR",name:"Governador"},{key:"SENATOR",name:"Senador"},{key:"FEDERAL_DEPUTY",name:"Deputado federal"},{key:"STATE_DEPUTY",name:"Deputado estadual"}];
const territoryFallback:Territory[]=[{code:"BR",name:"Brasil",scope:"NATIONAL",offices:nationalOffices},...[['AC','Acre'],['AL','Alagoas'],['AP','Amapá'],['AM','Amazonas'],['BA','Bahia'],['CE','Ceará'],['ES','Espírito Santo'],['GO','Goiás'],['MA','Maranhão'],['MT','Mato Grosso'],['MS','Mato Grosso do Sul'],['MG','Minas Gerais'],['PA','Pará'],['PB','Paraíba'],['PR','Paraná'],['PE','Pernambuco'],['PI','Piauí'],['RJ','Rio de Janeiro'],['RN','Rio Grande do Norte'],['RS','Rio Grande do Sul'],['RO','Rondônia'],['RR','Roraima'],['SC','Santa Catarina'],['SP','São Paulo'],['SE','Sergipe'],['TO','Tocantins']].map(([code,name])=>({code,name,scope:"STATE",offices:stateOffices})),{code:"DF",name:"Distrito Federal",scope:"FEDERAL_DISTRICT",offices:[...stateOffices.filter(item=>item.key!=="STATE_DEPUTY"),{key:"DISTRICT_DEPUTY",name:"Deputado distrital"}]}];
export const getTerritories=async()=>{try{return(await getJson<{territories:Territory[]}>("/representatives/territories")).territories}catch{return territoryFallback}};
export async function getRepresentatives(params:{territory?:string;office?:string;query?:string;mode?:string;limit?:number;offset?:number}):Promise<RepresentativesPage>{const query=new URLSearchParams();if(params.territory)query.set("territory",params.territory);if(params.office)query.set("office",params.office);if(params.query)query.set("query",params.query.slice(0,100));if(params.mode)query.set("mode",params.mode);query.set("limit",String(params.limit??20));query.set("offset",String(params.offset??0));return getJson(`/representatives?${query}`)}
export const getRepresentative=(id:string,mode?:string)=>getJson<RepresentativeProfile>(`/representatives/${encodeURIComponent(id)}${mode?`?mode=${encodeURIComponent(mode)}`:""}`);
export async function getVoters(params:{party?:string;limit?:number;offset?:number}):Promise<VotersPage>{const query=new URLSearchParams({substantiveOnly:"true",limit:String(params.limit??20),offset:String(params.offset??0)});if(params.party)query.set("party",params.party);return getJson(`/representatives/voters?${query}`)}
export async function getGroupedVotes(id:string,params:{position?:string;search?:string;limit?:number;offset?:number}):Promise<GroupedVotesPage>{const query=new URLSearchParams({substantiveOnly:"true",limit:String(params.limit??20),offset:String(params.offset??0)});if(params.position)query.set("position",params.position);if(params.search)query.set("search",params.search.slice(0,200));return getJson(`/representatives/${encodeURIComponent(id)}/votes/grouped?${query}`)}
export const getProposalDetail=(house:string,id:string,votesOffset=0)=>getJson<ProposalDetail>(`/legislative/votings/${encodeURIComponent(house)}/${encodeURIComponent(id)}?substantiveOnly=true&limit=50&votesOffset=${votesOffset}`);

export const officeName=(key?:string)=>({PRESIDENT:"Presidência",GOVERNOR:"Governador",SENATOR:"Senador",FEDERAL_DEPUTY:"Deputado federal",STATE_DEPUTY:"Deputado estadual",DISTRICT_DEPUTY:"Deputado distrital"}[key??""]??key??"Cargo não informado");
export const decisionTypeLabel=(type?:string)=>({
  MAIN_TEXT:"Texto principal",
  AMENDMENT:"Emenda",
  SUBSTITUTE:"Substitutivo",
  PROCEDURAL:"Questão de procedimento",
  MOTION:"Requerimento",
  VETO:"Veto",
}[type??""]??"Tipo de decisão não informado");
export const formatIsoDate=(value?:string)=>{if(!value)return"Data não informada";const date=new Date(`${value}T12:00:00`);return Number.isNaN(date.valueOf())?value:new Intl.DateTimeFormat("pt-BR").format(date)};
