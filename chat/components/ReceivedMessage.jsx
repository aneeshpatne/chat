import React, { Suspense, useRef } from "react";
import { useMemo, useDeferredValue, useEffect, useState } from "react";
import { parseMarkdownIntoBlocks } from "./CodeBlock";
import { AnimatePresence, motion } from "framer-motion";
import MemoizedMarkdownBlock from "./MemoizedMarkdownBlock";
import { MessageLoadingIndicator } from "./chatnew";
import { ArrowUp, ArrowDown } from "lucide-react";
import Marked from "react-markdown";
import { Copy, Check } from "lucide-react";
import { ClipLoader } from "react-spinners";
export const ReceivedMessage = React.memo(function ReceivedMessage({
  message,
  token,
  reasoning,
  status,
  id,
  currentlyStreamingId,
}) {
  // let React defer large markdown updates
  const [curID, setID] = useState(id);
  const deferredMessage = useDeferredValue(message);
  const [copySuccess, setCopySuccess] = useState(false);
  const [active, setActive] = useState(true);
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
  useEffect(() => {
    if (status === "streaming" && currentlyStreamingId === id) {
      setActive(true);
    } else {
      setActive(false);
    }
  }, [status, currentlyStreamingId, id]);
  if (!message && !reasoning) {
    return <MessageLoadingIndicator />;
  }
  return (
    <div className="justify-start w-full space-y-2">
      {reasoning && (
        <div className="flex flex-col justify-start w-full p-3 mb-3 text-sm text-stone-200 border border-stone-600 bg-stone-800/50 rounded-md shadow-md overflow-hidden transition-all duration-200">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="font-semibold text-stone-100 flex items-center">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></div>
              Reasoning
            </span>
            <button
              onClick={() => setActive((prev) => !prev)}
              className="p-1.5 hover:bg-stone-700 rounded-md transition-colors duration-150"
              aria-label={active ? "Collapse reasoning" : "Expand reasoning"}
            >
              <AnimatePresence mode="wait" initial={false}>
                {active ? (
                  <motion.div
                    key="up"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <ArrowUp size={16} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="down"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <ArrowDown size={16} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>

          <AnimatePresence>
            {active && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pt-2 border-t border-stone-700">
                  <Marked
                    components={{
                      // Wrapper div with the desired classes
                      root: ({ children }) => (
                        <div className="prose prose-invert prose-sm max-w-none">
                          {children}
                        </div>
                      ),
                    }}
                  >
                    {reasoning}
                  </Marked>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
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
