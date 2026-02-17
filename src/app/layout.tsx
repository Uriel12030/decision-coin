import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mandelbrot Set Viewer",
  description: "Interactive Mandelbrot set fractal explorer",
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
