// ===============================
// ADD MESSAGE FUNCTION
// ===============================
function addMsg(role, text) {
  const chatBox = document.getElementById("chatBox");

  const msg = document.createElement("div");
  msg.className = `msg ${role}`;

  const avatar = document.createElement("div");
  avatar.className = "avatar";

  // User avatar
  if (role === "user") {
    avatar.textContent = "🧑";
  } 
  // Bot avatar (logo)
  else {
    const img = document.createElement("img");
    img.src = "logo.png";
    img.alt = "Lyceum AI";
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.borderRadius = "6px";
    avatar.appendChild(img);
  }

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.innerHTML = text;

  msg.appendChild(avatar);
  msg.appendChild(bubble);
  chatBox.appendChild(msg);

  // Always keep chat at bottom
  chatBox.scrollTop = chatBox.scrollHeight;
}

// ===============================
// SEND MESSAGE
// ===============================
function sendMessage() {

  // 🔥 Hide center title on FIRST message
  const centerTitle = document.getElementById("centerTitle");
  if (centerTitle && !centerTitle.classList.contains("hidden")) {
    centerTitle.classList.add("hidden");
  }

  const input = document.getElementById("userInput");
  const text = input.value.trim();
  if (!text) return;

  // User message
  addMsg("user", text);
  input.value = "";

  const chatBox = document.getElementById("chatBox");

  // Typing message
  const typingMsg = document.createElement("div");
  typingMsg.className = "msg bot";

  const avatar = document.createElement("div");
  avatar.className = "avatar";

  const img = document.createElement("img");
  img.src = "logo.png";
  img.alt = "Lyceum AI";
  img.style.width = "100%";
  img.style.height = "100%";
  img.style.borderRadius = "6px";

  avatar.appendChild(img);

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = "Lyceum AI is typing";

  typingMsg.appendChild(avatar);
  typingMsg.appendChild(bubble);
  chatBox.appendChild(typingMsg);
  chatBox.scrollTop = chatBox.scrollHeight;

  let dots = 0;
  const typingAnim = setInterval(() => {
    dots = (dots + 1) % 4;
    bubble.textContent = "Lyceum AI is typing" + ".".repeat(dots);
  }, 500);

  // Fake reply
  setTimeout(() => {
    clearInterval(typingAnim);
    bubble.innerHTML =
      "Thanks for your message 😊<br>" +
      "Lyceum AI is currently under development.<br>" +
      "Smart exam answers coming soon 🚀";
    chatBox.scrollTop = chatBox.scrollHeight;
  }, 1200);
}

// ===============================
// ENTER KEY SUPPORT
// ===============================
document.getElementById("userInput").addEventListener("keydown", e => {
  if (e.key === "Enter") {
    sendMessage();
  }
});

// ===============================
// THEME TOGGLE
// ===============================
function toggleTheme() {
  document.body.classList.toggle("light");
}

// ===============================
// ON PAGE LOAD
// ===============================
window.onload = () => {
  addMsg(
    "bot",
    "👋 <b>Hi bro!</b><br>I’m <b>Lyceum AI</b>.<br>Ask me about exams, studies, or concepts."
  );

  document.getElementById("userInput").focus();
};
function newChat() {
  const chatBox = document.getElementById("chatBox");
  const centerTitle = document.getElementById("centerTitle");

  // Clear all messages
  chatBox.innerHTML = "";

  // Show center title again
  if (centerTitle) {
    centerTitle.classList.remove("hidden");
  }

  // Focus input
  document.getElementById("userInput").focus();
}
