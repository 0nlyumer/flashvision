import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Responsive, WidthProvider } from 'react-grid-layout/legacy';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import Layout from '../components/Layout';
import { useApp } from '../context/AppContext';
import { WidgetRegistry, getWidgetComponent } from '../components/dashboard/WidgetRegistry';
import ProductionHistoryModal from '../components/dashboard/ProductionHistoryModal';
import DocumentWarehouse from './DocumentWarehouse';
const ResponsiveGridLayout = WidthProvider(Responsive);

const getWidgetTypeFromId = (id) => {
  if (!id) return '';
  if (WidgetRegistry[id]) return id;
  const parts = id.split('_');
  if (parts.length > 0 && WidgetRegistry[parts[0]]) {
    return parts[0];
  }
  const match = Object.keys(WidgetRegistry).find(key => id.startsWith(key));
  return match || '';
};

export default function Dashboard() {
  const { state, updateDashboardLayout, updateDashboardBackground } = useApp();
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAddWidget, setShowAddWidget] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [historyType, setHistoryType] = useState('target');
  
  const [currentLayout, setCurrentLayout] = useState(state.dashboardLayout || []);

  // Subnav configuration for Dashboard module
  const tabs = [
    { id: 'overview', label: 'Overview Dashboard', icon: 'dashboard' },
    { id: 'e-files', label: 'E-Files', icon: 'shelves' }
  ];

  const [activeTab, setActiveTab] = useState('overview');
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
     const tab = searchParams.get('tab');
     if (tab && tabs.find(t => t.id === tab)) {
         setActiveTab(tab);
     }
  }, [searchParams]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  const subNavConfig = {
      title: "Dashboard",
      items: tabs,
      activeId: activeTab,
      onSelect: handleTabChange
  };
  
  useEffect(() => {
     setCurrentLayout(state.dashboardLayout || []);
  }, [state.dashboardLayout]);

  const handleLayoutChange = (layout) => {
    if (!layout || layout.length === 0) return;
    
    setCurrentLayout(prevLayout => {
      const updatedLayout = layout.map(l => {
         const existing = prevLayout.find(c => c.i === l.i) || state.dashboardLayout?.find(c => c.i === l.i);
         const type = existing?.type || l.type || getWidgetTypeFromId(l.i);
         return {
           ...existing,
           ...l,
           type
         };
      }).filter(l => l.type);
      return updatedLayout;
    });
  };

  const toggleEditMode = () => {
    if (isEditMode) {
      // Exiting edit mode, explicitly save the current layout
      updateDashboardLayout(currentLayout);
    }
    setIsEditMode(!isEditMode);
  };

  const handleAddWidget = (widgetType) => {
     const widgetMeta = WidgetRegistry[widgetType];
     if (!widgetMeta) return;
     
     const newWidget = {
       i: `${widgetType}_${Date.now()}`,
       x: 0,
       y: Infinity, // Add to bottom
       w: widgetMeta.defaultWidth,
       h: widgetMeta.defaultHeight,
       type: widgetType,
       static: false,
       ...(widgetMeta.appConfig || {})
     };
     
     const newLayout = [...currentLayout, newWidget];
     updateDashboardLayout(newLayout);
     setShowAddWidget(false);
  };

  const handleRemoveWidget = (id) => {
     const newLayout = currentLayout.filter(w => w.i !== id);
     updateDashboardLayout(newLayout);
  };

  const handleBackgroundUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateDashboardBackground(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeBackground = () => updateDashboardBackground(null);

  return (
    <Layout subNavConfig={subNavConfig} hasDashboardBackground={!!state.dashboardBackground && activeTab === 'overview'}>
      {activeTab === 'e-files' ? (
        <DocumentWarehouse insideDashboard={true} />
      ) : (
        <>
          <div className="w-full min-h-[calc(100vh-100px)] transition-all relative">
        
        <div className="relative z-10">
            {/* Header / Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 bg-surface-container-low/80 backdrop-blur-md p-4 rounded-2xl border border-outline-variant/20">
              <div>
                <h1 className="text-2xl font-black text-on-surface">Overview Dashboard</h1>
                <p className="text-xs text-on-surface-variant mt-1">Customize your workspace layout.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                {isEditMode && (
                  <>
                    <button onClick={() => setShowAddWidget(true)} className="px-4 py-2 bg-primary/10 text-primary font-bold rounded-xl text-xs hover:bg-primary/20 flex items-center gap-1 transition-colors">
                      <span className="material-symbols-outlined text-[18px]">add</span> Add Widget
                    </button>
                    <label className="px-4 py-2 bg-surface text-on-surface font-bold rounded-xl text-xs border border-outline-variant/30 hover:bg-surface-container cursor-pointer flex items-center gap-1 transition-colors">
                      <span className="material-symbols-outlined text-[18px]">image</span> Change BG
                      <input type="file" accept="image/*" className="hidden" onChange={handleBackgroundUpload} />
                    </label>
                    {state.dashboardBackground && (
                       <button onClick={removeBackground} className="px-4 py-2 bg-error/10 text-error font-bold rounded-xl text-xs hover:bg-error/20 flex items-center gap-1 transition-colors">
                          <span className="material-symbols-outlined text-[18px]">delete</span> Remove BG
                       </button>
                    )}
                  </>
                )}
                <button 
                  onClick={toggleEditMode} 
                  className={`px-6 py-2 font-bold text-sm rounded-xl transition-all shadow-sm flex items-center gap-2 ${isEditMode ? 'bg-emerald-500 text-white shadow-emerald-500/20 hover:bg-emerald-600' : 'bg-primary text-on-primary shadow-primary/20 hover:-translate-y-0.5'}`}
                >
                  <span className="material-symbols-outlined text-[18px]">{isEditMode ? 'check' : 'edit'}</span>
                  {isEditMode ? 'Save Layout' : 'Customize'}
                </button>
              </div>
            </div>
 
            {/* Grid */}
            <ResponsiveGridLayout
              className="layout"
              breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
              cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
              rowHeight={50}
              onLayoutChange={handleLayoutChange}
              isDraggable={isEditMode}
              isResizable={isEditMode}
              compactType="vertical"
              margin={[16, 16]}
            >
              {currentLayout.map(item => {
                const WidgetComponent = getWidgetComponent(item.type);
                return (
                  <div 
                    key={item.i} 
                    data-grid={item} 
                    className={`rounded-2xl shadow-sm border overflow-hidden relative group transition-all duration-300 ${
                      state.dashboardBackground 
                        ? 'widget-glass' 
                        : 'bg-surface-container-lowest border-outline-variant/20'
                    } ${isEditMode ? 'border-primary border-dashed ring-2 ring-primary/20 cursor-move' : ''}`}
                  >
                    <div className="p-4 h-full overflow-hidden">
                      <WidgetComponent 
                          {...item}
                          onShowHistory={(type) => {
                              setHistoryType(type);
                              setHistoryModalOpen(true);
                          }} 
                      />
                    </div>
                    {isEditMode && (
                      <button 
                         onClick={(e) => { e.stopPropagation(); handleRemoveWidget(item.i); }}
                         className="absolute top-2 right-2 w-6 h-6 bg-error text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-50 cursor-pointer shadow-md hover:bg-red-600"
                      >
                        <span className="material-symbols-outlined text-[14px]">close</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </ResponsiveGridLayout>
            
            {currentLayout.length === 0 && !isEditMode && (
                <div className="w-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-outline-variant/30 rounded-3xl mt-10">
                    <span className="material-symbols-outlined text-4xl text-outline-variant mb-4">dashboard_customize</span>
                    <h3 className="text-lg font-bold text-on-surface mb-2">Your Dashboard is Empty</h3>
                    <p className="text-on-surface-variant text-sm mb-4">Click customize to add widgets and build your view.</p>
                    <button onClick={() => setIsEditMode(true)} className="px-6 py-2 bg-primary text-on-primary rounded-xl font-bold text-sm">Customize Dashboard</button>
                </div>
            )}
        </div>
      </div>

      {/* Add Widget Modal */}
      {showAddWidget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container-lowest w-full max-w-lg rounded-[32px] p-6 shadow-2xl animate-slide-up">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">extension</span>
                  Widget Catalog
              </h2>
              <button onClick={() => setShowAddWidget(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors">
                 <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
               {Object.entries(WidgetRegistry).map(([key, widget]) => (
                 <div key={key} className="border border-outline-variant/30 rounded-2xl p-4 flex flex-col gap-3 hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer group" onClick={() => handleAddWidget(key)}>
                    <div className="w-10 h-10 rounded-xl bg-surface-container text-on-surface-variant flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                       <span className="material-symbols-outlined text-xl">widgets</span>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-on-surface">{widget.name}</p>
                        <p className="text-[10px] text-on-surface-variant mt-1">Add to dashboard</p>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      )}

      <ProductionHistoryModal 
          isOpen={historyModalOpen}
          onClose={() => setHistoryModalOpen(false)}
          type={historyType}
      />
        </>
      )}
    </Layout>
  );
}
