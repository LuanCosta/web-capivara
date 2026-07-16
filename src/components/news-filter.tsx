"use client";
import { useMemo, useState } from "react";
import type { News } from "@/lib/data";
import { NewsCard } from "./ui";
const options=["Todas","Política","Justiça","Economia","Segurança"];
const norm=(v:string)=>v.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
export function NewsFilter({news}:{news:News[]}){const [active,setActive]=useState("Todas");const visible=useMemo(()=>active==="Todas"?news:news.filter(n=>norm(n.category).includes(norm(active))),[active,news]);return <div className="filter-panel"><div className="filters" aria-label="Filtrar notícias por categoria">{options.map(o=><button type="button" className={`filter ${active===o?"active":""}`} onClick={()=>setActive(o)} aria-pressed={active===o} key={o}>{o}</button>)}</div><div className="list">{visible.map(n=><NewsCard item={n} key={n.id}/>)}{!visible.length&&<div className="empty-state"><h3>Nenhuma notícia nesta categoria.</h3><p>Tente selecionar outro assunto.</p></div>}</div></div>}
