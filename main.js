document.addEventListener('DOMContentLoaded', () => {

  /* ===== ELEMENTS ===== */
  const userInput = document.getElementById('user-input');
  const sendBtn = document.getElementById('send-btn');
  const micBtn = document.getElementById('mic-btn');

  const tabAbout = document.getElementById('tab-about');
  const tabColors = document.getElementById('tab-colors');
  const contentAbout = document.getElementById('content-about');
  const contentColors = document.getElementById('content-colors');
  const colorGrid = document.getElementById('color-grid');

  /* ===== COLORS ===== */
  const colors = [
    '#ffffff','#ff4757','#2ed573','#1e90ff','#ffa502',
    '#eccc68','#ff6b81','#7bed9f','#70a1ff','#5352ed',
    '#ff6348','#d1ccc0','#747d8c','#a4b0be',
    '#00d2d3','#54a0ff','#5f27cd','#ff9ff3','#48dbfb'
  ];

  /* ===== SPEECH OUTPUT (OPTIONAL) ===== */
  let voices = [];
  function loadVoices() {
    voices = speechSynthesis.getVoices();
  }
  loadVoices();
  speechSynthesis.onvoiceschanged = loadVoices;

  function speak(text) {
    if (!('speechSynthesis' in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 0.9;
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  }

  /* ===== SAFE FETCH WITH TIMEOUT (MOBILE FIX) ===== */
  async function fetchWithTimeout(url, options = {}, timeout = 40000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
      return await fetch(url, { ...options, signal: controller.signal });
    } finally {
      clearTimeout(id);
    }
  }

  /* ===== AI CALL (THIS CALLS GROQ VIA NETLIFY) ===== */
  async function askAI(message) {
    try {
      const res = await fetchWithTimeout(
        "/.netlify/functions/gemini",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message })
        },
        40000

      );

      const data = await res.json();
      return data.reply || null;

    } catch (e) {
      return "Bro, network is slow. Please try again 🙏";
    }
  }

  /* ===== SEND MESSAGE ===== */
  async function handleSend() {
    const text = userInput.value.trim();
    if (!text) return;

    const userTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

    UI.renderMessage(text, 'user', userTime);
    userInput.value = '';
    UI.showTyping(true);

    let response = Brain.getResponse(text);

    if (!response) {
      response = await askAI(text);
    }

    if (!response) {
      response = await getKnowledge(text, toggleWikiLoading);
    }

    if (!response) {
      response = getFallbackReply();
    }

    UI.showTyping(false);

    const botTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

    if (text.includes('?')) speak(response);
    UI.renderMessage(response, 'bot', botTime);
  }

  /* ===== EVENTS ===== */
  sendBtn.addEventListener('click', handleSend);
  userInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') handleSend();
  });

  /* ===== THEME COLORS ===== */
  tabColors.addEventListener('click', () => {
    contentColors.classList.remove('hidden');
    contentAbout.classList.add('hidden');
    tabColors.classList.add('active');
    tabAbout.classList.remove('active');

    if (!colorGrid.children.length) {
      colors.forEach(color => {
        const dot = document.createElement('div');
        dot.className = 'color-dot';
        dot.style.background = color;
        dot.onclick = () => {
          document.documentElement.style.setProperty('--accent', color);
        };
        colorGrid.appendChild(dot);
      });
    }
  });

});

/* ===== WIKI LOADING ===== */
function toggleWikiLoading(show) {
  const loader = document.getElementById("wiki-loading");
  if (!loader) return;
  loader.classList.toggle("hidden", !show);
}
// 🔥 Warm up Netlify function (reduces mobile delay)
fetch("/.netlify/functions/gemini", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message: "ping" })
});

