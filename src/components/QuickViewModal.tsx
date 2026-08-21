import React, { useState } from 'react';
import {
  X,
  Star,
  ShoppingCart,
  Heart,
  ShieldCheck,
  Truck,
  Check,
  Minus,
  Plus,
  Leaf,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const QuickViewModal: React.FC = () => {
  const {
    activeQuickViewProduct,
    setActiveQuickViewProduct,
    addToCart,
    wishlist,
    toggleWishlist,
    products,
  } = useStore();

  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);

  if (!activeQuickViewProduct) return null;

  // Grab live product instance for reactive stock level
  const liveProduct = products.find(p => p.id === activeQuickViewProduct.id) || activeQuickViewProduct;
  const isWishlisted = wishlist.includes(liveProduct.id);
  const isOutOfStock = liveProduct.inStock <= 0;
  const isLowStock = liveProduct.inStock > 0 && liveProduct.inStock <= 8;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    const res = addToCart(liveProduct, quantity);
    if (res.success) {
      setAddedToast(true);
      setTimeout(() => {
        setAddedToast(false);
      }, 2000);
    }
  };

  return (
    <div
      id="product-quick-view-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <span>{liveProduct.category}</span>
            <span>›</span>
            <span className="text-sky-700 font-bold">{liveProduct.subcategory || 'Catalog Item'}</span>
          </div>

          <button
            onClick={() => setActiveQuickViewProduct(null)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition cursor-pointer"
            aria-label="Close product quick view"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Image & Badges */}
          <div className="space-y-3">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-2xs">
              <img
                src={liveProduct.image}
                alt={liveProduct.name}
                className="w-full h-full object-cover"
              />

              {liveProduct.isOrganic && (
                <div className="absolute top-3 left-3 bg-emerald-600 text-white font-bold text-xs px-2.5 py-1 rounded shadow-md flex items-center gap-1">
                  <Leaf className="w-3 h-3" />
                  <span>100% Certified Organic</span>
                </div>
              )}
            </div>

            {/* Warehouse Location Info */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-sky-600" />
                <span className="font-semibold text-slate-700">Storage Location:</span>
              </div>
              <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                {liveProduct.aisle}
              </span>
            </div>
          </div>

          {/* Details & Controls */}
          <div className="flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono text-slate-400">SKU: {liveProduct.sku}</span>
                
                {/* Real-time stock status */}
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  isOutOfStock
                    ? 'bg-rose-100 text-rose-800'
                    : isLowStock
                    ? 'bg-amber-100 text-amber-900 font-extrabold animate-pulse'
                    : 'bg-emerald-100 text-emerald-900'
                }`}>
                  {isOutOfStock ? 'Out of Stock' : isLowStock ? `⚡ Only ${liveProduct.inStock} Left!` : `In Stock: ${liveProduct.inStock} units`}
                </span>
              </div>

              <h2 className="text-xl font-bold text-slate-900 leading-snug mb-2 font-serif">
                {liveProduct.name}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(liveProduct.rating) ? 'fill-current' : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-700">{liveProduct.rating.toFixed(1)}</span>
                <span className="text-xs text-slate-400">({liveProduct.reviewCount} customer reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2 mb-4 pb-3 border-b border-slate-200">
                <span className="text-2xl font-black text-slate-900 font-serif">
                  ${liveProduct.price.toFixed(2)}
                </span>
                {liveProduct.originalPrice && (
                  <span className="text-sm text-slate-400 line-through">
                    ${liveProduct.originalPrice.toFixed(2)}
                  </span>
                )}
                <span className="text-xs text-slate-500 font-medium">/ {liveProduct.unit}</span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {liveProduct.description}
              </p>

              {/* Specifications Table */}
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs mb-4">
                <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider mb-2">
                  Product Details & Specifications
                </h4>
                <div className="space-y-1 divide-y divide-slate-200/60">
                  {Object.entries(liveProduct.specifications).map(([k, v]) => (
                    <div key={k} className="pt-1 flex justify-between">
                      <span className="text-slate-500">{k}</span>
                      <span className="font-semibold text-slate-800 text-right">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="space-y-3 pt-2 border-t border-slate-200">
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-slate-300 rounded-lg bg-slate-50 p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded bg-white hover:bg-slate-200 flex items-center justify-center font-bold text-slate-700 transition"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center font-bold text-xs font-mono text-slate-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(liveProduct.inStock, quantity + 1))}
                    disabled={quantity >= liveProduct.inStock}
                    className="w-8 h-8 rounded bg-white hover:bg-slate-200 flex items-center justify-center font-bold text-slate-700 disabled:opacity-40 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition cursor-pointer shadow-md active:scale-98 ${
                    isOutOfStock
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : addedToast
                      ? 'bg-emerald-600 text-white'
                      : 'bg-sky-600 hover:bg-sky-700 text-white'
                  }`}
                >
                  {isOutOfStock ? (
                    <span>Out of Stock</span>
                  ) : addedToast ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Shopping Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Cart • ${(liveProduct.price * quantity).toFixed(2)}</span>
                    </>
                  )}
                </button>

                {/* Wishlist toggle */}
                <button
                  onClick={() => toggleWishlist(liveProduct.id)}
                  className={`p-3 rounded-xl border transition cursor-pointer ${
                    isWishlisted
                      ? 'bg-rose-50 border-rose-300 text-rose-600'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium pt-1">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-sky-600" />
                  <span>Free 2-Hour Express Delivery on $35+</span>
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>24-Day Free Returns</span>
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
