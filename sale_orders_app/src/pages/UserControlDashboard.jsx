import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useSearchParams } from 'react-router-dom';
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

  const tabs = [
    { id: 'user_control', label: 'User Control & Permissions', icon: 'manage_accounts' },
    { id: 'admin_setup', label: 'Administrative Setup', icon: 'settings_suggest' },
    { id: 'audit_log', label: 'System Audit Log', icon: 'policy' }
  ];

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
     const tab = searchParams.get('tab');
     if (tab && tabs.find(t => t.id === tab)) {
         setActiveTab(tab);
     }
  }, [searchParams]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  const subNavConfig = {
      title: "User Control",
      items: tabs,
      activeId: activeTab,
      onSelect: handleTabChange
  };

  return (
    <Layout subNavConfig={subNavConfig}>
      <div className="flex flex-col h-full w-full">
        {/* Module Header & Navigation */}
        <header className="sticky top-0 z-30 bg-surface-container-lowest/80 backdrop-blur-md border-b border-outline-variant/20 pt-4 px-4 sm:px-8 shrink-0 pb-4">
          <div className="max-w-full w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
          </div>
        </header>

        {/* Dynamic Content Canvas */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 pt-8 pb-12 w-full custom-scrollbar">
          <div className="max-w-full w-full">
            {renderContent()}
          </div>
        </main>
      </div>
    </Layout>
  );
}
