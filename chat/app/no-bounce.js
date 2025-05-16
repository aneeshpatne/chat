"use client";

// This script prevents iOS overscroll/bounce effect
// It should be imported in layout.tsx

export function preventOverscrollBounce() {
  if (typeof window !== 'undefined') {
    document.addEventListener('touchmove', function(e) {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    }, { passive: false });
    
    document.addEventListener('gesturestart', function(e) {
      e.preventDefault();
    });
  }
}
