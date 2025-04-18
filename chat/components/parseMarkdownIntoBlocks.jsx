import { marked } from "marked";

export function parseMarkdownIntoBlocks(markdown) {
  const tokens = marked.lexer(markdown);
  // each token.raw is one “block” (heading, paragraph, list, code, etc)
  return tokens.map((t) => t.raw);
}
