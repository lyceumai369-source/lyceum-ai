/* =========================================================
   ADVANCED WIKIPEDIA ENGINE
   - Full Wikipedia access
   - Last 10 message memory
   - Follow-up understanding
   ========================================================= */

const wikiCache = {};
const conversationMemory = [];
const MAX_MEMORY = 10;

/* 🧠 SAVE MEMORY */
function saveToMemory(text) {
  conversationMemory.push(text);
  if (conversationMemory.length > MAX_MEMORY) {
    conversationMemory.shift();
  }
}

/* 🧠 GET LAST MEANINGFUL TOPIC */
function getLastTopic() {
  return conversationMemory
    .slice()
    .reverse()
    .find(t => t.length > 3);
}

/* 🧠 CLEAN & NORMALIZE QUESTION */
function normalizeQuestion(q) {
  q = q.toLowerCase();

  q = q.replace(
    /(when|where|who|why|how|what|tell me about|explain|define|details of|information about|give me)/g,
    ""
  );

  q = q.replace(
    /\b(is|was|were|are|did|does|happen|happened|occur|occurred|start|started)\b/g,
    ""
  );

  q = q.replace(/[^\w\s]/g, "").trim();

  return q;
}

/* 🧠 BUILD SEARCH QUERY */
function buildSearchQuery(userText) {
  let query = normalizeQuestion(userText);

  // Follow-up detection
  if (
    /this|that|it|they|movie|film|hit|flop|success|actor|actress|director|year|date/i.test(userText)
  ) {
    const last = getLastTopic();
    if (last) query = last;
  }

  // Intent boosters
  if (/movement|andolan/i.test(userText)) query += " movement";
  if (/act|law|amendment/i.test(userText)) query += " act";
  if (/river/i.test(userText)) query += " river";
  if (/movie|film/i.test(userText)) query += " film";

  return query.trim();
}

/* 🌍 MAIN WIKIPEDIA SEARCH */
async function searchWikipediaAdvanced(userText, onLoading) {
  saveToMemory(userText);

  const query = buildSearchQuery(userText);
  if (!query) return null;

  // Cache
  if (wikiCache[query]) {
    return wikiCache[query] + "\n\n⚡ (from memory)";
  }

  if (onLoading) onLoading(true);

  try {
    const searchUrl =
      `https://en.wikipedia.org/w/api.php?action=query&list=search` +
      `&srsearch=${encodeURIComponent(query)}` +
      `&format=json&origin=*`;

    const res = await fetch(searchUrl);
    const data = await res.json();

    if (!data.query.search.length) return null;

    const bestTitle = data.query.search[0].title;

    const summaryUrl =
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(bestTitle)}`;

    const sRes = await fetch(summaryUrl);
    if (!sRes.ok) return null;

    const summary = await sRes.json();

    const answer = `
📘 ${summary.title}

${summary.extract}

🔗 Source: Wikipedia
    `.trim();

    wikiCache[query] = answer;
    return answer;

  } catch (e) {
    return null;
  } finally {
    if (onLoading) onLoading(false);
  }
}
