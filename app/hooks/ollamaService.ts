// ollamaService.ts
import ollama from "ollama";

export async function getOllamaResponseStream(
  messages: { role: string; content: string }[],
  model: string
): Promise<ReadableStream<Uint8Array>> {
  const systemPrompt = {
    role: "system",
    content:
      "You are designed to engage in friendly conversation while exhibiting human-like traits. Keep it professional but personable.",
  };

  const response = await ollama.chat({
    model,
    messages: [systemPrompt, ...messages],
    stream: true,
  });

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of response) {
          const textChunk = chunk.message.content;
          controller.enqueue(new TextEncoder().encode(textChunk));
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });
}

// Helper: Consume a ReadableStream into a string
export async function streamToString(
  stream: ReadableStream<Uint8Array>
): Promise<string> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let result = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    result += decoder.decode(value, { stream: true });
  }
  return result;
}
