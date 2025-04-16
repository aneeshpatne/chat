"use client";

import React from "react";

export default function Loading() {
  return (
    <div className="flex flex-1 justify-center items-center h-screen">
      <div className="flex flex-col w-[80%] max-w-2xl p-4 bg-stone-800 rounded-md border border-stone-600">
        <div className="flex justify-center items-center space-y-4 py-12">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-stone-500 animate-spin"></div>
            <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-t-4 border-b-4 border-stone-300 animate-ping opacity-20"></div>
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <p className="text-stone-400 text-sm">Loading chat...</p>
        </div>
      </div>
    </div>
  );
}
