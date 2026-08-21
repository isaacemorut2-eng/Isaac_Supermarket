import React, { useState } from 'react';
import { Sparkles, Copy, Check, X, Tag } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const TopBanner: React.FC = () => {
  const [isCopied, setIsCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const { applyCoupon, setIsCartOpen } = useStore();

  if (!isVisible) return null;

  const handleCopyCode = () => {
    navigator.clipboard?.writeText('SAVE20');
    applyCoupon('SAVE20');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div
      id="top-marketing-banner"
      className="bg-sky-600 text-white text-xs sm:text-sm font-medium py-2 px-4 transition-all duration-300 relative border-b border-sky-700/50 shadow-inner"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
          <span className="inline-flex items-center gap-1 bg-white/20 text-white px-2 py-0.5 rounded text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
            Weekend Promo
          </span>
          <span className="leading-snug">
            Populate this marketing banner: <strong className="underline decoration-yellow-300 decoration-2 underline-offset-2">Save 20% this weekend!</strong> Express 2-hour supermarket delivery available.
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            id="copy-save20-btn"
            onClick={handleCopyCode}
            className="inline-flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold px-3 py-1 rounded text-xs transition shadow-sm active:scale-95 cursor-pointer"
            title="Click to copy & apply SAVE20 coupon"
          >
            <Tag className="w-3 h-3 text-slate-900" />
            <span>CODE: SAVE20</span>
            {isCopied ? <Check className="w-3.5 h-3.5 text-green-800" /> : <Copy className="w-3.5 h-3.5 text-slate-700" />}
          </button>

          <button
            id="dismiss-banner-btn"
            onClick={() => setIsVisible(false)}
            aria-label="Dismiss banner"
            className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10 transition ml-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
