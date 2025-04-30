"use client";
import React, { useState, useRef } from "react";
import { ReceivedMessage } from "./ReceivedMessage";

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
}) {
  const [messagesStatus, setMessagesStatus] = useState({});

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

  return (
    <div className="flex flex-col w-full h-full">
      {!input && messages.length === 0 && !pendingMessage && (
        <div className="flex items-center justify-center h-[calc(100vh-6rem)]">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-300 via-purple-300 to-blue-300 inline-block text-transparent bg-clip-text drop-shadow-sm">
            Good Afternoon, Aneesh!
          </h1>
        </div>
      )}
      <div className="w-full h-full overflow-y-auto">
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
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Component for the message loading indicator
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
        {" "}
        {/* Use primary theme colors */}
        {message}
      </div>
    </div>
  );
});
