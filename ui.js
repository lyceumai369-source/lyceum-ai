const UI = {
  chatContainer: document.getElementById('chat-container'),
  messagesArea: document.getElementById('chat-messages'),
  sidebar: document.getElementById('sidebar'),
  settingsModal: document.getElementById('settings-modal'),
  menuToggle: document.getElementById('menu-toggle'),
  settingsBtn: document.getElementById('settings-btn'),
  closeSettingsBtn: document.getElementById('close-settings'),
  newChatBtn: document.querySelector('.new-chat-btn'),

  init() {
    /* ===== MOBILE MENU ===== */
    if (this.menuToggle && this.sidebar) {
      this.menuToggle.addEventListener('click', () => {
        this.sidebar.classList.toggle('active');
      });
    }

    /* ===== SETTINGS OPEN ===== */
    if (this.settingsBtn && this.settingsModal) {
      this.settingsBtn.addEventListener('click', () => {
        this.settingsModal.style.display = 'flex';
        this.sidebar.classList.remove('active'); // close sidebar on mobile
      });
    }

    /* ===== SETTINGS CLOSE ===== */
    if (this.closeSettingsBtn && this.settingsModal) {
      this.closeSettingsBtn.addEventListener('click', () => {
        this.settingsModal.style.display = 'none';
      });
    }

    /* ===== NEW CHAT ===== */
    if (this.newChatBtn && this.messagesArea) {
      this.newChatBtn.addEventListener('click', () => {
        this.messagesArea.innerHTML = '';
        this.sidebar.classList.remove('active');
      });
    }
  }
};

/* INIT AFTER DOM LOAD */
document.addEventListener('DOMContentLoaded', () => {
  UI.init();
});
