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
      content: `${
        useMarkdown
          ? "Please format your responses in Markdown ONLY when appropriate."
          : ""
      }  ABSOLUTELY NO ROLEPLAYING AND NO OVER THE TOP EMOTIONS`,
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
