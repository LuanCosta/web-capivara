import type { Metadata } from "next";
import { AppPromoBanner } from "@/components/app-promo-banner";
import { GoogleAnalytics } from "@/components/google-analytics";
import "./globals.css";
export const metadata:Metadata={metadataBase:new URL(process.env.NEXT_PUBLIC_SITE_URL||"https://usecapivara.com.br"),title:{default:"Capivara — Notícias políticas explicadas",template:"%s | Capivara"},description:"Notícias políticas completas, explicadas com clareza e contexto. Acompanhe pelo navegador em qualquer dispositivo.",openGraph:{type:"website",locale:"pt_BR",siteName:"Capivara"},twitter:{card:"summary_large_image"}};
export default function RootLayout({children}:{children:React.ReactNode}){const measurementId=process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID||"G-Y6C5JG2442";const playStoreUrl=process.env.NEXT_PUBLIC_PLAY_STORE_URL||"https://play.google.com/store/apps/details?id=com.capivara.politica&pcampaignid=web_share";return <html lang="pt-BR"><body>{children}<AppPromoBanner playStoreUrl={playStoreUrl}/><GoogleAnalytics measurementId={measurementId}/></body></html>}
