// src/app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";
import { SessionProvider } from "@/lib/session-context";
import { auth } from "@/auth";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth(); // ⬅️ nächste-auth Server-Session

  return (
    <html lang="de">
      <body className={inter.className}>
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  );
}
