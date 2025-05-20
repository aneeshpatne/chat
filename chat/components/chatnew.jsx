"use client";
import React, { useState, useRef, useEffect } from "react";
import { ReceivedMessage } from "./ReceivedMessage";
import { ChevronDown } from "lucide-react";
import MessageLoadingAnimation from "./MessageLoadingAnimation"; // Added import

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
  const chatContainerRef = useRef(null);
  const bottomRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Greetings array
  const greetings = [
    "Hello Aneesh! How can I help you today?",
    "Hi Aneesh! What can I do for you today?",
    "Greetings Aneesh! What brings you here today?",
    "Salutations Aneesh! How may I assist you?",
    "Hey Aneesh! What's on your mind?",
    "Hello Aneesh! Ready to explore some ideas?",
    "Hi Aneesh! Need help with something?",
    "Greetings Aneesh! Let's dive into your queries.",
    "Salutations Aneesh! What would you like to know?",
    "Hey Aneesh! How can I be of service today?",
    "Hello Aneesh! What topic shall we discuss?",
    "Hi Aneesh! Looking for some information?",
    "Greetings Aneesh! Let's get started on your project.",
    "Salutations Aneesh! How can I make your day easier?",
    "Hey Aneesh! What challenges are you facing today?",
    "Hello Aneesh! Let's brainstorm some solutions.",
    "Hi Aneesh! Ready to tackle your questions?",
    "Greetings Aneesh! What ideas do you have in mind?",
    "Salutations Aneesh! Let's turn your thoughts into action.",
    "Hey Aneesh! What are you curious about today?",
    "Hello Aneesh! Let's embark on a new learning journey.",
    "Hi Aneesh! What skills do you want to explore?",
    "Greetings Aneesh! How can I assist in your learning today?",
    "Salutations Aneesh! What knowledge are you seeking?",
    "Hey Aneesh! Let's unlock some new skills together.",
    "Hello Aneesh! What would you like to achieve today?",
    "Hi Aneesh! Let's set some goals for our session.",
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
  }, [bottomRef.current, setScrollToBottomFn]);
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;
    handleScroll();
    container.addEventListener("scroll", handleScroll);

    // Prevent bounce/rubber band effect in iOS Safari
    const preventBounce = (e) => {
      if (
        container.scrollTop === 0 &&
        e.touches[0].screenY > e.touches[0].clientY
      ) {
        e.preventDefault();
      }
      if (
        container.scrollTop + container.clientHeight >=
          container.scrollHeight &&
        e.touches[0].screenY < e.touches[0].clientY
      ) {
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
    status === "streaming" ? messages[messages.length - 1]?.id : null;
  return (
    <div
      className="flex flex-col w-full h-full relative"
      style={{ overscrollBehavior: "none" }}
    >
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
        )}
      <div
        ref={chatContainerRef}
        className="w-full h-full overflow-y-auto"
        style={{ overscrollBehavior: "none" }}
        onScroll={handleScroll}
      >
        <div className="mx-auto w-[80%] max-w-4xl pb-50">
          <div className="flex flex-col w-full gap-3 p-3 ">
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
            {(status === "in_progress" || status === "submitted") &&
              !pendingMessage && (
                <div className="flex justify-start w-full">
                  <MessageLoadingAnimation />
                </div>
              )}
          </div>
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
