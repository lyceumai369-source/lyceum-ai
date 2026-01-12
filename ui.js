const UI = {
  chatContainer: document.getElementById('chat-container'),
  messagesArea: document.getElementById('chat-messages'),
  typingInd: document.getElementById('typing-indicator'),

  renderMessage(text, type, time = "") {
    if (!this.messagesArea) return;

    const msg = document.createElement('div');
    msg.className = `message ${type}`;

    const content = document.createElement('div');
    content.className = 'msg-content';

    const timestamp = document.createElement('span');
    timestamp.className = 'timestamp';
    timestamp.textContent = time;

    msg.appendChild(content);
    msg.appendChild(timestamp);
    this.messagesArea.appendChild(msg);

    if (type === 'bot') {
      this.typeEffect(content, text);
    } else {
      content.textContent = text;
      this.scrollToBottom();
    }
  },

  typeEffect(element, text) {
    let i = 0;
    element.textContent = "";

    const type = () => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        this.scrollToBottom(false);
        setTimeout(type, 25);
      } else {
        this.scrollToBottom();
      }
    };

    type();
  },

  showTyping(show) {
    if (!this.typingInd) return;

    this.typingInd.classList.toggle('hidden', !show);
    this.scrollToBottom();
  },

  scrollToBottom(smooth = true) {
    if (!this.chatContainer) return;

    requestAnimationFrame(() => {
      this.chatContainer.scrollTo({
        top: this.chatContainer.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto'
      });
    });
  }
};
// ===== NEW CHAT CLEAR FIX =====
const newChatBtn = document.querySelector('.new-chat-btn');
const chatMessages = document.getElementById('chat-messages');

if (newChatBtn && chatMessages) {
  newChatBtn.addEventListener('click', () => {
    chatMessages.innerHTML = '';
  });
}
// ===== NEW CHAT CLEAR FIX =====
const newChatBtn = document.querySelector('.new-chat-btn');
const chatMessages = document.getElementById('chat-messages');

if (newChatBtn && chatMessages) {
  newChatBtn.addEventListener('click', () => {
    chatMessages.innerHTML = '';
  });
}
