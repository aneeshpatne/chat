"use client";
import React, {
  useMemo,
  useDeferredValue,
  useEffect,
  useState,
  useRef,
} from "react";
import { parseMarkdownIntoBlocks } from "./CodeBlock";
import { AnimatePresence, motion } from "framer-motion";
import MemoizedMarkdownBlock from "./MemoizedMarkdownBlock";
import Marked from "react-markdown";
import { ArrowUp, ArrowDown, Copy, Check } from "lucide-react";
import { MessageLoadingIndicator } from "./chatnew";

export const ReceivedMessage = React.memo(function ReceivedMessage({
  message,
  token,
  reasoning,
  status,
  id,
  currentlyStreamingId,
  setSelectedText,
  selectedText,
  setaddMessage,
}) {
  const containerRef = useRef(null);

  const [showButton, setShowButton] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const [copySuccess, setCopySuccess] = useState(false);
  const [active, setActive] = useState(true);

  const deferredMessage = useDeferredValue(message);
  const blocks = useMemo(
    () => parseMarkdownIntoBlocks(deferredMessage),
    [deferredMessage]
  );

  useEffect(() => {
    if (status === "streaming" && currentlyStreamingId === id) {
      setActive(true);
    } else {
      setActive(false);
    }
  }, [status, currentlyStreamingId, id]);

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (selection.toString().trim().length === 0) {
        setShowButton(false);
      }
    };
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, [setaddMessage]);

  const handleMouseUp = () => {
    const selection = window.getSelection();
    const text = selection.toString().trim();

    if (text.length > 0 && containerRef.current) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();

      setButtonPosition({
        x: rect.right - containerRect.left,
        y: rect.top - containerRect.top,
      });
      setSelectedText(text);
      setShowButton(true);
    } else {
      setShowButton(false);
      setSelectedText("");
    }
  };

  const handleAddClick = () => {
    setaddMessage(selectedText);
    setShowButton(false);
    setSelectedText("");
  };

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy message: ", err);
    }
  };

  if (!message && !reasoning) {
    return <MessageLoadingIndicator />;
  }

  return (
    <div
      className="justify-start w-full space-y-2 relative"
      onMouseUp={handleMouseUp}
      ref={containerRef}
    >
      {showButton && (
        <button
          onClick={handleAddClick}
          style={{
            position: "absolute",
            top: buttonPosition.y - 40,
            left: buttonPosition.x,
            zIndex: 10,
          }}
          // Using outline variant styles from button.tsx (approximated)
          className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-sm font-medium transition-colors border border-border bg-card shadow-xs hover:bg-card/90 hover:border-ring h-8 px-2.5"
        >
          <span>Ask Follow Up</span>
          <ArrowDown size={14} />
        </button>
      )}

      {reasoning && (
        <div className="flex flex-col justify-start w-full p-3 mb-3 text-sm text-muted-foreground border border-border bg-card/50 rounded-md shadow-md overflow-hidden transition-all duration-200">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="font-semibold text-foreground flex items-center">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
              Reasoning
            </span>
            <button
              onClick={() => setActive((prev) => !prev)}
              className="p-1.5 hover:bg-muted rounded-md transition-colors duration-150"
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
                    <ArrowUp size={16} className="text-accent" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="down"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <ArrowDown size={16} className="text-accent" />
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
                <div className="pt-2 border-t border-border">
                  <Marked
                    components={{
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
        <AnimatePresence
          mode="popLayout"
          initial={true}
          key={`container-${idx}`}
        >
          <motion.div
            key={`block-${idx}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.4,
              delay: idx * 0.04,
              ease: "easeIn",
            }}
          >
            <MemoizedMarkdownBlock content={block} key={idx} />
          </motion.div>
        </AnimatePresence>
      ))}

      <div className="flex items-center justify-between">
        <button
          onClick={handleCopyClick}
          className="text-muted-foreground hover:text-foreground"
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

        <small className="text-xs text-muted-foreground italic flex space-x-8">
          {token && (
            <>
              <span>
                <span className="font-semibold text-accent/90">
                  Input Tokens:
                </span>{" "}
                {token.promptTokens}
              </span>
              <span>
                <span className="font-semibold text-accent/90">
                  Output Tokens:
                </span>{" "}
                {token.completionTokens}
              </span>
              <span>
                <span className="font-semibold text-accent/90">
                  Total Tokens:
                </span>{" "}
                {token.totalTokens}
              </span>
            </>
          )}
        </small>
      </div>
    </div>
  );
});
