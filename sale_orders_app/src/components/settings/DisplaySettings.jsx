import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useDialog } from '../../context/DialogContext';

export default function DisplaySettings() {
  const { state, setCollection } = useApp();
  const { appAlert } = useDialog();

  const currentDisplay = state.displaySettings || { webScale: 75, mobileScale: 100 };
  const [webScale, setWebScale] = useState(currentDisplay.webScale || 75);
  const [mobileScale, setMobileScale] = useState(currentDisplay.mobileScale || 100);

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;

  const webScaleOptions = [70, 75, 80, 85, 90, 100, 110, 120];
  const mobileScaleOptions = [50, 60, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115];

  const handleSaveSettings = () => {
    const updatedDisplay = {
      webScale: Number(webScale),
      mobileScale: Number(mobileScale)
    };
    setCollection('displaySettings', updatedDisplay);
    appAlert('Display scaling preferences saved successfully!', 'success');
  };

  return (
    <div className="bg-surface rounded-3xl overflow-hidden shadow-sm border border-outline-variant/10 max-w-5xl mx-auto">
      <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-outline-variant/15">
        
        {/* Left Side: Controls */}
        <div className="flex-1 p-8 space-y-8 bg-surface-container-lowest">
          <header className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-[16px]">display_settings</span>
              Display Preferences
            </div>
            <h2 className="text-3xl font-black text-on-surface tracking-tight font-manrope">
              Display Scaling & Zoom
            </h2>
            <p className="text-on-surface-variant text-sm font-semibold">
              Adjust your application interface scaling and zoom levels to optimize visual clarity and data density.
            </p>
          </header>

          <hr className="border-outline-variant/15" />

          {/* Desktop Web Scaling Option (Only shown on Desktop/Web view) */}
          {!isMobile && (
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-extrabold text-on-surface text-base">Desktop Web Scaling</h3>
                  <p className="text-xs text-on-surface-variant font-medium mt-1">
                    Set the default zoom level for desktop web browsers. (Recommended: 75% for an optimized data-dense layout).
                  </p>
                </div>
                <span className="text-2xl font-black text-primary bg-primary/5 px-4 py-1.5 rounded-2xl border border-primary/20 shrink-0">
                  {webScale}%
                </span>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {webScaleOptions.map(scale => (
                  <button
                    key={scale}
                    onClick={() => setWebScale(scale)}
                    className={`py-3 rounded-xl text-xs font-extrabold transition-all border active:scale-[0.97] ${
                      webScale === scale
                        ? 'bg-primary text-on-primary border-primary shadow-md shadow-primary/10'
                        : 'bg-surface-container border-outline-variant/30 text-on-surface-variant hover:border-primary/50 hover:bg-primary/5 hover:text-primary'
                    }`}
                  >
                    {scale}%
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Mobile Scaling Option (Only shown on Mobile view) */}
          {isMobile && (
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-extrabold text-on-surface text-base">Mobile App Scaling</h3>
                  <p className="text-xs text-on-surface-variant font-medium mt-1">
                    Set the default scaling level for mobile devices. (Recommended: 100% for optimum touch targets and accessibility).
                  </p>
                </div>
                <span className="text-2xl font-black text-secondary bg-secondary/5 px-4 py-1.5 rounded-2xl border border-secondary/20 shrink-0">
                  {mobileScale}%
                </span>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {mobileScaleOptions.map(scale => (
                  <button
                    key={scale}
                    onClick={() => setMobileScale(scale)}
                    className={`py-3 rounded-xl text-xs font-extrabold transition-all border active:scale-[0.97] ${
                      mobileScale === scale
                        ? 'bg-secondary text-on-secondary border-secondary shadow-md shadow-secondary/10'
                        : 'bg-surface-container border-outline-variant/30 text-on-surface-variant hover:border-secondary/50 hover:bg-secondary/5 hover:text-secondary'
                    }`}
                  >
                    {scale}%
                  </button>
                ))}
              </div>
            </section>
          )}

          <hr className="border-outline-variant/15" />

          {/* Save Action */}
          <div className="pt-2">
            <button
              onClick={handleSaveSettings}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-primary to-primary-container text-white font-extrabold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>save</span>
              Save Display Preferences
            </button>
          </div>
        </div>

        {/* Right Side: Virtual Simulator */}
        <div className="w-full lg:w-[380px] p-8 bg-surface-container-low flex flex-col gap-6 items-center justify-center shrink-0">
          <div className="text-center space-y-1">
            <h4 className="font-bold text-on-surface text-sm">Visual Scaling Simulator</h4>
            <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Dynamic Layout Emulation</p>
          </div>

          {/* Dynamic Simulator Preview */}
          <div 
            className="w-full bg-white rounded-3xl p-5 border border-outline-variant/20 shadow-sm relative overflow-hidden transition-all duration-300" 
            style={{ transform: `scale(${isMobile ? mobileScale / 100 : webScale / 100})`, transformOrigin: 'center' }}
          >
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                <div className="w-8 h-2 bg-slate-200 rounded"></div>
              </div>
              <div className="w-12 h-2 bg-slate-100 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full bg-slate-100 rounded-sm"></div>
              <div className="h-3 w-5/6 bg-slate-100 rounded-sm"></div>
              <div className="grid grid-cols-3 gap-1.5 pt-2">
                <div className="h-5 bg-primary/10 rounded-lg flex items-center justify-center text-[7px] font-black text-primary">
                  SCALE: {isMobile ? mobileScale : webScale}%
                </div>
                <div className="h-5 bg-slate-100 rounded-lg"></div>
                <div className="h-5 bg-slate-100 rounded-lg"></div>
              </div>
            </div>
          </div>

          <div className="w-full text-center p-4 bg-surface-container-high/40 rounded-2xl border border-outline-variant/10 mt-6">
            <span className="material-symbols-outlined text-4xl text-outline mb-2">devices</span>
            <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
              Updating your display preferences instantly modifies application layout density. Scaling settings will persist across system reboots.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
