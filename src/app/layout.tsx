import type React from "react"
import type { Metadata } from "next"
import { Crimson_Text, Lato } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const crimsonText = Crimson_Text({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-serif",
})

const lato = Lato({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "ALSA LC Unsrat - Asian Law Students Association",
  description: "ALSA LC Unsrat official website. Connect and develop as future leaders in law.",
  // icons: {
  //   icon: [
  //     {
  //       url: "/icon-light-32x32.png",
  //       media: "(prefers-color-scheme: light)",
  //     },
  //     {
  //       url: "/icon-dark-32x32.png",
  //       media: "(prefers-color-scheme: dark)",
  //     },
  //     {
  //       url: "/icon.svg",
  //       type: "image/svg+xml",
  //     },
  //   ],
  //   apple: "/apple-icon.png",
  // },
}

export const viewport = {
  themeColor: "#1e3a5f",
  width: "device-width",
  initialScale: 1,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${crimsonText.variable} ${lato.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
