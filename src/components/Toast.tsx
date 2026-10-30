import React from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed top-20 right-4 z-50 max-w-sm w-full bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700/60 flex items-center justify-between gap-3 animate-in slide-in-from-top-4 duration-200">
      <div className="flex items-center gap-2.5 text-xs font-medium">
        <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
        <span className="leading-snug">{message}</span>
      </div>
      <button
        onClick={onClose}
        className="w-6 h-6 rounded-md flex items-center justify-center text-slate-400 hover:text-white transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
