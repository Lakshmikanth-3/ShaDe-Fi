"use client"

import { useState, useEffect, ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useLenis } from "lenis/react"
import { Menu, X, LogIn, Shield } from "lucide-react"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import { injected } from "wagmi/connectors"

function ClientOnly({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null
  return <>{children}</>
}

export function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const lenis = useLenis()
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.querySelector(id)
    if (element && lenis) {
      lenis.scrollTo(element as HTMLElement, { offset: -100 })
    }
    setMobileMenuOpen(false)
  }

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

  const navLinks = [
    { label: "Swap", href: "/swap" },
    { label: "Pool", href: "/pool" },
    { label: "Stats", href: "/stats" },
    { label: "Faucet", href: "/faucet" },
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 pb-0.5 border-b-4 ${
        scrolled ? "bg-black/95 backdrop-blur-md border-[#7C3AED]" : "bg-transparent border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <motion.span
            className="text-4xl font-black tracking-tighter italic"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <span className="text-white">SHADE</span>
            <span className="text-[#7C3AED]">_FI</span>
          </motion.span>
        </Link>

        <div className="hidden lg:flex items-center gap-10 font-black italic uppercase tracking-widest text-xs">
          {navLinks.map((item, i) => (
            <motion.button
              key={i}
              onClick={() => {
                window.location.href = item.href
              }}
              className={`transition-colors relative items-center gap-2 flex ${
                scrolled ? "text-white hover:text-[#7C3AED]" : "text-white/80 hover:text-white"
              }`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4, ease: "easeOut" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {item.label}
              <motion.span
                className="absolute -bottom-1 left-0 w-full h-1 bg-[#7C3AED] origin-left"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </motion.button>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <motion.button
            onClick={handleConnect}
            className="hidden md:flex items-center gap-3 bg-[#7C3AED] text-white px-10 py-5 rounded-none font-black text-sm border-4 border-white relative overflow-hidden shadow-[8px_8px_0px_0px_white] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all italic uppercase tracking-widest"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <ClientOnly>
               {isConnected ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span className="relative z-10">{truncateAddress(address!)}</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span className="relative z-10">Connect</span>
                </>
              )}
            </ClientOnly>
          </motion.button>

          <motion.button
            className="lg:hidden p-3 border-4 border-white bg-black text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileTap={{ scale: 0.9 }}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-black border-t-8 border-white overflow-hidden shadow-2xl"
          >
            <div className="px-6 py-12 space-y-8 font-black italic">
              {navLinks.map((item, i) => (
                <motion.button
                  key={i}
                  onClick={() => {
                    window.location.href = item.href
                  }}
                  className="flex justify-between items-center w-full text-left text-white hover:text-[#7C3AED] text-4xl font-black tracking-tighter italic border-b-4 border-white/10 pb-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  {item.label}
                  <Shield className="h-6 w-6 text-[#7C3AED]" />
                </motion.button>
              ))}
              <motion.button
                onClick={() => { handleConnect(); setMobileMenuOpen(false); }}
                className="w-full bg-[#7C3AED] text-white px-6 py-8 rounded-none font-black text-2xl mt-12 border-4 border-white shadow-[12px_12px_0px_0px_white]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <ClientOnly>
                  {isConnected ? truncateAddress(address!) : "Connect Wallet"}
                </ClientOnly>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
