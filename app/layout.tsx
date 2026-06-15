import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Peri Bags | Premium Bags & Backpacks",
  description: "Discover our premium collection of bags, backpacks, and travel gear. Crafted with quality and elegance.",
};

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans antialiased", inter.variable, playfair.variable)}>
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
