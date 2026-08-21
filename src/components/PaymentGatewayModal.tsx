import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  CreditCard,
  Truck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Smartphone,
  Layers,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStore } from '../context/StoreContext';
import { PaymentFormData, PaymentMethodType } from '../types';

export const PaymentGatewayModal: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    cartDiscount,
    deliveryFee,
    cartTax,
    cartTotal,
    appliedCoupon,
    isCheckoutOpen,
    setIsCheckoutOpen,
    processPayment,
  } = useStore();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('credit_card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [show3DSecureDialog, setShow3DSecureDialog] = useState(false);
  const [otpCode, setOtpCode] = useState('123456');
  const [gatewayError, setGatewayError] = useState<string | null>(null);

  const [formData, setFormData] = useState<PaymentFormData>({
    cardNumber: '4532 8821 9043 7712',
    cardHolder: 'ALEXANDER MORGAN',
    expiryMonth: '09',
    expiryYear: '28',
    cvv: '842',
    saveCard: true,
    email: 'alex.morgan@example.com',
    phone: '+1 (555) 234-8901',
    fullName: 'Alexander Morgan',
    address: '742 Evergreen Terrace',
    apartment: 'Apt 4B',
    city: 'San Francisco',
    zipCode: '94102',
    country: 'United States',
    deliverySlot: 'Express 1-2 Hours (Immediate Warehouse Dispatch)',
    deliveryNotes: 'Please ring bell 4B or leave in refrigerated insulated box at door.',
  });

  if (!isCheckoutOpen) return null;

  // Format card number with spaces every 4 digits
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    let formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setFormData(prev => ({ ...prev, cardNumber: formatted }));
  };

  // Detect card issuer
  const getCardIssuer = (num: string) => {
    const clean = num.replace(/\s/g, '');
    if (clean.startsWith('4')) return { brand: 'VISA', color: 'from-blue-700 to-indigo-900' };
    if (clean.startsWith('5')) return { brand: 'MASTERCARD', color: 'from-orange-600 to-amber-900' };
    if (clean.startsWith('3')) return { brand: 'AMEX', color: 'from-emerald-700 to-teal-950' };
    return { brand: 'DEBIT / CREDIT', color: 'from-slate-800 to-slate-950' };
  };

  const cardIssuer = getCardIssuer(formData.cardNumber);

  const handleTriggerPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setGatewayError(null);

    // Basic validation
    if (!formData.fullName || !formData.address || !formData.city || !formData.zipCode) {
      setGatewayError('Please complete all required delivery address fields.');
      return;
    }

    if (paymentMethod === 'credit_card') {
      const cleanNum = formData.cardNumber.replace(/\s/g, '');
      if (cleanNum.length < 15) {
        setGatewayError('Please enter a valid 16-digit card number.');
        return;
      }
      if (formData.cvv.length < 3) {
        setGatewayError('Please enter a valid 3 or 4 digit CVV code.');
        return;
      }
    }

    setIsProcessing(true);
    setProcessingStep('Encrypting 256-Bit TLS Payload...');

    setTimeout(() => {
      setProcessingStep('Authorizing with Merchant Clearing Gateway...');
      setTimeout(() => {
        if (paymentMethod === 'credit_card') {
          // Open 3D Secure verification
          setIsProcessing(false);
          setShow3DSecureDialog(true);
        } else {
          // Complete direct checkout for PayPal/ApplePay/COD
          finalizeOrder();
        }
      }, 1200);
    }, 1000);
  };

  const finalizeOrder = async () => {
    setShow3DSecureDialog(false);
    setIsProcessing(true);
    setProcessingStep('Finalizing Transaction & Deducting Warehouse Stock...');

    const result = await processPayment(formData, paymentMethod);

    setIsProcessing(false);

    if (result.success) {
      // Launch Confetti
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0284c7', '#10b981', '#f59e0b', '#ec4899'],
      });
    } else {
      setGatewayError(result.error || 'Payment gateway encountered an error. Please try again.');
    }
  };

  return (
    <div
      id="payment-gateway-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white w-full max-w-4xl max-h-[92vh] rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-sky-700 text-white px-6 py-4 flex items-center justify-between border-b border-sky-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-xs">
              <Lock className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold tracking-tight text-white">
                  SuperMart 256-Bit Secure Checkout Gateway
                </h3>
                <span className="bg-emerald-500 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded tracking-wider uppercase">
                  PCI-DSS Level 1
                </span>
              </div>
              <p className="text-xs text-sky-100">
                Encrypted end-to-end payment gateway & guaranteed stock reservation
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 rounded-lg text-sky-200 hover:text-white hover:bg-sky-800 transition cursor-pointer"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {gatewayError && (
            <div className="mb-4 bg-rose-50 border border-rose-300 rounded-xl p-3.5 flex items-start gap-3 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block">Payment / Order Issue:</strong>
                <span>{gatewayError}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleTriggerPayment} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Delivery & Payment Details (7 Cols) */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* Delivery Address Section */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-sky-600" />
                    <span>1. Delivery Destination & Schedule</span>
                  </h4>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                    Express 2h
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-medium text-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Phone Number (For SMS Tracking) *</label>
                    <input
                      type="text"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-medium text-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-semibold text-slate-700 block mb-1">Street Address *</label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="e.g. 742 Evergreen Terrace"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-medium text-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-medium text-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Postal / Zip Code *</label>
                    <input
                      type="text"
                      required
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-medium text-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-semibold text-slate-700 block mb-1">Preferred Delivery Time Slot</label>
                    <select
                      value={formData.deliverySlot}
                      onChange={(e) => setFormData({ ...formData, deliverySlot: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-semibold text-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                    >
                      <option value="Express 1-2 Hours (Immediate Warehouse Dispatch)">⚡ Express 1-2 Hours (Immediate Dispatch)</option>
                      <option value="Today Evening (5:00 PM - 8:00 PM)">Today Evening (5:00 PM - 8:00 PM)</option>
                      <option value="Tomorrow Morning (8:00 AM - 11:00 AM)">Tomorrow Morning (8:00 AM - 11:00 AM)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-sky-600" />
                    <span>2. Select Payment Method</span>
                  </h4>
                  <span className="text-[10px] text-slate-500">256-Bit SSL Encrypted</span>
                </div>

                {/* Method Pills */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('credit_card')}
                    className={`p-2.5 rounded-lg border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                      paymentMethod === 'credit_card'
                        ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Cards (All)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('paypal')}
                    className={`p-2.5 rounded-lg border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                      paymentMethod === 'paypal'
                        ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="font-black italic text-xs">P</span>
                    <span>PayPal</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('apple_pay')}
                    className={`p-2.5 rounded-lg border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                      paymentMethod === 'apple_pay'
                        ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Apple / Google Pay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash_on_delivery')}
                    className={`p-2.5 rounded-lg border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                      paymentMethod === 'cash_on_delivery'
                        ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Truck className="w-4 h-4" />
                    <span>Cash on Delivery</span>
                  </button>
                </div>

                {/* Card Fields with Live 3D Card Display */}
                {paymentMethod === 'credit_card' && (
                  <div className="space-y-4 pt-2">
                    {/* Visual Card Component */}
                    <div className={`w-full bg-gradient-to-tr ${cardIssuer.color} text-white rounded-xl p-4 shadow-lg relative overflow-hidden border border-white/20`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-1.5">
                          <div className="w-7 h-5 rounded bg-yellow-400/90 border border-yellow-200/50"></div>
                          <span className="text-[10px] tracking-widest text-slate-300 uppercase font-mono">EMV CHIP</span>
                        </div>
                        <span className="font-black text-sm tracking-wider font-mono text-yellow-300">
                          {cardIssuer.brand}
                        </span>
                      </div>

                      <div className="font-mono text-base sm:text-lg font-bold tracking-widest text-slate-100 mb-3 drop-shadow-sm">
                        {formData.cardNumber || '•••• •••• •••• ••••'}
                      </div>

                      <div className="flex items-end justify-between text-xs font-mono">
                        <div>
                          <div className="text-[9px] uppercase tracking-wider text-slate-300">Cardholder</div>
                          <div className="font-bold text-white uppercase">{formData.cardHolder || 'FULL NAME'}</div>
                        </div>

                        <div>
                          <div className="text-[9px] uppercase tracking-wider text-slate-300">Expires</div>
                          <div className="font-bold text-white">{formData.expiryMonth}/{formData.expiryYear}</div>
                        </div>
                      </div>

                      <div className="absolute -right-8 -bottom-8 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
                    </div>

                    {/* Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="sm:col-span-3">
                        <label className="font-semibold text-slate-700 block mb-1">Card Number (16-digit) *</label>
                        <input
                          type="text"
                          required
                          value={formData.cardNumber}
                          onChange={handleCardNumberChange}
                          placeholder="4532 8821 9043 7712"
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono font-bold text-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="font-semibold text-slate-700 block mb-1">Cardholder Name (as on card) *</label>
                        <input
                          type="text"
                          required
                          value={formData.cardHolder}
                          onChange={(e) => setFormData({ ...formData, cardHolder: e.target.value.toUpperCase() })}
                          placeholder="ALEXANDER MORGAN"
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-bold text-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Month (MM) *</label>
                        <input
                          type="text"
                          maxLength={2}
                          required
                          value={formData.expiryMonth}
                          onChange={(e) => setFormData({ ...formData, expiryMonth: e.target.value.replace(/\D/g, '') })}
                          placeholder="09"
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono text-center font-bold text-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Year (YY) *</label>
                        <input
                          type="text"
                          maxLength={2}
                          required
                          value={formData.expiryYear}
                          onChange={(e) => setFormData({ ...formData, expiryYear: e.target.value.replace(/\D/g, '') })}
                          placeholder="28"
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono text-center font-bold text-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">CVV / CVC *</label>
                        <input
                          type="password"
                          maxLength={4}
                          required
                          value={formData.cvv}
                          onChange={(e) => setFormData({ ...formData, cvv: e.target.value.replace(/\D/g, '') })}
                          placeholder="•••"
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono text-center font-bold text-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'paypal' && (
                  <div className="p-4 bg-sky-50 border border-sky-200 rounded-lg text-xs text-slate-700 space-y-1">
                    <p className="font-bold text-sky-900">PayPal Express Sandbox Gateway</p>
                    <p className="text-slate-600">You will authorize payment securely with one click using your PayPal buyer account.</p>
                  </div>
                )}

                {paymentMethod === 'apple_pay' && (
                  <div className="p-4 bg-slate-100 border border-slate-300 rounded-lg text-xs text-slate-700 space-y-1">
                    <p className="font-bold text-slate-900">Apple / Google Pay Biometric Tokenization</p>
                    <p className="text-slate-600">Fast 1-touch authentication using FaceID or device token.</p>
                  </div>
                )}

                {paymentMethod === 'cash_on_delivery' && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 space-y-1">
                    <p className="font-bold">Cash on Delivery (Supermarket Driver Handover)</p>
                    <p className="text-slate-600">Pay cash or debit card when your refrigerated order is handed over by the driver.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Order Summary & Stock Lock (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
                    Order Summary ({cart.length} Items)
                  </h4>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                    Stock Reserved
                  </span>
                </div>

                {/* Items preview */}
                <div className="divide-y divide-slate-200/80 max-h-44 overflow-y-auto space-y-2">
                  {cart.map((item) => (
                    <div key={item.product.id} className="pt-2 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-8 h-8 rounded object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-slate-800 line-clamp-1">{item.product.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            Qty: {item.quantity} × ${item.product.price.toFixed(2)}
                          </div>
                        </div>
                      </div>
                      <div className="font-bold text-slate-900 font-mono">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cost summary */}
                <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-200 pt-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono text-slate-800 font-bold">${cartSubtotal.toFixed(2)}</span>
                  </div>

                  {cartDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Discount ({appliedCoupon?.code})</span>
                      <span className="font-mono">-${cartDiscount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Express Delivery</span>
                    <span className="font-mono text-slate-800 font-bold">
                      {deliveryFee === 0 ? <span className="text-emerald-600">FREE</span> : `$${deliveryFee.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Sales Tax (8.25%)</span>
                    <span className="font-mono text-slate-800 font-bold">${cartTax.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-base font-extrabold text-slate-900 border-t border-slate-200 pt-2">
                    <span>Total Amount</span>
                    <span className="font-mono text-sky-700 font-serif text-lg">${cartTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Real-time stock reservation lock */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 flex items-center gap-2 text-[11px] text-emerald-800 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Real-time warehouse reservation locked. Items held for 15 mins.</span>
                </div>

                {/* Submit Payment Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 text-white font-extrabold text-sm py-3.5 px-4 rounded-xl shadow-lg transition cursor-pointer flex items-center justify-center gap-2 active:scale-98"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>{processingStep || 'Processing Payment...'}</span>
                    </div>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-yellow-300" />
                      <span>Authorize & Pay ${cartTotal.toFixed(2)}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="text-center text-[10px] text-slate-400 space-y-1">
                  <p>Guaranteed 100% Secure Checkout with fraud protection</p>
                  <div className="flex items-center justify-center gap-2 text-slate-500 font-mono font-bold">
                    <span>VISA</span> • <span>MASTERCARD</span> • <span>AMEX</span> • <span>DISCOVER</span>
                  </div>
                </div>
              </div>
            </div>

          </form>
        </div>

      </div>

      {/* 3D Secure / OTP Bank Dialog Simulation */}
      {show3DSecureDialog && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in zoom-in-95 duration-200">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-sky-600" />
                <span className="font-extrabold text-sm text-slate-900">Visa Secure / 3D Authentication</span>
              </div>
              <span className="text-xs font-mono font-bold text-slate-400">BANK-ID-99</span>
            </div>

            <p className="text-xs text-slate-600">
              For your security, your issuing bank has sent a one-time verification SMS to <strong>{formData.phone}</strong> for payment of <strong>${cartTotal.toFixed(2)}</strong> to <strong>SuperMart Electronics</strong>.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Enter 6-Digit SMS Code</label>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full text-center font-mono text-lg font-black tracking-widest py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
              />
              <span className="text-[10px] text-slate-400 mt-1 block text-center">
                Demo default code: 123456
              </span>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShow3DSecureDialog(false)}
                className="flex-1 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={finalizeOrder}
                className="flex-1 py-2 text-xs font-extrabold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm transition"
              >
                Verify & Confirm
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
