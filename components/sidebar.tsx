"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Gamepad2, Package, Wallet, Users, Settings, Trophy } from "@/components/icons"
import Image from "next/image"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", icon: Gamepad2, label: "Arcade Hub" },
  { href: "/inventory", icon: Wallet, label: "Inventory" },
  { href: "/mint", icon: Package, label: "Mint Packs" },
  { href: "/social", icon: Users, label: "Social Raids" },
  { href: "/leaderboard", icon: Trophy, label: "Leaderboard" },
  { href: "/admin", icon: Settings, label: "Admin Panel" },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex lg:w-72 w-64 flex-col gap-4 p-4 border-r border-border/50 bg-card/20 backdrop-blur-xl">
      <Link href="/" className="flex items-center gap-3 mb-4 group">
        <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-[0_0_20px_hsl(var(--neon-cyan)/0.3)]">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Artboard-1-83QWedD6ivnkXqy5WoMh05oLPpdMO6.png"
            alt="Crypto Rabbit"
            fill
            className="object-cover"
          />
        </div>
        <div>
          <div className="font-display text-lg font-bold bg-gradient-to-r from-neon-cyan via-neon-pink to-neon-purple bg-clip-text text-transparent">
            Crypto Rabbit
          </div>
          <div className="text-xs text-muted-foreground">Arcade Hub</div>
        </div>
      </Link>

      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                "hover:bg-primary/10 hover:text-primary hover:shadow-[0_0_15px_hsl(var(--neon-cyan)/0.2)]",
                isActive &&
                  "bg-primary/20 text-primary shadow-[0_0_20px_hsl(var(--neon-cyan)/0.3)] border border-primary/30",
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto p-4 rounded-xl bg-card/40 backdrop-blur-xl border border-border/50">
        <div className="text-xs text-muted-foreground mb-2">Powered by</div>
        <div className="flex flex-wrap gap-2 text-xs font-medium">
          <span className="px-2 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20">ApeChain</span>
          <span className="px-2 py-1 rounded-lg bg-secondary/10 text-secondary border border-secondary/20">
            Otherside
          </span>
        </div>
      </div>
    </aside>
  )
}
