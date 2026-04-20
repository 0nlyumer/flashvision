import React, { useState, useEffect } from 'react';
import BulkUploadModal from './BulkUploadModal';
import ProfileCardModal from './ProfileCardModal';
import { useApp } from '../../context/AppContext';

export default function AddRawMaterial() {
  const { state, setCollection } = useApp();
  const [showHistory, setShowHistory] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [viewProfileData, setViewProfileData] = useState(null);

  const rawMaterials = state.items.filter(item => item.category === 'Raw Material');

  const generateTrackingCode = () => {
    const rmCount = rawMaterials.length;
    return `RM-${String(rmCount + 1).padStart(3, '0')}`;
  };

  // Form State
  const [formData, setFormData] = useState({
    id: '', name: '', sku: '', uom: '', rawMaterialType: '', specifications: '', price: '', alert: '', category: 'Raw Material', type: 'Raw Material', status: 'Active'
  });

  useEffect(() => {
    if (!formData.id && !showHistory) {
      setFormData(prev => ({ ...prev, sku: generateTrackingCode() }));
    }
  }, [state.items, showHistory]);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = () => {
    if (!formData.name || !formData.sku) return alert("Name and SKU are required");
    let updatedItems = [...state.items];
    
    if (formData.id) {
      updatedItems = updatedItems.map(item => item.id === formData.id ? formData : item);
    } else {
      updatedItems.push({ ...formData, id: 'I' + Date.now() });
    }
    
    setCollection('items', updatedItems);
    setFormData({ id: '', name: '', sku: generateTrackingCode(), uom: '', rawMaterialType: '', specifications: '', price: '', alert: '', category: 'Raw Material', type: 'Raw Material', status: 'Active' });
    setShowHistory(true);
  };

  const handleEdit = (item) => {
    setFormData(item);
    setShowHistory(false);
  };

  const handleDelete = (id) => {
    if(window.confirm('Are you sure you want to delete this material?')) {
      const updatedItems = state.items.filter(item => item.id !== id);
      setCollection('items', updatedItems);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h2 className="text-xl font-bold font-headline text-on-surface mb-2">Raw Material Procurement Settings</h2>
          <p className="text-sm font-body text-on-surface-variant max-w-2xl">
            {showHistory ? "Monitor your registered raw materials, specifications, and low stock thresholds." : "Register base commodities and materials used across OMS production."}
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
              {showHistory ? "category" : "history"}
            </span>
            {showHistory ? "Add Raw Material" : "View History"}
          </button>
        </div>
      </div>

      <div className="bg-surface-container-low rounded-2xl overflow-hidden shadow-sm">
        
        {!showHistory ? (
          /* ======================= ADD NEW FORM ======================= */
          <div className="p-6 lg:p-8 animate-in fade-in zoom-in-95 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative group col-span-1 md:col-span-2">
                <input name="name" value={formData.name} onChange={handleInputChange} type="text" placeholder="e.g. Aluminum Sheets 2mm" className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent transition-all" />
                <label className="absolute -top-2 left-3 bg-surface px-1 text-[10px] font-bold text-primary uppercase tracking-wider">Material Name</label>
              </div>
              
              <div className="relative group">
                <input name="sku" value={formData.sku} onChange={handleInputChange} type="text" placeholder="e.g. RM-AL-002" className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent transition-all font-mono" />
                <label className="absolute -top-2 left-3 bg-surface px-1 text-[10px] font-bold text-primary uppercase tracking-wider">Material Code (SKU)</label>
              </div>

              <div className="relative group">
                 <select name="rawMaterialType" value={formData.rawMaterialType} onChange={handleInputChange} className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent transition-all appearance-none">
                  <option value="">Select Type...</option>
                  <option value="Cloth">Cloth</option>
                  <option value="Chemical">Chemical</option>
                  <option value="Metal">Metal</option>
                  <option value="Plastic">Plastic</option>
                  <option value="Other">Other</option>
                </select>
                <label className="absolute -top-2 left-3 bg-surface px-1 text-[10px] font-bold text-primary uppercase tracking-wider">Raw Material Type</label>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
              </div>

              <div className="relative group">
                 <select name="uom" value={formData.uom} onChange={handleInputChange} className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent transition-all appearance-none">
                  <option value="">Select UOM...</option>
                  <option value="Kilograms (kg)">Kilograms (kg)</option>
                  <option value="Liters (L)">Liters (L)</option>
                  <option value="Units (ea)">Units (ea)</option>
                  <option value="Meters (m)">Meters (m)</option>
                </select>
                <label className="absolute -top-2 left-3 bg-surface px-1 text-[10px] font-bold text-primary uppercase tracking-wider">Unit of Measure (UOM)</label>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
              </div>

              <div className="relative group col-span-1 md:col-span-2">
                 <textarea name="specifications" value={formData.specifications} onChange={handleInputChange} rows="3" placeholder="Provide composition details, grades, or handling instructions..." className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent transition-all resize-none"></textarea>
                <label className="absolute -top-2 left-3 bg-surface px-1 text-[10px] font-bold text-primary uppercase tracking-wider">Specifications</label>
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-slate-400 text-sm">$</span>
                </div>
                <input name="price" value={formData.price} onChange={handleInputChange} type="text" placeholder="0.00" className="w-full bg-surface border border-outline-variant/30 rounded-xl pl-8 pr-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent transition-all" />
                <label className="absolute -top-2 left-3 bg-surface px-1 text-[10px] font-bold text-primary uppercase tracking-wider">Estimated Cost / Unit</label>
              </div>

              <div className="relative group">
                <input name="alert" value={formData.alert} onChange={handleInputChange} type="number" placeholder="e.g. 50" className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent transition-all" />
                <label className="absolute -top-2 left-3 bg-surface px-1 text-[10px] font-bold text-primary uppercase tracking-wider">Minimum Stock Alert</label>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-outline-variant/20 flex justify-end gap-4">
              <button 
                onClick={() => setFormData({ id: '', name: '', sku: generateTrackingCode(), uom: '', rawMaterialType: '', specifications: '', price: '', alert: '', category: 'Raw Material', type: 'Raw Material', status: 'Active' })} 
                className="px-6 py-2.5 rounded-xl font-bold text-sm text-primary hover:bg-surface transition-colors"
              >
                Reset
              </button>
              <button onClick={handleSave} className="px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-primary to-primary-container shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-0.5 relative overflow-hidden group">
                <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                <span className="relative flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">{formData.id ? "save" : "category"}</span>
                  {formData.id ? "Update Material" : "Save Material"}
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
                    <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Material Name</th>
                    <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Code / SKU</th>
                    <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider">UOM</th>
                    <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Est. Cost</th>
                    <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Stock Alert</th>
                    <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20 uppercase font-medium text-xs font-body text-on-surface">
                  {rawMaterials.map((mat) => (
                    <tr key={mat.id} className="hover:bg-surface/50 transition-colors">
                      <td className="py-4 px-6 font-bold">{mat.name}</td>
                      <td className="py-4 px-6 font-mono text-primary">{mat.sku}</td>
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-secondary/10 text-secondary">
                          {mat.uom || mat.unit}
                        </span>
                      </td>
                      <td className="py-4 px-6">{mat.price || mat.cost}</td>
                      <td className="py-4 px-6 font-mono text-tertiary">{mat.alert || 0}</td>
                      <td className="py-4 px-6 flex justify-end gap-2">
                        <button onClick={() => setViewProfileData(mat)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-surface hover:bg-blue-50 text-on-surface-variant hover:text-blue-500 transition-colors border border-outline-variant/30" title="View Profile">
                           <span className="material-symbols-outlined text-[16px]">visibility</span>
                        </button>
                        <button onClick={() => handleEdit(mat)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-surface hover:bg-primary/10 text-on-surface-variant hover:text-primary transition-colors border border-outline-variant/30" title="Edit">
                           <span className="material-symbols-outlined text-[16px]">edit</span>
                        </button>
                        <button onClick={() => handleDelete(mat.id)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-surface hover:bg-red-50 text-on-surface-variant hover:text-red-500 transition-colors border border-outline-variant/30" title="Delete">
                           <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </td>
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
        entityName="Raw Materials" 
      />
      <ProfileCardModal 
        isOpen={!!viewProfileData} 
        onClose={() => setViewProfileData(null)} 
        data={viewProfileData} 
        type="Raw Material" 
      />
    </div>
  );
}
