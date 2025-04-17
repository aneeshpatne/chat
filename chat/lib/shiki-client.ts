// lib/shiki-client.ts
"use client";

import { codeToHast } from "shiki";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { visit } from "unist-util-visit";
import { transformerNotationDiff } from "@shikijs/transformers";

export async function highlightCodeToJSX(code: string, lang: string) {
  const { codeToHast: shikiCodeToHast } = await import("shiki");

  const hast = await shikiCodeToHast(code, {
    lang,
    theme: "nord",
    transformers: [transformerNotationDiff()],
  });

  // Convert HAST to JSX for rendering in React
  return toJsxRuntime(hast, {
    Fragment: (await import("react")).Fragment,
    jsx: (await import("react/jsx-runtime")).jsx,
    jsxs: (await import("react/jsx-runtime")).jsxs,
  });
}
