import React from 'react';
import { useApp } from '../../context/AppContext';

export default function GlobalPagination({ 
    totalItems, 
    itemsPerPage = 20, 
    currentPage, 
    setCurrentPage, 
    className = "" 
}) {
    const { state, toggleGlobalPagination } = useApp();
    const isPaginated = state?.isGlobalPaginated;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

    return (
        <div className={`px-6 py-4 bg-surface-container-low flex flex-col md:flex-row justify-between items-center border-t border-outline-variant/10 gap-4 no-print shrink-0 ${className}`}>
            <div className="flex items-center gap-4">
                <div className="text-xs font-medium text-on-surface-variant">
                    Showing {isPaginated ? Math.min(totalItems, (currentPage - 1) * itemsPerPage + 1) : (totalItems > 0 ? 1 : 0)} to {isPaginated ? Math.min(totalItems, currentPage * itemsPerPage) : totalItems} of {totalItems} entries
                </div>
                
                <div className="flex items-center gap-2 border-l border-outline-variant/20 pl-4">
                    <span className={`text-xs font-bold ${!isPaginated ? 'text-primary' : 'text-on-surface-variant'}`}>List View</span>
                    <button 
                        onClick={toggleGlobalPagination}
                        className={`w-10 h-5 rounded-full relative transition-colors ${isPaginated ? 'bg-primary' : 'bg-surface-container-highest'}`}
                    >
                        <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${isPaginated ? 'left-[22px]' : 'left-[3px]'}`}></div>
                    </button>
                    <span className={`text-xs font-bold ${isPaginated ? 'text-primary' : 'text-on-surface-variant'}`}>Pages</span>
                </div>
            </div>
            
            {isPaginated && totalPages > 1 && (
                <div className="flex items-center gap-1">
                    <button 
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        className="p-1 rounded hover:bg-surface-container-high transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                    ><span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>chevron_left</span></button>
                    
                    {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
                        let pageNum = currentPage;
                        if (currentPage <= 3) pageNum = idx + 1;
                        else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + idx;
                        else pageNum = currentPage - 2 + idx;
                        
                        if (pageNum > totalPages || pageNum < 1) return null;
                        
                        return (
                            <button 
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`w-8 h-8 rounded-full text-xs font-bold transition-colors ${currentPage === pageNum ? 'bg-primary text-white shadow-md' : 'hover:bg-surface-container-high text-on-surface'}`}
                            >
                                {pageNum}
                            </button>
                        );
                    })}
                    
                    <button 
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        className="p-1 rounded hover:bg-surface-container-high transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                    ><span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>chevron_right</span></button>
                </div>
            )}
        </div>
    );
}
