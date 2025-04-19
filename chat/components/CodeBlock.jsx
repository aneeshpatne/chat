import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { marked } from "marked";
import { Copy } from "lucide-react";
export function parseMarkdownIntoBlocks(markdown) {
  const tokens = marked.lexer(markdown);
  // each token.raw is one “block” (heading, paragraph, list, code, etc)
  return tokens.map((t) => t.raw);
}

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

  const codeBg = "#09090b";

  return match ? (
    <div className="rounded-md my-4 overflow-hidden">
      <div className="flex items-center justify-between bg-stone-800 px-4 py-1.5 text-xs text-gray-400">
        <span className="lowercase">{language}</span>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1 hover:text-gray-200 transition-colors"
        >
          <Copy size={14} className="inline-block" />
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
