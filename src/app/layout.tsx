import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "F4 Industries, Inc.",
  description: "F4 - The GD&T Analysis Platform for engineering drawings.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
