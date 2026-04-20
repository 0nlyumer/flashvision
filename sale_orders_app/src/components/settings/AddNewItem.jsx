import React, { useState, useRef, useEffect } from 'react';
import BulkUploadModal from './BulkUploadModal';
import ProfileCardModal from './ProfileCardModal';
import { useApp } from '../../context/AppContext';

export default function AddNewItem() {
  const { state, setCollection } = useApp();
  const [showHistory, setShowHistory] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [categoryType, setCategoryType] = useState('Finished Goods');
  const [viewProfileData, setViewProfileData] = useState(null);

  // Math tracking for Finished Goods Roll Size Calculation
  const [uomNumber, setUomNumber] = useState(0);
  const [packingSize, setPackingSize] = useState(0);

  // Auto calculated Roll Size
  const rollSize = (uomNumber * packingSize) || 0;

  // Unified Form Data
  const [formData, setFormData] = useState({
    id: '', name: '', sku: '', uom: '', specifications: '', price: '', alert: '', status: 'Active', image: null, subCategory: '', backClothId: '', rawMaterialType: ''
  });
  
  const fileInputRef = useRef(null);

  // Searchable Dropdown State
  const [searchClothQuery, setSearchClothQuery] = useState('');
  const [isClothDropdownOpen, setIsClothDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsClothDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const clothRawMaterials = state.items.filter(item => (item.category === 'Raw Material' || item.type === 'Raw Material') && item.rawMaterialType === 'Cloth');
  const displayItems = state.items;

  const filteredClothMaterials = clothRawMaterials.filter(rm => 
    rm.name.toLowerCase().includes(searchClothQuery.toLowerCase())
  );

  const generateTrackingCode = (cat) => {
    const list = state.items.filter(i => (i.category === cat || i.type === cat));
    const count = list.length;
    const prefix = cat === 'Finished Goods' ? 'ITM-' : 'RM-';
    return prefix + String(count + 1).padStart(3, '0');
  };

  useEffect(() => {
    if (!formData.id && !showHistory) {
      setFormData(prev => ({ ...prev, sku: generateTrackingCode(categoryType) }));
    }
  }, [state.items, showHistory, categoryType]);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: URL.createObjectURL(file) });
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.sku) return alert("Name and SKU are required");
    
    if (categoryType === 'Finished Goods') {
        if (!formData.backClothId) return alert("Please select a valid Cloth Type in Back Cloth section.");
        if (!rollSize || rollSize <= 0) return alert("Roll Size is mandatory for Finished Goods. Please enter a valid rolling quantity.");
    }

    let updatedItems = [...state.items];
    const itemPayload = { ...formData, category: categoryType, type: categoryType, rollSize, uomNumber, packingSize };
    
    if (formData.id) {
      updatedItems = updatedItems.map(item => item.id === formData.id ? itemPayload : item);
    } else {
      updatedItems.push({ ...itemPayload, id: 'I' + Date.now() });
    }
    
    setCollection('items', updatedItems);
    handleReset();
    setShowHistory(true);
  };

  const handleReset = () => {
    setFormData({ id: '', name: '', sku: generateTrackingCode(categoryType), uom: '', specifications: '', price: '', alert: '', status: 'Active', image: null, subCategory: '', backClothId: '', rawMaterialType: '' });
    setUomNumber(0);
    setPackingSize(0);
  };

  const handleEdit = (item) => {
    setCategoryType(item.category || (item.type === 'Finish Good' ? 'Finished Goods' : 'Raw Material'));
    setFormData({ ...item });
    setUomNumber(item.uomNumber || 0);
    setPackingSize(item.packingSize || 0);
    setShowHistory(false);
  };

  const handleDelete = (id) => {
    if(window.confirm('Are you sure you want to delete this item?')) {
      const updatedItems = state.items.filter(item => item.id !== id);
      setCollection('items', updatedItems);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h2 className="text-xl font-bold font-headline text-on-surface mb-2">Item Master Directory</h2>
          <p className="text-sm font-body text-on-surface-variant max-w-2xl">
            {showHistory ? "View, edit, or generate reports for all registered items across the system." : "Register new Finished Goods or Raw Materials into the master database."}
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
              {showHistory ? "add_circle" : "history"}
            </span>
            {showHistory ? "Add New Item" : "View Item History"}
          </button>
        </div>
      </div>

      <div className="bg-surface-container-low rounded-2xl overflow-hidden shadow-sm">
        
        {!showHistory ? (
          /* ======================= ADD NEW FORM ======================= */
          <div className="p-6 lg:p-8 animate-in fade-in zoom-in-95 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              
              {/* PRIMARY SELECTION (Always Visible) */}
              <div className="relative group col-span-1 md:col-span-2 xl:col-span-3 pb-4 border-b border-outline-variant/20 mb-2">
                 <select 
                  value={categoryType}
                  onChange={(e) => setCategoryType(e.target.value)}
                  className="w-full md:w-1/3 bg-surface border-2 border-primary/40 rounded-xl px-4 py-3 text-sm font-bold text-primary focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent transition-all appearance-none cursor-pointer"
                >
                  <option value="Finished Goods">Finished Goods</option>
                  <option value="Raw Material">Raw Material</option>
                </select>
                <label className="absolute -top-2 left-3 bg-surface px-1 text-[10px] font-bold text-primary uppercase tracking-wider">Item Category Type</label>
                <span className="material-symbols-outlined absolute left-[calc(33.333%-2rem)] top-1/2 -translate-y-[calc(50%+1rem)] md:-translate-y-1/2 text-primary pointer-events-none">expand_more</span>
              </div>

              {/* COMMON FIELDS (Always Visible) */}
              <div className="relative group col-span-1 md:col-span-2 xl:col-span-3 flex items-center justify-center border-2 border-dashed border-outline-variant/50 rounded-2xl p-6 bg-surface-dim/30 hover:bg-surface-dim/50 transition-colors cursor-pointer" onClick={() => fileInputRef.current.click()}>
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                {formData.image ? (
                  <div className="flex flex-col items-center">
                    <img src={formData.image} alt="Item Preview" className="h-32 w-32 object-cover rounded-xl shadow-md border border-outline-variant/30 mb-3" />
                    <span className="text-xs font-bold text-primary">Change Image</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-on-surface-variant">
                    <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center shadow-sm border border-outline-variant/30">
                      <span className="material-symbols-outlined text-primary">add_photo_alternate</span>
                    </div>
                    <span className="text-sm font-bold">Upload Item Picture</span>
                    <span className="text-xs">PNG, JPG up to 5MB</span>
                  </div>
                )}
              </div>

              <div className="relative group col-span-1 md:col-span-2 xl:col-span-1">
                <input name="name" value={formData.name} onChange={handleInputChange} type="text" placeholder={categoryType === 'Finished Goods' ? "e.g. Industrial Servo Motor" : "e.g. Aluminum Sheets 2mm"} className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent transition-all" />
                <label className="absolute -top-2 left-3 bg-surface px-1 text-[10px] font-bold text-primary uppercase tracking-wider">Item Name / Title</label>
              </div>
              
              <div className="relative group relative">
                <input name="sku" value={formData.sku} onChange={handleInputChange} type="text" placeholder={categoryType === 'Finished Goods' ? "e.g. MTR-SRV-001" : "e.g. RM-AL-002"} className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent transition-all font-mono" />
                <label className="absolute -top-2 left-3 bg-surface px-1 text-[10px] font-bold text-primary uppercase tracking-wider">SKU / Item Code</label>
              </div>

              {/* DYNAMIC RENDER: FINISHED GOODS FIELDS */}
              {categoryType === 'Finished Goods' && (
                <>
                  <div className="relative group">
                    <select name="subCategory" value={formData.subCategory} onChange={handleInputChange} className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent transition-all appearance-none">
                      <option value="">Select Sub-Category...</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Mechanical Parts">Mechanical Parts</option>
                      <option value="Packaging">Packaging</option>
                      <option value="Textiles">Textiles</option>
                    </select>
                    <label className="absolute -top-2 left-3 bg-surface px-1 text-[10px] font-bold text-primary uppercase tracking-wider">Sub-Category</label>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                  </div>

                  {/* ROLL SIZE CALCULATOR WIDGET */}
                  <div className="col-span-1 md:col-span-2 xl:col-span-3 bg-tertiary/5 border border-tertiary/20 rounded-xl p-6 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                    <div className="relative group">
                      <input 
                        type="number" 
                        value={uomNumber || ''} 
                        onChange={(e) => setUomNumber(parseFloat(e.target.value) || 0)} 
                        placeholder="0.00" 
                        className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent transition-all font-mono" 
                      />
                      <label className="absolute -top-2 left-3 bg-surface px-1 text-[10px] font-bold text-tertiary uppercase tracking-wider">UOM (Base Quantity)</label>
                    </div>
                    
                    <div className="relative flex items-center justify-center">
                      <span className="material-symbols-outlined text-slate-400 font-light absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden sm:block">close</span>
                      <div className="relative w-full group">
                        <input 
                          type="number" 
                          value={packingSize || ''} 
                          onChange={(e) => setPackingSize(parseFloat(e.target.value) || 0)} 
                          placeholder="0.00" 
                          className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent transition-all font-mono" 
                        />
                        <label className="absolute -top-2 left-3 bg-surface px-1 text-[10px] font-bold text-tertiary uppercase tracking-wider">Packing Size</label>
                      </div>
                    </div>

                    <div className="relative group">
                      <div className="w-full bg-tertiary text-white rounded-xl px-4 py-3 text-sm font-bold shadow-inner flex justify-between items-center">
                        <span className="text-xs uppercase tracking-widest text-tertiary-container">Computed Roll Size</span>
                        <span>{rollSize.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="relative group col-span-1 md:col-span-2 xl:col-span-3 bg-surface-dim/30 p-5 rounded-xl border border-outline-variant/20">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 mt-1">
                        <span className="material-symbols-outlined text-secondary text-sm">texture</span>
                      </div>
                      <div className="flex-1 space-y-3">
                        <div>
                          <h4 className="text-sm font-bold text-on-surface">Associated Base Material</h4>
                          <p className="text-xs text-on-surface-variant">Specify the designated cloth backing or underlying base material required for manufacturing this item.</p>
                        </div>
                        <div className="relative w-full max-w-md" ref={dropdownRef}>
                          <input 
                            type="text" 
                            name="backClothSearch" 
                            placeholder="Type to search Back Cloth..."
                            value={isClothDropdownOpen ? searchClothQuery : (clothRawMaterials.find(rm => rm.id === formData.backClothId)?.name || '')}
                            onChange={(e) => {
                              setSearchClothQuery(e.target.value);
                              if(!isClothDropdownOpen) setIsClothDropdownOpen(true);
                              if (e.target.value === '') {
                                setFormData(prev => ({ ...prev, backClothId: '' }));
                              }
                            }}
                            onFocus={() => {
                              setIsClothDropdownOpen(true);
                              setSearchClothQuery('');
                            }}
                            className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                          />
                          <label className="absolute -top-2 left-3 bg-surface px-1 text-[10px] font-bold text-secondary uppercase tracking-wider">Back Cloth Name</label>
                          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-sm">search</span>
                          
                          {isClothDropdownOpen && (
                            <ul className="absolute z-10 w-full mt-1 bg-surface border border-outline-variant/30 rounded-xl max-h-60 overflow-auto shadow-lg">
                              <li 
                                className="px-4 py-2 hover:bg-surface-container-low cursor-pointer text-sm text-on-surface-variant italic"
                                onClick={() => {
                                  setFormData(prev => ({ ...prev, backClothId: '' }));
                                  setIsClothDropdownOpen(false);
                                }}
                              >
                                -- Clear Selection --
                              </li>
                              {filteredClothMaterials.map(rm => (
                                <li 
                                  key={rm.id} 
                                  className="px-4 py-2 hover:bg-surface-container-low cursor-pointer text-sm text-on-surface"
                                  onClick={() => {
                                    setFormData(prev => ({ ...prev, backClothId: rm.id }));
                                    setSearchClothQuery('');
                                    setIsClothDropdownOpen(false);
                                  }}
                                >
                                  {rm.name}
                                </li>
                              ))}
                              {filteredClothMaterials.length === 0 && (
                                <li className="px-4 py-2 text-sm text-on-surface-variant text-center">No results found</li>
                              )}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative group col-span-1 md:col-span-2 xl:col-span-3">
                    <textarea name="specifications" value={formData.specifications} onChange={handleInputChange} rows="3" placeholder="Enter detailed description, specifications, or usage instructions..." className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent transition-all resize-none"></textarea>
                    <label className="absolute -top-2 left-3 bg-surface px-1 text-[10px] font-bold text-primary uppercase tracking-wider">Detailed Description</label>
                  </div>
                </>
              )}

              {/* DYNAMIC RENDER: RAW MATERIAL FIELDS */}
              {categoryType === 'Raw Material' && (
                <>
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
                      <option value="">Select Text UOM...</option>
                      <option value="Kilograms (kg)">Kilograms (kg)</option>
                      <option value="Liters (L)">Liters (L)</option>
                      <option value="Units (ea)">Units (ea)</option>
                      <option value="Meters (m)">Meters (m)</option>
                    </select>
                    <label className="absolute -top-2 left-3 bg-surface px-1 text-[10px] font-bold text-primary uppercase tracking-wider">Unit of Measure (Text)</label>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                  </div>

                  <div className="relative group col-span-1 md:col-span-2 xl:col-span-3">
                    <textarea name="specifications" value={formData.specifications} onChange={handleInputChange} rows="3" placeholder="Provide composition details, grades, or handling instructions..." className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent transition-all resize-none"></textarea>
                    <label className="absolute -top-2 left-3 bg-surface px-1 text-[10px] font-bold text-primary uppercase tracking-wider">Material Specifications</label>
                  </div>
                </>
              )}

              {/* COMMON FOOTER FIELDS (Cost/Price, Alert/Level, Status) */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-slate-400 text-sm">$</span>
                </div>
                <input name="price" value={formData.price} onChange={handleInputChange} type="text" placeholder="0.00" className="w-full bg-surface border border-outline-variant/30 rounded-xl pl-8 pr-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent transition-all" />
                <label className="absolute -top-2 left-3 bg-surface px-1 text-[10px] font-bold text-primary uppercase tracking-wider">
                  {categoryType === 'Finished Goods' ? 'Unit Price' : 'Estimated Cost'}
                </label>
              </div>

              <div className="relative group">
                <input name="alert" value={formData.alert} onChange={handleInputChange} type="number" placeholder="0" className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent transition-all" />
                <label className="absolute -top-2 left-3 bg-surface px-1 text-[10px] font-bold text-primary uppercase tracking-wider">
                  {categoryType === 'Finished Goods' ? 'Reorder Level' : 'Min Stock Alert'}
                </label>
              </div>

              <div className="relative group">
                <select name="status" value={formData.status} onChange={handleInputChange} className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent transition-all appearance-none">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Discontinued">Discontinued</option>
                </select>
                <label className="absolute -top-2 left-3 bg-surface px-1 text-[10px] font-bold text-primary uppercase tracking-wider">Status</label>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
              </div>

            </div>

            <div className="mt-8 pt-6 border-t border-outline-variant/20 flex justify-end gap-4">
              <button onClick={handleReset} className="px-6 py-2.5 rounded-xl font-bold text-sm text-primary hover:bg-surface transition-colors">Clear Form</button>
              <button onClick={handleSave} className="px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-primary to-primary-container shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-0.5 relative overflow-hidden group">
                <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                <span className="relative flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">{formData.id ? "save" : "add_circle"}</span>
                  {formData.id ? `Update ${categoryType}` : `Register ${categoryType}`}
                </span>
              </button>
            </div>
          </div>
        ) : (
          /* ======================= UNIFIED HISTORY DATA TABLE ======================= */
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-dim border-b border-outline-variant/30">
                    <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Item Name / Title</th>
                    <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Code / SKU</th>
                    <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Type</th>
                    <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Value</th>
                    <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
                    <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20 uppercase font-medium text-xs font-body text-on-surface">
                  {displayItems.map((item) => (
                    <tr key={item.id} className="hover:bg-surface/50 transition-colors">
                      <td className="py-4 px-6 font-bold flex items-center gap-2">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-6 h-6 rounded object-cover" />
                        ) : (
                          <div className="w-6 h-6 rounded bg-surface border border-outline-variant/30 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[10px] text-on-surface-variant">image</span>
                          </div>
                        )}
                        {item.name}
                      </td>
                      <td className="py-4 px-6 font-mono text-primary">{item.sku}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          item.category === 'Finished Goods' ? 'bg-primary-container text-on-primary-container' : 'bg-secondary-container text-on-secondary-container'
                        }`}>
                          {item.category || item.type}
                        </span>
                      </td>
                      <td className="py-4 px-6">{item.price}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          item.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.status || "Active"}
                        </span>
                      </td>
                      <td className="py-4 px-6 flex justify-end gap-2">
                        <button onClick={() => setViewProfileData(item)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-surface hover:bg-blue-50 text-on-surface-variant hover:text-blue-500 transition-colors border border-outline-variant/30" title="View Profile">
                           <span className="material-symbols-outlined text-[16px]">visibility</span>
                        </button>
                        <button onClick={() => handleEdit(item)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-surface hover:bg-primary/10 text-on-surface-variant hover:text-primary transition-colors border border-outline-variant/30" title="Edit">
                           <span className="material-symbols-outlined text-[16px]">edit</span>
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-surface hover:bg-red-50 text-on-surface-variant hover:text-red-500 transition-colors border border-outline-variant/30" title="Delete">
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
        entityName={categoryType} 
      />
      <ProfileCardModal 
        isOpen={!!viewProfileData} 
        onClose={() => setViewProfileData(null)} 
        data={viewProfileData} 
        type="Item Identity" 
      />
    </div>
  );
}
