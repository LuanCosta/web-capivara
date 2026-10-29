# Meu Voto — integração web

## Rotas utilizadas

- `GET /api/representatives`: proxy sem cache para a busca existente do backend. Usa `territory`, `office`, `query`, `mode`, `limit` e `offset`.
- `POST /api/my-vote/overview`: proxy sem cache para o overview existente. Recebe de um a seis IDs distintos, `newsLimit` e o cursor opaco de notícias.
- Páginas existentes `/noticias/{id}`, `/politicos/{id}` e `/propostas/{house}/{proposalId}` são reutilizadas nos detalhes.

## Alertas web

O repositório não possuía Service Worker, Firebase Messaging web, chave VAPID nem endpoint de inscrição Push. A interface e o Service Worker foram preparados, mas a ativação permanece indisponível até configurar:

- `WEB_PUSH_VAPID_PUBLIC_KEY`: chave pública VAPID.
- `MY_VOTE_PUSH_SUBSCRIPTION_ENDPOINT`: endpoint server-side que aceite `POST` e `DELETE`, valide o token da sessão anônima e armazene apenas a inscrição Push e a associação mínima com os IDs acompanhados.

O endpoint externo precisa atualizar a seleção de forma idempotente, revogar inscrições, deduplicar uma mesma notícia relacionada a várias pessoas e enviar `feedId` no payload. O Service Worker também usa `feedId` como `tag`, evitando notificações duplicadas visíveis no mesmo navegador.

Credenciais privadas VAPID e credenciais administrativas nunca devem ser expostas ao cliente. O frontend não anuncia alertas como ativos antes da confirmação do endpoint.

Não há migração necessária para a ficha nem para o overview. O armazenamento de inscrições Push, caso implementado no backend, exigirá a estrutura definida por esse serviço.

## Implantação

1. Implantar e validar o endpoint de inscrições Push, caso alertas web sejam desejados.
2. Configurar as duas variáveis de ambiente acima no Worker/Cloudflare.
3. Executar `npm test` e `npm run build`.
4. Implantar a web.
5. Validar em HTTPS a permissão, ativação, atualização do grupo, revogação e abertura de `/noticias/{feedId}`.

Sem as configurações externas, o restante do Meu Voto funciona normalmente e o sino informa a dependência real sem pedir permissão ou simular sucesso.
