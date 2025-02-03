import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import "@coinbase/onchainkit/styles.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vault AI - Intelligent DeFi Management",
  description:
    "Your AI-powered DeFi companion for smart portfolio management, trading, and optimization",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black`}>
        <Providers>{children}</Providers>{" "}
      </body>
    </html>
  );
}
