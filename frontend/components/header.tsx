"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useState, useEffect, ReactNode } from "react"
import { Menu, X, ArrowRight, LogIn } from "lucide-react"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import { injected } from "wagmi/connectors"

function ClientOnly({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null
  return <>{children}</>
}

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()

  const navItems = [
    { name: "Trade", href: "/swap" },
    { name: "Pools", href: "/pool" },
    { name: "History", href: "/stats" },
    { name: "Get Tokens", href: "/faucet" },
  ]

  const handleConnect = () => {
    if (isConnected) {
      disconnect()
    } else {
      connect({ connector: injected() })
    }
  }

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b-4 border-[#FFE500] bg-black text-white font-bold">
      <div className="max-w-7xl mx-auto flex h-20 items-center justify-between px-6">
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-3xl font-black tracking-tighter uppercase italic">
              <span className="text-white">SHADE</span>
              <span className="text-[#FFE500]">_FI</span>
            </span>
          </Link>
          <nav className="hidden lg:flex items-center space-x-10 text-xs font-black tracking-[0.2em] uppercase">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "transition-all relative group italic",
                  pathname === item.href ? "text-[#FFE500]" : "text-white/60 hover:text-white"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={handleConnect}
            className="hidden md:flex items-center gap-2 py-3 px-6 bg-[#FFE500] text-black border-2 border-black shadow-[4px_4px_0px_0px_white] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all font-black uppercase text-xs tracking-widest italic"
          >
            <ClientOnly>
              {isConnected ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-black animate-pulse" />
                  {truncateAddress(address!)}
                </>
              ) : (
                <>
                  <LogIn className="w-3 h-3" />
                  Connect Wallet
                </>
              )}
            </ClientOnly>
          </button>
          
          <button 
            className="lg:hidden p-2 border-2 border-[#FFE500] bg-black" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-black text-white border-b-4 border-[#FFE500] shadow-2xl">
           <div className="p-8 space-y-6 font-black italic">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex justify-between items-center text-xl font-black tracking-tighter uppercase italic border-b-2 border-white/10 pb-3 hover:border-[#FFE500] transition-all"
                >
                  {item.name}
                  <ArrowRight className="text-[#FFE500] w-5 h-5" />
                </Link>
              ))}
              <button 
                onClick={() => { handleConnect(); setMobileMenuOpen(false); }}
                className="w-full bg-[#FFE500] text-black font-black py-4 text-lg mt-4 border-2 border-black shadow-[6px_6px_0px_0px_white]"
              >
                <ClientOnly>
                  {isConnected ? truncateAddress(address!) : "Connect Wallet"}
                </ClientOnly>
              </button>
           </div>
        </div>
      )}
    </header>
  )
}
