"use client";

import Link from "next/link";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Consent = "accepted" | "rejected";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const STORAGE_KEY = "capivara-analytics-consent";

export function GoogleAnalytics({ measurementId }: { measurementId: string }) {
  const pathname = usePathname();
  const [consent, setConsent] = useState<Consent | null | undefined>(undefined);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    setConsent(saved === "accepted" || saved === "rejected" ? saved : null);
  }, []);

  useEffect(() => {
    if (consent === "accepted" && window.gtag) {
      window.gtag("config", measurementId, {
        page_path: pathname,
        page_title: document.title,
      });
    }
  }, [consent, measurementId, pathname]);

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
          />
          <Script id="capivara-google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              window.gtag = function(){window.dataLayer.push(arguments);};
              window.gtag('js', new Date());
              window.gtag('config', '${measurementId}', { page_path: window.location.pathname });
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
