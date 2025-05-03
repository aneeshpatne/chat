import React from "react";
import ReactMarkdown from "react-markdown";
import { mdComponents } from "./mdcomponents.jsx";
import remarkGfm from "remark-gfm";
const MemoizedMarkdownBlock = React.memo(
  function MemoizedMarkdownBlock({ content }) {
    return (
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
        {content}
      </ReactMarkdown>
    );
  },
  (prev, next) => prev.content === next.content
);

export default MemoizedMarkdownBlock;
