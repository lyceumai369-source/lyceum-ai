
const memoryStore = {};

exports.handler = async function (event) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 200,
        body: JSON.stringify({ reply: "Groq API key missing." })
      };
    }

    const body = JSON.parse(event.body || "{}");
    const userMessage = body.message;

    const userId =
      event.headers["x-forwarded-for"] ||
      event.headers["client-ip"] ||
      "anon";

    if (!memoryStore[userId]) {
      memoryStore[userId] = [];
    }

    // Add user message
    memoryStore[userId].push({
      role: "user",
      content: userMessage
    });

    // Keep only last 4 messages (safer)
    memoryStore[userId] = memoryStore[userId].slice(-4);

    const messages = [
      {
        role: "system",
        content:
          "You are Lyceum AI. Speak like a calm, friendly human. Explain things simply. Call the user bro casually."
      },
      ...memoryStore[userId]
    ];

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages,
          temperature: 0.6,
          max_tokens: 300
        })
      }
    );

    const data = await response.json();

    const reply =
      data?.choices?.[0]?.message?.content ||
      "Bro, I’m a bit stuck. Try asking again.";

    // Save assistant reply
    memoryStore[userId].push({
      role: "assistant",
      content: reply
    });

    memoryStore[userId] = memoryStore[userId].slice(-4);

    return {
      statusCode: 200,
      body: JSON.stringify({ reply })
    };

  } catch (err) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        reply: "Something went wrong bro, please try again."
      })
    };
  }
};
