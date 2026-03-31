"use client"

import { ShieldCheck, Lock, Activity, Zap } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-20 overflow-hidden bg-black text-white font-bold">
      <div 
        className="absolute inset-0 opacity-5"
        style={{ 
          backgroundImage: 'radial-gradient(circle at 2px 2px, #FFE500 1px, transparent 0)',
          backgroundSize: '40px 40px' 
        }}
      />
      
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10 py-12">
        <div className="space-y-10">
          <div className="inline-flex items-center gap-3 bg-[#FFE500] text-black px-6 py-3 border-2 border-black shadow-[4px_4px_0px_0px_white] italic uppercase text-[10px] tracking-widest font-black">
            <Zap className="w-4 h-4" />
            <span>Zama fhEVM Powered</span>
          </div>

          <h1 className="text-7xl md:text-9xl font-black text-white tracking-tighter leading-[0.85] uppercase italic">
            SHADEFI <br />
            <span className="text-[#FFE500]">PROTOCOL_</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/70 font-bold leading-snug max-w-xl italic border-l-4 border-[#FFE500] pl-8 py-2 uppercase tracking-tight">
            The first private exchange on Ethereum. <br />
            <span className="text-white underline decoration-2 decoration-[#FFE500] underline-offset-4 font-black">No front-running. Ever.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-6 pt-4">
            <button 
              onClick={() => window.location.href = '/swap'}
              className="bg-[#FFE500] text-black px-10 py-5 text-xl font-black uppercase tracking-widest border-2 border-black shadow-[8px_8px_0px_0px_white] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all italic"
            >
              Start Trading
            </button>
            <button className="bg-black text-white px-10 py-5 text-xl font-black uppercase tracking-widest border-2 border-[#FFE500] hover:bg-[#FFE500] hover:text-black transition-all italic">
              View Stats
            </button>
          </div>
          
          <div className="flex items-center gap-10 pt-12 border-t-2 border-white/10">
             <div className="space-y-1">
                <div className="text-[10px] font-black uppercase text-white/30 tracking-widest">Privacy level</div>
                <div className="font-black text-xl text-[#FFE500] italic">100% Shielded</div>
             </div>
             <div className="space-y-1">
                <div className="text-[10px] font-black uppercase text-white/30 tracking-widest">Trade Speed</div>
                <div className="font-black text-xl text-white italic">~6.0 Seconds</div>
             </div>
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div className="w-[450px] h-[550px] bg-black border-4 border-[#FFE500] shadow-[20px_20px_0px_0px_white] p-10 flex flex-col justify-between relative">
             <div className="flex justify-between items-start">
                <div className="bg-[#FFE500] p-3 border-2 border-black">
                   <Lock className="w-8 h-8 text-black" />
                </div>
                <div className="text-right">
                   <div className="font-mono text-[9px] font-black text-[#FFE500] uppercase tracking-widest">System Status: Active</div>
                   <div className="font-mono text-[7px] font-black text-white/20 uppercase tracking-[0.2em] mt-1">v2.1_Zama_Core</div>
                </div>
             </div>

             <div className="space-y-8">
                <div className="space-y-2">
                   <div className="text-[9px] font-black uppercase tracking-widest text-white/40 italic">Public view</div>
                   <div className="text-3xl font-black text-white/10 italic line-through tracking-tighter uppercase decoration-4">Vulnerable State</div>
                </div>
                <div className="space-y-2 bg-[#FFE500]/5 p-6 border-2 border-[#FFE500] shadow-[6px_6px_0px_0px_white]">
                   <div className="text-[9px] font-black uppercase tracking-widest text-[#FFE500] italic">Confidential State</div>
                   <div className="text-2xl font-black text-white italic tracking-tighter">0x4F7A...22E1</div>
                </div>
             </div>

             <div className="space-y-4 pt-6 border-t-2 border-white/5">
                <div className="flex items-center gap-4">
                   <div className="w-3 h-3 bg-[#FFE500] border border-black animate-pulse" />
                   <div className="font-mono text-[9px] font-black text-white uppercase tracking-widest italic">Encrypted Logic Running</div>
                </div>
                <div className="h-2 bg-white/5 w-full relative">
                    <div className="h-full bg-[#FFE500] w-1/3" />
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  )
}
