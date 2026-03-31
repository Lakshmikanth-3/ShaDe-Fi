"use client"

import { useState, useEffect, ReactNode } from "react"
import { Header } from "@/components/header"
import { ArrowDown, Settings, Lock, ShieldCheck, Zap, Activity, Loader2 } from "lucide-react"
import { useAccount, useReadContract, useWriteContract } from "wagmi"
import { encrypt64 } from "@/lib/fhevm"
import { ROUTER_ADDRESS, TOKENS } from "@/lib/constants"
import { ERC20_ABI, SHADE_ROUTER_ABI } from "@/lib/contracts"
import { toast } from "sonner"
import { formatUnits } from "viem"

function ClientOnly({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null
  return <>{children}</>
}

export default function SwapPage() {
  const { address, isConnected } = useAccount()
  const { writeContractAsync, isPending: isWritePending } = useWriteContract()

  const [amountIn, setAmountIn] = useState("")
  const [tokenIn, setTokenIn] = useState("USDC")
  const [tokenOut, setTokenOut] = useState("WETH")
  const [isSwapping, setIsSwapping] = useState(false)
  const [isEncrypting, setIsEncrypting] = useState(false)
  const [amountOut, setAmountOut] = useState<string | null>(null)

  const tokenInAddress = TOKENS[tokenIn as keyof typeof TOKENS] as `0x${string}`
  const tokenOutAddress = TOKENS[tokenOut as keyof typeof TOKENS] as `0x${string}`

  const { data: balanceData, refetch: refetchBalance } = useReadContract({
    address: tokenInAddress,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address && !!tokenInAddress },
  })

  const { data: allowanceData, refetch: refetchAllowance } = useReadContract({
    address: tokenInAddress,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: address ? [address, ROUTER_ADDRESS] : undefined,
    query: { enabled: !!address && !!tokenInAddress },
  })

  useEffect(() => {
    if (amountIn && !isNaN(Number(amountIn))) {
      const rate = tokenIn === 'USDC' ? 0.0048 : 2083.33
      setAmountOut((Number(amountIn) * rate).toFixed(6))
    } else {
      setAmountOut(null)
    }
  }, [amountIn, tokenIn])

  const handleSwap = async () => {
    if (!address || !tokenInAddress || !tokenOutAddress || !amountIn) return
    setIsSwapping(true)

    try {
      const amountRaw = BigInt(Math.floor(Number(amountIn) * (tokenIn === 'USDC' ? 1e6 : 1e18)))
      const allowance = allowanceData ? BigInt(allowanceData) : 0n
      if (allowance < amountRaw) {
        toast.info("Step 1: Approving Token...")
        await writeContractAsync({
          address: tokenInAddress,
          abi: ERC20_ABI,
          functionName: "approve",
          args: [ROUTER_ADDRESS, 18446744073709551615n],
        })
        await refetchAllowance()
      }

      setIsEncrypting(true)
      toast.info("Step 2: Hiding Trade Details...")
      const { handle, proof } = await encrypt64(amountRaw, ROUTER_ADDRESS, address)
      setIsEncrypting(false)

      toast.info("Step 3: Sending Trade To Chain...")
      await writeContractAsync({
        address: ROUTER_ADDRESS,
        abi: SHADE_ROUTER_ABI,
        functionName: "swap",
        args: [tokenInAddress, tokenOutAddress, handle, proof],
      })

      toast.success("Trade successful!")
      setAmountIn("")
      await refetchBalance()
    } catch (e: any) {
      toast.error(e.message || "Something went wrong")
      setIsEncrypting(false)
    } finally {
      setIsSwapping(false)
    }
  }

  const formattedBalance = balanceData ? formatUnits(balanceData as bigint, tokenIn === 'USDC' ? 6 : 18) : "0.00"

  return (
    <div className="flex min-h-screen flex-col bg-black text-white font-sans selection:bg-[#FFE500] selection:text-black">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center p-6 py-12 relative overflow-hidden text-center bg-black">
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none" 
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #FFE500 1px, transparent 0)', backgroundSize: '40px 40px' }} 
        />

        <div className="w-full max-w-[500px] relative z-10 font-bold italic">
          <div className="flex items-end justify-between mb-8">
            <div className="space-y-1 text-left">
               <span className="font-mono text-[#FFE500] text-[10px] font-black uppercase tracking-widest italic flex items-center gap-2">
                 <ShieldCheck className="w-3 h-3" /> Private Trade
               </span>
               <h1 className="text-6xl font-black uppercase tracking-tighter italic leading-none text-white">Swap.</h1>
            </div>
          </div>

          <div className="border-4 border-white bg-black p-0.5 shadow-[12px_12px_0px_0px_white] mb-10 overflow-hidden">
             <div className="p-8 border-b-2 border-white/10 bg-zinc-950 text-left">
                <div className="flex justify-between items-center mb-4">
                  <label className="text-[10px] font-black italic text-white/40 uppercase tracking-widest">Sell</label>
                  <span className="text-[10px] font-black italic text-[#FFE500] uppercase tracking-widest">
                    Balance: {formattedBalance} {tokenIn}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <input 
                    type="number" 
                    placeholder="0.0"
                    value={amountIn}
                    onChange={(e) => setAmountIn(e.target.value)}
                    disabled={isSwapping || isWritePending}
                    className="flex-1 bg-transparent border-none text-4xl font-black focus:ring-0 placeholder:text-white/10 italic text-white outline-none"
                  />
                  <div className="flex items-center gap-3 bg-white border-2 border-black px-4 py-3 font-black text-black shadow-[4px_4px_0px_0px_#FFE500] italic">
                    <div className="w-6 h-6 bg-[#FFE500] border border-black" />
                    {tokenIn}
                  </div>
                </div>
             </div>

             <div className="flex justify-center -my-6 relative z-20">
                <button 
                  onClick={() => {
                    setTokenIn(tokenOut); setTokenOut(tokenIn); setAmountIn("");
                  }}
                  className="bg-[#FFE500] text-black p-4 border-4 border-black hover:bg-white transition-all shadow-[6px_6px_0px_0px_white]"
                >
                  <ArrowDown className="h-6 w-6 stroke-[3px]" />
                </button>
             </div>

             <div className="p-8 bg-black text-left">
                <div className="flex justify-between items-center mb-4">
                  <label className="text-[10px] font-black italic text-white/40 uppercase tracking-widest font-black">Buy</label>
                  <span className="text-[10px] font-black italic text-[#FFE500] uppercase tracking-widest flex items-center gap-2">
                    <Lock className="h-3 w-3" /> Encrypted
                  </span>
                </div>
                <div className="flex items-center gap-4">
                   <div className="flex-1 text-4xl font-black tracking-tighter italic">
                      <span className={amountOut ? 'text-white' : 'text-white/10'}>{amountOut || '0.0'}</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white border-2 border-black px-4 py-3 font-black text-black shadow-[4px_4px_0px_0px_#FFE500] italic">
                    <div className="w-6 h-6 bg-black border border-[#FFE500]" />
                    {tokenOut}
                  </div>
                </div>
             </div>
          </div>

          <div className="space-y-3 px-2 mb-10 text-left font-black italic">
            <div className="flex justify-between text-[11px] font-black uppercase tracking-widest py-3 border-b-2 border-white/5 italic">
              <span className="text-white/30">Price Impact</span>
              <span className="text-[#FFE500]">None (Shielded)</span>
            </div>
             <div className="flex justify-between text-[11px] font-black uppercase tracking-widest py-3 border-b-2 border-white/5 italic">
              <span className="text-white/30">Privacy Engine</span>
              <span className="text-white flex items-center gap-2 font-black">Zama fhEVM <ShieldCheck className="h-3 w-3" /></span>
            </div>
          </div>

          <button 
            onClick={handleSwap}
            disabled={!amountIn || isSwapping || isEncrypting || isWritePending}
            className="w-full bg-[#FFE500] text-black text-2xl font-black uppercase py-6 border-4 border-black shadow-[10px_10px_0px_0px_white] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-4 italic disabled:opacity-50"
          >
            {isSwapping || isEncrypting || isWritePending ? (
              <span className="flex items-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin text-black" /> 
                {isEncrypting ? "Shielding Details..." : "Executing Trade..."}
              </span>
            ) : (
              <ClientOnly>
                {isConnected ? "Confirm Swap" : "Connect Wallet"}
              </ClientOnly>
            )}
          </button>
          
          <div className="mt-12 p-8 bg-zinc-950 border-4 border-white text-left rotate-1">
             <div className="flex gap-6 items-start">
                <Zap className="h-10 w-10 text-[#FFE500] shrink-0" />
                <div className="space-y-2 font-black italic">
                  <h4 className="text-lg font-black uppercase italic">Safe Trading</h4>
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-tight leading-relaxed italic">
                    Your trade is processed entirely in the encrypted state. No one can see your trade values, preventing bots from front-running you.
                  </p>
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  )
}
