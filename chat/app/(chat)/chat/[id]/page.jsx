"use client";
import Chat from "@/components/chatnew";
import { useEffect, useState, useContext } from "react"; // Grouped imports
import { ChatContext } from "@/app/(chat)/chat/clientlayout"; // Fixed path to match actual filename with lowercase 'c'
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
  // Instead of showing a central loading indicator, render the Chat component
  // with empty messages and let the SubmitButton handle loading state
  if (isFetchingMessages === true) {
    return (
      <Chat
        {...chatContextProps}
        model={model}
        setModel={setModel}
        messages={[]}
        status="in_progress"
      />
    );
  }

  return <Chat {...chatContextProps} model={model} setModel={setModel} />;
}
