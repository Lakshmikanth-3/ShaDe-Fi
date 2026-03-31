"use client"

import { useState, useEffect, ReactNode } from "react"
import { Header } from "@/components/header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Plus, Lock, Activity, Zap, Loader2 } from "lucide-react"
import { useAccount, useWriteContract } from "wagmi"
import { encrypt64 } from "@/lib/fhevm"
import { ERC20_ABI, SHADE_ROUTER_ABI } from "@/lib/contracts"
import { ROUTER_ADDRESS, TOKENS } from "@/lib/constants"
import { toast } from "sonner"

function ClientOnly({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null
  return <>{children}</>
}

export default function PoolPage() {
  const { isConnected, address } = useAccount()
  const { writeContractAsync, isPending } = useWriteContract()

  const [amountA, setAmountA] = useState("")
  const [amountB, setAmountB] = useState("")
  const [isProviding, setIsProviding] = useState(false)
  const [isEncrypting, setIsEncrypting] = useState(false)

  const tokenA = TOKENS.USDC
  const tokenB = TOKENS.WETH

  const pools = [
    { pair: "WETH / USDC", liquidity: "Private", volume: "$142,000", apr: "12.4%" },
    { pair: "WBTC / WETH", liquidity: "Private", volume: "$89,000", apr: "18.2%" },
  ]

  const handleAddLiquidity = async () => {
    if (!address || !amountA || !amountB) return
    setIsProviding(true)

    try {
      const rawA = BigInt(Math.floor(parseFloat(amountA) * 1e6))
      const rawB = BigInt(Math.floor(parseFloat(amountB) * 1e18))

      toast.info("Approving first token...")
      await writeContractAsync({
        address: tokenA as `0x${string}`,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [ROUTER_ADDRESS, 18446744073709551615n],
      })
      
      toast.info("Approving second token...")
      await writeContractAsync({
        address: tokenB as `0x${string}`,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [ROUTER_ADDRESS, 18446744073709551615n],
      })

      setIsEncrypting(true)
      toast.info("Protecting your strategy...")
      const encA = await encrypt64(rawA, ROUTER_ADDRESS, address)
      const encB = await encrypt64(rawB, ROUTER_ADDRESS, address)
      setIsEncrypting(false)

      toast.info("Adding liquidity...")
      await writeContractAsync({
        address: ROUTER_ADDRESS,
        abi: SHADE_ROUTER_ABI,
        functionName: "addLiquidity",
        args: [tokenA, tokenB, encA.handle, encA.proof, encB.handle, encB.proof],
      })

      toast.success("Done! Your liquidity is now active.")
      setAmountA(""); setAmountB("");
    } catch (e: any) {
      toast.error(e.message || "Action failed")
      setIsEncrypting(false)
    } finally {
      setIsProviding(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-black text-white selection:bg-[#FFE500] font-sans text-center">
      <Header />
      
      <main className="flex-1 flex flex-col items-center p-6 py-12 relative overflow-hidden bg-black font-bold italic">
        <div 
          className="absolute inset-0 opacity-[0.02] pointer-events-none" 
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #FFE500 1px, transparent 0)', backgroundSize: '40px 40px' }} 
        />

        <div className="w-full max-w-[1200px] relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8 border-b-4 border-white/10 pb-10 text-left">
            <div className="space-y-3">
               <span className="font-mono text-[#FFE500] text-[10px] font-black uppercase tracking-widest italic flex items-center gap-2">
                 <Shield className="w-3 h-3" /> Secure Liquidity
               </span>
               <h1 className="text-7xl font-black uppercase tracking-tighter italic leading-none">Pools.</h1>
               <p className="text-white/50 text-[11px] uppercase tracking-wide mt-4 italic max-w-lg leading-relaxed">
                 Provide liquidity without exposing your trade volumes. Your position is shielded using fhEVM encryption.
               </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6 bg-zinc-950 border-4 border-white p-8 shadow-[10px_10px_0px_0px_#FFE500] rotate-1">
               <div className="space-y-1">
                  <div className="text-[10px] uppercase text-white/30 tracking-widest">Global Status</div>
                  <div className="text-xl font-black text-[#FFE500] italic leading-none">Encrypted</div>
               </div>
               <div className="space-y-1 border-l-2 border-white/10 pl-6">
                  <div className="text-[10px] uppercase text-white/30 tracking-widest">Platform Fee</div>
                  <div className="text-xl font-black text-white italic leading-none">0.05%</div>
               </div>
            </div>
          </div>

          <div className="grid gap-12 lg:grid-cols-12 items-start text-left">
             <div className="lg:col-span-12 xl:col-span-8 space-y-10">
                <h2 className="text-2xl font-black uppercase tracking-tighter italic border-b-2 border-[#FFE500] pb-1 inline-block">Active Pools</h2>

                <div className="grid gap-6">
                  {pools.map((pool, i) => (
                    <div key={i} className="bg-black border-4 border-white p-8 shadow-[6px_6px_0px_0px_white] hover:shadow-[10px_10px_0px_0px_#FFE500] transition-all group overflow-hidden">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
                        <div className="space-y-1">
                          <span className="text-[10px] text-white/30 uppercase tracking-widest">Asset Pair</span>
                          <div className="font-black text-xl italic tracking-tighter text-white">{pool.pair}</div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] text-white/30 uppercase tracking-widest">Privacy</span>
                          <div className="font-black text-lg text-[#FFE500] italic">{pool.liquidity}</div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] text-white/30 uppercase tracking-widest">Volume (24h)</span>
                          <div className="font-black text-lg text-white italic">{pool.volume}</div>
                        </div>
                        <div className="flex justify-end gap-4">
                           <button className="w-12 h-12 bg-white text-black border-2 border-black flex items-center justify-center hover:bg-[#FFE500] transition-all shadow-[4px_4px_0px_0px_#FFE500]"><Plus className="h-5 w-5 stroke-[3px]" /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
             </div>

             <div className="lg:col-span-12 xl:col-span-4 lg:mt-8 xl:mt-0 xl:sticky xl:top-32">
                <div className="bg-black border-4 border-white shadow-[12px_12px_0px_0px_#FFE500] rotate-1 overflow-hidden">
                   <Tabs defaultValue="add" className="w-full">
                      <TabsList className="w-full grid grid-cols-2 rounded-none p-0 h-14 border-b-2 border-white bg-zinc-950 font-black italic">
                         <TabsTrigger value="add" className="uppercase h-full data-[state=active]:bg-[#FFE500] data-[state=active]:text-black">Add</TabsTrigger>
                         <TabsTrigger value="remove" className="uppercase h-full data-[state=active]:bg-white data-[state=active]:text-black border-l-2 border-white text-white/30 pb-0.5">Remove</TabsTrigger>
                      </TabsList>
                      
                      <div className="p-8 text-left">
                        <TabsContent value="add" className="space-y-8 mt-0">
                           <div className="space-y-3">
                              <label className="text-[10px] text-white/30 uppercase tracking-widest italic">First Asset</label>
                              <div className="flex border-2 border-white bg-zinc-950 p-4 items-center gap-4 shadow-[4px_4px_0px_0px_white]">
                                 <input type="number" value={amountA} onChange={(e) => setAmountA(e.target.value)} disabled={isProviding || isPending} placeholder="0.0" className="bg-transparent border-none focus:ring-0 text-3xl font-black italic flex-1 text-white outline-none" />
                                 <span className="font-black text-lg italic tracking-tighter text-[#FFE500]">shUSDC</span>
                              </div>
                           </div>
                           <div className="space-y-3">
                              <label className="text-[10px] text-white/30 uppercase tracking-widest italic">Second Asset</label>
                              <div className="flex border-2 border-white bg-zinc-950 p-4 items-center gap-4 shadow-[4px_4px_0px_0px_white]">
                                 <input type="number" value={amountB} onChange={(e) => setAmountB(e.target.value)} disabled={isProviding || isPending} placeholder="0.0" className="bg-transparent border-none focus:ring-0 text-3xl font-black italic flex-1 text-white outline-none" />
                                 <span className="font-black text-lg italic tracking-tighter text-[#FFE500]">shETH</span>
                              </div>
                           </div>
                           
                           <button onClick={handleAddLiquidity} disabled={!isConnected || isProviding || isPending} className="w-full bg-[#FFE500] text-black font-black py-6 text-xl uppercase italic border-4 border-black shadow-[8px_8px_0px_0px_white] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50">
                              {isProviding || isEncrypting ? <Loader2 className="h-6 w-6 animate-spin text-black" /> : "Add Liquidity"}
                           </button>
                        </TabsContent>
                      </div>
                   </Tabs>
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  )
}
