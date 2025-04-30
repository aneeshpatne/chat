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

export default function GoogleLogin() {
  const router = useRouter();
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const [isLoading, setIsLoading] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  // Check if user is already signed in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsSignedIn(true);
      } else {
        setIsSignedIn(false);
      }
      setInitialCheckDone(true);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth]);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("User signed in:", result.user);
      // Set isSignedIn to true after successful login
      setIsSignedIn(true);
    } catch (error) {
      console.error("Popup sign-in failed:", error);
      setIsLoading(false);
    }
  };

  // Show loading while checking authentication state
  if (!initialCheckDone) {
    return (
      <div className="flex items-center justify-center gap-3">
        <div className="animate-spin h-5 w-5 text-blue-500">
          <Image src="/spinner.svg" alt="Loading" width={20} height={20} />
        </div>
        <span>Checking authentication...</span>
      </div>
    );
  }

  // If already signed in, show message with button to go to chat
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

  // If not signed in, show the login button
  return (
    <button
      onClick={handleLogin}
      disabled={isLoading}
      className="flex items-center justify-center gap-3 w-full sm:w-auto px-6 py-3 rounded-md bg-white text-gray-800 hover:bg-gray-100 border border-gray-300 shadow-sm transition-all duration-200 ease-in-out font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <>
          <div className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500">
            <Image src="/spinner.svg" alt="Loading" width={20} height={20} />
          </div>
          Signing in...
        </>
      ) : (
        <>
          <Image src="/google.svg" alt="Google logo" width={20} height={20} />
          Sign in with Google
        </>
      )}
    </button>
  );
}
