import { marked } from "marked";

// Using default export for React component files
function parseMarkdownIntoBlocksFunc(markdown) {
  const tokens = marked.lexer(markdown);
  // each token.raw is one "block" (heading, paragraph, list, code, etc)
  return tokens.map((t) => t.raw);
}

export default parseMarkdownIntoBlocksFunc;
