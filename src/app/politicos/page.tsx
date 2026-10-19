import Link from "next/link";
import { ArrowLeft,ArrowRight } from "lucide-react";
import { PageShell } from "@/components/ui";
import { RepresentativeAutocomplete } from "@/components/representative-autocomplete";
import { getRepresentatives,getTerritories,officeName } from "@/lib/representatives";

export const metadata={title:"Políticos",description:"Consulte representantes por estado, cargo e nome, com fontes públicas e composição identificada."};
type Params={territory?:string;office?:string;query?:string;mode?:string;offset?:string};
const initials=(name:string)=>name.split(/\s+/).slice(0,2).map(part=>part[0]).join("").toUpperCase();

export default async function Politicos({searchParams}:{searchParams:Promise<Params>}){
  const params=await searchParams;
  const territories=await getTerritories();
  const territory=params.territory||"BR";
  const selected=territories.find(item=>item.code===territory)||territories[0];
  const office=params.office||"";
  const mode=params.mode==="CURRENT"?"CURRENT":"FUTURE_COMPOSITION";
  const offset=Math.max(0,Number(params.offset)||0);
  let page;
  try{page=await getRepresentatives({territory,office,query:params.query,mode,offset,limit:20})}
  catch{page={representatives:[],territory,office,offset,limit:20,hasNext:false,nextOffset:null}}
  const href=(nextOffset:number)=>{const next=new URLSearchParams();next.set("territory",territory);if(office)next.set("office",office);if(params.query)next.set("query",params.query);next.set("mode",mode);next.set("offset",String(nextOffset));return`/politicos?${next}`};
  return <PageShell>
    <section className="wrap page-hero representatives-hero"><span className="kicker">CATÁLOGO PÚBLICO</span><h1>Políticos</h1><p>Busque por nome, estado e cargo. A composição exibida e a data de referência aparecem junto aos resultados.</p></section>
    <section className="wrap representatives-layout">
      <form className="representative-filters" action="/politicos">
        <label><span>Estado ou território</span><select name="territory" defaultValue={territory}>{territories.map(item=><option key={item.code} value={item.code}>{item.name}</option>)}</select></label>
        <label><span>Cargo</span><select name="office" defaultValue={office}><option value="">Todos os cargos</option>{selected?.offices.map(item=><option key={item.key} value={item.key}>{item.name}</option>)}</select></label>
        <label><span>Composição</span><select name="mode" defaultValue={mode}><option value="FUTURE_COMPOSITION">Composição futura</option><option value="CURRENT">Composição atual</option></select></label>
        <label className="representative-search"><span>Buscar por nome</span><RepresentativeAutocomplete defaultValue={params.query||""} territory={territory} office={office} mode={mode}/></label>
        <button type="submit">Aplicar filtros</button>
      </form>
      <div className="representatives-context"><div><b>{mode==="CURRENT"?"Composição atual":"Composição futura"}</b><span>{page.compositionDate?`Referência: ${new Intl.DateTimeFormat("pt-BR").format(new Date(`${page.compositionDate}T12:00:00`))}`:"Data de referência indisponível"}</span></div><span>{selected?.name||territory}{office?` · ${officeName(office)}`:""}</span></div>
      {page.representatives.length?<div className="representatives-grid">{page.representatives.map(person=><Link className="representative-card" href={`/politicos/${person.id}?mode=${mode}`} key={person.id}>{person.imagem?<span className="representative-avatar" style={{backgroundImage:`url(${JSON.stringify(person.imagem)})`}} aria-hidden="true"/>:<span className="representative-avatar">{initials(person.nome)}</span>}<span className="representative-card-copy"><strong title={person.nome}>{person.nome}</strong><span>{person.partido}</span><small>{officeName(person.mandate?.office)}</small></span><ArrowRight size={18} aria-hidden="true"/></Link>)}</div>:<div className="empty-state"><h2>Nenhum político encontrado neste recorte</h2><p>Altere o estado, cargo ou nome pesquisado. Isso não significa ausência no cenário político.</p></div>}
      <nav className="pagination" aria-label="Paginação">{offset>0?<Link href={href(Math.max(0,offset-20))}><ArrowLeft size={16}/> Anterior</Link>:<span/>}{page.hasNext&&page.nextOffset!=null&&<Link href={href(page.nextOffset)}>Próxima página <ArrowRight size={16}/></Link>}</nav>
    </section>
  </PageShell>
}
