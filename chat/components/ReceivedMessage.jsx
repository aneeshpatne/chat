import React, { Suspense } from "react";
import { useMemo, useDeferredValue, useEffect, useState } from "react";
import { parseMarkdownIntoBlocks } from "./CodeBlock";
import MemoizedMarkdownBlock from "./MemoizedMarkdownBlock";

export const ReceivedMessage = React.memo(function ReceivedMessage({
  message,
}) {
  // let React defer large markdown updates
  const deferredMessage = useDeferredValue(message);

  // option A: sync split (fast enough in many cases)
  const blocks = useMemo(
    () => parseMarkdownIntoBlocks(deferredMessage),
    [deferredMessage]
  );

  // option B: offload splitting to idle time to avoid any jank
  // const [blocks, setBlocks] = useState([]);
  // useEffect(() => {
  //   if ('requestIdleCallback' in window) {
  //     requestIdleCallback(() => {
  //       setBlocks(parseMarkdownIntoBlocks(deferredMessage));
  //     });
  //   } else {
  //     setBlocks(parseMarkdownIntoBlocks(deferredMessage));
  //   }
  // }, [deferredMessage]);

  return (
    <div className="justify-start w-full space-y-2">
      {blocks.map((block, idx) => (
        <MemoizedMarkdownBlock content={block} key={idx} />
      ))}
    </div>
  );
});

export default ReceivedMessage;
