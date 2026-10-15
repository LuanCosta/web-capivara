import { AppButton, Footer, Header } from "@/components/ui";
import { getNewsSnapshot, getTrendingSnapshot } from "@/lib/data";
import { DailySummaryLoader } from "@/components/daily-summary";
import { HomeNews } from "@/components/home-news";
import { HomeTrending } from "@/components/home-trending";

export const dynamic="force-static";
export const revalidate=false;

export default async function Home(){
  const [news,trending]=await Promise.all([getNewsSnapshot(),getTrendingSnapshot()]);
  return <><Header/><main><DailySummaryLoader/><HomeNews initialNews={news}/>
    <HomeTrending initialTrending={trending}/>
    <section className="wrap android-note"><div><span className="kicker">TAMBÉM NO ANDROID</span><h2>Prefere acompanhar pelo celular?</h2><p>O site continua completo no iPhone e no computador. No Android, você também pode salvar notícias no aparelho e compartilhar artes.</p></div><AppButton small/></section>
  </main><Footer/></>
}
