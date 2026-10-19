import Link from "next/link";
import { ArrowLeft,CheckCircle2,ExternalLink,Info,MinusCircle,XCircle } from "lucide-react";
import { PageShell } from "@/components/ui";
import { formatIsoDate,getProposalDetail,type VoteTotals } from "@/lib/representatives";

const value=(number:number|null|undefined)=>number==null?"Indisponível":new Intl.NumberFormat("pt-BR").format(number);
function Totals({totals}:{totals?:VoteTotals}){
  if(!totals||totals.source==="UNAVAILABLE"||totals.totalVotes==null)return <p className="data-unavailable"><Info size={17}/> O placar nominal não está disponível para esta votação.</p>;
  const denominator=totals.totalVotes||0;
  const rows=[{key:"for",label:"A favor",count:totals.for,icon:<CheckCircle2/>},{key:"against",label:"Contra",count:totals.against,icon:<XCircle/>},{key:"abstention",label:"Abstenção",count:totals.abstention,icon:<MinusCircle/>}];
  return <div className="vote-totals"><div className="vote-total-summary"><strong>{value(totals.totalVotes)}</strong><span>votos considerados no placar</span></div>{rows.map(row=><div className={`vote-total-row total-${row.key}`} key={row.key}><span><b>{row.icon}{row.label}</b><strong>{value(row.count)}</strong></span><i><em style={{width:`${denominator&&row.count!=null?Math.min(100,row.count/denominator*100):0}%`}}/></i></div>)}<small>{totals.complete?"Registros informados como completos pela fonte.":"Dados parciais; valores ausentes não foram transformados em zero."}</small></div>
}
export default async function Proposta({params}:{params:Promise<{house:string;id:string}>}){
  const {house,id}=await params;let proposal;
  try{proposal=await getProposalDetail(house,id)}catch{return <PageShell><section className="wrap page-hero"><h1>Proposta indisponível</h1><p>Não foi possível consultar os dados oficiais agora. Tente novamente mais tarde.</p></section></PageShell>}
  return <PageShell><article className="wrap proposal-detail">
    <Link className="article-back" href="/capivara"><ArrowLeft size={16}/> Voltar para o Capivara</Link>
    <div className="proposal-title"><span>{house}</span><h1>{proposal.identification}</h1><p>{proposal.description}</p><small>Apresentada em {formatIsoDate(proposal.presentedOn)}</small>{proposal.source?.publicUrl&&<a href={proposal.source.publicUrl} target="_blank" rel="noopener noreferrer">Fonte oficial <ExternalLink size={14}/></a>}</div>
    <section><div className="section-title"><div><span>DECISÕES REGISTRADAS</span><h2>Votações desta proposta</h2><p className="section-helper">Cada card abaixo representa uma decisão diferente. Os placares não são somados entre etapas.</p></div></div>
      <div className="voting-detail-list">{proposal.votings.map((voting,index)=><article className="voting-detail" id={`votacao-${voting.id}`} key={voting.id}>
        <header><div className="voting-index">{String(index+1).padStart(2,"0")}</div><div><span>{voting.decisionType||"Decisão"}</span><h3>{formatIsoDate(voting.votedOn)}</h3><small>ID oficial: {voting.id}</small></div></header>
        <section className="voting-object"><span>O QUE FOI DECIDIDO</span><p>{voting.description}</p></section>
        <Totals totals={voting.voteTotals}/>
        {voting.explanation&&<div className="legislative-explanation"><span>CAPIVARA EXPLICA · EXPLICAÇÃO POR IA</span>{voting.explanation.proposalExplanation&&<section><h4>Sobre a proposta</h4><p>{voting.explanation.proposalExplanation}</p></section>}{voting.explanation.votingExplanation&&<section><h4>O que foi votado</h4><p>{voting.explanation.votingExplanation}</p></section>}{voting.explanation.resultExplanation&&<section><h4>Resultado da votação</h4><p>{voting.explanation.resultExplanation}</p></section>}{Boolean(voting.explanation.affectedProfiles?.length)&&<section><h4>Quem pode ser afetado</h4><div className="affected-profiles">{voting.explanation.affectedProfiles!.slice(0,3).map(profile=><div key={profile.profile}><b>{profile.profile}</b><p>{profile.possibleImpact}</p>{profile.conditions&&<small>Condições: {profile.conditions}</small>}</div>)}</div></section>}{Boolean(voting.explanation.limitations?.length)&&<section><h4>Limitações da informação</h4><ul>{voting.explanation.limitations!.map(item=><li key={item}>{item}</li>)}</ul></section>}</div>}
        <p className="voting-caution"><Info size={16}/> Esta votação pode tratar de uma etapa específica. O resultado não comprova, sozinho, aprovação final ou entrada em vigor da proposta.</p>
        {voting.source?.publicUrl&&<a className="source-link" href={voting.source.publicUrl} target="_blank" rel="noopener noreferrer">Conferir votação na fonte <ExternalLink size={14}/></a>}
      </article>)}</div>
    </section>
  </article></PageShell>
}
