"use client";

import { useChat } from "@ai-sdk/react";
import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  LayoutTemplate,
  X,
  CheckIcon,
  Scroll,
  ChevronDown,
  LogOut,
  ChevronRight,
} from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";
import React from "react";
import { models, useModels, modelsByCompany } from "@/components/models";
import Image from "next/image";
import { useRef } from "react";
import SubmitButton from "@/components/SubmitButton";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { set } from "lodash";
import NavBar from "@/components/navbar";
import { createSession } from "@/app/actions/session";
import { v4 as uuidv4 } from "uuid";
import { getMessagesByChatId } from "@/app/actions/fetchmessage";
import { generateTitle } from "@/app/actions/title";
import { createChat } from "@/app/actions/table"; // Added import
// Use flat list of models for backwards compatibility
const modelList = Object.values(models);
export const ChatContext = createContext(null);

export default function ChatLayout({ children, signOutAction, user }) {
  const router = useRouter();
  const pathname = usePathname();
  const { id: sessionId } = useParams();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pendingMessage, setPendingMessage] = useState(null);
  const [model, setModel] = useState({
    name: "4.1 Nano",
    id: "gpt-4.1-nano",
    provider: "openai",
  });
  const [showButton, setShowButton] = useState(false);
  const [showScroll, setShowScroll] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const [selectedText, setSelectedText] = useState("");
  const [addMessage, setaddMessage] = useState("");
  const [token, setToken] = useState({});
  const [initialMessage, setInitialMessage] = useState([]);
  const [scrollToBottomFn, setScrollToBottomFn] = useState(() => () => {});
  const [isFetchingMessages, setIsFetchingMessages] = useState(false); // New loading state for messages
  const [isInitiatingChat, setIsInitiatingChat] = useState(false); // New state for initiating chat

  // Create refs before effects
  const containerRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    setLoading(false);
  }, []);
  const chat = useChat({
    id: sessionId,
    experimental_throttle: 75,
    sendExtraMessageFields: true,
    initialMessages: initialMessage,
    onError: (error) => console.error("Chat error:", error),
    onFinish: async (message, options) => {
      console.log("Message finished, saving tokens and message to database");
      if (options?.usage) {
        setToken((prevTokens) => ({
          ...prevTokens,
          [message.id]: {
            id: message.id,
            completionTokens: options.usage.completionTokens,
            promptTokens: options.usage.promptTokens,
            totalTokens: options.usage.totalTokens,
          },
        }));
      }
    },
  });

  const { append, input, handleInputChange, status, stop } = chat;
  const handleSubmit = async (e) => {
    e.preventDefault();

    const combinedInput = addMessage ? `${addMessage}\n\n${input}` : input;
    if (!sessionId) {
      setIsInitiatingChat(true);
      try {
        handleInputChange({ target: { value: "" } });
        setPendingMessage(combinedInput);
        const newSessionID = await createSession();
        const title = await generateTitle(combinedInput);
        if (user && user.id) {
          await createChat(newSessionID, title, user.id);
        } else {
          console.error("User ID is not available, cannot create chat entry.");
          setIsInitiatingChat(false);
          return;
        }

        router.push(`/chat/${newSessionID}`);
      } catch (err) {
        console.error("Failed to initiate chat:", err);
        setIsInitiatingChat(false);
      }
    } else {
      const userMessageId = crypto.randomUUID();

      // No need to save message here anymore - it's handled by the API route
      setaddMessage("");
      handleInputChange({ target: { value: "" } });

      chat.append(
        { role: "user", content: combinedInput, id: userMessageId },
        {
          data: {
            model: model.id,
            provider: model.provider,
            sessionId: sessionId,
          },
        }
      );
    }
  };
  useEffect(() => {
    if (sessionId) {
      setIsInitiatingChat(false);
    }
    const fetchMessage = async () => {
      if (!sessionId) {
        setInitialMessage([]);
        return;
      }
      setIsFetchingMessages(true);
      setInitialMessage([]);
      try {
        const data = await getMessagesByChatId(sessionId);
        console.log("Fetched messages:", data);

        // Extract token information from fetched messages
        const tokenInfo = {};
        data.forEach((message) => {
          if (message.usage) {
            tokenInfo[message.id] = {
              id: message.id,
              promptTokens: message.usage.promptTokens,
              completionTokens: message.usage.completionTokens,
              totalTokens: message.usage.totalTokens,
            };
          }
        });

        // Update token state with extracted info
        setToken(tokenInfo);
        setInitialMessage(data);
      } catch (err) {
        setInitialMessage([]);
      } finally {
        setIsFetchingMessages(false);
      }
    };
    fetchMessage();
  }, [sessionId]);

  const contextValue = useMemo(
    () => ({
      ...chat,
      model,
      setModel,
      handleSubmit,
      token,
      pendingMessage,
      setSelectedText,
      setaddMessage,
      selectedText,
      setShowScroll,
      scrollToBottomFn,
      setScrollToBottomFn,
      user,
      initialMessage,
      isFetchingMessages,
      modelsByCompany,
      sessionId,
    }),
    [
      chat,
      model,
      token,
      pendingMessage,
      handleSubmit,
      scrollToBottomFn,
      selectedText,
      user,
      initialMessage,
      isFetchingMessages,
      sessionId,
    ]
  );
  useEffect(() => {
    if (sessionId && pendingMessage) {
      const firstMessageId = crypto.randomUUID();
      append(
        { role: "user", content: pendingMessage, id: firstMessageId },
        {
          data: {
            model: model.id,
            provider: model.provider,
            sessionId: sessionId,
          },
        }
      );
      setPendingMessage(null);
    }
  }, [sessionId, pendingMessage, append, model]);

  if (loading) {
    return (
      <ChatContext.Provider value={contextValue}>
        <div className="relative">
          <NavBar user={user} />
          <div className="flex flex-col relative" style={{ height: "100dvh" }}>
            <div className="flex-grow"></div>
            <div className="flex flex-col items-center gap-2 absolute left-0 right-0 bottom-0 ">
              <div className="mx-auto w-[80%] max-w-4xl mb-4">
                <div className="flex flex-col p-4 bg-card/60 backdrop-blur-sm rounded-md border border-border flex-shrink-0">
                  <div className="h-10"></div>
                  <div className="flex justify-between mt-3">
                    <div className="w-24 h-10"></div>
                    <SubmitButton
                      status="in_progress"
                      isInitiatingChat={true}
                      isFetchingMessages={false}
                      onSubmit={() => {}}
                      onStop={() => {}}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ChatContext.Provider>
    );
  }

  return (
    <ChatContext.Provider value={contextValue}>
      <div className="relative">
        <NavBar user={user} />      <div className="flex flex-col fixed inset-0" style={{ height: "100dvh" }}>
        {showButton && (
          <SelectionButton
            onClick={handleAddClick}
            position={buttonPosition}
          />
        )}
        <div ref={containerRef} className="flex-grow overflow-auto pb-32">
          {children}
        </div>
        <div className="flex flex-col items-center gap-2 fixed left-0 right-0 bottom-0 z-10">
          {showScroll && <ScrollToBottom onClick={scrollToBottomFn} />}
          <div className="mx-auto w-[80%] max-w-4xl mb-4">
              {mounted ? (
                <div className="flex flex-col p-4 bg-card/60 backdrop-blur-sm rounded-md border border-border flex-shrink-0">
                  <AdditionalMessage
                    message={addMessage}
                    setaddMessage={setaddMessage}
                  />
                  <TextAreaComponent
                    input={input}
                    handleInputChange={handleInputChange}
                    onSubmit={handleSubmit}
                  />
                  <div className="flex justify-between mt-3">
                    <ModelSelector model={model} setModel={setModel} />{" "}
                    <SubmitButton
                      status={status}
                      isInitiatingChat={isInitiatingChat}
                      isFetchingMessages={isFetchingMessages}
                      onSubmit={handleSubmit}
                      onStop={stop}
                    />
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
        </div>
      </div>
    </ChatContext.Provider>
  );
}

const ScrollToBottom = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      className=" z-10 flex w-auto items-center gap-2 bg-card/70 backdrop-blur-sm border border-border/50 rounded-lg p-2 px-3 shadow-md text-sm text-muted-foreground hover:bg-muted/80 transition-colors cursor-pointer"
      aria-label="Scroll to bottom"
    >
      <ChevronDown size={16} />
      <span>Scroll to Bottom</span>
    </div>
  );
};

