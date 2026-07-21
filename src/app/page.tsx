import Link from "next/link";
import { ArrowRight, BarChart3, Sparkles } from "lucide-react";
import { AppButton, Footer, Header, NewsCard, PoliticianCard, SectionTitle } from "@/components/ui";
import { getNews, getTrending } from "@/lib/data";

export default async function Home(){
  const [news,trending]=await Promise.all([getNews(),getTrending()]);
  const main=news[0];
  return <><Header/><main>
    <section className="editorial-opening"><div className="wrap">
      <div className="editorial-intro"><div><span className="kicker"><Sparkles size={15}/> POLÍTICA EXPLICADA</span><h1>Notícias para entender<br/>o Brasil de agora.</h1></div><p>Informação organizada, contexto e explicações claras para você acompanhar a política sem depender de aplicativo.</p></div>
      {main&&<div className="front-page"><Link className="lead-story" href={`/noticias/${main.id}`}><div className="lead-image" style={main.image?{backgroundImage:`linear-gradient(0deg,rgba(4,10,16,.9),transparent 65%),url(${JSON.stringify(main.image)})`}:undefined}><span className="tag">{main.category}</span></div><div className="lead-copy"><small>{main.source} · {main.date}</small><h2>{main.title}</h2><p>{main.summary}</p><span className="read-link">Ler notícia completa <ArrowRight size={17}/></span></div></Link><div className="front-list"><div className="front-list-title">Últimas notícias <span>Atualizado agora</span></div>{news.slice(1,4).map(item=><Link href={`/noticias/${item.id}`} className="headline-row" key={item.id}><span>{item.category}</span><h3>{item.title}</h3><small>{item.source} · {item.date}</small></Link>)}</div></div>}
    </div></section>
    <section className="wrap section home-latest"><SectionTitle eyebrow="MAIS NOTÍCIAS" title="Continue informado" link="/noticias"/><div className="latest-grid">{news.slice(4,10).map(item=><NewsCard item={item} key={item.id}/>)}</div></section>
    <section className="trend-section"><div className="wrap two-col"><div><span className="kicker"><BarChart3 size={15}/> TERMÔMETRO POLÍTICO</span><h2 className="trend-heading">Quem movimenta o noticiário</h2><p className="lead">Um retrato das menções nas últimas 24 horas. Repercussão não significa aprovação.</p><Link className="text-button" href="/em-alta">Ver ranking completo <ArrowRight size={17}/></Link></div><div className="ranking">{trending.slice(0,3).map((p,i)=><PoliticianCard p={p} rank={i+1} key={p.id}/>)}</div></div></section>
    <section className="wrap android-note"><div><span className="kicker">TAMBÉM NO ANDROID</span><h2>Prefere acompanhar pelo celular?</h2><p>O site continua completo no iPhone e no computador. No Android, você também pode salvar notícias no aparelho e compartilhar artes.</p></div><AppButton small/></section>
  </main><Footer/></>
}
