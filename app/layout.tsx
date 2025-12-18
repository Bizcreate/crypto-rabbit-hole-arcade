import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter, Orbitron } from "next/font/google"
import { Providers } from "@/components/providers"
import Sidebar from "@/components/sidebar"
import MobileNav from "@/components/mobile-nav"
import Topbar from "@/components/topbar"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-display" })

export const metadata: Metadata = {
  title: "Crypto Rabbit Arcade | Web3 Gaming Hub",
  description: "The Crypto Rabbit Hole® - Mini Games, TCG, NFTs on ApeChain",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${orbitron.variable} font-sans antialiased`}>
        <Providers>
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <Topbar />
              <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 pb-20 md:pb-4">{children}</main>
            </div>
          </div>
          <MobileNav />
          <Toaster />
          <div className="scanline pointer-events-none fixed inset-0 z-50" />
        </Providers>
      </body>
    </html>
  )
}
