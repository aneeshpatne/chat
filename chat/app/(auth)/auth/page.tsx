"use client";
import dynamic from "next/dynamic";
import Image from "next/image";

const FirebaseAuthUI = dynamic(() => import("@/components/firebaseAuth"), {
  ssr: false,
});

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-10 bg-opacity-80 backdrop-blur-sm rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold mb-3 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Chat
          </h1>
          <p className="text-gray-400 mb-4 text-lg">
            Unleash the full spectrum of AI intelligence
          </p>

          {/* AI model providers */}
          <div className="flex justify-center flex-wrap gap-3 mb-6">
            <div className="flex items-center gap-1 bg-black/30 px-2 py-1 rounded-md">
              <Image src="/openai.svg" alt="OpenAI" width={18} height={18} />
              <span className="text-xs text-gray-300">GPT-4</span>
            </div>
            <div className="flex items-center gap-1 bg-black/30 px-2 py-1 rounded-md">
              <Image
                src="/anthropic.svg"
                alt="Anthropic"
                width={18}
                height={18}
              />
              <span className="text-xs text-gray-300">Claude 3</span>
            </div>
            <div className="flex items-center gap-1 bg-black/30 px-2 py-1 rounded-md">
              <Image src="/gemini.svg" alt="Gemini" width={18} height={18} />
              <span className="text-xs text-gray-300">Gemini Pro</span>
            </div>
            <div className="flex items-center gap-1 bg-black/30 px-2 py-1 rounded-md">
              <Image
                src="/x-ai.svg"
                alt="X AI"
                width={18}
                height={18}
                className="text-gray-200"
              />
              <span className="text-xs text-gray-300">X AI</span>
            </div>
            <div className="flex items-center gap-1 bg-black/30 px-2 py-1 rounded-md">
              <span className="text-xs text-gray-300 font-semibold">+</span>
              <span className="text-xs text-gray-300">Many More</span>
            </div>
          </div>

          <p className="text-gray-400 text-sm mb-6">
            One interface, endless possibilities. Seamlessly switch between the
            world's most advanced AI models to find the perfect answer for any
            question.
          </p>

          {/* Tech stack */}
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            <div className="flex items-center gap-1 bg-gray-800 px-2 py-1 rounded-full">
              <Image
                src="/vercel.svg"
                alt="Vercel"
                width={14}
                height={14}
                className="invert"
              />
              <span className="text-xs text-gray-300">Vercel AI SDK</span>
            </div>
            <div className="flex items-center gap-1 bg-gray-800 px-2 py-1 rounded-full">
              <Image
                src="/next.svg"
                alt="Next.js"
                width={14}
                height={14}
                className="invert"
              />
              <span className="text-xs text-gray-300">Next.js</span>
            </div>
            <div className="flex items-center gap-1 bg-gray-800 px-2 py-1 rounded-full">
              <Image
                src="/firebase-logo.svg"
                alt="Firebase"
                width={14}
                height={14}
                className="text-yellow-500"
              />
              <span className="text-xs text-gray-300">Firebase</span>
            </div>
            <div className="flex items-center gap-1 bg-gray-800 px-2 py-1 rounded-full">
              <Image
                src="/dexie-logo.svg"
                alt="Dexie.js"
                width={14}
                height={14}
                className="text-blue-400"
              />
              <span className="text-xs text-gray-300">Dexie.js</span>
            </div>
          </div>

          <p className="text-gray-500 text-xs mb-2">
            Lightning-fast performance with efficient caching and real-time
            streaming
          </p>
        </div>

        <div className="flex justify-center mb-6">
          <div className="h-0.5 w-24 bg-gradient-to-r from-blue-500 to-purple-600"></div>
        </div>

        <div className="flex justify-center">
          <FirebaseAuthUI />
        </div>
      </div>
    </div>
  );
}
