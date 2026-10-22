import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft,ArrowRight } from "lucide-react";
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
  return <PageShell><section className="wrap page-hero news-page-hero"><span className="kicker">NOTÍCIAS</span><h1>Entenda antes de opinar.</h1><p>Os fatos mais importantes da política brasileira, com linguagem simples, conteúdo completo e contexto.</p></section><div className="wrap"><WhileAway news={page.items}/></div><div className="wrap content-grid"><section className="news-index-column"><NewsFilter initialPage={page} initialCursor={cursor}/><nav className="news-pagination" aria-label="Paginação de notícias">{cursor&&<Link href="/noticias"><ArrowLeft size={16}/> Notícias mais recentes</Link>}{nextHref&&<Link href={nextHref}>Próxima página <ArrowRight size={16}/></Link>}</nav></section><aside className="side-card editorial-side"><span className="kicker">NOSSO COMPROMISSO</span><h3>Clareza antes da velocidade.</h3><p>Organizamos informações de fontes identificadas e usamos IA como apoio para explicar — nunca para esconder a origem.</p><Link href="/politica-editorial">Conheça nossa política editorial <ArrowRight size={15}/></Link><Link href="/uso-de-ia">Como usamos inteligência artificial <ArrowRight size={15}/></Link></aside></div></PageShell>;
}
