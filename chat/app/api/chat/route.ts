// /app/api/chat/route.ts
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { marked } from "marked"; // Import marked
import Prism from "prismjs";
// Explicitly import required language components for PrismJS
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-python";

export const runtime = "edge";
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openai("gpt-4.1-nano"),
    messages,
  });

  // Access the stream using toDataStream()
  const stream = result.toDataStream();

  // Pipe the stream through transformations: Decode, Parse Markdown & Highlight, Encode
  const htmlStream = stream
    .pipeThrough(new TextDecoderStream()) // Uint8 → string
    .pipeThrough(
      new TransformStream<string, string>({
        async transform(chunk, controller) {
          // Parse markdown chunk to HTML using marked
          // Use marked.parse instead of marked() for async behavior if needed, but marked() is typically sync
          const html = await marked.parse(chunk); // Use marked for parsing

          // Highlight code blocks using PrismJS
          // Note: marked might produce slightly different HTML structure for code blocks.
          // Adjust the regex if needed based on marked's output.
          // A common output is <pre><code class="language-js">...</code></pre>
          const highlighted = html.replace(
            /<pre><code class="(language-\w+)">([\s\S]*?)<\/code><\/pre>/g,
            (_, langClass, code) => {
              const lang = langClass.replace("language-", "");
              const grammar = Prism.languages[lang] || Prism.languages.plain;
              // Decode HTML entities potentially introduced by marked before highlighting
              const decodedCode = code
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
                .replace(/&amp;/g, "&");
              const inner = Prism.highlight(decodedCode, grammar, lang);
              return `<pre class="language-${lang}"><code>${inner}</code></pre>`;
            }
          );

          controller.enqueue(highlighted);
        },
      })
    )
    .pipeThrough(new TextEncoderStream()); // string → Uint8

  return new Response(htmlStream, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
