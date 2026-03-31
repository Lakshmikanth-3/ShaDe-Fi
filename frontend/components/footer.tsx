"use client"

import { motion, useInView, type Variants } from "framer-motion"
import { useState, useRef } from "react"
import Link from "next/link"
import { Activity, ShieldCheck, ArrowRight, Lock } from "lucide-react"

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 20,
    },
  },
}

export function Footer() {
  const [email, setEmail] = useState("")
  const [isHovering, setIsHovering] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const footerRef = useRef(null)
  const isInView = useInView(footerRef, { once: true, margin: "-100px" })

  const handleSubmit = () => {
    setIsSubmitting(true)
    setTimeout(() => setIsSubmitting(false), 2000)
  }

  const footerLinks = [
    {
      title: "Protocol",
      links: ["Swap", "Pool", "Stats", "Faucet"],
    },
    {
      title: "Resources",
      links: ["Zama_Docs", "Whitepaper", "Security_Layer", "Audit_Logs"],
    },
    {
      title: "Social",
      links: ["Twitter / X", "Discord", "Telegram", "Github"],
    },
    {
      title: "Network",
      links: ["Sepolia", "Relayer", "Gateway", "EVM"],
    },
  ]

  return (
    <footer ref={footerRef} id="footer" className="relative bg-black pt-32 pb-12 overflow-hidden border-t-8 border-white font-black italic">
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ 
          backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)',
          backgroundSize: '40px 40px' 
        }}
      />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10 text-left">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-24"
        >
          <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[0.8] overflow-hidden uppercase italic">
            <motion.span
              className="block"
              initial={{ x: -100 }}
              whileInView={{ x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              SECURE THE
            </motion.span>
            <motion.span
              className="block text-[#7C3AED] stroke-white"
              style={{ WebkitTextStroke: '2px white' }}
              initial={{ x: 100 }}
              whileInView={{ x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            >
              STATE.
            </motion.span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mb-24"
        >
          <div className="flex flex-col sm:flex-row gap-8">
            <motion.div className="flex-1 relative">
              <motion.input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="DEVELOPER@NODE.SECURE"
                className="w-full bg-zinc-950 border-4 border-white rounded-none px-8 py-6 text-white placeholder:text-white/20 font-black text-lg uppercase focus:outline-none focus:border-[#7C3AED] focus:ring-4 focus:ring-[#7C3AED]/20 transition-all duration-300 shadow-[8px_8px_0px_0px_white]"
              />
            </motion.div>
            <motion.button
              className="bg-[#7C3AED] text-white px-12 py-6 rounded-none font-black text-lg tracking-widest uppercase relative border-4 border-white shadow-[10px_10px_0px_0px_white] hover:shadow-none hover:translate-x-[5px] hover:translate-y-[5px] transition-all italic"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
            >
              <span className="relative z-10">
                {isSubmitting ? "ENCRYPTING..." : "ENTER_CIRCUIT"}
              </span>
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-16 py-24 border-t-4 border-white/10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {footerLinks.map((section, sectionIndex) => (
            <motion.div key={sectionIndex} variants={itemVariants} className="space-y-10">
              <h4 className="font-black text-white text-[10px] uppercase tracking-[0.5em] mb-10 border-b-4 border-[#7C3AED] pb-4 inline-block italic">{section.title}</h4>
              <ul className="space-y-6">
                {section.links.map((item, i) => (
                  <li key={i}>
                    <motion.div whileHover={{ x: 10 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                      <Link
                        href="#"
                        className="text-white/40 hover:text-[#7C3AED] font-black text-lg transition-colors inline-block uppercase tracking-tighter italic"
                      >
                        {item}
                      </Link>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="flex flex-col md:flex-row justify-between items-center pt-16 border-t-8 border-white gap-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="flex items-center gap-6"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-5xl font-black italic tracking-tighter">
              <span className="text-white">SHADE</span>
              <span className="text-[#7C3AED]">_FI</span>
            </span>
          </motion.div>

          <p className="text-white font-black text-[10px] uppercase tracking-[0.3em] italic">© 2026 SHADEFI_LABS. STRUCTURAL_STATE_IMMUNITY_VERIFIED.</p>

          <motion.div
            className="flex items-center gap-8 cursor-pointer group"
            onHoverStart={() => setIsHovering(true)}
            onHoverEnd={() => setIsHovering(false)}
            animate={
              isHovering
                ? {
                    rotate: [0, -2, 2, -1, 1, 0],
                  }
                : {
                    rotate: 0,
                  }
            }
          >
             <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] italic group-hover:text-[#7C3AED] transition-colors">CRYPTO_VERIFIED</span>
             <ShieldCheck className="w-6 h-6 text-white/30 group-hover:text-[#7C3AED] transition-all" />
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-[-15%] left-[-5%] text-[25rem] font-black text-white/[0.02] pointer-events-none select-none leading-none tracking-tighter uppercase italic"
        initial={{ y: 200, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        SHADE_FI
      </motion.div>
    </footer>
  )
}
