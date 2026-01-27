document.addEventListener('DOMContentLoaded', () => {

  /* ===== ELEMENTS ===== */
  const userInput = document.getElementById('user-input');
  const sendBtn = document.getElementById('send-btn');
  const micBtn = document.getElementById('mic-btn');

  const sModal = document.getElementById('settings-modal');
  const sBtn = document.getElementById('settings-btn');
  const cBtn = document.getElementById('close-settings');

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

  /* ===== SPEECH OUTPUT ===== */
  let voices = [];
  function loadVoices() {
    voices = speechSynthesis.getVoices();
  }
  loadVoices();
  speechSynthesis.onvoiceschanged = loadVoices;

  function speak(text) {
    if (!('speechSynthesis' in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    const male = voices.find(v => /male|david|google us english/i.test(v.name));
    if (male) utterance.voice = male;
    utterance.pitch = 0.9;
    utterance.rate = 1;
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  }

  /* ===== SPEECH INPUT ===== */
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition && micBtn) {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    micBtn.addEventListener('click', () => {
      recognition.start();
      micBtn.textContent = '🛑';
    });
    recognition.onresult = e => {
      userInput.value = e.results[0][0].transcript;
      micBtn.textContent = '🎤';
      handleSend();
    };
    recognition.onerror = () => { micBtn.textContent = '🎤'; };
  } else if (micBtn) {
    micBtn.style.display = 'none';
  }

  /* ===== SEND MESSAGE ===== */
  function handleSend() {
    const text = userInput.value.trim();
    if (!text) return;

    if (text === "april8!") {
      window.open("anju/index.html", "_blank");
      userInput.value = "";
      return;
    }

    document.body.classList.add('chat-active');
    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    UI.renderMessage(text, 'user', userTime);
    userInput.value = '';
    UI.showTyping(true);

    (async () => {
      let response = Brain.getResponse(text);
      if (response) {
        UI.showTyping(false);
        const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        if (text.includes('?')) speak(response);
        UI.renderMessage(response, 'bot', botTime);
        return;
      }

      response = await getKnowledge(text, toggleWikiLoading);
      if (!response) { response = getFallbackReply(); }

      UI.showTyping(false);
      const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      if (text.includes('?')) speak(response);
      UI.renderMessage(response, 'bot', botTime);
    })();
  } 

  /* ===== EVENT LISTENERS ===== */
  sendBtn.addEventListener('click', handleSend);
  userInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') handleSend();
  });

  /* ===== THEME/COLOR LOGIC ===== */
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
          const light = ['#ffffff','#eccc68','#7bed9f','#ff9ff3','#d1ccc0'];
          document.documentElement.style.setProperty('--user-text', light.includes(color.toLowerCase()) ? '#000' : '#fff');
          const tint = color + '1a';
          document.documentElement.style.setProperty('--sidebar-bg', tint);
        };
        colorGrid.appendChild(dot);
      });
    }
  });

}); 

/* ===== WIKIPEDIA LOADING TOGGLE ===== */
function toggleWikiLoading(show) {
  const loader = document.getElementById("wiki-loading");
  if (!loader) return;
  loader.classList.toggle("hidden", !show);
}
/* ================= LYRA REVEAL LOGIC ================= */
document.addEventListener("DOMContentLoaded", () => {
  const lyraModal = document.getElementById("lyra-modal");
  const closeBtn = document.getElementById("close-lyra-btn");
  const exploreBtn = document.getElementById("explore-lyra-btn");

  // Reveal Popup after 1.5 seconds
  setTimeout(() => {
    if (lyraModal) {
      lyraModal.classList.remove("hidden");
      // Small delay to allow CSS display:flex to apply before opacity transition
      setTimeout(() => lyraModal.classList.add("show"), 50);
    }
  }, 1500);

  function closeLyra() {
    if (lyraModal) {
      lyraModal.classList.remove("show");
      setTimeout(() => {
        lyraModal.classList.add("hidden");
      }, 800); // Wait for fade out
    }
  }

  if (closeBtn) closeBtn.addEventListener("click", closeLyra);
  if (exploreBtn) exploreBtn.addEventListener("click", closeLyra);
});

