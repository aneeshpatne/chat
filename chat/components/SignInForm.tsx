"use client";

import { FormMessage } from "@/components/ui/form-message";
import type { Message } from "@/components/ui/form-message";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md font-bold hover:opacity-90 transition-all duration-200 disabled:opacity-70"
    >
      <div className="flex items-center justify-center gap-2">
        <span className="loading-dots">
          <span className="dot-1"></span>
          <span className="dot-2"></span>
          <span className="dot-3"></span>
        </span>
        <span>{pending ? "Signing in..." : "Sign In"}</span>
      </div>
    </button>
  );
}

export default function SignInForm({ 
  signInAction, 
  message 
}: { 
  signInAction: (formData: FormData) => Promise<any>,
  message: Message
}) {
  return (
    <form action={signInAction} className="space-y-4">
      <input
        name="email"
        type="email"
        placeholder="Email"
        className="w-full px-4 py-2 rounded-md bg-gray-900 text-white placeholder-gray-500"
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        className="w-full px-4 py-2 rounded-md bg-gray-900 text-white placeholder-gray-500"
        required
      />
      <SubmitButton />
      <style jsx>{`
        .loading-dots {
          display: none;
          align-items: center;
          gap: 2px;
        }
        .loading-dots span {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: currentColor;
          animation: fade 0.8s ease-in-out infinite;
        }
        .dot-1 { animation-delay: 0.1s; }
        .dot-2 { animation-delay: 0.2s; }
        .dot-3 { animation-delay: 0.3s; }
        @keyframes fade {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
        button:disabled .loading-dots {
          display: flex;
        }
      `}</style>
      <FormMessage message={message} />
    </form>
  );
}
