// lib/shiki-client.ts
import { createHighlighter } from "shiki"; // shorthand loader
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { transformerNotationDiff } from "@shikijs/transformers";

// 1️⃣ Preload once at module import:
export const highlighterPromise = createHighlighter({
  themes: ["nord"], // plural “themes” :contentReference[oaicite:4]{index=4}
  langs: ["javascript", "typescript", "jsx", "tsx", "css"],
});

/**
 * Highlight code → HAST → JSX-runtime
 */
export async function highlightCodeToJSX(code: string, lang: string) {
  const highlighter = await highlighterPromise;

  // 2️⃣ Pass `themes` array, not `theme`
  const hast = highlighter.codeToHast(code, {
    lang,
    themes: {
      // ← mapping object satisfies the Record<string,…> type
      default: "nord",
    },
    transformers: [transformerNotationDiff()],
  });

  // 3️⃣ Convert HAST → JSX with proper runtime imports
  return toJsxRuntime(hast, {
    Fragment: (await import("react")).Fragment,
    jsx: (await import("react/jsx-runtime")).jsx,
    jsxs: (await import("react/jsx-runtime")).jsxs,
  });
}
