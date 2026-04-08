"use client";
import React from "react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning";
}

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
}: ConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-start gap-4 mb-6">
          <div className={`p-3 rounded-full ${variant === "danger" ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"}`}>
            <AlertTriangle size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-black text-slate-900 mb-2">{title}</h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 py-3 px-4 rounded-xl font-bold transition-colors ${
              variant === "danger"
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-amber-600 text-white hover:bg-amber-700"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

interface ConfirmAction {
  (): void;
}

interface ConfirmState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: ConfirmAction;
  variant?: "danger" | "warning";
}

export function useConfirm() {
  const [confirmState, setConfirmState] = React.useState<ConfirmState>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const confirm = React.useCallback(
    (options: Omit<ConfirmState, "isOpen" | "onConfirm"> & { onConfirm: ConfirmAction }) => {
      setConfirmState({
        isOpen: true,
        ...options,
      });
    },
    []
  );

  const closeConfirm = React.useCallback(() => {
    setConfirmState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return { confirm, ConfirmModal: ConfirmModalWrapper, confirmState, closeConfirm };
}

function ConfirmModalWrapper({ state, onClose }: { state: ConfirmState; onClose: () => void }) {
  return (
    <ConfirmModal
      isOpen={state.isOpen}
      onClose={onClose}
      onConfirm={state.onConfirm}
      title={state.title}
      message={state.message}
      variant={state.variant}
    />
  );
}

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [confirmQueue, setConfirmQueue] = React.useState<ConfirmState[]>([]);

  const confirm = React.useCallback(
    (options: Omit<ConfirmState, "isOpen" | "onConfirm"> & { onConfirm: ConfirmAction }) => {
      setConfirmQueue((prev) => [...prev, { isOpen: true, ...options }]);
    },
    []
  );

  const closeConfirm = React.useCallback(() => {
    setConfirmQueue((prev) => prev.slice(1));
  }, []);

  return (
    <>
      {children}
      {confirmQueue.map((state, index) => (
        <ConfirmModalWrapper key={index} state={state} onClose={closeConfirm} />
      ))}
    </>
  );
}