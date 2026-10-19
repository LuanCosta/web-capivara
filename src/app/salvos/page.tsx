import { PageShell } from "@/components/ui";
import { SavedNews } from "@/components/saved-news";
export const metadata={title:"Notícias salvas",description:"Notícias salvas localmente neste navegador."};
export default function Salvos(){return <PageShell><section className="wrap page-hero"><span className="kicker">NO SEU NAVEGADOR</span><h1>Notícias salvas</h1><p>Esta lista fica armazenada localmente e não exige cadastro.</p></section><section className="wrap saved-page"><SavedNews/></section></PageShell>}
