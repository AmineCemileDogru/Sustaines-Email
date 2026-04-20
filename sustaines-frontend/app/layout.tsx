import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SustainES - Sürdürülebilir E-Ticaret",
  description: "SustainES - Sürdürülebilir Ürünler E-Ticaret Platformu",
  keywords: "e-ticaret, sürdürülebilir, ürünler, sipariş",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      dir="ltr"
    >
      <body className="min-h-full flex flex-col text-center">{children}</body>
    </html>
  );
}
