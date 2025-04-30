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

  const codeBg = "var(--card)"; // Use CSS variable for background

  return match ? (
    <div className="rounded-md overflow-hidden border border-border"> {/* Removed my-4 */}
      <div className="flex items-center justify-between bg-secondary px-4 py-1.5 text-xs text-secondary-foreground"> {/* Use theme colors */}
        <span className="lowercase">{language}</span>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1 hover:text-foreground transition-colors" // Use theme colors
        >
          <Copy size={14} className="inline-block" />
          {isCopied ? "Copied!" : "Copy code"}
        </button>
      </div>
      <SyntaxHighlighter
        {...props}
        PreTag="div"
        language={language}
        style={vscDarkPlus} // Keep syntax highlighting style, but override background
        customStyle={{
          backgroundColor: codeBg,
          padding: "1rem",
          margin: 0,
          overflowX: "auto",
          fontSize: "0.875rem",
          // Ensure text color contrasts with the new background if needed
          // color: 'var(--card-foreground)' // Optional: uncomment if text becomes hard to read
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
      // Use muted background/text for inline code
      className={`${className} bg-muted text-muted-foreground rounded px-1 py-0.5 text-sm`}
    >
      {children}
    </code>
  );
});

export default CodeBlock;
