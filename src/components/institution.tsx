import { PageShell } from "./ui";
export function Institution({eyebrow,title,intro,children}:{eyebrow:string;title:string;intro:string;children:React.ReactNode}){return <PageShell><article className="wrap institution"><span className="kicker">{eyebrow}</span><h1>{title}</h1><p className="summary">{intro}</p>{children}</article></PageShell>}
