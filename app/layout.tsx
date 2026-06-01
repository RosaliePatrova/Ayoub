import type React from "react"
import type { Metadata } from "next"
import { Poppins, Playfair_Display, Caveat } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
<link
  rel="preload"
  href="/fonts/MinecraftRegular-Bmg3.otf"
  as="font"
  type="font/otf"
  crossOrigin="anonymous"
/>



const _poppins = Poppins({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: "--font-sans" })
const _playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })
const _caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat" })

export const metadata: Metadata = {
  title: "LoFi Owl Night",
  description: "A peaceful forest for sound, thought, and stillness",
  icons: {
  icon: "/favicon.ico",

  },
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${_poppins.variable} ${_playfair.variable} ${_caveat.variable}`}>
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}

