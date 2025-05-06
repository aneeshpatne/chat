import { signUpAction } from "../auth/actions";
import { FormMessage, Message } from "@/components/ui/form-message";
import Link from "next/link";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4 text-red-500">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <>
      <form
        className="flex flex-col min-w-64 max-w-64 mx-auto"
        action={signUpAction}
      >
        <h1 className="text-2xl font-medium">Sign up</h1>
        <p className="text-sm text-foreground">
          Already have an account?{" "}
          <Link className="text-blue-600 font-medium underline" href="/sign-in">
            Sign in
          </Link>
        </p>
        <div className="flex flex-col gap-2 mt-8">
          <label className="mb-1" htmlFor="email">
            Email
          </label>
          <input
            className="border border-gray-300 px-3 py-2 rounded mb-3"
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
          />

          <label className="mb-1" htmlFor="password">
            Password
          </label>
          <input
            className="border border-gray-300 px-3 py-2 rounded mb-3"
            id="password"
            name="password"
            type="password"
            placeholder="Your password"
            minLength={6}
            required
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Sign up
          </button>

          <FormMessage message={searchParams} />
        </div>
      </form>
    </>
  );
}
