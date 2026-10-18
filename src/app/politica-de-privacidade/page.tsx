import { Institution } from "@/components/institution";

export const metadata={title:"Política de privacidade",description:"Política de privacidade do site e do aplicativo Android Capivara 2.0."};

const contactEmail=process.env.NEXT_PUBLIC_CONTACT_EMAIL||"contato.capivaranews@gmail.com";

export default function Privacidade(){return <Institution eyebrow="ÚLTIMA ATUALIZAÇÃO: 18 DE OUTUBRO DE 2026" title="Política de privacidade" intro="Esta política explica como o Capivara trata informações no site e no aplicativo Android Capivara 2.0. As práticas de cada plataforma estão identificadas separadamente.">
  <h2>1. Uso sem cadastro</h2>
  <p>O uso normal do site e do aplicativo Android não exige a criação de uma conta nem o fornecimento de nome, e-mail, telefone ou senha. Isso não significa ausência de tratamento de informações: dados técnicos podem ser processados para entregar o conteúdo, manter a segurança, medir o uso, diagnosticar falhas, exibir publicidade e operar as funcionalidades descritas abaixo.</p>

  <h2>2. Práticas do site</h2>
  <h3>2.1 Medição de audiência e publicidade</h3>
  <p>O site apresenta um aviso que permite aceitar ou recusar medição e publicidade. O Google Analytics e o script do Google AdSense somente são carregados pelo site depois que o usuário seleciona “Aceitar”. A escolha — aceita ou recusada — fica armazenada localmente no navegador para que o aviso não seja repetido a cada acesso.</p>
  <p>Quando autorizado, o Google Analytics mede informações como páginas acessadas, navegação, utilização de funcionalidades, interações e dados técnicos do navegador ou dispositivo. O Google AdSense pode usar cookies, endereço IP, identificadores e informações técnicas para disponibilizar, limitar e medir anúncios, conforme as configurações e políticas do Google.</p>
  <p>Mesmo sem essa autorização, o navegador ainda precisa se comunicar com a infraestrutura do site e com o backend para carregar páginas e funcionalidades. Os provedores de hospedagem e segurança podem processar informações técnicas das requisições, conforme explicado na seção 6.</p>

  <h3>2.2 Armazenamento local e reações</h3>
  <p>Além da escolha de medição e publicidade, o site pode armazenar localmente a data em que o banner de divulgação do aplicativo foi fechado, a identificação do resumo diário já visualizado e, quando o usuário utiliza reações, um token técnico de sessão e sua validade.</p>
  <p>Likes e dislikes utilizam esse token técnico para controlar a reação atual e reduzir duplicidades, sem exigir cadastro. Esse mecanismo não representa anonimato absoluto, pois os serviços envolvidos também podem processar endereço IP e outros dados técnicos da conexão.</p>
  <p>A versão web não oferece atualmente uma função de favoritos ou notícias salvas. Os filtros de políticos e notícias exibidos no site são aplicados no próprio navegador; o texto digitado no campo de busca de políticos não é enviado ao backend.</p>

  <h2>3. Analytics e diagnóstico no Android</h2>
  <p>O aplicativo Android utiliza o Google Analytics para Firebase para produzir métricas de navegação, utilização das funcionalidades e interações. Também utiliza o Firebase Crashlytics para diagnosticar falhas e acompanhar a estabilidade do aplicativo.</p>
  <p>Esses serviços podem processar identificadores técnicos da instalação, informações do dispositivo e do aplicativo, eventos de uso, registros e detalhes de falhas e localização aproximada derivada do endereço IP. O funcionamento desses serviços no Android é independente da escolha feita no aviso de consentimento do site.</p>

  <h2>4. Publicidade no Android</h2>
  <p>O aplicativo Android exibe anúncios por meio do Google AdMob. O SDK do AdMob pode coletar e compartilhar endereço IP, identificadores do dispositivo — incluindo o ID de publicidade quando disponível —, interações com anúncios e informações de diagnóstico para publicidade, análise, segurança e prevenção de fraudes.</p>
  <p>O aplicativo utiliza a plataforma de consentimento do Google (User Messaging Platform — UMP). Quando exigido, o usuário pode revisar as opções apresentadas pela plataforma e acessar as preferências de privacidade na área Ajuda do aplicativo.</p>
  <p>AdMob é o serviço de publicidade utilizado no aplicativo Android. AdSense é o serviço utilizado no site; as escolhas e o funcionamento de uma plataforma não devem ser confundidos com os da outra.</p>

  <h2>5. Notificações no Android</h2>
  <p>Ao acompanhar um político, o aparelho pode ser inscrito em notificações relacionadas por meio do Firebase Cloud Messaging. O usuário pode deixar de acompanhar o político no aplicativo e pode desativar as notificações nas configurações do Android.</p>
  <p>A entrega de notificações pode envolver o processamento de um token técnico do dispositivo e informações necessárias ao funcionamento do serviço. Esse token não substitui uma conta de usuário.</p>

  <h2>6. Pesquisas, propostas e comunicação com o backend</h2>
  <p>Quando uma funcionalidade precisa consultar os serviços do Capivara, o site ou o aplicativo envia ao backend somente os dados necessários para executar a solicitação. Isso pode incluir identificadores de políticos, perguntas selecionadas, tipos de consulta e termos de pesquisa usados nas funcionalidades que realizam busca no servidor.</p>
  <p>No site, consultas e comparações de propostas enviam ao backend os identificadores dos políticos e as perguntas necessárias à análise. Como indicado na seção 2, a busca textual de políticos disponível na versão web é processada localmente.</p>
  <p>A comunicação utiliza HTTPS. Os serviços de backend, hospedagem e segurança podem processar endereço IP, data, horário, rota acessada, tipo de requisição e outras informações técnicas para entregar a resposta, aplicar limites de uso, prevenir abuso, diagnosticar problemas e manter a segurança.</p>
  <p>Esta política não afirma que os termos pesquisados sejam enviados ao Analytics, usados para personalizar anúncios ou mantidos em um histórico permanente.</p>

  <h2>7. Itens salvos e compartilhamento no Android</h2>
  <p>As notícias salvas no aplicativo Android permanecem localmente no aparelho. Elas podem ser removidas pelo próprio aplicativo ou pela limpeza dos dados locais nas configurações do Android.</p>
  <p>Ao compartilhar conteúdo, o aplicativo pode gerar arquivos temporários no cache e os disponibiliza ao aplicativo escolhido pelo usuário no menu de compartilhamento do Android. A partir dessa escolha, o tratamento realizado pelo aplicativo destinatário segue as regras e a política de privacidade desse serviço.</p>

  <h2>8. Retenção e exclusão</h2>
  <p><strong>Dados locais no site.</strong> As informações armazenadas pelo site no navegador podem ser removidas limpando os dados, cookies ou armazenamento do domínio nas configurações do navegador. A remoção da escolha de consentimento fará com que o aviso seja apresentado novamente em um acesso posterior.</p>
  <p><strong>Dados locais no Android.</strong> Itens salvos podem ser removidos no aplicativo. O usuário também pode limpar os dados do Capivara nas configurações do Android ou desinstalar o aplicativo para remover os dados locais mantidos pelo app no aparelho.</p>
  <p><strong>Dados enviados.</strong> Limpar o navegador, limpar os dados locais ou desinstalar o aplicativo não apaga automaticamente informações que já tenham sido processadas pelo Google, pelo backend ou por provedores de infraestrutura. Esses serviços mantêm informações conforme suas próprias finalidades operacionais, configurações, obrigações legais e políticas de retenção. O Capivara não promete um prazo fixo de exclusão quando esse prazo não puder ser verificado.</p>
  <p>Solicitações e dúvidas de privacidade podem ser encaminhadas para <a href={`mailto:${contactEmail}`}>{contactEmail}</a>. O pedido será analisado conforme as informações disponíveis e a possibilidade técnica de localizar os dados relacionados. Como o uso normal não possui conta, pode não ser possível vincular registros técnicos a uma pessoa específica sem informações adicionais fornecidas pelo solicitante.</p>

  <h2>9. Links externos</h2>
  <p>O Capivara pode direcionar para veículos de imprensa, lojas de aplicativos e outros sites ou serviços. Esses terceiros possuem práticas e políticas próprias, que não são controladas pelo Capivara. Recomendamos a leitura da política aplicável antes de fornecer informações ou continuar a interação.</p>

  <h2>10. Segurança e alterações</h2>
  <p>Adotamos medidas razoáveis para proteger as comunicações e reduzir acessos indevidos, incluindo o uso de HTTPS. Nenhum sistema é completamente imune a incidentes. Esta política pode ser atualizada para refletir mudanças no produto, nos fornecedores ou em exigências aplicáveis; a data da versão será indicada no início da página.</p>

  <h2>11. Informações dos serviços Google</h2>
  <p>Para saber mais sobre o tratamento realizado pelo Google e pelos produtos utilizados pelo Capivara, consulte:</p>
  <ul>
    <li><a href="https://policies.google.com/privacy?hl=pt-BR" target="_blank" rel="noopener noreferrer">Política de Privacidade do Google</a></li>
    <li><a href="https://policies.google.com/technologies/partner-sites?hl=pt-BR" target="_blank" rel="noopener noreferrer">Como o Google usa informações de sites e aplicativos parceiros</a></li>
    <li><a href="https://firebase.google.com/support/privacy?hl=pt-br" target="_blank" rel="noopener noreferrer">Privacidade e segurança no Firebase</a></li>
    <li><a href="https://developers.google.com/admob/android/privacy" target="_blank" rel="noopener noreferrer">Privacidade e consentimento no Google AdMob para Android</a></li>
  </ul>

  <h2>12. Contato</h2>
  <p>Para dúvidas sobre esta política ou solicitações relacionadas à privacidade, escreva para <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.</p>
</Institution>}
