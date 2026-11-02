import test from "node:test";
import assert from "node:assert/strict";
import { articleWordCount, isSubstantialNews } from "../src/lib/content-quality.ts";
import type { News } from "../src/lib/data.ts";

const news = (overrides: Partial<News> = {}): News => ({
  id: "1",
  title: "Título",
  summary: "Resumo",
  category: "Política",
  source: "Fonte",
  sourceUrl: "https://example.com/noticia",
  date: "Hoje",
  content: Array.from({ length: 300 }, (_, index) => `palavra${index}`).join(" "),
  explain: [
    { position: 1, title: "O que aconteceu", description: "Descrição" },
    { position: 2, title: "Por que importa", description: "Descrição" },
    { position: 3, title: "O que acontece agora", description: "Descrição" },
  ],
  ...overrides,
});

test("conta palavras ignorando espaços extras", () => {
  assert.equal(articleWordCount("  uma   duas\ntrês  "), 3);
});

test("libera apenas notícia com texto, fonte e explicações suficientes", () => {
  assert.equal(isSubstantialNews(news()), true);
  assert.equal(isSubstantialNews(news({ content: "texto curto" })), false);
  assert.equal(isSubstantialNews(news({ sourceUrl: undefined })), false);
  assert.equal(isSubstantialNews(news({ explain: [] })), false);
});
