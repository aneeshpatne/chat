"use client";

import { useChat } from "@ai-sdk/react";
import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Send,
  LayoutTemplate,
  X,
  OctagonX,
  CheckIcon,
  Scroll,
  ChevronDown,
  LogOut,
} from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";
import React from "react";
import { models } from "@/components/models";
import Image from "next/image";
import { useRef } from "react";
import MessageLoadingAnimation from "@/components/MessageLoadingAnimation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { set } from "lodash";
import NavBar from "@/components/navbar";
import { saveMessage } from "@/app/actions/savemessage";
import { createSession } from "@/app/actions/session";
import { v4 as uuidv4 } from "uuid";
import { getMessagesByChatId } from "@/app/actions/fetchmessage";
import { generateTitle } from "@/app/actions/title";
import { createChat } from "@/app/actions/table"; // Added import
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
      setToken((prevTokens) => ({
        ...prevTokens,
        [message.id]: {
          completionTokens: options.usage.completionTokens,
          promptTokens: options.usage.promptTokens,
          totalTokens: options.usage.totalTokens,
        },
      }));
      const text = message.parts
        .filter((p) => p.type === "text")
        .map((p) => p.text)
        .join("");
      const reasoning = message.parts
        .filter((p) => p.type === "reasoning")
        .map((p) => p.reasoning)
        .join("");

      try {
        await saveMessage({
          id: uuidv4(),
          chatId: sessionId,
          role: "assistant",
          content: text,
          reasoning,
          promptTokens: options.usage.promptTokens,
          completionTokens: options.usage.completionTokens,
          totalTokens: options.usage.totalTokens,
        });
      } catch (err) {
        console.error("Error saving assistant message:", err);
      }
    },
  });

  const { append, input, handleInputChange, status, stop } = chat;
  const handleSubmit = async (e) => {
    e.preventDefault();

    const combinedInput = addMessage ? `${addMessage}\n\n${input}` : input;

    if (!sessionId) {
      setIsInitiatingChat(true); // Set loading state for new chat initiation
      try {
        handleInputChange({ target: { value: "" } });
        setPendingMessage(combinedInput);

        const newSessionID = await createSession();
        const title = await generateTitle(combinedInput);
        // Ensure user and user.id are available before calling createChat
        if (user && user.id) {
          await createChat(newSessionID, title, user.id);
        } else {
          console.error("User ID is not available, cannot create chat entry.");
          // Optionally, handle this error more gracefully (e.g., show a message to the user)
          setIsInitiatingChat(false); // Reset loading state
          return;
        }

        const userMessageId = crypto.randomUUID();
        try {
          await saveMessage({
            id: userMessageId,
            chatId: newSessionID, // Use the new session ID
            role: "user",
            content: combinedInput,
          });
        } catch (err) {
          console.error("Failed to save first user message:", err);
          // Decide if this error should stop the process or just be logged
        }

        router.push(`/chat/${newSessionID}`);
        // setIsInitiatingChat will be set to false by the useEffect watching sessionId
      } catch (err) {
        console.error("Failed to initiate chat:", err);
        setIsInitiatingChat(false); // Reset loading state on error
      }
    } else {
      const userMessageId = crypto.randomUUID();

      try {
        const result = await saveMessage({
          id: userMessageId,
          chatId: sessionId,
          role: "user",
          content: combinedInput,
        });
      } catch (err) {
        console.error("Failed to save user message:", err);
      }

      setaddMessage("");
      handleInputChange({ target: { value: "" } });

      chat.append(
        { role: "user", content: combinedInput, id: userMessageId },
        { data: { model: model.id, provider: model.provider } }
      );
    }
  };
  useEffect(() => {
    if (sessionId) {
      setIsInitiatingChat(false); // Reset initiating state if a session ID is present
    }
    const fetchMessage = async () => {
      console.log("Fetching messages...");
      if (!sessionId) {
        setInitialMessage([]); // Reset if no session ID
        return;
      }
      setIsFetchingMessages(true); // Set loading true
      setInitialMessage([]); // Reset initial messages before fetching new ones
      try {
        console.log("Fetching messages for session:", sessionId);
        const data = await getMessagesByChatId(sessionId);
        console.log("Fetched messages:", data);
        setInitialMessage(data);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
        setInitialMessage([]); // Reset on error
      } finally {
        setIsFetchingMessages(false); // Set loading false
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
      isFetchingMessages, // Add to context
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
      isFetchingMessages, // Add to context dependencies
    ]
  );

  useEffect(() => {
    if (sessionId && pendingMessage) {
      append(
        { role: "user", content: pendingMessage },
        { data: { model: model.id, provider: model.provider } }
      );
      setPendingMessage(null);
    }
  }, [sessionId, pendingMessage, append, model]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <ChatContext.Provider value={contextValue}>
      <div className="relative">
        <NavBar user={user} />
        <div className="flex flex-col relative" style={{ height: "100dvh" }}>
          {showButton && (
            <SelectionButton
              onClick={handleAddClick}
              position={buttonPosition}
            />
          )}
          <div ref={containerRef} className="flex-grow overflow-auto">
            {isInitiatingChat ? (
              <div className="flex flex-col items-center justify-center h-full flex-grow p-4">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mb-4"></div>
                <p className="text-muted-foreground">Starting new chat...</p>
              </div>
            ) : (
              children
            )}
          </div>
          <div className="flex flex-col items-center gap-2 absolute left-0 right-0 bottom-0 ">
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
  return (
    <TextareaAutosize
      value={input}
      onChange={handleInputChange}
      minRows={1}
      maxRows={10}
      placeholder="Type your message here..."
      className="w-full p-2 border-none rounded-md text-foreground bg-transparent overflow-y-auto focus:outline-none transition-all duration-150 ease-in-out resize-none"
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          onSubmit(e);
        }
      }}
    />
  );
});

// Using PascalCase and proper React memo
const ModelSelector = React.memo(function ModelSelector({ model, setModel }) {
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
});

// Using PascalCase and proper React memo
const ModelItem = React.memo(function ModelItem({
  model,
  isSelected,
  setModel,
}) {
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
