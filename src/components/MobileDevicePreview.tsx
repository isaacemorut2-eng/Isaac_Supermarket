import React, { useState } from 'react';
import {
  X,
  Menu,
  ShoppingCart,
  Search,
  Flame,
  Activity,
  Heart,
  ChevronRight,
  Plus,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const MobileDevicePreview: React.FC = () => {
  const {
    products,
    cart,
    totalCartItemsCount,
    cartTotal,
    addToCart,
    isMobilePreviewActive,
    setIsMobilePreviewActive,
    setIsCartOpen,
    setIsInventoryModalOpen,
    setActiveQuickViewProduct,
  } = useStore();

  const [mobileSearch, setMobileSearch] = useState('');
  const [mobileCategory, setMobileCategory] = useState('All');

  if (!isMobilePreviewActive) return null;

  const mobileFiltered = products.filter(p => {
    const matchesCat = mobileCategory === 'All' || p.category === mobileCategory;
    const matchesQuery = p.name.toLowerCase().includes(mobileSearch.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div
      id="mobile-device-preview-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      {/* Container */}
      <div className="relative flex flex-col items-center">
        
        {/* Floating close controls above phone */}
        <div className="flex items-center justify-between w-full max-w-[360px] text-white text-xs font-bold mb-3 px-2">
          <span className="flex items-center gap-1.5 text-sky-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Interactive Mobile View (From Reference)</span>
          </span>

          <button
            onClick={() => setIsMobilePreviewActive(false)}
            className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded-lg transition cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span>Close Mockup</span>
          </button>
        </div>

        {/* Realistic Smartphone Frame (as shown in reference image mockup) */}
        <div className="w-[340px] sm:w-[360px] h-[660px] bg-slate-900 rounded-[44px] p-3 shadow-2xl border-4 border-slate-700 relative flex flex-col overflow-hidden">
          
          {/* Phone Speaker & Dynamic Island Notch */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-black rounded-full z-40 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-slate-900 border border-slate-800 ml-auto mr-3"></div>
          </div>

          {/* Phone Screen Area */}
          <div className="w-full h-full bg-white rounded-[32px] overflow-y-auto flex flex-col relative text-slate-800 scrollbar-none">
            
            {/* Mobile Top Promo Banner */}
            <div className="bg-sky-600 text-white text-[10px] font-semibold py-1.5 px-3 text-center shrink-0">
              Save 20% this weekend! Code: <strong>SAVE20</strong>
            </div>

            {/* Mobile Header Bar */}
            <div className="px-3 py-2 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsInventoryModalOpen(true)}
                  className="p-1 text-slate-700 hover:text-sky-600"
                >
                  <Menu className="w-4 h-4" />
                </button>
                <span className="font-serif font-black text-sm tracking-tight text-slate-900">
                  ELECTRONICS
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-1.5 bg-sky-600 text-white rounded-lg"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  {totalCartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-yellow-400 text-slate-950 font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                      {totalCartItemsCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="p-2.5 bg-white border-b border-slate-100 shrink-0">
              <div className="relative">
                <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={mobileSearch}
                  onChange={(e) => setMobileSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-7 pr-2 py-1 bg-slate-100 rounded-md text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Mobile Hero Banner */}
            <div className="p-3 bg-slate-100 shrink-0">
              <div className="bg-gradient-to-r from-slate-900 to-sky-950 rounded-xl p-3.5 text-white relative overflow-hidden">
                <span className="text-[9px] font-bold bg-yellow-400 text-slate-950 px-1.5 py-0.5 rounded">
                  HOLD UP TO 30% OFF
                </span>
                <h4 className="font-black text-base mt-1 leading-tight">
                  SMARTPHONE & FRESH GROCERY
                </h4>
                <p className="text-[10px] text-slate-300 mt-0.5">
                  Same-Day 2-Hour Express Delivery
                </p>
              </div>
            </div>

            {/* Mobile Category Horizontal Scroll */}
            <div className="px-3 py-1 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none text-[11px] font-bold">
              {['All', 'Electronics', 'Fresh Produce', 'Dairy & Bakery', 'Home & Kitchen'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setMobileCategory(cat)}
                  className={`px-2.5 py-1 rounded-full whitespace-nowrap ${
                    mobileCategory === cat
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Products List (Mobile 2-Column Grid) */}
            <div className="p-3 grid grid-cols-2 gap-2 flex-1">
              {mobileFiltered.slice(0, 8).map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => setActiveQuickViewProduct(prod)}
                  className="bg-white border border-slate-200 rounded-lg p-2 flex flex-col justify-between cursor-pointer hover:border-sky-400"
                >
                  <div className="aspect-square bg-slate-50 rounded overflow-hidden mb-1.5 relative">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1 left-1 bg-slate-900/80 text-white text-[8px] font-bold px-1 rounded">
                      {prod.inStock} Left
                    </span>
                  </div>

                  <div>
                    <h5 className="text-[11px] font-bold text-slate-900 line-clamp-1">
                      {prod.name}
                    </h5>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      ${prod.price.toFixed(2)}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(prod, 1);
                    }}
                    className="mt-1.5 w-full bg-sky-600 text-white py-1 rounded text-[10px] font-bold flex items-center justify-center gap-1"
                  >
                    <Plus className="w-2.5 h-2.5" />
                    <span>Add</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Mobile Bottom Navigation Bar */}
            <div className="p-2 bg-slate-900 text-white flex items-center justify-around text-[10px] font-bold shrink-0">
              <button onClick={() => setMobileCategory('All')} className="text-sky-400 flex flex-col items-center">
                <span>Shop</span>
              </button>
              <button onClick={() => setIsInventoryModalOpen(true)} className="text-slate-400 hover:text-white flex flex-col items-center">
                <span>Stock ({products.reduce((a, b) => a + b.inStock, 0)})</span>
              </button>
              <button onClick={() => setIsCartOpen(true)} className="text-slate-400 hover:text-white flex flex-col items-center">
                <span>Cart (${cartTotal.toFixed(2)})</span>
              </button>
            </div>

          </div>

          {/* Bottom Home Indicator Bar */}
          <div className="w-32 h-1 bg-slate-600 rounded-full mx-auto mt-2"></div>
        </div>

      </div>
    </div>
  );
};
