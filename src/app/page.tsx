import { AppButton, Footer, Header } from "@/components/ui";
import { getNews, getTrending } from "@/lib/data";
import { DailySummaryLoader } from "@/components/daily-summary";
import { HomeNews } from "@/components/home-news";
import { HomeTrending } from "@/components/home-trending";

export const revalidate=300;

export default async function Home(){
  const [news,trending]=await Promise.all([getNews(),getTrending()]);
  return <><Header/><main><DailySummaryLoader/><HomeNews initialNews={news}/>
    <HomeTrending initialTrending={trending}/>
    <section className="wrap android-note"><div><span className="kicker">TAMBÉM NO ANDROID</span><h2>Prefere acompanhar pelo celular?</h2><p>O site continua completo no iPhone e no computador. No Android, você também pode salvar notícias no aparelho e compartilhar artes.</p></div><AppButton small/></section>
  </main><Footer/></>
}
