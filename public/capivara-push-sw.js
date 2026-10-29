self.addEventListener("push",event=>{
  let data={};try{data=event.data?event.data.json():{}}catch{data={}}
  const feedId=String(data.feedId||data.newsId||"");
  const title=typeof data.title==="string"?data.title:"Nova notícia no Capivara";
  const body=typeof data.body==="string"?data.body:"Uma pessoa do seu grupo apareceu em uma nova notícia.";
  const url=feedId?`/noticias/${encodeURIComponent(feedId)}`:"/meu-voto";
  event.waitUntil(self.registration.showNotification(title,{body,tag:feedId?`capivara-feed-${feedId}`:"capivara-my-vote",renotify:false,data:{url}}));
});
self.addEventListener("notificationclick",event=>{event.notification.close();const url=new URL(event.notification.data?.url||"/meu-voto",self.location.origin).href;event.waitUntil(clients.matchAll({type:"window",includeUncontrolled:true}).then(windows=>{for(const client of windows){if("focus" in client){client.navigate(url);return client.focus()}}return clients.openWindow(url)}))});
