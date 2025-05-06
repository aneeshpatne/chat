import Image from "next/image";
import { signInAction } from "./actions";
import { Message, FormMessage } from "@/components/ui/form-message";
export default async function LoginPage(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
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
            {[
              { name: "GPT-4", icon: "openai.svg" },
              { name: "Claude 3", icon: "anthropic.svg" },
              { name: "Gemini Pro", icon: "gemini.svg" },
              { name: "X AI", icon: "x-ai.svg" },
              { name: "Many More", icon: null },
            ].map(({ name, icon }) => (
              <div
                key={name}
                className="flex items-center gap-1 bg-black/30 px-2 py-1 rounded-md"
              >
                {icon && (
                  <Image src={`/${icon}`} alt={name} width={18} height={18} />
                )}
                <span className="text-xs text-gray-300">{name}</span>
              </div>
            ))}
          </div>

          <p className="text-gray-400 text-sm mb-6">
            One interface, endless possibilities. Seamlessly switch between the
            world's most advanced AI models to find the perfect answer for any
            question.
          </p>

          {/* Tech stack */}
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            {[
              { name: "Vercel AI SDK", icon: "vercel.svg" },
              { name: "Next.js", icon: "next.svg" },
              { name: "Supabase", icon: "supabase-logo.svg" },
              { name: "Dexie.js", icon: "dexie-logo.svg" },
            ].map(({ name, icon }) => (
              <div
                key={name}
                className="flex items-center gap-1 bg-gray-800 px-2 py-1 rounded-full"
              >
                <Image src={`/${icon}`} alt={name} width={14} height={14} />
                <span className="text-xs text-gray-300">{name}</span>
              </div>
            ))}
          </div>

          <p className="text-gray-500 text-xs mb-2">
            Lightning-fast performance with efficient caching and real-time
            streaming
          </p>
        </div>

        <div className="flex justify-center mb-6">
          <div className="h-0.5 w-24 bg-gradient-to-r from-blue-500 to-purple-600"></div>
        </div>

        {/* THIS form now uses your server action directly */}
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
          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md font-bold hover:opacity-90"
          >
            Sign In
          </button>
          <FormMessage message={searchParams} />
        </form>
      </div>
    </div>
  );
}
