import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getNewsPage } from "@/lib/data";
import { PageShell } from "@/components/ui";
import { NewsFilter } from "@/components/news-filter";
export const metadata={title:"Notícias",description:"Notícias políticas recentes, organizadas e explicadas pelo Capivara."};
export default async function Noticias(){const page=await getNewsPage(null,10);return <PageShell><section className="wrap page-hero news-page-hero"><span className="kicker">NOTÍCIAS</span><h1>Entenda antes de opinar.</h1><p>Os fatos mais importantes da política brasileira, com linguagem simples, conteúdo completo e contexto.</p></section><div className="wrap content-grid"><NewsFilter initialPage={page}/><aside className="side-card editorial-side"><span className="kicker">NOSSO COMPROMISSO</span><h3>Clareza antes da velocidade.</h3><p>Organizamos informações de fontes identificadas e usamos IA como apoio para explicar — nunca para esconder a origem.</p><Link href="/politica-editorial">Conheça nossa política editorial <ArrowRight size={15}/></Link><Link href="/uso-de-ia">Como usamos inteligência artificial <ArrowRight size={15}/></Link></aside></div></PageShell>}
