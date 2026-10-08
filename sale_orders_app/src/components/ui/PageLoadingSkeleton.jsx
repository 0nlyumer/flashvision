import React from 'react';

export default function PageLoadingSkeleton({ message = 'Loading module...' }) {
  return (
    <div 
      role="status" 
      aria-label={message}
      className="min-h-[60vh] w-full flex flex-col items-center justify-center p-8 animate-in fade-in duration-200"
    >
      <div className="relative flex flex-col items-center gap-4 p-8 rounded-3xl bg-surface/60 dark:bg-slate-900/60 backdrop-blur-xl border border-outline-variant/20 dark:border-slate-800 shadow-2xl max-w-sm w-full text-center">
        {/* Animated Brand Ring */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20 dark:border-cyan-500/10"></div>
          <div className="absolute inset-0 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin"></div>
          <span className="material-symbols-outlined text-primary dark:text-cyan-400 text-2xl animate-pulse">
            bolt
          </span>
        </div>

        {/* Text and shimmer indicator */}
        <div className="space-y-1.5 w-full">
          <h3 className="text-sm font-extrabold tracking-wide uppercase font-headline text-on-surface dark:text-slate-100">
            FlashVision ERP
          </h3>
          <p className="text-xs font-semibold text-on-surface-variant dark:text-slate-400">
            {message}
          </p>
        </div>

        {/* Subtle Progress Bar */}
        <div className="w-full h-1.5 bg-surface-container-highest dark:bg-slate-800 rounded-full overflow-hidden mt-1">
          <div className="h-full bg-gradient-to-r from-cyan-500 via-primary to-blue-600 rounded-full w-2/3 animate-[pulse_1.5s_ease-in-out_infinite]"></div>
        </div>
      </div>
    </div>
  );
}
