import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const initialMockState = {
  users: [
    { id: 1, name: 'Admin', role: 'Super Admin', permissions: ['all'] }
  ],
  customers: [
    { id: 'C1', name: 'Al-Haq Traders' },
    { id: 'C2', name: 'Pak Enterprises' }
  ],
  suppliers: [
    { id: 'S1', name: 'National Yarn Corp' }
  ],
  items: [
    { id: 'I1', name: 'Polyester Silk 120g', sku: 'RM-PS-120', type: 'Raw Material', category: 'Raw Material', stock: 5000, unit: 'Meters', uom: 'Meters (m)', fabricRatio: 0, rawMaterialType: 'Cloth', price: '$4.50', status: 'Active' },
    { id: 'I2', name: 'Cotton Blend 80g', sku: 'RM-CB-080', type: 'Raw Material', category: 'Raw Material', stock: 2000, unit: 'Meters', uom: 'Meters (m)', fabricRatio: 0, rawMaterialType: 'Cloth', price: '$3.50', status: 'Active' },
    { id: 'I3', name: 'Synthetic Winter Coat Fabric (Finished)', sku: 'FG-WC-001', type: 'Finish Good', category: 'Finished Goods', stock: 100, unit: 'Pieces', requiredFabricId: 'I1', fabricRatio: 2.5, price: '$45.00', status: 'Active' },
    { id: 'I4', name: 'Summer Breeze Shirt (Finished)', sku: 'FG-SBS-002', type: 'Finish Good', category: 'Finished Goods', stock: 0, unit: 'Pieces', requiredFabricId: 'I2', fabricRatio: 1.5, price: '$22.00', status: 'Alert' },
    { id: 'I5', name: 'Aluminum Sheets 2mm', sku: 'RM-AL-002', type: 'Raw Material', category: 'Raw Material', stock: 500, unit: 'Kilograms', uom: 'Kilograms (kg)', fabricRatio: 0, rawMaterialType: 'Metal', price: '$12.00', status: 'Active' },
  ],
  saleOrders: [],
  productionPlans: [],
  productionOutputs: [],
  deliveries: []
};

export const AppProvider = ({ children }) => {
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem('aj_synthetic_erp');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.saleOrders) {
           // Safely drop the initial mock so we don't accidentally drop legitimate new first-orders
           parsed.saleOrders = parsed.saleOrders.filter(o => 
              !(o.id === 'SO-001' && o.customerId === 'C1' && o.items.find(i => i.itemCode === 'SO-001-ITM-002' && i.price === 22))
           );
        }
        return parsed;
      } catch(e) {
        return initialMockState;
      }
    }
    return initialMockState;
  });

  useEffect(() => {
    localStorage.setItem('aj_synthetic_erp', JSON.stringify(state));
  }, [state]);

  const addSaleOrder = (so) => {
    setState(prev => {
        const extIdx = prev.saleOrders.findIndex(o => o.id === so.id);
        if (extIdx >= 0) {
            const newList = [...prev.saleOrders];
            newList[extIdx] = so;
            return { ...prev, saleOrders: newList };
        }
        return { ...prev, saleOrders: [...prev.saleOrders, so] };
    });
  };

  const updateSaleOrderItemStatus = (orderId, itemCode, status, producedQtyToAdd = 0) => {
    setState(prev => {
      const newOrders = prev.saleOrders.map(order => {
        if (order.id === orderId) {
          if (status === 'Deleted' && !itemCode) {
            return {
              ...order,
              status: 'Deleted',
              items: order.items.map(it => ({ ...it, status: 'Deleted' }))
            };
          }

          const newItems = order.items.map(it => {
            // Apply to all items if itemCode is null (Bulk Cancel/Process)
            if (it.itemCode === itemCode || !itemCode) {
              return { ...it, status, producedQty: (it.producedQty || 0) + producedQtyToAdd };
            }
            return it;
          });
          
          const allCancelled = newItems.every(i => i.status === 'Cancelled');
          const allCompletedOrCancelled = newItems.every(i => i.status === 'Completed' || i.status === 'Cancelled');
          const isPendingOrCancelled = newItems.every(i => i.status === 'Pending' || i.status === 'Cancelled');

          let ordStatus = 'In Process';
          if (allCancelled) ordStatus = 'Cancelled';
          else if (allCompletedOrCancelled && newItems.some(i => i.status === 'Completed')) ordStatus = 'Completed';
          else if (isPendingOrCancelled && newItems.some(i => i.status === 'Pending')) ordStatus = 'Pending';
          else if (allCompletedOrCancelled) ordStatus = 'Completed'; // fallback
          
          return { ...order, items: newItems, status: ordStatus };
        }
        return order;
      });
      return { ...prev, saleOrders: newOrders };
    });
  };

  // Generic updater
  const setCollection = (collection, data) => {
    setState(prev => ({ ...prev, [collection]: data }));
  };

  return (
    <AppContext.Provider value={{ state, setState, addSaleOrder, updateSaleOrderItemStatus, setCollection }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
