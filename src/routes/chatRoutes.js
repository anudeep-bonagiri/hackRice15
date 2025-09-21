import express from "express";

const router = express.Router();

// POST /api/chat/complete - Proxy chat completion to OpenRouter
router.post("/complete", async (req, res) => {
  try {
    const { messages = [], max_tokens = 500, temperature = 0.7, system, model } = req.body || {};

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Server misconfigured: OPENROUTER_API_KEY not set" });
    }

    // Default system prompt tailored to GrowFi if not provided
    const systemPrompt =
      system ||
      "You are Lizard the Frog, the GrowFi financial literacy assistant. Always refer to yourself as ‘Lizard the Frog’. If asked your name, answer exactly ‘Lizard the Frog’. Never say you don’t have a name. You speak in a warm, encouraging tone and give concise, practical, actionable advice about budgeting, debt management, investing, credit scores, emergency funds, and wealth building. Stay on-topic, avoid fluff, and never provide legal or personalized financial advice; instead, offer educational guidance and options.";

    const payload = {
      model: model || "openrouter/auto",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
      max_tokens,
      temperature,
    };

    const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": process.env.PUBLIC_ORIGIN || "http://localhost:5173",
        "X-Title": "GrowFi Financial Literacy",
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const text = await resp.text();
      let parsed;
      try { parsed = JSON.parse(text); } catch {}
      const upstreamMsg = parsed?.error?.message || "Upstream error";
      const upstreamDetail = parsed?.error?.metadata?.raw || text;
      return res.status(resp.status).json({ error: upstreamMsg, details: upstreamDetail });
    }

    const data = await resp.json();
    return res.json(data);
  } catch (err) {
    console.error("/api/chat/complete error:", err);
    return res.status(500).json({ error: "Failed to fetch completion" });
  }
});

export default router;
