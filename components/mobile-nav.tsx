"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Gamepad2, Package, Wallet, Users, Trophy, Settings } from "@/components/icons"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", icon: Gamepad2, label: "Arcade" },
  { href: "/inventory", icon: Wallet, label: "Inventory" },
  { href: "/mint", icon: Package, label: "Mint" },
  { href: "/social", icon: Users, label: "Social" },
  { href: "/leaderboard", icon: Trophy, label: "Ranks" },
  { href: "/admin", icon: Settings, label: "Admin" },
]

export default function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border/50">
      <div className="grid grid-cols-6 gap-1 p-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-lg transition-all",
                "hover:bg-primary/10",
                isActive && "bg-primary/20 text-primary shadow-[0_0_15px_hsl(var(--neon-cyan)/0.3)]",
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium truncate w-full text-center">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
