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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/me-eating-ice-cream.jpg" 
            alt="Aaditya eating ice cream" 
            className="w-full h-auto rounded-3xl border-4 border-black shadow-[0_8px_0px_#000] object-cover transform -rotate-2"
          />
        </div>

        <div className="bg-[#2b104c] border-4 border-black rounded-3xl p-6 shadow-[0_8px_0px_#000] space-y-4 text-sm font-medium leading-relaxed text-[#fff8ec]">
          <p>
            I just wrapped up a Computer Science degree with a Management minor at UBC. I have managed budgets as a VP of Finance and engineered full-stack software systems. But this is not a standard tech portfolio.
          </p>
          <p>
            Growing up between India and the Middle East before moving to Canada completely rewired my palate. I know how to spot global trends, and I know how to mix cultural profiles that actually work on a spoon. 
          </p>
          <p>
            I have also built and grown digital channels to millions of organic views. I understand the difference between what people say they want and what actually makes them stop scrolling. 
          </p>
          <p>
            I build systems to solve friction. Right now, the friction is figuring out exactly what pint you need at 1 AM. The solution is this engine.
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
