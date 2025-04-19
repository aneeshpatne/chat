import CodeBlock from "./CodeBlock";

export const mdComponents = {
  code: (props) => <CodeBlock {...props} />,
  p: ({ node, ...props }) => (
    <p className="my-4 text-stone-200" {...props} /> // increased margin
  ),
  h1: ({ node, ...props }) => (
    <h1 className="text-2xl font-bold my-4 text-white" {...props} /> // larger font and margin
  ),
  h2: ({ node, ...props }) => (
    <h2 className="text-xl font-bold my-3 text-white" {...props} /> // increased margin
  ),
  h3: ({ node, ...props }) => (
    <h3 className="text-lg font-bold my-3 text-white" {...props} /> // increased margin
  ),
  h4: ({ node, ...props }) => (
    <h4 className="text-base font-bold my-3 text-white" {...props} /> // increased margin
  ),
  ul: ({ node, ...props }) => (
    <ul className="list-disc pl-6 my-3 space-y-2" {...props} /> // more padding and spacing
  ),
  ol: ({ node, ...props }) => (
    <ol className="list-decimal pl-6 my-3 space-y-2" {...props} /> // more padding and spacing
  ),
  li: ({ node, ...props }) => (
    <li className="text-stone-200 mb-1" {...props} /> // margin bottom for spacing
  ),
  a: ({ node, ...props }) => (
    <a className="text-blue-400 hover:text-blue-300 underline" {...props} />
  ),
  blockquote: ({ node, ...props }) => (
    <blockquote
      className="border-l-4 border-stone-600 pl-4 italic my-3 text-stone-300" // increased padding and margin
      {...props}
    />
  ),
  hr: ({ node, ...props }) => (
    <hr className="border-stone-600 my-4" {...props} /> // more vertical space
  ),
  img: ({ node, ...props }) => (
    <img className="max-w-full rounded-lg my-4" {...props} /> // more margin
  ),
  strong: ({ node, ...props }) => (
    <strong className="font-bold text-stone-100" {...props} />
  ),
  em: ({ node, ...props }) => (
    <em className="italic text-stone-200" {...props} />
  ),
  table: ({ node, ...props }) => (
    <div className="overflow-x-auto my-4">
      <table className="border-collapse w-full" {...props} />
    </div>
  ),
  thead: ({ node, ...props }) => <thead className="bg-stone-700" {...props} />,
  tbody: ({ node, ...props }) => (
    <tbody className="divide-y divide-stone-700" {...props} />
  ),
  tr: ({ node, ...props }) => (
    <tr className="border-b border-stone-700" {...props} />
  ),
  th: ({ node, ...props }) => (
    <th className="py-3 px-4 text-left font-medium text-stone-200" {...props} /> // increased padding
  ),
  td: ({ node, ...props }) => (
    <td className="py-3 px-4" {...props} /> // increased padding
  ),
};
