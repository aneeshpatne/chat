"use client";
import React, { useEffect, useState, useRef, useMemo } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { micromark } from "micromark";
import { ReceivedMessage } from "./ReceivedMessage";
import { LayoutTemplate, X, OctagonX } from "lucide-react";
import { models } from "./models";
import Image from "next/image";

export default function Chat() {
  const [token, setToken] = useState({});
  const { messages, input, handleInputChange, handleSubmit, stop, status } =
    useChat({
      sendExtraMessageFields: true,
      onError: (error) => {
        console.log("Error:", error);
      },
      onFinish: (message, options) => {
        setToken((prevTokens) => ({
          ...prevTokens,
          [message.id]: {
            completionTokens: options.usage.completionTokens,
            promptTokens: options.usage.promptTokens,
            totalTokens: options.usage.totalTokens,
          },
        }));
      },
    });
  const [model, setModel] = useState({
    name: "4.1 Nano",
    id: "gpt-4.1-nano",
    provider: "openai",
  });

  const onSubmit = (e) => {
    handleSubmit(e, {
      data: { model: model.id, provider: model.provider },
    });
  };

  const [mounted, setMounted] = useState(false);

  //const [model, setModel] = useState("gpt-4.1-nano");

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return <LoadingState />;
  }
  const renderedMessages =
    status === "submitted"
      ? [
          ...messages,
          {
            id: "loading",
            role: "assistant",
            parts: [{ type: "text", text: "" }],
          },
        ]
      : messages;

  return (
    <div className="flex flex-col w-full h-full">
      {!input && messages.length === 0 && (
        <div className="flex items-center justify-center h-[calc(100vh-6rem)]">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-stone-100 via-stone-300 to-stone-100 inline-block text-transparent bg-clip-text drop-shadow-sm">
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

              return message.role === "user" ? (
                <SentMessage key={index} message={text} />
              ) : message.id === "loading" ? (
                <MessageLoadingIndicator key={index} />
              ) : (
                <ReceivedMessage
                  key={index}
                  message={text}
                  token={token[message.id]}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="mx-auto w-[80%] max-w-4xl">
        <div className="flex flex-col p-4 bg-stone-800 rounded-md border border-stone-600">
          <TextAreaComponent
            input={input}
            handleInputChange={handleInputChange}
            onSubmit={onSubmit}
          />
          <div className="flex justify-between mt-2">
            <ModelSelector model={model} setModel={setModel} />

            {status === "streaming" ? (
              <Button variant="destructive" onClick={stop}>
                <OctagonX />
              </Button>
            ) : (
              <Button variant="outline" onClick={(e) => onSubmit(e)}>
                <Send size={16} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const TextAreaComponent = React.memo(function TextAreaComponent({
  input,
  handleInputChange,
  onSubmit,
}) {
  return (
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
          onSubmit(e);
        }
      }}
    />
  );
});

function ModelSelector({ model, setModel }) {
  const [visbility, setVisibility] = useState(false);
  return (
    <div className="relative w-full">
      {!visbility ? (
        <>
          <Button variant="outline" onClick={() => setVisibility(!visbility)}>
            <LayoutTemplate size={16} className="mr-2" />
            <span>{model.name}</span>
          </Button>
        </>
      ) : (
        <Button variant="destructive" onClick={() => setVisibility(!visbility)}>
          <X size={16} className="mr-2" />
          <span>Close</span>
        </Button>
      )}
      {visbility && (
        <div className="absolute bottom-full mb-2">
          <div
            className="
        flex flex-wrap gap-2 justify-between
        max-w-[700px]
        max-h-[80vh] 
        overflow-y-auto
        bg-stone-800 p-2 border border-stone-600 rounded-md shadow-lg
      "
          >
            {Object.values(models).map((m) => (
              <ModelItem
                key={m.id}
                id={m.id}
                name={m.name}
                setModel={setModel}
                image={m.img}
                setVisibility={setVisibility}
                provider={m.provider}
                isSelected={m.id === model.id}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ModelItem component to represent each model in the selector
function ModelItem({
  name,
  setModel,
  setVisibility,
  image,
  id,
  provider,
  isSelected,
}) {
  function handleClick() {
    setModel({ name, id, provider });
    setVisibility(false);
  }
  return (
    <div
      className={`relative w-24 h-36 p-2 border rounded-md cursor-pointer transition duration-150 ease-in-out
    ${
      isSelected
        ? "border-stone-200 border-2 shadow-md"
        : "hover:bg-stone-700 border-stone-600"
    }
  `}
      onClick={handleClick}
    >
      {provider !== "openai" && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-stone-700/70 text-xs font-medium text-stone-200 px-1 py-0.5 rounded-md shadow-sm">
          {provider}
        </div>
      )}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-10 h-10  overflow-hidden">
        <Image
          src={image}
          alt="Model Image"
          height={35}
          width={35}
          className="object-cover"
        />
      </div>
      <p className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-xs font-medium text-stone-200 bg-stone-700/70 px-2 py-0.5 rounded-md shadow-sm text-center">
        {name}
      </p>
    </div>
  );
}

// Component for the message loading indicator
function MessageLoadingIndicator() {
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
          className="h-2 w-2 rounded-full bg-stone-400"
          style={{ animation: "fastFade 0.7s infinite", animationDelay: "0s" }}
        ></span>
        <span
          className="h-2 w-2 rounded-full bg-stone-400"
          style={{
            animation: "fastFade 0.7s infinite",
            animationDelay: "0.15s",
          }}
        ></span>
        <span
          className="h-2 w-2 rounded-full bg-stone-400"
          style={{
            animation: "fastFade 0.7s infinite",
            animationDelay: "0.3s",
          }}
        ></span>
      </div>
    </>
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

const SentMessage = React.memo(function SentMessage({ message }) {
  return (
    <div className="flex justify-end w-full">
      <div className="max-w-[60%] px-4 py-2 bg-stone-700 rounded-2xl rounded-tr-none text-white shadow-sm prose prose-invert whitespace-pre-wrap break-words">
        {message}
      </div>
    </div>
  );
});
