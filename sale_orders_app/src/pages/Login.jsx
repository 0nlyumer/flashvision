import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Navigate to dashboard
    navigate('/dashboard');
  };

  return (
    <main className="flex-grow flex w-full min-h-screen overflow-hidden">
      {/* Left Side: Brand Area (60%) */}
      <div className="hidden lg:flex lg:w-[60%] brand-gradient relative items-center justify-center p-12 overflow-hidden">
        {/* Decorative subtle patterns */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full border border-white/20"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full border border-white/10"></div>
        </div>
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center mb-8 border border-white/20">
            <span className="material-symbols-outlined text-white text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              deployed_code
            </span>
          </div>
          <h1 className="text-6xl font-extrabold font-headline tracking-tight text-white mb-4">
            AJ Synthetic
          </h1>
          <p className="text-primary-fixed text-xl max-w-md font-medium opacity-80">
            Next-generation synthetic intelligence for global logistics networks.
          </p>
          <div className="mt-16 flex gap-12 opacity-40">
            <div className="flex flex-col items-center">
              <span className="text-white text-2xl font-bold">99.9%</span>
              <span className="text-white text-[10px] uppercase tracking-widest mt-1">Uptime</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-white text-2xl font-bold">256-bit</span>
              <span className="text-white text-[10px] uppercase tracking-widest mt-1">Encrypted</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-white text-2xl font-bold">Real-time</span>
              <span className="text-white text-[10px] uppercase tracking-widest mt-1">Analysis</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form (40%) */}
      <div className="w-full lg:w-[40%] bg-surface flex flex-col relative">
        <div className="flex-grow flex flex-col justify-center px-8 sm:px-12 md:px-16 lg:px-20 py-12">
          {/* Mobile Brand Header */}
          <div className="lg:hidden flex items-center gap-3 mb-12">
            <div className="w-10 h-10 brand-gradient rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-2xl">deployed_code</span>
            </div>
            <span className="text-2xl font-extrabold font-headline tracking-tight text-primary">
              AJ Synthetic
            </span>
          </div>

          {/* Login Form Header */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-outline">Powered by</span>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                  bolt
                </span>
                <span className="text-xs font-extrabold font-headline text-primary">Flashvision</span>
              </div>
            </div>
            <h2 className="text-3xl font-bold font-headline text-on-surface tracking-tight mb-2">Precision Access</h2>
            <p className="text-on-surface-variant text-sm">Enter your credentials to manage your synthetic assets.</p>
          </div>

          {/* Form Section */}
          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant ml-1" htmlFor="username">
                Username or Email
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-lg group-focus-within:text-primary transition-colors">
                  person
                </span>
                <input
                  className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none ring-1 ring-outline-variant/20 rounded-xl focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:outline-none transition-all placeholder:text-outline/40"
                  id="username"
                  placeholder="user@ajsynthetic.com"
                  type="text"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant ml-1" htmlFor="password">
                Password
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-lg group-focus-within:text-primary transition-colors">
                  lock
                </span>
                <input
                  className="w-full pl-12 pr-12 py-4 bg-surface-container-low border-none ring-1 ring-outline-variant/20 rounded-xl focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:outline-none transition-all placeholder:text-outline/40"
                  id="password"
                  placeholder="••••••••"
                  type="password"
                />
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
                  type="button"
                >
                  <span className="material-symbols-outlined text-lg">visibility</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between py-1">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input className="peer sr-only" type="checkbox" />
                  <div className="w-5 h-5 border-2 border-outline-variant rounded group-hover:border-primary peer-checked:bg-primary peer-checked:border-primary transition-all"></div>
                  <span className="material-symbols-outlined absolute inset-0 text-white text-[14px] flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity">
                    check
                  </span>
                </div>
                <span className="text-sm text-on-surface-variant font-medium">Remember Me</span>
              </label>
              <a className="text-sm font-semibold text-primary hover:opacity-80 transition-opacity" href="#">
                Forgot Password?
              </a>
            </div>

            <div className="pt-2 space-y-4">
              <button
                className="w-full primary-gradient text-on-primary py-4 rounded-xl font-bold tracking-wide active:scale-[0.98] transition-all ambient-shadow"
                type="submit"
              >
                Sign In
              </button>
              <button
                className="w-full bg-surface-container text-on-surface-variant py-4 rounded-xl font-semibold hover:bg-surface-container-high transition-all"
                type="button"
              >
                Contact System Admin
              </button>
            </div>
          </form>

          {/* Bottom Branding */}
          <div className="mt-12 flex items-center gap-4 opacity-30">
            <div className="h-[1px] flex-grow bg-outline"></div>
            <span className="text-[9px] font-bold tracking-[0.2em] uppercase whitespace-nowrap">Security Protocol v4.2</span>
            <div className="h-[1px] flex-grow bg-outline"></div>
          </div>
        </div>

        {/* Right Side Footer */}
        <footer className="w-full px-8 py-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-outline font-medium uppercase tracking-widest border-t border-outline-variant/10">
          <div>© 2024 AJ Synthetic</div>
          <nav className="flex gap-6">
            <a className="hover:text-primary transition-colors" href="#">Privacy</a>
            <a className="hover:text-primary transition-colors" href="#">Terms</a>
            <a className="hover:text-primary transition-colors" href="#">Status</a>
          </nav>
        </footer>
      </div>
    </main>
  );
}
