"use client";
import TextareaAutosize from "react-textarea-autosize";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
export default function Chat() {
  const [message, setMessage] = useState("");
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  });
  const handleChange = (e) => {
    setMessage(e.target.value);
  };
  if (!mounted) {
    return (
      <div className="flex flex-1 justify-center items-center h-screen">
        <div className="flex flex-col w-[80%] max-w-2xl">
          {/* Skeleton for the heading */}
          <div className="h-10 w-3/4 bg-stone-700/30 rounded-md mb-4 animate-pulse"></div>

          {/* Skeleton for the chat box */}
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
  return (
    <div className="flex flex-1 justify-center items-center h-screen">
      <div className="flex flex-col w-[80%] max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight mb-4 bg-gradient-to-r from-stone-100 via-stone-300 to-stone-100 inline-block text-transparent bg-clip-text drop-shadow-sm">
          Good Afternoon, Aneesh!
        </h1>
        <div className="flex flex-col p-4 bg-stone-800 rounded-md border border-stone-600">
          <TextareaAutosize
            value={message}
            onChange={handleChange}
            minRows={1}
            maxRows={4}
            placeholder="Type your message here..."
            className="w-full p-2 border-none rounded-md text-white overflow-y-auto focus:outline-none transition-all duration-150 ease-in-out resize-none"
          />
          <div className="flex justify-end mt-2">
            <Button variant="outline">
              <Send size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
