# Capivara Web 2.0 — matriz de implementação

Atualizado em 18/10/2026. A validação de contratos usou somente consultas públicas de leitura. Nenhum deploy, migration, secret ou ambiente de produção foi alterado.

| Área | Estado | Evidência / observação |
|---|---|---|
| Comparação pública | Implementado | Links removidos; `/comparar` redireciona para `/capivara`. A API legada foi preservada, mas não é chamada pela experiência pública. |
| Navegação Web 2.0 | Implementado | Notícias, Políticos, Capivara, Em alta e Salvos no cabeçalho; transparência no rodapé/menu móvel. |
| Feed paginado e detalhes | Já existente, preservado | Cursor real em `getNewsPage`; detalhe em `/noticias/[id]`. |
| Enquanto você esteve fora | Implementado | Usa o feed já carregado e a chave local `capivara-news-last-visit`; não chama IA nem inclui anúncios. |
| Capivara Hoje sob demanda | Implementado | `/api/daily-summary` só é chamado após clique explícito. |
| Perguntas de notícia | Implementado | Três tipos, incluindo `HOW_IT_AFFECTS_ME`; normalização de perfis/limitações, estados de erro e tentativa manual. |
| Políticos na notícia | Implementado | ID real do vínculo, card inteiro clicável, sem número, sem anúncios, avatar com fallback por erro de imagem. |
| Catálogo de representantes | Implementado | Território, cargo, composição, busca global, paginação por `nextOffset` e autocomplete com debounce/cancelamento. |
| Perfil de representante | Implementado | Composição, mandatos, datas, fontes, notícias e CTA para votos; fallback legado quando o catálogo novo falha. |
| Área Capivara | Implementado | Lista de políticos com voto, filtro por partido, paginação e cobertura explícita. |
| Como votou | Implementado | Busca, posição, agrupamento por `house+proposalId`, decisões separadas e totais de propostas/votações. |
| Detalhe legislativo | Implementado parcialmente | Proposta, decisões, placar seguro para null/indisponível, explicação v2, perfis e limitações. Lista nominal paginada e seleção por placar ainda não foram implementadas. |
| Compartilhamento legislativo | Bloqueado nesta entrega | Exige leitura completa e validação de todas as páginas, conflitos, voto secreto e `officialParty`; não foi criado um compartilhamento incompleto. |
| Em alta | Implementado | Usa exclusivamente `/trending/discovery`, preserva ordem, abre notícias externas e informa métrica/stale. |
| Favoritos | Implementado | Armazenamento local sem cadastro, tela `/salvos` e remoção local. |
| Reações e compartilhamento do feed | Já existente, preservado | Sessão anônima reutilizada, rollback em falha e ações nos cards. Arte de compartilhamento com preview ainda não foi adicionada. |
| Onboarding | Implementado parcialmente | Guia versionado no feed, pular/concluir/rever e eventos. Guias específicos para todas as telas ainda não foram criados. |
| Anúncios | Preservado | Integração AdSense/consentimento existente; nenhum bloco novo ou ID Android foi criado. Inserção manual a cada cinco itens não foi feita porque não há unidade de anúncio aprovada/configurada no projeto. |
| Analytics | Implementado parcialmente | Novos tipos de página, perguntas, favoritos, autocomplete e guia. Falta catálogo/teste automatizado completo de todos os filtros e detalhes legislativos. |
| Privacidade | Atualizado | Descreve busca no backend, salvos locais, última visita e retirada da comparação pública. |
| Responsividade | Validado parcialmente | Build responsivo e revisão visual desktop realizada. O ambiente de navegador disponível não ofereceu override de viewport; revisão física em 320 px e zoom 200% permanece pendente. |

## Endpoints confirmados em 18/10/2026

- `GET /api/representatives/territories`
- `GET /api/representatives?...&limit=&offset=`
- `GET /api/representatives/autocomplete?...&limit=10`
- `GET /api/representatives/{id}`
- `GET /api/representatives/voters?substantiveOnly=true&limit=&offset=`
- `GET /api/representatives/{id}/votes/grouped?substantiveOnly=true&position=&search=&limit=&offset=`
- `GET /api/legislative/votings/{house}/{proposalId}?substantiveOnly=true&limit=50&votesOffset=`
- `GET /api/trending/discovery`

Também permanecem em uso os endpoints existentes de feed paginado, detalhe, perguntas explícitas, resumo diário sob demanda, sessão anônima e reações.

## Validação executada

- `npm test`: 12 testes aprovados.
- `npm run build`: compilação, TypeScript e geração de rotas aprovados.
- Revisão visual local desktop do catálogo.
- O projeto não possui script `lint` separado.

## Riscos e próximos passos

1. Finalizar lista nominal paginada de cada votação antes de habilitar compartilhamento legislativo.
2. Criar preview conciso e seguro para compartilhamento de notícias e votações.
3. Expandir onboarding e Analytics para todas as telas pedidas, com testes contra duplicação/parâmetros proibidos.
4. Executar QA real em 320 px, zoom 200%, teclado e leitor de tela.
5. Validar preenchimento/publicação de anúncios no AdSense; isso depende de aprovação externa e não é comprovado pelo build local.
