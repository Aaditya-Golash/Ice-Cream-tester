/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-[100dvh] w-full bg-[#1c0c2e] text-[#fff9f2] font-['Plus_Jakarta_Sans',sans-serif]">
      <main className="flex flex-col min-h-[100dvh] px-6 py-10 max-w-lg mx-auto">
        
        <div className="pb-8">
          <Link href="/" className="text-xs uppercase font-black text-gray-400 flex items-center gap-1 hover:text-[#ff7b00] transition-colors">
            <ArrowLeft size={14} /> Back to the match engine
          </Link>
        </div>

        <div className="space-y-8 my-auto">
          <div>
            <span className="inline-block bg-[#ff7b00] text-black font-black uppercase text-xs tracking-widest px-4 py-1.5 rounded-full shadow-[0_4px_0px_#000] mb-4">
              The Applicant
            </span>
            <h1 className="text-5xl md:text-6xl font-black font-['Shrikhand',serif] text-[#ffde59] drop-shadow-[0_4px_0px_#ff4500] leading-tight">
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

          {/* SINGLE STORY CARD WITH INTERNAL TYPOGRAPHY HIERARCHY */}
          <div className="bg-[#2b104c] border-4 border-black rounded-3xl p-6 md:p-8 shadow-[0_8px_0px_#000] space-y-6 text-lg font-medium leading-snug text-[#fff8ec]">
            
            <p>
              I somehow managed to make ice cream a major part of my university career.
            </p>

            <p>
              At UBC Okanagan, I became <strong className="text-[#ffde59] font-black">VP Finance</strong> of one of the largest clubs on campus. It happened to be the Ice Cream Club. I managed its budget, tracked stock, and forecast inventory for our events. Around the same time, I was running a weekly campus food program and helping operate a food cart serving more than 150 students a week. I learned pretty quickly that loving food is the easy part. Getting the numbers, inventory, and experience right is what lets you share it with everyone else.
            </p>

            <div className="h-px w-12 bg-[#ff7b00] my-2"></div>

            <p>
              But my obsession with ice cream started long before UBC.
            </p>

            <p>
              I grew up in India, spent much of my life around the Middle East, and now call Canada home. Food has always been one of the easiest ways for me to carry those places with me. My freezer choices make that pretty obvious. <strong className="text-[#ffde59] font-black">Rose mango kulfi</strong> tastes like home. <strong className="text-[#ffde59] font-black">Dark chocolate brownie</strong> is my unapologetically rich pick. <strong className="text-[#ffde59] font-black">Strawberry cheesecake</strong> gives me the fruit, tang, creaminess, and texture I love all at once.
            </p>

            <p>
              My relationship with food changed too. I used to live a much less healthy lifestyle. When I got serious about fitness, I changed a lot about how I ate. Ice cream survived. I love it too much. Getting healthier did not make me stop enjoying food. It made me care more about the things I genuinely think are worth eating.
            </p>

            <div className="h-px w-12 bg-[#ff7b00] my-2"></div>

            <p>
              If I could put one of my own ideas in the freezer, it would be <strong className="text-[#ffde59] font-black">Cutting Chai Kulfi</strong>. Masala chai ice cream. Brown butter shortbread crumble. Salted date caramel. Those flavors come from things I actually grew up around, transformed into the kind of pint I would immediately want to try.
            </p>

            <p>
              Then there is the slightly nerdier side of me. I graduated with a <strong className="text-[#ffde59] font-black">Computer Science major</strong> and a Management minor at UBC. Today, I help oversee the allocation of more than <strong className="text-[#ffde59] font-black">$370,000 in annual funding</strong> across over 150 student organizations. I have built software, worked with data, managed budgets, and learned how to get people interested in an idea.
            </p>

            <div className="h-px w-12 bg-[#ff7b00] my-2"></div>

            <p>
              So I thought an ordinary application would be a little boring.
            </p>

            <p className="text-2xl font-black font-['Shrikhand',serif] text-[#ff7b00]">
              I built Find Ya Flava.
            </p>

            <p>
              It is part software project, part love letter to ice cream, and probably the clearest way I can show how I think. Give me a problem, some data, good food, and an excuse to make something people actually want to use, and I am in.
            </p>
          </div>

          <div className="space-y-4 pt-4">
            <a 
              href="https://www.tiktok.com/@aago844" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#ffde59] active:scale-95 transition-transform text-black font-black text-xl md:text-2xl py-5 rounded-2xl border-4 border-black shadow-[0_6px_0px_#000]"
            >
              WATCH THE AUDITION <ExternalLink size={24} />
            </a>
            
            <a 
              href="https://www.linkedin.com/in/aaditya-golash/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#ff7b00] active:scale-95 transition-transform text-black font-black text-xl md:text-2xl py-5 rounded-2xl border-4 border-black shadow-[0_6px_0px_#000]"
            >
              CONNECT ON LINKEDIN <ExternalLink size={24} />
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
