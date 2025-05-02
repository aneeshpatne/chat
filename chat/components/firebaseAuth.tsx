"use client";

import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import { app } from "@/lib/firebaseConfig";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { AiOutlineLoading } from "react-icons/ai";

// Define FirebaseError interface
interface FirebaseError {
  code: string;
  message: string;
}

export default function GoogleLogin() {
  const router = useRouter();
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const [isLoading, setIsLoading] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsSignedIn(true);
      } else {
        setIsSignedIn(false);
      }
      setInitialCheckDone(true);
    });

    return () => unsubscribe();
  }, [auth]);

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Get Firebase ID token
      const token = await user.getIdToken();

      const res = await fetch("/api/sessionLogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (!res.ok) {
        throw new Error("Failed to set session cookie.");
      }

      setIsSignedIn(true);
      router.push("/chat");
    } catch (err) {
      const firebaseError = err as FirebaseError;

      if (firebaseError.code === "auth/popup-closed-by-user") {
        setError("Sign-in was cancelled. Please try again.");
      } else if (firebaseError.code === "auth/cancelled-popup-request") {
        setError("Another sign-in attempt is in progress.");
      } else if (firebaseError.code === "auth/popup-blocked") {
        setError(
          "Sign-in popup was blocked by your browser. Please allow popups for this site."
        );
      } else if (firebaseError.code === "auth/unauthorized-domain") {
        setError(
          "This domain is not authorized for sign-in. Please contact support."
        );
      } else if (firebaseError.code === "auth/operation-not-allowed") {
        setError(
          "Google sign-in is not enabled for this app. Please try another method or contact support."
        );
      } else {
        setError(
          "Login is restricted to only authorized users, new logins are not allowed."
        );
      }

      setIsLoading(false);
    }
  };

  if (!initialCheckDone) {
    return (
      <div className="flex items-center justify-center gap-3">
        <AiOutlineLoading className="animate-spin h-5 w-5 text-blue-500" />
        <span>Checking authentication...</span>
      </div>
    );
  }

  if (isSignedIn) {
    return (
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center justify-center gap-2 text-green-600 font-medium mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span>You are already signed in!</span>
        </div>
        <button
          onClick={() => router.push("/chat")}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          Go to Chat
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {error && (
        <div className="flex items-center justify-center gap-2 p-3 mb-3 w-full text-red-600 bg-red-50 border border-red-200 rounded-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}
      <button
        onClick={handleLogin}
        disabled={isLoading}
        className="flex items-center justify-center gap-3 w-full sm:w-auto px-6 py-3 rounded-md bg-white text-gray-800 hover:bg-gray-100 border border-gray-300 shadow-sm transition-all duration-200 ease-in-out font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <AiOutlineLoading className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" />
            Signing in...
          </>
        ) : (
          <>
            <Image src="/google.svg" alt="Google logo" width={20} height={20} />
            Sign in with Google
          </>
        )}
      </button>
    </div>
  );
}
