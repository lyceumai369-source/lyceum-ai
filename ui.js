/* =========================================================
   UI MANAGER (Fixed - Menu Closes on Click)
   ========================================================= */

// 1. INJECT STYLES AUTOMATICALLY
const style = document.createElement('style');
style.innerHTML = `
  .img-loading-spinner { width: 40px; height: 40px; border: 4px solid rgba(255, 255, 255, 0.1); border-top-color: #4facfe; border-radius: 50%; animation: spin 1s linear infinite; margin: 20px auto; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .smart-image-box { position: relative; width: 100%; max-width: 400px; border-radius: 12px; overflow: hidden; background: #000; box-shadow: 0 4px 15px rgba(0,0,0,0.4); margin-bottom: 10px; min-height: 200px; display: flex; align-items: center; justify-content: center; }
  .smart-image-box img { width: 100%; height: auto; display: block; opacity: 0; transition: opacity 0.8s ease; }
  .smart-image-box.loaded img { opacity: 1; }
  .smart-image-box.loaded .loader-wrapper { display: none; }
  .watermark-overlay { position: absolute; bottom: 0; left: 0; right: 0; padding: 8px 12px; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); color: white; font-size: 10px; font-weight: bold; text-transform: uppercase; pointer-events: none; }
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

    if (this.containsMarkdownImage(text) || this.containsLink(text)) {
      content.innerHTML = this.parseContent(text);
      this.activateImageLoaders(content);
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
        setTimeout(type, 15); // Made typing slightly faster
      } else {
        this.scrollToBottom();
      }
    };
    type();
  },

  containsMarkdownImage(text) { return /!\[.*?\]\(.*?\)/.test(text); },
  containsLink(text) { return /(https?:\/\/[^\s]+)/i.test(text); },

  parseContent(text) {
    let html = text;
    html = html.replace(/!\[(.*?)\]\((.*?)\)/g, (match, alt, url) => {
        return `<div class="smart-image-box"><div class="loader-wrapper"><div class="img-loading-spinner"></div><div style="color:white; font-size:10px; margin-top:5px;">Creating Art...</div></div><img src="${url}" alt="${alt}" loading="lazy"><div class="watermark-overlay">✨ Lyceum AI</div></div>`;
    });
    html = html.replace(/((?<!src=")https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank">$1</a>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
    html = html.replace(/^>\s?(.*)/gm, '<div style="border-left:3px solid #4facfe; padding-left:10px; opacity:0.8;">$1</div>');
    return html;
  },

  activateImageLoaders(container) {
    const images = container.querySelectorAll('.smart-image-box img');
    images.forEach(img => {
        img.onload = () => { img.closest('.smart-image-box').classList.add('loaded'); };
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

// ================= BUTTON LOGIC FIXES =================

document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.getElementById("sidebar");
    const menuToggle = document.getElementById("menu-toggle");
    const settingsBtn = document.getElementById("settings-btn");
    const settingsModal = document.getElementById("settings-modal");
    const closeSettings = document.getElementById("close-settings");
    const themeBtn = document.getElementById("theme-toggle-btn");

    // 1. HELPER: Close Sidebar Function
    const closeSidebar = () => {
        if(sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
        }
    };

    // 2. TOGGLE MENU (Hamburger)
    if(menuToggle) {
        menuToggle.onclick = (e) => {
            e.preventDefault();
            sidebar.classList.toggle("active");
        };
    }

    // 3. OPEN SETTINGS (And close sidebar)
    if(settingsBtn && settingsModal) {
        settingsBtn.addEventListener('click', () => {
            settingsModal.classList.remove('hidden'); // Show Modal
            closeSidebar(); // Close Menu
        });
    }

    // 4. CLOSE SETTINGS
    if(closeSettings && settingsModal) {
        closeSettings.addEventListener('click', () => {
            settingsModal.classList.add('hidden');
        });
    }

    // 5. THEME TOGGLE (And close sidebar)
    if(themeBtn) {
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            if (document.body.classList.contains('light-mode')) {
                themeBtn.innerText = "🌙 Dark Mode";
            } else {
                themeBtn.innerText = "☀️ Light Mode";
            }
            closeSidebar(); // Close Menu
        });
    }
});
