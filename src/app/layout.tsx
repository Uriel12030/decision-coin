import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Decision Coin",
  description: "Let the coin decide for you",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
