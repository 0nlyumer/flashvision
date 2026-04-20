import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import AddNewItem from '../components/settings/AddNewItem';
import AddNewCustomer from '../components/settings/AddNewCustomer';
import AddNewSupplier from '../components/settings/AddNewSupplier';
import { useNavigate, useLocation } from 'react-router-dom';

export default function SettingsDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('add_item');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam === 'finish-good') {
        setActiveTab('add_item');
    }
    // ...other tabs could be handled here if needed...
  }, [location]);

  const tabs = ['add_item', 'add_customer', 'add_supplier'];
  
  const handlePrev = () => {
    const currentIndex = tabs.indexOf(activeTab);
    const prevIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
    setActiveTab(tabs[prevIndex]);
  };
  
  const handleNext = () => {
    const currentIndex = tabs.indexOf(activeTab);
    const nextIndex = currentIndex === tabs.length - 1 ? 0 : currentIndex + 1;
    setActiveTab(tabs[nextIndex]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'add_item':
        return <AddNewItem />;
      case 'add_customer':
        return <AddNewCustomer />;
      case 'add_supplier':
        return <AddNewSupplier />;
      default:
        return <AddNewItem />;
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
                <div className="flex gap-1 mr-2">
                  <button onClick={handlePrev} className="w-9 h-9 flex items-center justify-center bg-surface hover:bg-surface-container-low rounded-lg border border-outline-variant/30 text-slate-500 hover:text-primary transition-all shadow-sm"><span className="material-symbols-outlined text-[18px]">arrow_back</span></button>
                  <button onClick={handleNext} className="w-9 h-9 flex items-center justify-center bg-surface hover:bg-surface-container-low rounded-lg border border-outline-variant/30 text-slate-500 hover:text-primary transition-all shadow-sm"><span className="material-symbols-outlined text-[18px]">arrow_forward</span></button>
                </div>
                <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-on-primary shadow-sm shrink-0">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>settings</span>
                </div>
                <div>
                  <h1 className="text-xl font-extrabold tracking-tight text-on-surface font-headline leading-tight">Settings Workspace</h1>
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold text-primary">Global Modules Configuration</p>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <nav className="flex items-center gap-6 overflow-x-auto custom-scrollbar">
              <button 
                onClick={() => setActiveTab('add_item')}
                className={`pb-3 px-1 border-b-2 font-bold text-sm transition-colors whitespace-nowrap outline-none ${activeTab === 'add_item' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
              >
                Item Master Setup
              </button>
              <button 
                onClick={() => setActiveTab('add_customer')}
                className={`pb-3 px-1 border-b-2 font-bold text-sm transition-colors whitespace-nowrap outline-none ${activeTab === 'add_customer' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
              >
                Customer Accounts
              </button>
              <button 
                onClick={() => setActiveTab('add_supplier')}
                className={`pb-3 px-1 border-b-2 font-bold text-sm transition-colors whitespace-nowrap outline-none ${activeTab === 'add_supplier' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
              >
                Supplier Onboarding
              </button>
            </nav>
          </div>
        </header>

        {/* Dynamic Content Canvas */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 pt-8 pb-12 w-full custom-scrollbar relative">
          <div className="max-w-[1440px] mx-auto w-full pb-20">
            {renderContent()}
          </div>
          
          <div className="fixed bottom-0 mt-8 py-4 left-0 w-full px-4 sm:px-8 bg-surface border-t border-outline-variant/20 shadow-md backdrop-blur-md z-40 pointer-events-none md:pl-72 lg:pl-80 transition-all">
            <div className="max-w-[1440px] mx-auto w-full flex justify-between pointer-events-auto">
              <button 
                onClick={handlePrev}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface-container-low text-on-surface font-bold hover:bg-surface-container transition-colors shadow-sm border border-outline-variant/30"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Previous
              </button>
              <button 
                onClick={handleNext}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
              >
                Next
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
}
