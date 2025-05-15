import Image from "next/image";
import { signInAction } from "./actions";
import { Message } from "@/components/ui/form-message";
import { createClient } from "@/utlis/supabase/server";
import { redirect } from "next/navigation";
import SignInForm from "@/components/SignInForm";

export default async function LoginPage(props: {
  searchParams: Promise<Message>;
}) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    return redirect("/chat");
  }

  const searchParams = await props.searchParams;

  // AI models with their logos
  const aiModels = [
    { name: "GPT-4", icon: "openai.svg" },
    { name: "Claude 3", icon: "anthropic.svg" },
    { name: "Gemini Pro", icon: "gemini.svg" },
    { name: "X AI", icon: "x-ai.svg" },
  ];

  // Tech stack used in the application
  const techStack = [
    { name: "Vercel AI SDK", icon: "vercel.svg" },
    { name: "Next.js", icon: "next.svg" },
    { name: "Supabase", icon: "supabase-logo.svg" },
    { name: "Dexie.js", icon: "dexie-logo.svg" },
  ];
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0C0D10]">
      {/* Left side - Hero section */}
      <div className="hidden md:flex md:w-1/2 bg-[#0C0D10] p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#151822]/20 pointer-events-none"></div>
        <div className="z-10 flex flex-col justify-between h-full">
          <div className="flex items-center space-x-3 mb-12">
            <Image
              src="/logo.svg"
              alt="Chat Logo"
              width={36}
              height={36}
              className="h-9 w-9"
            />
            <h2 className="text-white text-2xl font-bold tracking-tight">Chat</h2>
          </div>

          <div className="space-y-10">
            <div>
              <h1 className="text-5xl font-extrabold text-white mb-4 leading-tight">
                Unified AI Platform
              </h1>
              <p className="text-lg text-gray-400 mb-8 max-w-xl">
                Access the world&apos;s most advanced AI models in one seamless
                interface
              </p>
            </div>

            <div className="space-y-8">
              {/* AI Models showcase */}
              <div>
                <h3 className="text-white/90 text-lg font-semibold mb-3">
                  Supported AI Models
                </h3>
                <div className="flex flex-wrap gap-3">
                  {aiModels.map((model) => (
                    <div
                      key={model.name}
                      className="flex items-center gap-2 bg-[#1E2130] px-4 py-2 rounded-lg shadow-sm"
                    >
                      <Image
                        src={`/${model.icon}`}
                        alt={model.name}
                        width={20}
                        height={20}
                      />
                      <span className="text-gray-200 font-medium text-sm">
                        {model.name}
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center gap-2 bg-[#1E2130] px-4 py-2 rounded-lg shadow-sm">
                    <span className="text-gray-200 font-medium text-sm">+More</span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-white/90 text-lg font-semibold mb-3">
                  Key Features
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-3">
                    <div className="bg-[#2A2F3F] p-1.5 rounded-full flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-gray-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-300 text-base">
                      Instant model switching
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="bg-[#2A2F3F] p-1.5 rounded-full flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-gray-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-300 text-base">
                      Efficient response caching
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="bg-[#2A2F3F] p-1.5 rounded-full flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-gray-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-300 text-base">
                      Real-time streaming responses
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Tech stack footer */}
          <div className="mt-16">
            <p className="text-white/60 text-sm mb-2">
              Built with cutting-edge technologies
            </p>
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 bg-[#1E2130] px-3 py-1.5 rounded-md"
                >
                  <Image
                    src={`/${tech.icon}`}
                    alt={tech.name}
                    width={16}
                    height={16}
                  />
                  <span className="text-xs text-gray-300 font-medium">
                    {tech.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Right side - Login form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 bg-[#0C0D10]">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile-only logo and title */}
          <div className="md:hidden flex flex-col items-center mb-8">
            <Image
              src="/logo.svg"
              alt="Chat Logo"
              width={48}
              height={48}
              className="mb-2"
            />
            <h1 className="text-4xl font-bold text-white">Chat</h1>
            <p className="text-gray-400 text-center mt-2">
              Your gateway to advanced AI conversations
            </p>
          </div>
          {/* Sign in card */}
          <div className="bg-[#151822] p-8 rounded-2xl border border-gray-800 shadow-xl">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-1">
                Welcome back
              </h2>
              <p className="text-gray-400 text-sm">
                Sign in to continue to Chat
              </p>
            </div>

            <SignInForm signInAction={signInAction} message={searchParams} />
          </div>
        </div>
      </div>
    </div>
  );
}
