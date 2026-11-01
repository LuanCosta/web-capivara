"use client";

import Link from "next/link";
import { ArrowRight, Clock, Landmark, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { News, NewsPage } from "@/lib/data";
import { NewsCard, SectionTitle } from "@/components/ui";

export function HomeNews({initialNews,summary}:{initialNews:News[];summary:ReactNode}){
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
  const radar=useMemo(()=>{
    const groups=new Map<string,{count:number;item:News}>();
    for(const item of news){const current=groups.get(item.category);groups.set(item.category,{count:(current?.count??0)+1,item:current?.item??item})}
    return [...groups.entries()].sort((a,b)=>b[1].count-a[1].count).slice(0,5);
  },[news]);
  return <>
    <section className="home-editorial-hero"><div className="wrap home-editorial-hero-grid">
      <div className="home-editorial-copy"><span className="kicker"><Sparkles size={15}/> POLÍTICA, COM CONTEXTO</span><h1>Entenda o Brasil.<br/>Forme sua opinião.</h1><p>Notícias, pessoas e decisões públicas organizadas com contexto para você acompanhar a política com menos ruído.</p><Link href="/noticias">Acompanhar as notícias <ArrowRight size={18}/></Link></div>
      {main&&<Link aria-label={`Abrir notícia em destaque: ${main.title}`} className={`home-editorial-photo ${main.image?"has-image":"is-placeholder"}`} href={`/noticias/${main.id}`} style={main.image?{backgroundImage:`url(${JSON.stringify(main.image)})`}:undefined}><span>NOTÍCIA EM DESTAQUE</span><small>{main.source} · {main.date}</small></Link>}
    </div></section>
    {summary}
    {main&&<section className="wrap home-news-desk">
      <header><span className="kicker">AGORA NO CAPIVARA</span><h2>Informação para acompanhar o dia.</h2></header>
      <div className="home-news-desk-grid">
        <section className="home-desk-latest"><div className="home-desk-title">Últimas notícias</div>{news.slice(1,5).map(item=><Link href={`/noticias/${item.id}`} key={item.id}><small>{item.date}</small><span><strong>{item.title}</strong><em>{item.summary}</em></span></Link>)}<Link className="home-desk-all" href="/noticias">Ver todas as notícias <ArrowRight size={15}/></Link></section>
        <article className="home-desk-feature"><Link href={`/noticias/${main.id}`}><div className={`home-desk-image ${main.image?"has-image":"is-placeholder"}`} style={main.image?{backgroundImage:`url(${JSON.stringify(main.image)})`}:undefined}/><div className="home-desk-meta"><span>{main.category}</span><small><Clock size={13}/> {main.date}</small></div><h2>{main.title}</h2><p>{main.summary}</p><b>Ler matéria completa <ArrowRight size={16}/></b></Link></article>
        <aside className="home-desk-radar"><div className="home-desk-title">No radar</div>{radar.map(([category,data],index)=><Link href={`/noticias/${data.item.id}`} key={category}><b>{String(index+1).padStart(2,"0")}</b><span><strong>{category}</strong><small>{data.count} {data.count===1?"notícia":"notícias"} no recorte atual</small></span><ArrowRight size={17}/></Link>)}<Link className="home-vote-cta" href="/capivara"><Landmark size={24}/><span><strong>Como seus representantes votaram?</strong><small>Consulte decisões registradas nas fontes oficiais.</small></span><ArrowRight size={18}/></Link></aside>
      </div>
    </section>}
    <section className="wrap section home-latest"><SectionTitle eyebrow="MAIS NOTÍCIAS" title="Continue informado" link="/noticias"/><div className="latest-grid">{news.slice(4,10).map(item=><NewsCard item={item} key={item.id}/>)}</div></section>
  </>;
}
