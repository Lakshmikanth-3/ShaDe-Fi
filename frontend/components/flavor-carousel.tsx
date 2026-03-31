"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence, type Variants } from "framer-motion"
import { Lock, Shield, Cpu, Activity, ShieldCheck, Database, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

const mechanisms = [
  {
    id: "fhe-reserves",
    name: "CONFIDENTIAL_RESERVES",
    tagline: "OPAQUE_STATE",
    description: "ShadePool reserves are stored as euint128 handles. Unlike Uniswap, bots cannot read the pool balances to calculate price impact.",
    color: "#7C3AED",
    icon: Lock,
    stats: { opacity: "100%", leakage: "0.00%", precision: "euint128" }
  },
  {
    id: "mev-shield",
    name: "MEV_STRUCTURAL_IMMUNITY",
    tagline: "SANDWICH_PROOF",
    description: "Since the profit of a sandwich attack depends on knowing the reserve state, ShaDe-Fi's encryption makes sandwiching mathematically impossible.",
    color: "#7C3AED",
    icon: ShieldCheck,
    stats: { risk: "ZERO", delta: "0.0", vector: "VOID" }
  },
  {
    id: "zama-evm",
    name: "ZAMA_fhEVM_NATIVE",
    tagline: "HARDWARE_PRIVACY",
    description: "Direct integration with the Zama fhEVM driver enables atomic confidential swaps with only 6s finality.",
    color: "#7C3AED",
    icon: Cpu,
    stats: { latency: "6s", hardware: "TFHE", engine: "v2.1" }
  },
]

export function FlavorCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  
  const next = () => setActiveIndex((prev) => (prev + 1) % mechanisms.length)
  const prev = () => setActiveIndex((prev) => (prev - 1 + mechanisms.length) % mechanisms.length)

  const Icon = mechanisms[activeIndex].icon

  return (
    <section id="mechanisms" className="py-48 bg-black relative overflow-hidden border-y-8 border-white font-black italic">
      <div 
        className="absolute inset-0 opacity-[0.05]"
        style={{ 
          backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)',
          backgroundSize: '40px 40px' 
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12 border-l-8 border-white pl-12">
          <div className="space-y-6">
            <span className="font-mono text-[#7C3AED] text-sm tracking-[0.6em] font-black uppercase">_CORE_MECHANISMS</span>
            <h2 className="text-4xl md:text-8xl font-black text-white tracking-tighter uppercase italic leading-[0.85]">
              INSIDE THE <br />
              <span className="text-[#7C3AED]">SHADE_FI ENGINE.</span>
            </h2>
          </div>
          <div className="flex gap-6">
            <button 
              onClick={prev}
              className="w-20 h-20 border-4 border-white bg-black flex items-center justify-center hover:bg-[#7C3AED] hover:border-[#7C3AED] transition-all shadow-[8px_8px_0px_0px_white] active:shadow-none translate-x-[-2px] translate-y-[-2px]"
            >
              <Zap className="rotate-180 w-8 h-8 text-white" />
            </button>
            <button 
              onClick={next}
              className="w-20 h-20 border-4 border-white bg-black flex items-center justify-center hover:bg-[#7C3AED] hover:border-[#7C3AED] transition-all shadow-[8px_8px_0px_0px_white] active:shadow-none translate-x-[-2px] translate-y-[-2px]"
            >
              <Zap className="w-8 h-8 text-white" />
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-24 items-center min-h-[700px]">
          <div className="relative h-full flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={mechanisms[activeIndex].id}
                initial={{ opacity: 0, x: -100, rotate: -5 }}
                animate={{ opacity: 1, x: 0, rotate: 0 }}
                exit={{ opacity: 0, x: 100, rotate: 5 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-[600px] bg-zinc-950 border-8 border-white p-16 shadow-[40px_40px_0px_0px_#7C3AED] relative group"
              >
                 <div className="absolute top-6 right-6 text-[10px] font-mono text-white/20 font-black tracking-widest italic group-hover:text-[#7C3AED]/40 transition-colors">
                   VERIFIED: {mechanisms[activeIndex].id.toUpperCase()}
                 </div>

                 <motion.div
                    className="w-28 h-28 bg-[#7C3AED] text-white flex items-center justify-center mb-12 border-4 border-white shadow-[12px_12px_0px_0px_rgba(255,255,255,0.1)] rotate-3"
                    whileHover={{ rotate: -5, scale: 1.1 }}
                 >
                    {Icon && <Icon className="w-14 h-14" />}
                 </motion.div>

                 <div className="space-y-10">
                    <div>
                       <div className="font-mono text-xs font-black text-[#7C3AED] tracking-[0.4em] mb-4 uppercase">{mechanisms[activeIndex].tagline}</div>
                       <div className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-none">{mechanisms[activeIndex].name}</div>
                    </div>
                    <p className="text-xl text-white/40 font-black uppercase tracking-tight leading-tight italic">{mechanisms[activeIndex].description}</p>
                 </div>

                 <div className="mt-16 pt-16 border-t-4 border-white/10 grid grid-cols-3 gap-6">
                    {Object.entries(mechanisms[activeIndex].stats).map(([key, val], i) => (
                      <div key={i} className="space-y-2">
                         <div className="text-[10px] font-black uppercase text-white/20 tracking-widest">{key}</div>
                         <div className="font-black text-white text-xl italic">{val}</div>
                      </div>
                    ))}
                 </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="space-y-12 h-full flex flex-col justify-center">
             {mechanisms.map((mech, index) => (
               <motion.div 
                 key={mech.id}
                 onClick={() => setActiveIndex(index)}
                 className={cn(
                   "cursor-pointer p-10 transition-all relative",
                   activeIndex === index 
                     ? "bg-zinc-900 border-8 border-white shadow-[20px_20px_0px_0px_#7C3AED] translate-x-6" 
                     : "bg-black border-4 border-white/10 hover:border-white/30 opacity-30 hover:opacity-100"
                 )}
               >
                  <div className="flex justify-between items-center">
                     <span className={cn(
                       "text-3xl font-black tracking-tighter uppercase italic",
                       activeIndex === index ? "text-white" : "text-white/40"
                     )}>{mech.name}</span>
                     <span className="font-mono text-xs font-black text-[#7C3AED]">0{index + 1}</span>
                  </div>
               </motion.div>
             ))}
          </div>
        </div>
      </div>
    </section>
  )
}
