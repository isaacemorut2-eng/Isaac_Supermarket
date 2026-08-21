import React, { useState } from 'react';
import {
  Menu,
  ChevronDown,
  Truck,
  PhoneCall,
  Flame,
  Activity,
  Layers,
  Sparkles,
  Smartphone,
  Apple,
  Milk,
  Coffee,
  Tv,
  Utensils,
  ShoppingBag,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES_LIST } from '../data/products';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'Electronics': <Smartphone className="w-4 h-4 text-sky-500" />,
  'Fresh Produce': <Apple className="w-4 h-4 text-emerald-500" />,
  'Dairy & Bakery': <Milk className="w-4 h-4 text-amber-500" />,
  'Pantry & Groceries': <Coffee className="w-4 h-4 text-orange-500" />,
  'Home & Kitchen': <Tv className="w-4 h-4 text-purple-500" />,
  'Beverages': <Coffee className="w-4 h-4 text-cyan-500" />,
  'Meat & Seafood': <Utensils className="w-4 h-4 text-rose-500" />,
  'Household': <ShoppingBag className="w-4 h-4 text-indigo-500" />,
};

const NEWS_TICKER_ITEMS = [
  '🔥 Super Weekend Deals: 20% OFF all organic strawberries & fresh produce with code SAVE20',
  '⚡ Restock Alert: Ultra 5G Smartphones & Active Noise Cancelling Headphones now in stock in Aisle E-01',
  '🥬 100% Farm-To-Table Organic Honeycrisp Apples freshly picked this morning',
  '🚚 Free 2-Hour Express Delivery guaranteed on all orders over $35',
];

export const Navbar: React.FC = () => {
  const {
    selectedCategory,
    setSelectedCategory,
    setActiveTab,
    setIsInventoryModalOpen,
  } = useStore();

  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [currentNewsIdx, setCurrentNewsIdx] = useState(0);

  // Cycle news item every 6 seconds
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentNewsIdx((prev) => (prev + 1) % NEWS_TICKER_ITEMS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <nav id="main-navigation-bar" className="bg-sky-600 text-white relative z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-stretch md:items-center justify-between">
        {/* Left: Category Dropdown & Navigation Links */}
        <div className="flex items-center gap-0 sm:gap-2 flex-wrap">
          {/* Categories Button with Flyout */}
          <div className="relative">
            <button
              id="categories-dropdown-btn"
              onClick={() => setIsCategoryMenuOpen(prev => !prev)}
              className="bg-sky-800 hover:bg-sky-900 text-white font-bold text-xs sm:text-sm px-5 py-3 flex items-center gap-3 transition cursor-pointer select-none"
            >
              <Menu className="w-4 h-4" />
              <span className="tracking-wider uppercase">CATEGORIES</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCategoryMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isCategoryMenuOpen && (
              <div
                className="absolute top-full left-0 w-64 bg-white text-slate-800 rounded-b-lg shadow-2xl border border-slate-200 z-50 py-2 divide-y divide-slate-100"
                onMouseLeave={() => setIsCategoryMenuOpen(false)}
              >
                <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Shop By Supermarket Department
                </div>
                {CATEGORIES_LIST.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setIsCategoryMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs font-semibold flex items-center justify-between transition cursor-pointer hover:bg-sky-50 ${
                      selectedCategory === cat ? 'bg-sky-100/70 text-sky-700 font-bold' : 'text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {CATEGORY_ICONS[cat] || <Layers className="w-4 h-4 text-slate-400" />}
                      <span>{cat}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">›</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Nav Items */}
          <div className="hidden lg:flex items-center text-xs font-semibold uppercase tracking-wider divide-x divide-sky-500/60">
            <button
              onClick={() => { setSelectedCategory('All Categories'); setActiveTab('all'); }}
              className="px-3.5 py-3 hover:bg-sky-700 transition cursor-pointer"
            >
              All Products
            </button>
            <button
              onClick={() => setActiveTab('flash')}
              className="px-3.5 py-3 hover:bg-sky-700 transition cursor-pointer flex items-center gap-1.5 text-yellow-300"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Flash Deals</span>
            </button>
            <button
              onClick={() => setIsInventoryModalOpen(true)}
              className="px-3.5 py-3 hover:bg-sky-700 transition cursor-pointer flex items-center gap-1.5 text-emerald-300"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Live Inventory Hub</span>
            </button>
            <button
              onClick={() => { setSelectedCategory('Fresh Produce'); setActiveTab('all'); }}
              className="px-3.5 py-3 hover:bg-sky-700 transition cursor-pointer"
            >
              Fresh Groceries
            </button>
            <button
              onClick={() => { setSelectedCategory('Electronics'); setActiveTab('all'); }}
              className="px-3.5 py-3 hover:bg-sky-700 transition cursor-pointer"
            >
              Tech & Mobile
            </button>
          </div>
        </div>

        {/* Right: Hot News Ticker & Socials (Matching reference layout) */}
        <div className="hidden md:flex items-center gap-4 py-2 text-xs">
          <div className="flex items-center gap-2 max-w-md overflow-hidden text-sky-100 font-medium">
            <span className="bg-rose-500 text-white font-bold text-[10px] uppercase px-1.5 py-0.5 rounded shrink-0">
              HOT NEWS
            </span>
            <span className="truncate transition-opacity duration-300 text-xs font-normal" key={currentNewsIdx}>
              {NEWS_TICKER_ITEMS[currentNewsIdx]}
            </span>
          </div>

          {/* Social Icons matching image */}
          <div className="flex items-center gap-1.5 text-sky-200 border-l border-sky-500/50 pl-3">
            <a href="#twitter" aria-label="Twitter" className="w-6 h-6 rounded bg-sky-700/80 hover:bg-sky-800 flex items-center justify-center text-[10px] font-bold text-white transition">
              𝕏
            </a>
            <a href="#facebook" aria-label="Facebook" className="w-6 h-6 rounded bg-sky-700/80 hover:bg-sky-800 flex items-center justify-center text-[10px] font-bold text-white transition">
              f
            </a>
            <a href="#instagram" aria-label="Instagram" className="w-6 h-6 rounded bg-sky-700/80 hover:bg-sky-800 flex items-center justify-center text-[10px] font-bold text-white transition">
              ig
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};
