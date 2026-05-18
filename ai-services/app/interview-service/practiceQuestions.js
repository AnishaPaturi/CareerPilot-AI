// import express from "express";
// import OpenAI from "openai";

// const router = express.Router();

// const client = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// router.post("/", async (req, res) => {
//   try {
//     const { topic } = req.body;

//     const completion = await client.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [
//         {
//           role: "system",
//           content:
//             "You are a technical interviewer generating coding interview questions.",
//         },
//         {
//           role: "user",
//           content: `Generate 10 interview questions about ${topic}. Return them ONLY as a JSON array of strings.`,
//         },
//       ],
//     });

//     const text = completion.choices[0].message.content;

//     const questions = JSON.parse(text);

//     res.json({ questions });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to generate questions" });
//   }
// });

// export default router;