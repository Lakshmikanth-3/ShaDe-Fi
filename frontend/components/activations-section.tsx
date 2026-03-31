"use client"

import { motion, useScroll, useTransform, type Variants } from "framer-motion"
import { useRef } from "react"
import { Globe, Users, Database, Zap, ShieldCheck, Cpu, Code2, Network } from "lucide-react"

const partners = [
  { name: "ZAMA", label: "FHEVM_CORE", color: "#7C3AED" },
  { name: "SEPOLIA", label: "DEVNET_NETWORK", color: "#7C3AED" },
  { name: "TFHE-RS", label: "CRYPTO_ENGINE", color: "#7C3AED" },
  { name: "FHEVM", label: "VM_LAYER", color: "#7C3AED" },
  { name: "DEVICUL", label: "SECURITY_PROTOCOL", color: "#7C3AED" },
  { name: "HARDHAT", label: "DEV_ENV", color: "#7C3AED" },
]

export function ActivationsSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const x1 = useTransform(scrollYProgress, [0, 1], [0, -300])
  const x2 = useTransform(scrollYProgress, [0, 1], [0, 300])

  return (
    <section ref={containerRef} id="activations" className="py-48 bg-black overflow-hidden border-y-8 border-white font-black italic text-left">
      <div className="max-w-7xl mx-auto px-6 mb-24 relative z-10 border-l-8 border-white pl-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-12">
          <div className="space-y-6">
             <span className="font-mono text-[#7C3AED] text-sm tracking-[0.6em] font-black uppercase">_ECOSYSTEM_GROWTH</span>
             <h2 className="text-4xl md:text-8xl font-black text-white tracking-tighter uppercase italic leading-[0.8]">
               POWERED BY <br />
               <span className="text-[#7C3AED]">_THE_BEST.</span>
             </h2>
          </div>
          <p className="text-xl text-white/40 font-black italic max-w-sm uppercase tracking-tighter leading-tight">
            Integrated with the core protocols defining the future of confidential computation.
          </p>
        </div>
      </div>

      {/* Marquee 1 */}
      <div className="mb-12 border-y-4 border-white/10 py-8 bg-zinc-950">
        <motion.div style={{ x: x1 }} className="flex gap-24 whitespace-nowrap">
           {Array.from({ length: 4 }).map((_, i) => (
             <div key={i} className="flex gap-24 items-center">
                {partners.map((p) => (
                  <div key={p.name} className="flex flex-col">
                    <span className="font-mono text-[10px] text-white/20 uppercase tracking-widest mb-2">_{p.label}</span>
                    <span className="text-4xl md:text-7xl font-black text-white uppercase italic tracking-tighter hover:text-[#7C3AED] transition-colors cursor-default stroke-white" style={{ WebkitTextStroke: '1px white' }}>
                      {p.name}
                    </span>
                  </div>
                ))}
             </div>
           ))}
        </motion.div>
      </div>

      {/* Marquee 2 */}
      <div className="border-b-4 border-white/10 py-8 bg-zinc-950">
        <motion.div style={{ x: x2 }} className="flex gap-24 whitespace-nowrap translate-x-[-1500px]">
           {Array.from({ length: 4 }).map((_, i) => (
             <div key={i} className="flex gap-24 items-center">
                {partners.slice().reverse().map((p) => (
                  <div key={p.name} className="flex flex-col">
                    <span className="font-mono text-[10px] text-white/20 uppercase tracking-widest mb-2">_{p.label}</span>
                    <span className="text-4xl md:text-7xl font-black text-[#7C3AED] uppercase italic tracking-tighter hover:text-white transition-colors cursor-default stroke-white" style={{ WebkitTextStroke: '1px white' }}>
                      {p.name}
                    </span>
                  </div>
                ))}
             </div>
           ))}
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-32 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
            <div className="p-12 space-y-10 bg-zinc-950 border-8 border-white shadow-[20px_20px_0px_0px_white] relative group overflow-hidden hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all">
                <Globe className="w-20 h-20 text-[#7C3AED] mb-6 group-hover:rotate-12 transition-transform" />
                <h3 className="text-3xl font-black text-white uppercase italic">DEFI_SUMMER_2.0</h3>
                <p className="text-white/40 font-black italic uppercase text-lg leading-tight">
                  Confidential pools unlock institutional liquidity that was previously afraid of being front-run.
                </p>
                <div className="absolute top-0 right-0 w-2 h-full bg-[#7C3AED]/20" />
            </div>

            <div className="p-12 space-y-10 bg-black border-8 border-white shadow-[20px_20px_0px_0px_#7C3AED] relative group overflow-hidden rotate-2 hover:rotate-0 transition-all">
                <Network className="w-20 h-20 text-white mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-3xl font-black text-white uppercase italic">STATE_PRIVACY</h3>
                <p className="text-white/40 font-black italic uppercase text-lg leading-tight">
                  Join the growing ecosystem of traders who value state-level privacy and MEV protection.
                </p>
                <div className="absolute top-0 right-0 w-2 h-full bg-white/20" />
            </div>

            <div className="p-12 space-y-10 bg-zinc-950 border-8 border-white shadow-[20px_20px_0px_0px_white] relative group overflow-hidden -rotate-1 hover:rotate-0 transition-all">
                <Code2 className="w-20 h-20 text-[#7C3AED] mb-6 group-hover:-rotate-12 transition-transform" />
                <h3 className="text-3xl font-black text-white uppercase italic">FHE_NATIVE</h3>
                <p className="text-white/40 font-black italic uppercase text-lg leading-tight">
                  Atomic swaps in as little as 6 seconds. Confidentiality without the wait.
                </p>
                <div className="absolute top-0 right-0 w-2 h-full bg-[#7C3AED]/20" />
            </div>
        </div>
      </div>
    </section>
  )
}
