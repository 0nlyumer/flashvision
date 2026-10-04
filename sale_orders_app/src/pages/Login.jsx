import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const DB_NAME = 'AjSyntheticSettings';
const STORE_NAME = 'media';

const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (e) => {
      e.target.result.createObjectStore(STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const saveBgMedia = async (data, type) => {
  try {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put({ data, type }, 'bgMedia');
  } catch (err) {
    console.error("Failed to save media to IDB", err);
  }
};

const loadBgMedia = async () => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const request = tx.objectStore(STORE_NAME).get('bgMedia');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error("Failed to load media from IDB", err);
    return null;
  }
};

const greetingsList = [
  "Streamline your operations. Welcome back!",
  "Powering your productivity, one login at a time.",
  "Ready to optimize your workflow? Let’s begin.",
  "Your business hub is ready. Let’s get to work.",
  "Efficiency starts here. Welcome!",
  "Managing excellence together. Glad to see you!",
  "Data-driven success begins with your focus.",
  "Control your enterprise with precision. Welcome back!",
  "Ready to scale today? Your dashboard awaits.",
  "Turning operations into growth. Let’s start.",
  "Empowering your business journey. Welcome!",
  "Focused management, limitless growth. Let's dive in.",
  "Your mission, our platform. Let’s achieve more today.",
  "Success is in the details. Let’s manage them well.",
  "Experience seamless management. Welcome back!",
  "Your operational command center is online.",
  "Simplify. Manage. Grow. Welcome to the portal.",
  "Precision in every task. Ready to start?",
  "Focus on what matters. We’ll handle the rest.",
  "Synchronizing your success. Welcome!",
  "Drive innovation through better management. Let’s go!",
  "Connecting teams, empowering results. Welcome back."
];

