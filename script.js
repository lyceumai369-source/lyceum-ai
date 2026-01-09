function addMsg(role, text) {
  const chatBox = document.getElementById("chatBox");

  const msg = document.createElement("div");
  msg.className = `msg ${role}`;

  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.textContent = role === "user" ? "🧑" : "🤖";

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.innerHTML = text;

  msg.appendChild(avatar);
  msg.appendChild(bubble);
  chatBox.appendChild(msg);

  chatBox.scrollTop = chatBox.scrollHeight;
}

function sendMessage() {
  const input = document.getElementById("userInput");
  const text = input.value.trim();
  if (!text) return;

  // User message
  addMsg("user", text);
  input.value = "";

  // Bot typing animation
  let dots = 0;
  addMsg("bot", "Lyceum AI is typing");
  const chatBox = document.getElementById("chatBox");
  const lastBubble = chatBox.lastElementChild.querySelector(".bubble");

  const t = setInterval(() => {
    dots = (dots + 1) % 4;
    lastBubble.textContent = "Lyceum AI is typing" + ".".repeat(dots);
  }, 500);

  // Backend call (demo-safe)
  fetch("http://127.0.0.1:5000/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message: text })
  })
    .then(r => r.json())
    .then(d => {
      clearInterval(t);
      lastBubble.textContent = d.reply;
    })
    .catch(() => {
      clearInterval(t);
      lastBubble.innerHTML =
        "🔧 <b>Demo mode active</b><br>" +
        "Lyceum AI is under development by <b>Ananthu</b>.<br>" +
        "Full AI answers coming soon 🚀";
    });
}

// Enter key support
document.getElementById("userInput").addEventListener("keydown", e => {
  if (e.key === "Enter") {
    sendMessage();
  }
});

// Dark / Light mode toggle
function toggleTheme() {
  document.body.classList.toggle("light");
}

// Auto focus on input
window.onload = () => {
  document.getElementById("userInput").focus();
};
