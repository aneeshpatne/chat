"use client";
import Chat from "@/components/chatnew";
import { useEffect, useState, useContext } from "react"; // Grouped imports
import { ChatContext } from "@/app/(chat)/chat/Clientlayout"; // Corrected path to use 'Clientlayout' (uppercase C)
import { generateTitle } from "@/app/actions/title";

export default function ChatSessionPage() {
  const [title, setTitle] = useState("");
  const { model, setModel, ...chatContextProps } = useContext(ChatContext);
  const { messages, isFetchingMessages } = chatContextProps;

  const [sentRequest, setSentRequest] = useState(false);

  useEffect(() => {
    if (!title && messages && messages.length > 0 && !sentRequest) {
      setSentRequest(true);
      const getTitle = async () => {
        if (messages[0] && messages[0].content) {
          const data = await generateTitle(messages[0].content);
          if (data) setTitle(data);
        }
      };
      getTitle();
    }
  }, [title, messages, sentRequest]);

  useEffect(() => {
    if (title) {
      const titleElement = document.querySelector("title");
      if (titleElement) {
        titleElement.innerText = title;
      }
    }
  }, [title]);

  if (isFetchingMessages === true) {
    return (
      <div className="flex flex-col items-center justify-center h-full flex-grow p-4">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground">Loading messages...</p>
      </div>
    );
  }

  return <Chat {...chatContextProps} model={model} setModel={setModel} />;
}
