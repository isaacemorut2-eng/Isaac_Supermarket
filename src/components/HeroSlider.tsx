import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles, Shield, Clock, Zap } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const HERO_SLIDES = [
  {
    id: 1,
    badge: 'Electronics & Mobile Flagship',
    title: 'SMARTPHONE',
    subtitle: 'Next-Gen Ultra 5G AMOLED',
    highlight: 'Titanium Performance & 100x Space Zoom',
    pricePromo: 'From $899.99',
    discountBadge: '30% OFF',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1000&q=80',
    categoryTarget: 'Electronics',
    cta: 'SHOP NOW >>>',
    bgGradient: 'from-slate-900/90 via-slate-900/60 to-transparent',
  },
  {
    id: 2,
    badge: '100% Certified Farm-to-Table',
    title: 'FRESH SUPERMARKET',
    subtitle: 'Organic California Produce',
    highlight: 'Strawberries, Avocados & Pasture-Raised Milk',
    pricePromo: 'Starting at $3.49',
    discountBadge: 'FRESH HARVEST',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80',
    categoryTarget: 'Fresh Produce',
    cta: 'EXPLORE AISLES >>>',
    bgGradient: 'from-emerald-950/90 via-emerald-900/60 to-transparent',
  },
  {
    id: 3,
    badge: 'Culinary & Smart Living',
    title: 'HOME & KITCHEN',
    subtitle: 'Pro Espresso & Air Fryers',
    highlight: 'Barista-Grade 15-Bar Extraction at Home',
    pricePromo: 'Up to $150 Off',
    discountBadge: 'TOP RATED',
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=1000&q=80',
    categoryTarget: 'Home & Kitchen',
    cta: 'DISCOVER DEALS >>>',
    bgGradient: 'from-amber-950/90 via-amber-900/60 to-transparent',
  },
];

export const HeroSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { setSelectedCategory, setActiveTab, setIsInventoryModalOpen } = useStore();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <section id="hero-slider-section" className="bg-slate-100 py-4 sm:py-6">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">
        
        {/* Main Hero Slider (Takes 8 columns on large screens) */}
        <div className="lg:col-span-8 relative rounded-xl overflow-hidden shadow-lg min-h-[380px] sm:min-h-[420px] flex items-center bg-slate-900">
          {/* Background image with transition */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out transform scale-105"
            style={{ backgroundImage: `url(${slide.image})` }}
          />

          {/* Dark Overlay Gradient */}
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgGradient}`} />

          {/* Content */}
          <div className="relative z-10 p-6 sm:p-10 max-w-xl text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold uppercase tracking-wider mb-3 text-yellow-300 border border-white/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{slide.badge}</span>
            </div>

            <div className="text-xs sm:text-sm font-semibold tracking-widest text-sky-300 uppercase mb-1 font-serif">
              SuperMart Catalog
            </div>

            <h2 className="text-3xl sm:text-5xl font-serif font-black tracking-tight leading-tight text-white mb-2">
              {slide.title}
            </h2>

            <p className="text-lg sm:text-xl font-medium text-slate-200 mb-1">
              {slide.subtitle}
            </p>

            <p className="text-xs sm:text-sm text-slate-300 mb-6 line-clamp-2">
              {slide.highlight}
            </p>

            <div className="flex items-center gap-3">
              <button
                id={`hero-cta-btn-${slide.id}`}
                onClick={() => {
                  setSelectedCategory(slide.categoryTarget);
                  setActiveTab('all');
                }}
                className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-xs sm:text-sm px-6 py-3 rounded-lg shadow-lg hover:shadow-yellow-400/20 transition-all flex items-center gap-2 cursor-pointer group active:scale-95"
              >
                <span>{slide.cta}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <span className="text-xs font-bold text-white/90 bg-white/10 px-3 py-2.5 rounded-lg border border-white/20">
                {slide.pricePromo}
              </span>
            </div>
          </div>

          {/* Arrow navigation */}
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition cursor-pointer z-20"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition cursor-pointer z-20"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Slide Indicator Dots matching the reference image (bottom center) */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
            {HERO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentSlide === idx ? 'bg-yellow-400 w-7' : 'bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right Side Promo Cards (Matching reference layout) */}
        <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4">
          {/* Card 1: 30% OFF Promo banner */}
          <div
            onClick={() => { setSelectedCategory('Fresh Produce'); setActiveTab('flash'); }}
            className="flex-1 bg-gradient-to-br from-amber-500 to-rose-600 rounded-xl p-5 text-white shadow-md relative overflow-hidden flex flex-col justify-between cursor-pointer group hover:shadow-xl transition-all"
          >
            <div className="relative z-10">
              <span className="bg-white text-rose-700 font-extrabold text-[10px] uppercase px-2 py-0.5 rounded shadow-xs tracking-wider">
                Weekend Special
              </span>
              <h3 className="text-xl sm:text-2xl font-black mt-2 leading-tight">
                Hold up to <span className="text-yellow-200">30% OFF</span>
              </h3>
              <p className="text-xs text-rose-100 mt-1 max-w-[200px]">
                Fresh organic berries, ripe avocados & pantry essentials.
              </p>
            </div>

            <div className="relative z-10 mt-4 flex items-center justify-between">
              <span className="text-xs font-bold underline decoration-yellow-300 underline-offset-4 group-hover:text-yellow-200 transition">
                Shop Produce Deals →
              </span>
              <span className="text-2xl font-black text-yellow-300 font-serif">
                30% OFF
              </span>
            </div>

            {/* Ambient background blur graphic */}
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl group-hover:scale-125 transition-transform"></div>
          </div>

          {/* Card 2: Real-time Live Inventory Hub Banner */}
          <div
            onClick={() => setIsInventoryModalOpen(true)}
            className="flex-1 bg-gradient-to-br from-slate-900 to-sky-950 rounded-xl p-5 text-white shadow-md relative overflow-hidden flex flex-col justify-between cursor-pointer group hover:shadow-xl transition-all border border-sky-800/40"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5" />
                <span>Live Warehouse Radar</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mt-1.5 leading-snug">
                Real-Time Inventory Tracker
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Monitor 6 warehouse aisles, low stock alerts, and live shoppers in real time.
              </p>
            </div>

            <div className="relative z-10 mt-4 flex items-center justify-between pt-2 border-t border-white/10">
              <span className="text-xs font-bold text-sky-400 flex items-center gap-1 group-hover:text-sky-300">
                Launch Inventory Monitor →
              </span>
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
