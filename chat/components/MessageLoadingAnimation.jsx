"use client";

import React from "react";

export default function MessageLoadingAnimation() {
  return (
    <>
      <style jsx>{`
        @keyframes bounceAnimation {
          0%,
          100% {
            transform: translateY(0);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-4px);
            opacity: 1;
          }
        }

        .loading-dot {
          animation: bounceAnimation 1.2s infinite ease-in-out;
          background-color: var(--accent);
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
          gap: 4px;
          padding: 6px 12px;
          border-radius: 16px;
          background: var(--card);
          border: 1px solid var(--border);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          margin-left: 8px;
          margin-bottom: 4px;
        }
      `}</style>
      <div className="dots-container">
        <span className="loading-dot dot-1 h-2 w-2 rounded-full"></span>
        <span className="loading-dot dot-2 h-2 w-2 rounded-full"></span>
        <span className="loading-dot dot-3 h-2 w-2 rounded-full"></span>
      </div>
    </>
  );
}
