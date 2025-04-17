// lib/shiki-loader.ts
import { getHighlighter } from "shiki";

let highlighter: Awaited<ReturnType<typeof getHighlighter>> | null = null;

export async function getSharedHighlighter() {
  if (!highlighter) {
    highlighter = await getHighlighter({ theme: "nord" });
  }
  return highlighter;
}
