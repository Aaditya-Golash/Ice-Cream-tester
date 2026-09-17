'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Share2 } from 'lucide-react';

type View = 'landing' | 'quiz' | 'result';

const QUESTIONS = [
  {
    id: 1,
    title: "Current vibe right now?",
    metric: "State of mind",
    options: [
      { label: "Couch-locked in pure cloud mode", scoreTag: "chill" },
      { label: "Late night 1 AM corner store run", scoreTag: "munchies" },
      { label: "Backyard kickback with the crew", scoreTag: "social" },
      { label: "Studio grind, locked in", scoreTag: "focus" },
    ],
  },
  {
    id: 2,
    title: "Are we hunting for heavy crunch or smooth sailing?",
    metric: "Inclusions and texture",
    options: [
      { label: "Heavy mix-ins, crunch, and ribbons", scoreTag: "crunch" },
      { label: "Velvety smooth swirl with zero interruptions", scoreTag: "smooth" },
      { label: "Icy, crisp, and refreshing", scoreTag: "crisp" },
      { label: "Chewy bites and waffle cone pieces", scoreTag: "waffle" },
    ],
  },
  {
    id: 3,
    title: "Straight nostalgia or a wild remix?",
    metric: "Flavor complexity",
    options: [
      { label: "Sweet and salty classic remix", scoreTag: "sweet_salty" },
      { label: "Bright citrus and tropical punch", scoreTag: "tropical" },
      { label: "Bakery fresh comfort dessert", scoreTag: "bakery" },
      { label: "Old school ice pop truck memories", scoreTag: "nostalgia" },
    ],
  },
  {
    id: 4,
    title: "Level of munchie emergency?",
    metric: "Palate intensity",
    options: [
      { label: "Level 1: Just a clean, chill taste", scoreTag: "light" },
      { label: "Level 10: I will destroy this entire pint", scoreTag: "heavy" },
    ],
  },
];

const FLAVORS: Record<string, any> = {
  pbj: {
    name: "Peanut Butter Jelly Time",
    tagline: "The Nostalgic Heavyweight",
    verdict: "10/10 Munchie Destroyer. Thick peanut butter swirl cut with sweet grape jelly ribbons.",
    rating: "Post-Spark MVP",
  },
  sherbet: {
    name: "Tropical Sherbet Swizzle",
    tagline: "The Palate Reset",
    verdict: "Bright, icy, and tropical. Cleans the palate instantly when you need something cold.",
    rating: "Cloud Mode Staple",
  },
  orange: {
    name: "Iced Out Orange Cream",
    tagline: "Summer Street Remix",
    verdict: "Zesty orange citrus swirled straight through rich sweet cream. Absolute classic.",
    rating: "Late Night Go-To",
  },
  muffin: {
    name: "Baked Blueberry Muffin",
    tagline: "The Warm Bakery Classic",
    verdict: "Real muffin crumbles and blueberry swirls folded into sweet cream. Pure comfort food.",
    rating: "Couch Lock Gold",
  },
};

