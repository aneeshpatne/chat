import CodeBlock from "./CodeBlock";

export const mdComponents = {
  code: (props) => <CodeBlock {...props} />,
  p: ({ node, ...props }) => (
    <p
      className="my-4 text-foreground/90 break-words"
      style={{
        overflowWrap: "break-word",
        wordWrap: "break-word",
        hyphens: "auto",
      }}
      {...props}
    />
  ),
  h1: ({ node, ...props }) => (
    <h1 className="text-2xl font-bold my-4 text-foreground" {...props} />
  ),
  h2: ({ node, ...props }) => (
    <h2 className="text-xl font-bold my-3 text-foreground" {...props} />
  ),
  h3: ({ node, ...props }) => (
    <h3 className="text-lg font-bold my-3 text-foreground" {...props} />
  ),
  h4: ({ node, ...props }) => (
    <h4 className="text-base font-bold my-3 text-foreground" {...props} />
  ),
  ul: ({ node, ...props }) => (
    <ul className="list-disc pl-6 my-3 space-y-2" {...props} />
  ),
  ol: ({ node, ...props }) => (
    <ol className="list-decimal pl-6 my-3 space-y-2" {...props} />
  ),
  li: ({ node, ...props }) => (
    <li className="text-foreground/90 mb-1" {...props} />
  ),
  a: ({ node, ...props }) => (
    <a
      className="text-accent hover:text-accent/80 underline break-words"
      style={{
        overflowWrap: "break-word",
        wordBreak: "break-all",
        maxWidth: "100%",
        display: "inline-block",
      }}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  blockquote: ({ node, ...props }) => (
    <blockquote
      className="border-l-4 border-border pl-4 italic my-3 text-foreground/80"
      {...props}
    />
  ),
  hr: ({ node, ...props }) => <hr className="border-border my-4" {...props} />,
  img: ({ node, ...props }) => (
    <img
      className="max-w-full w-auto rounded-lg my-4"
      style={{ height: "auto" }}
      {...props}
    />
  ),
  strong: ({ node, ...props }) => (
    <strong className="font-bold text-foreground" {...props} />
  ),
  em: ({ node, ...props }) => (
    <em className="italic text-foreground/90" {...props} />
  ),
  table: ({ node, ...props }) => (
    <div className="overflow-x-auto my-4 max-w-full">
      <table
        className="border-collapse w-full border border-border rounded-md"
        style={{ minWidth: "100%", tableLayout: "auto" }}
        {...props}
      />
    </div>
  ),
  thead: ({ node, ...props }) => (
    <thead className="bg-secondary/50" {...props} />
  ),
  tbody: ({ node, ...props }) => (
    <tbody className="divide-y divide-border" {...props} />
  ),
  tr: ({ node, ...props }) => (
    <tr
      className="border-b border-border hover:bg-muted/50 transition-colors"
      {...props}
    />
  ),
  th: ({ node, ...props }) => (
    <th
      className="py-3 px-4 text-left font-medium text-foreground border-r last:border-r-0 border-border"
      {...props}
    />
  ),
  td: ({ node, ...props }) => (
    <td
      className="py-3 px-4 text-foreground/90 border-r last:border-r-0 border-border"
      {...props}
    />
  ),
};
