document.addEventListener('DOMContentLoaded', () => {

  /* ===== ELEMENTS ===== */
  const userInput = document.getElementById('user-input');
  const sendBtn = document.getElementById('send-btn');
  const micBtn = document.getElementById('mic-btn');
  const menuBtn = document.getElementById('menu-toggle'); // Added this
  const sidebar = document.getElementById('sidebar');     // Added this

  const sModal = document.getElementById('settings-modal');
  const sBtn = document.getElementById('settings-btn');
  const cBtn = document.getElementById('close-settings'); // Fixed ID reference if needed

  const tabAbout = document.getElementById('tab-about');
  const tabColors = document.getElementById('tab-colors');
  const contentAbout = document.getElementById('content-about');
  const contentColors = document.getElementById('content-colors');
  const colorGrid = document.getElementById('color-grid');

  /* ===== MOBILE MENU LOGIC (This was missing) ===== */
  if (menuBtn && sidebar) {
    menuBtn.addEventListener('click', () => {
      sidebar.classList.toggle('active');
    });
  }

  /* ===== SETTINGS MODAL LOGIC ===== */
  // Make sure settings buttons work if they exist
  if (sBtn && sModal) {
    sBtn.addEventListener('click', () => sModal.classList.remove('hidden'));
  }
  if (cBtn && sModal) {
    cBtn.addEventListener('click', () => sModal.classList.add('hidden'));
  }

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
  if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
  }

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

    // Secret command
    if (text === "april8!") {
      window.open("anju/index.html", "_blank");
      userInput.value = "";
      return;
    }

    // 1. Visual updates
    document.body.classList.add('chat-active');
    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Safety check: Ensure UI exists
    if (typeof UI !== 'undefined' && UI.renderMessage) {
        UI.renderMessage(text, 'user', userTime);
        UI.showTyping(true);
    } else {
        console.error("UI script not loaded");
    }
    
    userInput.value = '';

    // 2. Logic processing
    (async () => {
      try {
          // Check if Brain exists
          if (typeof Brain === 'undefined') {
              throw new Error("Brain.js is not loaded or has an error");
          }

          let response = Brain.getResponse(text);
          
          // If Brain gives a direct response
          if (response) {
            if (typeof UI !== 'undefined') UI.showTyping(false);
            const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            if (text.includes('?')) speak(response);
            if (typeof UI !== 'undefined') UI.renderMessage(response, 'bot', botTime);
            return;
          }

          // If no direct response, check Knowledge/Wiki
          if (typeof getKnowledge === 'function') {
             response = await getKnowledge(text, toggleWikiLoading);
          }
          
          // Fallback if nothing else works
          if (!response && typeof getFallbackReply === 'function') { 
              response = getFallbackReply(); 
          } else if (!response) {
              response = "I am not sure how to respond to that yet.";
          }

          if (typeof UI !== 'undefined') {
              UI.showTyping(false);
              const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              if (text.includes('?')) speak(response);
              UI.renderMessage(response, 'bot', botTime);
          }

      } catch (error) {
          console.error("Error in chat logic:", error);
          if (typeof UI !== 'undefined') UI.showTyping(false);
      }
    })();
  } 

  /* ===== EVENT LISTENERS ===== */
  if (sendBtn) sendBtn.addEventListener('click', handleSend);
  if (userInput) {
      userInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') handleSend();
      });
  }

  /* ===== THEME/COLOR LOGIC ===== */
  if (tabColors) {
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
  }
  
  // Tab About Logic (was implicitly handled, adding explicitly for safety)
  if (tabAbout) {
      tabAbout.addEventListener('click', () => {
        contentAbout.classList.remove('hidden');
        contentColors.classList.add('hidden');
        tabAbout.classList.add('active');
        tabColors.classList.remove('active');
      });
  }

}); 

/* ===== WIKIPEDIA LOADING TOGGLE ===== */
function toggleWikiLoading(show) {
  const loader = document.getElementById("wiki-loading");
  if (!loader) return;
  loader.classList.toggle("hidden", !show);
}

/* ================= LYRA REVEAL LOGIC ================= */
// Merged logic to run safely
document.addEventListener("DOMContentLoaded", () => {
  const lyraModal = document.getElementById("lyra-modal");
  const closeBtn = document.getElementById("close-lyra-btn");
  const exploreBtn = document.getElementById("explore-lyra-btn");

  // Reveal Popup after 1.5 seconds
  setTimeout(() => {
    if (lyraModal) {
      lyraModal.classList.remove("hidden");
      setTimeout(() => lyraModal.classList.add("show"), 50);
    }
  }, 1500);

  function closeLyra() {
    if (lyraModal) {
      lyraModal.classList.remove("show");
      setTimeout(() => {
        lyraModal.classList.add("hidden");
      }, 800); 
    }
  }

  if (closeBtn) closeBtn.addEventListener("click", closeLyra);
  if (exploreBtn) exploreBtn.addEventListener("click", closeLyra);
});
