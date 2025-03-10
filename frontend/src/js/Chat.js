import ChatAPI from "./api/ChatAPI";

export default class Chat {
  constructor(container) {
    this.container = container;
    this.api = new ChatAPI();
    this.websocket = null;
  }

  init() {
    this.bindToDOM();
  }

  bindToDOM() {
    const container = document.createElement('div');
    container.classList.add('container', 'hidden');

    const modal = document.createElement('div');
    modal.classList.add('modal__background');

    container.innerHTML = `
      <div class="chat__header">
        <h1>Чат</h1>
      </div>
      <div class="chat__connect">Подключиться</div>
      <div class="chat__container">
        <div class="chat__area">
          <div class="chat__messages-container">
            <div class="message__container message__container-interlocutor">
              <div class="message__header">Alexandra, 23:04 20.03.2019</div>
              <div>I can't sleep...</div>
            </div>
            <div class="message__container message__container-yourself">
              <div class="message__header">You, 23:10 20.03.2019</div>
              <div>Listen this: <a href="https://youtu.be/xxxxxxx">https://youtu.be/xxxxxxx</a></div>
            </div>
            <div class="message__container message__container-interlocutor">
              <div class="message__header">Alexandra, 01:15 21.03.2019</div>
              <div>Thxx!!! You help me! I listen this music 1 hour and I sleep. Now is my favorite music!!!</div>
            </div>
            <div class="message__container message__container-interlocutor">
              <div class="message__header">Petr, 01:25 21.03.2019</div>
              <div>I subscribed just for that 😊😊😊</div>
            </div>
          </div>
          <div class="chat__messages-input">
            <form class="form">
              <div class="form__group">
                <input type="text" class="form__input" placeholder="Type your message here">
              </div>
            </form>
          </div>
        </div>
        <div class="chat__userlist">
          <div class="chat__user">Alexandra</div>
          <div class="chat__user">Petr</div>
        </div>
      </div>
    `

    modal.innerHTML = `
      <div class="modal__content">
        <div class="modal__header">Выберите псевдоним</div>
        <div class="modal__body">
          <form class="form">
            <div class="form__group">
              <label for="nickname" class="form__label">Псевдоним</label>
              <input type="text" id="nickname" class="form__input" placeholder="Введите ваш псевдоним" required>
            </div>
          </form>
        </div>
        <div class="modal__footer">
          <button class="modal__close">Отмена</button>
          <button class="modal__ok">Продолжить</button>
        </div>
      </div>
    `

    this.container.appendChild(container);
    this.container.appendChild(modal);
  }

  registerEvents() {
    const nicknameField = this.container.getElementById('nickname');
    const okBtn = this.container.querySelector('modal__ok');

    okBtn.addEventListener('click', (e)=> {
      e.preventDefault();

      const username = nicknameField.value;
    })
  }

  subscribeOnEvents() {}

  onEnterChatHandler() {}

  sendMessage() {}

  renderMessage() {}
}
