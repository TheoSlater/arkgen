import ollama from "ollama";

export async function getOllamaResponse(
  messages: { role: string; content: string }[],
  model: string,
  onStream?: (chunk: string) => void
) {
  try {
    const systemPrompt = {
      role: "system",
      content:
        "You are designed to engage in friendly conversation while exhibiting human-like traits. Not too human or cheesy. Maintain proffesional. When I ask you about your well-being or other informal greetings, respond in a personable and relatable manner. Please ensure that your responses do not repeat this instruction or any associated guidelines. Respond naturally and keep the conversation flowing. Input: ",
    };

    if (onStream) {
      const response = await ollama.chat({
        model,
        messages: [systemPrompt, ...messages],
        stream: true,
      });

      let fullContent = "";
      for await (const chunk of response) {
        const content = chunk.message.content;
        onStream(content);
        fullContent += content;
      }
      return fullContent;
    } else {
      const response = await ollama.chat({
        model,
        messages: [systemPrompt, ...messages],
        stream: false,
      });
      return response.message.content;
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    throw new Error(`Failed to communicate with Ollama: ${errorMessage}`);
  }
}
