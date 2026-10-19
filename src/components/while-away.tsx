"use client";
import Link from "next/link";
import { ArrowRight,Clock } from "lucide-react";
import { useEffect,useState } from "react";
import type { News } from "@/lib/data";
const KEY="capivara-news-last-visit";
export function WhileAway({news}:{news:News[]}){const[items,setItems]=useState<News[]>([]);useEffect(()=>{const now=new Date().toISOString();const previous=localStorage.getItem(KEY);if(previous){const time=Date.parse(previous);if(Number.isFinite(time))setItems(news.filter(item=>item.publishedAt&&Date.parse(item.publishedAt)>time).slice(0,6))}localStorage.setItem(KEY,now)},[news]);if(!items.length)return null;return <section className="while-away" aria-labelledby="while-away-title"><div className="while-away-heading"><span><Clock size={15}/> DESDE SUA ÚLTIMA VISITA</span><h2 id="while-away-title">Enquanto você esteve fora</h2></div><div className="while-away-list">{items.map(item=><Link href={`/noticias/${item.id}`} key={item.id}><span>{item.category}</span><h3>{item.title}</h3><small>{item.source} · {item.date}</small><b>Ver notícia <ArrowRight size={14}/></b></Link>)}</div></section>}
