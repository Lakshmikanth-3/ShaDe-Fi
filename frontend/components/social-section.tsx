"use client"

import { motion } from "framer-motion"
import { Twitter, Github, MessageCircle, Send, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"

export function SocialSection() {
  const socials = [
    { name: "Twitter", handle: "@ShaDe_Fi", icon: Twitter, color: "#1DA1F2" },
    { name: "Discord", handle: "/ShaDeFi", icon: MessageCircle, color: "#5865F2" },
    { name: "Github", handle: "/Labs", icon: Github, color: "#000000" },
    { name: "Telegram", handle: "/Signal", icon: Send, color: "#0088cc" }
  ]

  return (
    <section className="py-48 bg-black border-y-8 border-white overflow-hidden relative font-black italic text-left">
      <div 
        className="absolute inset-0 opacity-[0.05]"
        style={{ 
          backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)',
          backgroundSize: '48px 48px' 
        }}
      />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-32 items-center">
          <div className="border-l-8 border-white pl-12">
            <span className="font-mono text-[#7C3AED] text-sm tracking-[0.6em] mb-6 inline-block uppercase font-black italic">_STAY_CONNECTED</span>
            <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase italic leading-[0.8] mb-12">
              PRIVATE_ <br /><span className="text-[#7C3AED]">NETWORK.</span>
            </h2>
            <p className="text-xl text-white/40 font-black uppercase tracking-tight leading-tight italic max-w-md">
              Join our encrypted communication channels to get the latest updates on the protocol's development and devnet status.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
            {socials.map((social, i) => (
              <motion.div 
                key={i}
                whileHover={{ scale: 1.05, rotate: i % 2 === 0 ? 2 : -2 }}
                className="p-12 border-8 border-white bg-zinc-950 group cursor-pointer hover:bg-black hover:shadow-[16px_16px_0px_0px_#7C3AED] transition-all"
              >
                <div className="flex justify-between items-start mb-8">
                  <div className="p-4 bg-white text-black border-4 border-black rotate-3 group-hover:rotate-12 transition-transform">
                    <social.icon className="w-8 h-8" />
                  </div>
                  <ShieldCheck className="w-6 h-6 text-white/10 group-hover:text-[#7C3AED] transition-colors" />
                </div>
                <div className="text-xs font-black text-[#7C3AED] uppercase tracking-widest mb-4 italic">{social.name}</div>
                <div className="text-2xl font-black text-white tracking-tighter uppercase italic group-hover:text-[#7C3AED] transition-colors">{social.handle}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
