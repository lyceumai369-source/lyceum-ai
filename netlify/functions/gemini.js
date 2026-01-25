export default async (req, context) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    const body = await req.json();
    const userMessage = body.message;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + apiKey,
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

    return new Response(
      JSON.stringify({
        reply: data.candidates[0].content.parts[0].text
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Gemini error" }),
      { status: 500 }
    );
  }
};
