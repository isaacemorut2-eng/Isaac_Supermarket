import React from 'react';
import {
  CheckCircle2,
  Package,
  Truck,
  Printer,
  ShoppingBag,
  Activity,
  X,
  MapPin,
  Clock,
  QrCode,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const OrderSuccessModal: React.FC = () => {
  const {
    currentOrderSuccess,
    setCurrentOrderSuccess,
    setIsInventoryModalOpen,
  } = useStore();

  if (!currentOrderSuccess) return null;

  const order = currentOrderSuccess;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="order-success-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white w-full max-w-2xl max-h-[92vh] rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-emerald-600 text-white p-6 text-center relative">
          <button
            onClick={() => setCurrentOrderSuccess(null)}
            className="absolute top-4 right-4 text-emerald-200 hover:text-white p-1 rounded-lg hover:bg-emerald-700 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 bg-white/20 text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>

          <span className="text-xs uppercase font-bold tracking-widest text-emerald-100 font-mono">
            Payment Verified & Authorized
          </span>
          <h2 className="text-2xl font-black tracking-tight text-white mt-1">
            Order Confirmed & Picking!
          </h2>
          <p className="text-xs text-emerald-100 mt-1">
            Order ID: <strong className="font-mono text-white">{order.id}</strong> | Tracking: <strong className="font-mono text-white">{order.trackingNumber}</strong>
          </p>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Tracking Timeline */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-3">
              <span className="flex items-center gap-1 text-slate-800 font-bold">
                <Clock className="w-3.5 h-3.5 text-sky-600" />
                <span>Estimated Express Arrival: <strong>{order.estimatedDelivery}</strong></span>
              </span>
              <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-mono font-bold">
                {order.status}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold">
              <div className="flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center mb-1 shadow-xs">
                  ✓
                </div>
                <span className="text-slate-800">Order Placed</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-sky-600 text-white flex items-center justify-center mb-1 shadow-xs animate-pulse">
                  <Package className="w-3.5 h-3.5" />
                </div>
                <span className="text-sky-700 font-black">Picking Aisle</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center mb-1">
                  <Truck className="w-3.5 h-3.5" />
                </div>
                <span className="text-slate-400">On Van</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <span className="text-slate-400">Delivered</span>
              </div>
            </div>
          </div>

          {/* Delivery Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <h4 className="font-extrabold text-slate-900 mb-2 uppercase text-[11px] tracking-wider text-slate-500">
                Delivery Destination
              </h4>
              <p className="font-bold text-slate-800">{order.deliveryAddress.fullName}</p>
              <p className="text-slate-600">{order.deliveryAddress.address}</p>
              <p className="text-slate-600">{order.deliveryAddress.city}, {order.deliveryAddress.zipCode}</p>
              <p className="text-slate-500 mt-1">Phone: {order.deliveryAddress.phone}</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <h4 className="font-extrabold text-slate-900 mb-2 uppercase text-[11px] tracking-wider text-slate-500">
                Payment Breakdown
              </h4>
              <p className="text-slate-600">Method: <strong className="text-slate-800 uppercase font-mono">{order.paymentMethod.replace('_', ' ')}</strong></p>
              <p className="text-slate-600">Status: <span className="text-emerald-700 font-bold">256-Bit SSL Paid</span></p>
              <p className="text-slate-600">Coupon: <span className="font-mono font-bold text-slate-800">{order.appliedCoupon || 'None'}</span></p>
              <p className="text-slate-900 font-bold text-sm mt-1">Total: ${order.total.toFixed(2)}</p>
            </div>
          </div>

          {/* Purchased Items List */}
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <div className="bg-slate-100 px-4 py-2 font-bold text-slate-700 text-[11px] uppercase">
              Purchased Supermarket & Electronics Items
            </div>
            <div className="divide-y divide-slate-100 max-h-40 overflow-y-auto p-2">
              {order.items.map((item) => (
                <div key={item.product.id} className="py-2 px-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-8 h-8 rounded object-cover border border-slate-200 shrink-0"
                    />
                    <div>
                      <div className="font-bold text-slate-800 line-clamp-1">{item.product.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {item.quantity} × ${item.product.price.toFixed(2)} • {item.product.aisle}
                      </div>
                    </div>
                  </div>
                  <div className="font-bold text-slate-900 font-mono">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => {
              setCurrentOrderSuccess(null);
              setIsInventoryModalOpen(true);
            }}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1.5 cursor-pointer"
          >
            <Activity className="w-4 h-4 text-emerald-600" />
            <span>Verify Live Inventory Deduction in Warehouse Monitor →</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 transition cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>Print Invoice</span>
            </button>

            <button
              onClick={() => setCurrentOrderSuccess(null)}
              className="flex-1 sm:flex-none px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition cursor-pointer shadow-sm"
            >
              Continue Shopping
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
