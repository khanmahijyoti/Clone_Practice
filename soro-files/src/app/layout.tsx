import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Soro - SEO Autopilot & Content Writer",
  description:
    "Soro writes, optimizes, and posts SEO content proven to rank on Google and ChatGPT, all while you sleep.",
  icons: {
    icon: [
      { url: "/assets/trysoro/favicon.ico" },
      { url: "/assets/trysoro/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/assets/trysoro/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/assets/trysoro/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/assets/trysoro/apple-touch-icon.png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link
          rel="stylesheet"
          href="https://trysoro.com/_next/static/chunks/6e43146abaa714ab.css?dpl=dpl_CKzB18tnVhsxeZqmDp2AsN3jUWUP"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
