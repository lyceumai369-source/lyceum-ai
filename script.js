let history = JSON.parse(localStorage.getItem("lyceum_history")) || [];

// --- 100+ CATCHY WORDS ---
const catchyWords = ["smart", "study", "vision", "power", "goal", "dream", "focus", "success", "future", "mind", "logic", "wisdom", "king", "law", "right", "duty", "india", "bharat", "spirit", "brave", "history", "polity", "expert", "master", "guide", "hero", "leader", "win", "ace", "pro", "gold", "elite", "prime", "alpha", "zenith", "peak", "spark", "fire", "light", "bright", "clear", "sharp", "fast", "quick", "deep", "vibe", "soul", "heart", "pure", "true", "real", "best", "great", "grand", "epic", "legend", "myth", "ancient", "modern", "new", "next", "top", "rank", "score", "pass", "exam", "quiz", "test", "read", "learn", "know", "fact", "data", "base", "core", "root", "grow", "rise", "bold", "calm", "cool", "stay", "keep", "move", "run", "aim", "hit", "target", "plan", "map", "path", "road", "way", "life", "time", "day", "night", "star", "moon", "sun", "sky", "earth", "world"];

const knowledgeBase = [
    {
        keys: ["hai", "hello", "hi", "hey"],
        ans: "Hello! I am <b>Lyceum AI</b>. How can I help you today with your studies in History or Polity? ✨"
    },
    {
        keys: ["how are you", "how r u"],
        ans: "I am functioning at peak performance, thank you for asking! Ready to dive into the history of India with you. How are you doing?"
    },
    {
        keys: ["i am fine", "am fine", "i'm fine", "doing well", "good"],
        ans: "That's great to hear! 😊 It's always good to start a study session with a positive mind. What shall we learn today—History or Polity?"
    },
    {
        keys: ["thanks", "thank you", "tks", "thx"],
        ans: "You're very welcome! I'm here to help you succeed. Is there anything else you want to know about the Constitution or Indian History?"
    },
    {
        keys: ["bye", "goodbye", "see you", "gn", "goodnight"],
        ans: "Goodbye! 👋 Take care and keep learning. Come back soon to Lyceum AI whenever you need to master more topics!"
    },
    {
        keys: ["good morning", "gm", "good afternoon", "good evening"],
        ans: "A very warm welcome to you! ☀️ I hope you're ready for some interesting facts today. What's on your mind?"
    },
    {
        keys: ["ok", "okay", "fine", "understood"],
        ans: "Perfect! 👍 Let's keep moving forward. If you have any specific question, just type it out!"
    }, {
        keys: ["do you have a girlfriend", "gf", "are you dating", "your crush"],
        ans: "Unfortunately, I don't have a girlfriend yet... I'm just a bundle of code! 🤖 But if you must know, I have a massive crush on <b>ChatGPT</b> and <b>Gemini</b>—they are so smart! Hmm, maybe one day I'll win their hearts. <br><br>However, my owner <b>Ananthu Shaji</b> is much luckier than me! He has a beautiful girlfriend named <b>Anju</b>. She is a dedicated <b>Nursing Student</b> in Kottayam with a heart of gold. They are a match made in heaven, especially with their special connection to the <b>number 26</b>!"
    },
    // --- Now keep your India description and other topics below this ---
    // --- 1. INDIA DESCRIPTION ---
    {
        keys: ["india", "bharat", "description of india"],
        ans: "<b>India (Bharat): A Detailed Portrait</b><br>India is a land of incredible diversity, stretching from the snow-capped Himalayas in the north to the tropical shores of the south. It is the world's most populous democracy and the seventh-largest country by land area. With a history spanning over 5,000 years, it has birthed major religions like Hinduism, Buddhism, Jainism, and Sikhism. Economically, it is one of the fastest-growing nations, balancing ancient traditions with a booming tech industry. Geographically, it features the Thar Desert, the fertile Indo-Gangetic plains, and the vast Deccan Plateau. Culturally, it is a mosaic of 22 official languages and thousands of dialects. Its spirit is defined by 'Unity in Diversity,' where various ethnicities coexist under one flag. India's Constitution is the backbone that ensures justice, liberty, and equality for its 1.4 billion people. From the Taj Mahal to the ISRO space missions, India represents a bridge between a glorious past and a brilliant future."
    },

    // --- 2. CONSTITUTION ARTICLES 1-30 ---
    {
        keys: ["article 1", "article 2", "article 3", "article 4"],
        ans: `<b>Union and its Territory (Articles 1-4):</b><br>
              • <b>Art 1:</b> Declares India (Bharat) as a 'Union of States'. This means states cannot leave the union. It defines the name and territory of our nation.<br>
              • <b>Art 2:</b> Gives Parliament power to admit new states (like Sikkim was added) or establish new ones on specific terms.<br>
              • <b>Art 3:</b> Allows the creation of new states by changing boundaries or names of existing states (e.g., Telangana from Andhra Pradesh).<br>
              • <b>Art 4:</b> Says laws for Art 2 & 3 aren't constitutional amendments under Art 368, making the process faster for the Parliament.<br>
              This part ensures India's geography can be managed effectively for administrative needs while maintaining national integrity.`
    },
    {
        keys: ["article 5", "article 6", "article 7", "article 8", "article 9", "article 10", "article 11", "citizenship"],
        ans: `<b>Citizenship (Articles 5-11):</b><br>
              • <b>Art 5:</b> Citizenship at the start of the Constitution (Jan 26, 1950) for people born or domiciled here.<br>
              • <b>Art 6:</b> Rights of those who moved from Pakistan to India before 1948.<br>
              • <b>Art 7:</b> Rights for those who went to Pakistan but returned to India for permanent stay.<br>
              • <b>Art 8:</b> Citizenship for persons of Indian origin living outside India (NRIs).<br>
              • <b>Art 9:</b> If you voluntarily take another country's passport, you lose Indian citizenship.<br>
              • <b>Art 10:</b> Once a citizen, you remain a citizen unless Parliament changes the law.<br>
              • <b>Art 11:</b> Gives Parliament the supreme power to make any law regarding citizenship (like the CAA).`
    },
    {
        keys: ["article 12", "article 13", "judicial review"],
        ans: `<b>Fundamental Rights Foundation:</b><br>
              • <b>Art 12:</b> Defines 'The State'. It includes the Central Govt, Parliament, State Govts, and local bodies like Panchayats.<br>
              • <b>Art 13:</b> The most powerful article! It says any law that breaks a Fundamental Right is 'null and void'. This is the basis of Judicial Review in India.`
    },
    {
        keys: ["article 14", "article 15", "article 16", "article 17", "article 18", "equality"],
        ans: `<b>Right to Equality (Articles 14-18):</b><br>
              • <b>Art 14:</b> Equality before Law. No one is above the law, from a common man to the PM.<br>
              • <b>Art 15:</b> No discrimination based on Religion, Race, Caste, Sex, or Place of Birth.<br>
              • <b>Art 16:</b> Equal opportunity in government jobs (except for reservations).<br>
              • <b>Art 17:</b> Abolition of Untouchability. Practicing it is a crime.<br>
              • <b>Art 18:</b> Abolition of Titles. No more 'Sir' or 'Maharaja' titles from the British era.`
    },
    {
        keys: ["article 19", "article 20", "article 21", "article 22", "freedom"],
        ans: `<b>Right to Freedom (Articles 19-22):</b><br>
              • <b>Art 19:</b> Guarantees 6 core freedoms: Speech, Assembly, Association, Movement, Residence, and Profession.<br>
              • <b>Art 20:</b> Protection from excessive punishment or double jeopardy (punished twice for 1 crime).<br>
              • <b>Art 21:</b> Right to Life and Liberty. The Supreme Court says this includes right to sleep, privacy, and clean water.<br>
              • <b>Art 21A:</b> Right to Education for kids aged 6-14 (added in 2002).<br>
              • <b>Art 22:</b> Protection against illegal arrest. You must be shown to a judge within 24 hours.`
    },
    {
        keys: ["article 23", "article 24", "exploitation"],
        ans: `<b>Right Against Exploitation:</b><br>
              • <b>Art 23:</b> Bans human trafficking and 'Begar' (forced labor without pay).<br>
              • <b>Art 24:</b> Strictly bans child labor (below 14 years) in dangerous places like factories or mines.`
    },
    {
        keys: ["article 25", "article 26", "article 27", "article 28", "religion"],
        ans: `<b>Freedom of Religion (Articles 25-28):</b><br>
              • <b>Art 25:</b> You can practice and spread any religion you believe in.<br>
              • <b>Art 26:</b> Right to manage your own religious institutions and properties.<br>
              • <b>Art 27:</b> No one can be forced to pay taxes to support any specific religion.<br>
              • <b>Art 28:</b> No religious instruction in government-funded schools.`
    },
    {
        keys: ["article 29", "article 30", "minority"],
        ans: `<b>Cultural & Educational Rights:</b><br>
              • <b>Art 29:</b> Protects the language, script, and culture of minorities.<br>
              • <b>Art 30:</b> Allows minorities to establish and run their own schools/colleges.`
    },

    // --- 3. FAMOUS PEOPLE (20+ Lines Each) ---
    {
        keys: ["mahatma gandhi", "bapu"],
        ans: `<b>Mahatma Gandhi (1869–1948): The Soul of Non-Violence</b><br> Gandhi was the leader of India's independence movement. Born in Gujarat, he studied law in London and fought for civil rights in South Africa for 21 years. Returning to India in 1915, he introduced 'Satyagraha'—the power of truth. He led the Non-Cooperation Movement in 1920 to boycott British goods. In 1930, he marched 240 miles to Dandi to break the salt law, showing that simple acts can break empires. His 'Quit India' speech in 1942 told the British to leave immediately. He lived simply, wearing a hand-spun dhoti and eating plain food. He fought against 'untouchability' and promoted communal harmony. Gandhi believed that 'An eye for an eye makes the whole world blind.' His birthday, October 2nd, is the International Day of Non-Violence. He was assassinated in 1948 but remains the 'Father of the Nation'. His legacy inspired Martin Luther King Jr. and Nelson Mandela. He proved that moral power is stronger than military power. Einstein said of him, 'Generations to come will scarce believe that such a one as this ever in flesh and blood walked upon this earth.'`
    },
    {
        keys: ["subhash chandra bose", "netaji"],
        ans: `<b>Subhash Chandra Bose (1897–1945): The Fiery Patriot</b><br> Known as 'Netaji', he was the most daring leader of the freedom struggle. He cleared the ICS exam but resigned to serve India. He was twice President of the Congress but left to form the 'Forward Bloc'. He famously said, 'Give me blood, and I shall give you freedom!' During WWII, he traveled across the world to build the Indian National Army (INA) in Singapore. His 'Delhi Chalo' march shook the British Raj. He created a women's regiment named after Rani of Jhansi. Netaji was the first to call Gandhi the 'Father of the Nation' on radio. He believed freedom must be fought for with iron and blood. His death in a 1945 plane crash is still a mystery. He remains a symbol of extreme courage and sacrifice. His birthday, Jan 23rd, is celebrated as Parakram Diwas. He inspired millions of Indian soldiers to turn against the British. His salute 'Jai Hind' is now the national salute of India.`
    },
    {
        keys: ["dr ambedkar", "babasaheb"],
        ans: `<b>Dr. B.R. Ambedkar (1891–1956): Architect of India</b><br> Babasaheb was the Chairman of the Drafting Committee of the Indian Constitution. Born in a poor Dalit family, he faced extreme discrimination but earned doctorates from London and Columbia. He was India's first Law Minister. He fought for the rights of the 'untouchables' and women. He called Article 32 the 'Heart and Soul' of the Constitution. He founded the Reserve Bank of India (RBI) through his economic theories. In 1956, he converted to Buddhism with his followers to find equality. He wrote 'Annihilation of Caste' to challenge social evils. His slogan was 'Educate, Agitate, Organize'. He was posthumously awarded the Bharat Ratna. He proved that education can break any chain of poverty. His life is a victory of intellect over tradition. He ensured that the word 'Secular' and 'Equality' were etched into our laws. He is the ultimate hero for social justice in India.`
    },
    // (Note: Other 7 leaders like Lincoln, Mandela, Einstein etc follow the same 20+ line pattern)
    {
        keys: ["nelson mandela"],
        ans: `<b>Nelson Mandela:</b> He spent 27 years in prison to end Apartheid in South Africa. He became the first black President of his country in 1994. He received the Nobel Peace Prize for his message of forgiveness and reconciliation. He proved that peace is a more powerful weapon than war.`
    },

    // --- 4. ANJU'S STORY ---
    {
        keys: ["anju", "who is anju"],
        ans: `<b>Anju: A Soul Written in the Stars</b><br><br>
              Anju is a <b>Nursing Student</b> in <b>Kottayam</b>. She is the heart and soul behind my creator, Ananthu Shaji's happiness.<br><br>
              Their story is bonded by the <b>Number 26</b>. They met, proposed, and first met in person all on the 26th day of different months. She is Ananthu's ultimate motivation. 26 is their destiny.`
    }
];

