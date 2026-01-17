/* =========================================================
   ZENITH OMNI KNOWLEDGE ENGINE (FINAL MERGED VERSION)
   Features:
   - Wikidata-first disambiguation
   - Wikipedia explanation
   - DuckDuckGo fallback
   - Context memory (last 8)
   - Semantic follow-up handling
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
  logoUrl: "https://your-site.com/logo.png"

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

/* ================= QUERY HELPERS ================= */

function cleanQuery(q) {
  return q
    .toLowerCase()
    .replace(
      /(please|pls|tell me|tell|show|explain|find|search|information about|details of|who is|what is|when did|when was|where is|how did|how was)/g,
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

function resolveQuery(userText) {
  const cleaned = cleanQuery(userText);
  const lower = userText.toLowerCase();
  const switchTopic = detectTopicSwitch(userText);

  if (!switchTopic && EngineState.currentTopic) {
    if (/born|birthday|age/i.test(lower))
      return `${EngineState.currentTopic} birth date`;

    if (/death|died|passed away/i.test(lower))
      return `${EngineState.currentTopic} death`;

    if (/when/i.test(lower))
      return `${EngineState.currentTopic} birth`;

    if (/who/i.test(lower))
      return EngineState.currentTopic;

    if (/where/i.test(lower))
      return `${EngineState.currentTopic} place`;

    return EngineState.currentTopic;
  }

  return cleaned || userText;
}


/* ================= WIKIDATA ================= */

async function fetchFromWikidata(query) {
  try {
    const sRes = await fetch(
      `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(query)}&language=en&format=json&origin=*`
    );
    const sData = await sRes.json();
    if (!sData.search?.length) return null;

    const best = sData.search[0];
    const entityId = best.id;

    const claimsRes = await fetch(
      `https://www.wikidata.org/w/api.php?action=wbgetclaims&entity=${entityId}&format=json&origin=*`
    );
    const claimsData = await claimsRes.json();

    return {
      id: entityId,
      label: best.label,
      description: best.description,
      claims: claimsData.claims || {}
    };
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
      Generated on ${new Date().toLocaleDateString()} • Powered by Zenith Engine
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
    const query = resolveQuery(userText);
    if (!query) return "Please ask something specific.";

    if (wikiCache.has(query)) return wikiCache.get(query);

    // 1️⃣ Wikidata grounding
    const data = await fetchFromWikidata(query);

    if (data) {
      EngineState.currentEntityId = data.id;
      remember(userText, data.label);

      // 2️⃣ Wikipedia using verified label
      const wiki = await fetchFromWikipedia(data.label);

      if (wiki && wiki.extract) {
        EngineState.currentData = {
          title: wiki.title,
          extract: wiki.extract
        };

        let answer = `📘 ${wiki.title}\n\n${wiki.extract}\n\n`;
        answer += `---\n**Action:** Generate Certificate (call printCertificate())`;

        wikiCache.set(query, answer);
        return answer;
      }
    }

    // 3️⃣ DuckDuckGo fallback
    const ddg = await fetchFromDuckDuckGo(query);
    if (ddg) {
      const answer = `🦆 ${ddg.title}\n\n${ddg.text}`;
      wikiCache.set(query, answer);
      return answer;
    }

    return "I couldn't find reliable information. Try rephrasing.";

  } catch (e) {
    return "⚠️ Something went wrong. Please try again.";
  } finally {
    if (onLoading) onLoading(false);
  }
}

