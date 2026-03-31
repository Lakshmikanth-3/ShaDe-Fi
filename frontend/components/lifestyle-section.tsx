"use client"

import { motion, useInView, type Variants } from "framer-motion"
import { useRef } from "react"
import { Activity, ShieldCheck, Twitter, Quote } from "lucide-react"
import { cn } from "@/lib/utils"

const confidenceQuotes = [
  { handle: "@zama_fhevm", text: "SHADEFI is the gold standard for confidentiality on Ethereum. Native FHE changes everything.", likes: "1.2k" },
  { handle: "@degen_trader", text: "Finally swapped without checking the mempool for sandwich bots. The experience is surreal.", likes: "850" },
  { handle: "@eth_researcher", text: "Encrypting the pool state is the only real solution to MEV. Protective headers are just a band-aid.", likes: "540" },
]

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 20,
    },
  },
}

export function LifestyleSection() {
  const cardsRef = useRef(null)
  const isCardsInView = useInView(cardsRef, { once: true, margin: "-50px" })

  return (
    <section className="relative py-48 bg-black overflow-hidden border-t-8 border-white font-black italic">
      <div 
        className="absolute inset-0 opacity-[0.05]"
        style={{ 
          backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)',
          backgroundSize: '40px 40px' 
        }}
      />
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-left mb-24 border-l-8 border-white pl-12"
        >
          <motion.span
            className="font-mono text-[#7C3AED] text-sm tracking-[0.6em] inline-block uppercase font-black mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            _PROTOCOL_SENTIMENT
          </motion.span>
          <h2 className="text-4xl md:text-8xl font-black text-white tracking-tighter overflow-hidden uppercase italic leading-[0.8]">
            TRUSTED BY <br /><span className="text-[#7C3AED]">_THE_CORE.</span>
          </h2>
        </motion.div>

        <motion.div
          ref={cardsRef}
          className="grid md:grid-cols-3 gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {confidenceQuotes.map((post, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{
                y: -16,
                scale: 1.02,
                transition: { type: "spring", stiffness: 400, damping: 17 },
              }}
              className={cn(
                "bg-zinc-950 p-12 border-8 border-white shadow-[20px_20px_0px_0px_#7C3AED] hover:shadow-none transition-all cursor-pointer relative",
                index % 2 === 0 ? "rotate-1" : "-rotate-1"
              )}
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-white/5 group-hover:text-[#7C3AED]/20 transition-colors" />
              
              <div className="flex items-center gap-6 mb-10">
                <motion.div
                  className="w-16 h-16 bg-[#7C3AED] flex items-center justify-center font-black text-white text-2xl italic border-4 border-white shadow-[6px_6px_0px_0px_white]"
                  whileHover={{ rotate: 12, scale: 1.1 }}
                >
                  {post.handle.charAt(1).toUpperCase()}
                </motion.div>
                <span className="font-mono text-[#7C3AED] text-sm font-black uppercase tracking-widest">{post.handle}</span>
              </div>
              
              <p className="text-white text-2xl font-black uppercase tracking-tight leading-tight italic mb-12">"{post.text}"</p>
              
              <motion.div
                className="flex items-center gap-4 text-white/20 font-mono text-xs font-black uppercase tracking-[0.3em] mt-auto"
                whileHover={{ color: "#7C3AED" }}
              >
                <Activity className="w-5 h-5" />
                {post.likes} LIKES_VERIFIED
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