// Reusable component to make sections freely movable
const DraggablePanel = ({ id, defaultOffset, children, className, style, isLocked }) => {
  const [offset, setOffset] = useState(() => {
    const saved = localStorage.getItem(`aj_draggable_${id}`);
    return saved ? JSON.parse(saved) : defaultOffset;
  });

  const handleMouseDown = (e) => {
    if (isLocked) return;
    // Ignore drag if interacting with inputs or buttons
    if (['INPUT', 'BUTTON', 'A', 'TEXTAREA', 'SELECT', 'OPTION'].includes(e.target.tagName)) return;
    if (e.target.closest('button') || e.target.closest('a')) return;

    e.preventDefault();
    const startX = e.clientX - offset.x;
    const startY = e.clientY - offset.y;

    const handleMouseMove = (moveEvent) => {
      setOffset({
        x: moveEvent.clientX - startX,
        y: moveEvent.clientY - startY
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Reset to default flex position
  const resetPosition = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setOffset({ x: 0, y: 0 });
  };

  useEffect(() => {
    localStorage.setItem(`aj_draggable_${id}`, JSON.stringify(offset));
  }, [offset, id]);

  return (
    <div 
      className={`relative group ${isLocked ? '' : 'cursor-move'} ${className}`}
      style={{ transform: `translate(${offset.x}px, ${offset.y}px)`, transition: isLocked ? 'transform 0.3s ease' : 'transform 0.05s linear', ...style }}
      onMouseDown={handleMouseDown}
    >
      {/* Optional Reset Handle visible on hover */}
      {(offset.x !== 0 || offset.y !== 0) && !isLocked && (
        <button 
          onClick={resetPosition}
          className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-lg"
          title="Reset Position"
        >
          <span className="material-symbols-outlined text-sm">restart_alt</span>
        </button>
      )}
      {children}
    </div>
  );
};

export default function Login() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { state, login, isInitialLoadCompleted } = useApp(); // Get global settings for company info

  // State
  const [theme, setTheme] = useState('dark');
  const [bgMedia, setBgMedia] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [greeting, setGreeting] = useState('');
  
  // New Toggles
  const [bgFit, setBgFit] = useState('contain');
  const [isLayoutLocked, setIsLayoutLocked] = useState(false);
  const [showCompanyInfo, setShowCompanyInfo] = useState(true);

  // Validation shake state
  const [shakeField, setShakeField] = useState(null);

  // Auto-redirect if already logged in
  useEffect(() => {
    if (state?.currentUser) {
      if (state.currentUser.requirePasswordChange) {
        navigate('/profile?forceChange=true', { replace: true });
      } else if (import.meta.env.VITE_APP_MODE === 'chat') {
        navigate('/chat', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [state?.currentUser, navigate]);

  // Load saved preferences on mount
  useEffect(() => {
    setGreeting(greetingsList[Math.floor(Math.random() * greetingsList.length)]);

    const savedTheme = localStorage.getItem('aj_login_theme');
    if (savedTheme) setTheme(savedTheme);

    const savedFit = localStorage.getItem('aj_login_bg_fit');
    if (savedFit) setBgFit(savedFit);

    const savedLock = localStorage.getItem('aj_login_layout_lock');
    if (savedLock !== null) setIsLayoutLocked(savedLock === 'true');

    const savedShow = localStorage.getItem('aj_login_show_company');
    if (savedShow !== null) setShowCompanyInfo(savedShow === 'true');

    loadBgMedia().then(media => {
      if (media) setBgMedia(media);
    });
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (!email || !password) {
      if (!email && !password) setShakeField('both');
      else if (!email) setShakeField('email');
      else setShakeField('password');
      
      setTimeout(() => setShakeField(null), 500); // Remove shake class after animation
      return;
    }

    // Platform detection
    let platform = 'Web';
    if (window.process && window.process.versions && window.process.versions.electron) {
      platform = 'Windows Desktop';
    } else if (window.Capacitor || window.cordova || /Android|iPhone|iPad/i.test(navigator.userAgent)) {
      platform = 'Android App';
    }

    const result = login(email, password, platform);
    if (!result.success) {
      setShakeField('both');
      setTimeout(() => setShakeField(null), 500);
      alert(`Login Error!\n\nInvalid username/email or password. Please verify your credentials.\n\n[Diagnostic Info]\nReason: ${result.reason}\nLoaded Users: ${(result.debugUsers || []).join(', ') || 'None'}`);
      return;
    }

    // If login is successful, check if the password needs to be changed
    if (result.user.requirePasswordChange) {
      navigate('/profile?forceChange=true');
    } else {
      if (import.meta.env.VITE_APP_MODE === 'chat') {
        navigate('/chat');
      } else {
        navigate('/dashboard');
      }
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('aj_login_theme', newTheme);
  };

  const handleMediaUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const data = reader.result;
        const type = file.type;
        setBgMedia({ data, type });
        saveBgMedia(data, type);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Theming classes
  const isDark = theme === 'dark';
  const textClass = isDark ? 'text-white' : 'text-gray-900';
  const textMutedClass = isDark ? 'text-gray-400' : 'text-gray-500';
  const inputBgClass = isDark ? 'bg-[#1a202c]' : 'bg-gray-50';
  const inputBorderClass = isDark ? 'border-gray-800' : 'border-gray-200';
  const btnBgClass = isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-[#0056b3] text-white hover:bg-[#004494]';
  const shakeClass = "animate-[shake_0.4s_ease-in-out] border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]";

  const getGreetingFontSize = (text) => {
    if (text.length > 50) return 'text-xs sm:text-sm';
    if (text.length > 35) return 'text-sm sm:text-base';
    return 'text-base sm:text-lg';
  };

  const companyName = state?.adminSetup?.companyName;

  return (
    <main className="relative min-h-full h-full w-full overflow-hidden flex items-center justify-center p-4 sm:p-12 transition-colors duration-700" style={{backgroundColor: isDark ? '#000' : '#f0f2f5'}}>
      
      {!isInitialLoadCompleted && (
        <div className="absolute inset-0 bg-[#0b141a]/85 backdrop-blur-md z-[9999] flex flex-col items-center justify-center text-white select-none animate-in fade-in duration-300">
          <div className="flex flex-col items-center gap-6">
            {/* Spinning Green Neon Ring */}
            <div className="relative w-20 h-20 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-[#00a884]/20 border-t-[#00a884] animate-spin"></div>
              <span className="material-symbols-outlined text-[#00a884] text-[36px] animate-pulse">cloud_sync</span>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-black font-headline uppercase tracking-wider text-white">
                Connecting to FlashVision
              </h3>
              <p className="text-xs text-slate-400 font-medium tracking-wide animate-pulse">
                Synchronizing secure cloud database...
              </p>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
        .animate-\\[shake_0\\.4s_ease-in-out\\] {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>

      {/* Background Media */}
      <div className={`absolute inset-0 z-0 flex items-center justify-center transition-colors duration-700 ${isDark ? 'bg-black' : 'bg-[#f0f2f5]'}`}>
        {bgMedia ? (
          bgMedia.type.startsWith('video/') ? (
            <video src={bgMedia.data} autoPlay loop muted className={`w-full h-full ${bgFit === 'cover' ? 'object-cover' : bgFit === 'contain' ? 'object-contain' : 'object-fill'}`} />
          ) : (
            <img src={bgMedia.data} className={`w-full h-full ${bgFit === 'cover' ? 'object-cover' : bgFit === 'contain' ? 'object-contain' : 'object-fill'}`} alt="Background" />
          )
        ) : (
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary rounded-full blur-[120px]"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600 rounded-full blur-[120px]"></div>
          </div>
        )}
      </div>

      <div className="relative z-10 w-full max-w-[1600px] h-full flex flex-col md:flex-row justify-between items-center gap-12">
        
        {/* Left Side - Transparent Area with Logo */}
        {companyName && showCompanyInfo ? (
          <DraggablePanel id="companyInfo" isLocked={isLayoutLocked} defaultOffset={{x: 0, y: 0}} className="hidden md:flex flex-col items-center justify-center w-full md:w-1/2 max-w-[600px]">
            <div className={`flex flex-col items-center justify-center text-center backdrop-blur-sm p-12 rounded-[40px] border shadow-[0_0_50px_rgba(0,0,0,0.3)] transition-all duration-700 ${isDark ? 'bg-black/20 border-white/10' : 'bg-white/40 border-black/10'}`}>
              {state.adminSetup?.logo ? (
                <img src={state.adminSetup.logo} alt="Company Logo" className="w-[120px] h-[120px] object-contain mb-6 drop-shadow-2xl" />
              ) : (
                <span className={`material-symbols-outlined text-[100px] drop-shadow-2xl mb-6 transition-colors duration-700 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  deployed_code
                </span>
              )}
              <h1 className={`text-5xl lg:text-6xl font-black tracking-widest uppercase drop-shadow-2xl font-headline transition-colors duration-700 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ textShadow: isDark ? '0 4px 20px rgba(0,0,0,0.5)' : '0 4px 20px rgba(255,255,255,0.5)' }}>
                {companyName}
              </h1>
              <p className={`mt-6 tracking-[0.3em] text-xs font-bold uppercase drop-shadow-md transition-colors duration-700 ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                {state.adminSetup.companySlogan || 'Advanced Intelligence Logistics'}
              </p>
            </div>
          </DraggablePanel>
        ) : (
          <div className="hidden md:flex w-full md:w-1/2"></div>
        )}

        {/* Right Side - Floating Form Card */}
        <DraggablePanel id="loginBox" isLocked={isLayoutLocked} defaultOffset={{x: 0, y: 0}} className={`w-full md:w-[450px] lg:w-[500px] h-auto sm:max-h-[85vh] sm:rounded-[32px] p-5 sm:p-12 flex flex-col justify-center shadow-[0_20px_60px_rgba(0,0,0,0.5)] transition-all duration-700 backdrop-blur-xl border ${isDark ? 'border-white/5 bg-[#131722]/95' : 'border-gray-200 bg-white/95'} ${textClass}`}>
          
          <div className="flex-grow flex flex-col justify-center relative">
            
            {/* Greeting with Welcome */}
            <div className="mb-10 mt-4">
              <h1 className={`text-3xl sm:text-4xl font-black mb-1 tracking-tight transition-colors duration-700 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Welcome
              </h1>
              <h2 className={`font-medium tracking-wide ${getGreetingFontSize(greeting)} transition-colors duration-700 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {greeting}
              </h2>
            </div>

            <form onSubmit={handleLogin} className="space-y-6 relative" noValidate>
              {/* Powered By (Moved strictly above the email field inside form wrapper) */}
              <div className="absolute -top-7 right-0 flex items-center gap-1.5 opacity-90 pointer-events-none">
                <span className={`text-[10px] font-extrabold uppercase tracking-widest transition-colors duration-700 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Powered by </span>
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-700 ${isDark ? 'text-[#39FF14]' : 'text-[#008000]'}`} style={{ textShadow: isDark ? '0 0 10px rgba(57, 255, 20, 0.3)' : 'none' }}>flashvision</span>
                <span className={`material-symbols-outlined text-[14px] transition-colors duration-700 ${isDark ? 'text-[#39FF14]' : 'text-[#008000]'}`}>bolt</span>
              </div>

              {/* Username/Email Input */}
              <div className="relative">
                <input 
                  type="text" 
                  name="email"
                  placeholder="Username or Email" 
                  className={`w-full rounded-xl py-4 px-5 pr-12 text-sm outline-none border transition-all duration-300 ${inputBgClass} ${inputBorderClass} focus:border-primary placeholder:text-gray-400 ${isDark ? 'text-white' : 'text-gray-900'} ${shakeField === 'both' || shakeField === 'email' ? shakeClass : ''}`}
                />
                <span className={`material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[18px] transition-colors duration-700 ${textMutedClass}`}>
                  person
                </span>
              </div>

              {/* Password Input */}
              <div className="relative">
                <input 
                  type="password" 
                  name="password"
                  placeholder="••••••••" 
                  className={`w-full rounded-xl py-4 px-5 pr-12 text-sm outline-none border transition-all duration-300 ${inputBgClass} ${inputBorderClass} focus:border-primary placeholder:text-gray-400 ${isDark ? 'text-white' : 'text-gray-900'} ${shakeField === 'both' || shakeField === 'password' ? shakeClass : ''}`}
                />
                <span className={`material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[18px] cursor-pointer hover:text-primary transition-colors duration-700 ${textMutedClass}`}>
                  visibility_off
                </span>
              </div>

              {/* Recover Password */}
              <div className="flex justify-end">
                <button type="button" className={`text-xs font-medium hover:text-primary transition-colors duration-700 ${textMutedClass}`}>
                  Recover Password ?
                </button>
              </div>

              {/* Sign In Button */}
              <button 
                type="submit" 
                className={`w-full py-4 rounded-xl font-bold mt-4 shadow-lg hover:shadow-xl active:scale-[0.98] transition-all duration-500 ${btnBgClass}`}
              >
                Sign In
              </button>
            </form>

            {/* Footer */}
            <div className={`mt-10 text-center border-t pt-6 transition-colors duration-700 ${isDark ? 'border-gray-500/20' : 'border-gray-300'}`}>
              <p className={`text-xs font-medium transition-colors duration-700 ${textMutedClass}`}>
                Need access? <a href="mailto:admin@flashvision.com" className={`font-bold ml-1 hover:underline transition-colors duration-700 ${textClass}`}>Contact System Admin</a>
              </p>
            </div>
          </div>
        </DraggablePanel>

      </div>

      {/* Floating Settings Widget */}
      <div className="absolute bottom-6 right-6 z-50">
        <div className="relative">
          {/* Settings Menu Dropdown */}
          {settingsOpen && (
            <div className={`absolute bottom-16 right-0 w-72 rounded-2xl p-5 shadow-2xl border backdrop-blur-xl transition-all duration-700 ${isDark ? 'bg-[#131722]/95 border-gray-800 text-white' : 'bg-white/95 border-gray-200 text-black'} animate-in fade-in slide-in-from-bottom-2 duration-200`}>
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">palette</span>
                Appearance Settings
              </h3>
              
              <div className="space-y-4">
                {/* Theme Toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Dark Mode</span>
                  <button 
                    onClick={toggleTheme}
                    className={`w-10 h-5 rounded-full relative transition-colors duration-500 ${isDark ? 'bg-primary' : 'bg-gray-300'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all duration-500 ${isDark ? 'left-[22px]' : 'left-0.5'}`}></div>
                  </button>
                </div>

                {/* Layout Lock Toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Lock Layout</span>
                  <button 
                    onClick={() => {
                      const newLock = !isLayoutLocked;
                      setIsLayoutLocked(newLock);
                      localStorage.setItem('aj_login_layout_lock', newLock);
                    }}
                    className={`w-10 h-5 rounded-full relative transition-colors duration-500 ${isLayoutLocked ? 'bg-red-500' : 'bg-gray-300'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all duration-500 ${isLayoutLocked ? 'left-[22px]' : 'left-0.5'}`}></div>
                  </button>
                </div>

                {/* Show Company Info Toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Show Company Info</span>
                  <button 
                    onClick={() => {
                      const newShow = !showCompanyInfo;
                      setShowCompanyInfo(newShow);
                      localStorage.setItem('aj_login_show_company', newShow);
                    }}
                    className={`w-10 h-5 rounded-full relative transition-colors duration-500 ${showCompanyInfo ? 'bg-green-500' : 'bg-gray-300'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all duration-500 ${showCompanyInfo ? 'left-[22px]' : 'left-0.5'}`}></div>
                  </button>
                </div>

                <hr className={`transition-colors duration-700 ${isDark ? 'border-gray-800' : 'border-gray-200'}`} />

                {/* Background Upload & Fit */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">Dynamic Background</p>
                    <select 
                      value={bgFit}
                      onChange={(e) => {
                        setBgFit(e.target.value);
                        localStorage.setItem('aj_login_bg_fit', e.target.value);
                      }}
                      className={`text-[10px] rounded px-1 py-0.5 border outline-none ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'}`}
                    >
                      <option value="contain">Fit (Contain)</option>
                      <option value="cover">Fill (Cover)</option>
                      <option value="fill">Stretch (Fill)</option>
                    </select>
                  </div>
                  <button 
                    onClick={triggerFileInput}
                    className={`w-full py-2 px-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors duration-300 ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}
                  >
                    <span className="material-symbols-outlined text-[18px]">upload</span>
                    Upload Media
                  </button>
                  <p className={`text-[10px] mt-2 text-center transition-colors duration-700 ${textMutedClass}`}>Supports high-res Images & Live Wallpapers (Videos)</p>
                  <input 
                    type="file" 
                    accept="image/*,video/*" 
                    ref={fileInputRef} 
                    onChange={handleMediaUpload} 
                    className="hidden" 
                  />
                  {bgMedia && (
                    <button 
                      onClick={() => { 
                        setBgMedia(null); 
                        initDB().then(db => {
                          const tx = db.transaction(STORE_NAME, 'readwrite');
                          tx.objectStore(STORE_NAME).delete('bgMedia');
                        });
                      }}
                      className="w-full mt-2 py-2 px-3 rounded-lg text-sm font-semibold text-red-500 hover:bg-red-500/10 transition-colors duration-300"
                    >
                      Remove Background
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Floating Toggle Button */}
          <button 
            onClick={() => setSettingsOpen(!settingsOpen)}
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.5)] hover:scale-105 transition-all duration-700 ${isDark ? 'bg-[#1a202c] border border-gray-700 text-white' : 'bg-white border border-gray-200 text-black'}`}
            title="Theme Settings"
          >
            <span className={`material-symbols-outlined text-2xl transition-transform duration-300 ${settingsOpen ? 'rotate-90' : ''}`}>
              settings
            </span>
          </button>
        </div>
      </div>

    </main>
  );
}
