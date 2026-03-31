"use client"

import { Header } from "@/components/header"
import { BarChart3, Database, Globe, Lock, Activity, TrendingUp, Cpu, ShieldAlert, Zap } from "lucide-react"
import { useShadeFactory } from "@/hooks/use-shade-pool"
import { EncryptedValue } from "@/components/ui/encrypted-value"

export default function StatsPage() {
  const { poolCount, isLoading } = useShadeFactory()
  
  const stats = [
    { label: "Total Volume", value: "2.4M", trend: "+12.5%", encrypted: true },
    { label: "Total Fees", value: "7.2K", trend: "+5.2%", encrypted: true },
    { label: "Active Pools", value: isLoading ? '...' : poolCount?.toString() || "0", trend: "Steady", encrypted: false },
    { label: "Today's Trades", value: "48,291", trend: "+1.1K", encrypted: false },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-black text-white font-sans selection:bg-[#FFE500] selection:text-black">
      <Header />
      
      <main className="flex-1 p-6 py-12 relative overflow-hidden container mx-auto bg-black font-bold italic">
        <div 
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{ 
            backgroundImage: 'radial-gradient(circle at 1px 1px, #FFE500 1px, transparent 0)',
            backgroundSize: '40px 40px' 
          }}
        />

        <div className="relative z-10 text-left">
          <div className="mb-16 space-y-3">
            <span className="font-mono text-[#FFE500] text-[10px] font-black uppercase tracking-[0.3em] italic">Real-Time Data</span>
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic leading-none">Stats.</h1>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-16">
            {stats.map((stat, i) => (
              <div 
                key={i} 
                className="bg-black border-4 border-white p-8 shadow-[8px_8px_0px_0px_#FFE500] relative overflow-hidden hover:bg-zinc-950 transition-colors"
              >
                <div className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-4 italic">
                  {stat.label}
                </div>
                <div className="text-3xl font-black mb-3 italic tracking-tighter text-white uppercase">
                  {stat.encrypted ? <EncryptedValue value={stat.value} isEncrypted /> : stat.value}
                </div>
                <div className="text-[10px] font-black text-[#FFE500] uppercase flex items-center gap-2 italic">
                  <TrendingUp className="w-3 h-3" /> {stat.trend} <span className="text-white/10 italic">24h</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-12 lg:grid-cols-2 items-start">
             <div className="bg-black border-4 border-white shadow-[12px_12px_0px_0px_white] overflow-hidden">
                <div className="bg-zinc-950 border-b-4 border-white px-6 py-6 flex items-center justify-between">
                   <h2 className="font-black uppercase tracking-tighter flex items-center gap-4 text-sm italic text-white">
                     <BarChart3 className="h-6 w-6 text-[#FFE500]" /> Volume History
                   </h2>
                   <div className="flex gap-2">
                      <div className="w-3 h-3 bg-[#FFE500] border border-black" />
                      <Lock className="h-4 w-4 text-white/20" />
                   </div>
                </div>
                <div className="p-8 h-80 flex items-end gap-2 bg-black">
                   {Array.from({ length: 20 }).map((_, i) => (
                      <div 
                         key={i} 
                         style={{ height: `${20 + Math.random() * 80}%` }}
                         className="flex-1 bg-[#FFE500]/10 border-2 border-white/20 hover:bg-[#FFE500] hover:border-black transition-all cursor-crosshair group relative"
                      />
                   ))}
                </div>
                <div className="p-6 bg-zinc-950 border-t-4 border-white font-black text-[9px] text-white/30 uppercase text-center italic leading-relaxed tracking-wider">
                   Confidential volume data is collected using zk-proofs and FHE aggregation. Trade amounts are never leaked during calculation.
                </div>
             </div>

             <div className="flex flex-col justify-center space-y-10 lg:pl-10">
                <div className="space-y-6">
                   <div className="inline-flex items-center gap-2 bg-[#FFE500] text-black px-4 py-2 font-black uppercase text-[10px] tracking-widest italic border-2 border-black shadow-[4px_4px_0px_0px_white]">
                     <ShieldAlert className="w-4 h-4" /> System Health Good
                   </div>
                   <h3 className="text-4xl font-black uppercase leading-none tracking-tighter italic text-white flex flex-col gap-2">
                      <span>Protocol_</span>
                      <span className="text-[#FFE500]" style={{ WebkitTextStroke: '1px black' }}>Overview.</span>
                   </h3>
                   <p className="font-black text-white/40 uppercase tracking-tight text-base italic leading-relaxed border-l-4 border-[#FFE500] pl-8">
                      ShaDe-Fi is built on Zama. It uses hard math to keep your trades private. No one can see what you buy or sell.
                   </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {[
                     { icon: Globe, label: "Network Nodes", value: "62 Online" },
                     { icon: Database, label: "Data Size", value: "4.2 GB" },
                     { icon: Cpu, label: "Processing", value: "FHE Engine" },
                     { icon: Activity, label: "uptime", value: "100.00%" },
                   ].map((item, idx) => (
                     <div key={idx} className="flex items-center gap-4 p-6 border-4 border-white bg-black shadow-[6px_6px_0px_0px_#FFE500] group hover:bg-zinc-950 transition-all">
                        <item.icon className="h-8 w-8 text-[#FFE500]" />
                        <div>
                           <div className="font-black uppercase text-lg italic tracking-tighter leading-none mb-0.5 text-white">{item.value}</div>
                           <div className="font-black text-[9px] text-white/30 uppercase tracking-widest italic">{item.label}</div>
                        </div>
                     </div>
                   ))}
                </div>

                <div className="flex gap-6 items-center pt-4">
                   <button className="bg-[#FFE500] text-black px-10 py-6 font-black text-lg uppercase tracking-widest border-2 border-black shadow-[8px_8px_0px_0px_white] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all italic">
                      View Explorer
                   </button>
                   <div className="flex flex-col gap-0.5 italic text-white/20 font-black text-[10px] uppercase tracking-widest">
                      <span>V2.1 Mainnet Bridge</span>
                      <span className="flex items-center gap-2 text-[#FFE500]"><Zap className="w-3 h-3" /> Latency: 6s</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  )
}
