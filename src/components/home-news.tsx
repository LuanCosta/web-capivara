"use client";

import Link from "next/link";
import { ArrowRight, GitCompareArrows, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import type { News, NewsPage } from "@/lib/data";
import { NewsCard, SectionTitle } from "@/components/ui";

export function HomeNews({initialNews}:{initialNews:News[]}){
  const [news,setNews]=useState(initialNews);

  useEffect(()=>{
    const controller=new AbortController();
    fetch("/api/feed",{cache:"no-store",signal:controller.signal,headers:{accept:"application/json"}})
      .then(async response=>response.ok?response.json() as Promise<NewsPage>:Promise.reject(new Error(`Feed ${response.status}`)))
      .then(page=>{if(!page.unavailable&&page.items.length)setNews(page.items)})
      .catch(error=>{if(error?.name!=="AbortError")console.error("[home-feed] Não foi possível atualizar as notícias.",error)});
    return()=>controller.abort();
  },[]);

  const main=news[0];
  return <>
    <section className="editorial-opening"><div className="wrap">
      <div className="editorial-intro"><div><span className="kicker"><Sparkles size={15}/> POLÍTICA EXPLICADA</span><h1>Notícias para entender<br/>o Brasil de agora.</h1></div><p>Informação organizada, contexto e explicações claras para você acompanhar a política sem depender de aplicativo.</p></div>
      {main&&<div className="front-page"><Link className="lead-story" href={`/noticias/${main.id}`}><div className="lead-image" style={main.image?{backgroundImage:`linear-gradient(0deg,rgba(4,10,16,.9),transparent 65%),url(${JSON.stringify(main.image)})`}:undefined}><span className="tag">{main.category}</span></div><div className="lead-copy"><small>{main.source} · {main.date}</small><h2>{main.title}</h2><p>{main.summary}</p><span className="read-link">Ler notícia completa <ArrowRight size={17}/></span></div></Link><div className="front-list"><div className="front-list-title">Últimas notícias <span>Atualizado agora</span></div>{news.slice(1,4).map(item=><Link href={`/noticias/${item.id}`} className="headline-row" key={item.id}><span>{item.category}</span><h3>{item.title}</h3><small>{item.source} · {item.date}</small></Link>)}</div></div>}
    </div></section>
    <section className="wrap home-compare"><div className="home-compare-icon"><GitCompareArrows size={27}/></div><div><span className="kicker">NOVO · PROPOSTAS COM IA</span><h2>Compare os planos dos candidatos</h2><p>Escolha dois pré-candidatos e veja como cada tema aparece nas propostas, com contexto e sem indicar vencedor.</p></div><Link className="home-compare-button" href="/comparar">Comparar propostas <ArrowRight size={18}/></Link></section>
    <section className="wrap section home-latest"><SectionTitle eyebrow="MAIS NOTÍCIAS" title="Continue informado" link="/noticias"/><div className="latest-grid">{news.slice(4,10).map(item=><NewsCard item={item} key={item.id}/>)}</div></section>
  </>;
}
