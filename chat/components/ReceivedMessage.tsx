// components/ReceivedMessage.tsx
"use client";

import React, { useEffect, useState } from "react";
import MarkdownIt, { Options } from "markdown-it";
import Prism from "prismjs";

// ← Import the core + each language you want
import "../app/globals.css"; // ← Import your global CSS file here
import "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-markup"; // for HTML, XML, etc.
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-bash";

// ← Your DOMPurify import
import DOMPurify from "dompurify";

// ← Markdown‑it setup split into two steps to get full TS safety
const mdOptions: Options = {
  html: true,
  linkify: true,
  typographer: true,
};
const md = new MarkdownIt(mdOptions);
md.options.highlight = ((str: string, lang: string, attrs: string): string => {
  if (lang && Prism.languages[lang]) {
    try {
      const highlighted = Prism.highlight(str, Prism.languages[lang], lang);
      return `<pre class="language-${lang}"><code>${highlighted}</code></pre>`;
    } catch {
      // ignore
    }
  }
  return `<pre class="language-${lang}"><code>${md.utils.escapeHtml(
    str
  )}</code></pre>`;
}) as Options["highlight"];

export const ReceivedMessage = React.memo(function ReceivedMessage({
  message,
}: {
  message: string;
}) {
  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    const dirty = md.render(message || "");
    setHtml(DOMPurify.sanitize(dirty));
  }, [message]);

  useEffect(() => {
    Prism.highlightAll();
  }, [html]);

  return (
    <div className="flex justify-start">
      <div
        className="w-full prose"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
});
