"use client";
import { useState } from "react";
import { ArrowRight, ArrowLeft, User } from "lucide-react";

export default function NavBar() {
  const [open, setOpen] = useState(true);
  const toggle = () => setOpen(!open);

  return (
    <>
      {!open && (
        <button
          onClick={toggle}
          className="fixed top-4 left-4 z-50 p-2 bg-stone-800 text-white rounded-full hover:bg-gray-700 transition-all"
        >
          <ArrowRight />
        </button>
      )}
      <aside
        className={`fixed md:sticky top-0 h-full bg-stone-800 text-white transition-all duration-200 ${
          open ? "w-64" : "w-0"
        } flex flex-col overflow-hidden`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {open && (
            <h1 className="text-xl font-bold whitespace-nowrap">
              Welcome to Chat!
            </h1>
          )}
          <button
            className="p-2 rounded-full hover:bg-gray-700"
            onClick={toggle}
          >
            {open && <ArrowLeft />}
          </button>
        </div>

        {open && (
          <div className="mt-auto flex items-center justify-between p-4 border-t border-gray-700">
            <span className="font-medium text-gray-300 hover:text-white transition-colors">
              Login
            </span>
            <button className="p-2 rounded-full hover:bg-gray-700 hover:text-blue-400 transition-all">
              <User className="h-5 w-5" />
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
