import React, { useState } from 'react';
import Layout from '../components/Layout';
import DelDashboard from '../components/delivery/DelDashboard';
import DelCreation from '../components/delivery/DelCreation';
import DelCreationSlip from '../components/delivery/DelCreationSlip';
import DelRecord from '../components/delivery/DelRecord';

export default function DeliveryDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DelDashboard />;
      case 'dc_creation':
        return <DelCreation onGenerateChallan={() => setActiveTab('dc_creation_slip')} />;
      case 'dc_creation_slip':
        return <DelCreationSlip onBack={() => setActiveTab('dc_creation')} />;
      case 'dc_record':
        return <DelRecord />;
      default:
        return <DelDashboard />;
    }
  };

  return (
    <Layout>
      <div className="flex flex-col h-full w-full">
        {/* Module Header & Navigation */}
        <header className="sticky top-0 z-30 bg-surface-container-lowest/80 backdrop-blur-md border-b border-outline-variant/20 pt-4 px-4 sm:px-8 shrink-0">
          <div className="max-w-[1440px] mx-auto w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-on-primary shadow-sm shrink-0">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>local_shipping</span>
                </div>
                <div>
                  <h1 className="text-xl font-extrabold tracking-tight text-on-surface font-headline leading-tight">Delivery</h1>
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold text-primary">Module</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative group flex-1 md:w-64 shrink-0">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>search</span>
                  <input className="w-full bg-surface border border-outline-variant/30 rounded-full pl-10 pr-4 py-2 text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-on-surface-variant/50 outline-none" placeholder="Search orders or items..." type="text" />
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <nav className="flex items-center gap-6 overflow-x-auto custom-scrollbar">
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`pb-3 px-1 border-b-2 font-bold text-sm transition-colors whitespace-nowrap outline-none ${activeTab === 'dashboard' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
              >
                Delivery Dashboard
              </button>
              <button 
                onClick={() => setActiveTab('dc_creation')}
                className={`pb-3 px-1 border-b-2 font-bold text-sm transition-colors whitespace-nowrap outline-none ${(activeTab === 'dc_creation' || activeTab === 'dc_creation_slip') ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
              >
                DC Creation
              </button>
              <button 
                onClick={() => setActiveTab('dc_record')}
                className={`pb-3 px-1 border-b-2 font-bold text-sm transition-colors whitespace-nowrap outline-none ${activeTab === 'dc_record' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
              >
                DC Record
              </button>
            </nav>
          </div>
        </header>

        {/* Dynamic Content Canvas */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 pt-8 pb-12 w-full custom-scrollbar">
          <div className="max-w-[1440px] mx-auto w-full">
            {renderContent()}
          </div>
        </main>
      </div>
    </Layout>
  );
}
