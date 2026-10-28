import Link from "next/link";
import { ArrowLeft,ArrowRight,CheckCircle2,ChevronDown,ExternalLink,MinusCircle,Search,XCircle } from "lucide-react";
import { PageShell } from "@/components/ui";
import { decisionTypeLabel,formatIsoDate,getGroupedVotes } from "@/lib/representatives";

type Params={search?:string;position?:string;offset?:string};
const positionLabel=(position?:string)=>({FOR:"A favor",AGAINST:"Contra",ABSTENTION:"Abstenção"}[position||""]||"Posição não informada");
const positionClass=(position?:string)=>position==="FOR"?"for":position==="AGAINST"?"against":position==="ABSTENTION"?"abstention":"unknown";
const PositionIcon=({position}:{position?:string})=>position==="FOR"?<CheckCircle2/>:position==="AGAINST"?<XCircle/>:<MinusCircle/>;

export default async function Votacoes({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<Params>}){
  const {id}=await params;const query=await searchParams;const offset=Math.max(0,Number(query.offset)||0);let page;
  try{page=await getGroupedVotes(id,{search:query.search,position:query.position,offset,limit:20})}
  catch{page={politician:{candidateId:Number(id),name:"Político"},identityStatus:"UNAVAILABLE",coverage:"Os dados estão temporariamente indisponíveis.",items:[],total:0,totalVotes:0,offset,limit:20,hasNext:false,nextOffset:null}}
  const href=(nextOffset:number)=>{const p=new URLSearchParams();if(query.search)p.set("search",query.search);if(query.position)p.set("position",query.position);p.set("offset",String(nextOffset));return`/politicos/${id}/votacoes?${p}`};
  const filterHref=(position:string)=>{const p=new URLSearchParams();if(query.search)p.set("search",query.search);if(position)p.set("position",position);return`/politicos/${id}/votacoes?${p}`};
  const filters=[{value:"",label:"Todos"},{value:"FOR",label:"A favor"},{value:"AGAINST",label:"Contra"},{value:"ABSTENTION",label:"Abstenção"}];
  return <PageShell>
    <section className="wrap page-hero vote-page-hero"><Link className="article-back" href={`/politicos/${id}`}><ArrowLeft size={16}/> Voltar ao perfil</Link><span className="kicker">COMO VOTOU</span><h1>{page.politician.name}</h1><p>Veja a posição registrada em cada decisão. Um voto específico não resume a opinião do político sobre toda a proposta.</p></section>
    <section className="wrap vote-results">
      <form className="vote-search" action={`/politicos/${id}/votacoes`}><input type="hidden" name="position" value={query.position||""}/><label><span>Pesquisar proposta ou tema</span><div><Search size={18}/><input name="search" defaultValue={query.search||""} maxLength={200} placeholder="Ex.: PEC 8/2025 ou escala 6x1"/></div></label><button type="submit">Pesquisar</button>{query.search&&<Link href={filterHref(query.position||"")}>Limpar busca</Link>}</form>
      <nav className="vote-position-filters" aria-label="Filtrar por posição do político">{filters.map(filter=><Link href={filterHref(filter.value)} className={`${positionClass(filter.value)} ${(query.position||"")===filter.value?"active":""}`} aria-current={(query.position||"")===filter.value?"page":undefined} key={filter.value}>{filter.value&&<PositionIcon position={filter.value}/>} {filter.label}</Link>)}</nav>
      <div className="vote-summary"><span><b>{page.total}</b> propostas</span><span><b>{page.totalVotes}</b> votações distintas</span></div>
      <p className="coverage-note">{page.coverage}</p>
      {page.items.length?<div className="proposal-groups">{page.items.map(group=><article className="proposal-group" key={`${group.house}-${group.proposalId}`}>
        <header><div className="proposal-group-title"><span>{group.house}</span><h2>{group.identification}</h2><p>{group.description}</p><small>{group.voteCount} {group.voteCount===1?"decisão registrada":"decisões registradas"}</small></div><Link className="open-proposal" href={`/propostas/${group.house}/${group.proposalId}`}>Ver proposta completa <ArrowRight size={16}/></Link></header>
        <div className="group-votings">{group.votings.map(vote=><details className={`vote-decision vote-${positionClass(vote.position)}`} key={`${vote.house}-${vote.votingId}`}>
          <summary><span className="vote-position"><PositionIcon position={vote.position}/><span><b>{positionLabel(vote.position)}</b><small>Voto registrado: {vote.originalVote||"não informado"}</small></span></span><span className="vote-decision-meta"><b>{formatIsoDate(vote.votedOn)}</b><small>{decisionTypeLabel(vote.decisionType)}</small></span><span className="vote-expand"><b>Ver detalhes</b><ChevronDown size={19}/></span></summary>
          <div className="vote-decision-body"><h3>O que foi decidido</h3><p>{vote.votingDescription}</p>{vote.explanation?.votingExplanation&&<div className="ai-explanation"><span>CAPIVARA EXPLICA · EXPLICAÇÃO POR IA</span><p>{vote.explanation.votingExplanation}</p></div>}{vote.source?.publicUrl&&<a href={vote.source.publicUrl} target="_blank" rel="noopener noreferrer">Consultar fonte oficial <ExternalLink size={14}/></a>}</div>
        </details>)}</div>
      </article>)}</div>:<div className="empty-state"><h2>Nenhuma proposta encontrada neste recorte</h2><p>Altere a pesquisa ou os filtros. A lista vazia não comprova ausência de atuação.</p></div>}
      <nav className="pagination">{offset>0?<Link href={href(Math.max(0,offset-20))}><ArrowLeft size={16}/> Anterior</Link>:<span/>}{page.hasNext&&page.nextOffset!=null&&<Link href={href(page.nextOffset)}>Próxima página <ArrowRight size={16}/></Link>}</nav>
    </section>
  </PageShell>
}
