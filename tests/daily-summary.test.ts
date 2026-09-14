import test from "node:test";
import assert from "node:assert/strict";
import {hasNewsSlides,normalizeDailySummary} from "../src/lib/daily-summary.ts";

test("normaliza campos opcionais e ignora tipos desconhecidos",()=>{const result=normalizeDailySummary({date:"2026-09-10",slides:[{type:"COVER",title:"Capa",description:null},{type:"OTHER",title:"Ignorar"},{type:"NEWS",title:"Notícia",description:"Resumo",feedId:287,imageUrl:"javascript:alert(1)",candidates:null}]});assert.equal(result.available,true);assert.equal(result.slides.length,2);assert.equal(result.slides[1].imageUrl,null);assert.deepEqual(result.slides[1].candidates,[])});
test("aceita um resumo disponível em qualquer horário",()=>{const summary=normalizeDailySummary({date:"2026-09-10",available:true,slides:[{type:"NEWS",title:"Notícia"}]});assert.equal(summary.available&&hasNewsSlides(summary),true)});
test("considera indisponível um resumo sem notícias",()=>{const summary=normalizeDailySummary({date:"2026-09-10",slides:[{type:"COVER",title:"Capa"},{type:"FINISH",title:"Fim"}]});assert.equal(hasNewsSlides(summary),false)});
