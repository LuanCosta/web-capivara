import { ExternalLink,RefreshCw } from "lucide-react";
import type { ProposalAnswer as Answer } from "@/lib/proposals";
import { AI_DISCLAIMER } from "@/lib/proposals";

export function ProposalAnswer({answer,error,loading,onRetry,tone="purple"}:{answer?:Answer;error?:string;loading:boolean;onRetry:()=>void;tone?:"purple"|"blue"}){
  if(loading)return <div className={`proposal-answer ${tone}`} aria-live="polite"><span className="ai-loader"/> <p>Analisando as propostas disponíveis…</p></div>;
  if(error)return <div className={`proposal-answer error ${tone}`} role="alert"><p>{error}</p><button type="button" onClick={onRetry}><RefreshCw size={15}/> Tentar novamente</button></div>;
  if(!answer)return null;
  const linkedSources=answer.sources.filter(source=>source.url);
  return <div className={`proposal-answer ${tone}`}><p className="answer-copy">{answer.text}</p>{linkedSources.length>0&&<div className="proposal-sources"><strong>Fontes citadas</strong>{linkedSources.map((source,index)=><a key={`${source.title}-${index}`} href={source.url} target="_blank" rel="noopener noreferrer">{source.title}<ExternalLink size={13}/></a>)}</div>}<small className="ai-disclaimer">{AI_DISCLAIMER}</small></div>
}
