import React from 'react';
import {
  Sparkles,
  Flame,
  TrendingUp,
  Clock,
  Filter,
  Leaf,
  Layers,
  ArrowUpDown,
  RotateCcw,
  Activity,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { CATEGORIES_LIST } from '../data/products';

export const ProductGrid: React.FC = () => {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    onlyOrganic,
    setOnlyOrganic,
    setIsInventoryModalOpen,
  } = useStore();

  // Filter products based on selected tab, category, search, and organic flag
  const filteredProducts = products.filter((p) => {
    // Category match
    if (selectedCategory !== 'All Categories' && p.category !== selectedCategory) {
      return false;
    }

    // Organic filter
    if (onlyOrganic && !p.isOrganic) {
      return false;
    }

    // Search query match
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchTag = p.tags.some((t) => t.toLowerCase().includes(q));
      const matchAisle = p.aisle.toLowerCase().includes(q);
      const matchSku = p.sku.toLowerCase().includes(q);
      if (!matchName && !matchTag && !matchAisle && !matchSku) {
        return false;
      }
    }

    // Active tab filter
    if (activeTab === 'featured') return !!p.isFeatured;
    if (activeTab === 'popular') return !!p.isPopular;
    if (activeTab === 'new') return !!p.isNew;
    if (activeTab === 'flash') return !!p.isFlashDeal;
    if (activeTab === 'low_stock') return p.inStock > 0 && p.inStock <= 10;

    return true;
  });

  // Sort filtered products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'stock_asc') return a.inStock - b.inStock;
    return 0; // default featured
  });

  // Stock summary numbers
  const totalStockInView = sortedProducts.reduce((sum, p) => sum + p.inStock, 0);
  const lowStockCount = sortedProducts.filter(p => p.inStock > 0 && p.inStock <= 8).length;

  return (
    <section id="catalog-products-section" className="bg-slate-50 py-8 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Main Section Header with Tabs (Matching the reference image style) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b-2 border-slate-200 gap-4 mb-6 pb-2">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2.5 text-xs sm:text-sm font-extrabold tracking-wider uppercase whitespace-nowrap transition-all border-b-2 -mb-2.5 cursor-pointer ${
                activeTab === 'all'
                  ? 'border-sky-600 text-sky-600 bg-white/60'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              All Products
            </button>

            <button
              onClick={() => setActiveTab('featured')}
              className={`px-4 py-2.5 text-xs sm:text-sm font-extrabold tracking-wider uppercase whitespace-nowrap transition-all border-b-2 -mb-2.5 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'featured'
                  ? 'border-sky-600 text-sky-600 bg-white/60'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Featured</span>
            </button>

            <button
              onClick={() => setActiveTab('popular')}
              className={`px-4 py-2.5 text-xs sm:text-sm font-extrabold tracking-wider uppercase whitespace-nowrap transition-all border-b-2 -mb-2.5 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'popular'
                  ? 'border-sky-600 text-sky-600 bg-white/60'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-sky-600" />
              <span>Most Popular</span>
            </button>

            <button
              onClick={() => setActiveTab('flash')}
              className={`px-4 py-2.5 text-xs sm:text-sm font-extrabold tracking-wider uppercase whitespace-nowrap transition-all border-b-2 -mb-2.5 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'flash'
                  ? 'border-rose-600 text-rose-600 bg-rose-50/50'
                  : 'border-transparent text-slate-600 hover:text-rose-600'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              <span>Flash Deals</span>
            </button>

            <button
              onClick={() => setActiveTab('low_stock')}
              className={`px-4 py-2.5 text-xs sm:text-sm font-extrabold tracking-wider uppercase whitespace-nowrap transition-all border-b-2 -mb-2.5 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'low_stock'
                  ? 'border-amber-600 text-amber-700 bg-amber-50/50'
                  : 'border-transparent text-slate-600 hover:text-amber-700'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-amber-500" />
              <span>Low Stock ({lowStockCount})</span>
            </button>
          </div>

          {/* Right Inventory Telemetry Status */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Showing <strong>{sortedProducts.length}</strong> items</span>
              <span className="text-slate-300">•</span>
              <span>Total Units: <strong>{totalStockInView}</strong></span>
            </div>

            <button
              onClick={() => setIsInventoryModalOpen(true)}
              className="text-xs font-bold text-sky-700 bg-sky-100/80 hover:bg-sky-200 px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5"
            >
              <Activity className="w-3.5 h-3.5 text-sky-600" />
              <span>Stock Matrix</span>
            </button>
          </div>
        </div>

        {/* Filter & Sort Controls Bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-2xs flex flex-wrap items-center justify-between gap-4">
          {/* Category Chips */}
          <div className="flex items-center gap-1.5 flex-wrap flex-1">
            <span className="text-xs font-bold text-slate-400 uppercase mr-1">Dept:</span>
            {CATEGORIES_LIST.slice(0, 6).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs font-semibold px-3 py-1 rounded-full transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Secondary Controls: Organic Toggle & Sort Dropdown */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Organic Toggle */}
            <button
              onClick={() => setOnlyOrganic(!onlyOrganic)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer border ${
                onlyOrganic
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
            >
              <Leaf className="w-3.5 h-3.5" />
              <span>Organic Only</span>
            </button>

            {/* Sort Selector */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-semibold">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                id="catalog-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent border-none outline-hidden cursor-pointer font-bold text-slate-800 text-xs pr-1"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Customer Rated</option>
                <option value="stock_asc">Inventory: Low to High</option>
              </select>
            </div>

            {/* Clear Filters if active */}
            {(selectedCategory !== 'All Categories' || onlyOrganic || searchQuery || activeTab !== 'all') && (
              <button
                onClick={() => {
                  setSelectedCategory('All Categories');
                  setOnlyOrganic(false);
                  setSearchQuery('');
                  setActiveTab('all');
                }}
                className="p-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg transition flex items-center gap-1 cursor-pointer"
                title="Reset all filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {sortedProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-xs">
            <div className="w-14 h-14 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-4">
              <Layers className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No Products Match Your Filters</h3>
            <p className="text-xs text-slate-500 mb-6">
              We couldn't find items matching "{searchQuery}" in "{selectedCategory}". Try clearing your filters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All Categories');
                setOnlyOrganic(false);
                setSearchQuery('');
                setActiveTab('all');
              }}
              className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold px-5 py-2.5 rounded-lg transition cursor-pointer"
            >
              Reset Filters & View All
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
