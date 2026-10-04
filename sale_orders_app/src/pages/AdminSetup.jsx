import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useApp } from '../context/AppContext';
import { useDialog } from '../context/DialogContext';

export default function AdminSetup() {
  const { state, setCollection } = useApp();
  const { appConfirm, appAlert } = useDialog();
  const [activeTab, setActiveTab] = useState('modules');
  const [selectedPrintModule, setSelectedPrintModule] = useState('global');
  
  // New Item State
  const [newItemName, setNewItemName] = useState('');
  const [newItemType, setNewItemType] = useState('Raw Material'); // Raw Material or Finish Good
  const [newItemUnit, setNewItemUnit] = useState('Meters');
  const [reqFabricId, setReqFabricId] = useState('');
  const [fabricRatio, setFabricRatio] = useState(1);
  const [newItemStock, setNewItemStock] = useState(0);

  // New User State
  const [newUserName, setNewUserName] = useState('');
  const [newUserUsername, setNewUserUsername] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('Operator');

  // Print Settings State
  const defaultPrint = state.adminSetup?.printSettings || { disclaimers: {} };
  const [printConfig, setPrintConfig] = useState({
     logoUrl: defaultPrint.logoUrl || '',
     address: defaultPrint.address || '',
     phone: defaultPrint.phone || '',
     email: defaultPrint.email || '',
     showCreatedBy: defaultPrint.showCreatedBy !== false,
     disclaimers: { ...defaultPrint.disclaimers },
     moduleSettings: { ...defaultPrint.moduleSettings }
  });

  const printModules = [
      { id: 'global', name: 'Global Headers & Disclaimers', icon: 'business' },
      { id: 'sale_order', name: 'Sale Order Invoice', icon: 'receipt_long' },
      { id: 'delivery_challan', name: 'Delivery Challan', icon: 'local_shipping' },
      { id: 'inv_adjustment', name: 'Inventory Adjustment', icon: 'tune' },
      { id: 'inv_return', name: 'Inventory Return', icon: 'assignment_return' },
      { id: 'production_slip', name: 'Production Job Slip', icon: 'precision_manufacturing' },
  ];

  const handleModuleSettingChange = (field, value) => {
      setPrintConfig(prev => ({
          ...prev,
          moduleSettings: {
              ...(prev.moduleSettings || {}),
              [selectedPrintModule]: {
                  ...(prev.moduleSettings?.[selectedPrintModule] || {}),
                  [field]: value
              }
          }
      }));
  };

  const rawMaterials = state.items.filter(i => i.type === 'Raw Material');

  const handleAddItem = (e) => {
    e.preventDefault();
    const newItem = {
      id: 'I' + (state.items.length + 1),
      name: newItemName,
      type: newItemType,
      unit: newItemUnit,
      stock: parseInt(newItemStock) || 0,
    };
    
    // AJ Synthetic Specific Logic
    if (newItemType === 'Finish Good') {
      newItem.requiredFabricId = reqFabricId;
      newItem.fabricRatio = parseFloat(fabricRatio) || 1;
    } else {
      newItem.fabricRatio = 0;
    }

    setCollection('items', [...state.items, newItem]);
    
    // Reset form
    setNewItemName('');
    setNewItemStock(0);
    appAlert('Item Added Successfully!');
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    const usernameClean = newUserUsername.trim().toLowerCase();
    if (!usernameClean) {
      appAlert('Username is required.');
      return;
    }
    const exists = state.users?.some(u => u.username?.toLowerCase() === usernameClean);
    if (exists) {
      appAlert('Username already exists. Please choose a unique username.');
      return;
    }

    const newUser = {
      id: Date.now(),
      name: newUserName,
      username: usernameClean,
      password: newUserPassword,
      email: newUserEmail.trim(),
      role: newUserRole,
      permissions: ['salesOrders'], // default basic permission
      granularPermissions: {},
      requirePasswordChange: false
    };
    setCollection('users', [...(state.users || []), newUser]);
    setNewUserName('');
    setNewUserUsername('');
    setNewUserPassword('');
    setNewUserEmail('');
    appAlert('User Added Successfully!');
  };

  const togglePermission = (userId, perm) => {
    const updatedUsers = state.users.map(u => {
      if (u.id === userId) {
        if (u.permissions.includes('all')) return u; // super admin cannot be unchecked
        let newPerms = [...u.permissions];
        if (newPerms.includes(perm)) {
          newPerms = newPerms.filter(p => p !== perm);
        } else {
          newPerms.push(perm);
        }
        return { ...u, permissions: newPerms };
      }
      return u;
    });
    setCollection('users', updatedUsers);
  };

  const setupModules = [
    { title: 'User Access Control', icon: 'manage_accounts', desc: 'Roles, permissions, and security policies.', status: 'Active', action: () => setActiveTab('users') },
    { title: 'Product Master', icon: 'category', desc: 'SKUs, AJ Synthetic Fabric Logic, and inventory master.', status: 'Active', action: () => setActiveTab('items') },
    { title: 'Global Print Settings', icon: 'print', desc: 'Manage company logo, headers, and document disclaimers.', status: 'Active', action: () => setActiveTab('print') },
  ];

  const availableModules = [
    { id: 'salesOrders', name: 'Sales Orders' },
    { id: 'oms', name: 'OMS (Production Flow)' },
    { id: 'productionPlanning', name: 'Production Planning' },
    { id: 'inventory', name: 'Inventory' },
    { id: 'delivery', name: 'Delivery' },
    { id: 'finance', name: 'Finance' },
    { id: 'hr', name: 'HR Management' },
    { id: 'userManagement', name: 'User Control' },
    { id: 'settings', name: 'Settings' }
  ];

  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface font-headline">Administrative Setup</h1>
          <p className="text-on-surface-variant mt-1 text-sm">Centralized control for system configurations and master databases.</p>
        </div>
        {activeTab !== 'modules' && (
          <button onClick={() => setActiveTab('modules')} className="text-primary font-bold text-sm bg-primary/10 px-4 py-2 rounded-lg hover:bg-primary/20 transition-all">
            Back to Modules
          </button>
        )}
      </div>

      {activeTab === 'modules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {setupModules.map((module, idx) => (
            <div key={idx} onClick={module.action} className="bg-surface-container-lowest p-6 rounded-3xl asymmetric-shadow border border-white/50 group hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden">
              <div className="absolute right-0 top-0 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="material-symbols-outlined text-8xl -mr-4 -mt-4">{module.icon}</span>
              </div>
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-2xl">{module.icon}</span>
                </div>
              </div>
              <div className="relative z-10">
                <h3 className="text-lg font-bold text-on-surface mb-2">{module.title}</h3>
                <p className="text-sm text-on-surface-variant line-clamp-2">{module.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'items' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add New Item Form */}
          <div className="bg-surface-container-lowest p-8 rounded-3xl pb-10 shadow-lg border border-white/50">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined">add_circle</span>
              Add New Product / Material
            </h2>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Item Type</label>
                <select 
                  value={newItemType} 
                  onChange={(e) => setNewItemType(e.target.value)}
                  className="w-full mt-1 p-2 bg-surface border border-slate-200 rounded-lg text-sm font-semibold"
                >
                  <option value="Raw Material">Raw Material (Fabric/Base)</option>
                  <option value="Finish Good">Finish Good</option>
                </select>
              </div>
              
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Item Name</label>
                <input required type="text" value={newItemName} onChange={e => setNewItemName(e.target.value)} className="w-full mt-1 p-2 bg-surface border border-slate-200 rounded-lg text-sm" placeholder="e.g., Synthetic Cotton 100g" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Input Unit</label>
                  <input required type="text" value={newItemUnit} onChange={e => setNewItemUnit(e.target.value)} className="w-full mt-1 p-2 bg-surface border border-slate-200 rounded-lg text-sm" placeholder="Meters, Kg, etc" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Initial Stock</label>
                  <input required type="number" value={newItemStock} onChange={e => setNewItemStock(e.target.value)} className="w-full mt-1 p-2 bg-surface border border-slate-200 rounded-lg text-sm" />
                </div>
              </div>

              {/* AJ Synthetic Specific Logic */}
              {newItemType === 'Finish Good' && (
                <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/20 space-y-4">
                  <h4 className="text-sm font-bold text-primary flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">texture</span>
                    AJ Synthetic Fabric Logic
                  </h4>
                  <p className="text-xs text-slate-600">Please select the base fabric raw material required to produce this finish good, and the consumption ratio.</p>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Required Fabric (Raw Material)</label>
                    <select required value={reqFabricId} onChange={(e) => setReqFabricId(e.target.value)} className="w-full mt-1 p-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold">
                      <option value="">-- Select Fabric --</option>
                      {rawMaterials.map(rm => (
                        <option key={rm.id} value={rm.id}>{rm.name} ({rm.unit})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Fabric Ratio (per 1 unit of finish good)</label>
                    <input required type="number" step="0.01" value={fabricRatio} onChange={e => setFabricRatio(e.target.value)} className="w-full mt-1 p-2 bg-white border border-slate-200 rounded-lg text-sm" placeholder="e.g. 1.5" />
                  </div>
                </div>
              )}

              <button type="submit" className="w-full py-3 mt-4 bg-primary text-white rounded-xl font-bold shadow-md hover:bg-primary/90 transition-all">
                Save Item
              </button>
            </form>
          </div>

          {/* Current Items List */}
          <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-lg border border-white/50">
             <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-on-surface">
              <span className="material-symbols-outlined">inventory_2</span>
              Existing Master Items
            </h2>
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {state.items.map(item => (
                <div key={item.id} className="p-4 bg-surface rounded-xl border border-slate-100 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-sm text-on-surface">{item.name}</h4>
                    <p className="text-xs text-slate-500">{item.type} • {item.stock} {item.unit} in stock</p>
                    {item.type === 'Finish Good' && (
                      <p className="text-[10px] uppercase font-bold text-primary tracking-widest mt-1">
                        Requires: {state.items.find(i => i.id === item.requiredFabricId)?.name} (x{item.fabricRatio})
                      </p>
                    )}
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">ID: {item.id}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-surface-container-lowest p-8 rounded-3xl shadow-lg border border-white/50 h-fit">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined">person_add</span>
              Add New User
            </h2>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Employee Name</label>
                <input required type="text" value={newUserName} onChange={e => setNewUserName(e.target.value)} className="w-full mt-1 p-2 bg-surface border border-slate-200 rounded-lg text-sm" placeholder="e.g. John Doe" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Username (For Login)</label>
                <input required type="text" value={newUserUsername} onChange={e => setNewUserUsername(e.target.value)} className="w-full mt-1 p-2 bg-surface border border-slate-200 rounded-lg text-sm" placeholder="e.g. john" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Password</label>
                <input required type="password" value={newUserPassword} onChange={e => setNewUserPassword(e.target.value)} className="w-full mt-1 p-2 bg-surface border border-slate-200 rounded-lg text-sm" placeholder="e.g. pass123" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Email (Optional)</label>
                <input type="email" value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)} className="w-full mt-1 p-2 bg-surface border border-slate-200 rounded-lg text-sm" placeholder="e.g. john@example.com" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Role</label>
                <select value={newUserRole} onChange={(e) => setNewUserRole(e.target.value)} className="w-full mt-1 p-2 bg-surface border border-slate-200 rounded-lg text-sm font-semibold">
                  <option value="Operator">Operator</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <button type="submit" className="w-full py-3 mt-4 bg-primary text-white rounded-xl font-bold shadow-md hover:bg-primary/90 transition-all">
                Create User
              </button>
            </form>
          </div>
          
          <div className="lg:col-span-2 bg-surface-container-lowest p-8 rounded-3xl shadow-lg border border-white/50">
             <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-on-surface">
              <span className="material-symbols-outlined">admin_panel_settings</span>
              Dynamic Permissions Control
            </h2>
            <p className="text-sm text-on-surface-variant mb-6">Dynamically assign module access to users. Changes apply instantly.</p>
            
            <div className="space-y-4 overflow-x-auto">
              <table className="w-full text-left bg-surface rounded-2xl overflow-hidden border border-surface-container">
                <thead className="bg-surface-container-low text-[10px] uppercase tracking-widest text-slate-500 font-bold border-b border-surface-container">
                  <tr>
                    <th className="px-4 py-3">User</th>
                    {availableModules.map(mod => <th key={mod.id} className="px-4 py-3 text-center">{mod.name}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container text-sm">
                  {state.users.map(u => (
                    <tr key={u.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-4 py-4">
                        <p className="font-bold text-on-surface">{u.name}</p>
                        <p className="text-xs text-on-surface-variant">@{u.username || 'admin'} • {u.password || 'admin1'}</p>
                        <p className="text-[10px] uppercase font-bold text-primary tracking-widest mt-1">{u.role}</p>
                      </td>
                      {availableModules.map(mod => {
                        const hasAccess = u.permissions.includes('all') || u.permissions.includes(mod.id);
                        const disabled = u.permissions.includes('all');
                        return (
                          <td key={mod.id} className="px-4 py-4 text-center">
                            <input 
                              type="checkbox" 
                              checked={hasAccess} 
                              disabled={disabled}
                              onChange={() => togglePermission(u.id, mod.id)}
                              className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary disabled:opacity-50 cursor-pointer"
                            />
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
