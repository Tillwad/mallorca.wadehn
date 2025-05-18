// src/app/layout.tsx
import { Toaster } from "sonner";
import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mallorca Planer",
  generator: "Next.js",
  applicationName: "Mallorca Planer",
  referrer: "origin-when-cross-origin",
  colorScheme: "light",
  creator: "Till Wadehn",
  publisher: "Till Wadehn",
  description: "Koordiniere Urlaube auf Mallorca mit Familie und Freunden.",
  authors: [
    { name: "Till Wadehn", url: "https://mallorca-wadehn.vercel.app/" },
  ],
  keywords: ["Mallorca", "Urlaub", "Familie", "Planer", "Kalender"],
  openGraph: {
    title: "Mallorca Planer",
    description:
      "Behalte den Überblick über eure gemeinsamen Mallorca-Aufenthalte.",
    url: "https://mallorca-wadehn.vercel.app/",
    siteName: "Mallorca Planer",
    type: "website",
    locale: "de_DE",
    images: [
      {
        url: "/malle_3",
        width: 1200,
        height: 630,
        alt: "Mallorca Aussicht",
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
