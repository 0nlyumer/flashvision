import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import useDynamicColumns from '../../hooks/useDynamicColumns';
import DraggableResizableHeader from '../ui/DraggableResizableHeader';

export default function DelDashboard({ setActiveTab }) {
  const { state } = useApp();
  const [viewMode, setViewMode] = useState('Order Wise'); // 'Order Wise' | 'Item Wise'

  const saleOrders = state?.saleOrders || [];

  // Calculate global metrics
  // Total Dispatches can be fetched from delivery records once implemented. For now, 0 or mock.
  const totalDispatches = state?.deliveries?.length || 0; 
  
  // Pending Challans: Orders where SOME items have producedQty > 0 but deliveredQty < quantity
  const pendingChallansCount = saleOrders.filter(o => {
      const hasProduced = o.items.some(i => (i.producedQty || 0) > 0);
      const isFullyDelivered = o.items.every(i => (i.deliveredQty || 0) >= parseFloat(i.quantity || 0));
      return hasProduced && !isFullyDelivered;
  }).length;

  const completedOrdersCount = saleOrders.filter(o => {
      // Order is complete if all items have producedQty >= quantity AND deliveredQty >= quantity
      // Assuming for delivery "Complete" means fully dispatched.
      return o.items.length > 0 && o.items.every(i => (i.deliveredQty || 0) >= parseFloat(i.quantity || 0));
  }).length;

  // Define static columns based on viewMode
  const orderColumns = [
    { id: 'orderId', label: 'Order ID', width: 200, isVisible: true },
    { id: 'customer', label: 'Customer', width: 250, isVisible: true },
    { id: 'date', label: 'Order Date', width: 150, isVisible: true },
    { id: 'completion', label: 'Completion', width: 200, isVisible: true },
    { id: 'dispatch', label: 'Dispatch', width: 200, isVisible: true },
  ];

  const itemColumns = [
    { id: 'itemDetails', label: 'Item Details', width: 250, isVisible: true },
    { id: 'customer', label: 'Customer', width: 200, isVisible: true },
    { id: 'orderId', label: 'Order ID', width: 150, isVisible: true },
    { id: 'completion', label: 'Completion', width: 200, isVisible: true },
    { id: 'dispatch', label: 'Dispatch', width: 200, isVisible: true },
  ];

  const {
      columns,
      handleResizeItem,
      handleReorderItem
  } = useDynamicColumns(viewMode === 'Order Wise' ? orderColumns : itemColumns, viewMode === 'Order Wise' ? 'deliveryDashboardOrderColumns' : 'deliveryDashboardItemColumns');

  return (
    <div className="space-y-10 w-full animate-in fade-in duration-500 pb-24">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface font-headline">Delivery Dashboard</h1>
          <p className="text-on-surface-variant mt-1 text-sm">Managing total dispatches in the current fiscal month.</p>
        </div>
        <button 
          onClick={() => {
              if(setActiveTab) setActiveTab('dc_creation');
          }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-xl font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-95 transition-all">
          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 0" }}>add_circle</span>
          <span>Create New Challan</span>
        </button>
      </div>

      {/* KPI Section: High Level Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Dispatches */}
        <div className="bg-surface-container-lowest p-6 rounded-3xl xl:rounded-full asymmetric-shadow border border-white/50 group hover:-translate-y-1 hover:shadow-[0_25px_50px_rgba(0,28,56,0.08)] transition-all">
          <div className="flex justify-between items-start mb-4 px-2 xl:px-4 pt-2 xl:pt-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>package_2</span>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">+12.5%</span>
          </div>
          <div className="px-2 xl:px-4 pb-2 xl:pb-4 text-center xl:text-left">
            <p className="text-on-surface-variant text-sm font-medium">Total Dispatches</p>
            <h3 className="text-4xl font-extrabold text-on-surface mt-1">{totalDispatches}</h3>
          </div>
        </div>

        {/* Pending Challans */}
        <div className="bg-surface-container-lowest p-6 rounded-3xl xl:rounded-full asymmetric-shadow border border-white/50 group hover:-translate-y-1 hover:shadow-[0_25px_50px_rgba(0,28,56,0.08)] transition-all">
          <div className="flex justify-between items-start mb-4 px-2 xl:px-4 pt-2 xl:pt-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>pending_actions</span>
            </div>
            <span className="text-xs font-bold text-tertiary bg-tertiary-fixed px-2 py-1 rounded-lg">Critical</span>
          </div>
          <div className="px-2 xl:px-4 pb-2 xl:pb-4 text-center xl:text-left">
            <p className="text-on-surface-variant text-sm font-medium">Pending Challans</p>
            <h3 className="text-4xl font-extrabold text-on-surface mt-1">{pendingChallansCount}</h3>
          </div>
        </div>

        {/* Completed Orders */}
        <div className="bg-surface-container-lowest p-6 rounded-3xl xl:rounded-full asymmetric-shadow border border-white/50 group hover:-translate-y-1 hover:shadow-[0_25px_50px_rgba(0,28,56,0.08)] transition-all">
          <div className="flex justify-between items-start mb-4 px-2 xl:px-4 pt-2 xl:pt-4">
            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-700">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>task_alt</span>
            </div>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">Target: 95%</span>
          </div>
          <div className="px-2 xl:px-4 pb-2 xl:pb-4 text-center xl:text-left">
            <p className="text-on-surface-variant text-sm font-medium">Completed Orders</p>
            <h3 className="text-4xl font-extrabold text-on-surface mt-1">{completedOrdersCount}</h3>
          </div>
        </div>
      </div>

      {/* Main Data Grid */}
      <div className="grid grid-cols-12 gap-8">
        {/* Left Column (8 cols) - Chart & Detailed List */}
        <div className="col-span-12 lg:col-span-8 space-y-8">

          {/* Completed Sale Orders List replacing Finished Items */}
          <div className="bg-surface-container-lowest rounded-[2rem] asymmetric-shadow border border-white/50 overflow-hidden">
            <div className="p-6 border-b border-surface-container-low flex justify-between items-center bg-surface-container/20">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-6 bg-primary rounded-full"></div>
                 <h4 className="text-lg font-bold text-on-surface font-headline">Completed Sale Orders</h4>
              </div>
              
              <div className="bg-surface-container-high rounded-lg p-1 flex">
                 <button 
                    className={`px-4 py-1.5 rounded-md text-xs font-bold transition-colors ${viewMode === 'Order Wise' ? 'bg-primary text-white shadow' : 'text-on-surface-variant hover:text-on-surface'}`}
                    onClick={() => setViewMode('Order Wise')}
                 >
                     Order Wise
                 </button>
                 <button 
                    className={`px-4 py-1.5 rounded-md text-xs font-bold transition-colors ${viewMode === 'Item Wise' ? 'bg-primary text-white shadow' : 'text-on-surface-variant hover:text-on-surface'}`}
                    onClick={() => setViewMode('Item Wise')}
                 >
                     Item Wise
                 </button>
              </div>
            </div>
            
            <div className="overflow-x-auto min-h-[400px]">
              <table className="w-full text-left table-fixed">
                <thead className="text-[10px] uppercase tracking-widest text-slate-400 font-bold border-b border-outline-variant/10">
                  <tr>
                    {columns.filter(col => col.isVisible).map((col, index) => (
                        <DraggableResizableHeader
                            key={col.id}
                            id={col.id}
                            defaultWidth={col.width}
                            onResize={handleResizeItem}
                            onMove={handleReorderItem}
                            className="px-6 py-4"
                        >
                            {col.label}
                        </DraggableResizableHeader>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-low text-sm">
                  {viewMode === 'Item Wise' ? (
                      saleOrders.filter(o => o.status !== 'Deleted').flatMap(order => 
                          order.items.filter(i => (i.producedQty || 0) > 0).map(item => {
                              const qty = parseFloat(item.quantity || 0);
                              const prod = parseFloat(item.producedQty || 0);
                              const disp = parseFloat(item.deliveredQty || 0);
                              const compPercent = qty > 0 ? Math.min(100, Math.round((prod / qty) * 100)) : 0;
                              const dispPercent = qty > 0 ? Math.min(100, Math.round((disp / qty) * 100)) : 0;

                              const customer = state.customers.find(c => c.id === order.customerId);
                              const customerName = customer ? customer.name : (order.customerName || order.customer || 'Unknown Customer');
                              const product = state.items.find(i => i.id === item.itemId || i.sku === item.itemCode);
                              const productName = product ? product.name : (item.productName || 'Unknown Item');

                              return (
                                <tr key={`${order.id}-${item.itemCode}`} className="hover:bg-surface/50 transition-colors group">
                                  {columns.map(col => {
                                      if (!col.isVisible) return null;
                                      if (col.id === 'itemDetails') return (
                                          <td key={col.id} className="px-6 py-6 truncate" style={{ width: col.width }}>
                                              <p className="font-bold text-on-surface mb-1 truncate">{productName}</p>
                                              <p className="text-xs text-on-surface-variant truncate">{item.itemCode}</p>
                                          </td>
                                      );
                                      if (col.id === 'customer') return <td key={col.id} className="px-6 py-6 font-bold text-on-surface uppercase truncate" style={{ width: col.width }}>{customerName}</td>;
                                      if (col.id === 'orderId') return <td key={col.id} className="px-6 py-6 font-medium text-slate-500 truncate" style={{ width: col.width }}>{order.id}</td>;
                                      if (col.id === 'completion') return (
                                          <td key={col.id} className="px-6 py-6" style={{ width: col.width }}>
                                              <div className="flex justify-between items-end mb-1">
                                                  <span className="text-xs font-bold text-primary">{compPercent}%</span>
                                                  <span className="text-[10px] font-medium text-slate-400">{prod} Units</span>
                                              </div>
                                              <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                                                  <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${compPercent}%` }}></div>
                                              </div>
                                          </td>
                                      );
                                      if (col.id === 'dispatch') return (
                                          <td key={col.id} className="px-6 py-6" style={{ width: col.width }}>
                                              <div className="flex justify-between items-end mb-1">
                                                  <span className="text-xs font-bold text-tertiary">{dispPercent}%</span>
                                                  <span className="text-[10px] font-medium text-slate-400">{disp} Units</span>
                                              </div>
                                              <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                                                  <div className="bg-tertiary h-full rounded-full transition-all" style={{ width: `${dispPercent}%` }}></div>
                                              </div>
                                          </td>
                                      );
                                      return null;
                                  })}
                                </tr>
                              );
                          })
                      )
                  ) : (
                      saleOrders.filter(o => o.status !== 'Deleted' && o.items.some(i => (i.producedQty || 0) > 0)).map(order => {
                          const totalOrdered = order.items.reduce((sum, item) => sum + parseFloat(item.quantity || 0), 0);
                          const totalProduced = order.items.reduce((sum, item) => sum + parseFloat(item.producedQty || 0), 0);
                          const totalDispatched = order.items.reduce((sum, item) => sum + parseFloat(item.deliveredQty || 0), 0);
                          
                          const compPercent = totalOrdered > 0 ? Math.min(100, Math.round((totalProduced / totalOrdered) * 100)) : 0;
                          const dispPercent = totalOrdered > 0 ? Math.min(100, Math.round((totalDispatched / totalOrdered) * 100)) : 0;

                          const customer = state.customers.find(c => c.id === order.customerId);
                          const customerName = customer ? customer.name : (order.customerName || order.customer || 'Unknown Customer');
                          const productNames = order.items.map(item => {
                              const product = state.items.find(i => i.id === item.itemId || i.sku === item.itemCode);
                              return product ? product.name : (item.productName || 'Unknown Item');
                          }).join(', ');

                          return (
                          <tr key={order.id} className="hover:bg-surface/50 transition-colors group">
                             {columns.map(col => {
                                 if (!col.isVisible) return null;
                                 if (col.id === 'orderId') return (
                                     <td key={col.id} className="px-6 py-6 truncate" style={{ width: col.width }}>
                                         <p className="font-bold text-on-surface mb-1 truncate">Order {order.id}</p>
                                         <p className="text-xs text-on-surface-variant truncate">{productNames}</p>
                                     </td>
                                 );
                                 if (col.id === 'customer') return <td key={col.id} className="px-6 py-6 font-bold text-on-surface uppercase truncate" style={{ width: col.width }}>{customerName}</td>;
                                 if (col.id === 'date') return <td key={col.id} className="px-6 py-6 font-medium text-slate-500 truncate" style={{ width: col.width }}>{order.date || 'N/A'}</td>;
                                 if (col.id === 'completion') return (
                                     <td key={col.id} className="px-6 py-6" style={{ width: col.width }}>
                                         <div className="flex justify-between items-end mb-1">
                                             <span className="text-xs font-bold text-primary">{compPercent}%</span>
                                             <span className="text-[10px] font-medium text-slate-400">{totalProduced} Units</span>
                                         </div>
                                         <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                                             <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${compPercent}%` }}></div>
                                         </div>
                                     </td>
                                 );
                                 if (col.id === 'dispatch') return (
                                     <td key={col.id} className="px-6 py-6" style={{ width: col.width }}>
                                         <div className="flex justify-between items-end mb-1">
                                             <span className="text-xs font-bold text-tertiary">{dispPercent}%</span>
                                             <span className="text-[10px] font-medium text-slate-400">{totalDispatched} Units</span>
                                         </div>
                                         <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                                             <div className="bg-tertiary h-full rounded-full transition-all" style={{ width: `${dispPercent}%` }}></div>
                                         </div>
                                     </td>
                                 );
                                 return null;
                             })}
                          </tr>
                      )})
                  )}
                  
                  {saleOrders.filter(o => o.status !== 'Deleted' && o.items.some(i => (i.producedQty || 0) > 0)).length === 0 && (
                      <tr>
                          <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                              No Completed Output Found.
                          </td>
                      </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Active Production Flow Section: Right Column (4 cols) */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <div className="bg-surface-container-lowest p-6 xl:p-8 rounded-[2rem] asymmetric-shadow border border-white/50 h-full">
            <div className="flex justify-between items-center mb-8 border-b border-surface-container-low pb-4">
              <h4 className="text-lg font-bold text-on-surface font-headline">Active Production Flow</h4>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
            </div>

            <div className="space-y-8">
              {saleOrders.filter(o => o.status !== 'Deleted' && o.items.some(i => (i.producedQty || 0) > 0) && o.items.some(i => (i.producedQty || 0) < parseFloat(i.quantity || 0))).slice(0, 5).map(order => {
                  const totalOrdered = order.items.reduce((sum, item) => sum + parseFloat(item.quantity || 0), 0);
                  const totalProduced = order.items.reduce((sum, item) => sum + parseFloat(item.producedQty || 0), 0);
                  const compPercent = totalOrdered > 0 ? Math.min(100, Math.round((totalProduced / totalOrdered) * 100)) : 0;
                  
                  return (
                  <div key={order.id} className="space-y-3 relative group">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">{order.id}</p>
                        <p className="text-sm font-semibold text-on-surface mt-0.5 group-hover:text-primary transition-colors truncate max-w-[150px]">{order.items[0]?.productName || 'Multiple Items'}</p>
                      </div>
                      <p className="text-xs font-black text-primary">{compPercent}%</p>
                    </div>
                    <div className="w-full h-2 bg-surface-container-low rounded-full overflow-hidden border border-outline-variant/10">
                      <div className="h-full bg-primary rounded-full transition-all duration-1000 ease-in-out" style={{ width: `${compPercent}%` }}></div>
                    </div>
                    <p className="text-[10px] font-bold text-on-surface-variant flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                      <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 0" }}>inventory</span>
                      {totalProduced}/{totalOrdered} Items Ready
                    </p>
                  </div>
              )})}
              
              {saleOrders.filter(o => o.status !== 'Deleted' && o.items.some(i => (i.producedQty || 0) > 0) && o.items.some(i => (i.producedQty || 0) < parseFloat(i.quantity || 0))).length === 0 && (
                  <p className="text-sm text-slate-400 text-center py-8">No active production flow.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
