"use client";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { Politician } from "@/lib/data";
import { PoliticianCard } from "./ui";
const options=["Todos","Presidência","Deputado federal","Senado"];
const norm=(v:string)=>v.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
export function PoliticianFilter({politicians}:{politicians:Politician[]}){const [query,setQuery]=useState("");const [active,setActive]=useState("Todos");const visible=useMemo(()=>politicians.filter(p=>norm(`${p.name} ${p.party}`).includes(norm(query))&&(active==="Todos"||norm(p.role).includes(norm(active)))),[politicians,query,active]);return <div className="filter-panel"><label className="searchbox"><Search size={20}/><span className="sr-only">Buscar político</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar por nome ou partido"/></label><div className="filters" aria-label="Filtrar políticos por cargo">{options.map(o=><button type="button" className={`filter ${active===o?"active":""}`} onClick={()=>setActive(o)} aria-pressed={active===o} key={o}>{o}</button>)}</div><div className="ranking-page">{visible.map(p=><PoliticianCard p={p} key={p.id}/>)}{!visible.length&&<div className="empty-state"><h3>Nenhum político encontrado.</h3><p>Revise a busca ou escolha outro filtro.</p></div>}</div></div>}
