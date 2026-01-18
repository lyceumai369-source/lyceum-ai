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
    // Check for Images OR Links
    if (this.containsMarkdownImage(text) || this.containsLink(text)) {
      content.innerHTML = this.parseContent(text); 
      this.scrollToBottom();
    } else {
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

  // === 🛠️ THE FIX: PROTECTED PARSER ===
  parseContent(text) {
    let html = text;
    const placeholders = [];

    // 1. EXTRACT IMAGES & HIDE THEM
    // We replace the image code with a safe placeholder (e.g., __IMG_0__)
    // This prevents the Link Parser from breaking the image URL.
    html = html.replace(/!\[(.*?)\]\((.*?)\)/g, (match, alt, url) => {
        const id = placeholders.length;
        placeholders.push(`
            <div style="margin-bottom: 8px; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
                <img src="${url}" alt="${alt}" style="width: 100%; display: block;">
            </div>
        `);
        return `__IMG_PLACEHOLDER_${id}__`;
    });

    // 2. CONVERT LINKS (Now safe to run!)
    html = html.replace(/(https?:\/\/[^\s]+)/g, (url) => {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    });

    // 3. RESTORE IMAGES
    // We swap the placeholders back to the real image HTML
    html = html.replace(/__IMG_PLACEHOLDER_(\d+)__/g, (match, id) => placeholders[id]);

    // 4. FORMAT "Created by Lyceum AI" (Bold & Box)
    html = html.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
    html = html.replace(/^>\s?(.*)/gm, '<div style="opacity: 0.8; font-size: 0.85em; border-left: 3px solid #4facfe; padding-left: 10px; margin-top: 4px;">$1</div>');

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
