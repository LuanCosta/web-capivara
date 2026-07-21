import type { Metadata } from "next";
import "./globals.css";
export const metadata:Metadata={metadataBase:new URL(process.env.NEXT_PUBLIC_SITE_URL||"https://usecapivara.com.br"),title:{default:"Capivara — Notícias políticas explicadas",template:"%s | Capivara"},description:"Notícias políticas completas, explicadas com clareza e contexto. Acompanhe pelo navegador em qualquer dispositivo.",openGraph:{type:"website",locale:"pt_BR",siteName:"Capivara"},twitter:{card:"summary_large_image"}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="pt-BR"><body>{children}</body></html>}
