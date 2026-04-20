import React, { useState, useRef } from 'react';

export default function BulkUploadModal({ isOpen, onClose, entityName }) {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleDownload = () => {
    let headers = [];
    let rows = [];

    switch(entityName) {
      case 'Customers':
        headers = ['Company Name', 'Email', 'Phone', 'Address', 'VAT', 'Terms'];
        rows = [
          ['Acme Corp', 'billing@acmecorp.com', '+1-555-0100', '123 Acme Way', 'VAT123', 'Net 30'],
          ['Beta LLC', 'finance@betallc.com', '+1-555-0200', '456 Beta Blvd', 'VAT456', 'Due on Receipt']
        ];
        break;
      case 'Suppliers':
        headers = ['Supplier Name', 'Contact Person', 'Email', 'Address', 'Category', 'Badges'];
        rows = [
          ['Global Metals', 'John Doe', 'john@globalmetals.com', '789 Steel St', 'Materials & Commodities', 'ISO 9001'],
          ['Swift Freight', 'Jane Smith', 'jane@swift-freight.com', '101 Cargo Ave', 'Logistics & Freight', 'SafeTransit Certified']
        ];
        break;
      case 'Finished Goods':
        headers = ['Item Name', 'SKU', 'SubCategory', 'Price', 'Status'];
        rows = [
          ['Premium Widget', 'WID-001', 'Widgets', '25.00', 'Active'],
          ['Standard Gadget', 'GAD-101', 'Gadgets', '15.50', 'Active']
        ];
        break;
      case 'Raw Material':
        headers = ['Material Name', 'SKU', 'Type', 'UOM', 'Estimated Cost', 'Status'];
        rows = [
          ['Steel Tubing', 'TUB-002', 'Metal', 'Meters (m)', '12.00', 'Active'],
          ['Cotton Blend', 'CTN-301', 'Cloth', 'Kilograms (kg)', '5.50', 'Active']
        ];
        break;
      default:
        headers = ['Col1', 'Col2', 'Col3'];
        rows = [['Data1', 'Data2', 'Data3']];
    }

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${entityName.replace(/\s+/g, '_')}_Template.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    onClose();
  };

  const handleUpload = () => {
    if (selectedFile) {
      alert(`File "${selectedFile.name}" would be uploaded here.`);
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-in fade-in duration-300">
      <div 
        className="absolute inset-0 bg-surface/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      ></div>
      
      <div className="relative bg-surface border border-outline-variant/30 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="bg-surface-container-low px-6 py-4 flex items-center justify-between border-b border-outline-variant/20">
          <div className="flex items-center gap-2 text-on-surface">
            <span className="material-symbols-outlined text-primary">cloud_upload</span>
            <h3 className="font-bold font-headline text-lg">Bulk Upload {entityName}</h3>
          </div>
          <button 
            onClick={handleClose}
            className="text-slate-400 hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-primary">file_download</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-on-surface mb-1">Step 1: Download Format</h4>
              <p className="text-xs text-on-surface-variant mb-3">
                Please download the strict CSV template for {entityName}. Do not modify column headers.
              </p>
              <button 
                onClick={handleDownload}
                className="text-xs font-bold text-primary underline hover:text-primary-container transition-colors"
               >
                Download {entityName}_Template.csv
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-outline-variant/20" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-surface px-2 text-[10px] uppercase tracking-widest font-bold text-slate-400">
                Step 2: Upload Data
              </span>
            </div>
          </div>

          <div 
            className="border-2 border-dashed border-outline-variant/40 rounded-xl p-8 text-center hover:bg-surface-container-low/50 transition-colors cursor-pointer group"
            onClick={() => fileInputRef.current?.click()}
          >
            {selectedFile ? (
               <>
                 <div className="w-12 h-12 bg-primary/10 rounded-full mx-auto flex items-center justify-center mb-3">
                   <span className="material-symbols-outlined text-primary">description</span>
                 </div>
                 <p className="text-sm font-bold text-on-surface mb-1">{selectedFile.name}</p>
                 <p className="text-xs text-on-surface-variant mb-4">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                 <button className="px-4 py-2 bg-surface-container-highest rounded-lg text-xs font-bold text-on-surface border border-outline-variant/20 shadow-sm hover:bg-surface-dim transition-all">
                   Change File
                 </button>
               </>
            ) : (
               <>
                 <div className="w-12 h-12 bg-surface-container-low rounded-full mx-auto flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                   <span className="material-symbols-outlined text-outline">upload_file</span>
                 </div>
                 <p className="text-sm font-bold text-on-surface mb-1">Click to browse or drag file here</p>
                 <p className="text-xs text-on-surface-variant mb-4">Accepts .xlsx, .xls, or .csv</p>
                 
                 <button className="px-4 py-2 bg-surface-container-highest rounded-lg text-xs font-bold text-on-surface border border-outline-variant/20 shadow-sm hover:bg-surface-dim transition-all">
                   Browse Files
                 </button>
               </>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" 
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-surface-container-lowest border-t border-outline-variant/20 flex justify-end gap-3">
          <button 
            onClick={handleClose}
            className="px-4 py-2 rounded-xl text-sm font-bold text-on-surface-variant hover:bg-surface transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleUpload}
            disabled={!selectedFile}
            className={`px-4 py-2 rounded-xl text-sm font-bold text-white shadow-md transition-all ${selectedFile ? 'bg-gradient-to-r from-primary to-primary-container hover:shadow-lg' : 'bg-slate-300 cursor-not-allowed opacity-50'}`}
          >
            Upload Data
          </button>
        </div>
      </div>
    </div>
  );
}
