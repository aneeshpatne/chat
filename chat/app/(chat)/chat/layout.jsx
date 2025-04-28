"use client";

import { useChat } from "@ai-sdk/react";
import { createContext, useContext, useState, useEffect } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Send, LayoutTemplate, X, OctagonX, CheckIcon } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";
import React from "react";
import { models } from "@/components/models";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

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

        <div className="mx-auto w-[85%] max-w-5xl mb-6">
          {mounted ? (
            <div className="flex flex-col p-5 bg-stone-800/90 backdrop-blur-sm rounded-xl border border-stone-600/50 shadow-lg transition-all duration-200 hover:border-stone-500/50">
              <TextAreaComponent
                input={input}
                handleInputChange={handleInputChange}
                onSubmit={handleSubmit}
              />
              <div className="flex justify-between mt-3">
                <ModelSelector model={model} setModel={setModel} />

                {status === "streaming" ? (
                  <Button
                    variant="destructive"
                    onClick={stop}
                    className="shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <OctagonX className="w-5 h-5" />
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={handleSubmit}
                    className="bg-stone-700/50 shadow-md hover:shadow-lg hover:bg-stone-700 transition-all duration-200"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col p-5 bg-stone-800/90 backdrop-blur-sm rounded-xl border border-stone-600/50 shadow-lg">
              <div className="w-full min-h-[38px] p-2 border-none rounded-lg bg-stone-700/60 mb-3 flex items-center justify-center">
                <MessageLoadingAnimation />
              </div>
              <div className="flex justify-between mt-3">
                <div className="h-10 w-28 rounded-lg border border-stone-600/50 bg-stone-800/70 backdrop-blur-sm"></div>
                <div className="h-10 w-10 rounded-lg border border-stone-600/50 flex items-center justify-center bg-stone-800/70 backdrop-blur-sm"></div>
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
        @keyframes pulse {
          0%,
          80%,
          100% {
            transform: scale(0);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .dot-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 24px; /* Match the original height */
        }
        .dot {
          width: 8px;
          height: 8px;
          margin: 0 3px;
          background-color: rgba(150, 150, 150, 0.8); /* Use a visible color */
          border-radius: 50%;
          display: inline-block;
          animation: pulse 1.4s infinite ease-in-out both;
        }
        .dot1 {
          animation-delay: -0.32s;
        }
        .dot2 {
          animation-delay: -0.16s;
        }
        .dot3 {
          animation-delay: 0s;
        }
      `}</style>
      <div className="dot-container">
        <div className="dot dot1"></div>
        <div className="dot dot2"></div>
        <div className="dot dot3"></div>
      </div>
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
      maxRows={4}
      placeholder="Type your message here..."
      className="w-full p-3 border-none rounded-lg  text-stone-100 placeholder-stone-400 overflow-y-auto focus:outline-none focus:ring-1 focus:ring-stone-500/50 transition-all duration-200 ease-in-out resize-none"
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
        <Button variant="outline" className="bg-stone-700/40 border-stone-600/50 hover:bg-stone-700/60 hover:border-stone-500/50 transition-all duration-200 min-w-[140px]">
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
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[280px] max-h-[70vh] overflow-auto bg-stone-800/95 backdrop-blur-sm border-stone-600/50">
        <DropdownMenuGroup>
          {Object.values(models).map((m) => (
            <DropdownMenuItem
              key={m.id}
              onClick={() => setModel({ name: m.name, id: m.id, provider: m.provider })}
              className={cn(
                "flex items-center gap-3 py-3 px-4 cursor-pointer hover:bg-stone-700/60",
                m.id === model.id && "bg-stone-700/80"
              )}
            >
              <div className="relative w-8 h-8">
                <Image
                  src={m.img}
                  alt={m.name}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-stone-200">{m.name}</span>
                {m.provider !== "openai" && (
                  <span className="text-xs text-stone-400">{m.provider}</span>
                )}
              </div>
              {m.id === model.id && (
                <CheckIcon size={16} className="ml-auto text-stone-300" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
