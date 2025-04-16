"use client";
import TextareaAutosize from "react-textarea-autosize";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import ReactMarkdown from "react-markdown";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  });

  if (!mounted) {
    return (
      <div className="flex flex-1 justify-center items-center h-screen">
        <div className="flex flex-col w-[80%] max-w-2xl">
          {/* Skeleton for the heading */}
          <div className="h-10 w-3/4 bg-stone-700/30 rounded-md mb-4 animate-pulse"></div>

          {/* Skeleton for the chat box */}
          <div className="flex flex-col p-4 bg-stone-800 rounded-md border border-stone-600">
            <div className="w-full h-10 bg-stone-700/50 rounded-md animate-pulse"></div>
            <div className="flex justify-end mt-2">
              <div className="w-10 h-10 bg-stone-700/50 rounded-md animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (!messages) {
    return (
      <div className="flex flex-col justify-center mx-auto w-[80%] max-w-3xl h-screen">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold tracking-tight mb-4 bg-gradient-to-r from-stone-100 via-stone-300 to-stone-100 inline-block text-transparent bg-clip-text drop-shadow-sm">
            Good Afternoon, Aneesh!
          </h1>
          <div className="flex flex-col p-4 bg-stone-800 rounded-md border border-stone-600">
            <TextareaAutosize
              value={input}
              onChange={handleInputChange}
              minRows={1}
              maxRows={4}
              placeholder="Type your message here..."
              className="w-full p-2 border-none rounded-md text-white overflow-y-auto focus:outline-none transition-all duration-150 ease-in-out resize-none"
            />
            <div className="flex justify-end mt-2">
              <Button variant="outline" onClick={handleSubmit}>
                <Send size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="mx-auto w-[80%] max-w-4xl min-h-screen pb-[150px]">
        <div className="flex flex-col w-full gap-3 p-3">
          {messages.map((message, index) => {
            const text = message.parts
              .filter((part) => part.type === "text")
              .map((part) => part.text)
              .join("");

            return message.role === "user" ? (
              <SentMessage key={index} message={text} />
            ) : (
              <ReceivedMessage key={index} message={text} />
            );
          })}
        </div>
      </div>
      <div className="fixed bottom-0 left-0 w-full">
        <div className="mx-auto w-[80%] max-w-4xl">
          <div className="flex flex-col p-4 bg-stone-800 rounded-md border border-stone-600">
            <TextareaAutosize
              value={input}
              onChange={handleInputChange}
              minRows={1}
              maxRows={4}
              placeholder="Type your message here..."
              className="w-full p-2 border-none rounded-md text-white overflow-y-auto focus:outline-none transition-all duration-150 ease-in-out resize-none"
            />
            <div className="flex justify-end mt-2">
              <Button variant="outline" onClick={handleSubmit}>
                <Send size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
function SentMessage({ message }) {
  return (
    <div className="flex justify-end w-full">
      <div className="max-w-[60%] px-4 py-2 bg-stone-700 rounded-2xl rounded-tr-none text-white shadow-sm">
        <ReactMarkdown>{message}</ReactMarkdown>
      </div>
    </div>
  );
}

function ReceivedMessage({ message }) {
  return (
    <div className="flex justify-start w-full">
      <div className="w-full px-4 py-2 text-white">
        <ReactMarkdown>{message}</ReactMarkdown>
      </div>
    </div>
  );
}
