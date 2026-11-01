import { ArrowUpRight, Mail, Newspaper } from "lucide-react";
import { PageShell } from "@/components/ui";

export const metadata = { title: "Contato" };

export default function Contato() {
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contato.capivaranews@gmail.com";
  const subject = "Sugestão de notícia para o Capivara";
  const body = [
    "Gostaria de sugerir essa notícia.",
    "",
    "Link da notícia:",
    "",
    "Por que ela merece atenção:",
    "",
    "Obrigado!",
    "Capivara",
  ].join("\n");
  const suggestionHref = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <PageShell>
      <main className="contact-page">
        <section className="wrap contact-hero">
          <div className="contact-intro">
            <span className="kicker"><Newspaper size={15} /> PARTICIPE</span>
            <h1>Ajude a construir o Capivara.</h1>
            <p>Encontrou uma notícia que merece atenção? Envie para a gente. Sua sugestão ajuda a ampliar o nosso radar editorial.</p>
            <small>As sugestões são avaliadas segundo a política editorial e não garantem publicação.</small>
          </div>

          <aside className="contact-suggestion-card">
            <span>SUGESTÃO DE NOTÍCIA</span>
            <h2>Compartilhe uma pauta com a gente.</h2>
            <div className="contact-email-template" aria-label="Conteúdo que será preenchido no e-mail">
              <small>ASSUNTO</small>
              <strong>{subject}</strong>
              <p>Gostaria de sugerir essa notícia.</p>
              <p><b>Link da notícia:</b><i>cole o link aqui</i></p>
              <p><b>Por que ela merece atenção:</b><i>conte para a gente</i></p>
              <p>Obrigado!<br />Capivara</p>
            </div>
            <a href={suggestionHref}><Mail size={17} /> Sugerir uma notícia <ArrowUpRight size={16} /></a>
            <small>O botão abre o aplicativo de e-mail configurado no seu aparelho.</small>
          </aside>
        </section>

        <section className="wrap contact-information">
          <article>
            <span>SUPORTE E CORREÇÕES</span>
            <h2>Encontrou um erro?</h2>
            <p>Para solicitar uma correção, envie o título ou link da notícia e explique objetivamente o que precisa ser revisto.</p>
            <a href={`mailto:${email}`}><Mail size={15} /> {email}</a>
          </article>
          <article>
            <span>ATENDIMENTO</span>
            <h2>Tempo de resposta</h2>
            <p>As mensagens são lidas em dias úteis. Solicitações que envolvam correção editorial são verificadas antes de qualquer alteração.</p>
          </article>
        </section>
      </main>
    </PageShell>
  );
}
