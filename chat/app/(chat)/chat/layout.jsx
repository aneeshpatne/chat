"use client";

import { useChat } from "@ai-sdk/react";
import { createContext, useContext, useState, useEffect } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Send, LayoutTemplate, X, OctagonX } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";
import React from "react";
import { models } from "@/components/models";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Import DropdownMenu components
import { cn } from "@/lib/utils"; // Import cn utility

const modelList = Object.values(models);
export const ChatContext = createContext(null);

export default function ChatLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { id: sessionId } = useParams();
  const [mounted, setMounted] = useState(false);

  const [pendingMessage, setPendingMessage] = useState(null);
  const [model, setModel] = useState({
    name: "4.1 Nano",
    id: "gpt-4.1-nano",
    provider: "openai",
  });

  const [token, setToken] = useState({});

  const chat = useChat({
    id: sessionId,
    sendExtraMessageFields: true,
    onError: (error) => console.error("Chat error:", error),
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

  const { append, input, handleInputChange, status, stop } = chat;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!sessionId) {
      const message = input;
      handleInputChange({ target: { value: "" } });
      setPendingMessage(message);

      const res = await fetch("/api/session");
      const data = await res.json();

      router.push(`/chat/${data.sessionId}`);
    } else {
      chat.handleSubmit(e, {
        data: { model: model.id, provider: model.provider },
      });
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (sessionId && pendingMessage) {
      append(
        { role: "user", content: pendingMessage },
        { data: { model: model.id, provider: model.provider } }
      );
      setPendingMessage(null);
    }
  }, [sessionId, pendingMessage, append, model]);

  return (
    <ChatContext.Provider
      value={{ ...chat, model, setModel, handleSubmit, token, pendingMessage }}
    >
      <div className="flex flex-col h-screen">
        <div className="flex-grow overflow-auto">{children}</div>

        <div className="mx-auto w-[80%] max-w-4xl mb-4">
          {mounted ? (
            <div className="flex flex-col p-4 bg-stone-800 rounded-md border border-stone-600">
              <TextAreaComponent
                input={input}
                handleInputChange={handleInputChange}
                onSubmit={handleSubmit}
              />
              <div className="flex justify-between mt-2">
                <ModelSelector model={model} setModel={setModel} />

                {status === "streaming" ? (
                  <Button variant="destructive" onClick={stop}>
                    <OctagonX />
                  </Button>
                ) : (
                  <Button variant="outline" onClick={handleSubmit}>
                    <Send size={16} />
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col p-4 bg-stone-800 rounded-md border border-stone-600">
              <div className="w-full min-h-[38px] p-2 border-none rounded-md bg-stone-700/80 mb-2 flex items-center justify-center">
                <MessageLoadingAnimation />
              </div>
              <div className="flex justify-between mt-2">
                <div className="h-9 rounded-md border border-stone-600 px-4 py-2 text-sm font-medium flex items-center justify-center bg-stone-800/70 text-stone-400">
                  <span>4.1 Nano</span>
                </div>
                <div className="h-9 w-9 rounded-md border border-stone-600 flex items-center justify-center bg-stone-800/70"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ChatContext.Provider>
  );
}

// Message loading animation component
function MessageLoadingAnimation() {
  return (
    <>
      <style jsx>{`
        @keyframes wave {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .loading-bar {
          position: relative;
          overflow: hidden;
          height: 24px;
          width: 100%;
          border-radius: 4px;
          background: rgba(100, 100, 100, 0.2);
        }
        .loading-bar::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 60%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(150, 150, 150, 0.5),
            transparent
          );
          animation: wave 1.5s infinite ease-in-out;
        }
      `}</style>
      <div className="loading-bar"></div>
    </>
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
      maxRows={10}
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
        <Button variant="outline">
          <LayoutTemplate size={16} className="mr-2" />
          <span>{model.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="
        max-h-[80vh]
        overflow-y-auto 
        bg-stone-800 p-1 border border-stone-600 rounded-md shadow-lg 
        min-w-[200px] 
      "
      >
        {modelList.map((m) => (
          <ModelItem
            key={m.id}
            id={m.id}
            name={m.name}
            setModel={setModel}
            provider={m.provider}
            isSelected={m.id === model.id}
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ModelItem({ name, setModel, id, provider, isSelected }) {
  // Find the model details (including image) from the modelList
  const modelDetails = modelList.find((m) => m.id === id);
  const image = modelDetails?.img; // Get the image path

  function handleClick() {
    setModel({ name, id, provider });
  }

  return (
    <DropdownMenuItem
      className={cn(
        "cursor-pointer focus:bg-stone-700 focus:text-white flex items-center gap-2 p-2", // Use flexbox for layout
        isSelected ? "bg-stone-700 font-semibold" : ""
      )}
      onClick={handleClick}
      style={{ outline: "none" }}
    >
      {image && (
        <Image
          src={image}
          alt={`${name} logo`}
          height={20} // Adjust size as needed
          width={20}
          className="object-contain flex-shrink-0"
        />
      )}
      <span className="flex-grow truncate">{name}</span>{" "}
      {provider !== "openai" && (
        <span className="text-xs text-stone-400 ml-auto flex-shrink-0">
          {" "}
          {provider}
        </span>
      )}
    </DropdownMenuItem>
  );
}
