import React, { useState } from 'react';
import Layout from '../components/Layout';
import UserControl from '../components/usercontrol/UserControl';
import AuditLog from '../components/usercontrol/AuditLog';
import AdminSetup from '../components/settings/AdminSetup';

export default function UserControlDashboard() {
  const [activeTab, setActiveTab] = useState('user_control');

  const renderContent = () => {
    switch (activeTab) {
      case 'user_control':
        return <UserControl />;
      case 'admin_setup':
        return <AdminSetup />;
      case 'audit_log':
        return <AuditLog />;
      default:
        return <UserControl />;
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
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>admin_panel_settings</span>
                </div>
                <div>
                  <h1 className="text-xl font-extrabold tracking-tight text-on-surface font-headline leading-tight">User Control & Admin Setup</h1>
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold text-primary">Security & Configuration</p>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <nav className="flex items-center gap-6 overflow-x-auto custom-scrollbar">
              <button 
                onClick={() => setActiveTab('user_control')}
                className={`pb-3 px-1 border-b-2 font-bold text-sm transition-colors whitespace-nowrap outline-none ${activeTab === 'user_control' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
              >
                User Control & Permissions
              </button>
              <button 
                onClick={() => setActiveTab('admin_setup')}
                className={`pb-3 px-1 border-b-2 font-bold text-sm transition-colors whitespace-nowrap outline-none ${activeTab === 'admin_setup' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
              >
                Administrative Setup
              </button>
              <button 
                onClick={() => setActiveTab('audit_log')}
                className={`pb-3 px-1 border-b-2 font-bold text-sm transition-colors whitespace-nowrap outline-none ${activeTab === 'audit_log' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
              >
                System Audit Log
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
