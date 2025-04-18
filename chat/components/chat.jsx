"use client";
import React, { useEffect, useState, useRef } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { micromark } from "micromark";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Highlight code blocks whenever new assistant message arrives
  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.querySelectorAll("pre code").forEach((block) => {
      if (!block.classList.contains("hljs")) {
        hljs.highlightElement(block);
      }
    });
  }, [messages]);

  if (!mounted) {
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
    <div className="flex flex-col w-full h-full">
      <div ref={containerRef} className="w-full h-full overflow-y-auto">
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
        className="max-w-[60%] px-4 py-2 bg-stone-700 rounded-2xl rounded-tr-none text-white shadow-sm prose prose-invert"
        dangerouslySetInnerHTML={{ __html: micromark(message) }}
      />
    </div>
  );
});

const ReceivedMessage = React.memo(function ReceivedMessage({ message }) {
  return (
    <div className="justify-start w-full prose prose-invert">
      <div dangerouslySetInnerHTML={{ __html: micromark(message) }} />
    </div>
  );
});
