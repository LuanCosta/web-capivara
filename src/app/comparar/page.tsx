import { PageShell } from "@/components/ui";
import { ProposalComparison } from "@/components/proposal-comparison";
import { getPoliticians } from "@/lib/data";

export const metadata={title:"Comparar propostas",description:"Compare a distribuição temática das propostas de pré-candidatos à Presidência com contexto e neutralidade."};
const isPresidential=(role:string)=>/president|presid[eê]ncia|pr[eé]-candidat.*presid/i.test(role);
export default async function Comparar(){const candidates=(await getPoliticians()).filter(candidate=>isPresidential(candidate.role)&&/^\d+$/.test(candidate.id));return <PageShell><section className="compare-hero"><div className="wrap"><span className="kicker">COMPARADOR DE PROPOSTAS</span><h1>Compare temas.<br/><em>Entenda o contexto.</em></h1><p>Veja como os assuntos aparecem nos planos disponíveis e aprofunde cada tema com perguntas guiadas por IA.</p></div></section><section className="wrap compare-section"><ProposalComparison candidates={candidates}/></section></PageShell>}
