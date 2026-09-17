/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="flex flex-col min-h-[100dvh] px-6 py-10 max-w-md mx-auto bg-[#1c0c2e] text-[#fff9f2] font-['Plus_Jakarta_Sans',sans-serif]">
      
      <div className="pb-8">
        <Link href="/" className="text-xs uppercase font-black text-gray-400 flex items-center gap-1 hover:text-[#ff7b00] transition-colors">
          <ArrowLeft size={14} /> Back to the match engine
        </Link>
      </div>

      <div className="space-y-6 my-auto">
        <div>
          <span className="inline-block bg-[#ff7b00] text-black font-black uppercase text-xs tracking-widest px-4 py-1.5 rounded-full shadow-[0_4px_0px_#000] mb-4">
            The Applicant
          </span>
          <h1 className="text-5xl font-black font-['Shrikhand',serif] text-[#ffde59] drop-shadow-[0_4px_0px_#ff4500] leading-tight">
            AADITYA GOLASH
          </h1>
        </div>

        <div className="w-full">
          <img 
            src="/me-eating-ice-cream.jpg" 
            alt="Aaditya eating ice cream" 
            className="w-full h-auto rounded-3xl border-4 border-black shadow-[0_8px_0px_#000] object-cover transform -rotate-2"
          />
        </div>

        {/* BOX 1: The Palate & Story */}
        <div className="bg-[#2b104c] border-4 border-black rounded-3xl p-6 shadow-[0_8px_0px_#000] space-y-4 text-sm font-medium leading-relaxed text-[#fff8ec]">
          <p className="text-xs font-black tracking-widest uppercase text-[#ff7b00] mb-1">The Palate</p>
          <p>
            Growing up between India and the Middle East before moving to Canada completely rewired my palate. It trained me to spot global trends and mix cultural profiles that actually work on a spoon. 
          </p>
          <p>
            My all-time rotation proves it: <strong>Rose Mango Kulfi</strong> for straight nostalgia, heavy <strong>Dark Chocolate Brownie</strong> when I need that late-night crunch, and <strong>Strawberry Cheesecake</strong> for the perfect salty-sweet balance. 
          </p>
          <p>
            I entered this search because tasting is not just about eating on camera. It is about analyzing the culture of flavor and knowing what hits before the cravings even start.
          </p>
        </div>

        {/* BOX 2: The Systems & Culture */}
        <div className="bg-[#ffde59] text-black border-4 border-black rounded-3xl p-6 shadow-[0_8px_0px_#000] space-y-4 text-sm font-bold leading-relaxed">
          <p className="text-xs font-black tracking-widest uppercase text-[#a83758] mb-1">The Playbook</p>
          <p>
            I just wrapped a CS degree and Management minor at UBC. I have managed budgets as a VP of Finance, engineered full-stack systems, and grown digital channels to millions of organic views. 
          </p>
          <p>
            I know the difference between what people say they want, and what actually makes them stop scrolling. I build systems to solve friction. Right now, the friction is figuring out exactly what pint you need at 1 AM. The solution is this engine.
          </p>
        </div>

        <div className="space-y-4 pt-4">
          <a 
            href="https://www.tiktok.com/@aago844" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-[#ffde59] active:scale-95 transition-transform text-black font-black text-lg py-4 rounded-2xl border-2 border-black shadow-[0_5px_0px_#000]"
          >
            WATCH THE AUDITION <ExternalLink size={18} />
          </a>
          
          <a 
            href="https://www.linkedin.com/in/aaditya-golash/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-[#ff7b00] active:scale-95 transition-transform text-black font-black text-lg py-4 rounded-2xl border-2 border-black shadow-[0_5px_0px_#000]"
          >
            CONNECT ON LINKEDIN <ExternalLink size={18} />
          </a>
        </div>
      </div>
    </main>
  );
}
