import Link from "next/link";
import { ArrowRight, Clock, ExternalLink, RefreshCw, TrendingUp } from "lucide-react";
import { PageShell } from "@/components/ui";
import { discoveryDate, getTrendingDiscovery, type DiscoveryNews } from "@/lib/trending-discovery";

export const metadata = {
  title: "Em alta",
  description: "Temas e políticos presentes nas notícias monitoradas nas últimas 24 horas.",
};

function NewsList({ items }: { items: DiscoveryNews[] }) {
  return (
    <div className="discovery-news">
      {items.map((news) => (
        <a href={news.link} target="_blank" rel="noopener noreferrer" key={news.id}>
          <strong>{news.title}</strong>
          <span>{news.source} · {discoveryDate(news.publishedAt)}</span>
          <ExternalLink size={14} />
        </a>
      ))}
    </div>
  );
}

function RadarHero({ windowHours, calculatedAt, stale }: { windowHours?: number; calculatedAt?: string; stale?: boolean }) {
  return (
    <section className="wrap trending-radar-hero">
      <div className="trending-radar-copy">
        <span className="kicker"><TrendingUp size={15} /> RADAR POLÍTICO</span>
        <h1>O que move<br />o debate.</h1>
        <p>Temas, pessoas e acontecimentos mais presentes no noticiário brasileiro monitorado.</p>
        <div className="trending-caution">Presença no noticiário não significa aprovação, intenção de voto ou recomendação.</div>
      </div>
      <aside className={`trending-radar-window ${calculatedAt ? "is-live" : "is-waiting"}`}>
        <span>{calculatedAt ? "JANELA MONITORADA" : "STATUS DO RADAR"}</span>
        {calculatedAt ? <><strong>{windowHours} horas</strong><p><Clock size={14} /> Atualizado em {discoveryDate(calculatedAt)}{stale ? " · atualização atrasada" : ""}</p></> : <><strong>Aguardando dados</strong><p><RefreshCw size={14} /> A consulta será retomada quando o serviço responder.</p></>}
        <div className="trending-radar-skyline" aria-hidden="true"><i/><i/><i/><i/><i/></div>
      </aside>
    </section>
  );
}

export default async function EmAlta() {
  let data;
  try {
    data = await getTrendingDiscovery();
  } catch {
    return (
      <PageShell>
        <main className="trending-radar-page">
          <RadarHero />
          <section className="wrap trending-service-state">
            <div>
              <span>CONSULTA TEMPORARIAMENTE INDISPONÍVEL</span>
              <h2>O radar está sendo atualizado.</h2>
              <p>Não foi possível consultar as notícias monitoradas agora. Recarregue manualmente em alguns instantes.</p>
              <small>Não exibimos tendências antigas ou fictícias como se fossem atuais.</small>
            </div>
            <aside>
              <span>O QUE APARECE AQUI</span>
              <ol>
                <li><b>01</b><p><strong>Assuntos em destaque</strong>Temas com mais notícias no período monitorado.</p></li>
                <li><b>02</b><p><strong>Pessoas no noticiário</strong>Políticos mais mencionados, sem inferência de popularidade.</p></li>
                <li><b>03</b><p><strong>Fontes relacionadas</strong>As notícias que ajudam a formar cada posição do radar.</p></li>
              </ol>
            </aside>
          </section>
        </main>
      </PageShell>
    );
  }

  const maxTopic = Math.max(1, ...data.topics.map((topic) => topic.mentions24h));
  const maxPerson = Math.max(1, ...data.politicians.map((person) => person.mentions24h));
  const featured = data.topics[0];

  return (
    <PageShell>
      <main className="trending-radar-page">
        <RadarHero windowHours={data.windowHours} calculatedAt={data.calculatedAt} stale={data.stale} />

        <section className="wrap trending-topic-board">
          <div className="trending-topic-ranking">
            <header><span>ASSUNTOS EM DESTAQUE</span><h2>O radar das últimas horas</h2><p>Número de notícias monitoradas relacionadas a cada assunto.</p></header>
            {data.topics.length ? <div className="trending-bars">{data.topics.map((topic, index) => <div className="trending-bar" key={topic.key}><b>{index + 1}</b><strong>{topic.title}</strong><i><span style={{ width: `${Math.max(8, topic.mentions24h / maxTopic * 100)}%` }} /></i><em>{topic.mentions24h} {topic.mentions24h === 1 ? "notícia" : "notícias"}</em></div>)}</div> : <div className="empty-state"><h3>Nenhum assunto disponível</h3><p>O serviço não retornou temas para este período.</p></div>}
          </div>
          {featured && <aside className="trending-featured-topic"><span>TEMA MAIS PRESENTE</span><h2>{featured.title}</h2><p>{featured.mentions24h} {featured.mentions24h === 1 ? "notícia monitorada" : "notícias monitoradas"} nas últimas {data.windowHours} horas.</p><NewsList items={featured.news.slice(0, 3)} /><Link href="/noticias">Explorar notícias <ArrowRight size={18} /></Link></aside>}
        </section>

        <section className="wrap trending-people">
          <header><div><span>PESSOAS NO NOTICIÁRIO</span><h2>Políticos mais mencionados</h2><p>Contagem dentro do período monitorado, sem inferência de popularidade.</p></div><small>DADOS DAS ÚLTIMAS {data.windowHours} HORAS</small></header>
          {data.politicians.length ? <div className="trending-people-table">{data.politicians.map((person, index) => <article key={person.candidateId}><b>{String(index + 1).padStart(2, "0")}</b>{person.imagem ? <span className="trending-person-avatar" style={{ backgroundImage: `url(${JSON.stringify(person.imagem)})` }} /> : <span className="trending-person-avatar">{person.nome.split(/\s+/).slice(0, 2).map((part) => part[0]).join("")}</span>}<div className="trending-person-name"><strong>{person.nome}</strong><small>{person.partido}</small></div><div className="trending-person-count"><strong>{person.mentions24h}</strong><span>notícias</span></div><i><span style={{ width: `${Math.max(8, person.mentions24h / maxPerson * 100)}%` }} /></i><Link href={`/politicos/${person.candidateId}`} aria-label={`Abrir perfil de ${person.nome}`}><ArrowRight size={18} /></Link>{person.news.length > 0 && <details><summary>Ver notícias relacionadas</summary><NewsList items={person.news} /></details>}</article>)}</div> : <div className="empty-state"><h3>Nenhum político disponível</h3><p>O serviço não retornou pessoas mencionadas para este período.</p></div>}
        </section>

        {data.topics.length > 1 && <section className="wrap trending-sources"><header><span>LEITURA POR ASSUNTO</span><h2>Notícias que formam este radar</h2></header><div className="topic-grid">{data.topics.slice(1).map((topic) => <details className="discovery-card" key={topic.key}><summary><span><strong>{topic.title}</strong><small>{topic.mentions24h} notícias nas últimas {data.windowHours}h</small></span><TrendingUp size={19} /></summary><NewsList items={topic.news} /></details>)}</div></section>}
      </main>
    </PageShell>
  );
}
