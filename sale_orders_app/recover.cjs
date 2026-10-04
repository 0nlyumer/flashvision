const fs = require('fs');
const content = fs.readFileSync('src/components/production/PlanConsumption.jsx', 'utf8');
const lines = content.split('\n');

const fixedTop = `import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useDialog } from '../../context/DialogContext';

export default function PlanConsumption({ plan, onClose }) {
  const { state, setCollection, setDirty, isDirty } = useApp();
  const { appConfirm, appAlert } = useDialog();
  const fileInputRef = useRef(null);

  const [consumptionData, setConsumptionData] = useState({});
  
  const [addSelections, setAddSelections] = useState({});
  const [manualModeItems, setManualModeItems] = useState({});

  const genericMaterials = state.items.filter(i => {
      const isRM = i.category === 'Raw Material' || i.type === 'Raw Material';
      const isCloth = i.category === 'Cloth' || i.type === 'Cloth' || i.rawMaterialType === 'Cloth' || (i.name && i.name.toLowerCase().includes('cloth'));
      const isPacking = i.category === 'Packing Material' || i.type === 'Packing Material' || i.rawMaterialType === 'Packing' || (i.name && i.name.toLowerCase().includes('pack'));
      return isRM && !isCloth && !isPacking;
  });
  const packingMaterials = state.items.filter(i => {
      const isRM = i.category === 'Raw Material' || i.type === 'Raw Material';
      const isPacking = i.category === 'Packing Material' || i.type === 'Packing Material' || i.rawMaterialType === 'Packing' || (i.name && i.name.toLowerCase().includes('pack'));
      return isRM && isPacking;
  });

  useEffect(() => {
     if (Object.keys(consumptionData).length > 0) return; // Prevent wiping active entries when state updates
     
     const initialData = {};
     plan?.items?.forEach(item => {
         const bom = state.boms?.find(b => b.finishedGoodName === item.productName);

         // Auto-fetch clothName based on item (mimic BOMSetup logic)
         let autoClothName = 'No back cloth defined for this item';
         const fgItem = state.items.find(i => String(i.name).toLowerCase() === String(item.productName).toLowerCase() || String(i.sku) === String(item.itemCode));
         if (fgItem && fgItem.backClothId) {
             const fabricItem = state.items.find(i => String(i.id) === String(fgItem.backClothId) || String(i.name).toLowerCase() === String(fgItem.backClothId).toLowerCase());
             if (fabricItem) {
                 autoClothName = fabricItem.name;
             } else {
                 autoClothName = "Unregistered Cloth (Item Missing from DB)";
             }
         }

         if (bom && !manualModeItems[item.itemCode]) {
             if (plan.consumptions && plan.consumptions[item.itemCode] && !isDirty) {
                 // Load saved consumption
                 initialData[item.itemCode] = JSON.parse(JSON.stringify(plan.consumptions[item.itemCode]));
             } else {
                 const calculateBomValue = (mat) => {
                     const qty = mat.quantity || mat.value;
                     if (!qty) return '';
                     return (parseFloat(qty) * item.outputQty).toFixed(2);
                 };
                 // Standardize reading from either .phases or .materials
                 const getBomPhase = (phaseKey) => {
                     if (bom.phases && bom.phases[phaseKey]) return bom.phases[phaseKey];
                     if (bom.materials && bom.materials[phaseKey]) return bom.materials[phaseKey];
                     return [];
                 };
                 
                 // Initialize matrix based on BOM shape with adjustedValue
                 initialData[item.itemCode] = {
                     clothName: bom.clothName && bom.clothName !== 'Select a Finished Good to fetch Cloth' ? bom.clothName : autoClothName,
                     clothQuantity: '',
                     materials: {
                         top: getBomPhase('top').map(m => ({ name: m.name, itemCode: m.itemCode || m.rmId || '', bomValue: calculateBomValue(m), value: calculateBomValue(m), adjustedValue: '' })),
                         foam: getBomPhase('foam').map(m => ({ name: m.name, itemCode: m.itemCode || m.rmId || '', bomValue: calculateBomValue(m), value: calculateBomValue(m), adjustedValue: '' })),
                         adhesive: getBomPhase('adhesive').map(m => ({ name: m.name, itemCode: m.itemCode || m.rmId || '', bomValue: calculateBomValue(m), value: calculateBomValue(m), adjustedValue: '' })),
                         packing: getBomPhase('packing').map(m => ({ name: m.name, itemCode: m.itemCode || m.rmId || '', bomValue: calculateBomValue(m), value: calculateBomValue(m), adjustedValue: '' }))
                     }
                 };
             }
         } else {
             // No BOM exists for this item
             if (plan.consumptions && plan.consumptions[item.itemCode]) {
                 initialData[item.itemCode] = JSON.parse(JSON.stringify(plan.consumptions[item.itemCode]));
             } else {
                 initialData[item.itemCode] = {
                     clothName: autoClothName,
                     clothQuantity: '',
                     materials: {
                         top: genericMaterials.map(m => ({ name: m.name, itemCode: m.sku || m.id || '', value: '' })),
                         foam: genericMaterials.map(m => ({ name: m.name, itemCode: m.sku || m.id || '', value: '' })),
                         adhesive: genericMaterials.map(m => ({ name: m.name, itemCode: m.sku || m.id || '', value: '' })),
                         packing: packingMaterials.map(m => ({ name: m.name, itemCode: m.sku || m.id || '', value: '' }))
                     }
                 };
             }
         }
     });
     // eslint-disable-next-line react-hooks/set-state-in-effect
     setConsumptionData(initialData);
  }, [plan, state.boms, manualModeItems]);
`;

const goodIndex = lines.findIndex(l => l.includes('const handleRowChange ='));
if (goodIndex > -1) {
    const goodLines = lines.slice(goodIndex);
    fs.writeFileSync('src/components/production/PlanConsumption.jsx', fixedTop + '\n  ' + goodLines.join('\n'));
    console.log('Successfully repaired PlanConsumption.jsx');
} else {
    console.log('Failed to find handleRowChange function to splice');
}
