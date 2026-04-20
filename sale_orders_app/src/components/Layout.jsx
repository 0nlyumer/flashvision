import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Layout({ children }) {
  return (
    <div className="text-on-surface overflow-hidden flex min-h-screen bg-background">
      {/* SideNavBar (Desktop Shell) */}
      <aside className="h-screen w-[280px] fixed left-0 top-0 flex flex-col bg-slate-100 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>flash_on</span>
          </div>
          <div>
            <div className="text-lg font-black text-blue-900 dark:text-white leading-tight">Flashvision</div>
            <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Logistics Intelligence</div>
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto custom-scrollbar">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 font-manrope text-sm transition-all duration-200 ease-in-out rounded-lg ${
                isActive
                  ? 'bg-blue-600/10 dark:bg-blue-400/10 text-blue-700 dark:text-blue-300 font-bold'
                  : 'text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-200 dark:hover:bg-slate-800 group'
              }`
            }
          >
            <span className="material-symbols-outlined group-hover:text-primary">dashboard</span>
            <span>Dashboard</span>
          </NavLink>
          
          <NavLink
            to="/sale-orders"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 font-manrope text-sm transition-all duration-200 ease-in-out rounded-lg ${
                isActive
                  ? 'bg-blue-600/10 dark:bg-blue-400/10 text-blue-700 dark:text-blue-300 font-bold'
                  : 'text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-200 dark:hover:bg-slate-800 group'
              }`
            }
          >
            <span className="material-symbols-outlined group-hover:text-primary">shopping_cart</span>
            <span>Sales Orders</span>
          </NavLink>

          <NavLink
            to="/production-flow"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 font-manrope text-sm transition-all duration-200 ease-in-out rounded-lg ${
                isActive
                  ? 'bg-blue-600/10 dark:bg-blue-400/10 text-blue-700 dark:text-blue-300 font-bold'
                  : 'text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-200 dark:hover:bg-slate-800 group'
              }`
            }
          >
            <span className="material-symbols-outlined group-hover:text-primary">account_tree</span>
            <span>OMS</span>
          </NavLink>

          <NavLink
            to="/inventory"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 font-manrope text-sm transition-all duration-200 ease-in-out rounded-lg ${
                isActive
                  ? 'bg-blue-600/10 dark:bg-blue-400/10 text-blue-700 dark:text-blue-300 font-bold'
                  : 'text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-200 dark:hover:bg-slate-800 group'
              }`
            }
          >
            <span className="material-symbols-outlined group-hover:text-primary">inventory_2</span>
            <span>Inventory</span>
          </NavLink>

          <NavLink
            to="/delivery-dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 font-manrope text-sm transition-all duration-200 ease-in-out rounded-lg ${
                isActive
                  ? 'bg-blue-600/10 dark:bg-blue-400/10 text-blue-700 dark:text-blue-300 font-bold'
                  : 'text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-200 dark:hover:bg-slate-800 group'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className="material-symbols-outlined group-hover:text-primary" style={{ fontVariationSettings: isActive ? "'FILL' 1" : undefined }}>local_shipping</span>
                <span>Delivery</span>
              </>
            )}
          </NavLink>

          <NavLink
            to="/admin-setup"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 font-manrope text-sm transition-all duration-200 ease-in-out rounded-lg ${
                isActive
                  ? 'bg-blue-600/10 dark:bg-blue-400/10 text-blue-700 dark:text-blue-300 font-bold'
                  : 'text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-200 dark:hover:bg-slate-800 group'
              }`
            }
          >
            <span className="material-symbols-outlined group-hover:text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>group_add</span>
            <span>User Control</span>
          </NavLink>
        </nav>
        
        <div className="p-4 mt-auto border-t border-slate-200/50 dark:border-slate-800/50">
          <a className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 font-manrope text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-800 transition-all duration-200 ease-in-out group" href="#">
            <span className="material-symbols-outlined">help</span>
            <span>Support</span>
          </a>
          <NavLink to="/settings" className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 font-manrope text-sm font-medium transition-all duration-200 ease-in-out group rounded-lg ${isActive ? 'bg-blue-600/10 text-primary font-bold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'}`
          }>
            <span className="material-symbols-outlined group-hover:text-primary">settings</span>
            <span>Settings</span>
          </NavLink>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="ml-[280px] flex-1 flex flex-col relative overflow-y-auto w-full max-h-screen bg-surface">
        {/* TopNavBar */}
        <header className="docked full-width top-0 sticky z-40 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/20 flex justify-between items-center w-full px-10 py-5">
          <div className="flex items-center gap-8 flex-1">
            <div className="relative w-full max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
              <input className="w-full bg-surface-container-low border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary-container focus:outline-none placeholder:text-slate-400 transition-all" placeholder="Search dispatches, challans, or orders..." type="text" />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors active:scale-95 duration-150">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <NavLink to="/settings" className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors active:scale-95 duration-150 flex items-center justify-center">
                <span className="material-symbols-outlined">settings</span>
              </NavLink>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800"></div>
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.location.href="/"}>
              <div className="text-right hidden xl:block">
                <p className="text-xs font-bold text-on-surface leading-tight">Alex Sterling</p>
                <p className="text-[10px] text-on-surface-variant">Logistics Director</p>
              </div>
              <img className="w-10 h-10 rounded-full object-cover border-2 border-primary-fixed ring-4 ring-primary-fixed/20 group-hover:ring-primary-fixed/40 transition-all" alt="User Profile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpE_7nq3cQA2WhQwuKWRDeRExnrwDZ2H4cLF9MyG5b8jJwrnmbawBaT3K0ZvtOEBBws0978SY6nNpxxcGodOkJF4gaHFTMaOSc2FXlK-TIZp-2Vgr33JIbpf0eUnfbhhr3MIq1NPxu47bJgK2ot6dCu1P9p381UKWpXqz30L-69ajlaIe17bTDt5BIAT4GFF2fOSyYtsb4IFTfqUvFtSShYTbXFw1paQT1RfoSsoH2r-XNYODxmk9Xc-XziXFtdFLNwzH_TJu_V1_6" />
            </div>
          </div>
        </header>

        {/* Inner Content Area */}
        <div className="p-8 lg:p-12 space-y-10 max-w-[1440px] mx-auto w-full relative z-10">
          {children}
        </div>

        {/* Footer Attribution/Meta */}
        <footer className="mt-auto px-12 pt-8 pb-10 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest relative z-10">
          <p>© 2024 FLASHVISION LOGISTICS INTELLIGENCE</p>
          <div className="flex gap-6">
            <a className="hover:text-primary transition-colors" href="#">System Health: 100%</a>
            <a className="hover:text-primary transition-colors" href="#">Legal & Compliance</a>
          </div>
        </footer>

        {/* Visual Polish: Decorative Gradient Glows */}
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none z-0"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-[30%] h-[30%] bg-tertiary/5 blur-[100px] rounded-full pointer-events-none z-0"></div>
      </main>
    </div>
  );
}
