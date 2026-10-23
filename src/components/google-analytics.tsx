"use client";

import Link from "next/link";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Consent = "accepted" | "rejected";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const STORAGE_KEY = "capivara-analytics-consent";

function consentSettings(consent: Consent) {
  const permission = consent === "accepted" ? "granted" : "denied";
  return {
    ad_storage: permission,
    analytics_storage: permission,
    ad_user_data: permission,
    ad_personalization: permission,
  };
}

function pageContext(pathname: string) {
  if (pathname === "/") return { pageType: "home", contentGroup: "Início" };
  if (pathname === "/noticias") return { pageType: "news_listing", contentGroup: "Notícias" };
  if (pathname.startsWith("/noticias/")) return { pageType: "news_detail", contentGroup: "Notícias" };
  if (pathname === "/politicos") return { pageType: "politician_listing", contentGroup: "Políticos" };
  if (pathname === "/capivara") return { pageType: "voters_listing", contentGroup: "Capivara" };
  if (/^\/politicos\/[^/]+\/votacoes/.test(pathname)) return { pageType: "politician_votes", contentGroup: "Capivara" };
  if (pathname.startsWith("/propostas/")) return { pageType: "proposal_detail", contentGroup: "Capivara" };
  if (pathname.startsWith("/politicos/")) return { pageType: "politician_detail", contentGroup: "Políticos" };
  if (pathname === "/em-alta") return { pageType: "trending", contentGroup: "Em alta" };
  if (pathname === "/salvos") return { pageType: "saved_news", contentGroup: "Notícias" };
  return { pageType: "institutional", contentGroup: "Institucional" };
}

export function GoogleAnalytics({ measurementId, adsenseClient }: { measurementId: string; adsenseClient: string }) {
  const pathname = usePathname();
  const [consent, setConsent] = useState<Consent | null | undefined>(undefined);
  const [tagReady, setTagReady] = useState(false);
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    const savedConsent = saved === "accepted" || saved === "rejected" ? saved : null;
    if (savedConsent) window.gtag?.("consent", "update", consentSettings(savedConsent));
    setConsent(savedConsent);
  }, []);

  useEffect(() => {
    if (!tagReady || !window.gtag || lastTrackedPath.current === pathname) return;

    const timer = window.setTimeout(() => {
      const { pageType, contentGroup } = pageContext(pathname);
      window.gtag?.("event", "page_view", {
        page_path: pathname,
        page_location: window.location.href,
        page_title: document.title,
        page_type: pageType,
        content_group: contentGroup,
      });
      lastTrackedPath.current = pathname;
    }, 0);

    return () => window.clearTimeout(timer);
  }, [measurementId, pathname, tagReady]);

  function choose(value: Consent) {
    window.gtag?.("consent", "update", consentSettings(value));
    window.localStorage.setItem(STORAGE_KEY, value);
    setConsent(value);
  }

  function initializeAnalytics() {
    window.gtag?.("js", new Date());
    window.gtag?.("config", measurementId, { send_page_view: false });
    setTagReady(true);
  }

  return (
    <>
      <Script
        id="capivara-google-adsense"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
        strategy="afterInteractive"
        crossOrigin="anonymous"
      />
      <Script
        id="capivara-google-analytics"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
        onReady={initializeAnalytics}
      />

      {consent === null && (
        <aside className="consent-banner" aria-label="Preferências de privacidade">
          <div>
            <strong>Podemos usar medição e publicidade?</strong>
            <p>
              Sem sua autorização, a medição e os anúncios funcionam de forma limitada. Ao aceitar, você permite a medição completa e anúncios personalizados.{" "}
              <Link href="/politica-de-privacidade">Saiba mais</Link>
            </p>
          </div>
          <div className="consent-actions">
            <button type="button" className="consent-reject" onClick={() => choose("rejected")}>
              Recusar
            </button>
            <button type="button" className="consent-accept" onClick={() => choose("accepted")}>
              Aceitar
            </button>
          </div>
        </aside>
      )}
    </>
  );
}
