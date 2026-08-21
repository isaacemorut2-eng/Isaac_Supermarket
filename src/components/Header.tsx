import React, { useState, useRef, useEffect } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Search,
  Gift,
  Heart,
  ShoppingCart,
  Activity,
  Smartphone,
  ShieldCheck,
  ChevronDown,
  X,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES_LIST } from '../data/products';

export const Header: React.FC = () => {
  const {
    products,
    cart,
    wishlist,
    cartTotal,
    totalCartItemsCount,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    setIsCartOpen,
    setIsInventoryModalOpen,
    setIsMobilePreviewActive,
    isMobilePreviewActive,
    setActiveQuickViewProduct,
    isSimulatingLiveShoppers,
  } = useStore();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Compute live search suggestions
  const searchResults = searchQuery.trim().length > 0
    ? products.filter(p => {
        const matchesCategory = selectedCategory === 'All Categories' || p.category === selectedCategory;
        const matchesText = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
          p.sku.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesText;
      }).slice(0, 5)
    : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header id="main-site-header" className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top Utility Bar */}
      <div className="bg-slate-50 border-b border-slate-200/80 text-xs text-slate-600 py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
            <div className="flex items-center gap-1.5 hover:text-sky-600 transition">
              <Phone className="w-3.5 h-3.5 text-sky-600" />
              <span>Support: <strong className="font-semibold text-slate-800">(+01) 123 456 789</strong></span>
            </div>
            <div className="hidden md:flex items-center gap-1.5 hover:text-sky-600 transition">
              <Mail className="w-3.5 h-3.5 text-sky-600" />
              <span>Email: <span className="text-slate-700">support@supermart.com</span></span>
            </div>
            <div className="hidden lg:flex items-center gap-1.5 hover:text-sky-600 transition">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span>Store: <span className="text-slate-700">San Francisco Flagship (Open 7 AM - 11 PM)</span></span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="hidden sm:flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Inventory Sync: Active</span>
            </div>

            <button
              id="toggle-mobile-simulator-btn"
              onClick={() => setIsMobilePreviewActive(prev => !prev)}
              className={`flex items-center gap-1 px-2.5 py-0.5 rounded border text-xs font-semibold transition cursor-pointer ${
                isMobilePreviewActive
                  ? 'bg-sky-600 text-white border-sky-600'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
              title="Toggle Mobile Simulator View from Reference"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{isMobilePreviewActive ? 'Close Mobile Mock' : 'Mobile View Mock'}</span>
            </button>

            <span className="text-slate-300">|</span>
            <button className="hover:text-sky-600 transition cursor-pointer">Sign in or Register</button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex flex-col cursor-pointer" onClick={() => { setSelectedCategory('All Categories'); setSearchQuery(''); }}>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-sky-600 flex items-center justify-center text-white font-black text-xl shadow-md tracking-tighter">
                SM
              </div>
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-none">
                  ELECTRONICS
                </h1>
                <span className="text-[10px] sm:text-[11px] font-sans font-bold tracking-[0.25em] text-sky-600 uppercase">
                  & SUPERMARKET STORE
                </span>
              </div>
            </div>
          </div>

          {/* Quick Mobile Action Icons */}
          <div className="flex md:hidden items-center gap-2">
            <button
              id="mobile-inventory-btn"
              onClick={() => setIsInventoryModalOpen(true)}
              className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Activity className="w-4 h-4 text-emerald-600" />
            </button>
            <button
              id="mobile-cart-btn"
              onClick={() => setIsCartOpen(true)}
              className="p-2 rounded-lg bg-sky-600 text-white relative flex items-center justify-center cursor-pointer"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalCartItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  {totalCartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Center Search Engine */}
        <div ref={searchContainerRef} className="relative w-full md:max-w-xl flex-1">
          <div className="flex items-center border-2 border-sky-600 rounded-lg overflow-hidden bg-white shadow-xs focus-within:ring-2 focus-within:ring-sky-300">
            {/* Category Dropdown */}
            <div className="hidden sm:flex items-center bg-slate-100 border-r border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 shrink-0">
              <select
                id="search-category-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-transparent border-none outline-hidden cursor-pointer text-slate-800 pr-1 text-xs"
              >
                {CATEGORIES_LIST.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Input */}
            <input
              id="header-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Search products, groceries, electronics, aisles or SKUs..."
              className="w-full px-3.5 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden"
            />

            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1.5 text-slate-400 hover:text-slate-600"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Search Button */}
            <button
              id="search-submit-btn"
              className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 flex items-center justify-center transition cursor-pointer"
              aria-label="Submit search"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* Live Search Suggestions Dropdown */}
          {isSearchFocused && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden">
              <div className="bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-500 border-b border-slate-200 flex items-center justify-between">
                <span>Matching Live Products ({searchResults.length})</span>
                <span className="text-[11px] text-sky-600">Click to preview</span>
              </div>
              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                {searchResults.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => {
                      setActiveQuickViewProduct(prod);
                      setIsSearchFocused(false);
                    }}
                    className="p-2.5 hover:bg-sky-50/70 flex items-center justify-between gap-3 cursor-pointer transition"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-10 h-10 object-cover rounded border border-slate-200 shrink-0"
                      />
                      <div>
                        <h4 className="text-sm font-semibold text-slate-800 line-clamp-1">{prod.name}</h4>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                          <span className="text-slate-700 font-bold">${prod.price.toFixed(2)}</span>
                          <span>•</span>
                          <span className="text-sky-700 font-medium">{prod.aisle}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        prod.inStock > 10
                          ? 'bg-emerald-100 text-emerald-800'
                          : prod.inStock > 0
                          ? 'bg-amber-100 text-amber-800 animate-pulse'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {prod.inStock > 0 ? `${prod.inStock} In Stock` : 'Out of stock'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Utility Badges & Triggers */}
        <div className="hidden md:flex items-center gap-4 shrink-0">
          {/* Real-time Inventory Tracker Quick Launcher */}
          <button
            id="open-inventory-modal-btn"
            onClick={() => setIsInventoryModalOpen(true)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 transition cursor-pointer group shadow-xs"
            title="Open Real-time Inventory Tracker & Warehouse Telemetry"
          >
            <div className="relative">
              <Activity className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
              {isSimulatingLiveShoppers && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
              )}
            </div>
            <div className="text-left">
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
                <span>Live Tracker</span>
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block"></span>
              </div>
              <div className="text-xs font-extrabold text-slate-800 leading-none mt-0.5">
                Real-Time Stock
              </div>
            </div>
          </button>

          {/* Wishlist */}
          <button
            id="wishlist-btn"
            onClick={() => {
              if (wishlist.length > 0) {
                const firstWish = products.find(p => p.id === wishlist[0]);
                if (firstWish) setActiveQuickViewProduct(firstWish);
              }
            }}
            className="flex items-center gap-1.5 p-2 rounded-lg text-slate-700 hover:text-sky-600 hover:bg-slate-100 transition relative cursor-pointer"
            title={`Wishlist (${wishlist.length} saved)`}
          >
            <Heart className="w-5 h-5 text-slate-600" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Shopping Cart Drawer Trigger */}
          <button
            id="open-cart-drawer-btn"
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-3 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg transition shadow-sm cursor-pointer group active:scale-98"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5 group-hover:scale-105 transition-transform" />
              {totalCartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-slate-900 text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-sky-600">
                  {totalCartItemsCount}
                </span>
              )}
            </div>
            <div className="text-left">
              <span className="text-[10px] font-semibold text-sky-100 block uppercase tracking-wide">My Cart</span>
              <span className="text-sm font-extrabold leading-none">${cartTotal.toFixed(2)}</span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
