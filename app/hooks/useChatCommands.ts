import { useCallback } from "react";

export interface Command {
  name: string;
  description?: string;
  run: (args: string) => void | Promise<void>;
}

export type CommandMap = Record<string, Command>;

export function useChatCommands(commandHandlers: Partial<CommandMap>) {
  const parseCommand = useCallback(
    async (input: string): Promise<boolean> => {
      if (!input.startsWith("/")) return false;

      const parts = input.trim().split(" ");
      const commandName = parts[0].substring(1);
      const args = input;

      const command = commandHandlers[commandName];
      if (!command) {
        console.warn(`Unknown command: /${commandName}`);
        return false;
      }

      await command.run(args);
      return true;
    },
    [commandHandlers]
  );

  return { parseCommand };
}
