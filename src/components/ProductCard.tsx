import React, { useState } from 'react';
import {
  ShoppingCart,
  Heart,
  Eye,
  Star,
  Check,
  Zap,
  MapPin,
  Leaf,
  Plus,
  Minus,
  AlertTriangle,
} from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    cart,
    wishlist,
    addToCart,
    updateCartQuantity,
    toggleWishlist,
    setActiveQuickViewProduct,
  } = useStore();

  const [addedToast, setAddedToast] = useState(false);

  const cartItem = cart.find(ci => ci.product.id === product.id);
  const isWishlisted = wishlist.includes(product.id);
  const isOutOfStock = product.inStock <= 0;
  const isLowStock = product.inStock > 0 && product.inStock <= 8;

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    const res = addToCart(product, 1);
    if (res.success) {
      setAddedToast(true);
      setTimeout(() => setAddedToast(false), 1800);
    }
  };

  return (
    <div
      id={`product-card-${product.id}`}
      className="group bg-white rounded-xl border border-slate-200 hover:border-sky-400 hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden relative"
    >
      {/* Top Media Container */}
      <div className="relative aspect-4/3 bg-slate-50 overflow-hidden cursor-pointer" onClick={() => setActiveQuickViewProduct(product)}>
        {/* Product Image with smooth zoom on hover */}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badges Top Left */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {discountPercent > 0 && (
            <span className="bg-rose-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded shadow-xs tracking-wider">
              -{discountPercent}%
            </span>
          )}
          {product.isOrganic && (
            <span className="bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.5 rounded shadow-xs flex items-center gap-0.5">
              <Leaf className="w-2.5 h-2.5" />
              <span>Organic</span>
            </span>
          )}
          {product.isFlashDeal && (
            <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-1.5 py-0.5 rounded shadow-xs flex items-center gap-0.5">
              <Zap className="w-2.5 h-2.5 fill-current" />
              <span>Flash</span>
            </span>
          )}
        </div>

        {/* Floating Actions Top Right */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            aria-label="Add to Wishlist"
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-xs transition shadow-xs cursor-pointer ${
              isWishlisted
                ? 'bg-rose-500 text-white hover:bg-rose-600'
                : 'bg-white/90 text-slate-600 hover:bg-white hover:text-rose-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveQuickViewProduct(product);
            }}
            aria-label="Quick View"
            className="w-8 h-8 rounded-full bg-white/90 text-slate-600 hover:bg-white hover:text-sky-600 flex items-center justify-center backdrop-blur-xs transition shadow-xs cursor-pointer"
            title="Quick view product details"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Real-time stock badge overlay */}
        <div className="absolute bottom-2 left-2 right-2 z-10">
          <div
            className={`text-[11px] font-bold px-2.5 py-1 rounded-md shadow-xs backdrop-blur-md flex items-center justify-between ${
              isOutOfStock
                ? 'bg-slate-900/90 text-rose-300 border border-rose-500/30'
                : isLowStock
                ? 'bg-amber-500/95 text-slate-950 font-black border border-amber-400'
                : 'bg-emerald-800/90 text-emerald-100 border border-emerald-400/30'
            }`}
          >
            <span className="flex items-center gap-1">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isOutOfStock ? 'bg-rose-500' : isLowStock ? 'bg-slate-950 animate-ping' : 'bg-emerald-400'
                }`}
              />
              {isOutOfStock ? 'Out of Stock' : isLowStock ? `Only ${product.inStock} Left!` : `In Stock: ${product.inStock}`}
            </span>
            <span className="text-[10px] text-white/90 font-mono tracking-tight">{product.aisle}</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Category & Unit */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium mb-1">
            <span className="text-sky-700 font-semibold uppercase tracking-wider">{product.category}</span>
            <span>{product.unit}</span>
          </div>

          {/* Title */}
          <h3
            onClick={() => setActiveQuickViewProduct(product)}
            className="font-bold text-sm text-slate-900 line-clamp-2 leading-snug cursor-pointer hover:text-sky-600 transition mb-2"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(product.rating) ? 'fill-current' : 'text-slate-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-slate-700">{product.rating.toFixed(1)}</span>
            <span className="text-[11px] text-slate-400">({product.reviewCount})</span>
          </div>
        </div>

        {/* Pricing & Add to Cart */}
        <div>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-black text-slate-900 font-serif">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-slate-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Cart Controls */}
          {cartItem ? (
            <div className="flex items-center justify-between bg-sky-50 border border-sky-300 rounded-lg p-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateCartQuantity(product.id, cartItem.quantity - 1);
                }}
                className="w-7 h-7 rounded bg-white hover:bg-sky-600 hover:text-white text-sky-700 flex items-center justify-center font-bold shadow-2xs transition cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>

              <span className="text-xs font-black text-sky-950 font-mono">
                {cartItem.quantity} in cart
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (cartItem.quantity < product.inStock) {
                    updateCartQuantity(product.id, cartItem.quantity + 1);
                  }
                }}
                disabled={cartItem.quantity >= product.inStock}
                className="w-7 h-7 rounded bg-white hover:bg-sky-600 hover:text-white disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-400 text-sky-700 flex items-center justify-center font-bold shadow-2xs transition cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              id={`add-to-cart-btn-${product.id}`}
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`w-full py-2.5 px-3 rounded-lg text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-98 ${
                isOutOfStock
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
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
                  <span>Added to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
