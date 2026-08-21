import React from 'react';
import { Truck, RotateCcw, CreditCard, Headphones, ShieldCheck, CheckCircle2 } from 'lucide-react';

const VALUE_PROPS = [
  {
    id: 'free-delivery',
    title: 'FREE DELIVERY',
    subtitle: 'Free 2-hour express delivery on all orders over $35 with chilled packaging.',
    icon: <Truck className="w-8 h-8 text-sky-600" />,
    badge: 'Express 2-Hour',
  },
  {
    id: 'free-returns',
    title: '24 DAYS FREE RETURNS',
    subtitle: 'No questions asked 100% money back guarantee on fresh produce & tech.',
    icon: (
      <div className="w-8 h-8 rounded-full border-2 border-sky-600 flex items-center justify-center font-bold text-sky-600 text-xs">
        24
      </div>
    ),
    badge: '100% Guaranteed',
  },
  {
    id: 'secure-payment',
    title: 'CASH ON DELIVERY & CARDS',
    subtitle: '256-Bit SSL encrypted gateway with 3D Secure, PayPal, Apple Pay & COD.',
    icon: <ShieldCheck className="w-8 h-8 text-sky-600" />,
    badge: 'PCI-DSS Compliant',
  },
  {
    id: 'live-support',
    title: '24/7 LIVE SUPPORT',
    subtitle: 'Dedicated supermarket customer care, live inventory inquiries & tracking.',
    icon: <Headphones className="w-8 h-8 text-sky-600" />,
    badge: 'Always Online',
  },
];

export const ValueProps: React.FC = () => {
  return (
    <section id="value-propositions-section" className="bg-white py-6 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {VALUE_PROPS.map((prop) => (
            <div
              key={prop.id}
              className="bg-slate-50 hover:bg-sky-50/50 border border-slate-200/80 hover:border-sky-300 rounded-xl p-5 transition-all duration-200 flex items-start gap-4 shadow-2xs group"
            >
              <div className="p-3 bg-white rounded-lg border border-slate-200 group-hover:border-sky-300 shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                {prop.icon}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <h4 className="font-extrabold text-sm text-slate-900 tracking-tight">
                    {prop.title}
                  </h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {prop.subtitle}
                </p>
                <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-sky-700 bg-sky-100/70 px-2 py-0.5 rounded">
                  <CheckCircle2 className="w-3 h-3 text-sky-600" />
                  <span>{prop.badge}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
