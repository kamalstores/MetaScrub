import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ToastProvider from "@/components/ToastProvider";

export const metadata: Metadata = {
  title: "MetaScrub",
  description:
    "Remove GPS coordinates, device info, and hidden metadata from your photos and videos — 100% in your browser. Zero uploads. Zero servers. Absolute privacy.",
  keywords: ["metadata remover", "EXIF remover", "privacy tool", "GPS remover", "photo metadata", "browser tool"],
  openGraph: {
    title: "MetaScrub — Strip Hidden Metadata Privately",
    description: "Remove hidden metadata from photos & videos right in your browser. No uploads. No servers.",
    type: "website",
  },
};

/* eslint-disable @next/next/no-page-custom-font */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="bg-grid" aria-hidden="true" />
        <div className="page-content">
          <Navbar />
          <main>{children}</main>
          <Footer />
        </div>
        <ToastProvider />
      </body>
    </html>
  );
}
