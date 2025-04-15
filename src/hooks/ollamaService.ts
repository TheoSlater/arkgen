import ollama from "ollama";

export async function getOllamaResponse(
  messages: { role: string; content: string }[],
  model: string
) {
  try {
    const response = await ollama.chat({
      model,
      messages,
    });

    return response.message.content;
  } catch (error) {
    console.error("Error communicating with Ollama:", error);
    throw error;
  }
}
