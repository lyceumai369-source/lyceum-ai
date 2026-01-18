/* =========================================================
   KNOWLEDGE ENGINE ELITE (v6.0 - Weather + Smart Web)
   ========================================================= */

const wikiCache = new Map();
const memory = [];
const MAX_MEMORY = 10;

// Track Context
let currentSubject = {
    topic: null,
    category: null
};

/* ================= UTILITY: CLEANING ================= */

function cleanText(text) {
    return text.toLowerCase()
        .replace(/(pls|please|can you|tell me|who is|what is|how many|search for|find|hey|bro|lyceum|weather in|temperature in)\b/gi, "")
        .replace(/[?.,!]/g, "")
        .trim();
}

function detectFollowUp(userText) {
    const pronouns = /\b(he|she|it|they|him|her|his|its)\b/i;
    return pronouns.test(userText) && currentSubject.topic;
}

/* ================= 1. LIVE WEATHER API (New Feature) ================= */

async function getWeather(query) {
    // Check if user is asking for weather
    if (!query.includes("weather") && !query.includes("temperature")) return null;
    
    // Extract city name (simple logic)
    const city = query.replace("weather", "").replace("temperature", "").trim();
    if (!city) return null;

    try {
        // wttr.in is a free weather API
        const res = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`);
        const data = await res.json();
        const current = data.current_condition[0];
        
        return `### 🌦️ Weather in ${city.toUpperCase()}
        
> **Temp:** ${current.temp_C}°C (${current.temp_F}°F)
> **Condition:** ${current.weatherDesc[0].value}
> **Humidity:** ${current.humidity}%
> **Wind:** ${current.windspeedKmph} km/h

*Source: wttr.in*`;
    } catch (e) {
        return null; 
    }
}

/* ================= 2. WIKIPEDIA SMART SEARCH ================= */

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

/* ================= 3. DUCKDUCKGO FALLBACK ================= */

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

/* ================= MAIN ENGINE ================= */

async function getKnowledge(userText, onLoading) {
    // 1. Check for Weather Request FIRST
    if (userText.toLowerCase().includes("weather")) {
        if (onLoading) onLoading(true);
        const weather = await getWeather(userText.toLowerCase());
        if (onLoading) onLoading(false);
        if (weather) return weather;
    }

    let query = cleanText(userText);
    
    // Smart Context Switching (Follow-ups)
    if (detectFollowUp(userText)) {
        const queryNoPronoun = query.replace(/\b(he|she|it|they|him|her|his)\b/gi, "").trim();
        query = `${currentSubject.topic} ${queryNoPronoun}`;
    }

    if (!query) return "I'm listening... what do you want to know?";
    
    // Check Cache
    if (wikiCache.has(query)) return wikiCache.get(query);
    if (onLoading) onLoading(true);

    try {
        let response = "";
        
        // STEP 1: Search Wikipedia Title
        const bestTitle = await searchWikipediaTitle(query);
        let wikiData = null;
        
        if (bestTitle) {
            wikiData = await getWikiSummary(bestTitle);
            currentSubject = { topic: bestTitle };
        }

        // STEP 2: Try DuckDuckGo
        let ddgAnswer = null;
        if (!wikiData || wikiData.type === "disambiguation") {
            ddgAnswer = await askDuckDuckGo(query);
        }

        // STEP 3: Construct Response OR Google Fallback
        if (wikiData && wikiData.extract) {
            response = `### 📖 ${wikiData.title}\n${wikiData.extract}\n\n`;
            if (wikiData.description) response += `> *${wikiData.description}*`;
        } 
        else if (ddgAnswer) {
            response = `### 🔍 Answer\n${ddgAnswer}\n\n*Source: Knowledge Web*`;
        } 
        else {
            // === NEW: GOOGLE SEARCH LINK ===
            // Since we can't read Google directly, we give the user a direct link
            const googleLink = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
            response = `I couldn't find a direct answer in my database. \n\n[Tap here to search Google for "${query}"](${googleLink})`;
        }

        // Save to memory
        wikiCache.set(query, response);
        return response;

    } catch (err) {
        console.error(err);
        return "I'm having trouble connecting to the knowledge base.";
    } finally {
        if (onLoading) onLoading(false);
    }
}
