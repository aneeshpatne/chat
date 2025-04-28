"use client";
import Chat from "@/components/chatnew";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { ChatContext } from "@/app/(chat)/chat/layout"; // Corrected import path
export default function ChatSessionPage() {
  const [title, setTitle] = useState("");
  const { model, setModel, ...chat } = useContext(ChatContext);
  const [sentRequest, setSentRequest] = useState(false);
  const { messages } = chat;
  useEffect(() => {
    if (!title && messages.length > 0 && !sentRequest) {
      setSentRequest(true);
      const getTitle = async () => {
        const res = await fetch("/api/title", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: messages[0].content }),
        });
        const data = await res.json();
        if (data?.title) setTitle(data.title);
      };
      getTitle();
    }
  }, [title, messages]);
  useEffect(() => {
    if (title) {
      const titleElement = document.querySelector("title");
      if (titleElement) {
        titleElement.innerText = title;
      }
    }
  }, [title]);

  return <Chat {...chat} model={model} setModel={setModel} />;
}
