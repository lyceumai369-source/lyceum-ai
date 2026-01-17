/* =========================================================
   FINAL USER-FRIENDLY KNOWLEDGE ENGINE
   - Intent aware (what/when/where/who/how/points)
   - Topic extraction (911, Plassey, Quit India)
   - Historical events
   - Global current affairs (ANY country)
   - Follow-up understanding
   - Safe fallback with Google link
   ========================================================= */

const EngineState = {
  lastTopic: null
};

/* ================= GOOGLE FALLBACK ================= */

function googleLink(query) {
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

/* ================= INTENT DETECTION ================= */

function detectIntent(text) {
  const q = text.toLowerCase();

  if (q.startsWith("when")) return "WHEN";
  if (q.startsWith("where")) return "WHERE";
  if (q.startsWith("who")) return "WHO";
  if (q.startsWith("why")) return "WHY";
  if (q.startsWith("how")) return "HOW";
  if (q.includes("points") || q.includes("list")) return "POINTS";
  if (q.includes("describe") || q.includes("explain") || q.includes("detail"))
    return "DESCRIBE";

  return "GENERAL";
}

/* ================= TOPIC EXTRACTION ================= */

function extractTopic(text) {
  return text
    .replace(/^(when|where|who|what|why|how|which)\b/gi, "")
    .replace(/(happen|happened|did|does|is|are|was|were|about|the|of|in)/gi, "")
    .replace(/[^\w\s/]/g, "")
    .trim();
}

/* ================= FOLLOW-UP HANDLING ================= */

function resolveTopic(text) {
  const lower = text.toLowerCase();
  if (
    EngineState.lastTopic &&
    /\b(it|this|that|he|she|they|when|where|who)\b/.test(lower)
  ) {
    return EngineState.lastTopic;
  }
  return extractTopic(text);
}

/* ================= CURRENT AFFAIRS (GLOBAL) ================= */

async function resolveRoleQuestion(text) {
  const q = text.toLowerCase();

  const roles = {
    president: "P35",
    "prime minister": "P6",
    king: "P35",
    queen: "P35"
  };

  let roleProp = null;
  let roleWord = null;

  for (const r in roles) {
    if (q.includes(r)) {
      roleProp = roles[r];
      roleWord = r;
      break;
    }
  }

  if (!roleProp) return null;

  const country = q
    .replace(/current|present|woman|female|of|the|who|is|now/g, "")
    .replace(roleWord, "")
    .trim();

  if (!country) return null;

  try {
    const countryRes = await fetch(
      `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(
        country
      )}&language=en&format=json&origin=*`
    );
    const countryData = await countryRes.json();
    if (!countryData.search?.length) return null;

    const countryId = countryData.search[0].id;

    const claimsRes = await fetch(
      `https://www.wikidata.org/w/api.php?action=wbgetclaims&entity=${countryId}&property=${roleProp}&format=json&origin=*`
    );
    const claimsData = await claimsRes.json();

    const claims = claimsData.claims?.[roleProp];
    if (!claims?.length) return null;

    const holderId = claims[0].mainsnak.datavalue.value.id;

    const entityRes = await fetch(
      `https://www.wikidata.org/wiki/Special:EntityData/${holderId}.json`
    );
    const entityData = await entityRes.json();

    return entityData.entities[holderId].labels.en.value;
  } catch {
    return null;
  }
}

/* ================= WIKIPEDIA ================= */

async function fetchWikipedia(topic) {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
        topic
      )}`
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/* ================= MAIN ENGINE ================= */

async function getKnowledge(userText) {
  // 1️⃣ Global current affairs
  const roleResolved = await resolveRoleQuestion(userText);
  if (roleResolved) {
    return await getKnowledge(roleResolved);
  }

  // 2️⃣ Intent & topic
  const intent = detectIntent(userText);
  const topic = resolveTopic(userText);

  if (!topic) {
    return `🤔 I couldn’t clearly understand the topic.

🔎 Try searching here:
${googleLink(userText)}`;
  }

  // 3️⃣ Wikipedia
  const wiki = await fetchWikipedia(topic);

  if (!wiki || !wiki.extract) {
    return `🤔 I don’t have a confirmed answer for this right now.

🔎 You can search this exact topic on Google:
${googleLink(userText)}

💡 Tip: Try adding words like "when", "who", "history", or "definition".`;
  }

  EngineState.lastTopic = wiki.title;
  let answer = wiki.extract;

  // 4️⃣ Intent-based filtering
  if (intent === "WHEN") {
    const date =
      wiki.extract.match(/\b\d{1,2}\s\w+\s\d{4}\b/) ||
      wiki.extract.match(/\b\d{4}\b/);
    if (date) {
      answer = `📅 ${wiki.title} happened in ${date[0]}.`;
    }
  }

  if (intent === "WHERE") {
    answer = wiki.extract.split(".")[0] + ".";
  }

  if (intent === "POINTS") {
    answer = wiki.extract
      .split(". ")
      .slice(0, 5)
      .map((p, i) => `${i + 1}. ${p}`)
      .join("\n");
  }

  if (intent === "DESCRIBE" || intent === "GENERAL") {
    answer = wiki.extract;
  }

  return `📘 ${wiki.title}\n\n${answer}`;
}
function googleButton(query) {
  const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  return `
  <a href="${url}" target="_blank" style="
    display:inline-block;
    margin-top:8px;
    padding:8px 14px;
    background:#4285F4;
    color:#fff;
    text-decoration:none;
    border-radius:6px;
    font-weight:600;
  ">
    🔎 Search on Google
  </a>`;
}
