import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useApp } from '../context/AppContext';

import OmsFilter from '../components/oms/OmsFilter';
import OmsSelection from '../components/oms/OmsSelection';
import OmsAdjustment from '../components/oms/OmsAdjustment';
import OmsSlip from '../components/oms/OmsSlip';
import OmsHistory from '../components/oms/OmsHistory';

export default function ProductionOMS() {
  const [activeTab, setActiveTab] = useState('filter');
  const [isAdjustingPlan, setIsAdjustingPlan] = useState(false);
  const [selectedPlanItems, setSelectedPlanItems] = useState([]); // Tracking selection
  const { state, updateSaleOrderItemStatus, setCollection } = useApp();

  const pendingItems = state.saleOrders.flatMap(order => 
    order.items
      .filter(item => item.status === 'Pending')
      .map(item => {
        const product = state.items.find(i => i.id === item.itemId);
        let requiredFabric = null;
        let fabricStock = 0;
        let fabricRequiredQty = 0;
        if (product && product.requiredFabricId) {
          requiredFabric = state.items.find(i => i.id === product.requiredFabricId);
          fabricStock = requiredFabric?.stock || 0;
          fabricRequiredQty = (item.quantity * (product.fabricRatio || 0));
        }

        return {
          ...item,
          orderId: order.id,
          date: order.date,
          customerId: order.customerId,
          productName: product?.name || 'Unknown',
          requiredFabricName: requiredFabric?.name || 'None',
          fabricStock,
          fabricRequiredQty,
          hasShortage: requiredFabric ? fabricStock < fabricRequiredQty : false
        };
      })
  );

  const activeRuns = state.productionPlans || [];

  const handleStartRuns = (itemsToRun) => {
    let hasShortage = itemsToRun.some(pItem => pItem.hasShortage);
    if (hasShortage) {
      alert('Cannot start run: Insufficient raw materials (Fabric) for one or more items.');
      return;
    }
    
    // Batch process items
    let updatedItems = [...state.items];
    const planItems = itemsToRun.map(pItem => {
      // Deduct stock for each run
      if (pItem.requiredFabricName !== 'None') {
        const fabricIndex = updatedItems.findIndex(it => it.name === pItem.requiredFabricName);
        if (fabricIndex !== -1) {
             updatedItems[fabricIndex] = { 
                 ...updatedItems[fabricIndex], 
                 stock: updatedItems[fabricIndex].stock - pItem.fabricRequiredQty 
             };
        }
      }
      
      updateSaleOrderItemStatus(pItem.orderId, pItem.itemCode, 'In Production');
      
      return {
        orderId: pItem.orderId,
        customerName: state.customers.find(c => c.id === pItem.customerId)?.name || pItem.customer || 'Unknown',
        orderDate: pItem.date,
        itemCode: pItem.itemCode,
        productName: pItem.productName,
        quantity: pItem.quantity,
        outputQty: pItem.producedQty || 0,
        remaining: (pItem.quantity || 0) - (pItem.producedQty || 0),
        requiredFabricName: pItem.requiredFabricName || 'None'
      };
    });

    const newPlan = {
      id: `PLN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      date: new Date().toISOString(),
      items: planItems,
      progress: 0,
      status: 'Completed'
    };

    setCollection('items', updatedItems);
    setCollection('productionPlans', [...activeRuns, newPlan]);
    
    // Jump straight to History
    setIsAdjustingPlan(false);
    setActiveTab('history');
  };

  const tabs = [
    { id: 'filter', label: 'Item & Order Filter' },
    { id: 'planning', label: 'Production Planning' }, 
    { id: 'history', label: 'Planning History' }
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (tabId !== 'planning') {
        setIsAdjustingPlan(false);
    }
  };

  const triggerPlanAdjustment = (selected) => {
    setSelectedPlanItems(selected || []);
    setIsAdjustingPlan(true);
  };

  return (
    <Layout>
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 border-b border-outline-variant/20 mb-8 overflow-x-auto custom-scrollbar pb-2">
            {tabs.map((tab) => (
                <button 
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`px-4 flex-shrink-0 py-3 text-sm transition-all relative ${
                    activeTab === tab.id 
                    ? 'font-bold text-primary border-b-2 border-primary' 
                    : 'font-semibold text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded-t-lg border-b-2 border-transparent'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full"></span>}
                </button>
            ))}
        </div>
        
        <div className="flex-1">
            {activeTab === 'filter' && <OmsFilter pendingItems={pendingItems} customers={state.customers} />}
            {activeTab === 'planning' && !isAdjustingPlan && (
                <OmsSelection 
                   pendingItems={pendingItems} 
                   customers={state.customers}
                   handlePlanProduction={triggerPlanAdjustment} 
                />
            )}
            {activeTab === 'planning' && isAdjustingPlan && (
                <OmsAdjustment 
                   pendingItems={selectedPlanItems.length > 0 ? selectedPlanItems : pendingItems} 
                   handleStartRun={handleStartRuns} 
                   onCancel={() => setIsAdjustingPlan(false)}
                />
            )}
            {activeTab === 'history' && <OmsHistory activeRuns={activeRuns} />}
        </div>
      </div>
    </Layout>
  );
}
