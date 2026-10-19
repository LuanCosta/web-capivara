# Analytics Web 2.0

Os eventos só são enviados quando `window.gtag` existe, portanto dependem do consentimento já implementado. Nenhum evento deve carregar texto livre de pesquisa, respostas, tokens ou preferências políticas.

| Evento | Gatilho | Parâmetros permitidos |
|---|---|---|
| `page_view` | Mudança real de rota | `page_path`, `page_type`, `content_group` |
| `representative_autocomplete_result` | Resposta atual do autocomplete | `result_count` |
| `representative_suggestion_selected` | Seleção explícita | `representative_id` |
| `news_saved` / `news_unsaved` | Alteração local explícita | `feed_id` |
| `news_reaction_*` | Operação real de reação | `feed_id`, tipo, status, placement |
| `news_card_shared` | Entrega ao seletor ou cópia | `feed_id`, método |
| `news_question_opened` | Abertura do painel | nenhum |
| `news_question_asked` | Seleção explícita do tipo | `question_type` |
| `daily_summary_requested` | Clique para buscar resumo | nenhum |
| `daily_summary_*` | Ações reais do resumo | data, índice, IDs/categorias já públicos |
| `guide_impression` | Primeira exibição/replay | `guide_id`, versão, passo, tela |
| `guide_next` | Avanço | `guide_id`, versão, passo, tela |
| `guide_skipped` / `guide_completed` | Encerramento | `guide_id`, versão, passo, tela |

Filtros e termos textuais não devem ser enviados ao Analytics. IDs públicos só são usados em eventos funcionais e após consentimento.
