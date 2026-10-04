import React, { useState, useRef, useEffect } from 'react';

export default function CustomMultiSelect({ options, selectedValues, onChange, placeholder = "Select...", className = "" }) {
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

    const toggleOption = (value) => {
        const newValues = selectedValues.includes(value)
            ? selectedValues.filter(v => v !== value)
            : [...selectedValues, value];
        onChange(newValues);
    };

    const displayValue = selectedValues.length === 0 
        ? placeholder 
        : selectedValues.length === 1 
            ? selectedValues[0] 
            : `${selectedValues.length} Selected`;

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-2 text-sm text-on-surface hover:bg-surface-container transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            >
                <span className="truncate pr-2 font-medium">{displayValue}</span>
                <span className={`material-symbols-outlined text-[18px] text-on-surface-variant transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                    expand_more
                </span>
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-surface-container-lowest border border-outline-variant/20 rounded-xl shadow-lg max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-1">
                        {options.map((opt) => (
                            <label 
                                key={opt.value} 
                                onClick={() => toggleOption(opt.value)}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-container-low cursor-pointer transition-colors group"
                            >
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedValues.includes(opt.value) ? 'bg-primary border-primary' : 'border-outline-variant group-hover:border-primary/50 bg-surface'}`}>
                                    {selectedValues.includes(opt.value) && (
                                        <span className="material-symbols-outlined text-[14px] text-on-primary font-bold">check</span>
                                    )}
                                </div>
                                <span className={`text-sm ${selectedValues.includes(opt.value) ? 'text-on-surface font-bold' : 'text-on-surface-variant group-hover:text-on-surface font-medium'}`}>
                                    {opt.label}
                                </span>
                            </label>
                        ))}
                        {options.length === 0 && (
                            <div className="px-3 py-4 text-center text-sm text-on-surface-variant">
                                No options available
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
