import React, { useState } from "react";
import { Sparkles, ArrowRight, Loader2, Star, CheckCircle, Compass } from "lucide-react";
import { Hotel } from "../types";
import { HOTELS_DATA } from "../data";

interface AiRecommendationWidgetProps {
  onSelectHotel: (hotel: Hotel) => void;
}

export default function AiRecommendationWidget({ onSelectHotel }: AiRecommendationWidgetProps) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    hotelId: string;
    matchPercentage: number;
    matchReasons: string[];
    personalizedMessage: string;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRecommend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setErrorMsg(null);
    setResult(null);

    try {
      const response = await fetch("/api/gemini/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Elite recommendations registry timed out, please re-try.");
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to parse recommendations layout.");
    } finally {
      setLoading(false);
    }
  };

  // Find corresponding hotel from data
  const recommendedHotel = result
    ? HOTELS_DATA.find((h) => h.id === result.hotelId)
    : null;

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-white rounded-3xl p-6 sm:p-8 md:p-10 border border-white/10 dark:border-white/5 shadow-2xl relative overflow-hidden text-left">
      {/* Visual Ambient Orbs */}
      <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-505/20 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute left-10 bottom-0 w-64 h-64 bg-emerald-505/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Pitching Information */}
        <div className="lg:col-span-5 space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md rounded-full px-3.5 py-1 border border-white/10">
            <Sparkles size={12} className="text-amber-400 animate-pulse" />
            <span className="font-heading font-extrabold text-[10px] tracking-widest uppercase text-slate-100">
              StayLux Elite Concierge AI
            </span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl leading-tight text-white tracking-tight">
            Match Your Mood <br />
            <span className="text-indigo-300">with Perfect Luxury</span>
          </h2>
          <p className="font-sans text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
            Indulge your current sub-conscious. Simply type your desires (e.g., "warm hot springs under Japanese leaves" or "sleek Gilded lobbies near Central Park with white-glove concierges") and our neural engine yields coordinates.
          </p>
        </div>

        {/* Input prompt & results container */}
        <div className="lg:col-span-7">
          <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-inner space-y-6">
            <form onSubmit={handleRecommend} className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Describe your absolute sanctuary vibe here..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full bg-slate-950/40 border border-white/10 focus:border-white/30 text-white placeholder-slate-400 font-sans text-xs sm:text-sm py-4.5 pl-11 pr-4 rounded-xl focus:outline-none transition-all duration-300"
                  id="ai-recommend-prompt-input"
                />
                <Compass size={16} className="absolute left-4 top-5 text-slate-400" />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto bg-white hover:bg-slate-100 text-slate-900 font-sans font-bold text-xs py-3.5 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  id="ai-recommend-submit-cta"
                >
                  {loading ? (
                    <>
                      <Loader2 size={13} className="animate-spin text-slate-900" />
                      CALCULATING LUXURY ESCAPES...
                    </>
                  ) : (
                    <>
                      <Sparkles size={13} className="text-indigo-600" />
                      FIND MY MATCH
                    </>
                  )}
                </button>

                {result && (
                  <button
                    type="button"
                    onClick={() => {
                      setPrompt("");
                      setResult(null);
                    }}
                    className="bg-white/10 hover:bg-white/25 text-white font-sans font-bold text-xs py-3 px-4.5 rounded-xl transition-colors cursor-pointer"
                    id="ai-recommend-reset-tab"
                  >
                    Clear Match
                  </button>
                )}
              </div>
            </form>

            {/* Error notifications */}
            {errorMsg && (
              <div className="p-3.5 bg-rose-950/50 text-rose-300 rounded-xl border border-rose-900/30 text-xs font-semibold">
                ⚠️ {errorMsg}
              </div>
            )}

            {/* Render matched hotel details */}
            {result && recommendedHotel && (
              <div className="bg-white/10 dark:bg-slate-950/40 border border-white/10 p-5 rounded-2xl relative animate-fade-in text-left space-y-4">
                <div className="flex justify-between items-start gap-3 flex-wrap">
                  {/* Hotel Header specs */}
                  <div>
                    <span className="font-heading font-extrabold text-[10px] text-emerald-400 bg-emerald-950/50 px-2.5 py-1 rounded inline-block uppercase tracking-wider">
                      ★ {result.matchPercentage}% Compatibility Match Verified
                    </span>
                    <h4 className="font-heading font-extrabold text-lg text-white pt-1 leading-tight">
                      {recommendedHotel.name}
                    </h4>
                    <p className="font-sans text-[11px] text-slate-300 uppercase font-semibold">
                      {recommendedHotel.location}
                    </p>
                  </div>

                  <div className="bg-slate-950 px-3.5 py-1 rounded-xl shadow-md border border-white/5 font-sans font-semibold text-xs text-white">
                    From ${recommendedHotel.minPrice} <span className="text-[10px] text-slate-400 font-light">/ night</span>
                  </div>
                </div>

                {/* Personalized concierge brief */}
                <p className="font-sans text-xs text-slate-200 font-light leading-relaxed italic border-l-2 border-indigo-400 pl-3">
                  "{result.personalizedMessage}"
                </p>

                {/* 3 bullet reasons */}
                <div className="space-y-1.5 pt-1">
                  <span className="font-sans text-[10px] font-bold text-indigo-300 uppercase tracking-widest block">
                    Why it is a design masterpiece for you:
                  </span>
                  <div className="grid grid-cols-1 gap-2 text-[11px] text-slate-200 font-medium">
                    {result.matchReasons.map((reason, index) => (
                      <div key={index} className="flex gap-2 items-start">
                        <CheckCircle size={12} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Route directly CTA */}
                <div className="pt-2">
                  <button
                    onClick={() => onSelectHotel(recommendedHotel)}
                    className="w-full bg-white hover:bg-slate-100 text-slate-900 font-sans font-extrabold text-xs py-3.5 rounded-xl transition-all flex items-center justify-center gap-1.5 group cursor-pointer shadow-md"
                    id={`recommend-book-match-cta-${recommendedHotel.id}`}
                  >
                    SELECT MATCHED PORTFOLIO SUITES
                    <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
