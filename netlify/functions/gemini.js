exports.handler = async function (event) {
  try {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 200,
        body: JSON.stringify({ reply: "❌ GROQ_API_KEY missing in Netlify." })
      };
    }

    const body = JSON.parse(event.body || "{}");
    const userMessage = body.message;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
         model: "llama-3.1-8b-instant",

          messages: [
            {
              role: "system",
              content:
                "You are Lyceum AI. Speak like a friendly human. Explain things simply. Call the user dear."
            },
            {
              role: "user",
              content: userMessage
            }
          ],
          temperature: 0.6,
          max_tokens: 300
        })
      }
    );

    const data = await response.json();

    // 🔥 SHOW REAL GROQ ERROR IF ANY
    if (data.error) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          reply: `Groq error: ${data.error.message}`
        })
      };
    }

    if (!data.choices || !data.choices.length) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          reply: "Groq returned no choices. Try again."
        })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        reply: data.choices[0].message.content
      })
    };

  } catch (err) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        reply: "Server error: " + err.message
      })
    };
  }
};
