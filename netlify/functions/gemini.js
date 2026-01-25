exports.handler = async function (event) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const body = JSON.parse(event.body || "{}");
    const userMessage = body.message;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: userMessage }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    // ✅ FORCE SAFE READ
    let reply = "I am thinking... please ask again.";

    if (
      data &&
      data.candidates &&
      data.candidates.length > 0 &&
      data.candidates[0].content &&
      data.candidates[0].content.parts &&
      data.candidates[0].content.parts.length > 0
    ) {
      reply = data.candidates[0].content.parts[0].text;
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ reply })
    };

  } catch (error) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        reply: "Free AI limit reached. Please try again later."
      })
    };
  }
};
