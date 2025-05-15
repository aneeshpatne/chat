import type { Metadata } from "next";
import "./globals.css";
import "./responsive.css"; // Import responsive styles
import { Inter } from "next/font/google";
const inter = Inter({
  subsets: ["latin"], // or ['latin', 'cyrillic'] etc.
});

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
      <body className={`${inter.className}  antialiased`}>{children}</body>
    </html>
  );
}
