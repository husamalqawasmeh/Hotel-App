import React, { useState, useRef, useEffect } from "react";
import { Sparkles, MessageSquare, X, Send, Loader2, ArrowRight, CornerDownRight, Landmark } from "lucide-react";

interface ChatMessage {
  role: "user" | "model";
  content: string;
}

const PRESET_CONCIERGE_PROMPTS = [
  "Suggest a spectacular 3-day itinerary for Santorini grand",
  "What is the Hinoki onsen etiquette for Kyoto Bamboo Sanctuary?",
  "Curate a winter packing schedule for Chamonix alpine whisper",
  "Detail the luxury dining guidelines at The Vanderbilt Regency NY"
];

export default function AiCompanionWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<ChatMessage[]>([
    {
      role: "model",
      content: "Welcome to the StayLux High-Society Concierge. I am your elite travel companion, optimized to design exquisite itineraries, curate packing schedules, and explain local cultures. How may I elevate your journey today?"
    }
  ]);
  const [loading, setLoading] = useState(false);
  
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [history, open]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = { role: "user", content: textToSend };
    setHistory((prev) => [...prev, userMsg]);
    setLoading(true);
    setMessage("");

    try {
      // Proxy server chat endpoint
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: history.slice(1), // Ignore original greeting
        }),
      });

      if (!response.ok) {
        throw new Error("Concierge companion encountered a congestion, please re-try.");
      }

      const data = await response.json();
      const modelMsg: ChatMessage = { role: "model", content: data.reply };
      setHistory((prev) => [...prev, modelMsg]);
    } catch (error: any) {
      console.error(error);
      const errMsg: ChatMessage = {
        role: "model",
        content: `⚠️ I apologize, my elite registry is experiencing high traffic. Please recheck your query: ${error.message}`
      };
      setHistory((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(message);
  };

  return (
    <>
      {/* Floating Concierge Balloon (Trigger tab) */}
      <div className="fixed bottom-6 right-6 z-40 print:hidden">
        <button
          onClick={() => setOpen(!open)}
          className="bg-slate-900 hover:bg-slate-800 text-white p-4 rounded-full shadow-2xl flex items-center justify-center gap-2 hover:scale-105 active:scale-95 duration-200 transition-all border border-white/10 cursor-pointer"
          id="companion-floating-balloon-btn"
          title="StayLux AI Travel Concierge Assistant"
        >
          <Sparkles size={18} className="text-amber-400 rotate-12" />
          <span className="font-heading font-extrabold text-xs tracking-wider pr-1">
            ELITE CONCIERGE AI
          </span>
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </button>
      </div>

      {/* Floating Chat Panel Container Drawer */}
      {open && (
        <div
          className="fixed bottom-24 right-6 w-full max-w-sm sm:max-w-md h-[550px] bg-slate-900 border border-white/10 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden text-left animate-fade-in print:hidden text-white"
          id="companion-chat-panel"
        >
          {/* Header */}
          <div className="p-4.5 bg-slate-950 border-b border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/15">
                <Landmark size={15} />
              </div>
              <div>
                <h3 className="font-heading font-black text-sm text-slate-50 leading-none flex items-center gap-1">
                  StayLux Concierge AI
                  <Sparkles size={11} className="text-amber-400" />
                </h3>
                <span className="font-sans text-[9px] text-slate-400 font-extrabold tracking-widest uppercase">
                  Connected to Elite Registry
                </span>
              </div>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
              id="companion-chat-close-btn"
            >
              <X size={15} />
            </button>
          </div>

          {/* Messages Flow Area */}
          <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-slate-950/20 scroll-smooth">
            {history.map((msg, idx) => {
              const isUser = msg.role === "user";
              return (
                <div
                  key={idx}
                  className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fade-in`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-[12px] leading-relaxed shadow-sm font-sans font-medium ${
                      isUser
                        ? "bg-slate-100 text-slate-900 rounded-tr-none font-semibold"
                        : "bg-slate-850 text-slate-100 rounded-tl-none border border-white/5"
                    }`}
                  >
                    {!isUser && (
                      <span className="font-heading font-bold text-[9px] text-emerald-400 tracking-widest uppercase block pb-1">
                        Royal Concierge
                      </span>
                    )}
                    <p className="whitespace-pre-line">{msg.content}</p>
                  </div>
                </div>
              );
            })}
            
            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[85%] p-3.5 bg-slate-850 text-slate-100 rounded-2xl rounded-tl-none border border-white/5 flex gap-2 items-center text-xs">
                  <Loader2 size={13} className="animate-spin text-emerald-400" />
                  <span className="font-sans font-semibold text-slate-400 animate-pulse">
                    Concierge is typing...
                  </span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Preset Prompts Box */}
          {history.length === 1 && (
            <div className="p-3 bg-slate-950/60 border-t border-white/5 space-y-2">
              <span className="font-sans text-[8px] font-bold text-slate-500 uppercase tracking-widest block leading-none">
                Explore Predefined Itineraries & Codes
              </span>
              <div className="grid grid-cols-1 gap-1">
                {PRESET_CONCIERGE_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSendMessage(prompt)}
                    className="flex items-center gap-1.5 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-left text-[10px] text-slate-300 font-sans font-medium hover:text-white transition-all cursor-pointer"
                    id={`companion-preset-btn-${prompt.slice(0, 10).replace(/ /g, "-")}`}
                  >
                    <CornerDownRight size={10} className="text-emerald-400 flex-shrink-0" />
                    <span className="truncate">{prompt}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Form input controls */}
          <form
            onSubmit={handleFormSubmit}
            className="p-3 bg-slate-950 border-t border-white/5 flex gap-2 items-center"
          >
            <input
              type="text"
              required
              disabled={loading}
              placeholder="Ask about packing catalogs, private yachts..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-grow bg-slate-900 border border-white/10 focus:border-white/20 text-white font-sans text-xs py-3.5 px-3.5 rounded-xl focus:outline-none transition-colors"
              id="companion-chat-message-input"
            />
            <button
              type="submit"
              disabled={loading || !message.trim()}
              className="p-3 bg-white hover:bg-slate-150 disabled:opacity-30 disabled:hover:bg-white text-slate-950 rounded-xl transition-all cursor-pointer flex items-center justify-center font-bold"
              id="companion-chat-send-btn"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
