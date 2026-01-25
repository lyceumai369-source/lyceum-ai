import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

app.post("/ask", async (req, res) => {
  try {
    const message = req.body.message;
    if (!message) {
      return res.json({ reply: "No message received" });
    }

    const grokRes = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROK_API_KEY}`
      },
      body: JSON.stringify({
        model: "grok-2",
        messages: [{ role: "user", content: message }]
      })
    });

    const data = await grokRes.json();

    res.json({
      reply: data?.choices?.[0]?.message?.content || "No reply"
    });
  } catch (err) {
    res.json({ reply: "Network issue, try again" });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
