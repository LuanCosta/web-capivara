"use client";
import { useCallback,useEffect,useState } from "react";
import { Bot,Sparkles } from "lucide-react";
import type { ProposalAnswer as Answer,ProposalQuestion } from "@/lib/proposals";
import { ProposalAnswer } from "@/components/proposal-answer";

async function readJson(response:Response){const json=await response.json();if(!response.ok)throw new Error(json.error??"Não foi possível concluir a consulta.");return json}
export function ProposalQuestion({candidateId,candidateName}:{candidateId:number;candidateName:string}){
  const [questions,setQuestions]=useState<ProposalQuestion[]>([]);const [questionsError,setQuestionsError]=useState("");const [questionsLoading,setQuestionsLoading]=useState(true);const [selected,setSelected]=useState<ProposalQuestion>();const [answer,setAnswer]=useState<Answer>();const [answerError,setAnswerError]=useState("");const [answerLoading,setAnswerLoading]=useState(false);
  const loadQuestions=useCallback(async()=>{setQuestionsLoading(true);setQuestionsError("");try{const json=await readJson(await fetch("/api/proposals/questions"));setQuestions(json.questions);setSelected((current)=>current??json.questions?.[0])}catch(error){setQuestionsError(error instanceof Error?error.message:"Não foi possível carregar as perguntas.")}finally{setQuestionsLoading(false)}},[]);
  useEffect(()=>{void loadQuestions()},[loadQuestions]);
  async function ask(){if(!selected)return;setAnswerLoading(true);setAnswerError("");setAnswer(undefined);try{setAnswer(await readJson(await fetch("/api/proposals/ask",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({candidateId,questionId:selected.id,question:selected.question})})))}catch(error){setAnswerError(error instanceof Error?error.message:"Não foi possível gerar a resposta.")}finally{setAnswerLoading(false)}}
  return <section className="proposal-panel" aria-labelledby="proposal-title"><div className="proposal-heading"><span><Sparkles size={14}/> PROPOSTAS COM IA</span><h2 id="proposal-title">Pergunte sobre o plano de {candidateName}</h2><p>Escolha uma pergunta pronta. A análise só começa quando você confirmar.</p></div>
    {questionsLoading?<div className="proposal-state"><span className="ai-loader"/> Carregando perguntas…</div>:questionsError?<div className="proposal-state error"><p>{questionsError}</p><button type="button" onClick={loadQuestions}>Tentar novamente</button></div>:questions.length===0?<div className="proposal-state">Ainda não há perguntas disponíveis.</div>:<><div className="question-grid">{questions.map(question=><button key={question.id} type="button" className={selected?.id===question.id?"active":""} onClick={()=>{setSelected(question);setAnswer(undefined);setAnswerError("")}}><small>{String(question.position).padStart(2,"0")}</small><span><strong>{question.title}</strong>{question.question}</span></button>)}</div><button className="ask-button" type="button" onClick={ask} disabled={answerLoading}><Bot size={18}/>{answerLoading?"Analisando…":"Perguntar sobre esta proposta"}</button></>}
    <ProposalAnswer answer={answer} error={answerError} loading={answerLoading} onRetry={ask}/>
  </section>
}
