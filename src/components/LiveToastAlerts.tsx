import React from 'react';
import { ShoppingBag, RefreshCw, X, AlertTriangle } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const LiveToastAlerts: React.FC = () => {
  const { liveAlerts, dismissAlert } = useStore();

  if (liveAlerts.length === 0) return null;

  return (
    <div className="fixed bottom-5 left-5 z-40 flex flex-col gap-2 max-w-xs pointer-events-none">
      {liveAlerts.slice(0, 3).map((alert) => (
        <div
          key={alert.id}
          className="pointer-events-auto bg-slate-900/95 text-white p-3 rounded-xl shadow-xl border border-slate-700/80 backdrop-blur-md flex items-start gap-2.5 text-xs animate-in slide-in-from-bottom-3 duration-300"
        >
          <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400 shrink-0 mt-0.5">
            {alert.type === 'sale' ? (
              <ShoppingBag className="w-3.5 h-3.5 text-sky-400" />
            ) : alert.type === 'restock' ? (
              <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1 mb-0.5">
              <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">
                {alert.type === 'sale' ? 'Live Shopper Order' : 'Warehouse Stock Sync'}
              </span>
              <span className="text-[9px] font-mono text-slate-400">{alert.time}</span>
            </div>
            <p className="text-[11px] text-slate-200 leading-snug line-clamp-2">
              {alert.message}
            </p>
          </div>

          <button
            onClick={() => dismissAlert(alert.id)}
            className="text-slate-400 hover:text-white p-0.5 rounded transition"
            aria-label="Dismiss alert"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
};
