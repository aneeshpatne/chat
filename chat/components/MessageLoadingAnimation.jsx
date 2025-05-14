"use client";

import React from "react";

export default function MessageLoadingAnimation() {
  return (
    <>
      <style jsx>{`
        @keyframes fadeInOut {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
        }
        .loading-dot {
          animation: fadeInOut 0.8s infinite;
        }
        .dot-1 {
          animation-delay: 0s;
        }
        .dot-2 {
          animation-delay: 0.2s;
        }
        .dot-3 {
          animation-delay: 0.4s;
        }
        .dots-container {
          display: inline-flex;
          justify-content: center;
          align-items: center;
          gap: 3px;
          padding: 4px 8px;
          border-radius: 12px;
          background: rgba(100, 100, 100, 0.1);
        }
      `}</style>
      <div className="dots-container">
        <span className="loading-dot dot-1 h-1.5 w-1.5 rounded-full bg-muted-foreground"></span>
        <span className="loading-dot dot-2 h-1.5 w-1.5 rounded-full bg-muted-foreground"></span>
        <span className="loading-dot dot-3 h-1.5 w-1.5 rounded-full bg-muted-foreground"></span>
      </div>
    </>
  );
}
