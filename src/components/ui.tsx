import Link from "next/link";
import { ArrowRight, Bolt, Newspaper, Search, ShieldCheck, Sparkles, TrendingUp, Users } from "lucide-react";
import type { Politician } from "@/lib/data";
import { getPlayStoreUrl } from "@/lib/play-store";
import { formatPoliticianRole } from "@/lib/politician";
import { SiteNavigation } from "./site-navigation";
export { NewsCard } from "./news-card";

export function Logo(){return <Link className="logo" href="/" aria-label="Capivara — Política e informação">
  <svg className="logo-mark" viewBox="0 0 335 58" role="presentation" aria-hidden="true">
    <path fill="currentColor" d="M53 11C47 4 40 1 30 1 12 1 1 12 1 29s11 28 29 28c10 0 18-3 24-10l-9-8c-4 4-8 6-14 6-10 0-17-6-17-16s7-16 17-16c6 0 11 2 14 6l8-8Z"/>
    <path fill="currentColor" d="M54 57 77 2h8l24 55H96L81 20 67 57H54Z"/>
    <path fill="currentColor" fillRule="evenodd" d="M108 2h23c14 0 22 7 22 19s-8 19-22 19h-10v17h-13V2Zm13 11v16h10c6 0 9-3 9-8s-3-8-9-8h-10Z"/>
    <path fill="currentColor" d="M158 2h13v55h-13V2Zm17 0h14l14 38 14-38h14l-22 55h-12L175 2Z"/>
    <path fill="currentColor" d="m210 57 23-55h8l-23 55h-8Z"/>
    <path className="logo-accent" d="m235 13 20 44h-14l-13-29 7-15Z"/>
    <path fill="currentColor" fillRule="evenodd" d="M251 2h23c14 0 22 7 22 19 0 9-5 15-13 18l17 18h-16l-14-16h-6v16h-13V2Zm13 11v17h10c6 0 9-3 9-9 0-5-3-8-9-8h-10Z"/>
    <path fill="currentColor" d="m286 57 23-55h8l24 55h-13l-15-37-14 37h-13Z"/>
  </svg>
  <small>POLÍTICA E INFORMAÇÃO</small>
</Link>}
export function Header(){return <header className="site-header"><div className="nav wrap"><Logo/><SiteNavigation/></div></header>}
const playStoreUrl=getPlayStoreUrl(process.env.NEXT_PUBLIC_PLAY_STORE_URL);
export function Footer(){return <footer><div className="wrap footer-grid"><div><Logo/><p>Política explicada sem complicação.</p><a className="footer-app-link" href={playStoreUrl} target="_blank" rel="noopener noreferrer">Também disponível para Android <ArrowRight size={14}/></a></div><div><b>Conteúdo</b><Link href="/noticias">Notícias</Link><Link href="/politicos">Políticos</Link><Link href="/capivara">Capivara · Como votou</Link><Link href="/em-alta">Em alta</Link></div><div><b>Transparência</b><Link href="/politica-editorial">Política editorial</Link><Link href="/uso-de-ia">Uso de IA</Link><Link href="/politica-de-privacidade">Privacidade</Link><Link href="/contato">Contato</Link></div></div><div className="wrap copyright">© 2026 Capivara. Informação para entender, não para confundir.</div></footer>}
export function AppButton({small=false}:{small?:boolean}){return <a className={`button ${small?'small':''}`} href={playStoreUrl} target="_blank" rel="noopener noreferrer">{small?"Ver app para Android":"Baixar para Android"}<ArrowRight size={17}/></a>}
export function PageShell({children}:{children:React.ReactNode}){return <><Header/><main>{children}</main><Footer/></>}
export function Avatar({p}:{p:Politician}){return p.image?<span className="avatar photo" style={{backgroundImage:`url(${JSON.stringify(p.image)})`}}/>:<span className={`avatar a-${p.id}`}>{p.initials}</span>}
export function PoliticianCard({p,rank}:{p:Politician;rank?:number}){return <Link href={`/politicos/${p.id}`} className="politician-card">{rank&&<strong className="rank">0{rank}</strong>}<Avatar p={p}/><div className="politician-info"><h3>{p.name}</h3><p><span className="party">{p.party}</span>{p.number&&<span className="politician-number">{p.number}</span>}</p><small>{formatPoliticianRole(p.role)}</small></div>{p.growth&&<strong className="growth"><TrendingUp size={16}/> {p.growth}%</strong>}<span className="card-arrow" aria-hidden="true"><ArrowRight size={17}/></span></Link>}
export function SectionTitle({eyebrow,title,link}:{eyebrow?:string;title:string;link?:string}){return <div className="section-title"><div>{eyebrow&&<span>{eyebrow}</span>}<h2>{title}</h2></div>{link&&<Link href={link}>Ver tudo <ArrowRight size={16}/></Link>}</div>}
export const featureIcons=[Sparkles,ShieldCheck,Bolt,Users,Newspaper,Search];
