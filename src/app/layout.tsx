// src/app/layout.tsx
import { Toaster } from "sonner";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

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
