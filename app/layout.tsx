import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "It's Raining Caches 2026 | IRC26",
  description: "Join the geocaching initiative for 2026. Pledge and confirm your caches for IRC26.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-arial-rounded">
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow pt-16">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}





