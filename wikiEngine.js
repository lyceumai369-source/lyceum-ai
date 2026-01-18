/* =========================================================
   KNOWLEDGE ENGINE ELITE (v11.0 - The Controller)
   ========================================================= */

const wikiCache = new Map();

// Track Context for Follow-up questions
let currentSubject = {
    topic: null,
    category: null
};

/* ================= UTILITY: CLEANING ================= */

function cleanText(text) {
    return text.toLowerCase()
        .replace(/(pls|please|can you|tell me|who is|what is|how many|search for|find|hey|bro|lyceum)\b/gi, "")
        .replace(/[?.,!]/g, "")
        .trim();
}

function detectFollowUp(userText) {
    const pronouns = /\b(he|she|it|they|him|her|his|its)\b/i;
    return pronouns.test(userText) && currentSubject.topic;
}

/* ================= 1. LIVE WEATHER API ================= */

async function getWeather(userText) {
    const lower = userText.toLowerCase();
    if (!lower.includes("weather") && !lower.includes("temperature")) return null;

    // Clean up city name (Fixes "current weather" bug)
    let city = lower.replace(/weather|temperature|current|today|now|right now| in | at /gi, "").trim();
    if (!city || city === "") city = ""; // Auto-detect location

    try {
        const res = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`);
        const data = await res.json();
        const current = data.current_condition[0];
        const locationName = data.nearest_area[0].areaName[0].value;
        
        return `### 🌦️ Weather in ${locationName}
        
> **Temp:** ${current.temp_C}°C (${current.temp_F}°F)
> **Condition:** ${current.weatherDesc[0].value}
> **Humidity:** ${current.humidity}%
> **Wind:** ${current.windspeedKmph} km/h

*Source: wttr.in*`;
    } catch (e) { return null; }
}

/* ================= 2. SEARCH LAYERS ================= */

// Layer A: Wikipedia
async function searchWikipediaTitle(query) {
    try {
        const url = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=1&namespace=0&format=json&origin=*`;
        const res = await fetch(url);
        const data = await res.json();
        return (data && data[1] && data[1].length > 0) ? data[1][0] : null;
    } catch (e) { return null; }
}

async function getWikiSummary(title) {
    try {
        const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
        const res = await fetch(url);
        if (!res.ok) return null;
        return await res.json();
    } catch (e) { return null; }
}

// Layer B: DuckDuckGo
async function askDuckDuckGo(query) {
    try {
        const res = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1`);
        const data = await res.json();
        if (data.AbstractText) return data.AbstractText;
        if (data.RelatedTopics && data.RelatedTopics.length > 0 && data.RelatedTopics[0].Text) {
            return data.RelatedTopics[0].Text;
        }
        return null;
    } catch (e) { return null; }
}

/* ================= MAIN CONTROLLER ================= */

async function getKnowledge(userText, onLoading) {
    
    // === STEP 1: VISION HOOK ===
    // We check if your "vision.js" file is loaded and has the function
    if (typeof generateImage === "function") {
        const imageResult = await generateImage(userText);
        if (imageResult) return imageResult;
    }

    // === STEP 2: WEATHER CHECK ===
    if (userText.toLowerCase().includes("weather") || userText.toLowerCase().includes("temperature")) {
        if (onLoading) onLoading(true);
        const weather = await getWeather(userText);
        if (onLoading) onLoading(false);
        if (weather) return weather;
    }

    let query = cleanText(userText);
    
    // Smart Follow-up Logic
    if (detectFollowUp(userText)) {
        const queryNoPronoun = query.replace(/\b(he|she|it|they|him|her|his)\b/gi, "").trim();
        query = `${currentSubject.topic} ${queryNoPronoun}`;
    }

    if (!query) return null; // Let fallback.js handle "empty" queries
    
    // Check Cache
    if (wikiCache.has(query)) return wikiCache.get(query);
    if (onLoading) onLoading(true);

    try {
        let response = "";
        let foundAnswer = false;
        
        // === LAYER 1: WIKIPEDIA ===
        const bestTitle = await searchWikipediaTitle(query);
        let wikiData = null;
        if (bestTitle) {
            wikiData = await getWikiSummary(bestTitle);
            if (wikiData && wikiData.type !== "disambiguation") {
                currentSubject = { topic: bestTitle };
                response = `### 📖 ${wikiData.title}\n${wikiData.extract}\n\n`;
                if (wikiData.description) response += `> *${wikiData.description}*`;
                foundAnswer = true;
            }
        }

        // === LAYER 2: DUCKDUCKGO (If Wiki Failed) ===
        if (!foundAnswer) {
            const ddgAnswer = await askDuckDuckGo(query);
            if (ddgAnswer) {
                response = `### 🔍 Answer\n${ddgAnswer}\n\n*Source: Knowledge Web*`;
                foundAnswer = true;
            }
        }

        // === LAYER 3: GOOGLE LINK (If both Failed) ===
        if (!foundAnswer) {
            const googleLink = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
            response = `I couldn't find a direct answer in my database for "**${query}**".\n\n[🔎 Tap here to search Google](${googleLink})`;
            foundAnswer = true;
        }

        // If for some reason even the Google Link logic failed (rare), return null
        // This allows your 'fallback.js' ("I'm still learning") to take over.
        if (!foundAnswer) return null;

        wikiCache.set(query, response);
        return response;

    } catch (err) {
        console.error(err);
        return null; // Triggers fallback.js on error
    } finally {
        if (onLoading) onLoading(false);
    }
}
