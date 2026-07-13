import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
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
  title: "Carvona - AI License Plate Blur & Dealership Logo Replacement",
  description: "Automatically blur or replace license plates in seconds using advanced AI. Censor vehicle plates for privacy or replace them with custom dealer logos. Free online tool, zero login required.",
  keywords: [
    "license plate blur online",
    "censor license plate",
    "car photo editor",
    "dealership branding software",
    "car plate masking",
    "indian license plate blur",
    "vehicle privacy mask",
    "AI plate editor",
    "hide license plate online"
  ],
  metadataBase: new URL("https://www.carvona.in"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Carvona - AI License Plate Blur & Dealership Logo Replacement",
    description: "Automatically blur or replace license plates in seconds using advanced AI. Censor vehicle plates for privacy or replace them with custom dealer logos.",
    url: "https://www.carvona.in",
    siteName: "Carvona",
    images: [
      {
        url: "/sample-suv.png",
        width: 1200,
        height: 675,
        alt: "Carvona AI License Plate Editor",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Carvona - AI License Plate Blur & Dealership Logo Replacement",
    description: "Automatically blur or replace license plates in seconds using advanced AI. Censor vehicle plates for privacy or replace them with custom dealer logos.",
    images: ["/sample-suv.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/icon.jpg",
  },
  verification: {
    google: "XA2zT7cfHiEvQZkyaIOVoEQJaURy5YAtBneFEhSvGGc",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Structured Schema Markup for Software / Web Application (helps Gemini/ChatGPT/Perplexity summarize this site)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Carvona",
    "url": "https://www.carvona.in",
    "logo": "https://www.carvona.in/logo.jpg",
    "description": "Automatically blur or replace license plates in seconds using advanced AI. Instantly mask vehicle plates for privacy or brand them with custom dealership logos.",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires HTML5",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "INR"
    },
    "featureList": "AI License Plate Detection, High Quality Blur, Custom Logo Warping, Perspective Alignment Offset Controls",
    "screenshot": "https://www.carvona.in/sample-suv.png"
  };

  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased font-sans`}
    >
      <body className="min-h-full flex flex-col bg-white text-text-main selection:bg-primary selection:text-white">
        {/* Google AdSense Script Integration */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4773483299842438"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        {/* JSON-LD Schema Script */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {children}
      </body>
    </html>
  );
}

