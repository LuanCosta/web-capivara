import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft,ArrowRight,ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import { ArticleContent } from "@/components/article-content";
import { NewsQuestionPanel } from "@/components/news-question-panel";
import { SafeAvatar } from "@/components/safe-avatar";
import { PageShell } from "@/components/ui";
import { getNewsById } from "@/lib/data";

const base=(process.env.NEXT_PUBLIC_SITE_URL||"https://usecapivara.com.br").replace(/\/$/,"");
const isoDate=(value?:string)=>{if(!value)return undefined;const parsed=new Date(value);return Number.isNaN(parsed.valueOf())?undefined:parsed.toISOString()};

export async function generateMetadata({params}:{params:Promise<{id:string}>}):Promise<Metadata>{
  const {id}=await params;
  try{
    const news=await getNewsById(id);const canonical=`/noticias/${encodeURIComponent(id)}`;const publishedTime=isoDate(news.publishedAt);
    return {title:news.title,description:news.summary,alternates:{canonical},openGraph:{type:"article",url:canonical,title:news.title,description:news.summary,publishedTime,images:news.image?[{url:news.image,alt:news.title}]:[]},twitter:{card:"summary_large_image",title:news.title,description:news.summary,images:news.image?[news.image]:[]}};
  }catch{return{title:"Notícia não encontrada",robots:{index:false,follow:false}}}
}

export default async function Detail({params}:{params:Promise<{id:string}>}){
  const {id}=await params;if(!id)notFound();const news=await getNewsById(id).catch(()=>notFound());const feedId=Number(id);const validFeedId=Number.isInteger(feedId)&&feedId>0;
  const canonical=`${base}/noticias/${encodeURIComponent(id)}`;const publishedTime=isoDate(news.publishedAt);
  const structuredData={"@context":"https://schema.org","@type":"NewsArticle",headline:news.title,description:news.summary,url:canonical,mainEntityOfPage:{"@type":"WebPage","@id":canonical},inLanguage:"pt-BR",articleSection:news.category,author:{"@type":"Organization",name:news.source},publisher:{"@type":"Organization",name:"Capivara",url:base},...(news.image?{image:[news.image]}:{}),...(publishedTime?{datePublished:publishedTime,dateModified:publishedTime}:{}),...(news.sourceUrl?{isBasedOn:news.sourceUrl}:{})};
  return <PageShell><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structuredData).replace(/</g,"\\u003c")}}/><article>
    <div className="wrap detail-hero">
      <Link className="article-back" href="/noticias"><ArrowLeft size={16}/> Todas as notícias</Link>
      <div className="detail-meta"><span className="tag">{news.category}</span><span>{news.source} · {news.date}</span></div>
      <h1>{news.title}</h1><p className="detail-subtitle">{news.summary}</p>
      {news.image&&<div className="detail-image" style={{backgroundImage:`url(${JSON.stringify(news.image)})`}}/>}
      {Boolean(news.mentionedPoliticians?.length)&&<section className="mentioned-politicians" aria-labelledby="mentioned-politicians-title">
        <div className="mentioned-politicians-heading"><span>PERFIS RELACIONADOS</span><h2 id="mentioned-politicians-title">Políticos mencionados</h2></div>
        <div className="mentioned-politicians-list">{news.mentionedPoliticians!.map(politician=><Link href={`/politicos/${politician.id}`} className="mentioned-politician" key={politician.id}>
          <SafeAvatar src={politician.image} initials={politician.initials} className="mentioned-politician-avatar"/>
          <span className="mentioned-politician-copy"><strong>{politician.name}</strong><span><b>{politician.party}</b></span>{politician.role&&<small>{politician.role}</small>}</span>
          <span className="mentioned-politician-arrow" aria-hidden="true"><ArrowRight size={16}/></span>
        </Link>)}</div>
      </section>}
    </div>
    <div className="wrap article">
      {news.content&&<section className="article-content"><h2>A notícia</h2><ArticleContent content={news.content}/>{news.sourceUrl&&<a className="source-link" href={news.sourceUrl} target="_blank" rel="noopener noreferrer">Ler publicação original em {news.source} <ExternalLink size={14}/></a>}</section>}
      <section className="capivara-explains"><div className="explain-heading"><small>CAPIVARA EXPLICA ✨</small><h2>Os principais pontos, sem complicação</h2>{news.summaryAI&&<p>{news.summaryAI}</p>}</div>{news.explain?.length?<div className="explain-list">{news.explain.map((item,index)=><div className="explain-item" key={`${item.position}-${item.title}`}><span>{index+1}</span><div><h3>{item.title}</h3><p>{item.description}</p></div></div>)}</div>:<div className="explain"><h3>O que aconteceu</h3><p>{news.summaryAI||news.summary}</p></div>}</section>
      <nav className="article-next"><div><small>CONTINUE NO CAPIVARA WEB</small><h2>Mais notícias, mais contexto.</h2><p>Acompanhe as últimas atualizações diretamente pelo navegador, em qualquer dispositivo.</p></div><Link className="button" href="/noticias">Ver últimas notícias</Link></nav>
    </div>
  </article>{validFeedId&&<NewsQuestionPanel feedId={feedId}/>}</PageShell>
}
