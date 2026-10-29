import type { MetadataRoute } from "next";
import { getAllNewsForSitemap } from "@/lib/data";

export const revalidate=3600;

const toDate=(value?:string)=>{
  if(!value)return undefined;
  const parsed=new Date(value);
  return Number.isNaN(parsed.valueOf())?undefined:parsed;
};

export default async function sitemap():Promise<MetadataRoute.Sitemap>{
  const base=(process.env.NEXT_PUBLIC_SITE_URL||"https://usecapivara.com.br").replace(/\/$/,"");
  const routes=["","/noticias","/politicos","/meu-voto","/capivara","/em-alta","/salvos","/sobre","/politica-editorial","/uso-de-ia","/politica-de-privacidade","/contato"];
  const news=await getAllNewsForSitemap();
  return [
    ...routes.map(route=>({url:`${base}${route}`,changeFrequency:"daily" as const})),
    ...news.map(item=>({
      url:`${base}/noticias/${encodeURIComponent(item.id)}`,
      lastModified:toDate(item.publishedAt),
      changeFrequency:"weekly" as const,
      priority:.8,
    })),
  ];
}
