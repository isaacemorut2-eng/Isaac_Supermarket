import React, { useState } from 'react';
import {
  Mail,
  Send,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  CreditCard,
  Truck,
  Heart,
  Check,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { WAREHOUSE_AISLES } from '../data/products';

export const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { setSelectedCategory, setIsInventoryModalOpen } = useStore();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setIsSubscribed(true);
    setTimeout(() => {
      setIsSubscribed(false);
      setNewsletterEmail('');
    }, 3000);
  };

  return (
    <footer id="main-site-footer" className="bg-slate-900 text-slate-300 pt-12 pb-6 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Newsletter & Promo Row */}
        <div className="bg-gradient-to-r from-sky-900 to-slate-800 rounded-2xl p-6 sm:p-8 mb-12 border border-sky-800/60 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-md">
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-yellow-400 bg-yellow-400/10 px-2.5 py-0.5 rounded-full mb-2">
              <span>Exclusive Weekly Catalog</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Get $15 OFF Your First Supermarket Order
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Subscribe to get flash inventory alerts, farm harvest announcements, and secret weekend discount promo codes.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full md:w-auto flex-1 max-w-md flex gap-2">
            <div className="relative flex-1">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950/80 border border-sky-700/60 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shrink-0 shadow-md"
            >
              {isSubscribed ? (
                <>
                  <Check className="w-4 h-4 text-emerald-900" />
                  <span>Subscribed!</span>
                </>
              ) : (
                <>
                  <span>Join Club</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* 4 Main Footer Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-800 text-xs">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white font-black text-lg">
                SM
              </div>
              <span className="font-serif text-xl font-extrabold text-white tracking-tight">
                ELECTRONICS & SUPERMART
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Premier omni-channel supermarket & tech department store. Delivering fresh farm produce, groceries, and premium consumer electronics with real-time inventory telemetry and 2-hour express dispatch.
            </p>
            <div className="space-y-1.5 text-slate-300">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-sky-400" />
                <span>(+01) 123 456 789</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>San Francisco Flagship, California</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Open Daily: 7:00 AM - 11:00 PM PST</span>
              </div>
            </div>
          </div>

          {/* Supermarket Departments */}
          <div>
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-4 border-l-2 border-sky-500 pl-2">
              Departments & Aisles
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={() => setSelectedCategory('Fresh Produce')} className="hover:text-white transition cursor-pointer">
                  Fresh Produce & Organic Fruits
                </button>
              </li>
              <li>
                <button onClick={() => setSelectedCategory('Dairy & Bakery')} className="hover:text-white transition cursor-pointer">
                  Pasture-Raised Dairy & Fresh Bakery
                </button>
              </li>
              <li>
                <button onClick={() => setSelectedCategory('Meat & Seafood')} className="hover:text-white transition cursor-pointer">
                  USDA Prime Butcher & Wild Seafood
                </button>
              </li>
              <li>
                <button onClick={() => setSelectedCategory('Electronics')} className="hover:text-white transition cursor-pointer">
                  Ultra 5G Smartphones & Audio
                </button>
              </li>
              <li>
                <button onClick={() => setSelectedCategory('Home & Kitchen')} className="hover:text-white transition cursor-pointer">
                  Smart Kitchen & Espresso Appliances
                </button>
              </li>
              <li>
                <button onClick={() => setSelectedCategory('Pantry & Groceries')} className="hover:text-white transition cursor-pointer">
                  Mediterranean Pantry & Coffee Roastery
                </button>
              </li>
            </ul>
          </div>

          {/* Real-time Logistics & Warehouse Hub */}
          <div>
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-4 border-l-2 border-emerald-500 pl-2">
              Warehouse Telemetry
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={() => setIsInventoryModalOpen(true)} className="text-emerald-400 hover:text-emerald-300 font-semibold transition cursor-pointer flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Live Inventory Monitor</span>
                </button>
              </li>
              <li><span>Aisle E: Tech Depot (RFID Scanned)</span></li>
              <li><span>Aisle F: Fresh Vault (Climate 36°F)</span></li>
              <li><span>Aisle D: Chilled Dairy & Oven Dock</span></li>
              <li><span>Aisle P: Ambient Dry Goods</span></li>
              <li><span>Automated Stock Replenishment System</span></li>
            </ul>
          </div>

          {/* Customer Care & Security */}
          <div>
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-4 border-l-2 border-yellow-500 pl-2">
              Security & Guarantees
            </h4>
            <div className="space-y-2.5 text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>256-Bit SSL Encrypted Payment</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Express 2-Hour Temperature-Controlled</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-yellow-400 shrink-0" />
                <span>Visa, MC, Amex, PayPal, COD</span>
              </div>
              <div className="p-2.5 bg-slate-950/70 rounded-lg border border-slate-800 text-[11px] mt-2">
                <span className="text-white font-bold block mb-0.5">Need Help with an Order?</span>
                <span>Call our toll-free supermarket dispatch desk 24/7.</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Payment Methods */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} SuperMart Electronics & Supermarket Store. All rights reserved.
          </div>

          <div className="flex items-center gap-3 font-mono font-bold text-slate-400 text-xs">
            <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700">VISA</span>
            <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700">MASTERCARD</span>
            <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700">AMEX</span>
            <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700">PAYPAL</span>
            <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700">APPLE PAY</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
