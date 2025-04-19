import React, { Suspense, useRef } from "react";
import { useMemo, useDeferredValue, useEffect, useState } from "react";
import { parseMarkdownIntoBlocks } from "./CodeBlock";
import MemoizedMarkdownBlock from "./MemoizedMarkdownBlock";

export const ReceivedMessage = React.memo(function ReceivedMessage({
  message,
}) {
  // let React defer large markdown updates
  const deferredMessage = useDeferredValue(message);

  const blocks = useMemo(
    () => parseMarkdownIntoBlocks(deferredMessage),
    [deferredMessage]
  );
  const bottomRef = useRef(null);
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [blocks]);

  return (
    <div className="justify-start w-full space-y-2">
      {blocks.map((block, idx) => (
        <MemoizedMarkdownBlock content={block} key={idx} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
});

export default ReceivedMessage;
