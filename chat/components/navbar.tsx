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
  RefreshCw,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
// Removed unused imports
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOutAction } from "@/app/(auth)/auth/actions";
import { fetchChats } from "@/app/actions/table"; // Import fetchChats

interface ChatItem {
  id: string;
  title: string | null; // Title can be null
  createdAt: Date | null; // CreatedAt can be null
}

export default function NavBar({
  user,
}: {
  user: { email?: string; id: string };
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [recentChats, setRecentChats] = useState<ChatItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggle = () => setOpen(!open);

  const handleLogout = async () => {
    signOutAction();
  };

  const handleNewChat = () => {
    router.push("/chat");
  };

  const loadChats = async () => {
    setIsLoading(true);
    try {
      const chats = await fetchChats();
      if (Array.isArray(chats)) {
        setRecentChats(chats);
      } else {
        console.error("fetchChats did not return an array:", chats);
        setRecentChats([]);
      }
    } catch (error) {
      console.error("Failed to fetch chats:", error);
      setRecentChats([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Reload chats manually
  const handleReload = () => {
    loadChats();
  };

  useEffect(() => {
    if (open) {
      loadChats();
    }
  }, [open]);

  return (
    <>
      {" "}
      {!open && (
        <button
          onClick={toggle}
          className="fixed top-4 left-4 z-50 p-2.5 bg-background/70 text-foreground border border-border/40 rounded-lg hover:bg-background/90 hover:border-primary/30 hover:text-primary transition-all duration-200 shadow-sm backdrop-blur-md group"
          aria-label="Open sidebar"
        >
          <ArrowRight className="h-4.5 w-4.5 group-hover:translate-x-0.5 transition-transform" />
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
                Chat
              </h1>
            </div>
          )}{" "}
          <button
            className="p-2 rounded-lg border border-transparent hover:bg-sidebar-accent/10 hover:border-sidebar-border/40 hover:text-sidebar-accent-foreground transition-all duration-200 group"
            onClick={toggle}
            aria-label="Close sidebar"
          >
            {open && (
              <ArrowLeft className="h-4.5 w-4.5 group-hover:-translate-x-0.5 transition-transform" />
            )}
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
            </div>{" "}
            <div className="flex-1 overflow-y-auto px-3">
              <div className="mt-1 pt-1">
                <div className="flex items-center justify-between px-3 mb-2">
                  <h3 className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider">
                    Recent Chats
                  </h3>
                  <button
                    onClick={handleReload}
                    disabled={isLoading}
                    className="p-1.5 rounded-md text-primary/70 hover:bg-sidebar-accent/20 hover:text-primary transition-all"
                    aria-label="Refresh chats"
                  >
                    <RefreshCw
                      className={`h-3.5 w-3.5 ${
                        isLoading ? "animate-spin text-primary" : ""
                      }`}
                    />
                  </button>
                </div>{" "}
                {isLoading ? (
                  <div className="space-y-2 px-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 animate-pulse"
                      >
                        <div className="w-4 h-4 rounded-full bg-sidebar-accent/30"></div>
                        <div className="flex-1">
                          <div className="h-3 w-3/4 bg-sidebar-accent/30 rounded mb-1.5"></div>
                          <div className="h-2 w-1/2 bg-sidebar-accent/20 rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-1">
                    {recentChats.length > 0 ? (
                      recentChats.map((chat) => (
                        <RecentChatItem
                          key={chat.id}
                          label={chat.title || "Untitled Chat"} // Use chat title or a default
                          time={
                            chat.createdAt
                              ? formatTimeAgo(chat.createdAt)
                              : "Unknown time"
                          } // Format timestamp
                          onClick={() => router.push(`/chat/${chat.id}`)} // Navigate to chat on click
                        />
                      ))
                    ) : (
                      <p className="px-3 text-sm text-sidebar-foreground/50">
                        No recent chats.
                      </p>
                    )}
                  </div>
                )}
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

// Helper function to format time (simplified version)
function formatTimeAgo(date: Date | string): string {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return past.toLocaleDateString();
}

function RecentChatItem({
  label,
  time,
  onClick,
}: {
  label: string;
  time: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent/10 cursor-pointer transition-all"
    >
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
