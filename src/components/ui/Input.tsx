import React, { useId } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = "", id, ...props }: InputProps) {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors ${
          error
            ? "border-red-300 focus:border-red-500 focus:ring-red-200"
            : "border-slate-200 dark:border-slate-700 focus:border-amber-400 focus:ring-amber-100"
        } focus:outline-none focus:ring-4 ${className}`}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-xs font-medium text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
