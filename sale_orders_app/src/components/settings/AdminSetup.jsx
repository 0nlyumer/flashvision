import React, { useState } from 'react';
import BulkUploadModal from './BulkUploadModal';

export default function AdminSetup() {
  const [showHistory, setShowHistory] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);

  // Dummy data for Audit logs / History view
  const auditLogs = [
    { id: 1, action: 'Updated Company Profile', user: 'Alex Sterling', date: 'Oct 12, 10:45 AM', ip: '192.168.1.55' },
    { id: 2, action: 'Changed Default Currency to EUR', user: 'System Admin', date: 'Oct 10, 08:30 AM', ip: '192.168.1.12' },
    { id: 3, action: 'Enabled Strict Validation', user: 'Alex Sterling', date: 'Oct 01, 11:20 AM', ip: '192.168.1.55' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h2 className="text-xl font-bold font-headline text-on-surface mb-2">Administrative Setup</h2>
          <p className="text-sm font-body text-on-surface-variant max-w-2xl">
            {showHistory ? "Review the audit log of system-wide administrative changes." : "Manage global system parameters, organizational details, and operational defaults."}
          </p>
        </div>
        
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => setIsBulkUploadOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-surface border border-outline-variant/30 rounded-xl text-sm font-bold text-on-surface hover:bg-surface-container-low transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-sm text-primary">upload_file</span>
            Upload Constants
          </button>
          
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm ${
              showHistory 
                ? "bg-surface border border-outline-variant/30 text-on-surface hover:bg-surface-container-low" 
                : "bg-surface-container-low border border-primary/20 text-primary hover:bg-primary/10"
            }`}
          >
            <span className="material-symbols-outlined text-sm">
              {showHistory ? "settings" : "history"}
            </span>
            {showHistory ? "Edit Configurations" : "View Audit Log"}
          </button>
        </div>
      </div>

      <div className="bg-surface-container-low rounded-2xl overflow-hidden shadow-sm">
        
        {!showHistory ? (
          /* ======================= SETUP FORM ======================= */
          <div className="p-6 lg:p-8 animate-in fade-in zoom-in-95 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Group 1: Org Profile */}
              <div className="space-y-6">
                <div className="border-b border-outline-variant/20 pb-2 mb-4">
                  <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">domain</span>
                    Organization Profile
                  </h3>
                </div>

                <div className="relative group">
                  <input type="text" defaultValue="Flashvision Logistics" className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent transition-all" />
                  <label className="absolute -top-2 left-3 bg-surface px-1 text-[10px] font-bold text-primary uppercase tracking-wider">Company Name</label>
                </div>

                <div className="relative group">
                  <input type="text" defaultValue="US-9988-FV-A9" className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent transition-all font-mono" />
                  <label className="absolute -top-2 left-3 bg-surface px-1 text-[10px] font-bold text-primary uppercase tracking-wider">Registration Number</label>
                </div>
              </div>

              {/* Group 2: App Preferences */}
              <div className="space-y-6">
                <div className="border-b border-outline-variant/20 pb-2 mb-4">
                  <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">tune</span>
                    System Preferences
                  </h3>
                </div>

                <div className="relative group">
                  <select className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent transition-all appearance-none" defaultValue="USD">
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="PKR">PKR (Rs)</option>
                  </select>
                  <label className="absolute -top-2 left-3 bg-surface px-1 text-[10px] font-bold text-primary uppercase tracking-wider">Base Currency</label>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                </div>

                <div className="relative group">
                  <select className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent transition-all appearance-none" defaultValue="UTC">
                    <option value="UTC">UTC (Universal)</option>
                    <option value="EST">Eastern Time (US)</option>
                    <option value="PKT">Pakistan Standard Time</option>
                  </select>
                  <label className="absolute -top-2 left-3 bg-surface px-1 text-[10px] font-bold text-primary uppercase tracking-wider">Timezone</label>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                </div>
              </div>

            </div>

            <div className="mt-8 pt-6 border-t border-outline-variant/20 flex justify-end gap-4">
              <button className="px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-primary to-primary-container shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-0.5 relative overflow-hidden group">
                <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                <span className="relative flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">save</span>
                  Save Parameters
                </span>
              </button>
            </div>
          </div>
        ) : (
          /* ======================= AUDIT LOG ======================= */
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-dim border-b border-outline-variant/30">
                    <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Action Taken</th>
                    <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider">User</th>
                    <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Timestamp</th>
                    <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20 uppercase font-medium text-xs font-body text-on-surface">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-surface/50 transition-colors">
                      <td className="py-4 px-6 font-bold">{log.action}</td>
                      <td className="py-4 px-6 font-bold text-primary">{log.user}</td>
                      <td className="py-4 px-6 text-on-surface-variant">{log.date}</td>
                      <td className="py-4 px-6 font-mono text-slate-400">{log.ip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <BulkUploadModal 
        isOpen={isBulkUploadOpen} 
        onClose={() => setIsBulkUploadOpen(false)} 
        entityName="System Parameters" 
      />
    </div>
  );
}
