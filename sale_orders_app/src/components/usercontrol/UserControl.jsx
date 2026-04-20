import React, { useState } from 'react';

export default function UserControl() {
  const [selectedUser, setSelectedUser] = useState('Jonathan Devries');

  const users = [
    {
      id: 1,
      name: 'Jonathan Devries',
      email: 'j.devries@flashvision.logistics',
      role: 'Admin',
      status: 'Active',
      initials: 'JD',
      image: null
    },
    {
      id: 2,
      name: 'Sarah Mitchell',
      email: 's.mitchell@flashvision.logistics',
      role: 'Warehouse Manager',
      status: 'Active',
      initials: 'SM',
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCa4RbMit_hJoCka6MDN-WhF0YtYpzzXiM0-FbM36thuSGzPko20rg2vHvbmLPa35QWr7Mnt3PkVFcbPQh4EhnJ2g892KEp8anL6xfqb51wo8K5FWVsccDo-5GHrFObqh4do2UGdN70SIyjwYtRGDQKQmqufuIq-B0MDpjEWMXuNFIe4291uOMtG1kHSyguKvc7l1zObnsmoXoJgddBd57kITbUbA5BhqXyybvW_52akB6eBH8ToT3Qkmi07kiJcIiLaQwOMuzYYB0N"
    },
    {
      id: 3,
      name: 'Marcus Thorne',
      email: 'm.thorne@flashvision.logistics',
      role: 'Sales Rep',
      status: 'Inactive',
      initials: 'MT',
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDdtbJgfVyck7DX-HN5FH8__i7Kl8VKsIEeA1hjE5Q9Yd-LYOUPYvdR-Hh9OnY3J7z3Vs-xxGuQXebuFv-V5L7K-pw-UbH1wDhIgk1YIjw7LkNynN6uL7TGTjuUeJqI8vBp4WPUY9i_5UX7PM98AcAgEovx1jrz4Nq5NMquzxxDF5OUtFaYJ-VxardcAoTUGnR9ueRCpsIMEdsJNBmG5crE3uJQfQICqBDGBEOyAeSN1E1Q4IjuymqDVRHtkE0KXOGmfsEyMb_gqdeE"
    },
    {
      id: 4,
      name: 'Elena Lopez',
      email: 'e.lopez@flashvision.logistics',
      role: 'Sales Rep',
      status: 'Active',
      initials: 'EL',
      image: null
    }
  ];

  return (
    <div className="animate-in fade-in duration-500 pb-24">
      {/* Header Section */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-extrabold font-headline text-on-surface tracking-tight mb-2">User Directory</h1>
          <p className="text-on-surface-variant max-w-md text-sm">Manage organizational access, security roles, and module-specific permissions for the team.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-surface-container-low px-4 py-2 rounded-xl flex items-center gap-2 border border-outline-variant/10 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <span className="material-symbols-outlined text-on-surface-variant text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>search</span>
            <input className="bg-transparent border-none focus:ring-0 text-sm font-medium w-48 outline-none placeholder:text-on-surface-variant/50" placeholder="Filter users..." type="text" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-xl font-bold shadow-sm hover:shadow-md transition-all active:scale-95 text-sm">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>person_add</span>
            New User
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 items-start">
        {/* User List Column */}
        <div className="col-span-12 xl:col-span-8 space-y-3">
          {/* Column Headers */}
          <div className="grid grid-cols-12 px-6 py-2 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/10">
            <div className="col-span-12 sm:col-span-5">Identity</div>
            <div className="col-span-4 sm:col-span-3 hidden sm:block">Role</div>
            <div className="col-span-4 sm:col-span-2 hidden sm:block">Status</div>
            <div className="col-span-12 sm:col-span-2 text-right hidden sm:block">Actions</div>
          </div>

          {/* User Rows */}
          {users.map((user) => (
            <div 
              key={user.id} 
              onClick={() => setSelectedUser(user.name)}
              className={`grid grid-cols-12 items-center px-6 py-4 rounded-2xl transition-all cursor-pointer group ${
                selectedUser === user.name 
                  ? 'bg-surface-container-lowest shadow-[0_20px_40px_rgba(0,28,56,0.04)] border-l-4 border-primary' 
                  : 'bg-surface-container-low hover:bg-surface-container-high border-l-4 border-transparent'
              }`}
            >
              <div className="col-span-12 sm:col-span-5 flex items-center gap-4 mb-2 sm:mb-0">
                <div className={`w-12 h-12 rounded-full overflow-hidden flex items-center justify-center font-bold text-lg shrink-0 ${
                  user.image ? '' : 
                  selectedUser === user.name ? 'bg-primary/10 text-primary' : 'bg-outline-variant/20 text-on-surface-variant'
                }`}>
                  {user.image ? (
                    <img alt={user.name} className="w-full h-full object-cover" src={user.image} />
                  ) : (
                    user.initials
                  )}
                </div>
                <div className="overflow-hidden">
                  <p className="font-bold text-on-surface truncate">{user.name}</p>
                  <p className="text-xs text-on-surface-variant truncate">{user.email}</p>
                </div>
              </div>
              <div className="col-span-6 sm:col-span-3">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  user.role === 'Admin' ? 'bg-primary-fixed text-primary' :
                  user.role === 'Warehouse Manager' ? 'bg-secondary-container text-on-secondary-container' :
                  'bg-tertiary-fixed text-on-tertiary-fixed-variant'
                }`}>
                  {user.role}
                </span>
              </div>
              <div className="col-span-6 sm:col-span-2">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-surface-dim'}`}></span>
                  <span className={`text-xs font-semibold ${user.status === 'Active' ? 'text-on-surface' : 'text-on-surface-variant italic'}`}>
                    {user.status}
                  </span>
                </div>
              </div>
              <div className={`col-span-12 sm:col-span-2 flex justify-end gap-1 mt-3 sm:mt-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity`}>
                <button className="w-8 h-8 flex items-center justify-center hover:bg-surface-container rounded-lg text-primary transition-colors outline-none focus:ring-2 focus:ring-primary/20" title="Edit Permissions">
                  <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 0" }}>shield_person</span>
                </button>
                <button className="w-8 h-8 flex items-center justify-center hover:bg-surface-container rounded-lg text-on-surface-variant transition-colors outline-none focus:ring-2 focus:ring-primary/20" title="Settings">
                  <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 0" }}>more_vert</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Permission Sidebar (Asymmetric Pivot) */}
        <div className="col-span-12 xl:col-span-4 sticky top-24">
          <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-[2rem] p-8 shadow-[0_40px_80px_rgba(0,40,80,0.04)] relative overflow-hidden">
            {/* Glass Background Accent */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-xl font-extrabold font-headline text-on-surface tracking-tight">Permissions</h3>
                  <p className="text-sm font-semibold text-primary mt-1">{selectedUser}</p>
                  <p className="text-xs text-on-surface-variant italic mt-1">Last modified: 2h ago</p>
                </div>
                <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container text-on-surface-variant transition-colors">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>close</span>
                </button>
              </div>

              <div className="space-y-8">
                {/* Permission Group: Sales */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-primary text-base" style={{ fontVariationSettings: "'FILL' 0" }}>trending_up</span>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Sales Orders</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center bg-surface-container-low p-3 rounded-xl border border-outline-variant/5">
                      <span className="text-xs font-semibold text-on-surface">Create & Edit Orders</span>
                      <div className="w-10 h-5 bg-primary rounded-full relative cursor-pointer" onClick={(e) => e.currentTarget.classList.toggle('bg-primary')}>
                        <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full transition-all"></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center bg-surface-container-low p-3 rounded-xl border border-outline-variant/5">
                      <span className="text-xs font-semibold text-on-surface">Approve Discounts</span>
                      <div className="w-10 h-5 bg-surface-dim rounded-full relative cursor-pointer" onClick={(e) => e.currentTarget.classList.toggle('bg-primary')}>
                        <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-all text-on-surface-variant shadow-sm border border-outline-variant/20"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Permission Group: Inventory */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-primary text-base" style={{ fontVariationSettings: "'FILL' 0" }}>warehouse</span>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Inventory Control</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center bg-surface-container-low p-3 rounded-xl border border-outline-variant/5">
                      <span className="text-xs font-semibold text-on-surface">Adjust Stock Levels</span>
                      <div className="w-10 h-5 bg-primary rounded-full relative cursor-pointer" onClick={(e) => e.currentTarget.classList.toggle('bg-primary')}>
                        <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full transition-all"></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center bg-surface-container-low p-3 rounded-xl border border-outline-variant/5">
                      <span className="text-xs font-semibold text-on-surface">Manage Suppliers</span>
                      <div className="w-10 h-5 bg-primary rounded-full relative cursor-pointer" onClick={(e) => e.currentTarget.classList.toggle('bg-primary')}>
                        <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full transition-all"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Permission Group: Delivery */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-primary text-base" style={{ fontVariationSettings: "'FILL' 0" }}>local_shipping</span>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Delivery Fleet</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center bg-surface-container-low p-3 rounded-xl border border-outline-variant/5">
                      <span className="text-xs font-semibold text-on-surface">Route Optimization</span>
                      <div className="w-10 h-5 bg-primary rounded-full relative cursor-pointer" onClick={(e) => e.currentTarget.classList.toggle('bg-primary')}>
                        <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full transition-all"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-outline-variant/10 flex flex-col gap-3">
                <button className="w-full py-3.5 bg-primary text-on-primary font-bold rounded-xl hover:shadow-md hover:bg-primary/90 transition-all outline-none focus:ring-2 focus:ring-primary/20 text-sm">
                  Save Changes
                </button>
                <button className="w-full py-3.5 text-primary font-bold hover:bg-primary/5 rounded-xl transition-colors outline-none focus:ring-2 focus:ring-primary/20 text-sm">
                  Reset Password
                </button>
                <button className="w-full py-3.5 text-error font-bold hover:bg-error/10 rounded-xl transition-colors flex items-center justify-center gap-2 outline-none focus:ring-2 focus:ring-error/20 text-sm">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>delete</span>
                  Delete User
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
