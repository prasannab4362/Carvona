"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CreditCard, Shield, Loader2, CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PaymentModal({ isOpen, onClose, onSuccess }: PaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: "4242 •••• •••• 4242",
    expiry: "12/28",
    cvc: "•••",
    name: "John Doe",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate payment transaction
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#16A34A", "#22C55E", "#ffffff"],
      });

      // Execute success callback after showing success screen
      setTimeout(() => {
        onSuccess();
        onClose();
        setSuccess(false);
      }, 1500);
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/45 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-border-light overflow-hidden z-10 p-6 flex flex-col gap-6"
          >
            {/* Header */}
            <div className="flex justify-between items-center pb-2 border-b border-border-light">
              <div>
                <h3 className="text-lg font-bold text-text-main">Checkout</h3>
                <p className="text-xs text-text-muted">License Plate Logo Replacement</p>
              </div>
              <button
                onClick={onClose}
                className="p-1 text-text-muted hover:text-text-main hover:bg-black/5 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {!success ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Cost Details */}
                <div className="bg-section rounded-2xl p-4 flex justify-between items-center border border-border-light">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-text-main">Single Processing License</span>
                    <span className="text-xs text-text-muted">1x High-Resolution Image download</span>
                  </div>
                  <span className="text-lg font-bold text-primary">₹2.00</span>
                </div>

                {/* Card Fields */}
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="text-xs font-semibold text-text-main block mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full text-sm border border-border-light rounded-xl px-4 py-2.5 outline-none focus:border-primary transition-colors"
                      placeholder="Jane Doe"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-text-main block mb-1">Card Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={formData.cardNumber}
                        onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                        className="w-full text-sm border border-border-light rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-primary transition-colors"
                        placeholder="4242 4242 4242 4242"
                      />
                      <CreditCard size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-text-main block mb-1">Expiry Date</label>
                      <input
                        type="text"
                        required
                        value={formData.expiry}
                        onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                        className="w-full text-sm border border-border-light rounded-xl px-4 py-2.5 outline-none focus:border-primary transition-colors"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-text-main block mb-1">CVC</label>
                      <input
                        type="text"
                        required
                        value={formData.cvc}
                        onChange={(e) => setFormData({ ...formData, cvc: e.target.value })}
                        className="w-full text-sm border border-border-light rounded-xl px-4 py-2.5 outline-none focus:border-primary transition-colors"
                        placeholder="123"
                      />
                    </div>
                  </div>
                </div>

                {/* Secure Badge */}
                <div className="flex items-center justify-center gap-1.5 text-xs text-text-muted py-2 bg-green-50/50 border border-green-100 rounded-xl">
                  <Shield size={12} className="text-primary" />
                  <span>Secure 256-bit SSL encrypted checkout</span>
                </div>

                {/* Pay Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-white font-semibold rounded-xl shadow-lg shadow-primary/10 hover:shadow-primary/20 flex items-center justify-center gap-2 transition-all duration-200"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Processing payment...
                    </>
                  ) : (
                    "Pay ₹2.00 & Download"
                  )}
                </button>
              </form>
            ) : (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center justify-center py-10 gap-4 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-primary animate-[bounce_1s_infinite]">
                  <CheckCircle2 size={36} className="stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-text-main">Payment Successful!</h4>
                  <p className="text-sm text-text-muted mt-1">Starting your image download...</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
