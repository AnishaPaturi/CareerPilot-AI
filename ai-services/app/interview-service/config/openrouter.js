export const generateLLMResponse = async (messages) => {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: messages
      })
    });

    const data = await response.json();

    // 🔍 Debug log (VERY IMPORTANT)
    console.log("OPENROUTER RAW RESPONSE:", JSON.stringify(data, null, 2));

    // ❌ Handle API errors properly
    if (!response.ok) {
      throw new Error(data.error?.message || "OpenRouter API failed");
    }

    // ❌ Handle unexpected structure
    if (!data.choices || !data.choices[0]?.message?.content) {
      throw new Error("Invalid response format from OpenRouter");
    }

    // ✅ Return ONLY the content
    return data.choices[0].message.content;

  } catch (error) {
    console.error("OPENROUTER ERROR:", error.message);
    throw error;
  }
};