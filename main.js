document.addEventListener('DOMContentLoaded', () => {
    // 1. SELECT ALL ELEMENTS
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const sModal = document.getElementById('settings-modal');
    const sBtn = document.getElementById('settings-btn');
    const cBtn = document.getElementById('close-settings');
    const tabAbout = document.getElementById('tab-about');
    const tabColors = document.getElementById('tab-colors');
    const contentAbout = document.getElementById('content-about');
    const contentColors = document.getElementById('content-colors');
    const colorGrid = document.getElementById('color-grid');
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    
    // --- NEW: MIC BUTTON ELEMENT ---
    const micBtn = document.getElementById('mic-btn');

    const colors = [
        '#ffffff', '#ff4757', '#2ed573', '#1e90ff', '#ffa502', 
        '#eccc68', '#ff6b81', '#7bed9f', '#70a1ff', '#5352ed',
        '#ff6348', '#d1ccc0', '#747d8c', '#a4b0be',
        '#00d2d3', '#54a0ff', '#5f27cd', '#ff9ff3', '#48dbfb'
    ];

    // --- NEW: VOICE OUTPUT FUNCTION (MALE VOICE) ---
    function speak(text) {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);
        const voices = synth.getVoices();
        
        // Find a Male Voice
        const maleVoice = voices.find(v => v.name.includes('Male') || v.name.includes('David') || v.name.includes('Google US English'));
        if (maleVoice) utterance.voice = maleVoice;

        utterance.pitch = 0.9; 
        utterance.rate = 1.0;
        synth.speak(utterance);
    }

    // --- NEW: VOICE INPUT LOGIC (MIC) ---
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        
        micBtn.addEventListener('click', () => {
            recognition.start();
            micBtn.textContent = '🛑'; // Icon change while listening
        });

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            userInput.value = transcript;
            micBtn.textContent = '🎤';
            handleSend(); // Auto-send spoken text
        };

        recognition.onerror = () => { micBtn.textContent = '🎤'; };
    }

    // 2. THE FIXED SEND FUNCTION
    function handleSend() {
        const text = userInput.value.trim();
        if (text) {
            // MOVIE EFFECT: Slide logo to corner
            document.body.classList.add('chat-active'); 

            const now = new Date();
            const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            UI.renderMessage(text, 'user', time);
            userInput.value = '';
            UI.showTyping(true);
            
            setTimeout(() => {
                UI.showTyping(false);
                const response = Brain.getResponse(text);
                
                // --- NEW: VOICE LOGIC ---
                // If the user text has a '?', the bot will speak out loud.
                if (text.includes('?')) {
                    speak(response);
                }
                
                UI.renderMessage(response, 'bot', time);
            }, 1000);
        }
    }

    // 3. ATTACH THE CLICKS
    sendBtn.addEventListener('click', handleSend);
    userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSend(); });

    // Hamburger Menu Logic
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (sidebar.classList.contains('active') && !sidebar.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    });

    // Settings Modal Logic
    sBtn.addEventListener('click', () => sModal.classList.remove('hidden'));
    cBtn.addEventListener('click', () => sModal.classList.add('hidden'));

    tabAbout.addEventListener('click', () => {
        contentAbout.classList.remove('hidden');
        contentColors.classList.add('hidden');
        tabAbout.classList.add('active');
        tabColors.classList.remove('active');
    });

    tabColors.addEventListener('click', () => {
        contentColors.classList.remove('hidden');
        contentAbout.classList.add('hidden');
        tabColors.classList.add('active');
        tabAbout.classList.remove('active');
        
        if (colorGrid.innerHTML.trim() === "") {
            colors.forEach(color => {
                const dot = document.createElement('div');
                dot.className = 'color-dot';
                dot.style.backgroundColor = color;
                dot.style.cursor = 'pointer';
                dot.addEventListener('click', () => {
                    document.documentElement.style.setProperty('--accent', color);
                    
                    // Smart text color logic
                    const lightColors = ['#ffffff', '#eccc68', '#7bed9f', '#ff9ff3', '#d1ccc0'];
                    const isLight = lightColors.includes(color.toLowerCase());
                    document.documentElement.style.setProperty('--user-text', isLight ? '#000000' : '#ffffff');

                    const bgTint = color + "1a"; 
                    document.documentElement.style.setProperty('--sidebar-bg', bgTint);
                    document.body.style.backgroundImage = `radial-gradient(circle at center, ${bgTint} 0%, transparent 70%)`;
                });
                colorGrid.appendChild(dot);
            });
        }
    });
});
