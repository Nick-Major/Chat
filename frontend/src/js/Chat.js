import ChatAPI from "./api/ChatAPI";
import Entity from "./api/Entity";

export default class Chat {
  constructor(container) {
    this.container = container;
    this.api = new ChatAPI();
    this.websocket = null;
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
      <div class="userlist">
          <div class="chat-user">
            <span class="circle"></span>
            <span class="user-name">Alexandra</span>
          </div>
          <div class="chat-user">
            <span class="circle"></span>
            <span class="user-name">Petr</span>
          </div>
        </div>
        <div class="chat">
          <div class="message-viewing-area">
            <div class="interlocutor-s-message">
              <div class="interlocutor-information">
                <span class="interlocutor-name">Alexandra</span>
                <span class="interlocutor-message-date">23:04 20.03.2019</span>
              </div>
              <div class="interlocutor-message-container">
                I can't sleep...
              </div>
            </div>
            <div class="user-s-message">
              <div class="user-s-information">
                <span class="you-indicator">You</span>
                <span class="yours-message-date">23:10 20.03.2019</span>
              </div>
              <div class="your-message">
                Try to count the sheep
              </div>
            </div>
          </div>
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

    modalForm.addEventListener('submit', (e)=> {
      e.preventDefault();

      const username = modal.querySelector('.modal-input');
      console.log(username);

      this.api.create({name: username.value}, (response)=> {
        if (response.status === 'error') {
          alert(response.message);
          username.value = '';
          return;
        };

        console.log(response.status);


        chatContainer.classList.remove('hidden');
        modal.classList.add('hidden');
      })

    })
  }

  subscribeOnEvents() {}

  onEnterChatHandler() {}

  sendMessage() {}

  renderMessage() {}
}
