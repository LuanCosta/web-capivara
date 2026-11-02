import type { News } from "@/lib/data";

const MIN_ARTICLE_WORDS = 300;
const MIN_EXPLAIN_ITEMS = 3;

export const articleWordCount = (content?: string) =>
  content?.trim() ? content.trim().split(/\s+/u).length : 0;

/**
 * Conservative eligibility gate for search indexing and advertising.
 * It does not judge editorial quality; it prevents clearly thin records from
 * being presented as complete publisher content.
 */
export function isSubstantialNews(news: News) {
  return Boolean(
    news.sourceUrl &&
      articleWordCount(news.content) >= MIN_ARTICLE_WORDS &&
      (news.explain?.length ?? 0) >= MIN_EXPLAIN_ITEMS,
  );
}

