"use client";

import React from "react";
import { Send, OctagonX } from "lucide-react";
import { Button } from "./ui/button";

export default function SubmitButton({
  status,
  onSubmit,
  onStop,
  isInitiatingChat,
  isFetchingMessages,
}) {
  // Define a spinner animation for loading states
  const LoadingSpinner = () => (
    <div className="animate-spin">
      <svg
        className="w-5 h-5"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
  );

  // If the system is streaming (responding), show the stop button
  if (status === "streaming") {
    return (
      <Button
        variant="destructive"
        onClick={onStop}
        className="shadow-md hover:shadow-lg transition-all duration-200"
      >
        <OctagonX className="w-5 h-5" />
      </Button>
    );
  }

  // If we're initiating a new chat or waiting for a response or if status is submitted
  if (
    isInitiatingChat ||
    isFetchingMessages ||
    status === "in_progress" ||
    status === "submitted"
  ) {
    return (
      <Button
        variant="outline"
        disabled
        className="bg-primary/70 text-primary-foreground border-primary/30 shadow-md transition-all duration-200 min-w-[40px]"
      >
        <LoadingSpinner />
      </Button>
    );
  }

  // Default state - ready to send
  return (
    <Button
      variant="outline"
      onClick={onSubmit}
      className="bg-primary/80 hover:bg-primary text-primary-foreground hover:text-primary-foreground border-primary/30 shadow-md hover:shadow-lg transition-all duration-200"
    >
      <Send className="w-5 h-5" />
    </Button>
  );
}
