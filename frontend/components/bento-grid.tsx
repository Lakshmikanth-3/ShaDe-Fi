"use client"

import { motion, type Variants } from "framer-motion"
import { ShieldCheck, Lock, ArrowRight, Zap, Target, Database, Activity, EyeOff } from "lucide-react"

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.4,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 20,
    },
  },
}

export function BentoGrid() {
  return (
    <section id="specs" className="relative py-48 bg-black overflow-hidden border-y-8 border-white font-black italic">
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{ 
          backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)',
          backgroundSize: '32px 32px' 
        }}
      />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-left mb-32 border-l-8 border-white pl-12"
        >
          <span className="font-mono text-[#7C3AED] text-xs tracking-[0.6em] inline-block uppercase font-black mb-4">_TECHNICAL_SPECIFICATION</span>
          <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter overflow-hidden uppercase italic leading-none">
            PROTOCOL_ <br /><span className="text-[#7C3AED]">ARCHITECTURE.</span>
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
        >
          {/* Card 1: Confidentiality */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-2 p-12 bg-zinc-950 border-8 border-white shadow-[24px_24px_0px_0px_#7C3AED] transition-all relative overflow-hidden group hover:translate-x-2 hover:translate-y-2 hover:shadow-none"
          >
             <div className="flex flex-col md:flex-row gap-16 items-center relative z-10">
                <div className="w-48 h-48 bg-black border-4 border-white flex items-center justify-center shadow-[12px_12px_0px_0px_rgba(255,255,255,0.05)] rotate-3 group-hover:rotate-6 transition-transform">
                   <Lock className="w-20 h-20 text-[#7C3AED]" />
                </div>
                <div className="space-y-8 flex-1">
                   <h3 className="text-4xl font-black text-white tracking-tighter uppercase italic">CONFIDENTIAL_STATE</h3>
                   <p className="text-lg text-white/40 leading-tight font-black uppercase tracking-tight italic">
                      Traditional AMMs store reserves in plaintext. ShaDe-Fi reserves are encrypted ciphertexts. MEV bots see opaque noise, making sandwich attacks structurally impossible.
                   </p>
                </div>
             </div>
             <motion.div 
               className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#7C3AED]/5 border-8 border-white/5 rotate-12"
               animate={{ rotate: 360 }}
               transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
             />
          </motion.div>

          {/* Card 2: Speed */}
          <motion.div 
            variants={itemVariants}
            className="p-12 flex flex-col justify-between bg-black border-8 border-white shadow-[20px_20px_0px_0px_#7C3AED] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
          >
             <Activity className="w-16 h-16 text-[#7C3AED] mb-12" />
             <div className="space-y-6">
                <h3 className="text-4xl font-black text-white uppercase italic leading-none">6S_ <br />FINALITY</h3>
                <p className="text-xs text-white/30 font-black uppercase tracking-[0.2em] leading-relaxed italic">
                   Atomic confidential transactions via Zama fhEVM.
                </p>
             </div>
          </motion.div>

          {/* Card 3: Invariant */}
          <motion.div 
            variants={itemVariants}
            className="p-12 flex flex-col justify-between bg-white border-8 border-black shadow-[20px_20px_0px_0px_#7C3AED] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
          >
             <Target className="w-16 h-16 text-black mb-12" />
             <div className="space-y-6">
                <h3 className="text-4xl font-black text-black uppercase italic leading-none">X*Y=K_ <br />ENCRYPTED</h3>
                <p className="text-xs text-black/40 font-black uppercase tracking-[0.2em] leading-relaxed italic">
                   Mathematical invariants maintained entirely in ciphertext.
                </p>
             </div>
          </motion.div>

          {/* Card 4: Hardware */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-2 p-12 bg-zinc-950 border-8 border-white shadow-[24px_24px_0px_0px_white] transition-all relative overflow-hidden group hover:translate-x-2 hover:translate-y-2 hover:shadow-none"
          >
             <div className="flex flex-col md:flex-row gap-16 items-center relative z-10">
                <div className="space-y-8 flex-1">
                   <h3 className="text-4xl font-black text-white tracking-tighter uppercase italic">TFHE_ENGINE</h3>
                   <p className="text-lg text-white/40 leading-tight font-black uppercase tracking-tight italic">
                      Powered by the TFHE-rs library. Fully homomorphic encryption allows for mathematical operations on ciphertexts without decryption.
                   </p>
                </div>
                <div className="w-48 h-48 bg-black border-4 border-white flex items-center justify-center shadow-[12px_12px_0px_0px_rgba(255,255,255,0.05)] -rotate-3 overflow-hidden group-hover:-rotate-12 transition-transform">
                    <Database className="w-20 h-20 text-[#7C3AED]" />
                    <motion.div 
                      className="absolute inset-0 bg-[#7C3AED]/10"
                      animate={{ scale: [1, 2, 1], opacity: [0.1, 0.3, 0.1] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    />
                </div>
             </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
