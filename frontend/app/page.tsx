"use client"

import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { FlavorCarousel } from "@/components/flavor-carousel"
import { BentoGrid } from "@/components/bento-grid"
import { ActivationsSection } from "@/components/activations-section"
import { LifestyleSection } from "@/components/lifestyle-section"
import { SocialSection } from "@/components/social-section"
import { Footer } from "@/components/footer"
import { LiveSwaps } from "@/components/live-swaps"
import { motion, useScroll, useSpring } from "framer-motion"
import { ShieldAlert, ShieldCheck } from "lucide-react"

export default function Home() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  return (
    <div className="flex min-h-screen flex-col bg-black text-white selection:bg-[#7C3AED] selection:text-white overflow-x-hidden font-sans antialiased">
        <Navigation />
        <motion.div
          className="fixed top-0 left-0 right-0 h-2 bg-[#7C3AED] z-60 origin-left border-b-2 border-white"
          style={{ scaleX }}
        />

        <main className="flex-1">
          <HeroSection />

          <section id="insight" className="relative py-32 bg-black overflow-hidden border-t-8 border-white">
             <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #7C3AED 1px, transparent 0)', backgroundSize: '40px 40px' }} />

             <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-24 items-center relative z-10 text-left">
                <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-10">
                   <div className="inline-flex items-center gap-3 bg-red-600 text-white px-6 py-3 font-bold uppercase text-[10px] tracking-widest italic border-4 border-white shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
                     <ShieldAlert className="w-5 h-5 animate-pulse" /> Public State Detected
                   </div>
                   <h2 className="text-3xl md:text-6xl font-black text-white tracking-tighter uppercase leading-[0.8] italic">
                     MEV is a <span className="text-[#7C3AED] stroke-white font-black" style={{ WebkitTextStroke: '1px white' }}>State</span> Problem.
                   </h2>
                   <p className="text-xl text-white/60 font-black italic max-w-xl uppercase tracking-tighter leading-tight italic">
                     Standard exchanges protect your transaction, but the <span className="text-white italic underline decoration-[#7C3AED] decoration-8">pool balances</span> remain public. Bots see exactly when to front-run you.
                   </p>
                </motion.div>

                <div className="bg-black border-12 border-white p-12 space-y-12 font-black italic shadow-[30px_30px_0px_0px_#7C3AED] relative">
                    <div className="space-y-6">
                      <div className="flex justify-between items-center text-[10px] text-[#7C3AED] font-black uppercase tracking-widest border-b-4 border-white/5 pb-4 italic font-black">
                          <span>Public Pool Reserves</span>
                          <span className="text-red-500 animate-pulse font-black">[VULNERABLE]</span>
                      </div>
                      <div className="space-y-4 text-2xl md:text-3xl font-black text-white/20 italic line-through decoration-red-600 decoration-8 font-black">
                          <div className="flex justify-between">ETH: 4,821.30</div>
                          <div className="flex justify-between">USDC: 12.11M</div>
                      </div>
                    </div>

                    <div className="space-y-6 bg-zinc-900 p-10 border-4 border-white shadow-[10px_10px_0px_0px_rgba(255,255,255,1)]">
                        <div className="flex justify-between items-center text-xs text-[#7C3AED] font-black uppercase tracking-widest border-b-4 border-white/10 pb-4 italic font-black">
                          <span>Protocol Protected</span>
                          <span className="text-[#7C3AED] animate-pulse font-black font-black">[ SECURED ]</span>
                        </div>
                        <div className="space-y-4 text-2xl md:text-3xl font-black text-white italic encrypted-text p-2 font-black">
                          <div className="flex justify-between font-black italic">ETH: Protected</div>
                          <div className="flex justify-between font-black italic">USDC: Protected</div>
                        </div>
                    </div>
                    
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-black border-8 border-white flex items-center justify-center p-8 rotate-12 shadow-[15px_15px_0px_0px_#7C3AED]">
                        <ShieldCheck className="w-full h-full text-[#7C3AED]" />
                    </div>
                </div>
             </div>
          </section>

          <LiveSwaps />
          <FlavorCarousel />
          <BentoGrid />
          
          <section className="bg-black py-16 overflow-hidden border-y-8 border-white relative">
             <div className="absolute top-0 left-0 w-full h-1 bg-[#7C3AED]/10" />
             <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} className="flex whitespace-nowrap gap-24">
                {Array.from({ length: 4 }).map((_, i) => (
                   <span key={i} className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase italic stroke-white" style={{ WebkitTextStroke: '2px white' }}>
                     <span className="text-[#7C3AED]">Private</span> by default • <span className="text-black bg-white px-8">No MEV leakage</span> • Powered by fhEVM • 
                   </span>
                ))}
             </motion.div>
          </section>

          <LifestyleSection />
          <SocialSection />
          <ActivationsSection />

          <section className="py-40 bg-zinc-950 overflow-hidden border-t-8 border-white font-black italic text-left">
             <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16">
                <div className="p-16 bg-black border-8 border-white shadow-[20px_20px_0px_0px_#7C3AED] space-y-8">
                   <div className="bg-[#7C3AED] text-white w-20 h-20 flex items-center justify-center font-black italic text-4xl border-4 border-white shadow-[6px_6px_0px_0px_white] rotate-3">01</div>
                   <h3 className="text-3xl font-black uppercase italic tracking-tighter leading-none text-white">Atomic Privacy</h3>
                   <p className="text-lg text-white/60 font-black uppercase leading-tight tracking-tight italic">
                      Every pool interaction is encrypted. Market updates are proven without revealing actual values to anyone.
                   </p>
                </div>
                <div className="p-16 bg-black border-8 border-white shadow-[20px_20px_0px_0px_#7C3AED] space-y-8 -rotate-1">
                   <div className="bg-white text-black w-20 h-20 flex items-center justify-center font-black italic text-4xl border-4 border-black shadow-[6px_6px_0px_0px_#7C3AED] -rotate-3">02</div>
                   <h3 className="text-3xl font-black uppercase italic tracking-tighter leading-none text-white">High Performance</h3>
                   <p className="text-lg text-white/60 font-black uppercase leading-tight tracking-tight italic">
                      Built on Zama's fhEVM infrastructure for real-time privacy with near-instant execution finality.
                   </p>
                </div>
             </div>
          </section>
        </main>

        <Footer />
      </div>
  )
}
