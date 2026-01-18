/* =========================================================
   UI MANAGER (v5.0 - Smart Loader + Internal Watermark)
   ========================================================= */

// 1. INJECT STYLES AUTOMATICALLY (No need to edit CSS file)
const style = document.createElement('style');
style.innerHTML = `
  /* Loader Animation */
  .img-loading-spinner {
    width: 40px; height: 40px;
    border: 4px solid rgba(255, 255, 255, 0.1);
    border-top-color: #4facfe;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 20px auto;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Image Container */
  .smart-image-box {
    position: relative;
    width: 100%;
    max-width: 400px;
    border-radius: 12px;
    overflow: hidden;
    background: #000; /* Dark bg while loading */
    box-shadow: 0 4px 15px rgba(0,0,0,0.4);
    margin-bottom: 10px;
    min-height: 200px; /* Space for loader */
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* The Image Itself */
  .smart-image-box img {
    width: 100%;
    height: auto;
    display: block;
    opacity: 0; /* Hidden initially */
    transition: opacity 0.8s ease;
  }
  
  /* When Loaded */
  .smart-image-box.loaded img { opacity: 1; }
  .smart-image-box.loaded .loader-wrapper { display: none; }

  /* Watermark Overlay */
  .watermark-overlay {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    padding: 8px 12px;
    background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
    color: white;
    font-size: 10px;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1px;
    pointer-events: none;
    display: flex;
    align-items: center;
    gap: 6px;
  }
`;
document.head.appendChild(style);

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

    if (type !== 'bot') {
      content.textContent = text;
      this.scrollToBottom();
      return;
    }

    // Check for Image Code or Link
    if (this.containsMarkdownImage(text) || this.containsLink(text)) {
      content.innerHTML = this.parseContent(text);
      this.activateImageLoaders(content); // <--- NEW: Turns on the magic
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

  containsMarkdownImage(text) { return /!\[.*?\]\(.*?\)/.test(text); },
  containsLink(text) { return /(https?:\/\/[^\s]+)/i.test(text); },

  // === SMART PARSER ===
  parseContent(text) {
    let html = text;

    // Convert Image Markdown to Smart HTML Structure
    html = html.replace(/!\[(.*?)\]\((.*?)\)/g, (match, alt, url) => {
        return `
        <div class="smart-image-box">
            <div class="loader-wrapper">
                <div class="img-loading-spinner"></div>
                <div style="color:white; font-size:10px; margin-top:5px;">Creating Art...</div>
            </div>
            <img src="${url}" alt="${alt}" loading="lazy">
            <div class="watermark-overlay">
                ✨ Lyceum AI
            </div>
        </div>`;
    });

    // Convert Links
    html = html.replace(/((?<!src=")https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank">$1</a>');
    
    // Formatting
    html = html.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
    html = html.replace(/^>\s?(.*)/gm, '<div style="border-left:3px solid #4facfe; padding-left:10px; opacity:0.8;">$1</div>');

    return html;
  },

  // === NEW: ACTIVATOR ===
  // This waits for the image to download, then reveals it
  activateImageLoaders(container) {
    const images = container.querySelectorAll('.smart-image-box img');
    images.forEach(img => {
        img.onload = () => {
            img.closest('.smart-image-box').classList.add('loaded');
        };
        // If cached, trigger immediately
        if (img.complete) img.onload();
    });
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

// Mobile Menu Hook
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const sidebar = document.getElementById("sidebar");
  if (menuToggle && sidebar) {
    menuToggle.addEventListener("click", () => sidebar.classList.toggle("active"));
  }
});
/* === PASTE AT BOTTOM OF UI.JS === */
document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("menu-toggle");
    const bar = document.getElementById("sidebar");

    // Force click listener
    if(btn) {
        btn.onclick = function(e) {
            e.preventDefault(); // Stop screen jumping
            bar.classList.toggle("active");
            console.log("Menu Toggled!"); // Check console to see if this prints
        };
    }
});
