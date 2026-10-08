import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useApp } from '../context/AppContext';

export default function ThemeSettings() {
  const { state, updateThemeSettings } = useApp();
  const currentTheme = state?.themeSettings || { colorMode: 'dark', primaryColor: 'tradingview', fontStyle: 'inter', borderRadius: 'rounded' };

  const [colorMode, setColorMode] = useState(currentTheme.colorMode || 'dark');
  const [primaryColor, setPrimaryColor] = useState(currentTheme.primaryColor || 'tradingview');
  const [fontStyle, setFontStyle] = useState(currentTheme.fontStyle || 'inter');
  const [borderRadius, setBorderRadius] = useState(currentTheme.borderRadius || 'rounded');
  const [appliedNotification, setAppliedNotification] = useState(false);

  useEffect(() => {
    if (state?.themeSettings) {
      setColorMode(state.themeSettings.colorMode || 'dark');
      setPrimaryColor(state.themeSettings.primaryColor || 'tradingview');
      setFontStyle(state.themeSettings.fontStyle || 'inter');
      setBorderRadius(state.themeSettings.borderRadius || 'rounded');
    }
  }, [state?.themeSettings]);

  const handleApplyTheme = () => {
    updateThemeSettings({ colorMode, primaryColor, fontStyle, borderRadius });
    setAppliedNotification(true);
    setTimeout(() => setAppliedNotification(false), 3000);
  };

  const handleColorModeChange = (mode) => {
    setColorMode(mode);
    updateThemeSettings({ colorMode: mode, primaryColor, fontStyle, borderRadius });
  };

  const handlePrimaryColorChange = (colorId) => {
    setPrimaryColor(colorId);
    updateThemeSettings({ colorMode, primaryColor: colorId, fontStyle, borderRadius });
  };

  const handleFontStyleChange = (fontId) => {
    setFontStyle(fontId);
    updateThemeSettings({ colorMode, primaryColor, fontStyle: fontId, borderRadius });
  };

  const handleBorderRadiusChange = (radiusId) => {
    setBorderRadius(radiusId);
    updateThemeSettings({ colorMode, primaryColor, fontStyle, borderRadius: radiusId });
  };

  const handleReset = () => {
    const defaults = { colorMode: 'dark', primaryColor: 'tradingview', fontStyle: 'inter', borderRadius: 'rounded' };
    setColorMode(defaults.colorMode);
    setPrimaryColor(defaults.primaryColor);
    setFontStyle(defaults.fontStyle);
    setBorderRadius(defaults.borderRadius);
    updateThemeSettings(defaults);
    setAppliedNotification(true);
    setTimeout(() => setAppliedNotification(false), 3000);
  };

  const colorOptions = [
    { id: 'tradingview', hex: '#2962ff', label: 'TradingView Electric Blue' },
    { id: 'indigo', hex: '#6366f1', label: 'Indigo Core' },
    { id: 'emerald', hex: '#10b981', label: 'Emerald Mint' },
    { id: 'sky', hex: '#0ea5e9', label: 'Sky Cyan' },
    { id: 'rose', hex: '#f43f5e', label: 'Rose Coral' },
    { id: 'amber', hex: '#f59e0b', label: 'Amber Gold' },
  ];

  const fontOptions = [
    { id: 'inter', label: 'Inter (TradingView Default)', desc: 'High-density, crisp alphanumeric clarity' },
    { id: 'outfit', label: 'Outfit (Modern Display)', desc: 'Geometric, futuristic, ultra-smooth' },
    { id: 'roboto', label: 'Roboto (Enterprise)', desc: 'Classic, dependable industrial typography' },
  ];

  const radiusOptions = [
    { id: 'sharp', label: 'Sharp (TradingView)', radiusClass: 'rounded-none' },
    { id: 'rounded', label: 'Rounded (Smooth)', radiusClass: 'rounded-xl' },
    { id: 'pill', label: 'Pill (Curved)', radiusClass: 'rounded-full' },
  ];

  return (
    <Layout subNavigation={
        <div className="flex flex-col gap-2">
            <div className="px-2 pb-2 mb-2 border-b border-outline-variant/10">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Settings</p>
            </div>
            <div className="w-full flex items-center gap-3 p-3 rounded-2xl bg-primary/10 text-primary border border-primary/20">
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>palette</span>
                <span className="text-sm font-bold">Theme & Appearance</span>
            </div>
            <div className="w-full flex items-center gap-3 p-3 rounded-2xl text-on-surface-variant hover:bg-surface-container-low cursor-pointer transition-colors">
                <span className="material-symbols-outlined text-[20px]">manage_accounts</span>
                <span className="text-sm font-medium">User Profile</span>
            </div>
            <div className="w-full flex items-center gap-3 p-3 rounded-2xl text-on-surface-variant hover:bg-surface-container-low cursor-pointer transition-colors">
                <span className="material-symbols-outlined text-[20px]">shield</span>
                <span className="text-sm font-medium">Security</span>
            </div>
        </div>
    }>
      <div className="max-w-full px-6 mx-auto animate-fade-in">
        
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-on-surface tracking-tight mb-2 font-headline">Theme & Appearance</h1>
              <p className="text-on-surface-variant text-sm max-w-2xl">
                TradingView Pure Black OLED Dark Theme architecture with high contrast vibrancy and adaptive buttons.
              </p>
            </div>
            {appliedNotification && (
              <div className="px-4 py-2 rounded-xl bg-primary/20 border border-primary/40 text-primary flex items-center gap-2 animate-fade-in text-sm font-bold">
                <span className="material-symbols-outlined text-sm">verified</span>
                Theme settings applied!
              </div>
            )}
        </div>

        {/* Settings Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Column */}
            <div className="space-y-6">
                
                {/* Color Mode */}
                <div className="bg-surface-container-low/60 backdrop-blur-md rounded-[32px] border border-outline-variant/30 p-8 shadow-sm">
                    <h2 className="text-lg font-bold text-on-surface mb-2 flex items-center gap-2 font-headline">
                        <span className="material-symbols-outlined text-primary">dark_mode</span>
                        Interface Mode
                    </h2>
                    <p className="text-xs text-on-surface-variant mb-6">Choose between TradingView Pure Black OLED Dark Theme or Clean Light Mode.</p>
                    
                    <div className="flex gap-4">
                        <button 
                            type="button"
                            onClick={() => handleColorModeChange('dark')}
                            className={`flex-1 flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all ${colorMode === 'dark' ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(41,98,255,0.25)] ring-1 ring-primary' : 'border-outline-variant/30 hover:border-outline-variant/60 bg-surface-container-low'}`}
                        >
                            <div className="w-14 h-14 rounded-full bg-[#0b0e14] border-2 border-[#242832] flex items-center justify-center shadow-lg">
                                <span className="material-symbols-outlined text-[#2962ff] text-[26px]">dark_mode</span>
                            </div>
                            <div className="text-center">
                              <span className={`text-sm font-black block ${colorMode === 'dark' ? 'text-primary' : 'text-on-surface'}`}>Pure Black OLED</span>
                              <span className="text-[10px] text-on-surface-variant">TradingView Deep Dark</span>
                            </div>
                        </button>

                        <button 
                            type="button"
                            onClick={() => handleColorModeChange('light')}
                            className={`flex-1 flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all ${colorMode === 'light' ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(41,98,255,0.25)] ring-1 ring-primary' : 'border-outline-variant/30 hover:border-outline-variant/60 bg-surface-container-low'}`}
                        >
                            <div className="w-14 h-14 rounded-full bg-[#f8fafc] border-2 border-slate-200 flex items-center justify-center shadow-inner">
                                <span className="material-symbols-outlined text-amber-500 text-[26px]">light_mode</span>
                            </div>
                            <div className="text-center">
                              <span className={`text-sm font-black block ${colorMode === 'light' ? 'text-primary' : 'text-on-surface'}`}>Crisp Light Mode</span>
                              <span className="text-[10px] text-on-surface-variant">Daylight Clean Theme</span>
                            </div>
                        </button>
                    </div>
                </div>

                {/* System Palette */}
                <div className="bg-surface-container-low/60 backdrop-blur-md rounded-[32px] border border-outline-variant/30 p-8 shadow-sm">
                    <h2 className="text-lg font-bold text-on-surface mb-2 flex items-center gap-2 font-headline">
                        <span className="material-symbols-outlined text-primary">palette</span>
                        Accent Color & Buttons
                    </h2>
                    <p className="text-xs text-on-surface-variant mb-6">Interactive button vibrancy, highlights, and badge accents.</p>
                    
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                        {colorOptions.map(color => (
                            <button
                                key={color.id}
                                type="button"
                                onClick={() => handlePrimaryColorChange(color.id)}
                                title={color.label}
                                className={`h-14 rounded-2xl flex flex-col items-center justify-center transition-all relative ${primaryColor === color.id ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-105 shadow-md' : 'hover:scale-105 opacity-80 hover:opacity-100'}`}
                                style={{ backgroundColor: color.hex }}
                            >
                                {primaryColor === color.id && <span className="material-symbols-outlined text-white text-[22px] drop-shadow-md" style={{ fontVariationSettings: "'wght' 700" }}>check</span>}
                            </button>
                        ))}
                    </div>
                </div>

            </div>

            {/* Right Column */}
            <div className="space-y-6">
                
                {/* Typography */}
                <div className="bg-surface-container-low/60 backdrop-blur-md rounded-[32px] border border-outline-variant/30 p-8 shadow-sm">
                    <h2 className="text-lg font-bold text-on-surface mb-2 flex items-center gap-2 font-headline">
                        <span className="material-symbols-outlined text-primary">font_download</span>
                        Typography Architecture
                    </h2>
                    <p className="text-xs text-on-surface-variant mb-6">High-performance font stack for data tables, metrics, and menus.</p>
                    
                    <div className="flex flex-col gap-3">
                        {fontOptions.map(font => (
                            <button
                                key={font.id}
                                type="button"
                                onClick={() => handleFontStyleChange(font.id)}
                                className={`flex items-center justify-between p-4 rounded-2xl border transition-all text-left ${fontStyle === font.id ? 'border-primary bg-primary/10 shadow-sm' : 'border-outline-variant/30 hover:border-outline-variant/60 bg-surface-container-low'}`}
                            >
                                <div>
                                  <span className={`text-sm font-bold block ${fontStyle === font.id ? 'text-primary' : 'text-on-surface'}`}>{font.label}</span>
                                  <span className="text-[11px] text-on-surface-variant">{font.desc}</span>
                                </div>
                                {fontStyle === font.id && <span className="material-symbols-outlined text-primary">check_circle</span>}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Form Geometry */}
                <div className="bg-surface-container-low/60 backdrop-blur-md rounded-[32px] border border-outline-variant/30 p-8 shadow-sm">
                    <h2 className="text-lg font-bold text-on-surface mb-2 flex items-center gap-2 font-headline">
                        <span className="material-symbols-outlined text-primary">rounded_corner</span>
                        Component Geometry
                    </h2>
                    <p className="text-xs text-on-surface-variant mb-6">Corner curves for cards, inputs, dialogs, and navigation pills.</p>
                    
                    <div className="grid grid-cols-3 gap-4">
                        {radiusOptions.map(radius => (
                            <button
                                key={radius.id}
                                type="button"
                                onClick={() => handleBorderRadiusChange(radius.id)}
                                className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${borderRadius === radius.id ? 'border-primary bg-primary/10' : 'border-outline-variant/30 hover:border-outline-variant/60 bg-surface-container-low'}`}
                            >
                                <div className={`w-full h-8 border-2 border-outline-variant/40 bg-surface-container ${radius.radiusClass}`}></div>
                                <span className={`text-xs font-bold ${borderRadius === radius.id ? 'text-primary' : 'text-on-surface-variant'}`}>{radius.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

            </div>
        </div>

        {/* Action Bar */}
        <div className="mt-8 flex justify-end gap-4 pb-12">
            <button 
                type="button"
                onClick={handleReset}
                className="px-6 py-2.5 rounded-xl border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-low font-bold text-sm transition-colors"
            >
                Reset to TradingView Default
            </button>
            <button 
                type="button"
                onClick={handleApplyTheme}
                className="px-8 py-2.5 rounded-xl bg-primary text-white font-bold text-sm transition-all hover:-translate-y-0.5 shadow-[0_0_20px_rgba(41,98,255,0.35)]"
            >
                Save Theme Preference
            </button>
        </div>

      </div>
    </Layout>
  );
}
