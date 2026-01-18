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

    // ✅ USER MESSAGE
    if (type !== 'bot') {
      content.textContent = text;
      this.scrollToBottom();
      return;
    }

    // ✅ BOT MESSAGE
    // If message has an Image Code (![...]) OR a Link, show it instantly (No Typing Effect)
    if (this.containsMarkdownImage(text) || this.containsLink(text)) {
      content.innerHTML = this.parseContent(text); // <--- NEW INTELLIGENT PARSER
      this.scrollToBottom();
    } else {
      // Normal text? Use typing animation
      this.typeEffect(content, text);
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

  containsMarkdownImage(text) {
    return /!\[.*?\]\(.*?\)/.test(text);
  },

  containsLink(text) {
    return /(https?:\/\/[^\s]+)/i.test(text);
  },

  // === NEW: MAGIC PARSER ===
  // This turns code into real HTML (Images, Bold Text, Quotes)
  parseContent(text) {
    let html = text;

    // 1. Convert IMAGE Code: ![Alt](URL) -> <img src="...">
    html = html.replace(/!\[(.*?)\]\((.*?)\)/g, (match, alt, url) => {
        return `<img src="${url}" alt="${alt}" style="width: 100%; border-radius: 12px; display: block; margin-bottom: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">`;
    });

    // 2. Convert BOLD Text: **text** -> <b>text</b> (For your "Lyceum AI" name)
    html = html.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');

    // 3. Convert QUOTES: > text -> Stylish Blockquote
    html = html.replace(/^>\s?(.*)/gm, '<div style="opacity: 0.8; font-size: 0.9em; border-left: 3px solid var(--accent); padding-left: 10px; margin-top: 5px;">$1</div>');

    // 4. Convert Normal Links (that are NOT images)
    // We use a negative lookbehind to avoid breaking the img tag we just made
    html = html.replace(/((?<!src=")https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');

    return html;
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

// ===== MOBILE MENU TOGGLE =====
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const sidebar = document.getElementById("sidebar");

  if (menuToggle && sidebar) {
    menuToggle.addEventListener("click", () => {
      sidebar.classList.toggle("active");
    });
  }
});
