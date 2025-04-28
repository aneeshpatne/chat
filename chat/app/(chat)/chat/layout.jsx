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
      className="w-full p-3 border-none rounded-lg bg-stone-700/40 text-stone-100 placeholder-stone-400 overflow-y-auto focus:outline-none focus:ring-1 focus:ring-stone-500/50 transition-all duration-200 ease-in-out resize-none"
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
          <Button
            variant="outline"
            onClick={() => setVisibility(!visbility)}
            className="bg-stone-700/40 border-stone-600/50 hover:bg-stone-700/60 hover:border-stone-500/50 transition-all duration-200"
          >
            <LayoutTemplate size={16} className="mr-2 text-stone-300" />
            <span className="text-stone-200">{model.name}</span>
          </Button>
        </>
      ) : (
        <Button
          variant="destructive"
          onClick={() => setVisibility(!visbility)}
          className="hover:bg-red-900/80 transition-all duration-200"
        >
          <X size={16} className="mr-2" />
          <span>Close</span>
        </Button>
      )}
      {visbility && (
        <div className="absolute bottom-full mb-3">
          <div className="flex flex-wrap gap-3 p-3 max-w-[700px] max-h-[80vh] overflow-y-auto bg-stone-800/95 backdrop-blur-sm border border-stone-600/50 rounded-xl shadow-xl">
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
      className={`relative w-24 h-36 p-2 border rounded-xl cursor-pointer transition-all duration-200 ease-in-out
        ${
          isSelected
            ? "border-stone-300 border-2 shadow-lg bg-stone-700/60"
            : "hover:bg-stone-700/40 border-stone-600/50 hover:border-stone-500/50"
        }
      `}
      onClick={handleClick}
    >
      {provider !== "openai" && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-stone-700/70 backdrop-blur-sm text-xs font-medium text-stone-200 px-2 py-1 rounded-md shadow-sm">
          {provider}
        </div>
      )}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-10 h-10 overflow-hidden rounded-lg shadow-md">
        <Image
          src={image}
          alt="Model Image"
          height={35}
          width={35}
          className="object-cover"
        />
      </div>
      <p className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-xs font-medium text-stone-200 bg-stone-700/70 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm text-center w-[90%]">
        {name}
      </p>
    </div>
  );
}
