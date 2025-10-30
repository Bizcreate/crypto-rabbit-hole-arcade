"use client"

import { Bell, Users } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { useArcade } from "@/components/providers"
import Image from "next/image"
import Link from "next/link"

export default function Topbar() {
  const { tickets, points, isConnected, address, connect } = useArcade()

  return (
    <div className="sticky top-0 z-40 backdrop-blur-xl bg-background/80 border-b border-border/50">
      <div className="flex items-center justify-between px-4 md:px-6 py-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="md:hidden flex items-center gap-2">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden shadow-[0_0_15px_hsl(var(--neon-cyan)/0.3)]">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Artboard-1-83QWedD6ivnkXqy5WoMh05oLPpdMO6.png"
                alt="Crypto Rabbit"
                fill
                className="object-cover"
              />
            </div>
            <span className="font-display text-sm font-bold bg-gradient-to-r from-neon-cyan to-neon-pink bg-clip-text text-transparent">
              CRA
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 border border-border/50">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">42 online</span>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="flex items-center gap-2">
            <div className="px-2 md:px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
              <span className="text-xs text-muted-foreground mr-1 md:mr-2">🎟️</span>
              <span className="text-xs md:text-sm font-bold text-primary">{tickets}</span>
            </div>
            <div className="px-2 md:px-3 py-1.5 rounded-lg bg-secondary/10 border border-secondary/20">
              <span className="text-xs text-muted-foreground mr-1 md:mr-2">⭐</span>
              <span className="text-xs md:text-sm font-bold text-secondary">{points}</span>
            </div>
          </div>

          <Button variant="ghost" size="icon" className="relative hidden md:flex">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
          </Button>

          {isConnected ? (
            <div className="px-2 md:px-4 py-2 rounded-lg bg-primary/10 border border-primary/20 font-medium text-xs md:text-sm">
              {address?.slice(0, 4)}...{address?.slice(-3)}
            </div>
          ) : (
            <Button
              onClick={connect}
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs md:text-sm"
            >
              <span className="hidden md:inline">Connect Wallet</span>
              <span className="md:hidden">Connect</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
