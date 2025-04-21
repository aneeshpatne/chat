// ✅ LAYOUT: app/chat/layout.jsx
"use client";

import { useChat } from "@ai-sdk/react";
import { createContext, useContext, useState, useEffect } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";

export const ChatContext = createContext(null);

export default function ChatLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { id: sessionId } = useParams();

  const [pendingMessage, setPendingMessage] = useState(null);
  const [model, setModel] = useState({
    name: "4.1 Nano",
    id: "gpt-4.1-nano",
    provider: "openai",
  });

  const [token, setToken] = useState({});

  const chat = useChat({
    id: sessionId,
    sendExtraMessageFields: true,
    onError: (error) => console.error("Chat error:", error),
    onFinish: (message, options) => {
      setToken((prevTokens) => {
        return {
          ...prevTokens,
          [message.id]: {
            completionTokens: options.usage.completionTokens,
            promptTokens: options.usage.promptTokens,
            totalTokens: options.usage.totalTokens,
          },
        };
      });
    },
  });

  const { append, input, handleInputChange } = chat;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!sessionId) {
      const message = input;
      handleInputChange({ target: { value: "" } });
      setPendingMessage(message);

      const res = await fetch("/api/session");
      const data = await res.json();
      router.push(`/chat/${data.sessionId}`);
    } else {
      chat.handleSubmit(e, {
        data: { model: model.id, provider: model.provider },
      });
    }
  };

  useEffect(() => {
    if (sessionId && pendingMessage) {
      append(
        { role: "user", content: pendingMessage },
        { data: { model: model.id, provider: model.provider } }
      );
      setPendingMessage(null);
    }
  }, [sessionId, pendingMessage, append, model]);

  return (
    <ChatContext.Provider
      value={{ ...chat, model, setModel, handleSubmit, token }}
    >
      <div className="flex h-screen">{children}</div>
    </ChatContext.Provider>
  );
}
