import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Vayro | Premium URL Shortener for Modern Brands",
  description:
    "The fastest URL shortener built on Redis. Create branded links, track 0.3ms redirects, and get granular analytics. Pricing starts at ₹299/mo.",
  metadataBase: new URL("https://vayro.in"),
  openGraph: {
    title: "Vayro | Premium URL Shortener for Modern Brands",
    description:
      "The fastest URL shortener built on Redis. Create branded links, track 0.3ms redirects, and get granular analytics. Pricing starts at ₹299/mo.",
    url: "https://vayro.in",
    siteName: "Vayro",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vayro | Premium URL Shortener for Modern Brands",
    description:
      "The fastest URL shortener built on Redis. Create branded links, track 0.3ms redirects, and get granular analytics. Pricing starts at ₹299/mo.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
