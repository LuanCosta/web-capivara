type CacheEntry<T>={value:T;expiresAt:number};
type RateEntry={count:number;resetAt:number};
type ProposalGlobals={askCache:Map<string,CacheEntry<unknown>>;compareCache:Map<string,CacheEntry<unknown>>;rateLimits:Map<string,RateEntry>};

const globalStore=globalThis as typeof globalThis&{__capivaraProposals?:ProposalGlobals};
export const proposalStore=globalStore.__capivaraProposals??={askCache:new Map(),compareCache:new Map(),rateLimits:new Map()};

export function cached<T>(map:Map<string,CacheEntry<unknown>>,key:string){const item=map.get(key);if(!item)return undefined;if(item.expiresAt<Date.now()){map.delete(key);return undefined}return item.value as T}
export function saveCache<T>(map:Map<string,CacheEntry<unknown>>,key:string,value:T,ttl:number){map.set(key,{value,expiresAt:Date.now()+ttl});return value}
export function clientIp(request:Request){return request.headers.get("cf-connecting-ip")??request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()??"local"}
export function allowRequest(key:string,limit:number,windowMs:number){const now=Date.now();const current=proposalStore.rateLimits.get(key);if(!current||current.resetAt<=now){proposalStore.rateLimits.set(key,{count:1,resetAt:now+windowMs});return true}if(current.count>=limit)return false;current.count+=1;return true}
