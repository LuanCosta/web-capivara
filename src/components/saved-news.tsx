"use client";
import Link from "next/link";
import { ArrowRight,Bookmark,X } from "lucide-react";
import { useEffect,useState } from "react";
type Saved={id:number;title:string;savedAt:string};
const KEY="capivara-saved-news";
export function SavedNews(){const[items,setItems]=useState<Saved[]|null>(null);useEffect(()=>{try{setItems(JSON.parse(localStorage.getItem(KEY)||"[]"))}catch{setItems([])}},[]);function remove(id:number){const next=(items||[]).filter(item=>item.id!==id);localStorage.setItem(KEY,JSON.stringify(next));setItems(next)}if(items===null)return <div className="saved-loading">Carregando notícias salvas…</div>;if(!items.length)return <div className="empty-state"><Bookmark size={28}/><h2>Nenhuma notícia salva</h2><p>Use o botão “Salvar” nos cards. Os itens ficam somente neste navegador.</p><Link className="button" href="/noticias">Ver notícias</Link></div>;return <div className="saved-list">{items.map(item=><article key={item.id}><Link href={`/noticias/${item.id}`}><span>NOTÍCIA SALVA</span><h2>{item.title}</h2><small>Salva em {new Intl.DateTimeFormat("pt-BR",{dateStyle:"medium"}).format(new Date(item.savedAt))}</small><b>Abrir notícia <ArrowRight size={15}/></b></Link><button type="button" onClick={()=>remove(item.id)} aria-label={`Remover ${item.title} dos salvos`}><X size={17}/></button></article>)}</div>}
