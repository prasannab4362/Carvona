import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Carvona - AI Automotive Image Editing & License Plate Blur",
  description: "Automatically blur or replace license plates in seconds using advanced AI. Choose between free unlimited blurring or perspective-correct logo replacement for professional dealership vehicle images.",
  keywords: ["license plate blur", "license plate replacement", "car image editing", "dealership vehicle photos", "AI image blurring", "automotive photography"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased font-sans`}
    >
      <body className="min-h-full flex flex-col bg-white text-text-main selection:bg-primary selection:text-white">
        {children}
      </body>
    </html>
  );
}

