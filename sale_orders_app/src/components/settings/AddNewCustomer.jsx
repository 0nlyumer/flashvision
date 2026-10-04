import React, { useState, useRef, useEffect } from 'react';
import BulkUploadModal from './BulkUploadModal';
import ProfileCardModal from './ProfileCardModal';
import { useApp } from '../../context/AppContext';
import { useDialog } from '../../context/DialogContext';
import CustomSelect from '../ui/CustomSelect';
import GlobalPagination from '../ui/GlobalPagination';

export default function AddNewCustomer() {
  const { state, setCollection } = useApp();
  const { appConfirm, appAlert } = useDialog();
  const [showHistory, setShowHistory] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [viewProfileData, setViewProfileData] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  
  const fileInputRef = useRef(null);

  const generateTrackingCode = () => {
    const ids = (state.customers || []).map(c => {
      const match = c.id?.match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    });
    const maxId = ids.length > 0 ? Math.max(...ids) : 0;
    return `CUST-${String(maxId + 1).padStart(3, '0')}`;
  };

  const [formData, setFormData] = useState({
    id: '', name: '', contactPerson: '', email: '', phone: '', address: '', vat: '', terms: 'Net 30', image: null
  });

  const displayedCustomers = state?.isGlobalPaginated
    ? state.customers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : state.customers;

  useEffect(() => {
    if (!formData.id && !showHistory) {
      setFormData(prev => ({ ...prev, id: generateTrackingCode() }));
    }
  }, [state.customers, showHistory]);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: URL.createObjectURL(file) });
    }
  };

  const handleSave = () => {
    if (!formData.name) { appAlert("Customer name is required"); return; }
    let updated = [...state.customers];
    const isNew = !state.customers.some(c => c.id === formData.id);
    if (!formData.id.startsWith('CUST-')) {
      updated.push({ ...formData, id: formData.id || generateTrackingCode() });
    } else {
      // For existing ID or generated
      const existing = updated.findIndex(c => c.id === formData.id);
      if (existing > -1) {
        updated[existing] = formData;
      } else {
        updated.push(formData);
      }
    }
    setCollection('customers', updated);

    // Auto-generate Chart of Account if new customer
    if (isNew) {
      const accounts = state.chartOfAccounts || [];
      const accountExists = accounts.some(acc => acc.name.toLowerCase() === formData.name.toLowerCase());
      if (!accountExists) {
        const nextAccId = 'ACC-' + (4800 + accounts.length + 1);
        const newAccount = {
          id: nextAccId,
          name: formData.name,
          category: 'Customer',
          debit: 0,
          credit: 0
        };
        setCollection('chartOfAccounts', [...accounts, newAccount]);
      }
    }

    handleReset();
    setShowHistory(true);
  };

  const handleReset = () => {
    setFormData({ id: generateTrackingCode(), name: '', contactPerson: '', email: '', phone: '', address: '', vat: '', terms: 'Net 30', image: null });
  };

  const handleEdit = async (customer) => {
    if (!(await appConfirm('Are you sure you want to edit this customer?'))) return;
    setFormData(customer);
    setShowHistory(false);
  };

  const handleDelete = async (id) => {
    if(await appConfirm('Are you sure you want to delete this customer?')) {
      const updated = state.customers.filter(c => c.id !== id);
      setCollection('customers', updated);
    }
  };

  const handleBulkUpload = (csvText) => {
    const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== '');
    if (lines.length < 2) {
      appAlert("No valid data found in CSV file.");
      return;
    }
    const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
    
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const firstCell = line.split(',')[0]?.trim().replace(/^["']|["']$/g, '').toLowerCase();
      if (firstCell === 'end' || line.trim().toLowerCase() === 'end') {
        break;
      }

      const values = [];
      let currentVal = '';
      let inQuotes = false;
      for (let char of line) {
        if (char === '"' || char === "'") {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(currentVal.trim());
          currentVal = '';
        } else {
          currentVal += char;
        }
      }
      values.push(currentVal.trim());
      
      const rowData = {};
      headers.forEach((header, index) => {
        rowData[header] = values[index]?.replace(/^["']|["']$/g, '') || '';
      });
      
      const name = (rowData['Company Name'] || rowData['Company name'] || '').trim();
      if (/[a-zA-Z0-9]/.test(name)) {
        rows.push(rowData);
      }
    }

    let updated = [...state.customers];
    let accounts = [...(state.chartOfAccounts || [])];
    let addedCount = 0;
    let custCount = updated.length;

    rows.forEach(row => {
      const name = row['Company Name'] || row['Company name'];
      if (!name) return;

      const contact = row['Contact Person'] || row['Contact person'] || '';
      const email = row['Email'] || row['email'] || '';
      const phone = row['Phone'] || row['phone'] || '';
      const address = row['Address'] || row['address'] || '';
      const vat = row['VAT'] || row['vat'] || '';
      const terms = row['Terms'] || row['terms'] || 'Net 30';

      custCount++;
      const id = `CUST-${String(custCount).padStart(3, '0')}`;

      updated.push({
        id, name, contactPerson: contact, email, phone, address, vat, terms, image: null
      });

      // Auto chart of accounts
      const accountExists = accounts.some(acc => acc.name.toLowerCase() === name.toLowerCase());
      if (!accountExists) {
        const nextAccId = 'ACC-' + (4800 + accounts.length + 1);
        accounts.push({
          id: nextAccId,
          name: name,
          category: 'Customer',
          debit: 0,
          credit: 0
        });
      }
      addedCount++;
    });

    if (addedCount > 0) {
      setCollection('customers', updated);
      setCollection('chartOfAccounts', accounts);
      appAlert(`Successfully uploaded and created ${addedCount} customers!`);
    } else {
      appAlert("No valid customer entries were found in the file.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h2 className="text-xl font-bold font-headline text-on-surface mb-2">Customer Management</h2>
          <p className="text-sm font-body text-on-surface-variant max-w-2xl">
            {showHistory ? "Manage existing clients, edit profiles, or view purchase reports." : "Enter required billing details for a new client to be used for future orders."}
          </p>
        </div>
        
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => setIsBulkUploadOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-surface border border-outline-variant/30 rounded-xl text-sm font-bold text-on-surface hover:bg-surface-container-low transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-sm text-primary">upload_file</span>
            Bulk Upload
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
              {showHistory ? "person_add" : "history"}
            </span>
            {showHistory ? "Add New Customer" : "View History"}
          </button>
        </div>
      </div>

      <div className="bg-surface-container-low rounded-2xl overflow-hidden shadow-sm">
        
        {!showHistory ? (
          /* ======================= ADD NEW FORM ======================= */
          <div className="p-6 lg:p-8 animate-in fade-in zoom-in-95 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative group col-span-1 md:col-span-2 flex items-center justify-center border-2 border-dashed border-outline-variant/50 rounded-2xl p-6 bg-surface-dim/30 hover:bg-surface-dim/50 transition-colors cursor-pointer" onClick={() => fileInputRef.current.click()}>
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                {formData.image ? (
                  <div className="flex flex-col items-center">
                    <img src={formData.image} alt="User Preview" className="h-24 w-24 object-cover rounded-full shadow-md border border-outline-variant/30 mb-3" />
                    <span className="text-xs font-bold text-primary">Change Logo / Contact Picture</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-on-surface-variant">
                    <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center shadow-sm border border-outline-variant/30">
                      <span className="material-symbols-outlined text-primary">add_photo_alternate</span>
                    </div>
                    <span className="text-sm font-bold">Upload Company Logo</span>
                    <span className="text-xs">PNG, JPG up to 5MB</span>
                  </div>
                )}
              </div>

              <div className="relative group col-span-1 md:col-span-2">
                <input name="name" value={formData.name} onChange={handleInputChange} type="text" placeholder="e.g. Acme Corporation" className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent transition-all" />
                <label className="absolute -top-2 left-3 bg-surface px-1 text-[10px] font-bold text-primary uppercase tracking-wider">Company/Customer Name</label>
              </div>

              <div className="relative group col-span-1 md:col-span-2">
                <input name="contactPerson" value={formData.contactPerson} onChange={handleInputChange} type="text" placeholder="e.g. John Doe" className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent transition-all" />
                <label className="absolute -top-2 left-3 bg-surface px-1 text-[10px] font-bold text-primary uppercase tracking-wider">Contact Person</label>
              </div>
              
              <div className="relative group">
                <input name="email" value={formData.email} onChange={handleInputChange} type="email" placeholder="e.g. billing@acme.corp" className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent transition-all" />
                <label className="absolute -top-2 left-3 bg-surface px-1 text-[10px] font-bold text-primary uppercase tracking-wider">Primary Email</label>
              </div>

              <div className="relative group">
                <input name="phone" value={formData.phone} onChange={handleInputChange} type="tel" placeholder="+1 (555) 000-0000" className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent transition-all" />
                <label className="absolute -top-2 left-3 bg-surface px-1 text-[10px] font-bold text-primary uppercase tracking-wider">Contact Number</label>
              </div>

              <div className="relative group col-span-1 md:col-span-2">
                 <textarea name="address" value={formData.address} onChange={handleInputChange} rows="3" placeholder="Enter full billing address..." className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent transition-all resize-none"></textarea>
                <label className="absolute -top-2 left-3 bg-surface px-1 text-[10px] font-bold text-primary uppercase tracking-wider">Billing Address</label>
              </div>

              <div className="relative group">
                <input name="vat" value={formData.vat} onChange={handleInputChange} type="text" placeholder="e.g. VAT-123456" className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent transition-all" />
                <label className="absolute -top-2 left-3 bg-surface px-1 text-[10px] font-bold text-primary uppercase tracking-wider">Tax ID / VAT No.</label>
              </div>

              <div className="relative group">
                <CustomSelect
                  name="terms"
                  value={formData.terms}
                  onChange={handleInputChange}
                  options={[
                    { label: 'Net 30', value: 'Net 30' },
                    { label: 'Net 60', value: 'Net 60' },
                    { label: 'Due on Receipt', value: 'Due on Receipt' }
                  ]}
                  label="Payment Terms"
                />
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-outline-variant/20 flex justify-end gap-4">
              <button onClick={handleReset} className="px-6 py-2.5 rounded-xl font-bold text-sm text-primary hover:bg-surface transition-colors">Cancel</button>
              <button onClick={handleSave} className="px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-primary to-primary-container shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-0.5 relative overflow-hidden group">
                <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                <span className="relative flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">{formData.id ? "save" : "person_add"}</span>
                  {formData.id ? "Update Customer" : "Save Customer"}
                </span>
              </button>
            </div>
          </div>
        ) : (
          /* ======================= HISTORY DATA TABLE ======================= */
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-dim border-b border-outline-variant/30">
                    <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Customer Name</th>
                    <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Contact Person</th>
                    <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Email Contact</th>
                    <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Phone</th>
                    <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Terms</th>
                    <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider">VAT #</th>
                    <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20 uppercase font-medium text-xs font-body text-on-surface">
                  {displayedCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-surface/50 transition-colors">
                      <td className="py-4 px-6 font-bold flex items-center gap-2">
                        {customer.image ? (
                          <img src={customer.image} alt={customer.name} className="w-8 h-8 rounded-full object-cover border border-outline-variant/30" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-surface border border-outline-variant/30 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[14px] text-on-surface-variant">person</span>
                          </div>
                        )}
                        {customer.name}
                      </td>
                      <td className="py-4 px-6">{customer.contactPerson || '-'}</td>
                      <td className="py-4 px-6 lowercase normal-case">{customer.email}</td>
                      <td className="py-4 px-6 font-mono">{customer.phone}</td>
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-surface-container-highest text-on-surface">
                          {customer.terms || "Net 30"}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-mono text-primary">{customer.vat}</td>
                      <td className="py-4 px-6 flex justify-end gap-2">
                        <button onClick={() => setViewProfileData(customer)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-surface hover:bg-blue-50 text-on-surface-variant hover:text-blue-500 transition-colors border border-outline-variant/30" title="View Profile">
                           <span className="material-symbols-outlined text-[16px]">visibility</span>
                        </button>
                        <button onClick={() => handleEdit(customer)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-surface hover:bg-primary/10 text-on-surface-variant hover:text-primary transition-colors border border-outline-variant/30" title="Edit">
                           <span className="material-symbols-outlined text-[16px]">edit</span>
                        </button>
                        <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-surface hover:bg-tertiary/10 text-on-surface-variant hover:text-tertiary transition-colors border border-outline-variant/30" title="Generate Report">
                           <span className="material-symbols-outlined text-[16px]">monitoring</span>
                        </button>
                        <button onClick={() => handleDelete(customer.id)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-surface hover:bg-red-50 text-on-surface-variant hover:text-red-500 transition-colors border border-outline-variant/30" title="Delete">
                           <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <GlobalPagination 
              totalItems={state.customers.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </div>
        )}
      </div>

      <BulkUploadModal 
        isOpen={isBulkUploadOpen} 
        onClose={() => setIsBulkUploadOpen(false)} 
        entityName="Customers" 
        onUpload={handleBulkUpload}
      />
      <ProfileCardModal 
        isOpen={!!viewProfileData} 
        onClose={() => setViewProfileData(null)} 
        data={viewProfileData} 
        type="Customer" 
      />
    </div>
  );
}
