import type { Metadata, Viewport } from "next";
import { AppPromoBanner } from "@/components/app-promo-banner";
import { GoogleAnalytics } from "@/components/google-analytics";
import { getPlayStoreUrl } from "@/lib/play-store";
import { ScreenGuide } from "@/components/screen-guide";
import "./globals.css";
const adsenseClient=process.env.NEXT_PUBLIC_ADSENSE_CLIENT||"ca-pub-3105097944280355";
const googleConsentDefaults=`
window.dataLayer=window.dataLayer||[];
window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};
window.gtag('consent','default',{
  ad_storage:'denied',
  analytics_storage:'denied',
  ad_user_data:'denied',
  ad_personalization:'denied',
  wait_for_update:500
});
window.gtag('set','ads_data_redaction',true);
`;
export const metadata:Metadata={metadataBase:new URL(process.env.NEXT_PUBLIC_SITE_URL||"https://usecapivara.com.br"),title:{default:"Capivara — Notícias políticas explicadas",template:"%s | Capivara"},description:"Notícias políticas completas, explicadas com clareza e contexto. Acompanhe pelo navegador em qualquer dispositivo.",openGraph:{type:"website",locale:"pt_BR",siteName:"Capivara"},twitter:{card:"summary_large_image"},other:{"google-adsense-account":adsenseClient}};
export const viewport:Viewport={width:"device-width",initialScale:1,viewportFit:"cover"};
export default function RootLayout({children}:{children:React.ReactNode}){const measurementId=process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID||"G-Y6C5JG2442";const playStoreUrl=getPlayStoreUrl(process.env.NEXT_PUBLIC_PLAY_STORE_URL);return <html lang="pt-BR"><head><script id="capivara-consent-default" dangerouslySetInnerHTML={{__html:googleConsentDefaults}}/></head><body>{children}<ScreenGuide/><AppPromoBanner playStoreUrl={playStoreUrl}/><GoogleAnalytics measurementId={measurementId} adsenseClient={adsenseClient}/></body></html>}
