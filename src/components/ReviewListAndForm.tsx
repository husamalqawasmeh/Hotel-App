import React, { useState } from "react";
import { Star, ShieldCheck, ThumbsUp, Send, User } from "lucide-react";

interface Review {
  id: string;
  author: string;
  verified: boolean;
  avatar?: string;
  rating: number;
  date: string;
  comment: string;
  helpfulCount: number;
}

interface ReviewListAndFormProps {
  hotelId: string;
}

const DEFAULT_REVIEWS: Record<string, Review[]> = {
  "santorini-grand": [
    {
      id: "r1",
      author: "Evelyn Sterling",
      verified: true,
      rating: 5,
      date: "May 12, 2026",
      comment: "A transcendent experience. The cavern spa is an architectural wonder carved directly out of natural volcanic rock. Watching the legendary caldera sunset from our private infinity pool while sipping complimentary dry Assyrtiko champagne is a memory that will remain forever etched in my mind. Absolute perfection.",
      helpfulCount: 42,
    },
    {
      id: "r2",
      author: "Lord Alistair",
      verified: true,
      rating: 4.8,
      date: "April 28, 2026",
      comment: "Superb attention to custom details by the butler staff, who proactively arranged chartered catamaran excursions and private helicopter sunset fly-overs. The white-washed villas seamlessly mesh traditional volcanic structure with sleek, premium glass layouts.",
      helpfulCount: 19,
    }
  ],
  "kyoto-sanctuary": [
    {
      id: "r3",
      author: "Hana Takahashi",
      verified: true,
      rating: 5,
      date: "May 02, 2026",
      comment: "A true homage to traditional mastercraft. The whispering bamboo leaves create a melodic wind song as you settle into the private stone rotenburo onsen. The Kaiseki multi-course meal was a flawless orchestration of seasonal Arashiyama colors and textures.",
      helpfulCount: 31,
    }
  ],
  "alpine-whisper": [
    {
      id: "r4",
      author: "Dr. Marcus Vance",
      verified: true,
      rating: 4.9,
      date: "January 14, 2026",
      comment: "Exceptional ski-lodge luxury. Direct ski-in/ski-out capability combined with high-grade heated lockers made our Mont-Blanc daily slopes feel effortless. Returning to a roaring wood logs fireplace and high-end fondue pairings was sublime.",
      helpfulCount: 22,
    }
  ],
  "maldives-luminary": [
    {
      id: "r5",
      author: "Charlotte Dubois",
      verified: true,
      rating: 5,
      date: "March 20, 2026",
      comment: "Unmatched lagoon isolation. Slip down the upper water slide directly into warm turquoise waves, then return to watch nurse sharks and schools of colorful coral parrotfish cruise elegantly underneath your transparent glass-bottom bedroom floor. Stellar service.",
      helpfulCount: 56,
    }
  ]
};

