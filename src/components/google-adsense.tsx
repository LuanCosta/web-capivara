"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/** Loads Auto ads only on pages explicitly marked as substantial content. */
export function GoogleAdSense({ client }: { client: string }) {
  const pathname = usePathname();
  const [eligible, setEligible] = useState(false);

  useEffect(() => {
    setEligible(Boolean(document.querySelector('[data-adsense-content="true"]')));
  }, [pathname]);

  if (!eligible) return null;

  return (
    <Script
      id="capivara-google-adsense"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
      strategy="afterInteractive"
      crossOrigin="anonymous"
    />
  );
}

