"use client";

import { ArrowUpRight, Smartphone, X } from "lucide-react";
import { useEffect, useState } from "react";

const DISMISSED_KEY = "capivara-app-promo-dismissed-at";
const HIDE_FOR_DAYS = 7;

export function AppPromoBanner({ playStoreUrl }: { playStoreUrl: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissedAt = Number(window.localStorage.getItem(DISMISSED_KEY));
    const hiddenUntil = dismissedAt + HIDE_FOR_DAYS * 24 * 60 * 60 * 1000;
    if (dismissedAt && Date.now() < hiddenUntil) return;

    const timer = window.setTimeout(() => setVisible(true), 3500);
    return () => window.clearTimeout(timer);
  }, []);

  function dismiss() {
    window.localStorage.setItem(DISMISSED_KEY, String(Date.now()));
    setVisible(false);
  }

  function trackInstallClick() {
    window.gtag?.("event", "select_promotion", {
      promotion_name: "App Android",
      creative_name: "Banner flutuante",
    });
  }

  if (!visible) return null;

  return (
    <aside className="app-float" aria-label="Baixe o aplicativo Capivara para Android">
      <button className="app-float-close" type="button" onClick={dismiss} aria-label="Fechar divulgação do aplicativo">
        <X size={16} />
      </button>
      <span className="app-float-icon" aria-hidden="true"><Smartphone size={24} /></span>
      <div className="app-float-copy">
        <span>CAPIVARA NO ANDROID</span>
        <strong>Notícias e contexto no seu bolso.</strong>
        <small>Salve matérias e compartilhe direto pelo app.</small>
      </div>
      <a href={playStoreUrl} target="_blank" rel="noopener noreferrer" onClick={trackInstallClick}>
        Baixar grátis <ArrowUpRight size={16} />
      </a>
    </aside>
  );
}
