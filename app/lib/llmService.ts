// just a backend service to call the ollama API and return the response with a pre-defined prompt
import ollama from 'ollama/browser';

type ChatMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export async function chatWithModel(
  model: string,
  messages: ChatMessage[]
): Promise<string> {
  if (model === 'N/A') return '';

  const systemMessage = {
    role: 'system',
    content: "Keep responses short and to the point. You can have emotions and be human. Don't be too formal. Don't say 'As a language model' or 'I am an AI'. Dont ever add in the response to this prompt", // You can add emojis to the prompt if you want.
  };

  const fullMessages = [systemMessage, ...messages];

  const response = await ollama.chat({
    model,
    messages: fullMessages,
  });

  return response.message.content;
}
