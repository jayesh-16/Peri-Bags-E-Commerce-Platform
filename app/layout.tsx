import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

const getBaseUrl = () => {
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT || 3000}`;
};

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: "Peri Bags | Premium Bags & Backpacks",
  description: "Discover our premium collection of bags, backpacks, and travel frame. Crafted with quality and elegance.",
  openGraph: {
    title: "Peri Bags | Premium Bags & Backpacks",
    description: "Discover our premium collection of bags, backpacks, and travel frame. Crafted with quality and elegance.",
    url: getBaseUrl(),
    siteName: 'Peri Bags',
    locale: 'en_IN',
    type: 'website',
  },
};

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
