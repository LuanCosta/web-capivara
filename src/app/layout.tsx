import type { Metadata } from "next";
import "./globals.css";
export const metadata:Metadata={metadataBase:new URL(process.env.NEXT_PUBLIC_SITE_URL||"https://capivara.app.br"),title:{default:"Capivara — Política explicada sem complicação",template:"%s | Capivara"},description:"Notícias políticas explicadas com contexto, perfis públicos e os assuntos em alta.",openGraph:{type:"website",locale:"pt_BR",siteName:"Capivara"},twitter:{card:"summary_large_image"}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="pt-BR"><body>{children}</body></html>}
