import React, { Suspense, useRef } from "react";
import { useMemo, useDeferredValue, useEffect, useState } from "react";
import { parseMarkdownIntoBlocks } from "./CodeBlock";
import { AnimatePresence, motion } from "framer-motion";
import MemoizedMarkdownBlock from "./MemoizedMarkdownBlock";
import { Copy, Check } from "lucide-react";
export const ReceivedMessage = React.memo(function ReceivedMessage({
  message,
  token,
  status,
}) {
  // let React defer large markdown updates
  const deferredMessage = useDeferredValue(message);
  const [copySuccess, setCopySuccess] = useState(false);

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
  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(message); // Copy the message!
      setCopySuccess(true);
      setTimeout(() => {
        setCopySuccess(false); // Reset confirmation after a delay
      }, 2000); // Show success for 2 seconds
    } catch (err) {
      console.error("Failed to copy message: ", err);
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <div className="justify-start w-full space-y-2">
      {blocks.map((block, idx) => (
        <MemoizedMarkdownBlock content={block} key={idx} />
      ))}
      <div className="flex items-center justify-between">
        <button
          onClick={handleCopyClick}
          className="text-white"
          aria-label="Copy Message"
        >
          <AnimatePresence mode="wait" initial={false}>
            {copySuccess ? (
              <motion.div
                key="check"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <Check size={17} />
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <Copy size={17} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
        <small className="text-xs text-gray-500 italic flex space-x-8">
          {token && (
            <>
              <span>
                <span className="font-semibold">Input Tokens:</span>{" "}
                {token.promptTokens}
              </span>
              <span>
                <span className="font-semibold">Output Tokens:</span>{" "}
                {token.completionTokens}
              </span>
              <span>
                <span className="font-semibold">Total Tokens:</span>{" "}
                {token.totalTokens}
              </span>
            </>
          )}
        </small>
      </div>
      <div ref={bottomRef} />
    </div>
  );
});

export default ReceivedMessage;
