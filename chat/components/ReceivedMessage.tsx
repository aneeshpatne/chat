"use client";

import React, { useEffect, useState } from "react";
import MarkdownIt from "markdown-it";

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

export const ReceivedMessage = React.memo(function ReceivedMessage({
  message,
}: {
  message: string;
}) {
  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    // Only runs in the browser, avoids SSR “window is undefined”
    import("dompurify").then(({ default: DOMPurify }) => {
      const dirty = md.render(message || "");
      setHtml(DOMPurify.sanitize(dirty));
    });
  }, [message]);

  return (
    <div className="flex justify-start">
      <div
        className="w-full prose" // you can add Tailwind Typography if you like
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
});
