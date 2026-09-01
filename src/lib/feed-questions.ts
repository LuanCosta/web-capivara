export type FeedQuestionType="EXPLAIN_NEWS"|"PEOPLE_MENTIONED";
export type FeedQuestionPerson={name:string;description:string;roleInNews:string};
export type FeedQuestionResponse={feedId:number;questionType:FeedQuestionType;title:string;answer:string|null;people:FeedQuestionPerson[];cached:boolean};

export class FeedQuestionError extends Error{constructor(public status:number){super("Feed question request failed")}}

export async function askFeedQuestion(feedId:number,questionType:FeedQuestionType):Promise<FeedQuestionResponse>{
  let response:Response;
  try{response=await fetch(`/api/feed/${feedId}/questions`,{method:"POST",headers:{"content-type":"application/json",accept:"application/json"},body:JSON.stringify({questionType})})}catch{throw new FeedQuestionError(0)}
  if(!response.ok)throw new FeedQuestionError(response.status);
  return response.json();
}

export function feedQuestionErrorMessage(status:number){if(status===0)return"Verifique sua conexão e tente novamente.";if(status===400)return"Não foi possível enviar esta solicitação.";if(status===404)return"Esta notícia não foi encontrada.";if(status===422)return"Esta notícia ainda não possui conteúdo suficiente para análise.";if(status===502)return"Não foi possível gerar a explicação agora.";if(status===504)return"A análise demorou demais. Tente novamente.";return"Não foi possível analisar esta notícia agora. Tente novamente."}