export default function FindYaFlava() {
  const [view, setView] = useState<View>('landing');
  const [step, setStep] = useState(0);
  const [matchKey, setMatchKey] = useState('pbj');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view, step]);

  const handleSelect = (scoreTag: string) => {
    if (step < QUESTIONS.length - 1) {
      setStep((prev) => prev + 1);
    } else {
      // Determine match based on final answer
      const finalKey = scoreTag === 'light' || scoreTag === 'crisp' ? 'sherbet' : 'pbj';
      setMatchKey(finalKey);
      setView('result');
    }
  };

  return (
    <div className="min-h-screen bg-[#1c0c2e] text-[#fff9f2] font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* LANDING */}
      {view === 'landing' && (
        <main className="flex flex-col min-h-[100dvh] px-6 py-10 justify-between max-w-md mx-auto text-center">
          <div>
            <span className="inline-block bg-[#ff7b00] text-black font-black uppercase text-xs tracking-widest px-4 py-1.5 rounded-full shadow-[0_4px_0px_#000]">
              Dr. Bombay Tastemaker Search
            </span>
          </div>
          <div className="my-auto space-y-4">
            <h1 className="text-5xl font-black font-['Shrikhand',serif] text-[#ffde59] drop-shadow-[0_4px_0px_#ff4500] leading-tight">
              FIND YA FLAVA
            </h1>
            <p className="text-lg font-bold text-[#fbcfe8] leading-snug">
              The real-time munchie match engine. Find your exact Dr. Bombay pint before the cravings take over.
            </p>
          </div>
          <div className="space-y-4 pb-4">
            <button
              onClick={() => { setView('quiz'); setStep(0); }}
              className="w-full flex items-center justify-center gap-2 bg-[#ff7b00] active:scale-95 transition-transform text-black font-black text-xl py-5 rounded-2xl shadow-[0_6px_0px_#000] border-2 border-black tracking-wide"
            >
              START THE TEST <ArrowRight size={20} />
            </button>
            <p className="text-[11px] text-gray-400 max-w-xs mx-auto leading-relaxed">
              Unofficial fan application project created by Aaditya G. for the Dr. Bombay search. Not affiliated with Bosslady Foods.
            </p>
          </div>
        </main>
      )}

      {/* QUIZ */}
      {view === 'quiz' && (
        <main className="flex flex-col min-h-[100dvh] px-6 py-8 justify-between max-w-md mx-auto">
          <div>
            <div className="flex justify-between text-[11px] font-black uppercase text-[#ffde59] tracking-wider mb-3">
              <span>Question {step + 1} of {QUESTIONS.length}</span>
              <span>{QUESTIONS[step].metric}</span>
            </div>
            <div className="w-full bg-black/40 h-3 rounded-full border border-black overflow-hidden p-0.5">
              <div
                className="bg-[#ff7b00] h-full rounded-full transition-all duration-300"
                style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>
          
          <div className="my-auto space-y-8">
            <h2 className="text-3xl font-black font-['Shrikhand',serif] text-center text-white drop-shadow-[0_2px_0px_#000] leading-tight">
              {QUESTIONS[step].title}
            </h2>
            <div className="space-y-3">
              {QUESTIONS[step].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(opt.scoreTag)}
                  className="w-full text-left bg-[#2b104c] active:bg-[#371661] active:scale-95 transition-all border-2 border-black p-5 rounded-2xl shadow-[0_5px_0px_#000] font-extrabold text-base text-[#fff9f2]"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="text-center pb-4">
            {step > 0 && (
              <button
                onClick={() => setStep((prev) => prev - 1)}
                className="text-xs uppercase font-black text-gray-400 flex items-center justify-center gap-1 mx-auto"
              >
                <ArrowLeft size={14} /> Go Back
              </button>
            )}
          </div>
        </main>
      )}

      {/* RESULT */}
      {view === 'result' && (
        <main className="flex flex-col min-h-[100dvh] px-6 py-8 justify-between max-w-md mx-auto text-center">
          <div>
            <span className="inline-block bg-[#ffde59] text-black font-black uppercase text-xs tracking-widest px-4 py-1 rounded-full border border-black shadow-[0_3px_0px_#000]">
              {FLAVORS[matchKey].rating}
            </span>
          </div>

          <div className="my-auto bg-[#2b104c] border-4 border-black rounded-3xl p-6 shadow-[0_8px_0px_#000] space-y-5">
            <p className="text-xs font-black tracking-widest uppercase text-[#ff7b00]">
              YOUR MUNCHIE MATCH
            </p>
            <h1 className="text-4xl font-black font-['Shrikhand',serif] text-[#ffde59] drop-shadow-[0_3px_0px_#000] leading-tight">
              {FLAVORS[matchKey].name}
            </h1>
            <div className="inline-block bg-black/40 px-3 py-1.5 rounded-lg border border-black text-[11px] font-black text-pink-300 uppercase tracking-wide">
              {FLAVORS[matchKey].tagline}
            </div>
            <p className="text-base font-bold text-[#fff9f2] leading-snug pt-2">
              {FLAVORS[matchKey].verdict}
            </p>
            <div className="pt-4 border-t-2 border-black/50">
              <p className="text-[11px] font-black uppercase tracking-wider text-[#ffde59] flex items-center justify-center gap-2">
                <Share2 size={14} /> Screenshot & tag @DrBombay
              </p>
            </div>
          </div>

          <div className="space-y-4 pb-4">
            <button
              onClick={() => { setView('quiz'); setStep(0); }}
              className="w-full bg-[#ff7b00] active:scale-95 transition-transform text-black font-black text-lg py-4 rounded-2xl border-2 border-black shadow-[0_5px_0px_#000]"
            >
              TEST ANOTHER FLAVA
            </button>
            <p className="text-[10px] text-gray-400 leading-relaxed">
              Unofficial fan application project created by Aaditya G. for the Dr. Bombay tastemaker search. Not affiliated with Bosslady Foods.
            </p>
          </div>
        </main>
      )}
    </div>
  );
}
