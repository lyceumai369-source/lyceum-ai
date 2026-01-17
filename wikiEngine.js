/* =========================================================
   OMNI GLOBAL KNOWLEDGE ENGINE (FINAL)
   Covers:
   - Global current affairs (ANY country)
   - Wikidata role resolution
   - Wikipedia summaries
   - DuckDuckGo fallback
   - Context memory & follow-ups
   - Topic switching
   - Certificate generation
   ========================================================= */

/* ================= GLOBAL STATE ================= */

const wikiCache = new Map();
const MAX_MEMORY = 8;

const EngineState = {
  memory: [],
  currentTopic: null,
  currentEntityId: null,
  currentData: null,
  logoUrl: "logo.png"
};

/* ================= MEMORY ================= */

function remember(userText, topic) {
  EngineState.memory.push({ userText, topic, time: Date.now() });
  if (EngineState.memory.length > MAX_MEMORY) {
    EngineState.memory.shift();
  }
  EngineState.currentTopic = topic;
}

function getLastTopic() {
  return EngineState.currentTopic;
}

/* ================= QUERY NORMALIZATION ================= */

function cleanQuery(text) {
  return text
    .toLowerCase()
    .replace(
      /(please|pls|tell me|tell|show|explain|find|search|information about|details of|who is|what is|when did|when was|where is|how did|how was|current|present|now)/g,
      ""
    )
    .replace(/[^\w\s]/g, "")
    .trim();
}

function isFollowUp(text) {
  return /\b(it|this|that|he|she|they|them|its|his|her|who|when|where|born|death|population|capital|leader|started)\b/i.test(text);
}

function detectTopicSwitch(text) {
  if (!EngineState.currentTopic) return true;
  if (isFollowUp(text)) return false;
  if (text.split(" ").length <= 2) return false;
  return true;
}

/* ================= ROLE + COUNTRY EXTRACTION ================= */

function extractRoleAndCountry(text) {
  const q = text.toLowerCase();

  const roleMap = {
    president: "P35",        // head of state
    "prime minister": "P6",  // head of government
    king: "P35",
    queen: "P35",
    chancellor: "P6"
  };

  let roleProp = null;
  let roleName = null;

  for (const role in roleMap) {
    if (q.includes(role)) {
      roleProp = roleMap[role];
      roleName = role;
      break;
    }
  }

  if (!roleProp) return null;

  const country = q
    .replace(/current|present|woman|female|male|first|of|the|who|is|was|now/g, "")
    .replace(roleName, "")
    .trim();

  if (!country) return null;

  return { roleProp, country };
}

/* ================= WIKIDATA ROLE RESOLUTION ================= */

async function fetchCurrentRoleHolder(roleProp, countryName) {
  try {
    const countryRes = await fetch(
      `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(countryName)}&language=en&format=json&origin=*`
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

/* ================= WIKIDATA ENTITY ================= */

async function fetchFromWikidata(query) {
  try {
    const sRes = await fetch(
      `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(query)}&language=en&format=json&origin=*`
    );
    const sData = await sRes.json();
    if (!sData.search?.length) return null;

    const best = sData.search[0];
    return {
      id: best.id,
      label: best.label,
      description: best.description
    };
  } catch {
    return null;
  }
}

/* ================= WIKIPEDIA ================= */

async function fetchFromWikipedia(title) {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/* ================= DUCKDUCKGO ================= */

async function fetchFromDuckDuckGo(query) {
  try {
    const res = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_redirect=1&no_html=1`
    );
    const data = await res.json();
    if (data.AbstractText) {
      return {
        title: data.Heading,
        text: data.AbstractText
      };
    }
    return null;
  } catch {
    return null;
  }
}

/* ================= CERTIFICATE ================= */

function printCertificate() {
  if (!EngineState.currentData) {
    alert("Search for a topic first!");
    return;
  }

  const data = EngineState.currentData;
  const win = window.open("", "_blank");

  const html = `
  <html>
  <head>
    <title>Knowledge Certificate - ${data.title}</title>
    <style>
      body { font-family: Georgia, serif; text-align: center; padding: 50px; border: 18px solid #2c3e50; }
      .logo { width: 140px; margin-bottom: 20px; }
      .title { font-size: 38px; color: #2c3e50; }
      .topic { font-size: 28px; margin: 20px 0; color: #e67e22; }
      .content { font-size: 18px; text-align: justify; margin: 30px; }
      .footer { margin-top: 40px; font-size: 14px; color: #7f8c8d; }
    </style>
  </head>
  <body>
    ${EngineState.logoUrl ? `<img src="${EngineState.logoUrl}" class="logo">` : ""}
    <div class="title">Certificate of Knowledge</div>
    <div class="topic">${data.title}</div>
    <div class="content">${data.extract}</div>
    <div class="footer">
      Generated on ${new Date().toLocaleDateString()} • Powered by Omni Engine
    </div>
    <script>window.print();</script>
  </body>
  </html>
  `;

  win.document.write(html);
  win.document.close();
}

/* ================= MAIN ENGINE ================= */

async function getKnowledge(userText, onLoading) {
  if (onLoading) onLoading(true);

  try {
    // 1️⃣ Global current affairs (ANY country)
    const roleInfo = extractRoleAndCountry(userText);
    if (roleInfo) {
      const holder = await fetchCurrentRoleHolder(roleInfo.roleProp, roleInfo.country);
      if (holder) {
        return await getKnowledge(holder, onLoading);
      }
    }

    // 2️⃣ Resolve follow-ups
    let query;
    if (!detectTopicSwitch(userText) && EngineState.currentTopic) {
      const lower = userText.toLowerCase();
      if (/born|birth|age|when/i.test(lower)) query = `${EngineState.currentTopic} birth date`;
      else if (/death|died/i.test(lower)) query = `${EngineState.currentTopic} death`;
      else if (/where/i.test(lower)) query = `${EngineState.currentTopic} place`;
      else query = EngineState.currentTopic;
    } else {
      query = cleanQuery(userText);
    }

    if (!query) return "Please ask something specific.";

    if (wikiCache.has(query)) return wikiCache.get(query);

    // 3️⃣ Wikidata grounding
    const data = await fetchFromWikidata(query);
    if (data) {
      remember(userText, data.label);

      // 4️⃣ Wikipedia
      const wiki = await fetchFromWikipedia(data.label);
      if (wiki && wiki.extract) {
        EngineState.currentData = {
          title: wiki.title,
          extract: wiki.extract
        };

        const answer = `📘 ${wiki.title}\n\n${wiki.extract}`;
        wikiCache.set(query, answer);
        return answer;
      }
    }

    // 5️⃣ DuckDuckGo fallback
    const ddg = await fetchFromDuckDuckGo(query);
    if (ddg) {
      const answer = `🦆 ${ddg.title}\n\n${ddg.text}`;
      wikiCache.set(query, answer);
      return answer;
    }

    return "I couldn't find reliable information. Try rephrasing.";

  } catch {
    return "⚠️ Something went wrong. Please try again.";
  } finally {
    if (onLoading) onLoading(false);
  }
}
