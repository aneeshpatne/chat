import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeBlock = React.memo(function CodeBlock({
  children,
  className,
  ...props
}) {
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "text";

  const [isCopied, setIsCopied] = React.useState(false);

  const copyToClipboard = () => {
    if (typeof children === "string") {
      navigator.clipboard.writeText(children).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 1500);
      });
    }
  };

  const codeBg = "#1c1917";

  return match ? (
    <div className="rounded-md my-4 overflow-hidden">
      <div className="flex items-center justify-between bg-stone-800 px-4 py-1.5 text-xs text-gray-400">
        <span className="lowercase">{language}</span>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1 hover:text-gray-200 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="inline-block"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
            />
          </svg>
          {isCopied ? "Copied!" : "Copy code"}
        </button>
      </div>
      <SyntaxHighlighter
        {...props}
        PreTag="div"
        language={language}
        style={vscDarkPlus}
        customStyle={{
          backgroundColor: codeBg,
          padding: "1rem",
          margin: 0,
          overflowX: "auto",
          fontSize: "0.875rem",
        }}
        codeTagProps={{
          style: {
            fontFamily: '"Fira Code", monospace',
          },
        }}
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    </div>
  ) : (
    <code
      {...props}
      className={`${className} bg-gray-200 text-gray-800 dark:bg-stone-700 dark:text-stone-300 rounded px-1 py-0.5 text-sm`}
    >
      {children}
    </code>
  );
});

export default CodeBlock;
