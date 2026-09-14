import test from "node:test";
import assert from "node:assert/strict";
import {hasNewsSlides,isDailySummaryWindowOpen,normalizeDailySummary} from "../src/lib/daily-summary.ts";

test("normaliza campos opcionais e ignora tipos desconhecidos",()=>{const result=normalizeDailySummary({date:"2026-09-10",slides:[{type:"COVER",title:"Capa",description:null},{type:"OTHER",title:"Ignorar"},{type:"NEWS",title:"Notícia",description:"Resumo",feedId:287,imageUrl:"javascript:alert(1)",candidates:null}]});assert.equal(result.available,true);assert.equal(result.slides.length,2);assert.equal(result.slides[1].imageUrl,null);assert.deepEqual(result.slides[1].candidates,[])});
test("abre apenas a partir das 20h em São Paulo",()=>{assert.equal(isDailySummaryWindowOpen(new Date("2026-09-10T22:59:59Z")),false);assert.equal(isDailySummaryWindowOpen(new Date("2026-09-10T23:00:00Z")),true)});
test("considera indisponível um resumo sem notícias",()=>{const summary=normalizeDailySummary({date:"2026-09-10",slides:[{type:"COVER",title:"Capa"},{type:"FINISH",title:"Fim"}]});assert.equal(hasNewsSlides(summary),false)});
