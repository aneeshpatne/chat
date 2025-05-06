"use client";
import { useState } from "react";
import { ArrowRight, ArrowLeft, User } from "lucide-react";
import Image from "next/image";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen(!open);

  return (
    <>
      {!open && (
        <button
          onClick={toggle}
          className="fixed top-4 left-4 z-50 p-2 bg-sidebar text-sidebar-foreground rounded-full hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all shadow-md"
        >
          <ArrowRight className="h-5 w-5" />
        </button>
      )}
      <aside
        className={`fixed top-0 left-0 h-full bg-sidebar text-sidebar-foreground transition-all duration-200 ${
          open ? "w-64" : "w-0"
        } flex flex-col overflow-hidden z-50 ${
          open && "border-r border-sidebar-border shadow-lg"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          {open && (
            <div className="flex items-center gap-2">
              <Image src="/logo.svg" alt="Chat Logo" width={28} height={28} className="rounded-md" />
              <h1 className="text-xl font-bold whitespace-nowrap">Chat</h1>
            </div>
          )}
          <button
            className="p-2 rounded-full hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            onClick={toggle}
          >
            {open && <ArrowLeft className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <>
            <nav className="flex-1 overflow-y-auto p-2">
              {/* Nav items would go here */}
            </nav>
            <div className="mt-auto flex items-center justify-between p-4 border-t border-sidebar-border">
              <span className="font-medium text-sidebar-foreground/80 hover:text-sidebar-foreground transition-colors cursor-pointer">
                Login
              </span>
              <button className="p-2 rounded-full bg-sidebar-accent/10 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all cursor-pointer">
                <User className="h-5 w-5" />
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
