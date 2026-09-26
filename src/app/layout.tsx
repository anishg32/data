import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DATATO — Search the World. See the Data.",
  description:
    "Discover how apps, products, entertainment and technology are used around the world. Global data intelligence and discovery platform.",
  keywords: [
    "data intelligence",
    "global analytics",
    "app analytics",
    "market data",
    "technology data",
  ],
  openGraph: {
    title: "DATATO — Global Data Intelligence",
    description:
      "Discover how apps, products, entertainment and technology are used around the world.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#050510] text-[#e8eaf6]">
        <div className="page-gradient" />
        {children}
      </body>
    </html>
  );
}
