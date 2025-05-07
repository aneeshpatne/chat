"use client";
import { useState, useEffect } from "react";
import {
  ArrowRight,
  ArrowLeft,
  User,
  MessageSquare,
  PlusCircle,
  Search,
  LogOut,
  Settings,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/utlis/supabase/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function NavBar({
  signOutAction,
  user,
}: {
  signOutAction: any;
  user: any;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const toggle = () => setOpen(!open);

  const handleLogout = async () => {
    signOutAction();
  };

  const handleNewChat = () => {
    router.push("/chat");
  };

  return (
    <>
      {!open && (
        <button
          onClick={toggle}
          className="fixed top-4 left-4 z-50 p-2.5 bg-primary/90 text-primary-foreground rounded-xl hover:bg-primary hover:text-primary-foreground transition-all shadow-lg backdrop-blur-sm"
        >
          <ArrowRight className="h-5 w-5" />
        </button>
      )}
      <aside
        className={`fixed top-0 left-0 h-full bg-sidebar text-sidebar-foreground transition-all duration-300 ${
          open ? "w-72" : "w-0"
        } flex flex-col overflow-hidden z-50 ${
          open && "border-r border-sidebar-border/40 shadow-xl"
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-sidebar-border/40">
          {open && (
            <div className="flex items-center gap-3">
              <div className="relative bg-primary p-1.5 rounded-xl shadow-md">
                <Image
                  src="/logo.svg"
                  alt="Chat Logo"
                  width={28}
                  height={28}
                  className="rounded-md"
                />
              </div>
              <h1 className="text-xl font-bold whitespace-nowrap text-sidebar-foreground">
                Chat App
              </h1>
            </div>
          )}
          <button
            className="p-2 rounded-full hover:bg-sidebar-accent/20 hover:text-sidebar-accent-foreground transition-all"
            onClick={toggle}
          >
            {open && <ArrowLeft className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <>
            <div className="px-3 py-4">
              <button
                onClick={handleNewChat}
                className="flex items-center gap-3 w-full bg-primary text-primary-foreground p-3 rounded-lg font-medium shadow-md hover:shadow-lg hover:opacity-90 transition-all"
              >
                <PlusCircle className="h-5 w-5" />
                New Chat
              </button>
            </div>

            <div className="px-3 mb-2">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-sidebar-foreground/50" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full bg-sidebar-accent/10 border border-sidebar-border/30 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-3">
              <div className="mt-1 pt-1">
                <h3 className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider px-3 mb-2">
                  Recent Chats
                </h3>
                <div className="space-y-1">
                  <RecentChatItem label="AI Assistant Help" time="2h ago" />
                  <RecentChatItem label="Code Review" time="Yesterday" />
                  <RecentChatItem label="Project Ideas" time="3d ago" />
                  <RecentChatItem label="Resume Feedback" time="1w ago" />
                  <RecentChatItem label="Learning Resources" time="2w ago" />
                </div>
              </div>
            </div>

            <div className="mt-auto">
              <div className="px-3 py-4 border-t border-sidebar-border/40">
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent/10 cursor-pointer transition-all">
                        <div className="bg-primary/20 p-2 rounded-full">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">User Account</p>
                          <p className="text-xs text-sidebar-foreground/60 truncate">
                            {user.email}
                          </p>
                        </div>
                        <button className="p-1.5 rounded-md hover:bg-sidebar-accent/20 text-sidebar-foreground/80">
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]">
                      <DropdownMenuItem
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => router.push("/profile")}
                      >
                        <Settings size={16} />
                        <span>Settings</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="flex items-center gap-2 text-destructive cursor-pointer"
                        onClick={handleLogout}
                      >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent/10 cursor-pointer transition-all"
                    onClick={() => router.push("/auth")}
                  >
                    <div className="bg-primary/20 p-2 rounded-full">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">Sign In</p>
                      <p className="text-xs text-sidebar-foreground/60">
                        Login to your account
                      </p>
                    </div>
                    <button className="p-1.5 rounded-md hover:bg-sidebar-accent/20 text-sidebar-foreground/80">
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

function RecentChatItem({ label, time }) {
  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent/10 cursor-pointer transition-all">
      <span className="text-primary/70">
        <MessageSquare className="h-4 w-4" />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-sidebar-foreground/90 truncate">{label}</p>
        <p className="text-xs text-sidebar-foreground/50">{time}</p>
      </div>
    </div>
  );
}
