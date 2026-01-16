document.addEventListener("DOMContentLoaded", () => {

  let score = 0;
  let rewarded = new Set();
  let leafInterval = null;

  const rewards = {
    50: {
      title: "Bronze Badge 🥉",
      icon: "🥉",
      msg: "Nice start 🌱\nRelaxation begins with small steps.\nKeep going… something special awaits."
    },
    100: {
      title: "Silver Badge 🥈",
      icon: "🥈",
      msg: "You're building calm and focus ✨\nFew people reach this state.\nStay with it."
    },
    200: {
      title: "Gold Badge 🥇",
      icon: "🥇",
      msg: "Impressive 💛\nYour mind is slowing down beautifully.\nOnly dedicated users reach what's next."
    },
    300: {
      title: "Diamond Badge 💎",
      icon: "💎",
      msg: "Elite level 💎\nYou're among the most patient Lyceum users.\nOne final milestone remains…"
    },
    500: {
      title: "Lyceum AI Completion Certificate 📜",
      icon: "📜",
      msg: "Congratulations! 🎉\n\nYou completed the Lyceum AI Relaxation Challenge.\n\nThis certificate represents focus, patience, and balance.\n\nA small surprise from Lyceum AI awaits you 🌿"
    }
  };

  /* ===== CREATE OVERLAY ===== */
  const overlay = document.createElement("div");
  overlay.id = "relaxOverlay";
  overlay.innerHTML = `
    <button id="exitRelax" class="exit-btn">✖</button>

    <div class="relax-card">
      <div class="relax-text" id="relaxText">Take a deep breath 🌬️</div>
     <button class="games-btn" id="leafBtn">🍃 Relax</button>
<button class="games-btn" id="gamesBtn">🎮 Games</button>
<button class="games-btn" id="snakeBtn">🐍 Snake Game</button>

    </div>

    <div id="scoreBoard" class="score-only">Score: 0</div>

    <div id="celebration">
      <div class="celebration-box">
        <div id="celeIcon" style="font-size:50px"></div>
        <h2 id="celeTitle"></h2>
        <p id="celeMsg"></p>
        <button id="closeCele">Continue</button>
      </div>
    </div>

    <div id="exitConfirm" style="display:none;">
      <div class="celebration-box">
        <h3>Exit Relax?</h3>
        <p>Your progress will reset.</p>
        <button id="confirmExit">Exit</button>
        <button id="cancelExit">Cancel</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
document.getElementById("snakeBtn").style.display = "none";
document.getElementById("leafBtn").style.display = "inline-block";

  /* ===== LEAF LAYER ===== */
  const leafLayer = document.createElement("div");
  leafLayer.id = "leafLayer";
  overlay.appendChild(leafLayer);

  /* ===== OPEN RELAX ===== */
relaxBtn.addEventListener("click", () => {
  overlay.style.display = "flex";
  if (!leafInterval) spawnLeaves(); // ✅ prevent duplicate starts
});

    // RESET UI STATE
    document.getElementById("relaxText").style.display = "block";
    document.getElementById("gamesBtn").style.display = "inline-block";
    document.getElementById("snakeBtn").style.display = "none";
    document.getElementById("scoreBoard").style.display = "block";

    // stop leaves
    if (leafInterval) {
      clearInterval(leafInterval);
      leafInterval = null;
    }
    document.getElementById("leafLayer").innerHTML = "";

    overlay.style.display = "flex";
  });
}


  /* ===== EXIT CONFIRM ===== */
  document.getElementById("exitRelax").onclick = () => {
    document.getElementById("exitConfirm").style.display = "flex";
  };

  document.getElementById("cancelExit").onclick = () => {
    document.getElementById("exitConfirm").style.display = "none";
  };

  document.getElementById("confirmExit").onclick = () => {
    stopGame();
    document.getElementById("exitConfirm").style.display = "none";
    overlay.style.display = "none";
  };

  /* ===== START GAME ===== */
 document.getElementById("gamesBtn").onclick = () => {

  // hide text & Games button
  document.getElementById("relaxText").style.display = "none";
  document.getElementById("gamesBtn").style.display = "none";

  // stop leaf game
  if (leafInterval) {
    clearInterval(leafInterval);
    leafInterval = null;
  }
  document.getElementById("leafLayer").innerHTML = "";

  // hide score
  document.getElementById("scoreBoard").style.display = "none";

  // show ONLY snake button
  document.getElementById("snakeBtn").style.display = "inline-block";
};
/* ===== SNAKE GAME CLICK ===== */
document.getElementById("snakeBtn").onclick = () => {
  overlay.style.display = "none";   // close relax
  window.location.href = "./snake-game/";
};


  /* ===== LEAF GAME ===== */
  function spawnLeaves() {
    leafInterval = setInterval(() => {
      const leaf = document.createElement("div");
      leaf.className = "leaf";
      leaf.textContent = ["🍁", "🍃", "🍂"][Math.floor(Math.random() * 3)];
      leaf.style.left = Math.random() * 100 + "vw";
      leaf.style.animationDuration = (4 + Math.random() * 3) + "s";

      leaf.onclick = () => {
        leaf.style.transition = "0.3s ease";
        leaf.style.transform = "scale(1.6) rotate(180deg)";
        leaf.style.opacity = "0";
        setTimeout(() => leaf.remove(), 300);
        updateScore();
      };

      leafLayer.appendChild(leaf);
      setTimeout(() => leaf.remove(), 8000);
    }, 600);
  }

  /* ===== SCORE ===== */
  function updateScore() {
    score++;
    document.getElementById("scoreBoard").textContent = "Score: " + score;

    if (rewards[score] && !rewarded.has(score)) {
      rewarded.add(score);
      showReward(score);
    }
  }

  /* ===== REWARD POPUP ===== */
  function showReward(value) {
    const r = rewards[value];

    document.getElementById("celeIcon").textContent = r.icon;
    document.getElementById("celeTitle").textContent = r.title;
    document.getElementById("celeMsg").textContent = r.msg;

    document.getElementById("celebration").style.display = "flex";

    document.getElementById("closeCele").onclick = () => {
      document.getElementById("celebration").style.display = "none";

      if (value === 500) {
        if (leafInterval) {
          clearInterval(leafInterval);
          leafInterval = null;
        }
        document.getElementById("scoreBoard").textContent = "Certified ✔️";
      }
    };
  }

  /* ===== RESET GAME ===== */
  function stopGame() {
    if (leafInterval) {
      clearInterval(leafInterval);
      leafInterval = null;
    }
    leafLayer.innerHTML = "";
    score = 0;
    rewarded.clear();
    document.getElementById("scoreBoard").textContent = "Score: 0";
    document.getElementById("relaxText").style.display = "block";
    document.getElementById("gamesBtn").style.display = "inline-block";
  }

});








