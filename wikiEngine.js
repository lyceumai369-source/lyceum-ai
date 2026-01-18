/* =========================================================
   KNOWLEDGE ENGINE ELITE (v14.0 - Clean Output)
   ========================================================= */

const wikiCache = new Map();
let currentSubject = { topic: null };

function cleanText(text) {
    return text.toLowerCase()
        .replace(/(pls|please|can you|tell me|who is|what is|how many|search for|find|hey|bro|lyceum)\b/gi, "")
        .replace(/[?.,!]/g, "").trim();
}

function detectFollowUp(userText) {
    const pronouns = /\b(he|she|it|they|him|her|his|its)\b/i;
    return pronouns.test(userText) && currentSubject.topic;
}

/* ================= 1. VISION ENGINE ================= */
async function generateImage(userText) {
    const triggers = ["imagine", "generate", "draw", "create", "picture of", "photo of", "image of", "make a pic", "make a picture"];
    const lower = userText.toLowerCase();
    
    if (!triggers.some(t => lower.includes(t))) return null; 

    let prompt = lower;
    triggers.forEach(t => prompt = prompt.replace(t, ""));
    prompt = prompt.trim();

    if (prompt.length < 2) return "Please describe what to draw! (e.g., 'Create a red car')";

    // Generate URL (Random seed for uniqueness)
    const seed = Math.floor(Math.random() * 10000);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?nologo=true&seed=${seed}&width=1024&height=1024`;

    // JUST return the Image Code. UI.js will handle the Loader & Watermark.
    return `![${prompt}](${imageUrl})`;
}

/* ================= 2. WEATHER & SEARCH ================= */
async function getWeather(text) {
    if (!text.includes("weather") && !text.includes("temperature")) return null;
    let city = text.replace(/weather|temperature|current|today|now| in | at /gi, "").trim();
    try {
        const res = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`);
        const data = await res.json();
        const cur = data.current_condition[0];
        return `### 🌦️ Weather in ${data.nearest_area[0].areaName[0].value}\n> **Temp:** ${cur.temp_C}°C\n> **Wind:** ${cur.windspeedKmph} km/h\n> **Condition:** ${cur.weatherDesc[0].value}`;
    } catch (e) { return null; }
}

async function getKnowledge(text, onLoading) {
    const img = await generateImage(text);
    if (img) return img;

    const weather = await getWeather(text.toLowerCase());
    if (weather) return weather;

    let query = cleanText(text);
    if (detectFollowUp(text)) query = `${currentSubject.topic} ${query.replace(/\b(he|she|it|they|him|her|his)\b/gi, "")}`;
    if (!query) return null;

    if (wikiCache.has(query)) return wikiCache.get(query);
    if (onLoading) onLoading(true);

    try {
        // Wikipedia Search
        const wikiRes = await fetch(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${query}&limit=1&format=json&origin=*`).then(r=>r.json());
        const title = (wikiRes[1] && wikiRes[1][0]) ? wikiRes[1][0] : null;

        let response = null;
        if (title) {
            const summary = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`).then(r=>r.json());
            if (summary.extract && summary.type !== "disambiguation") {
                currentSubject = { topic: title };
                response = `### 📖 ${summary.title}\n${summary.extract}`;
            }
        }
        
        // Fallback: Google Link
        if (!response) {
            response = `I couldn't find a direct answer.\n\n[🔎 Search Google for "${query}"](https://www.google.com/search?q=${encodeURIComponent(query)})`;
        }

        wikiCache.set(query, response);
        return response;
    } catch (e) { return null; } 
    finally { if (onLoading) onLoading(false); }
}
