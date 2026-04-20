import React from 'react';

export default function AuditLog() {
  const auditData = [
    {
      id: 1,
      date: 'Oct 24, 2023',
      time: '14:32:01 PM',
      userInitials: 'AM',
      userName: 'Adrian Müller',
      userRole: 'Administrator',
      userColor: 'primary',
      actionType: 'Created Sale Order',
      actionColor: 'green',
      module: 'Sales',
      details: 'Generated invoice #SO-98234 for Global Transit Partners',
      ip: '192.168.1.45'
    },
    {
      id: 2,
      date: 'Oct 24, 2023',
      time: '13:15:44 PM',
      userInitials: 'SC',
      userName: 'Sarah Chen',
      userRole: 'Ops Manager',
      userColor: 'secondary',
      actionType: 'Deleted Item',
      actionColor: 'red',
      module: 'Inventory',
      details: 'Removed SKU-4412 (Obsolescence Policy update)',
      ip: '10.0.0.122'
    },
    {
      id: 3,
      date: 'Oct 24, 2023',
      time: '12:05:12 PM',
      userInitials: 'MT',
      userName: 'Marcus Thorne',
      userRole: 'Security Auditor',
      userColor: 'tertiary',
      actionType: 'Updated Permissions',
      actionColor: 'amber',
      module: 'Admin',
      details: 'Elevated access for User ID: 8872 (Temporary Audit)',
      ip: '192.168.1.12'
    },
    {
      id: 4,
      date: 'Oct 24, 2023',
      time: '10:59:00 AM',
      userInitials: 'AM',
      userName: 'Adrian Müller',
      userRole: 'Administrator',
      userColor: 'primary',
      actionType: 'Logged In',
      actionColor: 'blue',
      module: 'Security',
      details: 'New session started via Windows Desktop Application',
      ip: '192.168.1.45'
    }
  ];

  return (
    <div className="animate-in fade-in duration-500 pb-24">
      {/* Header Section */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-extrabold font-headline text-on-surface tracking-tight mb-2">Audit Log</h1>
          <p className="text-on-surface-variant max-w-md text-sm">Review system-wide activity, track security events, and monitor user actions.</p>
        </div>
      </div>

      {/* Filter Section */}
      <section className="mb-8 p-6 bg-surface-container-lowest rounded-2xl shadow-[0_20px_40px_rgba(0,28,56,0.03)] flex flex-col gap-6 border border-outline-variant/10">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 0" }}>filter_list</span>
            Advanced Filters
          </h3>
          <button className="bg-primary text-on-primary px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-sm hover:shadow-md active:scale-95 transition-all text-sm outline-none focus:ring-2 focus:ring-primary/20">
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
        
        {/* Pagination */}
        <div className="px-6 py-4 bg-surface-container-low/30 border-t border-outline-variant/10 flex items-center justify-between">
          <span className="text-xs text-on-surface-variant font-medium">Showing <span className="font-bold text-on-surface">1 - 4</span> of <span className="font-bold text-on-surface">2,458</span> entries</span>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/30 hover:bg-surface-container transition-colors disabled:opacity-30 outline-none focus:ring-2 focus:ring-primary/20" disabled>
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 0" }}>chevron_left</span>
            </button>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 rounded-lg bg-primary text-white text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-1">1</button>
              <button className="w-8 h-8 rounded-lg hover:bg-surface-container text-on-surface text-xs font-semibold outline-none focus:ring-2 focus:ring-primary/20">2</button>
              <button className="w-8 h-8 rounded-lg hover:bg-surface-container text-on-surface text-xs font-semibold outline-none focus:ring-2 focus:ring-primary/20">3</button>
              <span className="px-1 text-on-surface-variant">...</span>
              <button className="w-8 h-8 rounded-lg hover:bg-surface-container text-on-surface text-xs font-semibold outline-none focus:ring-2 focus:ring-primary/20">123</button>
            </div>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/30 hover:bg-surface-container transition-colors outline-none focus:ring-2 focus:ring-primary/20">
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 0" }}>chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
