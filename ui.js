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

    // ✅ BOT MESSAGE (The Fix)
    // We check for Images OR Links. If found, we render HTML immediately.
    if (this.containsMarkdownImage(text) || this.containsLink(text)) {
      content.innerHTML = this.parseContent(text); // <--- This is the new Magic Function
      this.scrollToBottom();
    } else {
      // Normal typing animation for text
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

  // Helper: Detects if text contains ![Image](url)
  containsMarkdownImage(text) {
    return /!\[.*?\]\(.*?\)/.test(text);
  },

  // Helper: Detects standard links
  containsLink(text) {
    return /(https?:\/\/[^\s]+)/i.test(text);
  },

  // === THE NEW PARSER (This turns code into Pictures) ===
  parseContent(text) {
    let html = text;

    // 1. Convert IMAGE Code: ![Alt](URL) -> <img src="...">
    html = html.replace(/!\[(.*?)\]\((.*?)\)/g, (match, alt, url) => {
        return `<img src="${url}" alt="${alt}" style="width: 100%; border-radius: 12px; display: block; margin-bottom: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">`;
    });

    // 2. Convert BOLD Text: **text** -> <b>text</b> (For your "Lyceum AI" signature)
    html = html.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');

    // 3. Convert Blockquotes: > text -> Stylish Note
    html = html.replace(/^>\s?(.*)/gm, '<div style="opacity: 0.8; font-size: 0.9em; border-left: 3px solid var(--accent); padding-left: 10px; margin-top: 5px;">$1</div>');

    // 4. Convert Standard Links (Safe check to not break images)
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
