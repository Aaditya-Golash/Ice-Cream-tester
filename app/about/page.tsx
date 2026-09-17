/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-[100dvh] w-full bg-[#1c0c2e] text-[#fff9f2] font-['Plus_Jakarta_Sans',sans-serif]">
      <main className="flex flex-col min-h-[100dvh] px-6 py-10 max-w-md mx-auto">
        
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

          {/* BOX 1: The Story & The Palate */}
          <div className="bg-[#2b104c] border-4 border-black rounded-3xl p-6 shadow-[0_8px_0px_#000] space-y-4 text-sm font-medium leading-relaxed text-[#fff8ec]">
            <p className="text-xs font-black tracking-widest uppercase text-[#ff7b00] mb-1">The Palate</p>
            <p>
              I used to be incredibly unhealthy. I completely turned my life around and built a strict fitness routine. Most people give up their favorite treats when they get healthy. I refused to drop ice cream. I simply learned how to taste it with intention.
            </p>
            <p>
              I grew up in India and spent time traveling across the Middle East before finally moving to Canada. Experiencing so many different cultures totally rewired my palate. My personal rotation reflects that journey. I reach for Rose Mango Kulfi for pure childhood nostalgia. I grab rich dark chocolate brownie when I need a heavy late night snack. I pick strawberry cheesecake for the perfect salty and sweet balance.
            </p>
            <p>
              That mixed background inspired my signature pitch. Cutting Chai Kulfi blends masala chai ice cream with brown butter shortbread and a salted date caramel ribbon. 
            </p>
          </div>

          {/* BOX 2: The Systems & The Pitch */}
          <div className="bg-[#ffde59] text-black border-4 border-black rounded-3xl p-6 shadow-[0_8px_0px_#000] space-y-4 text-sm font-bold leading-relaxed">
            <p className="text-xs font-black tracking-widest uppercase text-[#a83758] mb-1">The Playbook</p>
            <p>
              I just graduated from UBC with a Computer Science major and a Management minor. I spent my time managing club finances and engineering complex software systems. I also grew digital social channels to millions of organic views. I understand exactly what makes an audience stop scrolling.
            </p>
            <p>
              I build systems to remove friction from daily life. Right now the biggest friction is deciding exactly what pint you crave at midnight. I built this match engine to solve that problem. Tasting is about analyzing the culture of flavor and spotting trends before they peak.
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
    </div>
  );
}
