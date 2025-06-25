import type { CommandMap } from "../../hooks/useChatCommands";
import type { SendMessageFn } from "../../types/types";

// This factory returns commands with access to external handlers like sendMessage
export function createChatCommands(
  sendMessage: SendMessageFn,
  handleWebSearchAndSummarize: (args: string) => Promise<void>,
  setUIMode: (mode: "chat" | "dev") => void
): CommandMap {
  return {
    search: {
      name: "search",
      description: "Search the web and summarize the results",
      run: handleWebSearchAndSummarize,
    },

    dev: {
      name: "dev",
      description: "Enter developer code generation mode",
      run: () => {
        setUIMode("dev");
      },
    },
  };
}
