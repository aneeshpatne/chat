"use client";
import { useState } from "react";
import { ArrowRight, ArrowLeft, User } from "lucide-react";

export default function NavBar() {
  const [open, setOpen] = useState(true);
  const toggle = () => setOpen(!open);

  return (
    <aside
      className={`fixed md:sticky top-0 h-full bg-stone-800 text-white transistion-all duration-200 ${
        open ? "w-64" : "w-16"
      } flex flex-col`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {open && (
          <h1 className={`Text-xl font-bold whitespace-nowrap`}>
            Welcome to Chat!
          </h1>
        )}
        <button className="p-2 rounded-full hover:bg-gray-700" onClick={toggle}>
          {open ? <ArrowLeft /> : <ArrowRight />}
        </button>
      </div>
      <div
        className={`mt-auto flex items-center ${
          open ? "justify-between" : "justify-center"
        } p-4 border-t border-gray-700 transition-all duration-200`}
      >
        {open && (
          <span
            className={`font-medium text-gray-300 hover:text-white transition-colors transition-opacity duration-200
                ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            Login
          </span>
        )}
        <button
          className={`p-2 rounded-full hover:bg-gray-700 hover:text-blue-400 transition-all duration-200`}
        >
          <User className="h-5 w-5" />
        </button>
      </div>
    </aside>
  );
}
