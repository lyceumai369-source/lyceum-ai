function addMsg(role, text) {
  const chatBox = document.getElementById("chatBox");
  const scrollArea = document.getElementById("scrollArea");
  
  const msg = document.createElement("div");
  msg.className = `msg ${role}`;
  msg.innerHTML = `<div class="bubble">${text}</div>`;
  chatBox.appendChild(msg);

  // Force scroll to bottom
  scrollArea.scrollTop = scrollArea.scrollHeight;
}

function sendMessage() {
  const input = document.getElementById("userInput");
  const text = input.value.trim();
  if (!text) return;

  // Remove welcome screen on first message
  const welcome = document.getElementById("welcome");
  if (welcome) welcome.style.display = "none";

  addMsg("user", text);
  input.value = "";

  setTimeout(() => {
    const response = `Hi 😊 Thanks for your message!<br><br>
    I’m <b>Lyceum AI</b> — built by <b>Ananthu</b>.<br>
    I’m in development 🛠️<br><br>
    📚 PSC, UPSC, School & College answers.<br>
    🚀 Stay tuned for more!`;
    addMsg("bot", response);
  }, 600);
}

function togglePopup() { document.getElementById("aboutOverlay").classList.toggle("active"); }
function toggleTheme() { document.body.classList.toggle("light"); }
function newChat() { location.reload(); } // Safest way to reset the scroll state

document.getElementById("userInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});