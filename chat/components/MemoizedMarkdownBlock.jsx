import React from "react";
import ReactMarkdown from "react-markdown";
import mdComponents from "./ReceivedMessage";

const MemoizedMarkdownBlock = React.memo(
  function MemoizedMarkdownBlock({ content }) {
    return <ReactMarkdown components={mdComponents}>{content}</ReactMarkdown>;
  },
  // only rerender if content actually changes
  (prev, next) => prev.content === next.content
);

export default MemoizedMarkdownBlock;
