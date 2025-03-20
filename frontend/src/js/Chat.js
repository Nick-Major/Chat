import ChatAPI from "./api/ChatAPI";
import Entity from "./api/Entity";

export default class Chat {
  constructor(container) {
    this.container = container;
    this.api = new ChatAPI();
    this.websocket = null;
    this.users = [];
    this.currentUserId = null;
  }

  init() {
    this.bindToDOM();
    this.registerEvents();
  }

  bindToDOM() {
    const container = document.createElement('div');
    container.classList.add('container');

    const modal = document.createElement('div');
    modal.classList.add('modal');

    modal.innerHTML = `
    <form class="modal-form">
      <label class="modal-title" for="nickname">Выберите псевдоним</label>
      <input class="modal-input" type="text" id="nickname">
      <button class="modal-btn" type="submit">Продолжить</button>
    </form>`

    const chatContainer = document.createElement('div');
    chatContainer.classList.add('chat-container', 'hidden');

    chatContainer.innerHTML = `
      <div class="left-bar">
        <div class="userlist"></div>
        <button class="exit-btn">Выход</button>
      </div>
      <div class="chat">
        <div class="message-viewing-area"></div>
        <form class="chat-form">
          <input class="chat-input" type="text" placeholder="Type your message here" required>
        </form>
      </div>
    `

    container.appendChild(modal);
    container.appendChild(chatContainer);
    this.container.appendChild(container);
  }

  registerEvents() {
    const modal = this.container.querySelector('.modal');
    const modalForm = this.container.querySelector('.modal-form');
    const chatContainer = this.container.querySelector('.chat-container');
    const userlist = this.container.querySelector('.userlist');
    const exit = this.container.querySelector('.exit-btn'); // кнопка выхода

    modalForm.addEventListener('submit', (e)=> {
      e.preventDefault();

      const username = modal.querySelector('.modal-input');

      this.api.create({name: username.value}, (response)=> {
        if (response.status === 'error') {
          alert(response.message);
          username.value = '';
          return;
        };

        console.log(response);
        this.user = response.user;
        this.currentUserId = this.user.id;
        this.users.push(this.user);
        const chatUser = document.createElement('div');
        chatUser.classList.add('chat-user');
        chatUser.innerHTML = `
          <span class="circle"></span>
          <span class="user-name">You</span>
        `
        userlist.appendChild(chatUser);
        chatContainer.classList.remove('hidden');
        modal.classList.add('hidden');

        this.subscribeOnEvents();
      })
    })

    exit.addEventListener('click', (e) => {
      e.preventDefault();
      this.exitUser(this.user);
      chatContainer.classList.add('hidden');
      modal.classList.remove('hidden');
    })

    const chatForm = this.container.querySelector('.chat-form');
    const chatInput = this.container.querySelector('.chat-input');

    chatForm.addEventListener('submit', (e)=> {
      e.preventDefault();
      const message = chatInput.value;
      

      if(!message) {
        return;
      };

      this.sendMessage(message);
      
      chatInput.value = '';
    })
  }

  subscribeOnEvents() {
    this.websocket = new WebSocket('ws://localhost:3000');

    this.websocket.onopen = (e) => {
      console.log("Соединение установлено", e);
    };

    this.websocket.onmessage = (event) => {
      console.log("Получено сообщение:", event);
      const data = JSON.parse(event.data);
      
      if (Array.isArray(data)) {
        this.onEnterChatHandler(data);
      } else {
        this.renderMessage(data);
      }
    };

    this.websocket.onerror = (error) => {
      console.error("Ошибка:", error);
    };

    this.websocket.onclose = (event) => {
      console.log("Соединение закрыто", event);
    };

    
  }

  onEnterChatHandler(users) {
    const userlist = this.container.querySelector('.userlist');
    userlist.innerHTML = '';

    users.forEach((user) => {
      const chatUser = document.createElement('div');
      chatUser.classList.add('chat-user');
      chatUser.innerHTML = `
        <span class="circle"></span>
        <span class="user-name">${user.id === this.currentUserId ? 'You' : user.name}</span>
      `
      userlist.appendChild(chatUser);
    })

  }

  sendMessage(message) {
    this.websocket.send(JSON.stringify({
      user: this.user,
      type: 'send',
      message: message
    }))
  }

  exitUser(user) {
    this.websocket.send(JSON.stringify({
      user: user,
      type: 'exit'
    }))
  }

  renderMessage(message) {
    const messageViewingArea = this.container.querySelector('.message-viewing-area');

    const yourMessage = document.createElement('div');
    yourMessage.classList.add(message.user.id === this.currentUserId ? 'user-s-message' : 'interlocutor-s-message');
    yourMessage.innerHTML = `
      <div class="${message.user.id === this.currentUserId ? 'user-s-information' : 'interlocutor-information'}">
        <span class="name-indicator">${message.user.id === this.currentUserId ? 'You' : message.user.name}</span>
        <span class="message-date">${this.currentDate()}</span>
      </div>
      <div class="theTextOfTheMessage">
        ${message.message}
      </div>
    `
    messageViewingArea.appendChild(yourMessage);
  }

  currentDate() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const day = now.getDate();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    return `${hours}:${minutes} ${day}.${month}.${year}`;
  }
}
