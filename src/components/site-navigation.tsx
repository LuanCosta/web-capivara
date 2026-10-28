"use client";

import Link from "next/link";
import { ArrowRight, Menu } from "lucide-react";
import { usePathname } from "next/navigation";

const primaryLinks = [
  { href: "/noticias", label: "Notícias" },
  { href: "/politicos", label: "Políticos" },
  { href: "/em-alta", label: "Em alta" },
  { href: "/salvos", label: "Salvos" },
];

const mobileLinks = [
  ...primaryLinks.slice(0, 2),
  { href: "/capivara", label: "Capivara · Como votou" },
  ...primaryLinks.slice(2),
  { href: "/sobre", label: "Ajuda e transparência" },
  { href: "/contato", label: "Contato" },
];

function isCurrent(pathname: string, href: string) {
  if (href === "/capivara") return pathname === href || pathname.includes("/votacoes") || pathname.startsWith("/propostas/");
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteNavigation() {
  const pathname = usePathname();

  return <>
    <nav className="site-nav" aria-label="Navegação principal">
      {primaryLinks.map((item) => {
        const current = isCurrent(pathname, item.href);
        return <Link className={current ? "active" : undefined} aria-current={current ? "page" : undefined} href={item.href} key={item.href}>{item.label}</Link>;
      })}
    </nav>
    <Link className={`nav-news-button ${isCurrent(pathname, "/capivara") ? "active" : ""}`} aria-current={isCurrent(pathname, "/capivara") ? "page" : undefined} href="/capivara">Como votou <ArrowRight size={15}/></Link>
    <details className="mobile-nav">
      <summary aria-label="Abrir menu"><Menu size={22}/><span>Menu</span></summary>
      <div>
        {mobileLinks.map((item) => {
          const current = isCurrent(pathname, item.href);
          return <Link className={current ? "active" : undefined} aria-current={current ? "page" : undefined} href={item.href} key={item.href}>{item.label}</Link>;
        })}
      </div>
    </details>
  </>;
}
