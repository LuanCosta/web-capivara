import { AnonymousSessionError,clearAnonymousSession,getAnonymousSession,getStoredAnonymousSession } from "./anonymous-session.ts";

export type ReactionType="LIKE"|"DISLIKE";
export type FeedReactionResponse={feedId:number;likes:number;dislikes:number;myReaction:ReactionType|null};
const BFF_URL=(process.env.NEXT_PUBLIC_BFF_URL||"https://bff-capivara.fly.dev").replace(/\/$/,"");
const TIMEOUT_MS=10_000;

export class FeedReactionError extends Error{status:number;constructor(status:number,message="Não foi possível atualizar sua reação."){super(message);this.status=status}}
function normalize(value:unknown):FeedReactionResponse{if(!value||typeof value!=="object")throw new FeedReactionError(502,"Resposta inválida do serviço de reações.");const item=value as Record<string,unknown>;const feedId=Number(item.feedId),likes=Number(item.likes),dislikes=Number(item.dislikes);const myReaction=item.myReaction===null?null:item.myReaction==="LIKE"||item.myReaction==="DISLIKE"?item.myReaction:null;if(!Number.isInteger(feedId)||!Number.isFinite(likes)||likes<0||!Number.isFinite(dislikes)||dislikes<0)throw new FeedReactionError(502,"Resposta inválida do serviço de reações.");return{feedId,likes,dislikes,myReaction}}

async function request(feedId:number,method:"GET"|"PUT"|"DELETE",token?:string,reaction?:ReactionType){
  const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),TIMEOUT_MS);
  try{const response=await fetch(`${BFF_URL}/api/feed/${feedId}/reactions`,{method,headers:{accept:"application/json",...(token?{authorization:`Bearer ${token}`} : {}),...(method==="PUT"?{"content-type":"application/json"}:{})},body:method==="PUT"?JSON.stringify({reaction}):undefined,signal:controller.signal});if(!response.ok)throw new FeedReactionError(response.status);return normalize(await response.json())}
  catch(error){if(error instanceof FeedReactionError)throw error;if(error instanceof AnonymousSessionError)throw error;if(error instanceof DOMException&&error.name==="AbortError")throw new FeedReactionError(504,"A solicitação demorou demais. Tente novamente.");throw new FeedReactionError(0,"Verifique sua conexão e tente novamente.")}
  finally{clearTimeout(timer)}
}

export async function getFeedReactions(feedId:number){const stored=getStoredAnonymousSession();try{return await request(feedId,"GET",stored?.token)}catch(error){if(error instanceof FeedReactionError&&error.status===401&&stored){clearAnonymousSession();return request(feedId,"GET")}throw error}}
async function authenticated(feedId:number,method:"PUT"|"DELETE",reaction?:ReactionType){let session=await getAnonymousSession();try{return await request(feedId,method,session.token,reaction)}catch(error){if(!(error instanceof FeedReactionError)||error.status!==401)throw error;clearAnonymousSession();session=await getAnonymousSession();return request(feedId,method,session.token,reaction)}}
export const setFeedReaction=(feedId:number,reaction:ReactionType)=>authenticated(feedId,"PUT",reaction);
export const removeFeedReaction=(feedId:number)=>authenticated(feedId,"DELETE");
export function reactionOperation(current:ReactionType|null,selected:ReactionType):"SET"|"REMOVE"{return current===selected?"REMOVE":"SET"}
