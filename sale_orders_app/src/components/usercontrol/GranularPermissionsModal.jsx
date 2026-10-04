import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { permissionsConfig } from '../../constants/permissionsConfig';

export default function GranularPermissionsModal({ moduleKey, initialPermissions, userName, onSave, onClose }) {
  const config = permissionsConfig[moduleKey];
  const [permissions, setPermissions] = useState({});
  const [screenMaster, setScreenMaster] = useState({});

  useEffect(() => {
    // Initialize permissions and screen master toggles
    const initPerms = {};
    const initMaster = {};

    if (config && config.screens) {
      config.screens.forEach(screen => {
        initPerms[screen.id] = {};
        let hasAnyTrue = false;
        
        screen.perms.forEach(perm => {
          const val = initialPermissions?.[screen.id]?.[perm.id] || false;
          initPerms[screen.id][perm.id] = val;
          if (val) hasAnyTrue = true;
        });

        // Check if master toggle was explicitly saved or if any sub-permission is true
        const isMasterOn = initialPermissions?.[screen.id]?._enabled !== undefined
          ? initialPermissions[screen.id]._enabled
          : hasAnyTrue;

        initMaster[screen.id] = isMasterOn;
        initPerms[screen.id]._enabled = isMasterOn;
      });
    }
    setPermissions(initPerms);
    setScreenMaster(initMaster);
  }, [moduleKey, initialPermissions, config]);

  if (!config) return null;

  // Toggle Screen Master Access Switch
  const handleMasterToggle = (screenId) => {
    setScreenMaster(prevMaster => {
      const nextVal = !prevMaster[screenId];
      const updatedMaster = { ...prevMaster, [screenId]: nextVal };

      setPermissions(prevPerms => {
        const screenObj = { ...prevPerms[screenId] };
        screenObj._enabled = nextVal;

        // If turning ON master, ensure primary view/action is enabled
        const targetScreen = config.screens.find(s => s.id === screenId);
        if (targetScreen && targetScreen.perms) {
          targetScreen.perms.forEach(perm => {
            screenObj[perm.id] = nextVal;
          });
        }

        return {
          ...prevPerms,
          [screenId]: screenObj
        };
      });

      return updatedMaster;
    });
  };

  // Toggle Individual Sub-Permission
  const handlePermToggle = (screenId, permId) => {
    setPermissions(prev => {
      const currentScreenObj = prev[screenId] || {};
      const nextVal = !currentScreenObj[permId];

      const updatedScreen = {
        ...currentScreenObj,
        [permId]: nextVal
      };

      // If any sub-perm becomes true, automatically enable Master Toggle
      const hasActive = Object.keys(updatedScreen).some(k => k !== '_enabled' && updatedScreen[k]);
      updatedScreen._enabled = hasActive;

      setScreenMaster(m => ({ ...m, [screenId]: hasActive }));

      return {
        ...prev,
        [screenId]: updatedScreen
      };
    });
  };

  // Select/Deselect All Screens
  const handleToggleAllScreens = (enable) => {
    const nextMaster = {};
    const nextPerms = {};

    config.screens.forEach(screen => {
      nextMaster[screen.id] = enable;
      nextPerms[screen.id] = { _enabled: enable };
      screen.perms.forEach(perm => {
        nextPerms[screen.id][perm.id] = enable;
      });
    });

    setScreenMaster(nextMaster);
    setPermissions(nextPerms);
  };

  const handleSave = () => {
    onSave(permissions);
  };

  const modalContent = (
    <div className="fixed inset-0 top-0 left-0 right-0 bottom-0 z-[99999] bg-surface flex flex-col w-screen h-screen overflow-hidden animate-in fade-in duration-200 select-none">
      
      {/* Full-Screen Header */}
      <header className="relative bg-surface-container border-b border-outline-variant/20 px-8 py-5 flex items-center justify-between shrink-0 shadow-xs">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary-container to-secondary-fixed"></div>
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-2xs">
            <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              {config.icon}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-headline font-extrabold text-2xl text-on-surface tracking-tight">
                {config.title} <span className="text-primary font-bold">Permissions</span>
              </h1>
              <span className="bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-primary/20">
                Full-Screen View
              </span>
            </div>
            <p className="text-xs text-on-surface-variant font-medium mt-0.5">
              Managing screen access & granular action rights for <span className="text-primary font-bold uppercase">@{userName || 'User'}</span>
            </p>
          </div>
        </div>

        {/* Action Controls & Close */}
        <div className="flex items-center gap-4">
          <div className="flex gap-2 border-r border-outline-variant/20 pr-4">
            <button
              onClick={() => handleToggleAllScreens(true)}
              className="px-3.5 py-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-xs">select_all</span>
              Enable All Screens
            </button>
            <button
              onClick={() => handleToggleAllScreens(false)}
              className="px-3.5 py-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-xs">deselect</span>
              Disable All
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-high hover:bg-surface-container-highest transition-all group cursor-pointer"
            title="Close Fullscreen View"
          >
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-error transition-colors">close</span>
          </button>
        </div>
      </header>

      {/* Full-Screen Scrollable Body */}
      <main className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {config.screens.map((screen) => {
            const isMasterOn = !!screenMaster[screen.id];

            return (
              <div 
                key={screen.id} 
                className={`bg-surface border rounded-2xl transition-all duration-300 overflow-hidden shadow-xs ${
                  isMasterOn ? 'border-primary/30 ring-1 ring-primary/10' : 'border-outline-variant/15 opacity-75'
                }`}
              >
                {/* Screen Heading Bar with Master Toggle */}
                <div className={`px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b ${
                  isMasterOn ? 'bg-primary/5 border-primary/15' : 'bg-surface-container-low border-outline-variant/10'
                }`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                      isMasterOn ? 'bg-primary/10 text-primary border-primary/20' : 'bg-surface-container-high text-slate-400 border-outline-variant/20'
                    }`}>
                      <span className="material-symbols-outlined text-xl">{screen.icon}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-headline font-extrabold text-on-surface text-base">{screen.title}</h3>
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                          isMasterOn ? 'bg-emerald-500/15 text-emerald-700 border border-emerald-500/30' : 'bg-slate-500/15 text-slate-500 border border-slate-500/30'
                        }`}>
                          {isMasterOn ? 'Screen Enabled' : 'Screen Disabled'}
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant mt-0.5">{screen.description}</p>
                    </div>
                  </div>

                  {/* Screen Master Access Switch Toggle */}
                  <div className="flex items-center gap-3 bg-surface-container-lowest px-4 py-2 rounded-xl border border-outline-variant/20 shadow-2xs self-start sm:self-auto">
                    <span className="text-xs font-bold text-on-surface">Screen Access:</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={isMasterOn}
                        onChange={() => handleMasterToggle(screen.id)}
                      />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>

                {/* Sub-Permissions Grid */}
                <div className={`p-6 transition-all ${isMasterOn ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {screen.perms.map((perm) => {
                      const isChecked = !!permissions[screen.id]?.[perm.id];

                      return (
                        <label
                          key={perm.id}
                          className={`flex items-start justify-between p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                            isChecked 
                              ? (perm.isError ? 'bg-red-500/5 border-red-500/30 ring-1 ring-red-500/10' : 'bg-primary/5 border-primary/30 ring-1 ring-primary/10')
                              : 'bg-surface-container-low/50 border-outline-variant/15 hover:border-outline-variant/30'
                          }`}
                        >
                          <div className="flex flex-col pr-3">
                            <span className={`text-xs font-bold ${isChecked ? (perm.isError ? 'text-red-700' : 'text-primary') : 'text-on-surface'}`}>
                              {perm.label}
                            </span>
                            <span className="text-[11px] text-on-surface-variant/80 mt-1 leading-normal">
                              {perm.desc}
                            </span>
                          </div>

                          <div className="relative inline-block w-8 h-4 shrink-0 mt-0.5">
                            <input
                              type="checkbox"
                              className="peer sr-only"
                              checked={isChecked}
                              disabled={!isMasterOn}
                              onChange={() => handlePermToggle(screen.id, perm.id)}
                            />
                            <div className={`block w-8 h-4 rounded-full transition-all duration-200 ${isChecked ? (perm.isError ? 'bg-red-600' : 'bg-primary') : 'bg-slate-300'}`}>
                              <div className={`absolute left-0.5 top-0.5 bg-white w-3 h-3 rounded-full transition-transform duration-200 ${isChecked ? 'translate-x-4' : ''}`}></div>
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Info Banner */}
          <div className="bg-primary/5 border border-primary/15 rounded-2xl p-5 flex items-center gap-4">
            <span className="material-symbols-outlined text-primary text-2xl">security</span>
            <p className="text-xs font-medium text-on-surface-variant">
              Toggling the master switch for a screen grants or revokes the screen’s visibility in the navigation menu and system routes for this user.
            </p>
          </div>
        </div>
      </main>

      {/* Full-Screen Footer */}
      <footer className="px-8 py-4 bg-surface-container border-t border-outline-variant/20 flex items-center justify-between shrink-0 shadow-lg">
        <div className="text-xs font-bold text-on-surface-variant">
          Total Screens: <span className="text-primary font-black">{config.screens.length}</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-xs font-bold text-on-surface-variant hover:text-on-surface bg-surface-container-high hover:bg-surface-container-highest rounded-xl transition-all active:scale-95 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-8 py-2.5 bg-primary hover:bg-primary/90 text-on-primary text-xs font-black uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">save</span>
            Save Permissions
          </button>
        </div>
      </footer>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}
