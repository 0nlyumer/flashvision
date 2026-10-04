import React, { useState, useRef, useEffect } from 'react';

const DraggableResizableHeader = ({ 
    children, 
    className = '', 
    defaultWidth, 
    minWidth = 50, 
    onResize,
    id,
    onMove,
    as: Component = 'th', 
    ...props 
}) => {
    const [width, setWidth] = useState(defaultWidth || 'auto');
    const [isResizing, setIsResizing] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const [isDraggable, setIsDraggable] = useState(false);
    
    const thRef = useRef(null);
    const startXRef = useRef(null);
    const startWidthRef = useRef(null);

    // Initialize width based on element's offsetWidth if defaultWidth is not provided
    useEffect(() => {
        if (!defaultWidth && thRef.current && width === 'auto') {
            setWidth(thRef.current.offsetWidth);
        } else if (defaultWidth && width === 'auto') {
            setWidth(defaultWidth);
        }
    }, [defaultWidth]);

    const handleMouseDown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsResizing(true);
        startXRef.current = e.pageX;
        startWidthRef.current = typeof width === 'number' ? width : thRef.current.offsetWidth;
        
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = 'col-resize';
    };

    const handleMouseMove = (e) => {
        const delta = e.pageX - startXRef.current;
        const newWidth = Math.max(minWidth, startWidthRef.current + delta);
        setWidth(newWidth);
    };

    const handleMouseUp = () => {
        setIsResizing(false);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = 'default';
        if (onResize && thRef.current) {
            onResize(id, thRef.current.offsetWidth);
        }
    };

    useEffect(() => {
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'default';
        };
    }, []);

    const handleDragStart = (e) => {
        if (isResizing) {
            e.preventDefault();
            return;
        }
        e.dataTransfer.setData('text/plain', id);
        e.dataTransfer.effectAllowed = 'move';
        // Add a slight delay before making it transparent so drag image looks okay
        setTimeout(() => {
            if (thRef.current) thRef.current.style.opacity = '0.5';
        }, 0);
    };

    const handleDragEnd = () => {
        if (thRef.current) thRef.current.style.opacity = '1';
        setIsDragOver(false);
        setIsDraggable(false); // Reset draggable state after drop
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (!isDragOver) setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        const draggedId = e.dataTransfer.getData('text/plain');
        if (draggedId && draggedId !== id && onMove) {
            onMove(draggedId, id);
        }
    };

    const cleanClassName = className.replace(/\bw-\S+/g, '').replace(/\bmin-w-\S+/g, '').trim();

    return (
        <Component 
            ref={thRef}
            draggable={!isResizing && isDraggable}
            onDoubleClick={() => setIsDraggable(true)}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            {...props}
            title={!isDraggable ? "Double-click to enable drag & drop" : "Drag to reorder"}
            className={`relative group ${cleanClassName} ${isResizing ? 'bg-surface-container-high' : ''} ${isDragOver ? 'bg-primary/10 border-l-2 border-primary' : ''} ${isDraggable ? 'cursor-grab active:cursor-grabbing border-y border-primary/50' : ''} transition-colors`}
            style={{ 
                width: width === 'auto' ? 'auto' : `${width}px`, 
                minWidth: width === 'auto' ? 'auto' : `${width}px`,
                maxWidth: width === 'auto' ? 'auto' : `${width}px`,
                whiteSpace: 'nowrap',
                ...props.style
            }}
        >
            <div className="flex items-center justify-between w-full h-full">
                <div className="flex-1 overflow-hidden text-ellipsis">
                    {children}
                </div>
            </div>
            
            <div 
                onMouseDown={handleMouseDown}
                className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                style={{ transform: 'translateX(50%)' }}
                title="Drag to resize"
            >
                <div className={`w-[2px] h-4 rounded-full transition-colors ${isResizing ? 'bg-primary' : 'bg-outline-variant group-hover:bg-primary/50'}`}></div>
            </div>
        </Component>
    );
};

export default DraggableResizableHeader;
