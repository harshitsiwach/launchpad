import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@/lib/polyfill"; // Import SSR polyfills
import { Providers } from "@/components/providers/Providers";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Launchpad | Web3 Fundraising",
  description: "Multi-chain token launchpad for EVM and Solana.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn(inter.className, "antialiased bg-background text-foreground min-h-screen")}>
        <Providers>{children}</Providers>
        <Toaster theme="dark" position="bottom-right" />
      </body>
    </html>
  );
}
