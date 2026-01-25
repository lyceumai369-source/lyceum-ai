// 🧠 Simple in-memory memory (per user IP)
const memoryStore = {};

exports.handler = async function (event) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 200,
        body: JSON.stringify({ reply: "AI key missing." })
      };
    }

    const body = JSON.parse(event.body || "{}");
    const userMessage = body.message;

    // 🧍 Identify user by IP (basic session memory)
    const userId =
      event.headers["x-forwarded-for"] ||
      event.headers["client-ip"] ||
      "anonymous";

    // Initialize memory if not exists
    if (!memoryStore[userId]) {
      memoryStore[userId] = [];
    }

    // Add user message to memory
    memoryStore[userId].push({
      role: "user",
      content: userMessage
    });

    // Keep only last 6 messages (memory limit)
    memoryStore[userId] = memoryStore[userId].slice(-6);

    // 🧠 System personality (THIS MAKES IT HUMAN)
    const systemPrompt = {
      role: "system",
      content: `
You are Lyceum AI.
You speak in a friendly, calm, human way.
You explain things simply, like talking to a friend.
You may call the user "bro" casually.
Do not sound robotic.
Be encouraging, warm, and clear.
      `
    };

    const messages = [systemPrompt, ...memoryStore[userId]];

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages,
          temperature: 0.7
        })
      }
    );

    const data = await response.json();

    const reply =
      data?.choices?.[0]?.message?.content ||
      "Sorry bro, I couldn’t think of a reply right now.";

    // Add assistant reply to memory
    memoryStore[userId].push({
      role: "assistant",
      content: reply
    });

    memoryStore[userId] = memoryStore[userId].slice(-6);

    return {
      statusCode: 200,
      body: JSON.stringify({ reply })
    };

  } catch (error) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        reply: "Something went wrong bro, try again."
      })
    };
  }
};
