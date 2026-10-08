import React from 'react';

export default function ProfileCardModal({ isOpen, onClose, data, type }) {
  if (!isOpen || !data) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleSaveAsJSON = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = `${type}_Profile_${data.id || 'Data'}.json`;
    link.click();
  };

  const handleSaveAsCSV = () => {
    const headers = Object.keys(data).join(',');
    const values = Object.values(data).map(v => typeof v === 'object' ? JSON.stringify(v) : `"${v}"`).join(',');
    const csvString = `data:text/csv;charset=utf-8,${encodeURIComponent(headers + '\\n' + values)}`;
    const link = document.createElement('a');
    link.href = csvString;
    link.download = `${type}_Profile_${data.id || 'Data'}.csv`;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 print:p-0 animate-in fade-in duration-300">
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #profile-modal-content, #profile-modal-content * {
            visibility: visible;
          }
          #profile-modal-content {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100vw !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: visible !important;
            box-shadow: none !important;
            border: none !important;
            background: transparent !important;
          }
          @page {
            size: auto;
            margin: 10mm;
          }
        }
      `}</style>
      <div 
        className="absolute inset-0 bg-surface/80 backdrop-blur-sm transition-opacity print:hidden"
        onClick={onClose}
      ></div>
      
      <div 
        id="profile-modal-content"
        className="relative bg-surface border border-outline-variant/30 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300 print:shadow-none print:border-none print:w-full print:max-w-none flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-primary/5 px-8 pt-8 pb-6 border-b border-outline-variant/20 print:bg-transparent flex justify-between items-start">
          <div className="flex items-center gap-6">
            {data.image ? (
              <img src={data.image} alt={data.name} className="w-24 h-24 rounded-full object-cover shadow-md border-4 border-surface" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-surface-container flex items-center justify-center shadow-inner border-4 border-surface">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant">person</span>
              </div>
            )}
            <div>
              <h2 className="text-3xl font-extrabold text-on-surface font-headline mb-1">{data.name}</h2>
              <div className="flex gap-3 items-center">
                <span className="px-3 py-1 bg-surface rounded-full text-xs font-bold border border-outline-variant/30 text-on-surface-variant flex items-center gap-1 shadow-sm">
                  <span className="material-symbols-outlined text-[14px]">tag</span>
                  {data.id || data.sku}
                </span>
                <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-widest">{type}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface bg-surface rounded-full p-2 hover:bg-surface-container transition-colors print:hidden shadow-sm border border-outline-variant/20">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-8 overflow-y-auto custom-scrollbar bg-surface flex-1">
          <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">id_card</span>
            Detailed Profile View
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {Object.entries(data).map(([key, value]) => {
              if (key === 'image' || key === 'name' || key === 'id') return null;
              return (
                <div key={key} className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/20 shadow-sm relative group hover:border-primary/30 transition-colors">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <p className="text-sm font-bold text-on-surface break-words">{value || '-'}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer / Actions */}
        <div className="px-8 py-5 bg-surface-container-low border-t border-outline-variant/20 flex flex-wrap justify-between items-center gap-4 print:hidden">
            <div className="text-xs text-on-surface-variant">Profile created and verified on {new Date().toLocaleDateString()}</div>
            <div className="flex flex-wrap items-center gap-3">
              <button 
                onClick={handlePrint}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface border border-outline-variant/30 text-on-surface text-sm font-bold hover:bg-surface-container transition-all shadow-sm group"
              >
                <span className="material-symbols-outlined text-[18px] text-primary group-hover:scale-110 transition-transform">print</span>
                Print Document
              </button>
              
              <div className="relative group/dropdown">
                 <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/20">
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  Save As
                  <span className="material-symbols-outlined text-[14px]">expand_more</span>
                </button>
                <div className="absolute right-0 bottom-full w-48 pb-2 opacity-0 group-hover/dropdown:opacity-100 pointer-events-none group-hover/dropdown:pointer-events-auto transition-all translate-y-2 group-hover/dropdown:translate-y-0 z-10">
                  <div className="bg-surface rounded-xl border border-outline-variant/30 shadow-lg p-2 flex flex-col gap-1">
                    <button onClick={handlePrint} className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm font-bold text-on-surface rounded-lg hover:bg-surface-container transition-colors">
                      <span className="material-symbols-outlined text-[16px] text-red-500">picture_as_pdf</span>
                      PDF Format
                    </button>
                    <button onClick={handleSaveAsJSON} className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm font-bold text-on-surface rounded-lg hover:bg-surface-container transition-colors">
                      <span className="material-symbols-outlined text-[16px] text-blue-500">data_object</span>
                      JSON Details
                    </button>
                    <button onClick={handleSaveAsCSV} className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm font-bold text-on-surface rounded-lg hover:bg-surface-container transition-colors">
                      <span className="material-symbols-outlined text-[16px] text-emerald-500">table_chart</span>
                      CSV Export
                    </button>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
