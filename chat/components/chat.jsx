"use client";
import React, { useEffect, useState, useRef } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { micromark } from "micromark";
// Import core only and specific languages for better performance
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import python from "highlight.js/lib/languages/python";
import typescript from "highlight.js/lib/languages/typescript";
import bash from "highlight.js/lib/languages/bash";
import json from "highlight.js/lib/languages/json";
import "highlight.js/styles/atom-one-dark.css"; // Import a CSS theme for syntax highlighting

// Register only the languages you need
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("python", python);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("bash", bash);
hljs.registerLanguage("json", json);

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef(null);
  const highlightTimeoutRef = useRef(null);
  // const messagesEndRef = useRef(null);
  useEffect(() => {}, [messages]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll to bottom when messages change
  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages]);

  // Highlight code blocks with debounce
  const lastHighlightTime = useRef(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const THROTTLE = 50; // ms between highlights
    const now = Date.now();
    const delta = now - lastHighlightTime.current;

    // helper to highlight every <pre><code>
    const highlightAll = () => {
      containerRef.current.querySelectorAll("pre code").forEach((block) => {
        hljs.highlightElement(block);
      });
    };

    // Throttle logic
    if (delta < THROTTLE) {
      // already ran recently — schedule the next call
      clearTimeout(highlightTimeoutRef.current);
      highlightTimeoutRef.current = setTimeout(() => {
        highlightAll();
        lastHighlightTime.current = Date.now();
      }, THROTTLE - delta);
    } else {
      // OK to run now
      highlightAll();
      lastHighlightTime.current = now;
    }

    // One final "when idle" pass to catch anything still un‑highlighted
    let idleId;
    if ("requestIdleCallback" in window) {
      idleId = requestIdleCallback(highlightAll, { timeout: 200 });
    }

    return () => {
      clearTimeout(highlightTimeoutRef.current);
      if (typeof cancelIdleCallback === "function") {
        cancelIdleCallback(idleId);
      }
    };
  }, [messages]);

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
