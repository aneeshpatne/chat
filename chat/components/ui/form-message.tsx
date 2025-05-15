export type Message =
  | { success: string }
  | { error: string }
  | { message: string };

export function FormMessage({ message }: { message: Message }) {
  return (
    <div className="flex flex-col gap-2 w-full max-w-md text-sm mt-4">
      {"success" in message && (
        <div className="bg-gray-800 border-l-4 border-gray-600 rounded-md p-3 text-gray-300">
          <div className="flex">
            <svg
              className="h-5 w-5 text-gray-500 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            {message.success}
          </div>
        </div>
      )}
      {"error" in message && (
        <div className="bg-gray-800 border-l-4 border-gray-600 rounded-md p-3 text-gray-300">
          <div className="flex">
            <svg
              className="h-5 w-5 text-gray-500 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            {message.error}
          </div>
        </div>
      )}
      {"message" in message && (
        <div className="bg-gray-800 border-l-4 border-gray-600 rounded-md p-3 text-gray-300">
          <div className="flex">
            <svg
              className="h-5 w-5 text-gray-500 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {message.message}
          </div>
        </div>
      )}
    </div>
  );
}
