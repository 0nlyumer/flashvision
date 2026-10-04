import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

const DialogContext = createContext();

export const DialogProvider = ({ children }) => {
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    message: '',
    resolve: null
  });

  const [promptState, setPromptState] = useState({
    isOpen: false,
    message: '',
    resolve: null,
    inputValue: ''
  });

  const [alertState, setAlertState] = useState({
    isOpen: false,
    message: '',
    resolve: null
  });

  // Dynamic Top-Pill Notification State (Samsung / Dynamic Island style)
  const [pillState, setPillState] = useState({
    isOpen: false,
    isExiting: false,
    message: '',
    type: 'info', // 'warning', 'success', 'info', 'error'
    icon: null,
    duration: 3500
  });

  const pillTimerRef = useRef(null);
  const isHoveredRef = useRef(false);
  const remainingTimeRef = useRef(3500);
  const startTimeRef = useRef(null);

  // Professional Loading Overlay State
  const [loadingState, setLoadingState] = useState({
    isOpen: false,
    title: 'Processing Request...',
    subtext: 'Please wait while we process your request'
  });

  const appConfirm = useCallback((message, title = "Confirm Action", confirmText = "Confirm", cancelText = "Cancel") => {
    return new Promise((resolve) => {
      setConfirmState({
        isOpen: true,
        message,
        title,
        confirmText,
        cancelText,
        resolve
      });
    });
  }, []);

  const appAlert = useCallback((message) => {
    return new Promise((resolve) => {
      setAlertState({
        isOpen: true,
        message,
        resolve
      });
    });
  }, []);

  const appPrompt = useCallback((message) => {
    return new Promise((resolve) => {
      setPromptState({
        isOpen: true,
        message,
        resolve,
        inputValue: ''
      });
    });
  }, []);

  const handleConfirmClose = (result) => {
    if (confirmState.resolve) {
      confirmState.resolve(result);
    }
    setConfirmState({ isOpen: false, message: '', resolve: null });
  };

  const handlePromptClose = (result) => {
    if (promptState.resolve) {
      promptState.resolve(result);
    }
    setPromptState({ isOpen: false, message: '', resolve: null, inputValue: '' });
  };

  const handleAlertClose = () => {
    if (alertState.resolve) {
      alertState.resolve(true);
    }
    setAlertState({ isOpen: false, message: '', resolve: null });
  };

  // Top Pill Handlers
  const dismissTopPill = useCallback(() => {
    if (pillTimerRef.current) {
      clearTimeout(pillTimerRef.current);
      pillTimerRef.current = null;
    }
    setPillState(prev => ({ ...prev, isExiting: true }));
    setTimeout(() => {
      setPillState({ isOpen: false, isExiting: false, message: '', type: 'info', icon: null, duration: 3500 });
    }, 400); // match animation duration
  }, []);

  const showTopPill = useCallback((message, type = 'info', duration = 3500, customIcon = null) => {
    if (pillTimerRef.current) {
      clearTimeout(pillTimerRef.current);
    }
    
    remainingTimeRef.current = duration;
    startTimeRef.current = Date.now();
    isHoveredRef.current = false;

    setPillState({
      isOpen: true,
      isExiting: false,
      message,
      type,
      icon: customIcon,
      duration
    });

    pillTimerRef.current = setTimeout(() => {
      dismissTopPill();
    }, duration);
  }, [dismissTopPill]);

  const handlePillMouseEnter = () => {
    isHoveredRef.current = true;
    if (pillTimerRef.current) {
      clearTimeout(pillTimerRef.current);
      pillTimerRef.current = null;
      const elapsed = Date.now() - (startTimeRef.current || Date.now());
      remainingTimeRef.current = Math.max(500, remainingTimeRef.current - elapsed);
    }
  };

  const handlePillMouseLeave = () => {
    isHoveredRef.current = false;
    startTimeRef.current = Date.now();
    pillTimerRef.current = setTimeout(() => {
      dismissTopPill();
    }, remainingTimeRef.current);
  };

  // Loading Overlay Handlers
  const showLoading = useCallback((title = 'Processing Request...', subtext = 'Fetching latest data • Please wait') => {
    setLoadingState({
      isOpen: true,
      title,
      subtext
    });
  }, []);

  const hideLoading = useCallback(() => {
    setLoadingState({
      isOpen: false,
      title: '',
      subtext: ''
    });
  }, []);

  // Configure Pill Theme Variants
  const getPillTheme = (type) => {
    switch (type) {
      case 'warning':
        return {
          bg: 'bg-[#181511]/95',
          border: 'border-[#f59e0b]/35 shadow-[0_12px_32px_rgba(245,158,11,0.15)]',
          text: 'text-[#fef3c7]',
          iconColor: 'text-[#fbbf24]',
          accent: 'bg-[#f59e0b]',
          defaultIcon: 'signal_cellular_connected_no_internet_4_bar'
        };
      case 'success':
        return {
          bg: 'bg-[#0b1a14]/95',
          border: 'border-[#10b981]/35 shadow-[0_12px_32px_rgba(16,185,129,0.15)]',
          text: 'text-[#d1fae5]',
          iconColor: 'text-[#34d399]',
          accent: 'bg-[#10b981]',
          defaultIcon: 'check_circle'
        };
      case 'error':
        return {
          bg: 'bg-[#1c0d11]/95',
          border: 'border-[#ef4444]/35 shadow-[0_12px_32px_rgba(239,68,68,0.15)]',
          text: 'text-[#fee2e2]',
          iconColor: 'text-[#f87171]',
          accent: 'bg-[#ef4444]',
          defaultIcon: 'error_outline'
        };
      case 'info':
      default:
        return {
          bg: 'bg-[#0d1627]/95',
          border: 'border-[#3b82f6]/35 shadow-[0_12px_32px_rgba(59,130,246,0.15)]',
          text: 'text-[#dbeafe]',
          iconColor: 'text-[#60a5fa]',
          accent: 'bg-[#3b82f6]',
          defaultIcon: 'info'
        };
    }
  };

  return (
    <DialogContext.Provider value={{ 
      appConfirm, 
      appPrompt, 
      appAlert, 
      showTopPill, 
      showPillNotification: showTopPill, 
      dismissTopPill, 
      showLoading, 
      hideLoading 
    }}>
      {children}

      {/* Samsung / Dynamic Island Style Top-Pill Notification Component */}
      {pillState.isOpen && (
        <div 
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[10000] pointer-events-auto select-none"
          onMouseEnter={handlePillMouseEnter}
          onMouseLeave={handlePillMouseLeave}
          onClick={dismissTopPill}
        >
          {(() => {
            const theme = getPillTheme(pillState.type);
            const displayIcon = pillState.icon || theme.defaultIcon;
            return (
              <div 
                className={`flex items-center gap-3 px-4 py-2.5 rounded-full backdrop-blur-xl border ${theme.bg} ${theme.border} ${theme.text} ${
                  pillState.isExiting ? 'animate-pill-out' : 'animate-pill-in'
                } cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group`}
              >
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`w-2 h-2 rounded-full ${theme.accent} animate-pulse`}></span>
                  <span className={`material-symbols-outlined text-[18px] ${theme.iconColor}`}>
                    {displayIcon}
                  </span>
                </div>

                <span className="font-body text-xs font-semibold tracking-wide whitespace-nowrap">
                  {pillState.message}
                </span>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    dismissTopPill();
                  }}
                  className="w-5 h-5 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors ml-1"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              </div>
            );
          })()}
        </div>
      )}

      {/* Professional Frosted Glass Loading Overlay */}
      {loadingState.isOpen && (
        <div className="fixed inset-0 z-[10005] flex items-center justify-center font-body p-4 animate-in fade-in duration-300">
          {/* Frosted Backdrop */}
          <div className="absolute inset-0 bg-[#0b141a]/75 backdrop-blur-md"></div>
          
          {/* Modal Container */}
          <div className="relative z-20 w-full max-w-sm bg-[#111c24]/90 border border-white/15 rounded-3xl p-8 shadow-2xl backdrop-blur-xl flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
            {/* 60fps Hardware Accelerated Rotating Stroke Spinner */}
            <div className="relative w-16 h-16 mb-5 flex items-center justify-center">
              <svg className="w-16 h-16 animate-spinner-rotate" viewBox="0 0 50 50">
                <circle
                  className="animate-spinner-dash stroke-[#00a884]"
                  cx="25"
                  cy="25"
                  r="20"
                  fill="none"
                  strokeWidth="3.5"
                />
              </svg>
              <span className="material-symbols-outlined absolute text-[20px] text-[#00a884] animate-pulse">
                autorenew
              </span>
            </div>

            {/* Contextual Typography */}
            <h3 className="font-headline font-bold text-base text-white tracking-wide mb-1">
              {loadingState.title}
            </h3>
            <p className="font-body text-xs text-slate-400 leading-relaxed font-medium">
              {loadingState.subtext}
            </p>
          </div>
        </div>
      )}

      {/* Confirmation Modal Overlay */}
      {confirmState.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center font-body">
          <div className="absolute inset-0 bg-on-background/20 backdrop-blur-[2px]" onClick={() => handleConfirmClose(false)}></div>
          
          <div aria-labelledby="modal-title" aria-modal="true" role="dialog" 
            className="relative z-20 w-full max-w-md bg-surface-container-lowest rounded-xl shadow-[0_20px_40px_rgba(0,28,56,0.06)] ring-1 ring-outline-variant/15 flex flex-col items-center p-8 text-center animate-in fade-in zoom-in duration-200">
            
            <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-6 ring-1 ring-outline-variant/20">
              <span className="material-symbols-outlined text-4xl text-primary">error_outline</span>
            </div>
            
            <h2 className="font-headline font-bold text-2xl text-on-surface mb-2 tracking-wide" id="modal-title">{confirmState.title || "Confirm Action"}</h2>
            <p className="font-body text-sm text-on-surface-variant mb-8 leading-relaxed max-w-[280px]">
              {confirmState.message || "Are you sure you want to apply these changes?"}
            </p>
            
            <div className="flex flex-col w-full gap-3 sm:flex-row sm:justify-center">
              <button 
                onClick={() => handleConfirmClose(false)}
                className="font-body text-sm font-semibold text-on-surface-variant bg-surface-container-low hover:bg-surface-container transition-colors duration-200 px-6 py-3 rounded-lg ring-1 ring-outline-variant/15 w-full sm:w-auto" 
                type="button">
                {confirmState.cancelText || "Cancel"}
              </button>
              <button 
                onClick={() => handleConfirmClose(true)}
                className="font-body text-sm font-semibold text-on-primary bg-gradient-to-br from-primary to-primary-container hover:opacity-90 transition-opacity duration-200 px-6 py-3 rounded-lg shadow-sm w-full sm:w-auto" 
                type="button">
                {confirmState.confirmText || "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Prompt Modal Overlay */}
      {promptState.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center font-body">
          <div className="absolute inset-0 bg-on-background/20 backdrop-blur-[2px]" onClick={() => handlePromptClose(null)}></div>
          
          <div aria-labelledby="modal-prompt-title" aria-modal="true" role="dialog" 
            className="relative z-20 w-full max-w-md bg-surface-container-lowest rounded-xl shadow-[0_20px_40px_rgba(0,28,56,0.06)] ring-1 ring-outline-variant/15 flex flex-col items-center p-8 text-center animate-in fade-in zoom-in duration-200">
            
            <h2 className="font-headline font-bold text-2xl text-on-surface mb-2 tracking-wide" id="modal-prompt-title">Input Required</h2>
            <p className="font-body text-sm text-on-surface-variant mb-6 leading-relaxed max-w-[280px]">
              {promptState.message}
            </p>

            <input 
              type="text" 
              autoFocus
              className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container mb-6"
              value={promptState.inputValue}
              onChange={(e) => setPromptState(prev => ({ ...prev, inputValue: e.target.value }))}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handlePromptClose(promptState.inputValue);
                if (e.key === 'Escape') handlePromptClose(null);
              }}
            />
            
            <div className="flex flex-col w-full gap-3 sm:flex-row sm:justify-center">
              <button 
                onClick={() => handlePromptClose(null)}
                className="font-body text-sm font-semibold text-on-surface-variant bg-surface-container-low hover:bg-surface-container transition-colors duration-200 px-6 py-3 rounded-lg ring-1 ring-outline-variant/15 w-full sm:w-auto" 
                type="button">
                Cancel
              </button>
              <button 
                onClick={() => handlePromptClose(promptState.inputValue)}
                className="font-body text-sm font-semibold text-on-primary bg-gradient-to-br from-primary to-primary-container hover:opacity-90 transition-opacity duration-200 px-6 py-3 rounded-lg shadow-sm w-full sm:w-auto" 
                type="button">
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Modal Overlay */}
      {alertState.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center font-body">
          <div className="absolute inset-0 bg-on-background/20 backdrop-blur-[2px]" onClick={handleAlertClose}></div>
          <div aria-modal="true" role="dialog" 
            className="relative z-20 w-full max-w-sm bg-surface-container-lowest rounded-xl shadow-[0_20px_40px_rgba(0,28,56,0.06)] ring-1 ring-outline-variant/15 flex flex-col items-center p-8 text-center animate-in fade-in zoom-in duration-200">
            
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 ring-1 ring-primary/20">
              <span className="material-symbols-outlined text-4xl text-primary">info</span>
            </div>
            
            <h2 className="font-headline font-bold text-xl text-on-surface mb-2 tracking-wide">Notice</h2>
            <p className="font-body text-sm text-on-surface-variant mb-8 leading-relaxed max-w-[280px] whitespace-pre-line">
              {alertState.message}
            </p>
            
            <button 
              onClick={handleAlertClose}
              className="font-body text-sm font-semibold text-white bg-primary hover:bg-primary/90 transition-colors duration-200 px-8 py-3 rounded-lg shadow-sm w-full sm:w-auto" 
              type="button">
              OK
            </button>
          </div>
        </div>
      )}
    </DialogContext.Provider>
  );
};

export const useDialog = () => useContext(DialogContext);
