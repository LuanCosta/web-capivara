import type { Metadata } from "next";
import { MyVote } from "@/components/my-vote";
import { PageShell } from "@/components/ui";

export const metadata:Metadata={title:"Meu Voto",description:"Escolha pessoas para acompanhar notícias, votações e presença no noticiário em uma experiência pessoal, sem cadastro."};

export default function MeuVotoPage(){return <PageShell><MyVote/></PageShell>}
