import Link from "next/link";
import type { News } from "@/lib/data";
import { FeedCardActions } from "./feed-card-actions";
import { InlineMarkdown } from "./article-content";

export function NewsCard({item,featured=false}:{item:News;featured?:boolean}){const feedId=Number(item.id);const validFeedId=Number.isInteger(feedId)&&feedId>0;return <article className={`news-card ${featured?"featured":""}`}><Link href={`/noticias/${item.id}`} className="news-card-link" aria-label={`Abrir notícia: ${item.title}`}><div className="news-image" style={item.image?{backgroundImage:`linear-gradient(0deg,rgba(7,16,24,.8),transparent),url(${JSON.stringify(item.image)})`}:undefined}/><div className="news-body"><span className="tag">{item.category}</span><h3>{item.title}</h3><div className="news-summary"><InlineMarkdown content={item.summary}/></div><small>{item.source} · {item.date}</small></div></Link>{validFeedId&&<FeedCardActions feedId={feedId} title={item.title}/>}</article>}
