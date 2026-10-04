import { useState, useCallback, useEffect } from 'react';

export default function useDynamicColumns(initialColumns, storageKey = null) {
    const [columns, setColumns] = useState(() => {
        if (storageKey) {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    const merged = initialColumns.map(initCol => {
                        const savedCol = parsed.find(c => c.id === initCol.id);
                        return savedCol ? { ...initCol, ...savedCol } : initCol;
                    });
                    const extraSaved = parsed.filter(sc => !initialColumns.find(ic => ic.id === sc.id));
                    return [...merged, ...extraSaved].sort((a, b) => {
                         const aIdx = parsed.findIndex(c => c.id === a.id);
                         const bIdx = parsed.findIndex(c => c.id === b.id);
                         if (aIdx === -1 && bIdx === -1) return 0;
                         if (aIdx === -1) return 1;
                         if (bIdx === -1) return -1;
                         return aIdx - bIdx;
                    });
                } catch (e) {
                    console.error('Failed to parse saved columns', e);
                }
            }
        }
        return initialColumns;
    });

    // Update columns when storageKey changes
    useEffect(() => {
        if (storageKey) {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    const merged = initialColumns.map(initCol => {
                        const savedCol = parsed.find(c => c.id === initCol.id);
                        return savedCol ? { ...initCol, ...savedCol } : initCol;
                    });
                    const extraSaved = parsed.filter(sc => !initialColumns.find(ic => ic.id === sc.id));
                    const loadedCols = [...merged, ...extraSaved].sort((a, b) => {
                         const aIdx = parsed.findIndex(c => c.id === a.id);
                         const bIdx = parsed.findIndex(c => c.id === b.id);
                         if (aIdx === -1 && bIdx === -1) return 0;
                         if (aIdx === -1) return 1;
                         if (bIdx === -1) return -1;
                         return aIdx - bIdx;
                    });
                    setColumns(loadedCols);
                    return;
                } catch (e) {
                    console.error('Failed to parse saved columns', e);
                }
            }
        }
        setColumns(initialColumns);
    }, [storageKey]);

    // Save to localStorage whenever columns change
    useEffect(() => {
        if (storageKey) {
            localStorage.setItem(storageKey, JSON.stringify(columns));
        }
    }, [columns, storageKey]);

    const toggleColumn = useCallback((id) => {
        setColumns(prev => prev.map(col => 
            col.id === id ? { ...col, visible: !col.visible } : col
        ));
    }, []);

    const resizeColumn = useCallback((id, newWidth) => {
        setColumns(prev => prev.map(col => 
            col.id === id ? { ...col, width: newWidth } : col
        ));
    }, []);

    const moveColumn = useCallback((draggedId, targetId) => {
        setColumns(prev => {
            const newCols = [...prev];
            const draggedIdx = newCols.findIndex(c => c.id === draggedId);
            const targetIdx = newCols.findIndex(c => c.id === targetId);
            if (draggedIdx === -1 || targetIdx === -1) return prev;
            
            const [draggedCol] = newCols.splice(draggedIdx, 1);
            newCols.splice(targetIdx, 0, draggedCol);
            return newCols;
        });
    }, []);

    const visibleColumns = columns.filter(c => c.visible);

    return {
        columns,
        visibleColumns,
        toggleColumn,
        resizeColumn,
        moveColumn
    };
}
