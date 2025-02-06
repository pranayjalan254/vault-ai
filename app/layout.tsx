import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import "@coinbase/onchainkit/styles.css";
import '../styles/animations.css';
import '../styles/theme.css';

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
      <body className="gradient-bg min-h-screen text-gray-200">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
