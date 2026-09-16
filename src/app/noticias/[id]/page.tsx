import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft,ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import { ArticleContent } from "@/components/article-content";
import { NewsQuestionPanel } from "@/components/news-question-panel";
import { PageShell } from "@/components/ui";
import { getNewsById } from "@/lib/data";

export async function generateMetadata({params}:{params:Promise<{id:string}>}):Promise<Metadata>{const {id}=await params;const news=await getNewsById(id);return{title:news.title,description:news.summary,openGraph:{title:news.title,description:news.summary,images:news.image?[news.image]:[]}}}

export default async function Detail({params}:{params:Promise<{id:string}>}){
  const {id}=await params;if(!id)notFound();const news=await getNewsById(id);const paragraphs=news.content?.split(/\r?\n+/).map(paragraph=>paragraph.trim()).filter(Boolean)??[];const feedId=Number(id);
  return <PageShell><article><div className="wrap detail-hero"><Link className="article-back" href="/noticias"><ArrowLeft size={16}/> Todas as notícias</Link><div className="detail-meta"><span className="tag">{news.category}</span><span>{news.source} · {news.date}</span></div><h1>{news.title}</h1><p className="detail-subtitle">{news.summary}</p>{news.image&&<div className="detail-image" style={{backgroundImage:`url(${JSON.stringify(news.image)})`}}/>}</div><div className="wrap article">{paragraphs.length>0&&<section className="article-content"><h2>A notícia</h2><ArticleContent paragraphs={paragraphs}/>{news.sourceUrl&&<a className="source-link" href={news.sourceUrl} target="_blank" rel="noopener noreferrer">Ler publicação original em {news.source} <ExternalLink size={14}/></a>}</section>}<section className="capivara-explains"><div className="explain-heading"><small>CAPIVARA EXPLICA ✨</small><h2>Os principais pontos, sem complicação</h2>{news.summaryAI&&<p>{news.summaryAI}</p>}</div>{news.explain?.length?<div className="explain-list">{news.explain.map((item,index)=><div className="explain-item" key={`${item.position}-${item.title}`}><span>{index+1}</span><div><h3>{item.title}</h3><p>{item.description}</p></div></div>)}</div>:<div className="explain"><h3>O que aconteceu</h3><p>{news.summaryAI||news.summary}</p></div>}</section><nav className="article-next"><div><small>CONTINUE NO CAPIVARA WEB</small><h2>Mais notícias, mais contexto.</h2><p>Acompanhe as últimas atualizações diretamente pelo navegador, em qualquer dispositivo.</p></div><Link className="button" href="/noticias">Ver últimas notícias</Link></nav></div></article>{Number.isInteger(feedId)&&feedId>0&&<NewsQuestionPanel feedId={feedId}/>}</PageShell>
}
