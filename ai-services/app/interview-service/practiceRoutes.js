import express from "express";
import { generateLLMResponse } from "../config/openrouter.js";

const router = express.Router();

router.post("/generate", async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "Topic is required" });
    }

    const prompt = `
Generate 10 interview questions about ${topic}.
Return ONLY a JSON array.
Example:
["Question1","Question2"]
`;

    const result = await generateLLMResponse([
      {
        role: "user",
        content: prompt
      }
    ]);

    console.log("RAW RESULT:", result);

    let cleaned = result.trim();
    cleaned = cleaned.replace(/```json|```/g, "");

    const match = cleaned.match(/\[.*\]/s);

    if (!match) {
      throw new Error("Invalid JSON format from LLM");
    }

    const questions = JSON.parse(match[0]);

    res.json({ questions });

  } catch (error) {
    console.error("FULL ERROR:", error);
    res.status(500).json({ error: "Failed to generate questions" });
  }
});

export default router;