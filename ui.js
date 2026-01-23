/* =========================================================
   UI MANAGER (v7.2 - VIDEO INTEGRATED)
   ========================================================= */

// 1. INJECT LOADER STYLES
const style = document.createElement("style");
style.innerHTML = `
  .img-loading-spinner {
    width: 40px; height: 40px;
    border: 4px solid rgba(255,255,255,0.1);
    border-top-color: #4facfe;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 20px auto;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .smart-image-box {
    position: relative;
    width: 100%;
    max-width: 400px;
    border-radius: 12px;
    overflow: hidden;
    background: #000;
    box-shadow: 0 4px 15px rgba(0,0,0,0.4);
    margin-bottom: 10px;
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .smart-image-box img {
    width: 100%; height: auto;
    display: block; opacity: 0;
    transition: opacity 0.8s ease;
  }
  .smart-image-box.loaded img { opacity: 1; }
  .smart-image-box.loaded .loader-wrapper { display: none; }

  .watermark-overlay {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    padding: 8px 12px;
    background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
    color: white;
    font-size: 10px; font-weight: bold;
    text-transform: uppercase; pointer-events: none;
  }

  /* Lyra Video specific fixes */
  .lyra-card { position: relative; background: #000; overflow: hidden; border-radius: 12px; }
  #close-lyra-btn { 
    position: absolute; top: 10px; right: 10px; z-index: 100; 
    background: rgba(0,0,0,0.6); color: #fff; border: none; 
    border-radius: 50%; width: 30px; height: 30px; cursor: pointer;
  }
`;
document.head.appendChild(style);

const UI = {
  chatContainer: document.getElementById("chat-container"),
  messagesArea: document.getElementById("chat-messages"),
  typingInd: document.getElementById("typing-indicator"),

  renderMessage(text, type, time = "") {
    if (type === "user" && !document.body.classList.contains("chat-active")) {
      document.body.classList.add("chat-active");
    }
    if (!this.messagesArea) return;

    const msg = document.createElement("div");
    msg.className = `message ${type}`;
    const content = document.createElement("div");
    content.className = "msg-content";
    const timestamp = document.createElement("span");
    timestamp.className = "timestamp";
    timestamp.textContent = time;

    msg.appendChild(content);
    msg.appendChild(timestamp);
    this.messagesArea.appendChild(msg);

    if (type !== "bot") {
      content.textContent = text;
      this.scrollToBottom();
      return;
    }

    if (this.containsMarkdownImage(text) || this.containsLink(text)) {
      content.innerHTML = this.parseContent(text);
      this.activateImageLoaders(content);
      this.scrollToBottom();
    } else {
      this.typeEffect(content, text);
    }
  },

  typeEffect(el, text) {
    let i = 0; el.textContent = "";
    const loop = () => {
      if (i < text.length) {
        el.textContent += text[i++];
        this.scrollToBottom(false);
        setTimeout(loop, 15);
      } else { this.scrollToBottom(); }
    };
    loop();
  },

  containsMarkdownImage(t) { return /!\[.*?\]\(.*?\)/.test(t); },
  containsLink(t) { return /(https?:\/\/[^\s]+)/i.test(t); },

  parseContent(text) {
    let html = text;
    html = html.replace(/!\[(.*?)\]\((.*?)\)/g, (_, alt, url) =>
      `<div class="smart-image-box">
        <div class="loader-wrapper"><div class="img-loading-spinner"></div></div>
        <img src="${url}" alt="${alt}" loading="lazy">
        <div class="watermark-overlay">✨ Lyceum AI</div>
      </div>`
    );
    html = html.replace(/((?<!src=")https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank">$1</a>');
    html = html.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
    return html;
  },

  activateImageLoaders(container) {
    container.querySelectorAll("img").forEach(img => {
      img.onload = () => img.closest(".smart-image-box")?.classList.add("loaded");
      if (img.complete) img.onload();
    });
  },

  showTyping(show) {
    if (this.typingInd) this.typingInd.classList.toggle("hidden", !show);
    this.scrollToBottom();
  },

  scrollToBottom(smooth = true) {
    if (!this.chatContainer) return;
    requestAnimationFrame(() => {
      this.chatContainer.scrollTo({
        top: this.chatContainer.scrollHeight,
        behavior: smooth ? "smooth" : "auto"
      });
    });
  }
};

document.addEventListener("DOMContentLoaded", () => {
  // Sidebar & Theme Elements
  const sidebar = document.getElementById("sidebar");
  const menuToggle = document.getElementById("menu-toggle");
  const themeBtn = document.getElementById("theme-toggle-btn");
  const settingsBtn = document.getElementById("settings-btn");
  const settingsModal = document.getElementById("settings-modal");
  const closeSettings = document.getElementById("close-settings");

  // Video Elements
  const lyraModal = document.getElementById("lyra-modal");
  const lyraVideo = document.getElementById("lyra-video");
  const closeLyra = document.getElementById("close-lyra-btn");
  const exploreLyra = document.getElementById("explore-lyra-btn");

  // Toggle Sidebar logic
  if (menuToggle) menuToggle.onclick = () => sidebar.classList.toggle("open");

  // Theme Toggle logic
  if (themeBtn) {
    themeBtn.onclick = () => {
      document.body.classList.toggle("light-mode");
      themeBtn.innerText = document.body.classList.contains("light-mode") ? "🌙 Dark Mode" : "☀️ Light Mode";
    };
  }

  // Settings Logic
  if (settingsBtn) settingsBtn.onclick = () => settingsModal.classList.remove("hidden");
  if (closeSettings) closeSettings.onclick = () => settingsModal.classList.add("hidden");

  // --- LYRA VIDEO LOGIC ---
  const openLyraVideo = () => {
    if (lyraModal && lyraVideo) {
      lyraModal.classList.remove("hidden");
      lyraVideo.play().catch(e => console.log("Autoplay blocked: ", e));
    }
  };

  // Show intro video 1 second after loading
  setTimeout(openLyraVideo, 1000);

  const stopVideoAndClose = () => {
    lyraModal.classList.add("hidden");
    lyraVideo.pause();
  };

  if (closeLyra) closeLyra.onclick = stopVideoAndClose;
  if (exploreLyra) exploreLyra.onclick = stopVideoAndClose;
});
