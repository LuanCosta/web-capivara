export const OFFICIAL_PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.capivara.politica&pcampaignid=web_share";

export function getPlayStoreUrl(configuredUrl?: string) {
  if (!configuredUrl) return OFFICIAL_PLAY_STORE_URL;

  try {
    const url = new URL(configuredUrl);
    if (url.protocol === "https:" && url.hostname === "play.google.com") return url.toString();
  } catch {
    // Valores antigos como "#" devem usar o endereço oficial.
  }

  return OFFICIAL_PLAY_STORE_URL;
}
