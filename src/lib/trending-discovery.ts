import { API } from "./data";
export type DiscoveryNews={id:string;title:string;source:string;link:string;publishedAt?:string;description?:string;sourceUrl?:string};
export type DiscoveryTopic={key:string;title:string;mentions24h:number;news:DiscoveryNews[]};
export type DiscoveryPolitician={candidateId:number;nome:string;partido:string;imagem?:string;mentions24h:number;news:DiscoveryNews[]};
export type TrendingDiscovery={calculatedAt:string;stale:boolean;metric:string;windowHours:number;topics:DiscoveryTopic[];politicians:DiscoveryPolitician[]};
export async function getTrendingDiscovery():Promise<TrendingDiscovery>{const response=await fetch(`${API}/trending/discovery`,{next:{revalidate:300}});if(!response.ok)throw new Error(`API ${response.status}`);return response.json()}
export const discoveryDate=(value?:string)=>{if(!value)return"horário indisponível";const date=new Date(value);return Number.isNaN(date.valueOf())?"horário indisponível":new Intl.DateTimeFormat("pt-BR",{dateStyle:"short",timeStyle:"short"}).format(date)};
