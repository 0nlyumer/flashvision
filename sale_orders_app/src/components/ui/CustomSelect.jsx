import React, { useState, useRef, useEffect } from 'react';

export default function CustomSelect({ 
  options = [], 
  value, 
  onChange, 
  placeholder = "Select...", 
  label,
  error,
  name,
  className = "",
  onEditOption,
  onDeleteOption,
  onToggleDisableOption,
  checkInUse
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => 
    typeof opt === 'object' ? opt.value === value : opt === value
  );
  
  const displayValue = selectedOption 
    ? (typeof selectedOption === 'object' ? selectedOption.label : selectedOption)
    : "";

  const handleSelect = (opt) => {
    if (typeof opt === 'object' && opt.disabled) return;
    const val = typeof opt === 'object' ? opt.value : opt;
    if (onChange) {
      onChange({ target: { name, value: val } });
    }
    setIsOpen(false);
  };

  return (
    <div className={`relative group ${className}`} ref={dropdownRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-surface border rounded-xl px-4 py-3 text-sm flex justify-between items-center cursor-pointer transition-all ${
          error ? 'border-error/80 ring-1 ring-error/30' : 'border-outline-variant/30 hover:border-primary/50'
        } ${isOpen ? 'ring-2 ring-primary-container border-transparent' : ''}`}
      >
        <span className={displayValue ? 'text-on-surface' : 'text-slate-400'}>
          {displayValue || placeholder}
        </span>
        <span className={`material-symbols-outlined text-slate-400 pointer-events-none transition-transform duration-200 ${isOpen ? 'rotate-180 text-primary' : ''}`}>
          expand_more
        </span>
      </div>
      
      {label && (
        <label className={`absolute -top-2 left-3 bg-surface px-1 text-[10px] font-bold uppercase tracking-wider transition-colors ${error ? 'text-error' : (isOpen ? 'text-primary' : 'text-primary/70')}`}>
          {label}
        </label>
      )}

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-surface border border-outline-variant/30 rounded-xl max-h-60 overflow-auto shadow-xl py-1 animate-in fade-in slide-in-from-top-2 duration-200">
          {options.length === 0 ? (
            <div className="px-4 py-3 text-sm text-on-surface-variant italic text-center">No options available</div>
          ) : (
            options.map((opt, idx) => {
              const val = typeof opt === 'object' ? opt.value : opt;
              const lbl = typeof opt === 'object' ? opt.label : opt;
              const isDisabled = typeof opt === 'object' ? opt.disabled : false;
              const isSelected = value === val;
              const inUse = checkInUse ? checkInUse(val) : false;
              
              return (
                <div 
                  key={idx}
                  onClick={() => handleSelect(opt)}
                  className={`px-4 py-2 text-sm transition-colors flex items-center justify-between group/opt ${
                    isDisabled ? 'opacity-50 cursor-not-allowed bg-surface-container' : 'cursor-pointer'
                  } ${
                    isSelected 
                      ? 'bg-primary/10 text-primary font-bold' 
                      : (!isDisabled && 'text-on-surface hover:bg-surface-container-low')
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {lbl}
                    {isSelected && <span className="material-symbols-outlined text-[16px]">check</span>}
                    {isDisabled && <span className="text-[10px] bg-outline-variant/30 text-on-surface px-1.5 py-0.5 rounded-sm">Disabled</span>}
                  </div>
                  
                  {/* Action Icons */}
                  <div className="flex items-center gap-1 opacity-0 group-hover/opt:opacity-100 transition-opacity">
                    {onEditOption && !isDisabled && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onEditOption(opt); }}
                        className="p-1 hover:bg-primary/10 hover:text-primary rounded text-on-surface-variant transition-colors"
                        title="Edit"
                      >
                        <span className="material-symbols-outlined text-[16px]">edit</span>
                      </button>
                    )}
                    {(!inUse && onDeleteOption && !isDisabled) && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onDeleteOption(opt); }}
                        className="p-1 hover:bg-error/10 hover:text-error rounded text-on-surface-variant transition-colors"
                        title="Delete"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    )}
                    {(inUse && onToggleDisableOption) && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onToggleDisableOption(opt); }}
                        className={`p-1 rounded transition-colors ${
                          isDisabled 
                            ? 'hover:bg-primary/10 hover:text-primary text-on-surface-variant' 
                            : 'hover:bg-error/10 hover:text-error text-on-surface-variant'
                        }`}
                        title={isDisabled ? "Enable" : "Disable"}
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {isDisabled ? 'visibility' : 'visibility_off'}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
