import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useDialog } from '../../context/DialogContext';
import ResizableHeader from '../ui/ResizableHeader';

export default function ChartOfAccounts() {
  const { state, setCollection } = useApp();
  const { appConfirm, appAlert } = useDialog();
  const currencyCode = state.adminSetup?.baseCurrency ? state.adminSetup.baseCurrency.split(' ')[0] : 'PKR';

  // Filters state
  const [filterId, setFilterId] = useState('');
  const [filterName, setFilterName] = useState('');
  const [filterCategory, setFilterCategory] = useState('All Categories');

  // Trigger filter state
  const [appliedId, setAppliedId] = useState('');
  const [appliedName, setAppliedName] = useState('');
  const [appliedCategory, setAppliedCategory] = useState('All Categories');

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  // Active items state for CRUD
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [editAccount, setEditAccount] = useState(null);

  // Form states for creating a new account
  const [newAccId, setNewAccId] = useState('');
  const [newAccName, setNewAccName] = useState('');
  const [newAccCategory, setNewAccCategory] = useState('Customer');
  const [newAccDebit, setNewAccDebit] = useState(0);
  const [newAccCredit, setNewAccCredit] = useState(0);

  // Form states for editing
  const [editAccName, setEditAccName] = useState('');
  const [editAccCategory, setEditAccCategory] = useState('Customer');
  const [editAccDebit, setEditAccDebit] = useState(0);
  const [editAccCredit, setEditAccCredit] = useState(0);

  // Column visibility states
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    name: true,
    category: true,
    debit: true,
    credit: true,
    netRec: true,
    netPay: true,
    actions: true
  });
  const [showColPicker, setShowColPicker] = useState(false);

  const accounts = state.chartOfAccounts || [];

  // Filter application
  const filteredAccounts = accounts.filter(acc => {
    const matchId = appliedId ? acc.id.toLowerCase().includes(appliedId.toLowerCase()) : true;
    const matchName = appliedName ? acc.name.toLowerCase().includes(appliedName.toLowerCase()) : true;
    const matchCat = appliedCategory && appliedCategory !== 'All Categories' ? acc.category === appliedCategory : true;
    return matchId && matchName && matchCat;
  });

  const handleApplyFilters = () => {
    setAppliedId(filterId);
    setAppliedName(filterName);
    setAppliedCategory(filterCategory);
  };

  const handleResetFilters = () => {
    setFilterId('');
    setFilterName('');
    setFilterCategory('All Categories');
    setAppliedId('');
    setAppliedName('');
    setAppliedCategory('All Categories');
  };

  // Helper to open create modal and auto-suggest ID
  const openCreateModal = () => {
    const nextAccId = 'ACC-' + (4800 + accounts.length + 1);
    setNewAccId(nextAccId);
    setNewAccName('');
    setNewAccCategory('Customer');
    setNewAccDebit(0);
    setNewAccCredit(0);
    setShowCreateModal(true);
  };

  const handleSaveNewAccount = () => {
    if (!newAccName.trim()) {
      appAlert("Account Name is required.");
      return;
    }
    if (accounts.some(acc => acc.id.toLowerCase() === newAccId.toLowerCase())) {
      appAlert(`An account with ID ${newAccId} already exists.`);
      return;
    }

    const newAccount = {
      id: newAccId,
      name: newAccName,
      category: newAccCategory,
      debit: Number(newAccDebit) || 0,
      credit: Number(newAccCredit) || 0
    };

    setCollection('chartOfAccounts', [...accounts, newAccount]);
    setShowCreateModal(false);
    appAlert("Account created successfully!");
  };

  const openEditModal = (account) => {
    setEditAccount(account);
    setEditAccName(account.name);
    setEditAccCategory(account.category);
    setEditAccDebit(account.debit || 0);
    setEditAccCredit(account.credit || 0);
    setShowEditModal(true);
  };

  const handleSaveEditAccount = () => {
    if (!editAccName.trim()) {
      appAlert("Account Name is required.");
      return;
    }

    const updatedAccounts = accounts.map(acc => {
      if (acc.id === editAccount.id) {
        return {
          ...acc,
          name: editAccName,
          category: editAccCategory,
          debit: Number(editAccDebit) || 0,
          credit: Number(editAccCredit) || 0
        };
      }
      return acc;
    });

    setCollection('chartOfAccounts', updatedAccounts);
    setShowEditModal(false);
    appAlert("Account details updated successfully!");
  };

  const handleDeleteAccount = async (account) => {
    const proceed = await appConfirm(
      `Are you sure you want to delete the account: ${account.name} (${account.id})?`,
      "Delete Account Confirmation",
      "Delete",
      "Cancel"
    );

    if (proceed) {
      const updatedAccounts = accounts.filter(acc => acc.id !== account.id);
      setCollection('chartOfAccounts', updatedAccounts);
      appAlert("Account deleted successfully!");
    }
  };

  return (
    <div className="p-8 max-w-full w-full mx-auto space-y-8">
      {/* Header and Add Button */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <nav className="flex items-center gap-2 text-xs text-on-surface-variant mb-2">
            <span>Finance</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-semibold">Chart of Accounts</span>
          </nav>
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight">Chart of Accounts</h2>
            <span className="text-xs font-semibold px-3 py-1 bg-surface-container text-on-secondary-container rounded-full">
              {filteredAccounts.length} Active Accounts
            </span>
          </div>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-1.5 px-5 py-3 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-xl font-bold text-xs hover:scale-[1.02] transition-all shadow-md cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">add_circle</span>
          Create New Account
        </button>
      </div>

      {/* Filters Form Panel */}
      <section className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 shadow-sm flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px] space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Account ID</label>
          <input
            type="text"
            value={filterId}
            onChange={(e) => setFilterId(e.target.value)}
            className="w-full bg-surface-container-low border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
            placeholder="e.g. ACC-4821"
          />
        </div>
        <div className="flex-1 min-w-[200px] space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Account Name</label>
          <input
            type="text"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            className="w-full bg-surface-container-low border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
            placeholder="e.g. Nexis Chem-Corp"
          />
        </div>
        <div className="flex-1 min-w-[200px] space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Category</label>
          <div className="relative">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full appearance-none bg-surface-container-low border-none rounded-xl px-4 py-2.5 pr-10 text-sm focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
            >
              <option value="All Categories">All Categories</option>
              <option value="Customer">Customer</option>
              <option value="Vendor">Vendor</option>
              <option value="Internal">Internal</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
              expand_more
            </span>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={handleApplyFilters}
            className="px-5 py-2.5 bg-surface-container-high hover:bg-surface-container-highest text-primary rounded-xl font-bold text-xs transition-colors h-[38px]"
          >
            Apply Filters
          </button>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2.5 bg-surface hover:bg-surface-container-low text-on-surface-variant rounded-xl font-bold text-xs transition-colors h-[38px]"
          >
            Reset
          </button>
        </div>
      </section>

      {/* Accounts Ledger Data Table */}
      <section className="bg-surface-container-lowest rounded-2xl shadow-[0_20px_40px_rgba(0,28,56,0.06)] overflow-hidden border border-outline-variant/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-surface-container">
                {visibleColumns.id && <ResizableHeader className="px-6 py-4">Account ID</ResizableHeader>}
                {visibleColumns.name && <ResizableHeader className="px-6 py-4">Account Name</ResizableHeader>}
                {visibleColumns.category && <ResizableHeader className="px-6 py-4">Category</ResizableHeader>}
                {visibleColumns.debit && <ResizableHeader className="px-6 py-4 text-right">Total Debit ({currencyCode})</ResizableHeader>}
                {visibleColumns.credit && <ResizableHeader className="px-6 py-4 text-right">Total Credit ({currencyCode})</ResizableHeader>}
                {visibleColumns.netRec && <ResizableHeader className="px-6 py-4 text-right">Net Rec.</ResizableHeader>}
                {visibleColumns.netPay && <ResizableHeader className="px-6 py-4 text-right">Net Pay.</ResizableHeader>}
                {visibleColumns.actions && <ResizableHeader className="px-6 py-4 text-center">Actions</ResizableHeader>}
                
                {/* Column Picker Three-Dot Menu */}
                <th className="px-4 py-4 w-10 text-center relative">
                  <button
                    onClick={() => setShowColPicker(!showColPicker)}
                    className="p-1 hover:bg-surface-container rounded-lg transition-colors cursor-pointer flex items-center justify-center mx-auto"
                    title="Toggle Columns"
                  >
                    <span className="material-symbols-outlined text-[20px] text-on-surface-variant hover:text-primary">more_vert</span>
                  </button>
                  {showColPicker && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowColPicker(false)}></div>
                      <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-lg p-3 space-y-2.5 z-20 text-sm text-on-surface text-left normal-case tracking-normal">
                        <p className="font-bold text-[10px] text-on-surface-variant uppercase tracking-widest px-1 mb-1">Toggle Columns</p>
                        <div className="h-px bg-outline-variant/20 my-1"></div>
                        {Object.entries({
                          id: 'Account ID',
                          name: 'Account Name',
                          category: 'Category',
                          debit: 'Debit',
                          credit: 'Credit',
                          netRec: 'Net Rec.',
                          netPay: 'Net Pay.',
                          actions: 'Actions'
                        }).map(([key, label]) => (
                          <label key={key} className="flex items-center gap-2 px-1 py-0.5 hover:bg-surface rounded cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={visibleColumns[key]}
                              onChange={() => setVisibleColumns(prev => ({ ...prev, [key]: !prev[key] }))}
                              className="rounded border-outline-variant text-primary focus:ring-primary/20 w-4 h-4"
                            />
                            <span className="font-medium text-xs">{label}</span>
                          </label>
                        ))}
                      </div>
                    </>
                  )}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {filteredAccounts.length > 0 ? (
                filteredAccounts.map((account) => {
                  const debit = account.debit || 0;
                  const credit = account.credit || 0;
                  const netRec = debit > credit ? debit - credit : 0;
                  const netPay = credit > debit ? credit - debit : 0;

                  return (
                    <tr key={account.id} className="hover:bg-surface transition-colors group">
                      {visibleColumns.id && (
                        <td className="px-6 py-4 text-sm font-mono font-bold text-primary">
                          {account.id}
                        </td>
                      )}
                      {visibleColumns.name && (
                        <td className="px-6 py-4 text-sm font-semibold text-on-surface">
                          {account.name}
                        </td>
                      )}
                      {visibleColumns.category && (
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            account.category === 'Customer' ? 'bg-blue-100 text-blue-800' :
                            account.category === 'Vendor' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'
                          }`}>
                            {account.category}
                          </span>
                        </td>
                      )}
                      {visibleColumns.debit && (
                        <td className="px-6 py-4 text-sm font-medium text-right text-on-surface-variant">
                          {debit.toLocaleString()}
                        </td>
                      )}
                      {visibleColumns.credit && (
                        <td className="px-6 py-4 text-sm font-medium text-right text-on-surface-variant">
                          {credit.toLocaleString()}
                        </td>
                      )}
                      {visibleColumns.netRec && (
                        <td className="px-6 py-4 text-sm font-bold text-right text-success">
                          {netRec > 0 ? netRec.toLocaleString() : '-'}
                        </td>
                      )}
                      {visibleColumns.netPay && (
                        <td className="px-6 py-4 text-sm font-bold text-right text-red-600">
                          {netPay > 0 ? netPay.toLocaleString() : '-'}
                        </td>
                      )}
                      {visibleColumns.actions && (
                        <td className="px-6 py-4 text-sm text-center">
                          <div className="flex justify-center gap-1">
                            <button
                              onClick={() => { setSelectedAccount(account); setShowViewModal(true); }}
                              className="p-1 hover:bg-surface-container rounded transition-colors text-on-surface-variant hover:text-primary cursor-pointer"
                              title="View details"
                            >
                              <span className="material-symbols-outlined text-[18px]">visibility</span>
                            </button>
                            <button
                              onClick={() => openEditModal(account)}
                              className="p-1 hover:bg-surface-container rounded transition-colors text-on-surface-variant hover:text-amber-700 cursor-pointer"
                              title="Edit account"
                            >
                              <span className="material-symbols-outlined text-[18px]">edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteAccount(account)}
                              className="p-1 hover:bg-surface-container rounded transition-colors text-on-surface-variant hover:text-red-700 cursor-pointer"
                              title="Delete account"
                            >
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                          </div>
                        </td>
                      )}
                      {/* Empty cell matching headers row */}
                      <td className="px-4 py-4 w-10"></td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="text-center p-12 text-on-surface-variant font-medium">
                    No accounts match the applied filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ======================= CREATE MODAL ======================= */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-on-background/20 backdrop-blur-[2px]" onClick={() => setShowCreateModal(false)}></div>
          <div className="relative z-10 w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/15 flex flex-col p-6 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="font-headline font-extrabold text-xl text-on-surface mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">add_box</span>
              Create New Account
            </h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Account ID</label>
                <input
                  type="text"
                  value={newAccId}
                  onChange={(e) => setNewAccId(e.target.value)}
                  className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="e.g. ACC-1002"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Account Name</label>
                <input
                  type="text"
                  value={newAccName}
                  onChange={(e) => setNewAccName(e.target.value)}
                  className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="e.g. Petty Cash - Secondary"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Category</label>
                <div className="relative">
                  <select
                    value={newAccCategory}
                    onChange={(e) => setNewAccCategory(e.target.value)}
                    className="w-full appearance-none bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                  >
                    <option value="Customer">Customer</option>
                    <option value="Vendor">Vendor</option>
                    <option value="Internal">Internal</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
                    expand_more
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Debit ({currencyCode})</label>
                  <input
                    type="number"
                    value={newAccDebit}
                    onChange={(e) => setNewAccDebit(parseFloat(e.target.value) || 0)}
                    className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Credit ({currencyCode})</label>
                  <input
                    type="number"
                    value={newAccCredit}
                    onChange={(e) => setNewAccCredit(parseFloat(e.target.value) || 0)}
                    className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2.5 bg-surface-container-low hover:bg-surface-container text-on-surface-variant font-semibold text-xs rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNewAccount}
                className="px-5 py-2.5 bg-primary text-on-primary font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================= EDIT MODAL ======================= */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-on-background/20 backdrop-blur-[2px]" onClick={() => setShowEditModal(false)}></div>
          <div className="relative z-10 w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/15 flex flex-col p-6 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="font-headline font-extrabold text-xl text-on-surface mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">edit_note</span>
              Edit Account ({editAccount.id})
            </h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Account Name</label>
                <input
                  type="text"
                  value={editAccName}
                  onChange={(e) => setEditAccName(e.target.value)}
                  className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Category</label>
                <div className="relative">
                  <select
                    value={editAccCategory}
                    onChange={(e) => setEditAccCategory(e.target.value)}
                    className="w-full appearance-none bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                  >
                    <option value="Customer">Customer</option>
                    <option value="Vendor">Vendor</option>
                    <option value="Internal">Internal</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
                    expand_more
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Debit ({currencyCode})</label>
                  <input
                    type="number"
                    value={editAccDebit}
                    onChange={(e) => setEditAccDebit(parseFloat(e.target.value) || 0)}
                    className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Credit ({currencyCode})</label>
                  <input
                    type="number"
                    value={editAccCredit}
                    onChange={(e) => setEditAccCredit(parseFloat(e.target.value) || 0)}
                    className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2.5 bg-surface-container-low hover:bg-surface-container text-on-surface-variant font-semibold text-xs rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEditAccount}
                className="px-5 py-2.5 bg-primary text-on-primary font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================= VIEW DETAILS MODAL ======================= */}
      {showViewModal && selectedAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-on-background/25 backdrop-blur-[3px]" onClick={() => setShowViewModal(false)}></div>
          <div className="relative z-10 w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/15 flex flex-col p-6 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="font-headline font-extrabold text-xl text-on-surface mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
              Account Ledger Details
            </h3>
            <div className="space-y-4 mb-8 bg-surface-container-low/40 p-5 rounded-xl border border-outline-variant/10 text-sm">
              <div className="flex justify-between">
                <span className="text-on-surface-variant font-semibold">Account ID:</span>
                <span className="font-mono font-bold text-primary">{selectedAccount.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant font-semibold">Account Name:</span>
                <span className="font-bold text-on-surface">{selectedAccount.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant font-semibold">Category:</span>
                <span className="font-semibold">{selectedAccount.category}</span>
              </div>
              <div className="h-px bg-outline-variant/20 my-2"></div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant font-semibold">Total Debit:</span>
                <span className="font-bold text-on-surface">{currencyCode} {selectedAccount.debit?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant font-semibold">Total Credit:</span>
                <span className="font-bold text-on-surface">{currencyCode} {selectedAccount.credit?.toLocaleString()}</span>
              </div>
              <div className="h-px bg-outline-variant/20 my-2"></div>
              {selectedAccount.debit > selectedAccount.credit ? (
                <div className="flex justify-between text-success">
                  <span className="font-bold uppercase tracking-wider text-[10px]">Net Receivable:</span>
                  <span className="font-extrabold">{currencyCode} {(selectedAccount.debit - selectedAccount.credit).toLocaleString()}</span>
                </div>
              ) : selectedAccount.credit > selectedAccount.debit ? (
                <div className="flex justify-between text-red-600">
                  <span className="font-bold uppercase tracking-wider text-[10px]">Net Payable:</span>
                  <span className="font-extrabold">{currencyCode} {(selectedAccount.credit - selectedAccount.debit).toLocaleString()}</span>
                </div>
              ) : (
                <div className="flex justify-between text-on-surface-variant">
                  <span className="font-bold uppercase tracking-wider text-[10px]">Net Position:</span>
                  <span className="font-extrabold">Settled (0)</span>
                </div>
              )}
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-5 py-2.5 bg-primary text-on-primary font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
