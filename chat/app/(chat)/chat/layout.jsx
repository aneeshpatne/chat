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
import MessageLoadingAnimation from "@/components/MessageLoadingAnimation";
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

        <div className="absolute left-0 right-0 bottom-0 mx-auto w-[80%] max-w-4xl mb-4">
          {mounted ? (
            <div className="flex flex-col p-4 bg-card rounded-md border border-border flex-shrink-0">
              <AdditionalMessage message={""} />
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
                    className="bg-primary/80 hover:bg-primary text-primary-foreground hover:text-primary-foreground border-primary/30 shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col p-4 bg-card rounded-md border border-border animate-pulse">
              <div className="w-full h-10 bg-muted/50 rounded-md mb-3"></div>
              <div className="flex justify-between mt-2">
                <div className="h-9 w-24 bg-muted/50 rounded-md"></div>
                <div className="h-9 w-9 bg-muted/50 rounded-md"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ChatContext.Provider>
  );
}
const AdditionalMessage = ({ message }) => {
  return (
    <div className="w-full bg-card/70 backdrop-blur-sm border border-border/50 rounded-lg p-3 shadow-md relative mb-5">
      <div className="line-clamp-3 text-sm text-muted-foreground pr-6">
        {message ||
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque tempore, vitae deleniti velit corrupti non minima dicta delectus, hic inventore excepturi molestiae? Nulla, eum perspiciatis dignissimos rem pariatur debitis obcaecati voluptate fugit asperiores accusantium harum nostrum autem non veniam placeat odio voluptas a explicabo animi provident reiciendis ipsum quisquam similique."}
      </div>
      <button
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted/80 text-muted-foreground transition-colors"
        aria-label="Cancel"
      >
        <X size={16} />
      </button>
    </div>
  );
};
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
      className="w-full p-2 border-none rounded-md text-foreground bg-transparent overflow-y-auto focus:outline-none transition-all duration-150 ease-in-out resize-none" // Use text-foreground, bg-transparent
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
      <DropdownMenuContent className="max-h-[80vh] overflow-y-auto bg-popover p-1 border border-border rounded-md shadow-lg min-w-[200px]">
        {modelList.map((m) => (
          <ModelItem
            key={m.id}
            model={m}
            isSelected={m.id === model.id}
            setModel={setModel}
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ModelItem({ model, isSelected, setModel }) {
  const { name, id, provider, img } = model;

  const handleClick = () => setModel(model);

  return (
    <DropdownMenuItem
      onClick={handleClick}
      className={cn(
        "cursor-pointer flex items-center gap-2 p-2 focus:bg-muted focus:text-foreground",
        isSelected
          ? "bg-accent text-accent-foreground font-semibold"
          : "hover:bg-muted"
      )}
    >
      {img && (
        <Image
          src={img}
          alt={`${name} logo`}
          height={20}
          width={20}
          className="object-contain flex-shrink-0"
        />
      )}
      <span className="flex-grow truncate">{name}</span>
      {provider !== "openai" && (
        <span className="text-xs text-muted-foreground ml-auto flex-shrink-0">
          {provider}
        </span>
      )}
    </DropdownMenuItem>
  );
}
