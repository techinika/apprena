"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { ArrowLeft, CreditCard, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/db/firebase";
import { toast } from "sonner";
import dynamic from "next/dynamic";

const IremboPayWidget = dynamic(
  () => import("@/components/parts/IremboPayWidget"),
  { ssr: false, loading: () => <button disabled className="w-full py-4 bg-amber-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2"><Loader2 className="animate-spin" size={20} />Loading...</button> }
);

interface Invoice {
  id: string;
  organizationId: string;
  amountRwf: number;
  currency: string;
  status: string;
  billingCycle: string;
  tierId: string;
  invoiceNumber?: string;
}

interface Organization {
  id: string;
  name: string;
  pendingInvoiceId?: string;
  isActive?: boolean;
}

function OrgPaymentContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user && params.orgId) {
      loadData();
    }
  }, [user, params.orgId]);

  const loadData = async () => {
    if (!params.orgId) return;
    setLoading(true);

    try {
      const orgDoc = await getDoc(doc(db, "organizations", params.orgId as string));
      if (!orgDoc.exists()) {
        router.push("/organization");
        return;
      }

      const orgData = orgDoc.data() as Organization;
      setOrganization(orgData);

      const invoiceId = searchParams.get("invoice") || orgData.pendingInvoiceId;
      if (!invoiceId) {
        router.push(`/organization/${params.orgId}`);
        return;
      }

      const invoiceDoc = await getDoc(doc(db, "organizationInvoices", invoiceId));
      if (invoiceDoc.exists()) {
        setInvoice({ id: invoiceDoc.id, ...invoiceDoc.data() } as Invoice);
      }

      if (orgData.isActive) {
        router.push(`/organization/${params.orgId}`);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = async () => {
    if (!invoice || !organization || !user) return;

    await updateDoc(doc(db, "organizationInvoices", invoice.id), {
      status: "paid",
      paidAt: serverTimestamp(),
    });

    await updateDoc(doc(db, "organizations", organization.id), {
      isActive: true,
      pendingInvoiceId: null,
      "subscription.status": "active",
      "subscription.currentPeriodStart": serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    setSuccess(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-amber-600" size={32} />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center border border-slate-200">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-emerald-600" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Payment Complete!</h2>
          <p className="text-slate-500 mb-6">
            Your organization is now active. You can access all features.
          </p>
          <button
            onClick={() => router.push(`/organization/${organization?.id}`)}
            className="w-full py-4 bg-amber-600 text-white rounded-2xl font-bold hover:bg-amber-700"
          >
            Go to Organization
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-lg mx-auto px-6 py-12">
        <button
          onClick={() => router.push("/organization")}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold mb-6"
        >
          <ArrowLeft size={18} /> Back to Organizations
        </button>

        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
          <div className="bg-amber-500 p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <CreditCard size={28} />
              <h1 className="text-2xl font-black">Complete Payment</h1>
            </div>
            <p className="text-amber-100">Activate your organization</p>
          </div>

          <div className="p-8">
            <div className="mb-6 p-4 bg-slate-50 rounded-2xl">
              <h3 className="font-bold text-slate-900 mb-2">{organization?.name}</h3>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Plan</span>
                <span className="font-bold text-slate-700">{invoice?.tierId}</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-slate-500">Billing</span>
                <span className="font-bold text-slate-700 capitalize">{invoice?.billingCycle}</span>
              </div>
            </div>

            <div className="flex justify-between items-center p-4 bg-amber-50 rounded-2xl mb-6">
              <span className="font-bold text-slate-700">Total Amount</span>
              <span className="text-2xl font-black text-amber-600">
                {invoice?.amountRwf?.toLocaleString()} RWF
              </span>
            </div>

            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-2xl mb-6">
              <AlertCircle size={20} className="text-blue-600 shrink-0 mt-0.5" />
              <p className="text-sm text-blue-700">
                Payment will activate your organization immediately. You can cancel anytime.
              </p>
            </div>

            {invoice?.invoiceNumber ? (
              <IremboPayWidget
                invoiceNumber={invoice.invoiceNumber}
                onSuccess={handleSuccess}
                onError={(error) => toast.error(error)}
              />
            ) : (
              <div className="p-4 bg-red-50 rounded-2xl text-center">
                <p className="text-red-600 font-bold">Invoice not created. Please try again.</p>
              </div>
            )}

            <p className="text-center text-sm text-slate-400 mt-4">
              Secure payment powered by IremboPay
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrgPaymentClient() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-amber-600" size={32} />
      </div>
    }>
      <OrgPaymentContent />
    </Suspense>
  );
}
