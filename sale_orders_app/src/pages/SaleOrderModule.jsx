import React, { useState, useMemo, useRef, useEffect } from 'react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

// Reusable status badge with popup for cancellation
const StatusBadgeWithAction = ({ orderId, itemCode, status, updateStatus }) => {
  const [showPopup, setShowPopup] = useState(false);
  const badgeRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (badgeRef.current && !badgeRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCancelClick = () => {
    updateStatus(orderId, itemCode, 'Cancelled');
    setShowPopup(false);
  }

  const getStatusColor = (s) => {
    switch (s) {
      case 'Completed':
      case 'Ready': return 'bg-green-100 text-green-700';
      case 'In Process':
      case 'In Production': return 'bg-blue-100 text-blue-700';
      case 'Pending': return 'bg-amber-100 text-amber-700';
      case 'Dispatched': return 'bg-slate-100 text-slate-700';
      case 'Cancelled': return 'bg-red-100 text-red-700 decoration-red-700';
      default: return 'bg-surface-variant text-on-surface-variant';
    }
  };

  return (
    <div className="relative inline-block" ref={badgeRef} onMouseEnter={() => setShowPopup(true)} onMouseLeave={() => setShowPopup(false)}>
      <span className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors ${getStatusColor(status)}`}>
        {status?.toUpperCase()}
      </span>
      {/* Cancel Popup */}
      {showPopup && status !== 'Cancelled' && status !== 'Completed' && status !== 'Dispatched' && (
        <div className="absolute z-20 top-full mt-1 left-1/2 -translate-x-1/2 w-32 bg-white rounded-lg shadow-xl border border-red-100 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <button 
            type="button" 
            onClick={handleCancelClick}
            className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[16px]">cancel</span>
            {itemCode ? 'Cancel Item' : 'Cancel Order'}
          </button>
        </div>
      )}
    </div>
  );
};

export default function SaleOrderModule() {
  const navigate = useNavigate();
  const { state, addSaleOrder, updateSaleOrderItemStatus } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const tabs = ['dashboard', 'create', 'history'];

  const handlePrevTab = () => {
    const currentIndex = tabs.indexOf(activeTab);
    const prevIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
    setActiveTab(tabs[prevIndex]);
  };
  
  const handleNextTab = () => {
    const currentIndex = tabs.indexOf(activeTab);
    const nextIndex = currentIndex === tabs.length - 1 ? 0 : currentIndex + 1;
    setActiveTab(tabs[nextIndex]);
  };
  
  // --- Dashboard Logic ---
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState({
     Pending: true, 'In Process': true, Ready: true, Dispatched: true, Completed: true, Cancelled: true
  });
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const statusFilterRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (statusFilterRef.current && !statusFilterRef.current.contains(event.target)) {
        setShowStatusFilter(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStatusFilterChange = (status) => {
    setStatusFilter(prev => ({ ...prev, [status]: !prev[status] }));
  };

  const [dashboardView, setDashboardView] = useState('order-wise'); // 'order-wise' | 'item-wise'
  const [showExportMenu, setShowExportMenu] = useState(false);

  const filteredOrders = state.saleOrders.filter(order => {
    const customer = state.customers.find(c => c.id === order.customerId)?.name || '';
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter[order.status] === true;
    return matchesSearch && matchesStatus;
  });

  const flattenedItems = useMemo(() => {
    const allItems = [];
    filteredOrders.forEach(order => {
      const customer = state.customers.find(c => c.id === order.customerId)?.name || 'Unknown';
      order.items.forEach(item => {
        if (statusFilter[item.status] === true) {
          allItems.push({
            orderId: order.id,
            orderDate: order.date,
            customerName: customer,
            ...item
          });
        }
      });
    });
    return allItems;
  }, [filteredOrders, state.customers, statusFilter]);

  const activeSaleOrders = state.saleOrders.filter(o => o.status !== 'Deleted');
  const totalOrders = activeSaleOrders.length;
  
  const processingCount = activeSaleOrders.filter(o => {
     // Order is in processing only if it exists in a production plan
     const inProduction = state.productionPlans?.some(plan => plan.orderId === o.id);
     return inProduction && (o.status === 'Processing' || o.status === 'In Process' || o.status === 'Pending' || o.status === 'In Production');
  }).length;
  
  const totalRevenue = useMemo(() => {
     let rev = 0;
     activeSaleOrders.forEach(o => {
         if(o.status !== 'Cancelled') {
             o.items.forEach(i => { if(i.status !== 'Cancelled' && i.status !== 'Deleted') rev += (i.quantity * i.price) })
         }
     }); 
     return rev.toLocaleString(undefined, {minimumFractionDigits: 2});
  }, [activeSaleOrders]);

  const handleQuickReport = (format) => {
     let content = "";
     if (format === 'csv') {
         if (dashboardView === 'order-wise') {
             content = "Order ID,Customer,Date,Status,Total Value\n";
             content += filteredOrders.map(o => {
                 const customer = state.customers.find(c => c.id === o.customerId)?.name || '';
                 const val = o.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
                 return `"${o.id}","${customer}","${o.date}","${o.status}","${val}"`;
             }).join('\n');
         } else {
             content = "Item Code,Order ID,Product,Qty,Status,Value\n";
             content += flattenedItems.map(i => {
                 const product = state.items.find(x => x.id === i.itemId)?.name || '';
                 return `"${i.itemCode}","${i.orderId}","${product}","${i.quantity}","${i.status}","${i.quantity * i.price}"`;
             }).join('\n');
         }
     } else {
         content = "PDF EXPORT MOCK\nThis generates a PDF payload for order info.";
     }
     const encodedUri = encodeURI(`data:text/${format};charset=utf-8,${content}`);
     const link = document.createElement("a");
     link.setAttribute("href", encodedUri);
     link.setAttribute("download", `Quick_Report.${format}`);
     document.body.appendChild(link);
     link.click();
     link.remove();
     setShowExportMenu(false);
  };

  // --- Print Editable Modal Logic ---
  const [printOrder, setPrintOrder] = useState(null);

  // --- Creation Logic ---
  const getNextOrderId = () => `SO-${String(state.saleOrders.length + 1).padStart(3, '0')}`;

  const [orderMeta, setOrderMeta] = useState({
    id: getNextOrderId(),
    date: new Date().toISOString().split('T')[0],
    status: 'Pending',
    type: 'Standard',
    customerId: state.customers[0]?.id || '',
    shippingAddress: '',
    expectedDelivery: '',
    notes: '',
    paymentTerms: 'Net 30',
    salesperson: 'Alexander Pierce'
  });

  // Re-sync ID on mount in case it shifted
  useEffect(() => {
      setOrderMeta(prev => ({ ...prev, id: getNextOrderId() }));
  }, [state.saleOrders.length]);

  const [items, setItems] = useState([
    {
      id: Date.now(),
      itemCode: `${getNextOrderId()}-ITM-001`,
      itemId: '',
      qty: 1,
      rolls: 1, // New field for rolls
      price: 0,
      discount: 0,
      remarks: ""
    }
  ]);

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + ((item.qty * item.price) - (item.discount || 0)), 0), [items]);

  const handleMetaChange = (field, value) => {
    setOrderMeta(prev => ({ ...prev, [field]: value }));
  };

  const handleItemChange = (id, field, value) => {
    setItems(items.map(item => {
      if(item.id === id) {
          let updated = { ...item, [field]: value };
          if (field === 'itemId') {
              const selectedProd = state.items.find(i => i.id === value);
              const prodPrice = selectedProd ? (selectedProd.price || parseFloat(selectedProd.price.replace(/[^\d.]/g, '')) || 0) : 0;
              updated.itemId = value;
              updated.price = prodPrice;
              const rollSz = selectedProd?.rollSize || selectedProd?.packingSize || 0;
              if (rollSz > 0) updated.rolls = Math.ceil(updated.qty / rollSz);
          }
          if (field === 'qty') {
               const selectedProd = state.items.find(i => i.id === updated.itemId);
               const rollSz = selectedProd?.rollSize || selectedProd?.packingSize || 0;
               if (rollSz > 0) updated.rolls = Math.ceil(value / rollSz);
          }
          return updated;
      }
      return item;
    }));
  };

  const addNewItem = () => {
    // Find highest ITM index to avoid repeats
    let maxIdx = 0;
    items.forEach(it => {
        const match = it.itemCode.match(/-ITM-(\d+)$/);
        if (match) {
            const idx = parseInt(match[1], 10);
            if (idx > maxIdx) maxIdx = idx;
        }
    });

    const newItemCode = `${orderMeta.id}-ITM-${String(maxIdx + 1).padStart(3, '0')}`;
    setItems([...items, {
      id: Date.now(),
      itemCode: newItemCode,
      itemId: "",
      qty: 1,
      rolls: 1,
      price: 0.00,
      discount: 0.00,
      remarks: ""
    }]);
  };

  const handleEditOrder = (order) => {
    setOrderMeta({
       id: order.id,
       date: order.date,
       status: order.status,
       type: order.type || 'Standard',
       customerId: order.customerId,
       shippingAddress: order.shippingAddress || '',
       expectedDelivery: order.expectedDelivery || '',
       notes: order.notes || '',
       paymentTerms: order.paymentTerms || 'Net 30',
       salesperson: order.salesperson || 'Alexander Pierce'
    });
    setItems(order.items.map(it => ({
       id: Date.now() + Math.random(),
       itemCode: it.itemCode,
       itemId: it.itemId,
       qty: it.quantity || it.qty,
       rolls: it.rolls || 1,
       price: it.price || 0,
       discount: it.discount || 0,
       remarks: it.remarks || ""
    })));
    setActiveTab('create');
  };

  const removeItem = (id) => {
    if (items.length > 1) {
      // Do not re-number existing itemCodes to prevent repeats
      const newItems = items.filter(item => item.id !== id);
      setItems(newItems);
    } else {
      alert("At least one line item is required.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!orderMeta.customerId) {
        alert("Please select a customer.");
        return;
    }
    const invalidItem = items.find(i => !i.itemId || i.qty <= 0);
    if(invalidItem) {
        alert("Please select valid items and quantities greater than zero.");
        return;
    }

    const newOrder = {
      ...orderMeta,
      items: items.map(i => ({
        itemCode: i.itemCode,
        itemId: i.itemId,
        quantity: i.qty,
        rolls: i.rolls,
        status: 'Pending',
        producedQty: 0,
        deliveredQty: 0, 
        price: i.price
      }))
    };

    addSaleOrder(newOrder);
    alert(`Order ${orderMeta.id} submitted successfully!`);
    
    // Reset form and switch tab
    const nextId = `SO-${String(state.saleOrders.length + 2).padStart(3, '0')}`;
    setOrderMeta({
        ...orderMeta,
        id: nextId,
    });
    setItems([{
        id: Date.now(),
        itemCode: `${nextId}-ITM-001`, 
        itemId: '',
        qty: 1,
        rolls: 1,
        price: 0,
        remarks: ""
    }]);
    setActiveTab('dashboard');
  };

  // Item Search State Handlers (for Inline Searchable Dropdown)
  const [activeSearchId, setActiveSearchId] = useState(null);
  const [searchQueries, setSearchQueries] = useState({});
  const searchDropdownRef = useRef(null);

  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [showCustSearch, setShowCustSearch] = useState(false);
  const custSearchRef = useRef(null);

  useEffect(() => {
    const handleClickOutsideItem = (event) => {
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target)) {
        setActiveSearchId(null);
      }
      if (custSearchRef.current && !custSearchRef.current.contains(event.target)) {
        setShowCustSearch(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideItem);
    return () => document.removeEventListener('mousedown', handleClickOutsideItem);
  }, []);

  // History Tab Filters
  const [histCust, setHistCust] = useState('');
  const [histDate, setHistDate] = useState('');
  const [histSO,   setHistSO] = useState('');

  const filteredHistory = state.saleOrders.slice().reverse().filter(order => {
     const c = state.customers.find(cx => cx.id === order.customerId)?.name || '';
     return (
         (!histCust || c.toLowerCase().includes(histCust.toLowerCase())) &&
         (!histDate || order.date === histDate) &&
         (!histSO || order.id.toLowerCase().includes(histSO.toLowerCase()))
     );
  });

  return (
    <div className="print:m-0 print:p-0">
      
    {/* PRINT MODAL (Invoice view) */}
    {printOrder && (
       <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-8 print:static print:bg-white print:p-0 print:block">
         <div className="bg-white rounded-2xl p-10 w-full max-w-5xl max-h-[90vh] overflow-y-auto print:max-h-none print:shadow-none print:rounded-none">
            <div className="flex justify-between items-start mb-10 print:mb-6 border-b pb-6">
               <div>
                  <h1 className="text-4xl font-extrabold text-[#004277]">SALE ORDER / INVOICE</h1>
                  <input className="mt-2 bg-transparent text-sm font-semibold border-b border-dashed border-gray-300 focus:outline-none min-w-[300px]" defaultValue="Original for Recipient" />
               </div>
               <div className="text-right">
                  <p className="text-2xl font-bold text-gray-800">{printOrder.id}</p>
                  <p className="text-sm text-gray-500">Date: {new Date(printOrder.date).toLocaleDateString()}</p>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-10 mb-8">
               <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Bill To:</h3>
                  <p className="font-bold text-lg text-gray-800">{state.customers.find(c => c.id === printOrder.customerId)?.name}</p>
                  <textarea rows="3" className="w-full mt-2 p-2 border rounded resize-none text-sm" defaultValue={printOrder.shippingAddress || "No shipping address provided."} />
               </div>
               <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Order Details:</h3>
                  <div className="space-y-2 text-sm">
                     <div className="flex justify-between"><span className="text-gray-500">Salesperson:</span> <input className="font-medium text-right border-b border-dashed border-gray-300 px-1 focus:outline-none" defaultValue={printOrder.salesperson} /></div>
                     <div className="flex justify-between"><span className="text-gray-500">Terms:</span> <input className="font-medium text-right border-b border-dashed border-gray-300 px-1 focus:outline-none" defaultValue={printOrder.paymentTerms} /></div>
                     <div className="flex justify-between"><span className="text-gray-500">Delivery:</span> <span className="font-medium">{printOrder.expectedDelivery || 'N/A'}</span></div>
                  </div>
               </div>
            </div>

            <table className="w-full text-left border-collapse mb-8 table-auto">
               <thead>
                 <tr className="bg-gray-100">
                   <th className="p-3 text-xs font-bold uppercase text-gray-600">Item Code</th>
                   <th className="p-3 text-xs font-bold uppercase text-gray-600">Description</th>
                   <th className="p-3 text-xs font-bold uppercase text-gray-600 text-right">Rolls</th>
                   <th className="p-3 text-xs font-bold uppercase text-gray-600 text-right">Meters</th>
                   <th className="p-3 text-xs font-bold uppercase text-gray-600 text-right">Rate</th>
                   <th className="p-3 text-xs font-bold uppercase text-gray-600 text-right">Amount (PKR)</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-200">
                  {printOrder.items.map(it => {
                     const p = state.items.find(x => x.id === it.itemId);
                     return (
                       <tr key={it.itemCode}>
                          <td className="p-3 text-sm font-bold text-gray-800">{it.itemCode}</td>
                          <td className="p-3 text-sm text-gray-600">{p?.name || 'Unknown'}</td>
                          <td className="p-3 text-sm text-right font-medium">{it.rolls || '-'}</td>
                          <td className="p-3 text-sm text-right font-medium">{it.quantity || '-'}</td>
                          <td className="p-3 text-sm text-right font-medium">{it.price}</td>
                          <td className="p-3 text-sm text-right font-bold text-gray-800">{(it.quantity * it.price).toLocaleString()}</td>
                       </tr>
                     );
                  })}
               </tbody>
            </table>

            <div className="flex justify-end">
               <div className="w-64 space-y-3">
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal:</span> <span className="font-bold text-gray-800">{printOrder.items.reduce((a,b)=>a+(b.quantity*b.price),0).toLocaleString()}</span></div>
                  <div className="flex justify-between text-sm items-center"><span className="text-gray-500">Discount:</span> <input type="text" defaultValue="0.00" className="w-24 text-right border-b focus:outline-none"/></div>
                  <div className="flex justify-between text-lg font-extrabold pt-2 border-t"><span className="text-gray-800">Total:</span> <span>{printOrder.items.reduce((a,b)=>a+(b.quantity*b.price),0).toLocaleString()}</span></div>
               </div>
            </div>

            <div className="mt-10 flex justify-between items-end print:hidden">
               <button onClick={() => setPrintOrder(null)} className="px-6 py-2 text-red-600 font-bold hover:bg-red-50 rounded transition-colors">Close Viewer</button>
               <button onClick={() => window.print()} className="px-8 py-3 bg-[#004277] text-white font-bold rounded-lg shadow-lg flex items-center gap-2 hover:bg-[#003058] transition-colors">
                  <span className="material-symbols-outlined">print</span> Print Document
               </button>
            </div>
         </div>
       </div>
    )}

    {/* MAIN APP (hidden during print) */}
    <div className="print:hidden">
    <Layout>
      {/* Navigation Tabs */}
      <div className="flex border-b border-outline-variant/20 mb-8 gap-6 animate-in slide-in-from-top-4 duration-500">
        <button 
           className={`pb-4 font-bold tracking-widest text-sm uppercase transition-all ${activeTab === 'dashboard' ? 'border-b-[3px] border-primary text-primary' : 'text-slate-400 hover:text-slate-600'}`}
           onClick={() => setActiveTab('dashboard')}
        >Dashboard</button>
        <button 
           className={`pb-4 font-bold tracking-widest text-sm uppercase transition-all ${activeTab === 'create' ? 'border-b-[3px] border-primary text-primary' : 'text-slate-400 hover:text-slate-600'}`}
           onClick={() => setActiveTab('create')}
        >Create Sale Order</button>
        <button 
           className={`pb-4 font-bold tracking-widest text-sm uppercase transition-all ${activeTab === 'history' ? 'border-b-[3px] border-primary text-primary' : 'text-slate-400 hover:text-slate-600'}`}
           onClick={() => setActiveTab('history')}
        >Order History</button>
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-8 animate-in fade-in duration-500 slide-in-from-bottom-4">
          {/* Header Section with Arrows */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex gap-1 mr-2">
                <button onClick={handlePrevTab} className="w-9 h-9 flex items-center justify-center bg-surface hover:bg-surface-container-low rounded-lg border border-outline-variant/30 text-slate-500 hover:text-primary transition-all shadow-sm"><span className="material-symbols-outlined text-[18px]">arrow_back</span></button>
                <button onClick={handleNextTab} className="w-9 h-9 flex items-center justify-center bg-surface hover:bg-surface-container-low rounded-lg border border-outline-variant/30 text-slate-500 hover:text-primary transition-all shadow-sm"><span className="material-symbols-outlined text-[18px]">arrow_forward</span></button>
              </div>
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight text-on-surface font-headline">All Sale Orders</h1>
                <p className="text-on-surface-variant mt-2 max-w-lg font-body">Manage, track, and monitor your global sales pipeline with real-time logistics intelligence.</p>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-3">
              {/* History Quick Access Button */}
              <button 
                onClick={() => setActiveTab('history')}
                className="bg-surface-container hover:bg-surface-container-high text-on-surface text-sm font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-2 border border-outline-variant/20 shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">history</span>
                Sale Order History
              </button>

              {/* VIEW MODE TOGGLE BUTTONS */}
              <div className="flex p-1 bg-surface-container-low rounded-xl border border-outline-variant/20 shadow-sm">
                <button 
                  onClick={() => setDashboardView('order-wise')}
                  className={`px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${dashboardView === 'order-wise' ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                  Order Wise
                </button>
                <button 
                  onClick={() => setDashboardView('item-wise')}
                  className={`px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${dashboardView === 'item-wise' ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <span className="material-symbols-outlined text-[18px]">category</span>
                  Item Wise
                </button>
              </div>
            </div>
          </div>
          
          {/* Bento Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_20px_40px_rgba(0,28,56,0.04)] border border-outline-variant/10 group hover:-translate-y-1 transition-transform">
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">Total Orders</p>
              <p className="text-3xl font-extrabold text-primary">{totalOrders}</p>
              <div className="mt-4 flex items-center text-xs text-green-600 font-semibold">
                <span className="material-symbols-outlined text-sm mr-1">trending_up</span> +12% from last month
              </div>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_20px_40px_rgba(0,28,56,0.04)] border border-outline-variant/10 group hover:-translate-y-1 transition-transform">
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">Processing</p>
              <p className="text-3xl font-extrabold text-on-surface">{processingCount}</p>
              <div className="mt-4 flex items-center text-xs text-secondary font-semibold">
                <span className="material-symbols-outlined text-sm mr-1">pending</span> Average 2.4 hrs
              </div>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_20px_40px_rgba(0,28,56,0.04)] border border-outline-variant/10 group hover:-translate-y-1 transition-transform">
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">Revenue (Total)</p>
              <p className="text-3xl font-extrabold text-tertiary">{totalRevenue}</p>
              <div className="mt-4 flex items-center text-xs text-tertiary font-semibold">
                <span className="material-symbols-outlined text-sm mr-1">payments</span> Live settlement estimation
              </div>
            </div>
            <div className="bg-primary/5 p-6 rounded-xl border border-primary/10 flex items-center justify-between group hover:-translate-y-1 transition-transform relative">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-primary font-bold mb-1">Quick Report</p>
                <p className="text-sm font-medium text-primary-container leading-tight">Generate full export for {dashboardView === 'order-wise' ? 'Orders' : 'Items'}.</p>
              </div>
              <div className="relative">
                <button onClick={() => setShowExportMenu(!showExportMenu)} className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center relative hover:opacity-90 shadow-md transition-all">
                  <span className="material-symbols-outlined">download</span>
                </button>
                {showExportMenu && (
                  <div className="absolute right-0 top-12 bg-white shadow-xl rounded-xl border border-outline-variant/20 overflow-hidden z-20 flex flex-col w-36 py-1 animate-in fade-in zoom-in-95 duration-200">
                    <button onClick={() => handleQuickReport('csv')} className="px-4 py-3 hover:bg-surface-container-low text-sm font-bold text-left w-full flex items-center gap-2 transition-colors text-slate-700 hover:text-primary"><span className="material-symbols-outlined text-[18px]">table_chart</span> CSV / Excel</button>
                    <button onClick={() => handleQuickReport('pdf')} className="px-4 py-3 hover:bg-surface-container-low text-sm font-bold text-left w-full flex items-center gap-2 transition-colors text-slate-700 hover:text-primary"><span className="material-symbols-outlined text-[18px]">picture_as_pdf</span> PDF Report</button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Search and Multi-Select Filters */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-surface-container-low p-4 rounded-xl border border-outline-variant/10">
              <div className="relative w-full md:max-w-md">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">search</span>
                <input 
                   type="text" 
                   className="w-full bg-surface-container-lowest border-none font-body text-sm rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-primary/20 shadow-sm" 
                   placeholder={dashboardView === 'order-wise' ? "Search orders or customers..." : "Search items, codes, or orders..."}
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 relative w-full md:w-auto" ref={statusFilterRef}>
                 <span className="text-xs font-bold uppercase tracking-widest text-slate-500 whitespace-nowrap">Status:</span>
                 <button 
                   onClick={() => setShowStatusFilter(!showStatusFilter)} 
                   className="bg-surface-container-lowest border-none shadow-sm font-bold text-sm rounded-lg px-4 py-2 flex items-center justify-between gap-4 hover:bg-surface-container-high transition-colors w-full md:w-auto"
                 >
                   <span>{Object.values(statusFilter).filter(Boolean).length} Selected</span>
                   <span className="material-symbols-outlined text-[18px] text-slate-400">arrow_drop_down</span>
                 </button>
                 
                 {showStatusFilter && (
                    <div className="absolute right-0 top-12 mt-1 w-48 bg-white shadow-xl rounded-xl border border-outline-variant/20 py-2 z-30 animate-in fade-in zoom-in-95 duration-200">
                       {Object.keys(statusFilter).map(statusKey => (
                          <label key={statusKey} className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface-container-low cursor-pointer transition-colors group">
                             <div className="relative flex items-center justify-center">
                               <input 
                                  type="checkbox" 
                                  checked={statusFilter[statusKey]} 
                                  onChange={() => handleStatusFilterChange(statusKey)}
                                  className="w-4 h-4 rounded text-primary focus:ring-primary/20 border-outline-variant/50 cursor-pointer"
                               />
                             </div>
                             <span className="text-sm font-bold text-slate-700 group-hover:text-primary transition-colors">{statusKey}</span>
                          </label>
                       ))}
                    </div>
                 )}
              </div>
          </div>

          {/* Table Section */}
          <div className="bg-surface-container-lowest rounded-xl shadow-[0_20px_40px_rgba(0,28,56,0.04)] overflow-hidden border border-outline-variant/10">
            <div className="overflow-x-auto min-h-[300px]">
              {dashboardView === 'order-wise' ? (
                /* ORDER-WISE TABLE with Auto-layout */
                <table className="w-full text-left border-collapse table-auto whitespace-nowrap">
                  <thead>
                    <tr className="bg-surface-container-low/50 border-y border-outline-variant/10">
                      <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant w-1">Order ID</th>
                      <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant w-1">Date</th>
                      <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Customer</th>
                      <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant text-right w-24">Items</th>
                      <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant text-right w-24">Output (m)</th>
                      <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant text-right w-32">Dispatched</th>
                      <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant text-right w-32">Value (PKR)</th>
                      <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant w-32">Status</th>
                      <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant text-right w-1">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container-low font-body text-sm">
                    {filteredOrders.length > 0 ? filteredOrders.map(order => {
                      const customer = state.customers.find(c => c.id === order.customerId);
                      const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
                      const outputCount = order.items.reduce((sum, item) => sum + (item.producedQty || 0), 0);
                      const dispatchedCount = order.items.reduce((sum, item) => sum + (item.deliveredQty || 0), 0);
                      const orderValue = order.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
                      
                      return (
                      <tr key={order.id} className="hover:bg-surface-container-low/30 transition-colors group">
                        <td className="px-6 py-5 font-bold text-primary">{order.id}</td>
                        <td className="px-6 py-5 text-on-surface-variant font-medium">{new Date(order.date).toLocaleDateString()}</td>
                        <td className="px-6 py-5">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-secondary-container/50 flex items-center justify-center text-xs font-bold text-secondary">
                              {customer?.name?.substring(0, 2).toUpperCase()}
                            </div>
                            <span className="font-bold text-slate-800">{customer?.name || 'Unknown'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right font-bold text-slate-600">{itemCount}</td>
                        <td className="px-6 py-5 text-right font-bold text-slate-700">{outputCount}</td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex flex-col items-end">
                            <span className="font-bold text-tertiary text-xs">{dispatchedCount} / {itemCount}</span>
                            <div className="w-16 h-1 mt-1.5 bg-surface-container rounded-full overflow-hidden">
                              <div className="h-full bg-tertiary" style={{ width: `${itemCount > 0 ? (dispatchedCount/itemCount)*100 : 0}%`}}></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 font-extrabold text-slate-800 text-right">{orderValue.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                        <td className="px-6 py-5 overflow-visible">
                           <StatusBadgeWithAction orderId={order.id} itemCode={null} status={order.status} updateStatus={updateSaleOrderItemStatus} />
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end space-x-1 opacity-40 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEditOrder(order)} className="p-2 hover:text-primary transition-colors hover:bg-primary/10 rounded-lg" title="Modify"><span className="material-symbols-outlined text-[20px]">edit</span></button>
                            <button onClick={() => setPrintOrder(order)} className="p-2 hover:text-primary transition-colors hover:bg-primary/10 rounded-lg" title="Print"><span className="material-symbols-outlined text-[20px]">print</span></button>
                          </div>
                        </td>
                      </tr>
                      );
                    }) : (
                       <tr>
                          <td colSpan="9" className="px-6 py-16 text-center text-slate-500 font-bold italic">No orders found matching criteria.</td>
                       </tr>
                    )}
                  </tbody>
                </table>
              ) : (
                /* ITEM-WISE TABLE with Auto-layout */
                <table className="w-full text-left border-collapse table-auto whitespace-nowrap animate-in fade-in duration-300">
                  <thead>
                    <tr className="bg-surface-container-low/50 border-y border-outline-variant/10">
                      <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant w-1">Date</th>
                      <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant w-1">Order Details</th>
                      <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Item Info</th>
                      <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant text-right w-24">Order Qty</th>
                      <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-700 text-right w-24">Output (m)</th>
                      <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-tertiary text-right w-24">Dispatched</th>
                      <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant text-right w-24">Pending</th>
                      <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant w-32">Item Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container-low font-body text-sm">
                    {flattenedItems.length > 0 ? flattenedItems.map((item, idx) => {
                      const prodObj = state.items.find(i => i.id === item.itemId);
                      const pendingQty = item.quantity - (item.deliveredQty || 0);

                      return (
                      <tr key={`${item.orderId}-${idx}`} className="hover:bg-surface-container-low/30 transition-colors group">
                        <td className="px-6 py-5 text-on-surface-variant font-bold">{new Date(item.orderDate).toLocaleDateString()}</td>
                        <td className="px-6 py-5">
                          <div className="font-extrabold text-primary">{item.orderId}</div>
                          <div className="text-[10px] text-on-surface-variant mt-1 uppercase tracking-wider font-bold truncate max-w-[150px]">{item.customerName}</div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="font-mono text-xs font-bold bg-slate-100 text-slate-800 rounded px-2 py-0.5 inline-block mb-1.5 border border-slate-200">{item.itemCode}</div>
                          <div className="text-sm font-semibold text-slate-700">{prodObj?.name || 'Unknown Item'}</div>
                        </td>
                        <td className="px-6 py-5 text-right font-extrabold text-slate-800">{item.quantity}</td>
                        <td className="px-6 py-5 text-right font-bold text-slate-700">{item.producedQty || 0}</td>
                        <td className="px-6 py-5 text-right">
                          <span className="font-bold text-tertiary bg-tertiary/10 px-3 py-1 rounded-lg inline-block border border-tertiary/20">{item.deliveredQty || 0}</span>
                        </td>
                        <td className="px-6 py-5 text-right font-bold text-slate-500">{pendingQty}</td>
                        <td className="px-6 py-5 overflow-visible">
                           <StatusBadgeWithAction orderId={item.orderId} itemCode={item.itemCode} status={item.status} updateStatus={updateSaleOrderItemStatus} />
                        </td>
                      </tr>
                      );
                    }) : (
                       <tr>
                          <td colSpan="8" className="px-6 py-16 text-center text-slate-500 font-bold italic">No items found matching the selected filters.</td>
                       </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
            
            {/* Pagination */}
            <div className="p-4 border-t border-surface-container-low flex items-center justify-between">
              <p className="text-xs text-on-surface-variant font-bold">
                Showing {dashboardView === 'order-wise' ? filteredOrders.length + ' orders' : flattenedItems.length + ' line items'}
              </p>
              <div className="flex items-center space-x-2">
                <button className="p-2 rounded-lg hover:bg-surface-container-low disabled:opacity-30 transition-colors" disabled><span className="material-symbols-outlined text-[20px]">chevron_left</span></button>
                <button className="w-8 h-8 rounded-lg bg-primary text-white text-xs font-bold shadow-md">1</button>
                <button className="p-2 rounded-lg hover:bg-surface-container-low disabled:opacity-30 transition-colors" disabled><span className="material-symbols-outlined text-[20px]">chevron_right</span></button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE ORDER TAB */}
      {activeTab === 'create' && (
        <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-500 slide-in-from-bottom-4">
          <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex items-center gap-4">
               <div className="flex gap-1 mr-2">
                  <button type="button" onClick={handlePrevTab} className="w-9 h-9 flex items-center justify-center bg-surface hover:bg-surface-container-low rounded-lg border border-outline-variant/30 text-slate-500 hover:text-primary transition-all shadow-sm"><span className="material-symbols-outlined text-[18px]">arrow_back</span></button>
                  <button type="button" onClick={handleNextTab} className="w-9 h-9 flex items-center justify-center bg-surface hover:bg-surface-container-low rounded-lg border border-outline-variant/30 text-slate-500 hover:text-primary transition-all shadow-sm"><span className="material-symbols-outlined text-[18px]">arrow_forward</span></button>
               </div>
               <div className="space-y-1">
                 <h1 className="text-3xl font-extrabold tracking-tight text-primary font-headline">New Sale Order</h1>
                 <p className="text-on-surface-variant font-body text-sm">Create and dispatch synthetic logistics requests.</p>
               </div>
            </div>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-surface-container-low p-8 rounded-xl border border-outline-variant/10 shadow-sm">
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Sale Order #</label>
              <input readOnly type="text" className="w-full bg-surface-container-highest/50 border-none rounded-lg text-primary font-extrabold focus:ring-0 cursor-not-allowed" value={orderMeta.id} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Order Date</label>
              <input type="date" value={orderMeta.date} onChange={(e) => handleMetaChange('date', e.target.value)} className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg focus:ring-2 ring-primary/20 font-bold" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Status</label>
              <select disabled className="w-full bg-surface-container-highest/50 border-none rounded-lg font-bold text-slate-500 cursor-not-allowed text-sm">
                <option>Pending</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Order Type</label>
              <select value={orderMeta.type} onChange={(e) => handleMetaChange('type', e.target.value)} className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg focus:ring-2 ring-primary/20 font-bold text-sm">
                <option>Standard</option>
                <option className="text-tertiary font-bold">Urgent</option>
              </select>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <section className="lg:col-span-8 space-y-6 bg-surface-container-low p-8 rounded-xl border border-outline-variant/10 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-primary">person_search</span>
                <h2 className="text-lg font-bold text-primary font-headline">Customer Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 col-span-full relative" ref={custSearchRef}>
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Select Customer</label>
                  <input 
                    type="text"
                    value={showCustSearch ? customerSearchQuery : (state.customers.find(c => c.id === orderMeta.customerId)?.name || '')} 
                    onFocus={() => {
                       setShowCustSearch(true);
                       setCustomerSearchQuery('');
                    }}
                    onChange={(e) => {
                       setCustomerSearchQuery(e.target.value);
                       handleMetaChange('customerId', '');
                    }}
                    placeholder="Search by customer name..."
                    className="w-full bg-white border border-outline-variant/30 rounded-lg px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 shadow-sm"
                  />
                  {showCustSearch && (
                      <ul className="absolute z-30 left-0 right-0 top-[calc(100%+4px)] bg-white border border-outline-variant/20 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                          {state.customers.filter(c => c.name.toLowerCase().includes(customerSearchQuery.toLowerCase())).map(c => (
                              <li 
                                key={c.id} 
                                onClick={() => {
                                    handleMetaChange('customerId', c.id);
                                    setShowCustSearch(false);
                                }}
                                className="px-5 py-3 hover:bg-primary/5 cursor-pointer border-b border-outline-variant/10 last:border-0 transition-colors"
                              >
                                  <div className="font-extrabold text-sm text-slate-800">{c.name}</div>
                              </li>
                          ))}
                          {state.customers.filter(c => c.name.toLowerCase().includes(customerSearchQuery.toLowerCase())).length === 0 && (
                             <li className="p-4 text-sm font-bold text-slate-400 text-center italic">No customers found.</li>
                          )}
                      </ul>
                  )}
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Contact Person</label>
                   <input type="text" placeholder="Full Name" className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg focus:ring-2 ring-primary/20 text-sm font-medium"/>
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Contact Phone</label>
                   <input type="tel" placeholder="+1 (555) 000-0000" className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg focus:ring-2 ring-primary/20 text-sm font-medium"/>
                </div>
                <div className="space-y-2 col-span-full">
                   <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Shipping Address</label>
                   <textarea rows="3" value={orderMeta.shippingAddress} onChange={(e) => handleMetaChange('shippingAddress', e.target.value)} placeholder="Full geographical address..." className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg focus:ring-2 ring-primary/20 text-sm font-medium resize-y"></textarea>
                </div>
              </div>
            </section>

            <section className="lg:col-span-4 space-y-6 bg-surface-container-low p-8 rounded-xl border border-outline-variant/10 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-primary">assignment_turned_in</span>
                <h2 className="text-lg font-bold text-primary font-headline">Sales & Terms</h2>
              </div>
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Salesperson</label>
                  <select value={orderMeta.salesperson} onChange={(e) => handleMetaChange('salesperson', e.target.value)} className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg focus:ring-2 ring-primary/20 font-bold text-sm">
                    <option>Alexander Pierce</option>
                    <option>Elena Rodriguez</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Payment Terms</label>
                  <select value={orderMeta.paymentTerms} onChange={(e) => handleMetaChange('paymentTerms', e.target.value)} className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg focus:ring-2 ring-primary/20 font-bold text-sm">
                    <option>Net 30</option>
                    <option>Net 60</option>
                    <option>COD</option>
                    <option>Prepaid</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Expected Delivery</label>
                  <input type="date" value={orderMeta.expectedDelivery} onChange={(e) => handleMetaChange('expectedDelivery', e.target.value)} className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg focus:ring-2 ring-primary/20 font-bold text-sm" />
                </div>
              </div>
            </section>
          </div>

          {/* Line Items Table with Dropdown Search */}
          <section className="bg-surface-container-lowest shadow-[0_20px_40px_rgba(0,28,56,0.06)] rounded-xl overflow-visible border border-outline-variant/10">
            <div className="px-8 py-6 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-low">
              <h2 className="text-lg font-bold text-primary font-headline">Order Line Items</h2>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => navigate('/settings?tab=finish-good')} className="flex items-center gap-2 text-primary text-sm font-bold hover:bg-primary/5 transition-colors px-4 py-2.5 rounded-lg border border-primary/40 border-dashed shadow-sm">
                  <span className="material-symbols-outlined text-[18px]">category</span> Add Finish Good
                </button>
                <button type="button" onClick={addNewItem} className="flex items-center gap-2 text-white text-sm font-bold hover:opacity-90 transition-opacity bg-primary px-5 py-2.5 rounded-lg shadow-md">
                  <span className="material-symbols-outlined text-[18px]">add_circle</span> Add Line
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto min-h-[300px]">
              <table className="w-full text-left border-collapse table-auto whitespace-nowrap">
                <thead>
                  <tr className="bg-surface border-b border-outline-variant/10">
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant w-1">Sr.</th>
                    <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant min-w-[350px]">Item Code / Selective Search</th>
                    <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant text-right w-28">Order Qty</th>
                    <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant text-right w-24">Rolls</th>
                    <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant text-right w-24">Rate (PKR)</th>
                    <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant text-right w-24">Disc. (PKR)</th>
                    <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant text-right w-32">Subtotal</th>
                    <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant min-w-[200px]">Line Remarks</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest w-1"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {items.map((item, idx) => {
                     const itemSubtotal = (item.qty * item.price) - (item.discount || 0);
                     const prodObj = state.items.find(i => i.id === item.itemId);
                     const actRollSz = prodObj?.rollSize || prodObj?.packingSize || 0;
                     const filteredItemsList = state.items.filter(i => (i.type === 'Finish Good' || i.category === 'Finished Goods') && (i.name.toLowerCase().includes((searchQueries[item.id] || '').toLowerCase()) || i.sku.toLowerCase().includes((searchQueries[item.id] || '').toLowerCase())));
                     
                     return (
                      <tr key={item.id} className="group hover:bg-surface-container-low/50 transition-colors">
                        <td className="px-6 py-4 text-sm font-bold text-outline text-center align-top pt-6">{String(idx + 1).padStart(2, '0')}</td>
                        <td className="px-4 py-4 align-top pt-5">
                          <div className="flex items-start gap-4 relative">
                            <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center shrink-0 mt-0.5">
                              <span className="material-symbols-outlined text-primary-container text-[20px]">science</span>
                            </div>
                            <div className="w-full flex flex-col pt-0.5">
                               <div className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded tracking-wide w-fit mb-2 border border-slate-200">
                                  {item.itemCode}
                               </div>
                               <div className="relative" ref={activeSearchId === item.id ? searchDropdownRef : null}>
                                   <input 
                                     type="text" 
                                     placeholder="Search FG Name or SKU..."
                                     onClick={() => setActiveSearchId(item.id)}
                                     onChange={(e) => {
                                        setSearchQueries({...searchQueries, [item.id]: e.target.value});
                                        if (item.itemId) handleItemChange(item.id, 'itemId', '');
                                     }}
                                     value={item.itemId && activeSearchId !== item.id ? prodObj?.name : (searchQueries[item.id] || '')}
                                     className="w-full bg-white border border-outline-variant/30 rounded-lg px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-primary/20 shadow-sm"
                                   />
                                   {activeSearchId === item.id && (
                                       <ul className="absolute z-30 left-0 top-[calc(100%+4px)] w-[450px] bg-white border border-outline-variant/20 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] max-h-80 overflow-y-auto print:hidden animate-in fade-in zoom-in-95 duration-200">
                                           {filteredItemsList.map(p => (
                                               <li 
                                                 key={p.id} 
                                                 onClick={() => {
                                                     handleItemChange(item.id, 'itemId', p.id);
                                                     setSearchQueries({...searchQueries, [item.id]: ''});
                                                     setActiveSearchId(null);
                                                 }}
                                                 className="px-5 py-3 hover:bg-primary/5 cursor-pointer border-b border-outline-variant/10 last:border-0 transition-colors"
                                               >
                                                   <div className="font-extrabold text-sm text-slate-800">{p.name}</div>
                                                   <div className="flex items-center gap-x-4 mt-1.5 flex-wrap">
                                                       <span className="text-[10px] font-bold bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">{p.sku}</span>
                                                       <span className="text-[11px] font-bold text-tertiary flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">inventory_2</span> {p.stock} {p.unit}</span>
                                                       <span className="text-[11px] font-bold text-primary flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">payments</span> {p.price}</span>
                                                   </div>
                                               </li>
                                           ))}
                                           {filteredItemsList.length === 0 && <li className="p-4 text-sm font-bold text-slate-400 text-center italic">No finish goods found.</li>}
                                       </ul>
                                   )}
                               </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right align-top pt-11">
                          <div className="flex flex-col items-end gap-1">
                             <div className="flex items-center justify-end gap-1.5">
                               <input type="number" min="1" value={item.qty} onChange={(e) => handleItemChange(item.id, 'qty', parseInt(e.target.value.replace(/\D/g, '') || 0))} className="w-20 text-right bg-white border border-outline-variant/30 rounded-lg p-2.5 text-sm font-extrabold focus:ring-2 focus:ring-primary/20 shadow-sm" />
                               <span className="text-xs text-slate-400 font-bold w-6 text-left">{prodObj?.unit === 'Meters' ? 'm' : (prodObj?.unit || '') }</span>
                             </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right align-top pt-11">
                           <div className="flex flex-col items-center gap-1">
                             <input type="number" min="1" value={item.rolls} onChange={(e) => handleItemChange(item.id, 'rolls', parseInt(e.target.value.replace(/\D/g, '') || 0))} className="w-16 text-right bg-white border border-outline-variant/30 rounded-lg p-2.5 text-sm font-extrabold focus:ring-2 focus:ring-primary/20 shadow-sm" />
                             {actRollSz > 0 && <span className="text-[10px] text-slate-500 font-medium">{actRollSz}m/roll</span>}
                           </div>
                        </td>
                        <td className="px-4 py-4 text-right align-top pt-11">
                          <input type="number" value={item.price} onChange={(e) => handleItemChange(item.id, 'price', parseFloat(e.target.value) || 0)} className="w-24 text-right bg-white border border-outline-variant/30 rounded-lg p-2.5 text-sm font-bold focus:ring-2 focus:ring-primary/20 shadow-sm" />
                        </td>
                        <td className="px-4 py-4 text-right align-top pt-11">
                          <input type="number" value={item.discount} onChange={(e) => handleItemChange(item.id, 'discount', parseFloat(e.target.value) || 0)} className="w-20 text-right bg-white border border-outline-variant/30 rounded-lg p-2.5 text-sm font-bold focus:ring-2 focus:ring-primary/20 shadow-sm" />
                        </td>
                        <td className="px-4 py-4 text-right align-top pt-[54px] text-sm font-extrabold text-primary">{itemSubtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                        <td className="px-4 py-4 align-top pt-12">
                          <input type="text" value={item.remarks} onChange={(e) => handleItemChange(item.id, 'remarks', e.target.value)} className="w-full bg-transparent border-b border-dashed border-outline-variant/50 pb-1 text-xs focus:outline-none focus:border-primary italic text-slate-600 font-medium" placeholder="Add specific requirements..." />
                        </td>
                        <td className="px-6 py-4 text-right align-top pt-11">
                          <button type="button" onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors p-2.5 flex items-center justify-center"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                        </td>
                      </tr>
                   );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <section className="md:col-span-7 bg-surface-container-low p-8 rounded-xl border border-outline-variant/10 space-y-4 shadow-sm">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-2"><span className="material-symbols-outlined text-[16px]">notes</span> Overall Order Notes</label>
              <textarea value={orderMeta.notes} onChange={(e) => handleMetaChange('notes', e.target.value)} className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl focus:ring-2 ring-primary/20 p-4 text-sm resize-y font-medium text-slate-700 shadow-inner" placeholder="Specify any logistical constraints, laboratory requirements, or compliance codes here..." rows="5"></textarea>
            </section>
            
            <section className="md:col-span-5 bg-gradient-to-br from-[#004277] to-[#005a9e] text-white p-8 rounded-xl shadow-[0_20px_40px_rgba(0,66,119,0.15)] relative overflow-hidden flex flex-col justify-between">
              <div className="absolute -right-8 -bottom-8 opacity-10">
                <span className="material-symbols-outlined text-[180px]" style={{ fontVariationSettings: "'FILL' 1" }}>request_quote</span>
              </div>
              <h3 className="text-xs font-bold uppercase tracking-widest opacity-80 mb-6 flex items-center gap-2"><span className="material-symbols-outlined text-[16px]">point_of_sale</span> Financial Summary</h3>
              <div className="space-y-4 relative z-10 w-full mb-4">
                <div className="flex justify-between items-center text-blue-100">
                  <span className="text-sm font-semibold">Net Subtotal</span>
                  <span className="text-sm font-bold">{subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>
                <div className="flex justify-between items-center text-blue-100/60">
                  <span className="text-sm font-semibold">Estimated Freight (0%)</span>
                  <span className="text-sm font-bold">0.00</span>
                </div>
              </div>
              <div className="pt-6 border-t border-white/20 flex justify-between items-end relative z-10 w-full">
                 <span className="text-lg font-extrabold uppercase tracking-wide">Grand Total</span>
                 <span className="text-4xl font-black tracking-tight">{subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})} <span className="text-lg opacity-70 ml-1">PKR</span></span>
              </div>
            </section>
          </div>

          <footer className="flex flex-col md:flex-row justify-between items-center gap-4 pt-10 pb-6">
            <button type="button" onClick={() => setActiveTab('dashboard')} className="px-8 py-3.5 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors w-full md:w-auto">Cancel Workflow</button>
            <button type="submit" className="px-10 py-3.5 bg-primary text-white font-extrabold rounded-xl shadow-[0_10px_20px_rgba(0,113,227,0.2)] hover:shadow-[0_15px_30px_rgba(0,113,227,0.3)] transition-all w-full md:w-auto transform hover:-translate-y-0.5">Submit Sale Order</button>
          </footer>
        </form>
      )}

      {/* HISTORY TAB */}
      {activeTab === 'history' && (
        <div className="space-y-8 animate-in mt-10 fade-in slide-in-from-bottom-4 duration-500">
           <div className="flex flex-col md:flex-row items-start md:items-end gap-4 justify-between">
              <div className="flex items-center gap-4">
                <div className="flex gap-1 mr-2">
                   <button onClick={handlePrevTab} className="w-9 h-9 flex items-center justify-center bg-surface hover:bg-surface-container-low rounded-lg border border-outline-variant/30 text-slate-500 hover:text-primary transition-all shadow-sm"><span className="material-symbols-outlined text-[18px]">arrow_back</span></button>
                   <button onClick={handleNextTab} className="w-9 h-9 flex items-center justify-center bg-surface hover:bg-surface-container-low rounded-lg border border-outline-variant/30 text-slate-500 hover:text-primary transition-all shadow-sm"><span className="material-symbols-outlined text-[18px]">arrow_forward</span></button>
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-on-surface font-headline">Sale Order History</h1>
                  <p className="text-on-surface-variant mt-2 max-w-lg font-body text-sm">Historical timeline and audit log for sale orders.</p>
                </div>
              </div>
              <div className="flex flex-wrap md:flex-nowrap gap-3 bg-surface-container-lowest p-2 rounded-xl shadow-sm border border-outline-variant/10 w-full md:w-auto">
                 <input type="text" placeholder="Customer Name..." value={histCust} onChange={e => setHistCust(e.target.value)} className="w-full md:w-auto flex-1 bg-surface-container-low border-none rounded-lg text-xs font-bold px-4 py-2.5 focus:ring-2 focus:ring-primary/20" />
                 <input type="date" value={histDate} onChange={e => setHistDate(e.target.value)} className="bg-surface-container-low border-none rounded-lg text-xs font-bold px-4 py-2.5 focus:ring-2 focus:ring-primary/20" />
                 <input type="text" placeholder="Order ID..." value={histSO} onChange={e => setHistSO(e.target.value)} className="w-full md:w-32 bg-surface-container-low border-none rounded-lg text-xs font-bold px-4 py-2.5 focus:ring-2 focus:ring-primary/20" />
              </div>
           </div>

           <div className="bg-surface-container-lowest rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-outline-variant/10 overflow-hidden">
              <div className="overflow-x-auto min-h-[400px]">
                <table className="w-full text-left border-collapse table-auto whitespace-nowrap">
                    <thead>
                      <tr className="bg-surface-container-low/50 border-y border-outline-variant/10">
                        <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant w-1">Order ID & Date</th>
                        <th className="px-6 py-5 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Customer</th>
                        <th className="px-6 py-5 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Order Items Overview</th>
                        <th className="px-6 py-5 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant text-right">Value (PKR)</th>
                        <th className="px-6 py-5 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant w-1">Status</th>
                        <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant text-right w-1">Audit Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container-low font-body text-sm">
                      {filteredHistory.map(order => {
                         const customer = state.customers.find(c => c.id === order.customerId);
                         const orderValue = order.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
                         
                         return (
                            <tr key={order.id} className="hover:bg-surface-container-low/40 transition-colors">
                                <td className="px-8 py-6">
                                   <div className="font-extrabold text-primary text-base">{order.id}</div>
                                   <div className="text-[11px] text-slate-500 font-bold mt-1.5">{new Date(order.date).toLocaleDateString()}</div>
                                </td>
                                <td className="px-6 py-6 font-extrabold text-slate-700">{customer?.name || 'Unknown'}</td>
                                <td className="px-6 py-6">
                                   <div className="flex flex-wrap gap-2 max-w-[350px]">
                                      <span className="text-sm font-bold text-slate-700">{order.items.map(it => it.quantity).join(', ')}</span>
                                   </div>
                                </td>
                                <td className="px-6 py-6 text-right font-black text-slate-800 text-base">{orderValue.toLocaleString()}</td>
                                <td className="px-6 py-6 overflow-visible"><StatusBadgeWithAction orderId={order.id} itemCode={null} status={order.status} updateStatus={updateSaleOrderItemStatus} /></td>
                                <td className="px-8 py-6 text-right">
                                   <div className="flex items-center justify-end gap-2">
                                     <button onClick={() => updateSaleOrderItemStatus(order.id, null, 'Deleted')} title="Delete Order" className="text-red-400 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors flex items-center justify-center">
                                       <span className="material-symbols-outlined text-[18px]">delete</span>
                                     </button>
                                     <button onClick={() => setPrintOrder(order)} className="text-primary hover:bg-primary/10 px-4 py-2 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1.5 border border-transparent hover:border-primary/20">
                                        <span className="material-symbols-outlined text-[16px]">print</span>
                                        Print Record
                                     </button>
                                   </div>
                                </td>
                            </tr>
                         )
                      })}
                      {filteredHistory.length === 0 && (
                          <tr><td colSpan="6" className="py-16 text-center text-slate-400 font-bold italic">No history matches the current filters.</td></tr>
                      )}
                    </tbody>
                </table>
              </div>
           </div>
        </div>
      )}
    </Layout>
    </div>
    </div>
  );
}
