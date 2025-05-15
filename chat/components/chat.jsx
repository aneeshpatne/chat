"use client";
import React, { useEffect, useState, useRef, useMemo } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "./ui/button";
import { useChat } from "@ai-sdk/react";
import { micromark } from "micromark";
import { ReceivedMessage } from "./ReceivedMessage";
import { LayoutTemplate, X } from "lucide-react";
import SubmitButton from "./SubmitButton";
import { useModels } from "./models";
import Image from "next/image";

export default function Chat({ sessionid }) {
  const { getAllModels } = useModels();
  const [token, setToken] = useState({});
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    stop,
    status,
    append,
  } = useChat({
    id: sessionid,
    sendExtraMessageFields: true,
    onError: (error) => {
      console.log("Error:", error);
    },
    onFinish: (message, options) => {
      setToken((prevTokens) => {
        return {
          ...prevTokens,
          [message.id]: {
            completionTokens: options.usage.completionTokens,
            promptTokens: options.usage.promptTokens,
            totalTokens: options.usage.totalTokens,
          },
        };
      });
    },
  });
  useEffect(() => {
    const initial = sessionStorage.getItem("initialMessage");
    if (initial && messages.length === 0) {
      append(
        {
          role: "user",
          content: initial,
        },
        {
          data: {
            model: model.id,
            provider: model.provider,
          },
        }
      );
      sessionStorage.removeItem("initialMessage");
    }
  }, []);
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
  }, []); // Don't show a full loading state, render minimal UI with loading button
  if (!mounted) {
    return (
      <div className="flex flex-col w-full h-full relative">
        <div className="flex-grow"></div>
        <div className="flex flex-col items-center gap-2 absolute left-0 right-0 bottom-0 ">
          <div className="mx-auto w-[80%] max-w-4xl mb-4">
            <div className="flex flex-col p-4 bg-card rounded-md border border-border">
              <div className="h-10"></div>
              <div className="flex justify-between mt-2">
                <div className="w-24 h-10"></div>
                <SubmitButton
                  status="in_progress"
                  onSubmit={() => {}}
                  onStop={() => {}}
                  isInitiatingChat={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  const renderedMessages = messages;
  return (
    <div className="flex flex-col w-full h-full">
      {!input &&
        messages.length === 0 &&
        status !== "in_progress" &&
        status !== "submitted" && (
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
              ) : message.id === "loading" ? null : ( // Remove the loading indicator, it's now integrated into the submit button
                <ReceivedMessage
                  key={index}
                  message={text}
                  token={token[message.id]}
                  status={status}
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
            <ModelSelector model={model} setModel={setModel} />{" "}
            <SubmitButton
              status={status}
              onSubmit={(e) => onSubmit(e)}
              onStop={stop}
              isInitiatingChat={false}
            />
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
        bg-popover text-popover-foreground p-2 border border-border rounded-md shadow-lg {/* Use popover theme colors */}
      "
          >
            {getAllModels().map((m) => (
              <Button
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
        @keyframes fadeInOut {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
        }
        .loading-dot {
          animation: fadeInOut 0.8s infinite;
        }
        .dot-1 {
          animation-delay: 0s;
        }
        .dot-2 {
          animation-delay: 0.2s;
        }
        .dot-3 {
          animation-delay: 0.4s;
        }
      `}</style>
      <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-transparent">
        <span className="loading-dot dot-1 h-1.5 w-1.5 rounded-full bg-muted-foreground"></span>
        <span className="loading-dot dot-2 h-1.5 w-1.5 rounded-full bg-muted-foreground"></span>
        <span className="loading-dot dot-3 h-1.5 w-1.5 rounded-full bg-muted-foreground"></span>
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
      <div 
        className="max-w-[60%] px-4 py-2 bg-primary text-primary-foreground rounded-2xl rounded-tr-none shadow-sm prose prose-invert whitespace-pre-wrap break-words"
        style={{
          overflowWrap: "break-word",
          wordWrap: "break-word",
          hyphens: "auto",
          maxWidth: "60%"
        }}
      >
        {" "}
        {/* Use primary theme colors */}
        {message}
      </div>
    </div>
  );
});
