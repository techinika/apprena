"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, ArrowRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PaymentSuccessOverlay = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isSuccess = searchParams.get("payment") === "success";
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      setIsVisible(true);
    }
  }, [isSuccess]);

  const handleClose = () => {
    setIsVisible(false);
    router.replace("/workspace");
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
          />

          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            className="relative bg-white rounded-[3rem] p-10 max-w-lg w-full shadow-2xl overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-300 via-amber-700 to-amber-400" />

            <button
              onClick={handleClose}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="bg-emerald-100 text-emerald-600 p-5 rounded-full animate-pulse">
                  <Check size={40} strokeWidth={3} />
                </div>
              </div>

              <h2 className="text-3xl font-black text-slate-900 mb-2">
                Payment Successful!
              </h2>
              <p className="text-slate-500 mb-8 leading-relaxed">
                Your account has been upgraded. New analysis credits and
                features are now active in your workspace.
              </p>

              <div className="grid grid-cols-2 gap-4 w-full mb-8">
                <div className="bg-slate-50 p-4 rounded-2xl text-left border border-slate-100">
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-1">
                    Status
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                    <span className="font-bold text-slate-900">Activated</span>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl text-left border border-slate-100">
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-1">
                    Unlock
                  </p>
                  <p className="font-bold text-slate-900">New Goodies</p>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
              >
                Start Building <ArrowRight size={18} />
              </button>

              <p className="mt-6 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
                Transaction Verified & Secure
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PaymentSuccessOverlay;
