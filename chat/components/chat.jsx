"use client";
import React, { useEffect, useState, useRef, useMemo } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { micromark } from "micromark";
import { ReceivedMessage } from "./ReceivedMessage";
import { LayoutTemplate } from "lucide-react";
export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return <LoadingState />;
  }

  if (!messages || messages.length === 0) {
    return (
      <EmptyState
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
      />
    );
  }

  return (
    <div className="flex flex-col w-full h-full">
      <div className="w-full h-full overflow-y-auto">
        <div className="mx-auto w-[80%] max-w-4xl pb-4">
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
      </div>

      <div className="mx-auto w-[80%] max-w-4xl">
        <div className="flex flex-col p-4 bg-stone-800 rounded-md border border-stone-600">
          <TextareaAutosize
            value={input}
            onChange={handleInputChange}
            minRows={1}
            maxRows={4}
            placeholder="Type your message here..."
            className="w-full p-2 border-none rounded-md text-white overflow-y-auto focus:outline-none transition-all duration-150 ease-in-out resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <div className="flex justify-between mt-2">
            <ModelSelector />
            <Button variant="outline" onClick={handleSubmit}>
              <Send size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
function ModelSelector() {
  return (
    <div className="relative">
      <Button variant="outline">
        <LayoutTemplate size={16} className="mr-2" />
        <span>Select Model</span>
      </Button>
    </div>
  );
}
// Separate components for better organization
function LoadingState() {
  return (
    <div className="flex flex-1 justify-center items-center h-screen">
      <div className="flex flex-col w-[80%] max-w-2xl">
        <div className="h-10 w-3/4 bg-stone-700/30 rounded-md mb-4 animate-pulse"></div>
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

function EmptyState({ input, handleInputChange, handleSubmit }) {
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
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
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

const SentMessage = React.memo(function SentMessage({ message }) {
  return (
    <div className="flex justify-end w-full">
      <div
        className="max-w-[60%] px-4 py-2 bg-stone-700 rounded-2xl rounded-tr-none text-white shadow-sm prose prose-invert whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ __html: micromark(message) }}
      />
    </div>
  );
});
