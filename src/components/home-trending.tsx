"use client";

import Link from "next/link";
import { ArrowRight, BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";
import type { Politician } from "@/lib/data";
import { PoliticianCard } from "@/components/ui";

export function HomeTrending({initialTrending}:{initialTrending:Politician[]}){
  const [trending,setTrending]=useState(initialTrending);
  useEffect(()=>{
    const controller=new AbortController();
    fetch("/api/trending",{signal:controller.signal,headers:{accept:"application/json"}})
      .then(async response=>response.ok?response.json() as Promise<Politician[]>:Promise.reject(new Error(`Trending ${response.status}`)))
      .then(items=>{if(items.length)setTrending(items)})
      .catch(error=>{if(error?.name!=="AbortError")console.error("[home-trending] Não foi possível atualizar o ranking.",error)});
    return()=>controller.abort();
  },[]);
  return <section className="trend-section"><div className="wrap two-col"><div><span className="kicker"><BarChart3 size={15}/> TERMÔMETRO POLÍTICO</span><h2 className="trend-heading">Quem movimenta o noticiário</h2><p className="lead">Um retrato das menções nas últimas 24 horas. Repercussão não significa aprovação.</p><Link className="text-button" href="/em-alta">Ver ranking completo <ArrowRight size={17}/></Link></div><div className="ranking">{trending.slice(0,3).map((p,i)=><PoliticianCard p={p} rank={i+1} key={p.id}/>)}</div></div></section>;
}
