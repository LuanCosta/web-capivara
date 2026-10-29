import test from "node:test";
import assert from "node:assert/strict";
import {
  buildTimeline,changeTerritory,emptyMyVoteState,loadMyVoteState,mergeNews,mergeVotes,normalizeMyVoteOverview,removeMyVoteChoice,saveMyVoteState,setMyVoteChoice,slotsForTerritory,votePositionLabel,withTimeout,
  type MyVoteState,
} from "../src/lib/my-vote.ts";

const storage=()=>{const values=new Map<string,string>();return{getItem:(key:string)=>values.get(key)??null,setItem:(key:string,value:string)=>{values.set(key,value)},removeItem:(key:string)=>{values.delete(key)}}};
const choice=(id:number,name=`Pessoa ${id}`)=>({id,name,party:"PX",image:`https://example.com/${id}.jpg`});

test("persiste e recarrega uma ficha parcial sem cadastro",()=>{const browser=storage();const state:MyVoteState={...emptyMyVoteState(),territory:"SP",choices:{PRESIDENT:choice(1),SENATOR_1:choice(2)}};assert.equal(saveMyVoteState(browser,state),true);assert.deepEqual(loadMyVoteState(browser),state)});
test("ignora armazenamento inválido sem quebrar a página",()=>{const browser=storage();browser.setItem("capivara-my-vote-v1","{inválido");assert.deepEqual(loadMyVoteState(browser),emptyMyVoteState())});
test("troca de UF preserva presidente e remove escolhas regionais",()=>{const state:MyVoteState={...emptyMyVoteState(),territory:"SP",choices:{PRESIDENT:choice(1),GOVERNOR:choice(2),STATE_DEPUTY:choice(3)}};const next=changeTerritory(state,"RJ");assert.equal(next.territory,"RJ");assert.deepEqual(Object.keys(next.choices),["PRESIDENT"])});
test("Distrito Federal usa deputado distrital",()=>{assert.ok(slotsForTerritory("DF").includes("DISTRICT_DEPUTY"));assert.ok(!slotsForTerritory("DF").includes("STATE_DEPUTY"))});
test("não permite a mesma pessoa nas duas escolhas de senador",()=>{let state={...emptyMyVoteState(),territory:"SP"};state=setMyVoteChoice(state,"SENATOR_1",choice(9)).state;const duplicate=setMyVoteChoice(state,"SENATOR_2",choice(9));assert.equal(duplicate.duplicate,true);assert.equal(duplicate.state.choices.SENATOR_2,undefined)});
test("aceita seleção parcial e remoção de todos",()=>{let state={...emptyMyVoteState(),territory:"SP"};state=setMyVoteChoice(state,"FEDERAL_DEPUTY",choice(4)).state;state=removeMyVoteChoice(state,"FEDERAL_DEPUTY");assert.deepEqual(state.choices,{})});

const overview=normalizeMyVoteOverview({people:[{id:1,name:"Ana",party:"P1"},{id:2,nome:"Bia",partido:"P2"}],news:{status:"AVAILABLE",hasMore:true,nextCursor:"cursor",items:[{id:10,title:"Notícia",relatedCandidateIds:[1,2],publishedAt:"2026-10-28T10:00:00Z"}]},votes:{status:"PARTIAL",items:[{house:"CAMARA",proposalId:"PL-1",votingId:"v1",identification:"PL 1",participants:[{candidateId:1,position:"FOR"},{candidateId:2,secret:true,originalVote:"Sim"}],votedOn:"2026-10-27"}]},trending:{status:"AVAILABLE",items:[{candidateId:1,nome:"Ana",mentions24h:4}],calculatedAt:"2026-10-29T00:00:00Z",stale:false,windowHours:24}});
test("mapeia contratos em português e inglês e mantém falhas parciais",()=>{assert.equal(overview.people[1].name,"Bia");assert.equal(overview.votes.status,"PARTIAL");assert.equal(overview.news.nextCursor,"cursor")});
test("filtros de pessoa e tipo funcionam juntos",()=>{const votes=buildTimeline(overview,2,"VOTES");assert.equal(votes.length,1);assert.equal(votes[0].kind,"VOTES");assert.equal(buildTimeline(overview,2,"TRENDING").length,0)});
test("notícias compartilhadas aparecem uma vez e preservam as pessoas relacionadas",()=>{const merged=mergeNews(overview.news.items,[{...overview.news.items[0],summary:"Atualizado"}]);assert.equal(merged.length,1);assert.deepEqual(merged[0].relatedCandidateIds,[1,2]);assert.equal(merged[0].summary,"Atualizado")});
test("votações são deduplicadas por casa, proposta e votação",()=>{const vote=overview.votes.items[0];assert.equal(mergeVotes([vote],[{...vote,description:"Atualizada"}]).length,1)});
test("votação secreta não revela nem infere preferência individual",()=>{const participant=overview.votes.items[0].participants[1];assert.equal(votePositionLabel(participant),"Votação secreta");assert.notEqual(votePositionLabel(participant),participant.originalVote)});
test("timeout encerra sincronização travada e permite nova tentativa",async()=>{await assert.rejects(withTimeout(new Promise(()=>{}),5),/demorou/);assert.equal(await withTimeout(Promise.resolve("ok"),50),"ok")});
