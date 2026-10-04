import React, { useState, useRef, useEffect } from 'react';

const ResizableHeader = ({ children, className = '', defaultWidth, minWidth = 50, onResize, as: Component = 'th', ...props }) => {
    const [width, setWidth] = useState(defaultWidth || 'auto');
    const [isResizing, setIsResizing] = useState(false);
    const thRef = useRef(null);
    const startXRef = useRef(null);
    const startWidthRef = useRef(null);

    // Initialize width based on element's offsetWidth if defaultWidth is not provided
    useEffect(() => {
        if (!defaultWidth && thRef.current && width === 'auto') {
            setWidth(thRef.current.offsetWidth);
        }
    }, [defaultWidth, width]);

    const handleMouseDown = (e) => {
        e.preventDefault(); // Prevent text selection
        e.stopPropagation();
        setIsResizing(true);
        startXRef.current = e.pageX;
        startWidthRef.current = thRef.current.offsetWidth;
        
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        // Add a global cursor style during resize
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
            onResize(thRef.current.offsetWidth);
        }
    };

    // Clean up event listeners on unmount
    useEffect(() => {
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'default';
        };
    }, []);

    // Combine incoming classNames with our internal classes.
    // We remove any incoming 'w-...' or 'min-w-...' classes to let our dynamic width take over.
    const cleanClassName = className.replace(/\bw-\S+/g, '').replace(/\bmin-w-\S+/g, '').trim();

    return (
        <Component 
            ref={thRef}
            {...props}
            className={`relative group ${cleanClassName} ${isResizing ? 'bg-surface-container-high' : ''}`}
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
            
            {/* The Resize Handle */}
            <div 
                onMouseDown={handleMouseDown}
                className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                style={{ transform: 'translateX(50%)' }} // Center the handle over the border
                title="Drag to resize"
            >
                <div className={`w-[2px] h-4 rounded-full transition-colors ${isResizing ? 'bg-primary' : 'bg-outline-variant group-hover:bg-primary/50'}`}></div>
            </div>
        </Component>
    );
};

export default ResizableHeader;
