"use client";

import { useState, useCallback, useRef } from "react";
import type { UIMessage } from "ai";
import { DefaultChatTransport, readUIMessageStream } from "ai";

interface UseChatOptions {
  api?: string;
}

interface UseChatReturn {
  messages: UIMessage[];
  append: (message: { role: "user"; content: string }) => Promise<void>;
  isLoading: boolean;
  setMessages: (messages: UIMessage[]) => void;
}

let messageCounter = 0;
function generateId(): string {
  return `msg-${Date.now()}-${++messageCounter}`;
}

export function useChat(options?: UseChatOptions): UseChatReturn {
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const transportRef = useRef<DefaultChatTransport<UIMessage>>(
    new DefaultChatTransport({
      api: options?.api ?? "/api/chat",
    })
  );

  const append = useCallback(
    async (message: { role: "user"; content: string }) => {
      const userMessage: UIMessage = {
        id: generateId(),
        role: message.role,
        parts: [{ type: "text" as const, text: message.content }],
      };

      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setIsLoading(true);

      try {
        const stream = await transportRef.current.sendMessages({
          trigger: "submit-message",
          chatId: "default",
          messageId: undefined,
          messages: updatedMessages,
          abortSignal: undefined,
        });

        const messageStream = readUIMessageStream({ stream });

        let latestAssistantMessage: UIMessage | undefined;
        for await (const assistantMessage of messageStream) {
          latestAssistantMessage = assistantMessage;
          setMessages([...updatedMessages, assistantMessage]);
        }

        if (!latestAssistantMessage) {
          setMessages(updatedMessages);
        }
      } catch (error) {
        console.error("Chat error:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [messages]
  );

  return { messages, append, isLoading, setMessages };
}
