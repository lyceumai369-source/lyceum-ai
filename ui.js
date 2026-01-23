/* =========================================================
   UI MANAGER (v7.3 - MOBILE & VIDEO STABILIZED)
   ========================================================= */

// 1. INJECT DYNAMIC STYLES
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
    width: 100%; max-width: 400px;
    border-radius: 12px; overflow: hidden;
    background: #000; box-shadow: 0 4px 15px rgba(0,0,0,0.4);
    margin-bottom: 10px; min-height: 200px;
    display: flex; align-items: center; justify-content: center;
  }
  .smart-image-box img { width: 100%; height: auto; display: block; opacity: 0; transition: opacity 0.8s ease; }
  .smart-image-box.loaded img { opacity: 1; }
  .smart-image-box.loaded .loader-wrapper { display: none; }

  .watermark-overlay {
    position: absolute; bottom: 0; left: 0; right: 0;
    padding: 8px 12px; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
    color: white; font-size: 10px; font-weight: bold;
    text-transform: uppercase; pointer-events: none;
  }

  /* Video Modal Fullscreen Fix */
  .lyra-card.video-container { 
    position: relative; background: #000; overflow: hidden; border-radius: 12px; 
    width: 95vw; max-width: 800px; 
  }
  #lyra-video { width: 100%; height: auto; display: block; }
  
  #close-lyra-btn { 
    position: absolute; top: 10px; right: 10px; z-index: 100; 
    background: rgba(0,0,0,0.6); color: #fff; border: none; 
    border-radius: 50%; width: 32px; height: 32px; cursor: pointer;
    font-size: 20px;
  }

  /* Sidebar Overlay */
  #sidebar-overlay {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.5); z-index: 99; display: none;
  }
  #sidebar-overlay.active { display: block; }
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
  const sidebar = document.getElementById("sidebar");
  const menuToggle = document.getElementById("menu-toggle");
  const overlay = document.getElementById("sidebar-overlay");
  const lyraModal = document.getElementById("lyra-modal");
  const lyraVideo = document.getElementById("lyra-video");

  // Sidebar Toggle with Overlay support
  const toggleSidebar = (state) => {
    if (state === "close") {
      sidebar.classList.remove("open");
      overlay.classList.remove("active");
    } else {
      sidebar.classList.toggle("open");
      overlay.classList.toggle("active");
    }
  };

  if (menuToggle) menuToggle.onclick = () => toggleSidebar();
  if (overlay) overlay.onclick = () => toggleSidebar("close");

  // Close sidebar when clicking any button inside it
  sidebar.querySelectorAll("button").forEach(btn => {
    btn.onclick = () => toggleSidebar("close");
  });

  // --- LYRA VIDEO LOGIC ---
  const openLyraVideo = () => {
    if (lyraModal && lyraVideo) {
      lyraModal.classList.remove("hidden");
      lyraVideo.play().catch(e => console.log("User interaction needed"));
    }
  };

  setTimeout(openLyraVideo, 1000);

  const stopVideo = () => {
    lyraModal.classList.add("hidden");
    lyraVideo.pause();
  };

  document.getElementById("close-lyra-btn").onclick = stopVideo;
  document.getElementById("explore-lyra-btn").onclick = stopVideo;
});
