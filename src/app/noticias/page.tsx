import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft,ArrowRight,Clock } from "lucide-react";
import { notFound } from "next/navigation";
import { getNewsPage } from "@/lib/data";
import { PageShell } from "@/components/ui";
import { NewsFilter } from "@/components/news-filter";
import { WhileAway } from "@/components/while-away";

export const revalidate=300;

const validCursor=(cursor:string|null)=>cursor===null||(cursor.length<=512&&/^[A-Za-z0-9_-]+={0,2}$/.test(cursor));

export async function generateMetadata({searchParams}:{searchParams:Promise<{cursor?:string}>}):Promise<Metadata>{
  const cursor=(await searchParams).cursor??null;
  const canonical=cursor?`/noticias?cursor=${encodeURIComponent(cursor)}`:"/noticias";
  return {title:"Notícias",description:"Notícias políticas recentes, organizadas e explicadas pelo Capivara.",alternates:{canonical}};
}

export default async function Noticias({searchParams}:{searchParams:Promise<{cursor?:string}>}){
  const cursor=(await searchParams).cursor??null;if(!validCursor(cursor))notFound();
  const page=await getNewsPage(cursor,10);
  const nextHref=page.nextCursor?`/noticias?cursor=${encodeURIComponent(page.nextCursor)}`:null;
  const lead=page.items[0];const radar=page.items.slice(1,4);
  return <PageShell><section className="wrap news-editorial-heading"><span className="kicker">NOTÍCIAS · ANÁLISES · CONTEXTO</span><h1>Entenda antes de opinar.</h1><p>Informação organizada para você acompanhar a política brasileira com mais contexto e menos ruído.</p></section>{lead&&<section className="wrap news-showcase"><Link href={`/noticias/${lead.id}`} className="news-showcase-lead"><div className={`news-showcase-image ${lead.image?"has-image":"is-placeholder"}`} style={lead.image?{backgroundImage:`url(${JSON.stringify(lead.image)})`}:undefined}><span>{lead.category}</span></div><div className="news-showcase-copy"><div><small><Clock size={14}/> {lead.date}</small><span>{lead.source}</span></div><h2>{lead.title}</h2><p>{lead.summary}</p><b>Ler matéria completa <ArrowRight size={17}/></b></div></Link><aside className="news-showcase-radar"><header><span>ENQUANTO VOCÊ ESTEVE FORA</span><h2>Agora no radar</h2><p>O que movimenta o noticiário político.</p></header>{radar.map((item,index)=><Link href={`/noticias/${item.id}`} key={item.id}><b>{String(index+1).padStart(2,"0")}</b><span><small>{item.category} · {item.date}</small><strong>{item.title}</strong><em>{item.summary}</em></span><ArrowRight size={19}/></Link>)}</aside></section>}<div className="wrap"><WhileAway news={page.items}/></div><section className="wrap news-archive"><header><span className="kicker">ARQUIVO RECENTE</span><h2>Todas as notícias</h2><p>Busque por assunto ou filtre a cobertura por categoria.</p></header><NewsFilter initialPage={page} initialCursor={cursor}/><nav className="news-pagination" aria-label="Paginação de notícias">{cursor&&<Link href="/noticias"><ArrowLeft size={16}/> Notícias mais recentes</Link>}{nextHref&&<Link href={nextHref}>Próxima página <ArrowRight size={16}/></Link>}</nav></section></PageShell>;
}
