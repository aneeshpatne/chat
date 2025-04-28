"use client";
import Chat from "@/components/chatnew";
import { useContext } from "react";
import { ChatContext } from "@/app/chat/layout";
export default function BaseChatPage() {
  const { model, setModel, ...chat } = useContext(ChatContext);
  return <Chat {...chat} model={model} setModel={setModel} />;
}
