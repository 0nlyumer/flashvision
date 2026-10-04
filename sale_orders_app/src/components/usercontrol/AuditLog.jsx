import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import GlobalPagination from '../ui/GlobalPagination';

export default function AuditLog() {
  const { state } = useApp();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  
  // Format the actual audit logs for display
  const allAuditData = (state.auditLogs || []).map(log => {
    const d = new Date(log.timestamp);
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const timeStr = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    // Determine colors based on action type (safely)
    let actionColor = 'gray';
    const actionType = log.actionType || '';
    if (actionType.includes('Create') || actionType.includes('Add')) actionColor = 'green';
    else if (actionType.includes('Delete') || actionType.includes('Remove')) actionColor = 'red';
    else if (actionType.includes('Update') || actionType.includes('Edit')) actionColor = 'amber';
    else if (actionType.includes('Login') || actionType.includes('Auth')) actionColor = 'blue';

    const user = log.user || 'Unknown';

    return {
      id: log.id,
      date: dateStr,
      time: timeStr,
      userInitials: user.substring(0, 2).toUpperCase(),
      userName: user,
      userRole: 'System User', // In a real app this comes from user object
      userColor: 'primary',
      actionType: log.actionType || 'System Action',
      actionColor,
      module: log.module || 'System',
      details: log.details || '',
      ip: '192.168.1.1' // Static for now
    };
  });

  const auditData = state?.isGlobalPaginated 
    ? allAuditData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : allAuditData;

  return (
    <div className="animate-in fade-in duration-500 pb-24">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-headline text-on-surface tracking-tight mb-2">Audit Log</h1>
          <p className="text-on-surface-variant max-w-md text-sm">Review system-wide activity, track security events, and monitor user actions.</p>
        </div>
      </div>

      {/* Filter Section */}
      <section className="mb-8 p-6 bg-surface-container-lowest rounded-2xl shadow-[0_20px_40px_rgba(0,28,56,0.03)] flex flex-col gap-6 border border-outline-variant/10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 0" }}>filter_list</span>
            Advanced Filters
          </h3>
          <button className="bg-primary text-on-primary px-6 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-95 transition-all text-sm outline-none focus:ring-2 focus:ring-primary/20 w-full sm:w-auto">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>download</span>
            Export Log
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Date Picker Placeholder */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant">Date Range</label>
            <div className="relative">
              <input className="w-full bg-surface-container-low border border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none transition-all placeholder:text-on-surface-variant/50" placeholder="Select dates..." type="text" />
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg" style={{ fontVariationSettings: "'FILL' 0" }}>calendar_today</span>
            </div>
          </div>
          
          {/* User Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant">Filter by User</label>
            <select className="w-full bg-surface-container-low border border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl py-2.5 px-4 text-sm appearance-none outline-none transition-all">
              <option>All Users</option>
              <option>Adrian Müller (Admin)</option>
              <option>Sarah Chen (Manager)</option>
              <option>Marcus Thorne (Auditor)</option>
            </select>
          </div>
          
          {/* Action Type Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant">Action Type</label>
            <select className="w-full bg-surface-container-low border border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl py-2.5 px-4 text-sm appearance-none outline-none transition-all">
              <option>All Actions</option>
              <option>Created Sale Order</option>
              <option>Deleted Item</option>
              <option>Updated Permissions</option>
              <option>Security Login</option>
            </select>
          </div>
          
          {/* Module Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant">Module</label>
            <select className="w-full bg-surface-container-low border border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl py-2.5 px-4 text-sm appearance-none outline-none transition-all">
              <option>All Modules</option>
              <option>Sales</option>
              <option>Inventory</option>
              <option>Admin</option>
              <option>Finance</option>
            </select>
          </div>
        </div>
      </section>

      {/* Audit Table Section */}
      <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-[0_20px_40px_rgba(0,28,56,0.04)] border border-outline-variant/10">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-surface-container-low/50 border-b border-outline-variant/10">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Timestamp</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">User & Role</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Action Type</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Module</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Details</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {auditData.map((log, idx) => (
                <tr key={log.id} className={`hover:bg-surface-container-low/50 transition-colors group ${idx % 2 !== 0 ? 'bg-surface-container-low/20' : ''}`}>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="text-sm font-semibold text-on-surface">{log.date}</div>
                    <div className="text-xs text-on-surface-variant">{log.time}</div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs bg-${log.userColor}/10 text-${log.userColor}-700`}>
                        {log.userInitials}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-on-surface">{log.userName}</div>
                        <div className={`text-[10px] font-bold uppercase tracking-wider text-${log.userColor}-700`}>{log.userRole}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-lg bg-${log.actionColor}-100 text-${log.actionColor}-700 text-[10px] font-bold uppercase tracking-wider`}>
                      {log.actionType}
                    </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="text-sm font-bold text-on-surface-variant">{log.module}</div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm text-on-surface-variant max-w-xs truncate">{log.details}</p>
                  </td>
                  <td className="px-6 py-5 text-right font-mono text-xs text-on-surface-variant whitespace-nowrap">
                    {log.ip}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <GlobalPagination 
          totalItems={allAuditData.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
}
