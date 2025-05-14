import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { marked } from "marked";
import { Copy } from "lucide-react";

// Enable table support in marked
marked.use({
  gfm: true,
  tables: true,
});

// Import the function from its dedicated file instead of duplicating
import parseMarkdownIntoBlocksFunc from "./parseMarkdownIntoBlocks";

// Re-export for backward compatibility
const parseMarkdownIntoBlocks = parseMarkdownIntoBlocksFunc;

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

  const codeBg = "var(--card)"; // Use CSS variable for background

  return match ? (
    <div className="rounded-md overflow-hidden border border-border">
      <div className="flex items-center justify-between bg-secondary px-4 py-1.5 text-xs text-secondary-foreground">
        {" "}
        <span className="lowercase">{language}</span>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1 hover:text-foreground transition-colors"
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
      className={`${className} bg-muted text-muted-foreground rounded px-1 py-0.5 text-sm`}
    >
      {children}
    </code>
  );
});

export default CodeBlock;
