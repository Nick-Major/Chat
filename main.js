(()=>{"use strict";class e{list(){}get(){}create(){}update(){}delete(){}}const s=async({url:e,method:s,data:t})=>{const n={method:s,headers:{"Content-Type":"application/json"}};t&&(n.body=JSON.stringify(t));const r=await fetch(e,n);return r.ok||console.error(`HTTP error! status: ${r.status}`),204===r.status?null:await r.json()};class t extends e{baseUrl="http://localhost:3000";create(e,t){const n=`${this.baseUrl}/new-user`;s({url:n,method:"POST",data:e}).then(t)}}const n=document.getElementById("root");new class{constructor(e){this.container=e,this.api=new t,this.websocket=null,this.users=[],this.currentUserId=null}init(){this.bindToDOM(),this.registerEvents()}bindToDOM(){const e=document.createElement("div");e.classList.add("container");const s=document.createElement("div");s.classList.add("modal"),s.innerHTML='\n    <form class="modal-form">\n      <label class="modal-title" for="nickname">Выберите псевдоним</label>\n      <input class="modal-input" type="text" id="nickname">\n      <button class="modal-btn" type="submit">Продолжить</button>\n    </form>';const t=document.createElement("div");t.classList.add("chat-container","hidden"),t.innerHTML='\n      <div class="left-bar">\n        <div class="userlist"></div>\n        <button class="exit-btn">Выход</button>\n      </div>\n      <div class="chat">\n        <div class="message-viewing-area"></div>\n        <form class="chat-form">\n          <input class="chat-input" type="text" placeholder="Type your message here" required>\n        </form>\n      </div>\n    ',e.appendChild(s),e.appendChild(t),this.container.appendChild(e)}registerEvents(){const e=this.container.querySelector(".modal"),s=this.container.querySelector(".modal-form"),t=this.container.querySelector(".chat-container"),n=this.container.querySelector(".userlist"),r=this.container.querySelector(".exit-btn");s.addEventListener("submit",(s=>{s.preventDefault();const r=e.querySelector(".modal-input");this.api.create({name:r.value},(s=>{if("error"===s.status)return alert(s.message),void(r.value="");console.log(s),this.user=s.user,this.currentUserId=this.user.id,this.users.push(this.user);const a=document.createElement("div");a.classList.add("chat-user"),a.innerHTML='\n          <span class="circle"></span>\n          <span class="user-name">You</span>\n        ',n.appendChild(a),t.classList.remove("hidden"),e.classList.add("hidden"),this.subscribeOnEvents()}))})),r.addEventListener("click",(s=>{s.preventDefault(),this.exitUser(this.user),t.classList.add("hidden"),e.classList.remove("hidden")}));const a=this.container.querySelector(".chat-form"),i=this.container.querySelector(".chat-input");a.addEventListener("submit",(e=>{e.preventDefault();const s=i.value;s&&(this.sendMessage(s),i.value="")}))}subscribeOnEvents(){this.websocket=new WebSocket("ws://localhost:3000"),this.websocket.onopen=e=>{console.log("Соединение установлено",e)},this.websocket.onmessage=e=>{console.log("Получено сообщение:",e);const s=JSON.parse(e.data);Array.isArray(s)?this.onEnterChatHandler(s):this.renderMessage(s)},this.websocket.onerror=e=>{console.error("Ошибка:",e)},this.websocket.onclose=e=>{console.log("Соединение закрыто",e)}}onEnterChatHandler(e){const s=this.container.querySelector(".userlist");s.innerHTML="",e.forEach((e=>{const t=document.createElement("div");t.classList.add("chat-user"),t.innerHTML=`\n        <span class="circle"></span>\n        <span class="user-name">${e.id===this.currentUserId?"You":e.name}</span>\n      `,s.appendChild(t)}))}sendMessage(e){this.websocket.send(JSON.stringify({user:this.user,type:"send",message:e}))}exitUser(e){this.websocket.send(JSON.stringify({user:e,type:"exit"}))}renderMessage(e){const s=this.container.querySelector(".message-viewing-area"),t=document.createElement("div");t.classList.add(e.user.id===this.currentUserId?"user-s-message":"interlocutor-s-message"),t.innerHTML=`\n      <div class="${e.user.id===this.currentUserId?"user-s-information":"interlocutor-information"}">\n        <span class="name-indicator">${e.user.id===this.currentUserId?"You":e.user.name}</span>\n        <span class="message-date">${this.currentDate()}</span>\n      </div>\n      <div class="theTextOfTheMessage">\n        ${e.message}\n      </div>\n    `,s.appendChild(t)}currentDate(){const e=new Date;return`${e.getHours()}:${e.getMinutes()} ${e.getDate()}.${String(e.getMonth()+1).padStart(2,"0")}.${e.getFullYear()}`}}(n).init()})();