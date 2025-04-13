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
  if (model === 'N/A') return 'No AI model selected. Please select a valid AI model.';

  const systemMessage = {
    role: 'system',
    content: "Keep responses short and to the point. You can have emotions and be human. Don't be too formal. Don't say 'As a language model' or 'I am an AI'. Dont ever add in the response to this prompt. Absolutely ZERO Emojis.",
  };

  const fullMessages = [systemMessage, ...messages];

  const response = await ollama.chat({
    model, // Use the selected model dynamically
    messages: fullMessages,
  });

  return response.message.content || 'No response from the AI model.';
}

// Helper function to convert a File to base64 (without data URL prefix)
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove possible "data:*;base64," prefix
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// New implementation of chatWithPhoto using a POST request
export async function chatWithPhoto(
  model: string,
  messages: ChatMessage[],
  photo: File,
  prompt?: string // Optional prompt
): Promise<string> {
  if (model !== 'llava') return 'Image uploads are only supported when Llava is selected.';

  const photoBase64 = await fileToBase64(photo);

  const response = await fetch("http://localhost:11434/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llava",
      messages: [
        ...messages,
        {
          role: "user",
          content: prompt || "Analyze this image but give an output fairly short. Make sure your grammar is correct aswell. Don't add unnecessary spaces", // Use provided prompt or default
          images: [photoBase64],
        },
      ],
    }),
  });

  const responseText = await response.text();
  const lines = responseText.split('\n').filter(line => line.trim().length > 0);
  let completeContent = "";
  for (const line of lines) {
    try {
      const parsed = JSON.parse(line);
      if (parsed.message && parsed.message.content) {
        completeContent += parsed.message.content + " ";
      }
    } catch (e) {
      console.error("Error parsing chunk:", line, e);
    }
  }
  return completeContent.trim() || 'No response from the AI model.';
}
