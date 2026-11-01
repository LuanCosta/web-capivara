import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Search, Vote } from "lucide-react";
import { PageShell } from "@/components/ui";
import { getVoters } from "@/lib/representatives";

export const metadata = {
  title: "Capivara — Como votou",
  description: "Escolha um político e consulte votos individuais registrados em propostas e decisões públicas.",
};

type Params = { party?: string; offset?: string };

const initials = (name: string) =>
  name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();

export default async function Capivara({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams;
  const offset = Math.max(0, Number(params.offset) || 0);
  let page;

  try {
    page = await getVoters({ party: params.party, offset, limit: 20 });
  } catch {
    page = {
      coverage: "Os dados de votação estão temporariamente indisponíveis.",
      items: [], total: 0, offset, limit: 20, hasNext: false, nextOffset: null, parties: [],
    };
  }

  const href = (nextOffset: number) => {
    const query = new URLSearchParams();
    if (params.party) query.set("party", params.party);
    query.set("offset", String(nextOffset));
    return `/capivara?${query}`;
  };

  return (
    <PageShell>
      <main className="capivara-vote-page">
        <section className="wrap capivara-vote-hero">
          <div className="capivara-vote-intro">
            <span className="kicker"><Vote size={15} /> DECISÕES PÚBLICAS</span>
            <h1>O voto revela<br />a decisão.</h1>
            <p>Escolha um político e confira como ele votou nas propostas acompanhadas pelo Capivara, sempre com acesso à fonte oficial.</p>
            <small>Um voto específico não resume toda a atuação, opinião ou carreira de uma pessoa.</small>
          </div>

          <aside className="capivara-vote-guide" aria-label="Como consultar uma votação">
            <span>COMO CONSULTAR</span>
            <h2>Da pessoa à decisão, sem complicação.</h2>
            <ol>
              <li><b>01</b><span><strong>Escolha o político</strong><small>Encontre um representante com registros disponíveis.</small></span></li>
              <li><b>02</b><span><strong>Pesquise a proposta</strong><small>Filtre por tema, identificação ou posição registrada.</small></span></li>
              <li><b>03</b><span><strong>Confira cada voto</strong><small>Leia o contexto e consulte a publicação oficial.</small></span></li>
            </ol>
          </aside>
        </section>

        <section className="wrap capivara-vote-directory">
          <header className="capivara-vote-directory-head">
            <div>
              <span>VOTAÇÕES NOMINAIS</span>
              <h2>Quem você quer consultar?</h2>
              <p>Selecione um nome para abrir as propostas e decisões disponíveis.</p>
            </div>
            <strong>{page.total} {page.total === 1 ? "político encontrado" : "políticos encontrados"}</strong>
          </header>

          <div className="capivara-vote-toolbar">
            <form className="capivara-filter">
              <label>
                <span>Filtrar por partido</span>
                <select name="party" defaultValue={params.party || ""}>
                  <option value="">Todos os partidos</option>
                  {page.parties.map((party) => <option value={party} key={party}>{party}</option>)}
                </select>
              </label>
              <button type="submit"><Search size={16} /> Aplicar filtro</button>
            </form>
            <p className="coverage-note">{page.coverage}</p>
          </div>

          {page.items.length ? (
            <div className="voter-grid capivara-voter-grid">
              {page.items.map((person, index) => (
                <Link href={`/politicos/${person.candidateId}/votacoes`} className="voter-card capivara-voter-card" key={person.candidateId}>
                  <small className="capivara-voter-index">{String(offset + index + 1).padStart(2, "0")}</small>
                  {person.imageUrl ? (
                    <span className="voter-avatar" style={{ backgroundImage: `url(${JSON.stringify(person.imageUrl)})` }} />
                  ) : (
                    <span className="voter-avatar">{initials(person.name)}</span>
                  )}
                  <span className="capivara-voter-copy">
                    <b>{person.party || "Partido não informado"}</b>
                    <strong>{person.name}</strong>
                    <small>{person.voteCount} {person.voteCount === 1 ? "voto registrado" : "votos registrados"}</small>
                  </span>
                  <span className="capivara-voter-open">Ver decisões <ArrowUpRight size={16} /></span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-state capivara-vote-empty">
              <Vote size={26} />
              <h2>Nenhum político disponível neste recorte</h2>
              <p>Isso não comprova ausência de atuação. Tente novamente ou altere o filtro.</p>
            </div>
          )}

          <nav className="pagination capivara-vote-pagination" aria-label="Paginação">
            {offset > 0 ? <Link href={href(Math.max(0, offset - 20))}><ArrowLeft size={16} /> Anterior</Link> : <span />}
            {page.hasNext && page.nextOffset != null && <Link href={href(page.nextOffset)}>Próxima página <ArrowRight size={16} /></Link>}
          </nav>
        </section>
      </main>
    </PageShell>
  );
}
