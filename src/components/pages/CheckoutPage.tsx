/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  CreditCard,
  Smartphone,
  ShieldCheck,
  Lock,
  Loader2,
  Check,
  X,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  writeBatch,
  serverTimestamp,
  increment,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { db } from "@/db/firebase";
import Loading from "@/app/loading";
import { useRouter } from "next/navigation";
import { PLANS } from "@/types/plan";

const paymentMethods = [
  {
    id: "card",
    label: "Credit Card",
    icon: CreditCard,
    color: "text-blue-500",
  },
  {
    id: "mobile_money",
    label: "Mobile Money",
    icon: Smartphone,
    color: "text-orange-500",
  },
  {
    id: "paypal",
    label: "PayPal",
    icon: () => (
      <span className="font-black italic text-blue-800 text-xs">PayPal</span>
    ),
    color: "text-blue-800",
  },
];

const CheckoutPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [method, setMethod] = useState("card");
  const [loading, setLoading] = useState(true);
  const [pendingOrders, setPendingOrders] = useState<any[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [paying, setPaying] = useState(false);

  const [showCancelModal, setShowCancelModal] = useState<{
    show: boolean;
    orderId: string | null;
  }>({
    show: false,
    orderId: null,
  });

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const q = query(
      collection(db, "orders"),
      where("userId", "==", user.uid),
      where("status", "==", "pending")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPendingOrders(orders);
      setIsInitialLoad(false);
    });

    setLoading(false);

    return () => unsubscribe();
  }, [user]);

  const totalAmount = pendingOrders.reduce((acc, curr) => acc + curr.amount, 0);

  const confirmCancel = async () => {
    if (!showCancelModal.orderId) return;
    try {
      const orderRef = doc(db, "orders", showCancelModal.orderId);
      await updateDoc(orderRef, { status: "cancelled" });
      setShowCancelModal({ show: false, orderId: null });
    } catch (error) {
      console.error("Cancellation failed", error);
    }
  };

  if (isInitialLoad || loading) {
    return <Loading />;
  }

  if (pendingOrders.length === 0) {
    return (
      <div className="min-h-[90vh] flex flex-col items-center justify-center bg-[#FDFDFF] px-6 text-center">
        <div className="bg-slate-50 p-8 rounded-[3rem] mb-8">
          <ShoppingBag size={64} className="text-slate-300 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-slate-900">
            No Pending Orders
          </h2>
          <p className="text-slate-500 mt-2 max-w-xs mx-auto">
            Your cart is currently empty. Head back to choose a plan that fits
            your growth.
          </p>
        </div>
        <Link
          href="/upgrade"
          className="bg-amber-600 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-amber-100 hover:bg-amber-700 transition-all"
        >
          Go to Upgrade Page
        </Link>
      </div>
    );
  }

  const handlePayment = async () => {
    setPaying(true);
    const batch = writeBatch(db);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      for (const order of pendingOrders) {
        const orderRef = doc(db, "orders", order.id);
        batch.update(orderRef, {
          status: "activated",
          paidAt: serverTimestamp(),
        });

        const txRef = doc(collection(db, "transactions"));
        batch.set(txRef, {
          orderId: order.id,
          userId: user?.uid,
          amount: order.amount,
          method: method,
          status: "success",
          timestamp: serverTimestamp(),
        });

        const profileRef = doc(db, "profiles", String(user?.uid));
        if (order.planId === PLANS?.sprint) {
          batch.update(profileRef, {
            accountType: "pro",
            purchasedCredits: increment(1),
          });
        } else if (order.planId === PLANS?.architect) {
          const subQuery = query(
            collection(db, "subscriptions"),
            where("userId", "==", user?.uid),
            where("status", "==", "active"),
            orderBy("endDate", "desc"),
            limit(1)
          );
          const subSnap = await getDocs(subQuery);

          let startDate = new Date();
          if (!subSnap.empty) {
            const currentEnd = subSnap.docs[0].data().endDate.toDate();
            if (currentEnd > startDate) startDate = currentEnd;
          }

          const endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + 30);

          const subRef = doc(collection(db, "subscriptions"));
          batch.set(subRef, {
            userId: user?.uid,
            orderId: order.id,
            status: "active",
            startDate: startDate,
            endDate: endDate,
            planId: "architect",
          });

          const profileRef = doc(db, "profiles", String(user?.uid));
          batch.update(profileRef, { accountType: "architect" });
        }
      };

      await batch.commit();
      router.push("/workspace?payment=success");
    } catch (e) {
      console.error(e);
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="min-h-screen text-slate-900 pb-20">
      {showCancelModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-6">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-black mb-2">Cancel Order?</h3>
            <p className="text-slate-500 mb-8 leading-relaxed">
              This will remove the plan from your checkout. You can always add
              it back later.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() =>
                  setShowCancelModal({ show: false, orderId: null })
                }
                className="flex-1 px-6 py-4 rounded-2xl font-bold bg-slate-100 text-slate-600 hover:bg-slate-200"
              >
                No, Keep
              </button>
              <button
                onClick={confirmCancel}
                className="flex-1 px-6 py-4 rounded-2xl font-bold bg-red-50 text-red-600 hover:bg-red-100"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-12">
          <Link
            href="/upgrade"
            className="flex items-center gap-2 text-slate-400 hover:text-amber-600 transition-colors font-bold text-sm"
          >
            <ArrowLeft size={18} /> Change Plan
          </Link>
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black uppercase tracking-widest">
            <Lock size={14} /> Secure Encryption
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          <div className="lg:col-span-3 space-y-8">
            <h1 className="text-3xl font-black text-slate-900">
              Payment Method
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {paymentMethods.map((pmId) => (
                <button
                  key={pmId.id}
                  onClick={() => setMethod(pmId.id)}
                  className={`relative p-6 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${
                    method === pmId?.id
                      ? "border-amber-600 bg-amber-50/50"
                      : "border-slate-100 bg-white"
                  }`}
                >
                  {pmId.id === "card" && (
                    <CreditCard className="text-blue-500" size={28} />
                  )}
                  {pmId.id === "mobile_money" && (
                    <Smartphone className="text-orange-500" size={28} />
                  )}
                  {pmId.id === "paypal" && (
                    <span className="font-black italic text-blue-800 text-xs">
                      PayPal
                    </span>
                  )}
                  <span className="text-sm font-bold capitalize">
                    {pmId.label.replace("_", " ")}
                  </span>
                  {method === pmId.id && (
                    <div className="absolute top-2 right-2 bg-amber-600 text-white p-0.5 rounded-full">
                      <Check size={10} />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm">
              {method === "card" && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase text-slate-400">
                      Card Number
                    </label>

                    <input
                      type="text"
                      placeholder="xxxx xxxx xxxx xxxx"
                      className="w-full bg-slate-50 border-slate-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-black uppercase text-slate-400">
                        Expiry
                      </label>

                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full bg-slate-50 border-slate-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-black uppercase text-slate-400">
                        CVC
                      </label>

                      <input
                        type="text"
                        placeholder="123"
                        className="w-full bg-slate-50 border-slate-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {method === "mobile_money" && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase text-slate-400">
                      Select Provider
                    </label>

                    <select className="w-full bg-slate-50 border-slate-100 rounded-xl px-4 py-3 outline-none">
                      <option>MTN MoMo</option>

                      <option>Airtel Money</option>

                      <option>M-Pesa</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase text-slate-400">
                      Phone Number
                    </label>

                    <input
                      type="tel"
                      placeholder="+250 XXX XXX XXX"
                      className="w-full bg-slate-50 border-slate-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <p className="text-xs text-slate-400 italic">
                    You will receive a prompt on your phone to enter your PIN.
                  </p>
                </div>
              )}

              {method === "paypal" && (
                <div className="text-center py-6">
                  <p className="text-slate-600 mb-6">
                    You will be redirected to PayPal to complete your purchase
                    safely.
                  </p>

                  <div className="bg-blue-50 text-blue-700 font-bold p-4 rounded-2xl flex items-center justify-center gap-2">
                    Proceed to PayPal Official Site
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white sticky top-12">
              <h3 className="text-xl font-bold mb-6">Order Summary</h3>

              <div className="space-y-3 mb-8 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {pendingOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="group relative bg-white/5 border border-white/10 p-4 rounded-2xl flex justify-between items-center transition-all hover:bg-white/10"
                  >
                    <div>
                      <p className="text-xs font-black uppercase text-amber-500 tracking-wider">
                        {ord.planId === "sprint"
                          ? "Single Sprint"
                          : "The Architect"}
                      </p>
                      <p className="font-bold text-white">
                        {ord.amount.toLocaleString()} RWF
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setShowCancelModal({ show: true, orderId: ord.id })
                      }
                      className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-6 flex justify-between items-center mb-8">
                <div>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                    Total Due
                  </p>
                  <p className="text-3xl font-black text-amber-400">
                    {totalAmount.toLocaleString()} RWF
                  </p>
                </div>
              </div>

              <button
                disabled={paying}
                onClick={handlePayment}
                className="w-full bg-amber-500 hover:bg-amber-400 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {paying ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Complete Payment"
                )}
              </button>

              <div className="mt-6 flex items-center gap-3 text-[10px] text-slate-500 uppercase font-bold tracking-tighter">
                <ShieldCheck size={14} className="text-emerald-500" />
                Secured by 256-bit SSL Encryption
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
