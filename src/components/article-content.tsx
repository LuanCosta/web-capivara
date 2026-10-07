"use client";

import type { ComponentPropsWithoutRef,ReactNode } from "react";
import ReactMarkdown,{defaultUrlTransform} from "react-markdown";
import rehypeSanitize,{defaultSchema} from "rehype-sanitize";
import remarkGfm from "remark-gfm";

const safeSchema={...defaultSchema,attributes:{...defaultSchema.attributes,blockquote:[...(defaultSchema.attributes?.blockquote??[]),["className",/^markdown-alert(?:-(note|tip|warning|important))?$/]]}};
const alertPattern=/^\[!(NOTE|TIP|WARNING|IMPORTANT)\]\s*\n?/i;

function remarkAlerts(){return(tree:unknown)=>{const visit=(node:any)=>{if(node?.type==="blockquote"){const text=node.children?.[0]?.children?.[0];const match=typeof text?.value==="string"?text.value.match(alertPattern):null;if(match){text.value=text.value.replace(alertPattern,"");node.data={...(node.data??{}),hProperties:{className:`markdown-alert markdown-alert-${match[1].toLowerCase()}`}}}}if(Array.isArray(node?.children))node.children.forEach(visit)};visit(tree)}}
const safeUrlTransform=(url:string)=>defaultUrlTransform(url);

function SafeImage(props:ComponentPropsWithoutRef<"img">){return <img {...props} alt={props.alt?.trim()||"Imagem da notícia"} loading="lazy" onError={event=>{event.currentTarget.hidden=true}}/>}
function ExternalLink({href,children,...props}:ComponentPropsWithoutRef<"a">){const external=Boolean(href&&/^https?:\/\//i.test(href));return <a {...props} href={href} {...(external?{target:"_blank",rel:"noopener noreferrer"}:{})}>{children}</a>}

export function ArticleContent({content}:{content:string}){return <div className="markdown-content"><ReactMarkdown remarkPlugins={[remarkGfm,remarkAlerts]} rehypePlugins={[[rehypeSanitize,safeSchema]]} urlTransform={safeUrlTransform} components={{a:ExternalLink,img:SafeImage}}>{content}</ReactMarkdown></div>}

const inlineComponents={p:({children}:{children?:ReactNode})=><>{children}</>,a:({children}:{children?:ReactNode})=><>{children}</>,img:()=>null,h1:()=>null,h2:()=>null,h3:()=>null,h4:()=>null,h5:()=>null,h6:()=>null,blockquote:()=>null,ul:()=>null,ol:()=>null,table:()=>null,hr:()=>null,pre:()=>null};
export function InlineMarkdown({content}:{content:string}){return <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[[rehypeSanitize,safeSchema]]} urlTransform={safeUrlTransform} components={inlineComponents}>{content}</ReactMarkdown>}
