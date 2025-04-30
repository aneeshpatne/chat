"use client";
import { useState } from "react";
import { ArrowRight, ArrowLeft, User } from "lucide-react";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen(!open);

  return (
    <>
      {!open && (
        <button
          onClick={toggle}
          className="fixed top-4 left-4 z-9999 p-2 bg-sidebar text-sidebar-foreground rounded-full hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all " // Use sidebar theme colors
        >
          <ArrowRight />
        </button>
      )}
      <aside
        className={`fixed md:sticky top-0 h-full bg-sidebar text-sidebar-foreground transition-all duration-200 ${
          open ? "w-64" : "w-0"
        } flex flex-col overflow-hidden z-9999 ${
          open && "border-r border-sidebar-border"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          {" "}
          {open && (
            <h1 className="text-xl font-bold whitespace-nowrap">
              Welcome to Chat!
            </h1>
          )}
          <button
            className="p-2 rounded-full hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" // Use sidebar theme colors
            onClick={toggle}
          >
            {open && <ArrowLeft />}
          </button>
        </div>

        {open && (
          <div className="mt-auto flex items-center justify-between p-4 border-t border-sidebar-border">
            {" "}
            <span className="font-medium text-sidebar-foreground/80 hover:text-sidebar-foreground transition-colors">
              {" "}
              Login
            </span>
            <button className="p-2 rounded-full hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all cursor-pointer">
              {" "}
              <User className="h-5 w-5" />
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
