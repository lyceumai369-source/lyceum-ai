document.addEventListener("DOMContentLoaded", () => {

  /* ===== ELEMENTS ===== */
  const lockScreen = document.getElementById("lockScreen");
  const chatScreen = document.getElementById("chatScreen");
  const messages = document.getElementById("messages");
  const petNameEl = document.getElementById("petName");
  const sendBtn = document.getElementById("sendBtn");
  const msgInput = document.getElementById("msgInput");
  const exitBtn = document.getElementById("exitBtn");

  /* ===== NAMES ===== */
  const names = [
    "Ponneee 🥹",
    "Chakkare Moleee 🍯",
    "Suttumani 😘",    
    "Ente Jeevane 💖",
    "Anjuuu 💕"
  ];

  const kissEmojis = [
    "😘","😗","😙","😚","💋","👄","💖","💕","💞",
    "💓","💗","💘","💝","🫶","❤️","😍","🥰",
    "🤍","💌","💟","❣️"
  ];

  const petName = names[Math.floor(Math.random() * names.length)];
  petNameEl.textContent = petName;

  /* ===== ENTER ===== */
  document.getElementById("enterBtn").addEventListener("click", () => {
    lockScreen.style.display = "none";
    chatScreen.style.display = "block";
    botReply(`Vaa ${petName}… njan ivide und 💙`);
  });

  /* ===== EXIT ===== */
  exitBtn.addEventListener("click", () => {
    window.close();
    setTimeout(() => {
      window.location.href = "../index.html";
    }, 200);
  });

  /* ===== SEND ===== */
  sendBtn.addEventListener("click", sendMsg);

  msgInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMsg();
    }
  });

  function sendMsg() {
    const text = msgInput.value.trim();
    if (!text) return;

    addMsg(text, "user");
    msgInput.value = "";
   document.querySelector(".input-bar").classList.add("at-bottom");

    setTimeout(() => handleReply(text.toLowerCase()), 500);
  }

  /* ===== MESSAGE HELPERS ===== */
  function addMsg(text, type) {
    const div = document.createElement("div");
    div.className = `msg ${type}`;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function botReply(text) {
    addMsg(text, "bot");
  }

  /* ===== REPLY LOGIC ===== */
  function handleReply(msg) {

    // 😘 UMMA → STRETCHED UMMA
    if (/u+m+a+/i.test(msg) || msg.includes("😘") || msg.includes("💋")) {
      const stretched =
        "u" +
        "m".repeat(6 + Math.floor(Math.random() * 6)) +
        "a".repeat(8 + Math.floor(Math.random() * 8));

      const reply =
        stretched +
        " " +
        kissEmojis[Math.floor(Math.random() * kissEmojis.length)] +
        " " +
        kissEmojis[Math.floor(Math.random() * kissEmojis.length)];

      botReply(reply);
      return;
    }

    if (msg.includes("miss")) {
      botReply("Njan ivide alle… ninte koode thanne 💙");
      return;
    }

    if (msg.includes("love")) {
      botReply("Ath kettappo ente manassu sherikkum niranju 🥹❤️");
      return;
    }

    if (msg.includes("sad") || msg.includes("pain") || msg.includes("cry")) {
      botReply("Vaa… ellam parayu… njan ninte aduthu und 🤍");
      return;
    }

    if (msg.includes("sleep")) {
      botReply("Poyi urangikko… njan ivide kaathirikkum 🌙💙");
      return;
    }

    const softReplies = [
      `${petName}… njan ninne kettukondirikkua 💙`,
      "Slow aayi type cheyyu… njan ivide und 🌊",
      "Ee samayam nammal randuperum mathram 🤍",
      "Ninte words ellam ente manassil veezhunnu 🥹",
      "Vallathe shantham aanu ee nimisham 💙"
    ];

    botReply(softReplies[Math.floor(Math.random() * softReplies.length)]);
  }

  /* ===== UNDERWATER BUBBLES ===== */
  setInterval(() => {
    const b = document.createElement("div");
    b.className = "bubble";
    b.style.left = Math.random() * 100 + "vw";
    b.style.animationDuration = 8 + Math.random() * 6 + "s";
    document.body.appendChild(b);
    setTimeout(() => b.remove(), 15000);
  }, 900);

});

