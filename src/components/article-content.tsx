import type { ReactNode } from "react";

const bulletPattern=/^[•●▪]\s*/;
const numberedPattern=/^\d+[.)]\s*/;
const isSectionTitle=(value:string)=>{const letters=value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ]/g,"");return value.length<=120&&letters.length>=4&&value===value.toUpperCase()};

export function ArticleContent({paragraphs}:{paragraphs:string[]}){
  const content:ReactNode[]=[];
  for(let index=0;index<paragraphs.length;){
    const paragraph=paragraphs[index];
    if(isSectionTitle(paragraph)){content.push(<h3 className="article-section-title" key={`heading-${index}`}>{paragraph}</h3>);index++;continue}
    if(bulletPattern.test(paragraph)){const items:string[]=[];const start=index;while(index<paragraphs.length&&bulletPattern.test(paragraphs[index])){items.push(paragraphs[index].replace(bulletPattern,"").trim());index++}content.push(<ul className="article-list" key={`bullets-${start}`}>{items.map((item,itemIndex)=><li key={itemIndex}>{item}</li>)}</ul>);continue}
    if(numberedPattern.test(paragraph)){const items:string[]=[];const start=index;while(index<paragraphs.length&&numberedPattern.test(paragraphs[index])){items.push(paragraphs[index].replace(numberedPattern,"").trim());index++}content.push(<ol className="article-list article-numbered-list" key={`numbers-${start}`}>{items.map((item,itemIndex)=><li key={itemIndex}>{item}</li>)}</ol>);continue}
    content.push(<p key={`paragraph-${index}`}>{paragraph}</p>);index++;
  }
  return <>{content}</>;
}
