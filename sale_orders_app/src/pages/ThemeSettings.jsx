import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useApp } from '../context/AppContext';

export default function ThemeSettings() {
  const { state, updateThemeSettings } = useApp();
  const currentTheme = state.themeSettings || { colorMode: 'light', primaryColor: 'indigo', fontStyle: 'inter', borderRadius: 'rounded' };

  const [colorMode, setColorMode] = useState(currentTheme.colorMode);
  const [primaryColor, setPrimaryColor] = useState(currentTheme.primaryColor);
  const [fontStyle, setFontStyle] = useState(currentTheme.fontStyle);
  const [borderRadius, setBorderRadius] = useState(currentTheme.borderRadius);

  useEffect(() => {
    setColorMode(currentTheme.colorMode);
    setPrimaryColor(currentTheme.primaryColor);
    setFontStyle(currentTheme.fontStyle);
    setBorderRadius(currentTheme.borderRadius);
  }, [currentTheme]);

  const handleApplyTheme = () => {
    updateThemeSettings({ colorMode, primaryColor, fontStyle, borderRadius });
  };

  const handleReset = () => {
    const defaults = { colorMode: 'light', primaryColor: 'indigo', fontStyle: 'inter', borderRadius: 'rounded' };
    setColorMode(defaults.colorMode);
    setPrimaryColor(defaults.primaryColor);
    setFontStyle(defaults.fontStyle);
    setBorderRadius(defaults.borderRadius);
    updateThemeSettings(defaults);
  };

  const colorOptions = [
    { id: 'indigo', hex: '#6366f1', label: 'Indigo (Default)' },
    { id: 'emerald', hex: '#10b981', label: 'Emerald' },
    { id: 'rose', hex: '#f43f5e', label: 'Rose' },
    { id: 'amber', hex: '#f59e0b', label: 'Amber' },
    { id: 'sky', hex: '#0ea5e9', label: 'Sky' },
  ];

  const fontOptions = [
    { id: 'inter', label: 'Inter (System)' },
    { id: 'roboto', label: 'Roboto' },
    { id: 'outfit', label: 'Outfit (Modern)' },
  ];

  const radiusOptions = [
    { id: 'sharp', label: 'Sharp', radiusClass: 'rounded-none' },
    { id: 'rounded', label: 'Rounded', radiusClass: 'rounded-xl' },
    { id: 'pill', label: 'Pill', radiusClass: 'rounded-full' },
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
        <div className="mb-8">
            <h1 className="text-3xl font-black text-on-surface tracking-tight mb-2">Theme & Appearance</h1>
            <p className="text-on-surface-variant text-sm max-w-2xl">
              Manage the visual identity, branding elements, and functional aesthetics of your Flashvision workspace.
            </p>
        </div>

        {/* Settings Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Column */}
            <div className="space-y-6">
                
                {/* Color Mode */}
                <div className="bg-surface-container-low/50 backdrop-blur-md rounded-[32px] border border-outline-variant/20 p-8">
                    <h2 className="text-lg font-bold text-on-surface mb-2 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">light_mode</span>
                        Color Mode
                    </h2>
                    <p className="text-xs text-on-surface-variant mb-6">Choose between light or dark interface theme.</p>
                    
                    <div className="flex gap-4">
                        <button 
                            onClick={() => setColorMode('light')}
                            className={`flex-1 flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${colorMode === 'light' ? 'border-primary bg-primary/5' : 'border-outline-variant/20 hover:border-outline-variant/50'}`}
                        >
                            <div className="w-12 h-12 rounded-full bg-[#f8fafc] border border-slate-200 flex items-center justify-center shadow-inner">
                                <span className="material-symbols-outlined text-slate-800">light_mode</span>
                            </div>
                            <span className={`text-sm font-bold ${colorMode === 'light' ? 'text-primary' : 'text-on-surface-variant'}`}>Light Mode</span>
                        </button>
                        
                        <button 
                            onClick={() => setColorMode('dark')}
                            className={`flex-1 flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${colorMode === 'dark' ? 'border-primary bg-primary/5' : 'border-outline-variant/20 hover:border-outline-variant/50'}`}
                        >
                            <div className="w-12 h-12 rounded-full bg-[#0f172a] border border-slate-700 flex items-center justify-center shadow-inner">
                                <span className="material-symbols-outlined text-white">dark_mode</span>
                            </div>
                            <span className={`text-sm font-bold ${colorMode === 'dark' ? 'text-primary' : 'text-on-surface-variant'}`}>Dark Mode</span>
                        </button>
                    </div>
                </div>

                {/* System Palette */}
                <div className="bg-surface-container-low/50 backdrop-blur-md rounded-[32px] border border-outline-variant/20 p-8">
                    <h2 className="text-lg font-bold text-on-surface mb-2 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">colors</span>
                        System Palette
                    </h2>
                    <p className="text-xs text-on-surface-variant mb-6">Define the primary brand color applied to interactive elements and focal points.</p>
                    
                    <div className="flex flex-wrap gap-4">
                        {colorOptions.map(color => (
                            <button
                                key={color.id}
                                onClick={() => setPrimaryColor(color.id)}
                                title={color.label}
                                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${primaryColor === color.id ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-110' : 'hover:scale-105'}`}
                                style={{ backgroundColor: color.hex }}
                            >
                                {primaryColor === color.id && <span className="material-symbols-outlined text-white text-[20px]" style={{ fontVariationSettings: "'wght' 700" }}>check</span>}
                            </button>
                        ))}
                    </div>
                </div>

            </div>

            {/* Right Column */}
            <div className="space-y-6">
                
                {/* Typography */}
                <div className="bg-surface-container-low/50 backdrop-blur-md rounded-[32px] border border-outline-variant/20 p-8">
                    <h2 className="text-lg font-bold text-on-surface mb-2 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">text_fields</span>
                        Typography
                    </h2>
                    <p className="text-xs text-on-surface-variant mb-6">Select the default font family for the application interface.</p>
                    
                    <div className="flex flex-col gap-3">
                        {fontOptions.map(font => (
                            <button
                                key={font.id}
                                onClick={() => setFontStyle(font.id)}
                                className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${fontStyle === font.id ? 'border-primary bg-primary/5' : 'border-outline-variant/20 hover:border-outline-variant/50'}`}
                            >
                                <span className={`text-sm font-bold ${fontStyle === font.id ? 'text-primary' : 'text-on-surface'}`}>{font.label}</span>
                                {fontStyle === font.id && <span className="material-symbols-outlined text-primary">check_circle</span>}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Form Geometry */}
                <div className="bg-surface-container-low/50 backdrop-blur-md rounded-[32px] border border-outline-variant/20 p-8">
                    <h2 className="text-lg font-bold text-on-surface mb-2 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">rounded_corner</span>
                        Form Geometry
                    </h2>
                    <p className="text-xs text-on-surface-variant mb-6">Set the corner radius for buttons, inputs, and cards.</p>
                    
                    <div className="grid grid-cols-3 gap-4">
                        {radiusOptions.map(radius => (
                            <button
                                key={radius.id}
                                onClick={() => setBorderRadius(radius.id)}
                                className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${borderRadius === radius.id ? 'border-primary bg-primary/5' : 'border-outline-variant/20 hover:border-outline-variant/50'}`}
                            >
                                <div className={`w-full h-8 border-2 border-outline-variant/30 bg-surface-container ${radius.radiusClass}`}></div>
                                <span className={`text-xs font-bold ${borderRadius === radius.id ? 'text-primary' : 'text-on-surface-variant'}`}>{radius.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

            </div>
        </div>

        {/* Action Bar */}
        <div className="mt-8 flex justify-end gap-4">
            <button 
                onClick={handleReset}
                className="px-6 py-2.5 rounded-xl border border-outline-variant/20 text-on-surface-variant hover:bg-surface-container-low font-bold text-sm transition-colors"
            >
                Reset to Default
            </button>
            <button 
                onClick={handleApplyTheme}
                className="px-6 py-2.5 rounded-xl bg-primary text-on-primary shadow-sm hover:shadow font-bold text-sm transition-all hover:-translate-y-0.5"
            >
                Apply Theme
            </button>
        </div>

      </div>
    </Layout>
  );
}
