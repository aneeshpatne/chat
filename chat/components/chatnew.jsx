"use client";
import React, { useState, useRef, useEffect } from "react";
import { ReceivedMessage } from "./ReceivedMessage";
import { ChevronDown } from "lucide-react";

// SentMessage component defined before it's used
const SentMessage = React.memo(function SentMessage({ message }) {
  return (
    <div className="flex justify-end w-full">
      <div
        className="max-w-[60%] px-4 py-2 bg-card border border-border text-primary-foreground rounded-2xl shadow-sm prose prose-invert whitespace-pre-wrap break-words"
        style={{
          overflowWrap: "break-word",
          wordWrap: "break-word",
          hyphens: "auto",
          maxWidth: "60%",
        }}
      >
        {message}
      </div>
    </div>
  );
});

export default function Chat({
  messages,
  input,
  handleInputChange,
  handleSubmit,
  stop,
  status,
  model,
  setModel,
  token,
  pendingMessage,
  selectedText,
  setSelectedText,
  setaddMessage,
  setShowScroll,
  scrollToBottomFn,
  setScrollToBottomFn,
  sessionId,
}) {
  const [messagesStatus, setMessagesStatus] = useState({});

  const bottomRef = useRef(null);
  const chatContainerRef = useRef(null);
  const parentRef = useRef(null);
  const greetings = [
    "Where should we begin, Aneesh?",
    "What's on your mind, Aneesh?",
    "How can I help you today, Aneesh?",
    "Ready to start, Aneesh?",
    "What shall we explore, Aneesh?",
    "Let's get to it, Aneesh!",
    "Greetings Aneesh! What's the plan?",
    "Hello Aneesh, what are we working on?",
    "Good to see you, Aneesh! What's up?",
    "Ask me anything, Aneesh!",
    "What can I do for you, Aneesh?",
    "How may I assist you, Aneesh?",
    "Ready when you are, Aneesh!",
    "Let the ideas flow, Aneesh!",
    "What's the first thing, Aneesh?",
    "Your wish is my command, Aneesh (almost)!",
    "Let's make some magic, Aneesh!",
    "What adventure awaits us, Aneesh?",
    "How's it going, Aneesh? What's next?",
    "I'm all ears, Aneesh!",
    "What's the query, Aneesh?",
    "Let's dive in, Aneesh!",
    "Pleased to meet you, Aneesh! What's the task?",
    "What are your thoughts, Aneesh?",
    "Let's brainstorm, Aneesh!",
  ];

  const [randomGreeting, setRandomGreeting] = useState("");

  useEffect(() => {
    setRandomGreeting(greetings[Math.floor(Math.random() * greetings.length)]);
  }, []);
  const handleScroll = () => {
    const container = chatContainerRef.current;
    if (!container) return;
    const { scrollTop, scrollHeight, clientHeight } = container;
    const threshold = 50;
    // Only set showScroll to true if the content is actually scrollable
    // AND we're not already at the bottom
    const hasScrollableContent = scrollHeight > clientHeight + 20; // Add small buffer to avoid edge cases
    const atBottom = scrollHeight - scrollTop <= clientHeight + threshold;
    setShowScroll(hasScrollableContent && !atBottom);
  };

  useEffect(() => {
    if (bottomRef.current) {
      setScrollToBottomFn(() => () => {
        bottomRef.current.scrollIntoView({ behavior: "smooth" });
      });
    }
  }, [bottomRef.current, setScrollToBottomFn]);  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;
    handleScroll();
    container.addEventListener("scroll", handleScroll);
    
    // Prevent bounce/rubber band effect in iOS Safari
    const preventBounce = (e) => {
      if (container.scrollTop === 0 && e.touches[0].screenY > e.touches[0].clientY) {
        e.preventDefault();
      }
      if (container.scrollTop + container.clientHeight >= container.scrollHeight && 
          e.touches[0].screenY < e.touches[0].clientY) {
        e.preventDefault();
      }
    };
    
    container.addEventListener("touchmove", preventBounce, { passive: false });
    return () => {
      container.removeEventListener("scroll", handleScroll);
      container.removeEventListener("touchmove", preventBounce);
    };
  }, []);

  // Update scroll button visibility whenever messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      handleScroll();
    }
  }, [messages.length]);
  const renderedMessages = [
    ...messages,
    pendingMessage && {
      id: "pending-user",
      role: "user",
      parts: [{ type: "text", text: pendingMessage }],
      pending: true,
    },
  ].filter(Boolean);

  const currentlyStreamingId =
    status === "streaming" ? messages[messages.length - 1]?.id : null;  return (
    <div className="flex flex-col w-full h-full relative" style={{ overscrollBehavior: 'none' }}>
      {!input &&
        messages.length === 0 &&
        !pendingMessage &&
        status !== "in_progress" &&
        status !== "submitted" &&
        !sessionId && (
          <div className="flex items-center justify-center h-[calc(100vh-6rem)]">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-300 via-purple-300 to-blue-300 inline-block text-transparent bg-clip-text drop-shadow-sm">
              {randomGreeting}
            </h1>
          </div>
        )}<div
        ref={chatContainerRef}
        className="w-full h-full overflow-y-auto"
        style={{ overscrollBehavior: 'none' }}
      >
        <div className="mx-auto w-[80%] max-w-4xl">
          <div className="flex flex-col w-full gap-3 p-3 pb-20">
            {renderedMessages.map((message, index) => {
              const text = message.parts
                .filter((part) => part.type === "text")
                .map((part) => part.text)
                .join("");
              const reasoning = message.parts
                .filter((part) => part.type === "reasoning")
                .map((part) => part.reasoning)
                .join("");
              const messageID = message.id;
              return message.role === "user" ? (
                <SentMessage key={index} message={text} />
              ) : message.id === "loading" ? null : (
                <ReceivedMessage
                  key={index}
                  id={messageID}
                  message={text}
                  token={token[message.id]}
                  status={status}
                  reasoning={reasoning}
                  currentlyStreamingId={currentlyStreamingId}
                  setSelectedText={setSelectedText}
                  setaddMessage={setaddMessage}
                  selectedText={selectedText}
                />
              );
            })}
          </div>
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

export function MessageLoadingIndicator() {
  return (
    <>
      <style jsx>{`
        @keyframes fastFade {
          0%,
          80%,
          100% {
            opacity: 0.4;
            transform: scale(0.9);
          }
          40% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
      `}</style>
      <div className="flex items-center space-x-1 p-1 rounded-md">
        <span
          className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
          style={{ animation: "fastFade 0.7s infinite", animationDelay: "0s" }}
        ></span>
        <span
          className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
          style={{
            animation: "fastFade 0.7s infinite",
            animationDelay: "0.15s",
          }}
        ></span>
        <span
          className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
          style={{
            animation: "fastFade 0.7s infinite",
            animationDelay: "0.3s",
          }}
        ></span>
      </div>
    </>
  );
}
