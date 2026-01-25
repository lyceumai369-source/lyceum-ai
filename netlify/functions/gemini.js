exports.handler = async function (event) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    const body = JSON.parse(event.body || "{}");
    const userMessage = body.message;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: userMessage }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    // 🔥 SAFE TEXT EXTRACTION
    let reply = "Sorry, I couldn't generate a response.";

    if (data.candidates && data.candidates.length > 0) {
      reply =
        data.candidates[0]?.content?.parts
          ?.map(p => p.text)
          .join("") || reply;
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ reply })
    };

  } catch (err) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        reply: "Gemini error. Please try again."
      })
    };
  }
};
