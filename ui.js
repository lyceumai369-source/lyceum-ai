const UI = {
    chatBox: document.getElementById('chat-container'),
    typingInd: document.getElementById('typing-indicator'),

    renderMessage: (text, type, time) => { // Added 'time' here
        const messagesArea = document.getElementById('chat-messages');
        const div = document.createElement('div');
        div.className = `message ${type}`;
        
        // This puts the text and time into the bubble
        div.innerHTML = `
            <div class="msg-content">${text}</div>
            <span class="timestamp">${time || ''}</span>
        `;
        
        messagesArea.appendChild(div);
        
        if (type === 'bot') {
            const contentDiv = div.querySelector('.msg-content');
            UI.typeEffect(contentDiv, text);
        } else {
            UI.scrollToBottom();
        }
    },

    typeEffect: (element, text) => {
        let i = 0;
        element.innerHTML = "";
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                UI.chatBox.scrollTop = UI.chatBox.scrollHeight;
                setTimeout(type, 30);
            } else {
                UI.scrollToBottom();
            }
        }
        type();
    },

    showTyping: (show) => {
        if (show) {
            UI.typingInd.classList.remove('hidden');
        } else {
            UI.typingInd.classList.add('hidden');
        }
        UI.scrollToBottom();
    },

    scrollToBottom: () => {
        setTimeout(() => {
            UI.chatBox.scrollTo({
                top: UI.chatBox.scrollHeight,
                behavior: 'smooth'
            });
        }, 50);
    }
};