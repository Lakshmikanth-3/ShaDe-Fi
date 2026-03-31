"use client"

import { motion } from "framer-motion"
import { Lock, Activity, ShieldCheck } from "lucide-react"
import { EncryptedValue } from "./ui/encrypted-value"

export function LiveSwaps() {
  const swaps = [
    { id: "0x3f...a912", from: "USDC", to: "ETH", time: "2s ago" },
    { id: "0x7a...c031", from: "ETH", to: "USDC", time: "8s ago" },
    { id: "0x1b...f220", from: "USDC", to: "ETH", time: "14s ago" },
  ]

  return (
    <section className="py-32 bg-black border-t-8 border-white relative overflow-hidden font-black italic">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-16 space-y-4 text-left">
          <div className="flex items-center gap-6">
            <Activity className="w-10 h-10 text-[#7C3AED]" />
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic text-white">LIVE_EVENT_STREAMS</h2>
          </div>
          <p className="text-white/40 font-black uppercase text-xs tracking-widest italic leading-relaxed max-w-2xl border-l-4 border-[#7C3AED] pl-6">
            Protocol event history retrieved directly from shielded state transitions. Transaction amounts remain structurally opaque to all participants except the sender.
          </p>
        </div>

        <div className="space-y-8">
          {swaps.map((swap, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-black border-4 border-white p-10 shadow-[10px_10px_0px_0px_rgba(255,255,255,0.05)] hover:shadow-[10px_10px_0px_0px_#7C3AED] hover:translate-x-1 hover:translate-y-1 transition-all flex flex-col md:flex-row md:items-center justify-between gap-8 group"
            >
              <div className="flex items-center gap-8">
                <div className="bg-[#7C3AED] text-white p-4 border-4 border-white shadow-[4px_4px_0px_0px_white]">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <div className="space-y-4">
                  <div className="font-mono text-[10px] font-black text-white/30 uppercase italic tracking-widest underline">{swap.id}</div>
                  <div className="font-black text-2xl italic uppercase text-white flex items-center gap-4 flex-wrap">
                    SWAPPED <div className="bg-[#7C3AED]/20 px-2 py-0.5 text-[#7C3AED] blur-[2px] hover:blur-none transition-all">[ENCRYPTED]</div> {swap.from} 
                    <span className="text-[#7C3AED]">→</span> 
                    <div className="bg-[#7C3AED]/20 px-2 py-0.5 text-[#7C3AED] blur-[2px] hover:blur-none transition-all">[ENCRYPTED]</div> {swap.to}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className="font-black text-xs uppercase italic text-white/40 tracking-widest">{swap.time}</span>
                <div className="bg-white px-6 py-3 border-4 border-black text-black font-black text-[10px] uppercase tracking-widest italic group-hover:bg-[#7C3AED] group-hover:text-white transition-all shadow-[6px_6px_0px_0px_#7C3AED] group-hover:shadow-white">
                  VERIFIED_BY_KMS
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 text-center">
            <div className="inline-flex items-center gap-4 font-black text-[10px] uppercase tracking-[0.5em] italic text-[#7C3AED]">
                <ShieldCheck className="w-5 h-5 animate-pulse" /> NO SENSITIVE DATA LEAKAGE DETECTED (24H_WINDOW_SECURE)
            </div>
        </div>
      </div>

      <div className="absolute top-1/2 left-0 -translate-y-1/2 text-[25rem] font-black text-white/[0.02] pointer-events-none select-none italic leading-none uppercase tracking-tighter">
        STREAM
      </div>
    </section>
  )
}
