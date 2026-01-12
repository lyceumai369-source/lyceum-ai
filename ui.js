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
// ================= MOBILE SIDEBAR + SETTINGS FIX =================

// Elements
const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menu-toggle');
const settingsBtn = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');
const closeSettings = document.getElementById('close-settings');

// Toggle sidebar (hamburger)
menuToggle?.addEventListener('click', () => {
  sidebar.classList.toggle('active');
  document.body.classList.toggle('sidebar-open');
});

// Open settings → CLOSE sidebar
settingsBtn?.addEventListener('click', () => {
  settingsModal.classList.remove('hidden');

  sidebar.classList.remove('active');
  document.body.classList.remove('sidebar-open');
});

// Close settings → ensure sidebar closed
closeSettings?.addEventListener('click', () => {
  settingsModal.classList.add('hidden');

  sidebar.classList.remove('active');
  document.body.classList.remove('sidebar-open');
});

