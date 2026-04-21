"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

interface InvitationData {
  organizationId: string;
  orgName: string;
  email: string;
  role: string;
}

export default function InvitationPage({ params }: { params: Promise<{ token: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accepting, setAccepting] = useState(false);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    loadInvitation();
  }, []);

  const loadInvitation = async () => {
    try {
      const res = await fetch(`/api/accept-invitation?token=${resolvedParams.token}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to load invitation");
      } else {
        setInvitation(data);
      }
    } catch (err) {
      setError("Failed to load invitation");
    } finally {
      setLoading(false);
    }
  };

  const acceptInvitation = async () => {
    if (!user) {
      router.push(`/login?redirect=/invitation/${resolvedParams.token}`);
      return;
    }

    setAccepting(true);
    try {
      const res = await fetch("/api/accept-invitation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: resolvedParams.token, userId: user.uid }),
      });

      const data = await res.json();

      if (res.ok) {
        setAccepted(true);
        toast.success("Invitation accepted!");
      } else {
        setError(data.error || "Failed to accept invitation");
      }
    } catch (err) {
      toast.error("Failed to accept invitation");
    } finally {
      setAccepting(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-amber-600" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center border border-slate-200">
          <XCircle className="text-red-500 mx-auto mb-4" size={48} />
          <h1 className="text-xl font-black text-slate-900 mb-2">Invalid Invitation</h1>
          <p className="text-slate-500">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="mt-6 px-6 py-3 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (accepted || invitation?.email === user?.email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center border border-slate-200">
          <CheckCircle className="text-emerald-500 mx-auto mb-4" size={48} />
          <h1 className="text-xl font-black text-slate-900 mb-2">You're In!</h1>
          <p className="text-slate-500 mb-6">
            You've joined <strong>{invitation?.orgName}</strong> as a {invitation?.role}.
          </p>
          <button
            onClick={() => router.push(`/organization/${invitation?.organizationId}`)}
            className="w-full px-6 py-3 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700"
          >
            Go to Organization
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center border border-slate-200">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-amber-600 text-2xl">🏢</span>
        </div>
        <h1 className="text-xl font-black text-slate-900 mb-2">Join {invitation?.orgName}</h1>
        <p className="text-slate-500 mb-6">
          You've been invited to join <strong>{invitation?.orgName}</strong> as a{' '}
          <span className="text-amber-600 font-bold">{invitation?.role}</span>.
        </p>
        <button
          onClick={acceptInvitation}
          disabled={accepting}
          className="w-full px-6 py-3 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {accepting ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Accepting...
            </>
          ) : (
            <>
              <CheckCircle size={18} />
              Accept Invitation
            </>
          )}
        </button>
      </div>
    </div>
  );
}