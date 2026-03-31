import type React from "react"
import type { Metadata, Viewport } from "next"
import { Space_Grotesk, Space_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { LenisProvider } from "@/components/lenis-provider"
import { Providers } from "@/components/providers"
import "./globals.css"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
})

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "700"],
})

export const metadata: Metadata = {
  title: "SHADEFI | Confidential AMM on fhEVM",
  description: "The first confidential AMM on Ethereum using Zama's fhEVM. Pool reserves are encrypted. MEV is structurally impossible.",
  keywords: ["FHE", "fhEVM", "Zama", "Confidentiality", "AMM", "MEV", "DEX", "Ethereum"],
}

export const viewport: Viewport = {
  themeColor: "#10B981",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="light overflow-x-hidden">
      <body className={`${spaceGrotesk.variable} ${spaceMono.variable} font-sans antialiased bg-white text-black`}>
        <Providers>
          <LenisProvider>{children}</LenisProvider>
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