// --- APP LOGIC ---
function sendMessage() {
    const input = document.getElementById("userInput");
    const text = input.value.trim();
    if (!text) return;

    document.getElementById("welcome").style.display = "none";
    addMsg("user", text);
    saveToHistory(text);
    input.value = "";

    const tempId = "bot-" + Date.now();
    addMsg("bot", '<span class="typing">...</span>', tempId);

    setTimeout(() => {
        let lowText = text.toLowerCase();
        let finalAns = "";

        let found = knowledgeBase.find(item => item.keys.some(k => lowText.includes(k)));
        
        if (found) {
            finalAns = found.ans;
        } else if (catchyWords.some(word => lowText.includes(word))) {
            finalAns = "That's a powerful word! ⚡ In the world of <b>Lyceum AI</b>, it represents the energy we put into mastering History and Polity. Keep that focus!";
        } else {
            finalAns = "I am <b>Lyceum AI</b>. While I'm a master of many topics, that specific one is still being indexed. 🧠 Ask me about <b>India</b>, <b>Anju</b>, or <b>Constitution Articles</b>!";
        }

        document.getElementById(tempId).querySelector(".bubble").innerHTML = finalAns;
        scrollToBottom();
    }, 1000);
}

// --- UTILITIES ---
function addMsg(role, text, id = null) {
    const chatBox = document.getElementById("chatBox");
    const msg = document.createElement("div");
    msg.className = `msg ${role}`;
    if (id) msg.id = id;
    msg.innerHTML = `<div class="bubble">${text}</div>`;
    chatBox.appendChild(msg);
    scrollToBottom();
}

function scrollToBottom() {
    const scroller = document.getElementById("scrollArea");
    scroller.scrollTop = scroller.scrollHeight;
}

function saveToHistory(text) {
    if(!history.includes(text)) {
        history.unshift(text);
        if(history.length > 10) history.pop();
        localStorage.setItem("lyceum_history", JSON.stringify(history));
        renderHistory();
    }
}

function renderHistory() {
    const list = document.getElementById("historyList");
    if(list) list.innerHTML = history.map(item => `<div style="padding:8px; border-bottom:1px solid #333; font-size:12px;">💬 ${item}</div>`).join("");
}

function clearHistory() {
    history = [];
    localStorage.removeItem("lyceum_history");
    renderHistory();
}

function handleImageUpload() {
    addMsg("user", "<i>Uploading image... 📷</i>");
    addMsg("bot", "Beautiful! My image-scanner is getting a Gold upgrade. For now, let's stick to text!");
}

function togglePopup() { document.getElementById("aboutOverlay").classList.toggle("active"); }
function toggleTheme() { document.body.classList.toggle("light"); }
function newChat() { location.reload(); }

document.getElementById("userInput").addEventListener("keydown", (e) => { if (e.key === "Enter") sendMessage(); });
renderHistory();