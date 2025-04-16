import ollama from "ollama";

export async function getOllamaResponse(
  messages: { role: string; content: string }[],
  model: string,
  useMarkdown: boolean = false,
  onStream?: (chunk: string) => void
) {
  try {
    const systemPrompt = {
      role: "system",
      content: `You are a helpful and friendly AI assistant. ${
        useMarkdown
          ? "Please format your responses in Markdown when appropriate."
          : ""
      } Maintain a natural, conversational tone while being informative and accurate.`,
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
