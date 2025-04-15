"use client";
import { useState } from "react";
import { ArrowRight, ArrowLeft, User } from "lucide-react";
export default function NavBar() {
  const [open, setOpen] = useState(true);
  const toggle = () => setOpen(!open);

  return (
    <aside
      className={`fixed h-full bg-gray-800 text-white transistion-all duration-200 ${
        open ? "w-64" : "w-16"
      } flex flex-col`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {open && (
          <h1 className="Text-xl font-bold whitespace-nowrap">
            Welcome to Chat!
          </h1>
        )}
        <button className="p-2 rounded-full hover:bg-gray-700" onClick={toggle}>
          {open ? <ArrowLeft /> : <ArrowRight />}
        </button>
      </div>
      <div
        className={`mt-auto flex items-center ${
          open ? " justify-center" : "justify-between"
        } p-4 border-t border-gray-700`}
      >
        {open && <h1>Login</h1>}
        <button className="p-2 rounded-full hover:bg-gray-700">
          <User />
        </button>
      </div>
    </aside>
  );
}
