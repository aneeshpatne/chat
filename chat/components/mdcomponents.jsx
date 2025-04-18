import CodeBlock from "./CodeBlock";
export const mdComponents = {
  code: (props) => <CodeBlock {...props} />,
  p: ({ node, ...props }) => <p className="my-1.5 text-stone-200" {...props} />,
  h1: ({ node, ...props }) => (
    <h1 className="text-xl font-bold my-3 text-white" {...props} />
  ),
  h2: ({ node, ...props }) => (
    <h2 className="text-lg font-bold my-2.5 text-white" {...props} />
  ),
  h3: ({ node, ...props }) => (
    <h3 className="text-base font-bold my-2 text-white" {...props} />
  ),
  h4: ({ node, ...props }) => (
    <h4 className="text-sm font-bold my-2 text-white" {...props} />
  ),
  ul: ({ node, ...props }) => (
    <ul className="list-disc pl-5 my-2 space-y-1" {...props} />
  ),
  ol: ({ node, ...props }) => (
    <ol className="list-decimal pl-5 my-2 space-y-1" {...props} />
  ),
  li: ({ node, ...props }) => <li className="text-stone-200" {...props} />,
  a: ({ node, ...props }) => (
    <a className="text-blue-400 hover:text-blue-300 underline" {...props} />
  ),
  blockquote: ({ node, ...props }) => (
    <blockquote
      className="border-l-4 border-stone-600 pl-3 italic my-2 text-stone-300"
      {...props}
    />
  ),
  hr: ({ node, ...props }) => (
    <hr className="border-stone-600 my-3" {...props} />
  ),
  img: ({ node, ...props }) => (
    <img className="max-w-full rounded-lg my-2" {...props} />
  ),
  strong: ({ node, ...props }) => (
    <strong className="font-bold text-stone-100" {...props} />
  ),
  em: ({ node, ...props }) => (
    <em className="italic text-stone-200" {...props} />
  ),
  table: ({ node, ...props }) => (
    <div className="overflow-x-auto my-3">
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
    <th className="py-2 px-3 text-left font-medium text-stone-200" {...props} />
  ),
  td: ({ node, ...props }) => <td className="py-2 px-3" {...props} />,
};
