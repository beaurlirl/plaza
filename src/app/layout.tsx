import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "plaza - Digital Marketplace",
  description: "Premium digital marketplace for fashion and fine art. Discover, authenticate, and invest with intelligent curation.",
  keywords: ["marketplace", "AI", "fashion", "art", "luxury", "authentication", "investment"],
  authors: [{ name: "plaza Team" }],
  creator: "plaza",
  publisher: "plaza",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
