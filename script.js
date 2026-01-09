const knowledgeBase = [
    {
        keys: ["who are you", "what is your name", "who built you"],
        ans: "I am <b>Lyceum AI</b>, a highly specialized digital intelligence built to master the complexities of Indian Polity and History. I am the creation of <b>Ananthu Shaji</b>, designed to be a bridge between hard study and smart learning."
    },
    {
        keys: ["anju", "who is anju", "about anju"],
        ans: `<b>Anju: A Soul Written in the Stars</b><br><br>
              Anju is someone profoundly special in the life of my creator, Ananthu. She is a beautiful, cheerful, and childlike soul with a brilliant mind that shines like a diamond.<br><br>
              As a dedicated <b>Nursing Student</b> in <b>Kottayam</b>, she embodies care, kindness, and the healing touch. But her story with Ananthu is unique: <br><br>
              They met online on a <b>26th day</b>, the proposal happened on a <b>26th day</b>, and their first physical meeting also occurred on a <b>26th day</b>. For them, the number 26 isn't just a date; it's the heartbeat of their destiny. She is Ananthu's ultimate source of happiness and motivation.`
    },
    {
        keys: ["language", "many languages"],
        ans: "I am polyglot by design. I can understand and communicate in over <b>15 languages</b>, including:<br><br>• English, Malayalam, Hindi, Tamil, Telugu, Kannada, Marathi, Bengali, Gujarati, Punjabi, French, German, Spanish, Arabic, and Japanese."
    },
    {
        keys: ["what you know", "features", "what can you do"],
        ans: "I am a repository of Indian Knowledge:<br>• <b>Polity:</b> Deep Articles, Constitutional Amendments, Judiciary.<br>• <b>History:</b> Independence Movement, Ancient Empires, British Era.<br>• <b>Multilingual:</b> Interaction in 15+ languages.<br>• <b>Ananthu's Story:</b> I know the developer and his inspirations better than anyone."
    },
    // POLITICAL & HISTORICAL EXTENDED
    {
        keys: ["constitution", "making", "ambेडकर"],
        ans: "<b>The Constitution of India:</b> Chaired by Dr. B.R. Ambedkar, it is the world's longest written constitution. It was finalized in 2 years, 11 months, and 18 days. It serves as the supreme law of the land, balancing power between the Union and States."
    },
    {
        keys: ["gandhi", "mahatma", "independence", "british"],
        ans: "<b>The Freedom Struggle:</b> Led by Mahatma Gandhi through Ahimsa (Non-violence). Key milestones include the 1930 Salt March, the 1942 Quit India Movement, and the hard-fought Independence achieved on August 15, 1947, ending nearly 200 years of British rule."
    },
    {
        keys: ["president", "rashtrapati", "article 52"],
        ans: "<b>The President:</b> Under Article 52, the President is the Head of State. Key powers include Article 72 (Pardon) and Article 123 (Ordinance). The President is elected by an Electoral College for a 5-year term."
    },
    {
        keys: ["rights", "fundamental", "article 32"],
        ans: "<b>Fundamental Rights (Part III):</b> These are the 'Magna Carta' of India. Article 32 is the 'Heart and Soul', allowing citizens to move the Supreme Court via Writs if their rights are violated."
    }
];

function sendMessage() {
    const input = document.getElementById("userInput");
    const text = input.value.trim();
    if (!text) return;

    document.getElementById("welcome").style.display = "none";
    addMsg("user", text);
    input.value = "";

    const tempId = "bot-" + Date.now();
    addMsg("bot", '<span class="typing">...</span>', tempId);

    setTimeout(() => {
        let lowText = text.toLowerCase();
        let finalAns = "I am processing your request... wait a second! 😊<br><br>I am <b>Lyceum AI</b>. While I am still learning some topics, I am always here to support your journey under the guidance of <b>Ananthu Shaji</b>.";

        for (let item of knowledgeBase) {
            if (item.keys.some(k => lowText.includes(k))) {
                finalAns = item.ans;
                break;
            }
        }

        document.getElementById(tempId).querySelector(".bubble").innerHTML = finalAns;
        document.getElementById("scrollArea").scrollTop = document.getElementById("scrollArea").scrollHeight;
    }, 1200);
}

function addMsg(role, text, id = null) {
    const chatBox = document.getElementById("chatBox");
    const msg = document.createElement("div");
    msg.className = `msg ${role}`;
    if (id) msg.id = id;
    msg.innerHTML = `<div class="bubble">${text}</div>`;
    chatBox.appendChild(msg);
    document.getElementById("scrollArea").scrollTop = document.getElementById("scrollArea").scrollHeight;
}

function handleImageUpload() {
    const file = document.getElementById("imageInput").files[0];
    if (!file) return;
    document.getElementById("welcome").style.display = "none";
    addMsg("user", "<i>Sent an image...</i>");
    addMsg("bot", "This is a beautiful picture! 😍<br><br>However, my image-processing neural networks are currently <b>under development</b>. For now, please ask me a question in text!");
}

function togglePopup() { document.getElementById("aboutOverlay").classList.toggle("active"); }
function toggleTheme() { document.body.classList.toggle("light"); }
function newChat() { location.reload(); }
document.getElementById("userInput").addEventListener("keydown", (e) => { if (e.key === "Enter") sendMessage(); });