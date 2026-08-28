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

function pageContext(pathname: string) {
  if (pathname === "/") return { pageType: "home", contentGroup: "Início" };
  if (pathname === "/noticias") return { pageType: "news_listing", contentGroup: "Notícias" };
  if (pathname.startsWith("/noticias/")) return { pageType: "news_detail", contentGroup: "Notícias" };
  if (pathname === "/politicos") return { pageType: "politician_listing", contentGroup: "Políticos" };
  if (pathname.startsWith("/politicos/")) return { pageType: "politician_detail", contentGroup: "Políticos" };
  if (pathname === "/em-alta") return { pageType: "trending", contentGroup: "Em alta" };
  return { pageType: "institutional", contentGroup: "Institucional" };
}

export function GoogleAnalytics({ measurementId }: { measurementId: string }) {
  const pathname = usePathname();
  const [consent, setConsent] = useState<Consent | null | undefined>(undefined);
  const [tagReady, setTagReady] = useState(false);
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    setConsent(saved === "accepted" || saved === "rejected" ? saved : null);
  }, []);

  useEffect(() => {
    if (consent !== "accepted" || !tagReady || !window.gtag || lastTrackedPath.current === pathname) return;

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
  }, [consent, measurementId, pathname, tagReady]);

  function choose(value: Consent) {
    window.localStorage.setItem(STORAGE_KEY, value);
    setConsent(value);
  }

  return (
    <>
      {consent === "accepted" && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
            strategy="afterInteractive"
            onReady={() => setTagReady(true)}
          />
          <Script id="capivara-google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              window.gtag = function(){window.dataLayer.push(arguments);};
              window.gtag('js', new Date());
              window.gtag('config', '${measurementId}', { send_page_view: false });
            `}
          </Script>
        </>
      )}

      {consent === null && (
        <aside className="consent-banner" aria-label="Preferências de privacidade">
          <div>
            <strong>Podemos medir o uso do site?</strong>
            <p>
              Usamos o Google Analytics para entender visitas e melhorar o Capivara.{" "}
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
