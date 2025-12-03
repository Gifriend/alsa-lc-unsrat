import type React from "react";
import type { Metadata } from "next";
import { Crimson_Text, Lato } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const crimsonText = Crimson_Text({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-serif",
});

const lato = Lato({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "ALSA LC UNSRAT - Asian Law Students Association",
  description:
    "ALSA LC UNSRAT official website. Connect and develop as future leaders in law.",
  icons: {
    icon: [
      {
        url: "/ALSA-logo-merah.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/ALSA-logo-putih.png",
        media: "(prefers-color-scheme: dark)",
      },
    ],

    apple: [
      {
        url: "/ALSA-logo-merah.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/ALSA-logo-putih.png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
};

export const viewport = {
  themeColor: "#1e3a5f",
  width: "device-width",
  initialScale: 1,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${crimsonText.variable} ${lato.variable} font-sans antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
