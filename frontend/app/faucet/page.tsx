"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Zap, Activity, ShieldAlert, Loader2 } from "lucide-react"
import { useAccount, useWriteContract } from "wagmi"
import { ERC20_ABI } from "@/lib/contracts"
import { TOKENS } from "@/lib/constants"
import { toast } from "sonner"

export default function FaucetPage() {
  const { address, isConnected } = useAccount()
  const { writeContractAsync } = useWriteContract()
  const [usdcPending, setUsdcPending] = useState(false)
  const [ethPending, setEthPending] = useState(false)

  const handleMintUsdc = async () => {
    if (!address) return toast.error("Please connect your wallet")
    setUsdcPending(true)
    try {
      await writeContractAsync({
        address: TOKENS.USDC as `0x${string}`,
        abi: ERC20_ABI,
        functionName: "mint",
        args: [address, BigInt(1000e6)],
      })
      toast.success("1,000 shUSDC added to your wallet!")
    } catch (e: any) {
      toast.error(e.message || "Minting failed")
    } finally {
      setUsdcPending(false)
    }
  }

  const handleMintEth = async () => {
    if (!address) return toast.error("Please connect your wallet")
    setEthPending(true)
    try {
      await writeContractAsync({
        address: TOKENS.WETH as `0x${string}`,
        abi: ERC20_ABI,
        functionName: "mint",
        args: [address, BigInt(1e18)],
      })
      toast.success("1.0 shETH added to your wallet!")
    } catch (e: any) {
      toast.error(e.message || "Minting failed")
    } finally {
      setEthPending(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-black text-white font-sans selection:bg-[#FFE500] selection:text-black">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center p-6 py-12 relative overflow-hidden bg-black font-bold italic">
        <div 
          className="absolute inset-0 opacity-[0.02] pointer-events-none" 
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #FFE500 1px, transparent 0)', backgroundSize: '40px 40px' }} 
        />

        <div className="w-full max-w-[600px] relative z-10">
          <div className="space-y-4 mb-20 text-left border-b-4 border-white/10 pb-10">
             <span className="font-mono text-[#FFE500] text-[10px] font-black uppercase tracking-widest italic flex items-center gap-2">
               <Activity className="w-3 h-3" /> FHE Liquidity System
             </span>
             <h1 className="text-7xl font-black uppercase tracking-tighter italic leading-none">Faucet.</h1>
             <p className="text-white/50 text-[11px] uppercase tracking-wide mt-8 italic max-w-lg leading-relaxed underline decoration-2 decoration-[#FFE500] underline-offset-4">
               Get free test tokens to try out the private exchange. These tokens have no real value and are only for testing the app.
             </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 text-left">
             <div className="bg-black border-4 border-white p-0.5 shadow-[12px_12px_0px_0px_#FFE500] rotate-1">
                <div className="bg-zinc-950 p-8 border-2 border-white flex flex-col h-full">
                   <div className="space-y-3 flex-1">
                      <div className="text-[9px] font-black uppercase text-white/30 tracking-widest italic border-b border-white/10 pb-3">Test Token</div>
                      <div className="text-4xl font-black italic tracking-tighter uppercase text-white">shUSDC</div>
                      <p className="text-[10px] text-white/40 uppercase tracking-tight italic">Confidential Stablecoin</p>
                   </div>
                   
                   <button 
                     onClick={handleMintUsdc}
                     disabled={usdcPending}
                     className="w-full bg-[#FFE500] text-black font-black py-5 text-lg mt-10 border-2 border-black shadow-[4px_4px_0px_0px_white] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                   >
                     {usdcPending ? <Loader2 className="animate-spin h-6 w-6 text-black" /> : "Mint 1000 USDC"}
                   </button>
                </div>
             </div>

             <div className="bg-black border-4 border-white p-0.5 shadow-[12px_12px_0px_0px_white] -rotate-1">
                <div className="bg-zinc-950 p-8 border-2 border-white flex flex-col h-full">
                   <div className="space-y-3 flex-1">
                      <div className="text-[9px] font-black uppercase text-white/30 tracking-widest italic border-b border-white/10 pb-3">Test Token</div>
                      <div className="text-4xl font-black italic tracking-tighter uppercase text-white">shETH</div>
                      <p className="text-[10px] text-white/40 uppercase tracking-tight italic">Confidential Ethereum</p>
                   </div>
                   
                   <button 
                     onClick={handleMintEth}
                     disabled={ethPending}
                     className="w-full bg-white text-black font-black py-5 text-lg mt-10 border-2 border-black shadow-[4px_4px_0px_0px_#FFE500] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                   >
                     {ethPending ? <Loader2 className="animate-spin h-6 w-6 text-black" /> : "Mint 1.0 ETH"}
                   </button>
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  )
}
