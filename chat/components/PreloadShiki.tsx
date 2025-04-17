"use client";

import { useEffect } from "react";
import { highlightCodeToJSX } from "@/lib/shiki-client";

export default function PreloadShiki() {
  useEffect(() => {
    // fire off the highlighter load as early as possible
    highlightCodeToJSX("", "javascript");
  }, []);

  return null;
}
