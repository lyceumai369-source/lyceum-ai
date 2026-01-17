/* =========================================================
   KNOWLEDGE ENGINE ELITE (v3.0 - Semantic Topic Switching)
   ========================================================= */

const wikiCache = new Map();
const memory = [];
const MAX_MEMORY = 10;

// Internal state to track "Current Active Subject"
let currentSubject = {
    topic: null,
    category: null,
    confidence: 0
};

/* ================= TOPIC SWITCHING LOGIC ================= */

function detectTopicSwitch(newQuery, lastTopic) {
    if (!lastTopic) return true;
    
    // Keywords that suggest we are still talking about the same thing
    const followUpIndicators = /\b(it|he|she|they|its|the|this|that|there|yes|no|more|tell me more|detail|born|died|where|when)\b/i;
    
    // If the new query is very short or contains follow-up pronouns, keep the topic
    if (newQuery.split(" ").length <= 2 && followUpIndicators.test(newQuery)) {
        return false; // No switch
    }
    
    // If query is long and contains new nouns, it's likely a switch
    return true; 
}

/* ================= ENHANCED QUERY PARSER ================= */

function cleanText(text) {
    return text.toLowerCase()
        .replace(/(pls|please|can you|tell me|who is|what is|search for|find)\b/gi, "")
        .replace(/[^\w\s]/g, "")
        .trim();
}

function buildAdvancedQuery(userText) {
    const clean = cleanText(userText);
    const isSwitch = detectTopicSwitch(clean, currentSubject.topic);

    if (!isSwitch && currentSubject.topic) {
        // Advanced Context Merging: "When was he born?" -> "Elon Musk birth date"
        if (/\b(born|birthday|age)\b/i.test(userText)) return `${currentSubject.topic} birth`;
        if (/\b(died|death|passed away)\b/i.test(userText)) return `${currentSubject.topic} death`;
        if (/\b(location|where|place|city|country)\b/i.test(userText)) return `${currentSubject.topic} location`;
        return currentSubject.topic;
    }

    return clean;
}

/* ================= WIKIDATA SEMANTICS ================= */

async function getDeepFacts(query) {
    try {
        const search = await fetch(`https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(query)}&language=en&format=json&origin=*`);
        const searchData = await search.json();
        if (!searchData.search.length) return null;

        const item = searchData.search[0];
        const id = item.id;
        
        // Fetch specific properties: P569 (birth), P570 (death), P18 (image), P1082 (pop), P625 (coords)
        const entity = await fetch(`https://www.wikidata.org/w/api.php?action=wbgetclaims&entity=${id}&format=json&origin=*`);
        const claims = (await entity.json()).claims;

        let facts = [];
        if (claims.P569) facts.push(`🗓️ Date: ${claims.P569[0].mainsnak.datavalue.value.time.substring(1, 11)}`);
        if (claims.P625) facts.push(`📍 Coords: Found`);
        if (claims.P1082) facts.push(`👥 Pop: ${Math.round(claims.P1082[0].mainsnak.datavalue.value.amount).toLocaleString()}`);

        return {
            id,
            label: item.label,
            description: item.description,
            factString: facts.join(" | ")
        };
    } catch (e) { return null; }
}

/* ================= ENGINE CORE ================= */

async function getKnowledge(userText, onLoading) {
    const query = buildAdvancedQuery(userText);
    if (!query) return "I need a bit more info to search that up!";

    // Check Cache
    if (wikiCache.has(query)) return wikiCache.get(query);

    if (onLoading) onLoading(true);

    try {
        // 1. Get Wikidata (Contextual Foundation)
        const data = await getDeepFacts(query);
        
        // Update Global Topic State
        if (data) {
            currentSubject = { topic: data.label, category: data.description, confidence: 1 };
        }

        // 2. Get Wikipedia Summary
        const wikiTarget = data ? data.label : query;
        const wikiRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiTarget)}`);
        const wiki = wikiRes.ok ? await wikiRes.json() : null;

        // 3. Get DuckDuckGo as Fallback/Bonus
        let ddg = null;
        if (!wiki || wiki.type === 'disambiguation') {
            const ddgRes = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1`);
            ddg = await ddgRes.json();
        }

        // 4. Construct Ultimate Response
        let response = "";

        if (wiki && wiki.extract) {
            response = `### 📘 ${wiki.title}\n${wiki.extract}\n\n`;
            if (data && data.factString) response += `> **Data Points:** ${data.factString}\n`;
            response += `\n*Context: ${data?.description || "General Knowledge"}*`;
        } 
        else if (ddg && ddg.AbstractText) {
            response = `### 🦆 ${ddg.Heading}\n${ddg.AbstractText}\n\n*Source: DuckDuckGo*`;
        } 
        else {
            response = "I couldn't find a deep match. Could you specify if you mean a person, place, or thing?";
        }

        // Store Memory
        memory.push({ user: userText, bot: response, topic: currentSubject.topic });
        if (memory.length > MAX_MEMORY) memory.shift();
        
        wikiCache.set(query, response);
        return response;

    } catch (err) {
        return "I encountered a digital hiccup. Try again?";
    } finally {
        if (onLoading) onLoading(false);
    }
}