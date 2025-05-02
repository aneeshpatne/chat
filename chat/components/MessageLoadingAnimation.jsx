"use client";

import React from "react";

export default function MessageLoadingAnimation() {
  return (
    <>
      <style jsx>{`
        @keyframes pulse {
          0%,
          80%,
          100% {
            transform: scale(0);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .dot-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 24px;
          width: 100%;
          border-radius: 4px;
          background: rgba(100, 100, 100, 0.2);
        }
        .loading-bar::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 60%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(150, 150, 150, 0.5),
            transparent
          );
          animation: wave 1.5s infinite ease-in-out;
        }
      `}</style>
      <div className="dot-container">
        <div className="dot dot1"></div>
        <div className="dot dot2"></div>
        <div className="dot dot3"></div>
      </div>
    </>
  );
}
