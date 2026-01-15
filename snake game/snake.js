const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("scoreVal");
const bossUI = document.getElementById("bossUI");

let dpr = window.devicePixelRatio || 1;

function resize() {
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener("resize", resize);
resize();

let grid = 25;
let score = 0;
let d = "RIGHT";
let gameActive = false;

let snake = [
    { x: grid * 5, y: grid * 10 },
    { x: grid * 4, y: grid * 10 }
];

let frog = { x: grid * 10, y: grid * 10 };
let boss = null;

let bossTimerInt = null;
let frogMoveInt = null;

// ================= FULLSCREEN =================
function toggleFullScreen() {
    const el = document.getElementById("gameWrapper");
    if (!document.fullscreenElement) el.requestFullscreen();
    else document.exitFullscreen();
}

// ================= CONTROLS =================
document.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft" && d !== "RIGHT") d = "LEFT";
    if (e.key === "ArrowUp" && d !== "DOWN") d = "UP";
    if (e.key === "ArrowRight" && d !== "LEFT") d = "RIGHT";
    if (e.key === "ArrowDown" && d !== "UP") d = "DOWN";
});

let touchStartX = 0, touchStartY = 0;
canvas.addEventListener("touchstart", e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

canvas.addEventListener("touchend", e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;

    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0 && d !== "LEFT") d = "RIGHT";
        else if (dx < 0 && d !== "RIGHT") d = "LEFT";
    } else {
        if (dy > 0 && d !== "UP") d = "DOWN";
        else if (dy < 0 && d !== "DOWN") d = "UP";
    }
});

// ================= GAME START =================
function startGame() {
    document.getElementById("startScreen").classList.add("hidden");
    gameActive = true;
    lastTime = 0;
    requestAnimationFrame(gameLoop);
}

// ================= GAME LOOP (SMOOTH) =================
let lastTime = 0;
let speed = 120;
let accumulator = 0;

function gameLoop(time) {
    if (!gameActive) return;

    const delta = time - lastTime;
    lastTime = time;
    accumulator += delta;

    if (accumulator > speed) {
        update();
        accumulator = 0;
    }

    draw();
    requestAnimationFrame(gameLoop);
}

// ================= LOGIC =================
function spawnFrog() {
    frog = {
        x: Math.floor(Math.random() * (canvas.width / dpr / grid - 1)) * grid,
        y: Math.floor(Math.random() * (canvas.height / dpr / grid - 1)) * grid
    };
}

function update() {
    let hX = snake[0].x;
    let hY = snake[0].y;

    if (d === "LEFT") hX -= grid;
    if (d === "RIGHT") hX += grid;
    if (d === "UP") hY -= grid;
    if (d === "DOWN") hY += grid;

    const maxX = Math.floor(canvas.width / dpr / grid) * grid;
    const maxY = Math.floor(canvas.height / dpr / grid) * grid;

    if (hX < 0) hX = maxX - grid;
    if (hX >= maxX) hX = 0;
    if (hY < 0) hY = maxY - grid;
    if (hY >= maxY) hY = 0;

    const newHead = { x: hX, y: hY };

    if (snake.some(p => p.x === newHead.x && p.y === newHead.y)) {
        location.reload();
        return;
    }

    // ===== BOSS HIT =====
    if (boss && Math.abs(hX - boss.x) < grid * 1.5 && Math.abs(hY - boss.y) < grid * 1.5) {
        score += 25;
        scoreEl.innerText = score;
        hideBoss();
        checkTriggerPoints();
    }

    // ===== FROG EAT =====
    if (hX === frog.x && hY === frog.y) {
        score++;
        scoreEl.innerText = score;
        spawnFrog();

        if (score % 2 !== 0) snake.pop();
        if (score % 10 === 0 && score < 180) spawnBoss();

        checkTriggerPoints();
    } else {
        snake.pop();
    }

    snake.unshift(newHead);
}

// ================= TRIGGERS =================
function checkTriggerPoints() {
    // ✅ CORRECT LOGIC: Frog moves AFTER 180
    if (score >= 180 && score < 200) {
        hideBoss();
        if (!frogMoveInt) {
            frogMoveInt = setInterval(spawnFrog, 3000);
        }
    }

    if (score >= 200) endGame();
    else if (score === 50 || score === 100 || score === 150) triggerMilestone();
}

// ================= BOSS =================
function spawnBoss() {
    if (score >= 180) return;

    boss = {
        x: Math.floor(Math.random() * (canvas.width / dpr / grid - 2)) * grid,
        y: Math.floor(Math.random() * (canvas.height / dpr / grid - 2)) * grid
    };

    let time = 10;
    bossUI.classList.remove("hidden");
    document.getElementById("timer").innerText = time;

    bossTimerInt = setInterval(() => {
        time--;
        document.getElementById("timer").innerText = time;
        if (time <= 0) hideBoss();
    }, 1000);
}

function hideBoss() {
    clearInterval(bossTimerInt);
    boss = null;
    bossUI.classList.add("hidden");
}

// ================= DRAW =================
function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = "24px Arial";
    ctx.fillText("🐸", frog.x, frog.y + 22);

    if (boss) {
        ctx.font = "40px Arial";
        ctx.fillText("🐲", boss.x, boss.y + 35);
    }

    snake.forEach((p, i) => {
        ctx.fillStyle = i === 0 ? "#00FF41" : "#008F11";
        ctx.beginPath();
        ctx.roundRect(p.x, p.y, grid - 2, grid - 2, i === 0 ? 10 : 5);
        ctx.fill();
    });
}

// ================= UI =================
function triggerMilestone() {
    gameActive = false;
    document.getElementById("milestonePopup").classList.remove("hidden");
}

function resumeGame() {
    document.getElementById("milestonePopup").classList.add("hidden");
    gameActive = true;
    requestAnimationFrame(gameLoop);
}

function endGame() {
    gameActive = false;
    clearInterval(frogMoveInt);
    document.getElementById("certOverlay").classList.remove("hidden");

    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const b = document.createElement("div");
            b.className = "snake-baby";
            b.innerText = "🐍";
            b.style.left = Math.random() * 90 + "vw";
            document.getElementById("babyContainer").appendChild(b);
        }, i * 250);
    }

    let n = prompt("CORPORATE MASTERY! Enter Name:") || "OPERATIVE";
    document.getElementById("finalName").innerText = n.toUpperCase();
    document.getElementById("currDate").innerText = new Date().toLocaleDateString();
    document.getElementById("certID").innerText = "LYC-CORP-" + Math.floor(Math.random() * 90000 + 10000);

    setTimeout(() => {
        document.getElementById("downloadBtn").classList.remove("hidden");
    }, 4000);
}

function downloadCert() {
    html2canvas(document.querySelector("#certificate"), { scale: 2 }).then(c => {
        const a = document.createElement("a");
        a.download = "Lyceum_Corporate_certificate.png";
        a.href = c.toDataURL();
        a.click();
    });
}
