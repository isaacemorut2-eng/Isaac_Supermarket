import React, { useState } from 'react';
import {
  X,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Tag,
  Check,
  AlertCircle,
  Truck,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartSubtotal,
    cartDiscount,
    deliveryFee,
    cartTax,
    cartTotal,
    appliedCoupon,
    couponError,
    applyCoupon,
    removeCoupon,
    setIsCheckoutOpen,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');

  if (!isCartOpen) return null;

  const freeShippingThreshold = 35;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const freeShippingPercent = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const success = applyCoupon(couponInput);
    if (success) setCouponInput('');
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div
      id="shopping-cart-drawer"
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      {/* Click outside to close */}
      <div className="flex-1" onClick={() => setIsCartOpen(false)} />

      {/* Drawer Container */}
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 overflow-hidden animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-sky-600" />
            <h3 className="font-bold text-base text-slate-900">
              Shopping Cart ({cart.reduce((acc, i) => acc + i.quantity, 0)})
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 transition mr-2 cursor-pointer"
              >
                Clear All
              </button>
            )}
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition cursor-pointer"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-sky-50 px-5 py-2.5 border-b border-sky-100 text-xs">
          <div className="flex items-center justify-between text-slate-700 font-semibold mb-1">
            <span className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-sky-600" />
              {amountNeededForFreeShipping === 0 ? (
                <strong className="text-emerald-700">🎉 Free 2-Hour Express Delivery Unlocked!</strong>
              ) : (
                <span>Add <strong>${amountNeededForFreeShipping.toFixed(2)}</strong> for Free Delivery</span>
              )}
            </span>
            <span className="font-mono text-sky-800 font-bold">{freeShippingPercent}%</span>
          </div>

          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                amountNeededForFreeShipping === 0 ? 'bg-emerald-500' : 'bg-sky-600'
              }`}
              style={{ width: `${freeShippingPercent}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3 divide-y divide-slate-100">
          {cart.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <ShoppingCart className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-slate-800 mb-1">Your cart is currently empty</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto mb-4">
                Explore our supermarket fresh groceries and tech electronics to add items to your cart.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition cursor-pointer"
              >
                Start Shopping Now
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const liveStock = item.product.inStock;
              const isMaxStockReached = item.quantity >= liveStock;

              return (
                <div key={item.product.id} className="pt-3 flex gap-3 items-start">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-lg border border-slate-200 shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-bold text-xs text-slate-900 line-clamp-1">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-slate-400 hover:text-rose-600 transition p-0.5"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-[11px] text-slate-500 font-mono mt-0.5 flex items-center justify-between">
                      <span>${item.product.price.toFixed(2)} / {item.product.unit}</span>
                      <span className="text-sky-700 font-medium">{item.product.aisle}</span>
                    </div>

                    {isMaxStockReached && (
                      <div className="text-[10px] text-amber-700 font-bold mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 text-amber-600" />
                        <span>Max warehouse stock reached ({liveStock} units)</span>
                      </div>
                    )}

                    {/* Quantity & Item Subtotal */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-slate-200 rounded-md bg-slate-50">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-200 rounded-l transition cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center font-bold text-xs font-mono text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          disabled={isMaxStockReached}
                          className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-200 rounded-r disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="font-extrabold text-xs text-slate-900 font-mono">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer with Breakdown & Checkout Button */}
        {cart.length > 0 && (
          <div className="border-t border-slate-200 bg-slate-50 p-5 space-y-3">
            {/* Coupon Code Input */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="Promo code: SAVE20"
                  className="w-full pl-8 pr-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold uppercase text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                />
              </div>
              <button
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition cursor-pointer"
              >
                Apply
              </button>
            </form>

            {/* Applied Coupon Pill */}
            {appliedCoupon && (
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-lg text-xs font-semibold">
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Coupon <strong>{appliedCoupon.code}</strong> Applied (-{appliedCoupon.discountPercent}%)</span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-rose-600 hover:underline text-[11px] font-bold"
                >
                  Remove
                </button>
              </div>
            )}

            {couponError && (
              <div className="text-[11px] text-rose-600 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{couponError}</span>
              </div>
            )}

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-slate-600 font-medium pt-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-slate-900 font-bold">${cartSubtotal.toFixed(2)}</span>
              </div>

              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span className="font-mono">-${cartDiscount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated Delivery</span>
                <span className="font-mono text-slate-900 font-bold">
                  {deliveryFee === 0 ? <span className="text-emerald-600">FREE</span> : `$${deliveryFee.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Estimated Sales Tax (8.25%)</span>
                <span className="font-mono text-slate-900 font-bold">${cartTax.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-base font-extrabold text-slate-900 border-t border-slate-200 pt-2">
                <span>Estimated Total</span>
                <span className="font-mono text-sky-700 font-serif">${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Proceed to Checkout Trigger */}
            <button
              id="proceed-to-checkout-btn"
              onClick={handleProceedToCheckout}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-sm py-3 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition cursor-pointer group active:scale-98"
            >
              <ShieldCheck className="w-4 h-4 text-sky-200" />
              <span>Proceed to Secure Payment</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>256-Bit SSL Encrypted & PCI-DSS Compliant</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
