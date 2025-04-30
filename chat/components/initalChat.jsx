"use client";
import React, { useEffect, useState, useRef, useMemo } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "./ui/button";
import { Send, CheckIcon } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { ReceivedMessage } from "./ReceivedMessage";
import { LayoutTemplate, X, OctagonX } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuGroup,
} from "./ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { models } from "./models";
import Image from "next/image";

export default function Chat() {
  const router = useRouter();

  const [token, setToken] = useState({});
  const [sessionId, setSessionId] = useState(null);
  const { messages, input, handleInputChange, stop, status } = useChat();
  const [model, setModel] = useState({
    name: "4.1 Nano",
    id: "gpt-4.1-nano",
    provider: "openai",
  });

  const onSubmit = async (e) => {
    e.preventDefault();

    // Generate session ID if it doesn't exist
    if (!sessionId) {
      try {
        const res = await fetch("/api/session");
        sessionStorage.setItem("initialMessage", input);
        messages.push({
          role: "user",
          parts: [{ type: "text", text: input }],
        });
        const data = await res.json();
        const newSessionId = data.sessionId;
        setSessionId(newSessionId);
        router.push(`/chat/${newSessionId}`);
      } catch (error) {
        console.error("Failed to create session:", error);
        return;
      }
    }
  };

  const [mounted, setMounted] = useState(false);

  //const [model, setModel] = useState("gpt-4.1-nano");

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return <LoadingState />;
  }

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
            {messages.map((message, index) => {
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
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="bg-stone-700/40 border-stone-600/50 hover:bg-stone-700/60 hover:border-stone-500/50 transition-all duration-200 min-w-[140px]"
        >
          <div className="flex items-center gap-2">
            {model.provider !== "openai" && (
              <div className="text-xs font-medium text-stone-300 px-1.5 py-0.5 rounded-md bg-stone-600/50">
                {model.provider}
              </div>
            )}
            <span className="text-stone-200">{model.name}</span>
            <LayoutTemplate size={16} className="ml-auto text-stone-300" />
          </div>
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
            {models.map((m) => (
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
      <div className="max-w-[60%] px-4 py-2 bg-primary text-primary-foreground rounded-2xl rounded-tr-none shadow-sm prose prose-invert whitespace-pre-wrap break-words"> {/* Use primary theme colors */}
        {message}
      </div>
    </div>
  );
});