const AdditionalMessage = ({ message, setaddMessage }) => {
  const handleClick = () => {
    setaddMessage("");
  };
  if (!message) return null;
  return (
    <div className="w-full bg-transparent border border-border/50 rounded-lg p-3 shadow-md relative mb-5">
      <div className="line-clamp-3 text-sm text-muted-foreground pr-6">
        {message}
      </div>
      <button
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted/80 text-muted-foreground transition-colors"
        aria-label="Cancel"
      >
        <X size={16} onClick={handleClick} />
      </button>
    </div>
  );
};
// Using named function for React DevTools and Fast Refresh
const TextAreaComponent = React.memo(function TextAreaComponent({
  input,
  handleInputChange,
  onSubmit,
}) {
  return (    <TextareaAutosize
      value={input}
      onChange={handleInputChange}
      minRows={1}
      maxRows={10}
      placeholder="Type your messages here..."
      className="w-full p-2 border-none rounded-md text-foreground bg-transparent overflow-y-auto focus:outline-none transition-all duration-150 ease-in-out resize-none"
      style={{ touchAction: 'manipulation' }}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          onSubmit(e);
        }
      }}
      onTouchStart={(e) => {
        e.stopPropagation();
      }}
    />
  );
});

// Using PascalCase and proper React memo
const ModelSelector = React.memo(function ModelSelector({ model, setModel }) {
  const [selectedCompany, setSelectedCompany] = useState(null);

  // Import modelsByCompany from models.tsx
  const { byCompany } = useModels();
  // Find current company for the selected model
  const currentCompany = useMemo(() => {
    return byCompany.find((company) =>
      company.models.some((m) => m.id === model.id)
    );
  }, [byCompany, model.id]);
  return (
    <DropdownMenu closeOnSelect={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center">
          {currentCompany?.img ? (
            <Image
              src={currentCompany.img}
              alt={`${currentCompany.name} logo`}
              height={16}
              width={16}
              className="object-contain flex-shrink-0 mr-2"
            />
          ) : (
            <LayoutTemplate size={16} className="mr-2" />
          )}
          <span>{model.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-h-[80vh] overflow-y-auto bg-popover p-1 border border-border rounded-md shadow-lg min-w-[200px]">
        {selectedCompany ? (
          <>
            {" "}
            <div
              className="flex items-center gap-2 p-2 cursor-pointer hover:bg-muted group transition-colors duration-200"
              onClick={(e) => {
                // Prevent the dropdown from closing
                e.preventDefault();
                e.stopPropagation();
                setSelectedCompany(null);
              }}
            >
              <ChevronDown
                className="rotate-90 mr-1 group-hover:-translate-x-1 transition-transform duration-200"
                size={16}
              />
              <span className="font-medium">Back to companies</span>
            </div>{" "}
            <div className="h-px bg-border my-1" />
            {(() => {
              const company = byCompany.find((c) => c.name === selectedCompany);
              return (
                <>
                  <div className="px-2 py-1">
                    <div className="flex items-center gap-2 mb-2">
                      {company?.img && (
                        <Image
                          src={company.img}
                          alt={`${company.name} logo`}
                          height={20}
                          width={20}
                          className="object-contain flex-shrink-0"
                        />
                      )}
                      <span className="font-semibold text-sm">
                        {company?.name} Models
                      </span>
                    </div>
                  </div>
                  {company?.models.map((m) => (
                    <ModelItem
                      key={m.id}
                      model={m}
                      isSelected={m.id === model.id}
                      setModel={setModel}
                    />
                  ))}
                </>
              );
            })()}
          </>
        ) : (
          byCompany.map((company) => (
            <CompanyItem
              key={company.name}
              company={company}
              onSelect={() => setSelectedCompany(company.name)}
            />
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

// Company item component for showing company entries in dropdown
const CompanyItem = React.memo(function CompanyItem({ company, onSelect }) {
  const { name, img } = company;
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e) => {
    // Prevent the dropdown from closing
    e.preventDefault();
    e.stopPropagation();
    onSelect();
  };

  return (
    <DropdownMenuItem
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="cursor-pointer flex items-center justify-between gap-2 p-2 hover:bg-muted focus:bg-muted focus:text-foreground relative"
    >
      <div className="flex items-center gap-2">
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
      </div>
      <ChevronRight
        size={16}
        className={`transition-all duration-200 ease-in-out ${
          isHovered
            ? "text-foreground transform translate-x-1"
            : "text-muted-foreground"
        }`}
      />
    </DropdownMenuItem>
  );
});

// Using PascalCase and proper React memo
const ModelItem = React.memo(function ModelItem({
  model,
  isSelected,
  setModel,
}) {
  const { name, id, provider, img } = model;
  const handleClick = () => {
    setModel(model);
  };

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
});

// Using proper PascalCase and memoization for React components
const SelectionButton = React.memo(function SelectionButton({
  onClick,
  position,
}) {
  return (
    <button
      onClick={onClick}
      style={{
        position: "absolute",
        top: position.y,
        left: position.x,
        zIndex: 10,
      }}
      className="bg-blue-500 text-white px-2 py-1 rounded shadow"
    >
      Add
    </button>
  );
});