export default function ReviewListAndForm({ hotelId }: ReviewListAndFormProps) {
  // Store state for reviews, indexed by hotelId
  const [reviewsState, setReviewsState] = useState<Record<string, Review[]>>(DEFAULT_REVIEWS);
  const [helpfulClicked, setHelpfulClicked] = useState<string[]>([]);

  // Post form state
  const [newAuthor, setNewAuthor] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const hotelReviews = reviewsState[hotelId] || [
    {
      id: "fallback-1",
      author: "Elizabeth Rose",
      verified: true,
      rating: 5,
      date: "March 15, 2026",
      comment: "Exceptional atmosphere and breathtaking hospitality. Every minor detail was perfectly curated to make us feel pampered from check-in to final farewell checkouts.",
      helpfulCount: 8,
    }
  ];

  const handleHelpfulTouch = (reviewId: string) => {
    if (helpfulClicked.includes(reviewId)) return;
    setHelpfulClicked([...helpfulClicked, reviewId]);

    setReviewsState((prev) => {
      const currentHotelReviews = prev[hotelId] || [];
      const updated = currentHotelReviews.map((r) =>
        r.id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r
      );
      return { ...prev, [hotelId]: updated };
    });
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newComment.trim()) return;

    const reviewObj: Review = {
      id: `r-${Date.now()}`,
      author: newAuthor,
      verified: true, // We assume hotelier verifies elite stays
      rating: newRating,
      date: "Just now",
      comment: newComment,
      helpfulCount: 0,
    };

    setReviewsState((prev) => {
      const list = prev[hotelId] ? [...prev[hotelId]] : [];
      return {
        ...prev,
        [hotelId]: [reviewObj, ...list],
      };
    });

    setNewAuthor("");
    setNewRating(5);
    setNewComment("");
    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 3500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
      {/* Review Logs */}
      <div className="lg:col-span-8 space-y-6">
        <div className="flex justify-between items-center pb-2 border-b border-slate-50 dark:border-white/5">
          <h3 className="font-heading font-extrabold text-lg text-slate-900 dark:text-white">
            Guest Verdicts ({hotelReviews.length})
          </h3>
          <span className="font-sans text-[10px] text-slate-400 dark:text-slate-500 font-extrabold tracking-widest uppercase">
            100% Verified Sanctuary Stays
          </span>
        </div>

        <div className="space-y-6">
          {hotelReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-100 dark:border-white/5 shadow-xs space-y-4"
              id={`review-log-card-${review.id}`}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-center gap-3">
                  {/* Avatar wrapper */}
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350 flex items-center justify-center font-heading font-black text-xs border border-slate-200/50 dark:border-white/5 shadow-xs">
                    {review.author.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-heading font-extrabold text-sm text-slate-900 dark:text-white leading-none">
                        {review.author}
                      </h4>
                      {review.verified && (
                        <span
                          className="text-emerald-500 hover:text-emerald-600 flex items-center"
                          title="Verified Elite Stay"
                        >
                          <ShieldCheck size={14} className="fill-emerald-50 dark:fill-transparent" />
                        </span>
                      )}
                    </div>
                    <span className="font-sans text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                      {review.date}
                    </span>
                  </div>
                </div>

                {/* Individual Score stars */}
                <div className="flex items-center gap-0.5 bg-slate-50 dark:bg-slate-850 px-2 py-1 rounded-lg border border-slate-100 dark:border-white/5">
                  <Star size={11} className="fill-amber-400 stroke-amber-400" />
                  <span className="font-heading font-extrabold text-[10px] text-slate-700 dark:text-slate-300">
                    {review.rating.toFixed(1)}
                  </span>
                </div>
              </div>

              <p className="font-sans text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                "{review.comment}"
              </p>

              {/* Helpful vote actions */}
              <div className="flex justify-between items-center pt-2 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                <button
                  onClick={() => handleHelpfulTouch(review.id)}
                  className={`flex items-center gap-1 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors ${
                    helpfulClicked.includes(review.id) ? "text-emerald-500 font-black" : ""
                  }`}
                  id={`review-helpful-btn-${review.id}`}
                >
                  <ThumbsUp size={12} />
                  <span>Helpful ({review.helpfulCount})</span>
                </button>
                <span>Report Refinement</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review Submission Column */}
      <div className="lg:col-span-4">
        <div className="bg-slate-50/50 dark:bg-slate-900/40 backdrop-blur-xl p-6 rounded-2xl border border-slate-100 dark:border-white/5 shadow-md space-y-6 sticky top-28">
          <div className="text-left space-y-1">
            <h3 className="font-heading font-extrabold text-base text-slate-900 dark:text-white leading-tight">
              Share Your Sanctuary Verdict
            </h3>
            <p className="font-sans text-xs text-slate-400 dark:text-slate-500 font-light leading-relaxed">
              Have you retreated inside our StayLux portfolios? We welcome elegant remarks of your guest experience.
            </p>
          </div>

          <form onSubmit={handleSubmitReview} className="space-y-4">
            {/* Guest Name */}
            <div className="space-y-1 text-left">
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">
                Traveler Label
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Lady Evelyn Sterling, etc."
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                className="w-full bg-white dark:bg-slate-850 text-xs font-semibold text-slate-900 dark:text-white border border-slate-200/80 dark:border-white/5 focus:border-slate-400 dark:focus:border-slate-500 focus:outline-none py-3 px-3.5 rounded-xl transition-all"
                id="review-author-input"
              />
            </div>

            {/* Score Selection */}
            <div className="space-y-1.5 text-left">
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">
                Elite Rating Score
              </label>
              <div className="flex items-center gap-1.5 bg-white dark:bg-slate-850 p-2.5 rounded-xl border border-slate-200/80 dark:border-white/5">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setNewRating(num)}
                    className="p-1 hover:bg-slate-50 rounded-md transition-colors cursor-pointer"
                    id={`review-score-btn-${num}`}
                  >
                    <Star
                      size={18}
                      className={`transition-colors ${
                        num <= newRating ? "fill-amber-400 stroke-amber-400" : "fill-transparent stroke-slate-300 dark:stroke-slate-600"
                      }`}
                    />
                  </button>
                ))}
                <span className="font-heading font-black text-xs text-slate-700 dark:text-slate-300 ml-auto pr-1">
                  {newRating}.0 / 5.0
                </span>
              </div>
            </div>

            {/* Verdict text */}
            <div className="space-y-1 text-left">
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">
                Exquisite Comments
              </label>
              <textarea
                required
                rows={4}
                placeholder="Detail your cavern bath comfort, butler standards, custom sunset angles..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full bg-white dark:bg-slate-850 text-xs font-medium text-slate-900 dark:text-white border border-slate-200/80 dark:border-white/5 focus:border-slate-400 dark:focus:border-slate-500 focus:outline-none py-3 px-3.5 rounded-xl transition-all"
                id="review-text-textarea"
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full bg-slate-900 dark:bg-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 text-white font-sans font-bold text-xs py-3.5 rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-sm"
              id="review-submit-cta"
            >
              <Send size={12} />
              DISPATCH ANONYMOUS VERDICT
            </button>

            {submitSuccess && (
              <div className="p-3 bg-emerald-50 dark:bg-indigo-950/40 text-emerald-800 dark:text-emerald-300 rounded-xl border border-emerald-100/50 dark:border-indigo-900/30 text-center font-sans font-semibold text-[11px] animate-fade-in">
                ✓ Verdict logged! Published with premium verification locks.
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
