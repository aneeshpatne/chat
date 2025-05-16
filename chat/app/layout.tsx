import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./responsive.css"; // Import responsive styles
import { Inter } from "next/font/google";
import { preventOverscrollBounce } from "./no-bounce";
const inter = Inter({
  subsets: ["latin"], // or ['latin', 'cyrillic'] etc.
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0C0D10",
};

export const metadata: Metadata = {
  title: "Chat",
  description: "Fast and simple chat app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* <script
          crossOrigin="anonymous"
          src="//unpkg.com/react-scan/dist/auto.global.js"
        /> */}
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('touchmove', function(e) {
                if (e.touches.length > 1) {
                  e.preventDefault();
                }
              }, { passive: false });
              
              document.addEventListener('gesturestart', function(e) {
                e.preventDefault();
              });
            `
          }}
        />
      </body>
    </html>
  );
}
