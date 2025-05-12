"use client";
import Chat from "@/components/chatnew";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { ChatContext } from "@/app/(chat)/chat/Clientlayout"; // Corrected import path
import { generateTitle } from "@/app/actions/title";
export default function ChatSessionPage() {
  const [title, setTitle] = useState("");
  const { model, setModel, ...chat } = useContext(ChatContext);
  const [sentRequest, setSentRequest] = useState(false);
  const { messages } = chat;
  useEffect(() => {
    if (!title && messages.length > 0 && !sentRequest) {
      setSentRequest(true);
      const getTitle = async () => {
        const data = await generateTitle(messages[0].content);
        if (data) setTitle(data);
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
