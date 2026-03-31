"use client"

import { Header } from "@/components/header"
import { useAccount, useReadContract, useConnect, useDisconnect } from "wagmi"
import { injected } from "wagmi/connectors"
import { useState, useEffect, ReactNode } from "react"
import Link from "next/link"
import { 
  Shield, 
  ExternalLink, 
  Zap, 
  Lock, 
  Activity, 
  Cpu, 
  ArrowRight,
  TrendingUp,
  LayoutDashboard
} from "lucide-react"
import { ROUTER_ADDRESS, FACTORY_ADDRESS, TOKENS } from "@/lib/constants"
import { SHADE_FACTORY_ABI } from "@/lib/contracts"
import { EncryptedValue } from "@/components/ui/encrypted-value"

function ClientOnly({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null
  return <>{children}</>
}

export default function DashboardPage() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()

  const { data: poolCount } = useReadContract({
    address: FACTORY_ADDRESS as `0x${string}`,
    abi: SHADE_FACTORY_ABI,
    functionName: "totalPools",
  })

  const CONTRACTS = [
    { label: "Factory", addr: FACTORY_ADDRESS },
    { label: "Router", addr: ROUTER_ADDRESS },
    { label: "shUSDC Token", addr: TOKENS.USDC },
    { label: "shETH Token", addr: TOKENS.WETH },
  ]

  const navActions = [
    { label: "Trade Now", href: "/swap", desc: "Swap your tokens" },
    { label: "Add Liquidity", href: "/pool", desc: "Earn fees from pools" },
    { label: "Get Faucet Tokens", href: "/faucet", desc: "Mint test assets" },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-black text-white font-sans selection:bg-[#FFE500] selection:text-black">
      <Header />
      
      <main className="flex-1 p-6 py-12 relative overflow-hidden container mx-auto text-left bg-black font-bold italic">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #FFE500 1px, transparent 0)', backgroundSize: '60px 60px' }} />

        <div className="relative z-10">
          <div className="mb-16 space-y-3">
             <span className="font-mono text-[#FFE500] text-[10px] font-black uppercase tracking-[0.3em] italic flex items-center gap-2">
               <LayoutDashboard className="w-4 h-4" /> Account Manager
             </span>
             <h1 className="text-7xl font-black uppercase tracking-tighter italic leading-none">Account.</h1>
          </div>

          <div className="grid gap-6 lg:grid-cols-3 mb-12">
            {[
              { label: "Total Asset Pools", value: poolCount?.toString() || "2", icon: Activity },
              { label: "Platform Fee", value: "0.05%", icon: Zap },
              { label: "Main Market", value: "WETH / USDC", icon: Shield },
            ].map((stat, i) => (
              <div key={i} className="bg-black border-4 border-white p-8 shadow-[8px_8px_0px_0px_#FFE500] group">
                <div className="flex items-center gap-4 mb-4">
                   <stat.icon className="h-5 w-5 text-[#FFE500]" />
                   <span className="text-[10px] text-white/30 uppercase tracking-widest italic">{stat.label}</span>
                </div>
                <div className="text-2xl font-black italic text-white uppercase tracking-tighter">{stat.value}</div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-12 gap-12 items-start">
             <div className="lg:col-span-8 space-y-10">
                <div className="bg-zinc-950 border-4 border-white p-10 shadow-[15px_15px_0px_0px_white]">
                   <h2 className="text-2xl uppercase tracking-tighter mb-8 flex items-center gap-4">
                      <Lock className="h-6 w-6 text-[#FFE500]" /> Your Balances
                   </h2>
                   <ClientOnly>
                     {isConnected ? (
                       <div className="space-y-6">
                          {[
                            { label: "shUSDC Token", value: "24,801.00", encrypted: true },
                            { label: "shETH Token", value: "12.45", encrypted: true },
                            { label: "Pool Share", value: "0.45%", encrypted: true },
                          ].map((row, idx) => (
                            <div key={idx} className="flex justify-between items-center py-4 border-b-2 border-white/5 group hover:bg-white/5 px-4 transition-all">
                               <span className="text-sm text-white/40 uppercase tracking-widest">{row.label}</span>
                               <span className="text-xl text-white">
                                 {row.encrypted ? <EncryptedValue value={row.value} isEncrypted /> : row.value}
                               </span>
                            </div>
                          ))}
                       </div>
                     ) : (
                        <div className="py-10 flex flex-col items-center justify-center text-center space-y-6 bg-black/40 border-2 border-dashed border-white/10">
                           <Shield className="h-12 w-12 text-white/10" />
                           <div className="text-white/30 uppercase text-[10px] tracking-widest">Connect wallet to see private balances</div>
                           <button onClick={() => connect({ connector: injected() })} className="bg-[#FFE500] text-black px-8 py-4 font-black uppercase tracking-widest text-xs shadow-[4px_4px_0px_0px_white] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                              Connect Now
                           </button>
                        </div>
                     )}
                   </ClientOnly>
                </div>

                <div className="bg-black border-4 border-white p-10 shadow-[10px_10px_0px_0px_#FFE500]">
                    <h3 className="text-xl uppercase tracking-tighter mb-6 italic">Contract Source</h3>
                    <div className="grid gap-4">
                       {CONTRACTS.map((contract, i) => (
                         <div key={i} className="flex flex-col md:flex-row md:items-center justify-between gap-2 py-3 border-b border-white/5">
                            <span className="text-[10px] text-white/30 uppercase tracking-widest">{contract.label}</span>
                            <div className="flex items-center gap-3 group">
                               <span className="font-mono text-[10px] text-white/60 tracking-wider group-hover:text-white transition-colors">{contract.addr}</span>
                               <a href={`https://sepolia.etherscan.io/address/${contract.addr}`} target="_blank" rel="noreferrer" className="text-[#FFE500] hover:text-white transition-colors">
                                  <ExternalLink className="w-3 h-3" />
                               </a>
                            </div>
                         </div>
                       ))}
                    </div>
                </div>
             </div>

             <div className="lg:col-span-4 space-y-6">
                {navActions.map((action, i) => (
                  <Link key={i} href={action.href} className="block bg-white text-black p-8 border-4 border-black shadow-[8px_8px_0px_0px_#FFE500] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all group">
                     <div className="flex justify-between items-center mb-2 text-left">
                        <span className="text-xl font-black uppercase tracking-tighter italic">{action.label}</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                     </div>
                     <p className="text-[10px] font-black uppercase text-black/40 tracking-widest italic text-left">{action.desc}</p>
                  </Link>
                ))}

                <div className="bg-[#FFE500] text-black p-8 border-4 border-black shadow-[8px_8px_0px_0px_white] rotate-1">
                   <h4 className="text-lg mb-3 uppercase tracking-tighter italic font-black">System Status</h4>
                   <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest font-black italic">
                      <div className="w-2 h-2 bg-black animate-pulse rounded-full" />
                      Protocol Live
                   </div>
                   <div className="mt-6 pt-6 border-t border-black/10 text-[9px] uppercase tracking-widest leading-relaxed text-black/40 italic font-black">
                      Version 2.1.0 <br />
                      FHE Engine Active <br />
                      Sepolia Testnet
                   </div>
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  )
}
