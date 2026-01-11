const UI = {
  chatContainer: document.getElementById('chat-container'),
  messagesArea: document.getElementById('chat-messages'),
  typingInd: document.getElementById('typing-indicator'),
  sidebar: document.getElementById('sidebar'),
  settingsModal: document.getElementById('settings-modal'),

  // --- NEW: This part makes your buttons work! ---
  init() {
    // Open/Close Sidebar (Mobile)
    document.getElementById('menu-toggle')?.addEventListener('click', () => {
      this.sidebar.classList.toggle('active');
    });

    // Open Settings
    document.getElementById('settings-btn')?.addEventListener('click', () => {
      this.settingsModal.classList.remove('hidden');
      this.sidebar.classList.remove('active'); // Close sidebar when settings open
    });

    // Close Settings
    document.getElementById('close-settings')?.addEventListener('click', () => {
      this.settingsModal.classList.add('hidden');
    });

    // Tab Switching Logic (About vs Themes)
    const tabAbout = document.getElementById('tab-about');
    const tabColors = document.getElementById('tab-colors');
    const contentAbout = document.getElementById('content-about');
    const contentColors = document.getElementById('content-colors');

    tabAbout?.addEventListener('click', () => {
      tabAbout.classList.add('active');
      tabColors.classList.remove('active');
      contentAbout.classList.remove('hidden');
      contentColors.classList.add('hidden');
    });

    tabColors?.addEventListener('click', () => {
      tabColors.classList.add('active');
      tabAbout.classList.remove('active');
      contentColors.classList.remove('hidden');
      contentAbout.classList.add('hidden');
    });
  },

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

// Start the listeners!
UI.init();