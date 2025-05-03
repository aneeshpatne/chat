"use client";
import React, { useState, useRef, useEffect } from "react"; // Import useEffect
import { ReceivedMessage } from "./ReceivedMessage";
import { ChevronDown } from "lucide-react";

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
}) {
  const [messagesStatus, setMessagesStatus] = useState({});
  const bottomRef = useRef(null);
  const chatContainerRef = useRef(null); // Ref for the scrollable container
  const [isAtBottom, setIsAtBottom] = useState(true); // State to track scroll position

  const renderedMessages = [
    ...messages,
    pendingMessage && {
      id: "pending-user",
      role: "user",
      parts: [{ type: "text", text: pendingMessage }],
      pending: true,
    },
    status === "submitted" && {
      id: "loading-assistant",
      role: "assistant",
      parts: [{ type: "text", text: "" }],
      pending: true,
    },
  ].filter(Boolean);

  const currentlyStreamingId =
    status === "streaming" ? messages[messages.length - 1]?.id : null;

  const handleScroll = () => {
    const container = chatContainerRef.current;
    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container;
      // Consider user at bottom if they are within 50px of the end
      const threshold = 50;
      const atBottom = scrollHeight - scrollTop <= clientHeight + threshold;
      setIsAtBottom(atBottom);
    }
  };

  useEffect(() => {
    const container = chatContainerRef.current;
    if (container) {
      // Initial check
      handleScroll();
      container.addEventListener("scroll", handleScroll);
      // Cleanup listener on unmount
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []); // Run only on mount and unmount

  // Scroll to bottom when new messages arrive if user is already at the bottom
  useEffect(() => {
    if (isAtBottom) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, pendingMessage, status, isAtBottom]);

  return (
    <div className="flex flex-col w-full h-full relative">
      {/* Conditionally render ScrollToBottom button */}
      {!isAtBottom && (
        <ScrollToBottom
          onClick={() =>
            bottomRef.current?.scrollIntoView({ behavior: "smooth" })
          }
        />
      )}
      {!input && messages.length === 0 && !pendingMessage && (
        <div className="flex items-center justify-center h-[calc(100vh-6rem)]">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-300 via-purple-300 to-blue-300 inline-block text-transparent bg-clip-text drop-shadow-sm">
            Good Afternoon, Aneesh!
          </h1>
        </div>
      )}
      <div
        ref={chatContainerRef}
        className="w-full h-[calc(100vh-8rem)] overflow-y-auto pb-20"
        onScroll={handleScroll}
      >
        <div className="mx-auto w-[80%] max-w-4xl pb-4">
          <div className="flex flex-col w-full gap-3 p-3">
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
              ) : message.id === "loading" ? (
                <MessageLoadingIndicator key={index} />
              ) : (
                <ReceivedMessage
                  key={message.id}
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
      </div>
      <div ref={bottomRef} />
    </div>
  );
}

const ScrollToBottom = ({ onClick }) => {
  return (
    <div
      onClick={onClick} // Add onClick handler
      className="absolute left-1/2 transform -translate-x-1/2 bottom-40 z-10 flex items-center gap-2 bg-card/70 backdrop-blur-sm border border-border/50 rounded-lg p-2 px-3 shadow-md text-sm text-muted-foreground hover:bg-muted/80 transition-colors cursor-pointer"
      aria-label="Scroll to bottom"
    >
      <ChevronDown size={16} />
      <span>Scroll to Bottom</span>
    </div>
  );
};

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
      <div className="flex items-center space-x-1">
        <span
          className="h-2 w-2 rounded-full bg-muted-foreground"
          style={{ animation: "fastFade 0.7s infinite", animationDelay: "0s" }}
        ></span>
        <span
          className="h-2 w-2 rounded-full bg-muted-foreground"
          style={{
            animation: "fastFade 0.7s infinite",
            animationDelay: "0.15s",
          }}
        ></span>
        <span
          className="h-2 w-2 rounded-full bg-muted-foreground"
          style={{
            animation: "fastFade 0.7s infinite",
            animationDelay: "0.3s",
          }}
        ></span>
      </div>
    </>
  );
}

const SentMessage = React.memo(function SentMessage({ message }) {
  return (
    <div className="flex justify-end w-full">
      <div className="max-w-[60%] px-4 py-2 bg-primary text-primary-foreground rounded-2xl rounded-tr-none shadow-sm prose prose-invert whitespace-pre-wrap break-words">
        {message}
      </div>
    </div>
  );
});
