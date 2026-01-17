/* =========================================================
   LYCEUM AI – SMART WIKIPEDIA ENGINE
   Features:
   - Keyword extraction
   - Loading state
   - Caching
   ========================================================= */

const wikiCache = {};

/* 🔹 SMART KEYWORD EXTRACTOR */
function extractKeyword(question) {
  return question
    .toLowerCase()
    .replace(/what is|who is|tell me about|explain|define|give me|details of|information about/g, "")
    .replace(/[^\w\s]/g, "")
    .trim();
}

/* 🔹 MAIN SEARCH FUNCTION */
async function searchWikipediaSmart(userQuestion, onLoading) {
  const keyword = extractKeyword(userQuestion);

  if (!keyword) return null;

  /* 🔹 CACHE CHECK */
  if (wikiCache[keyword]) {
    return wikiCache[keyword] + "\n\n⚡ (Loaded from cache)";
  }

  /* 🔹 LOADING CALLBACK */
  if (onLoading) onLoading(true);

  try {
    /* STEP 1: SEARCH */
    const searchUrl =
      `https://en.wikipedia.org/w/api.php?action=query&list=search` +
      `&srsearch=${encodeURIComponent(keyword)}` +
      `&format=json&origin=*`;

    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    if (!searchData.query.search.length) return null;

    const title = searchData.query.search[0].title;

    /* STEP 2: SUMMARY */
    const summaryUrl =
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;

    const summaryRes = await fetch(summaryUrl);
    if (!summaryRes.ok) return null;

    const data = await summaryRes.json();

    const answer = `
📘 ${data.title}

${data.extract}

🔗 Source: Wikipedia
    `.trim();

    /* SAVE TO CACHE */
    wikiCache[keyword] = answer;

    return answer;

  } catch (err) {
    return null;
  } finally {
    if (onLoading) onLoading(false);
  }
}
