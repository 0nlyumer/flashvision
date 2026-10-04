const fs = require('fs');
let content = fs.readFileSync('src/components/production/PlanConsumption.jsx', 'utf8');

const startStr = '  const handleToggleMode =';
const endStr = '  const handleClothChange =';

const start = content.indexOf(startStr);
const end = content.indexOf(endStr);

if (start === -1 || end === -1) {
    console.error('Could not find start or end strings');
    process.exit(1);
}

const replacement = `  const handleToggleMode = (itemCode, isCurrentlyManual, item) => {
      const bom = state.boms?.find(b => b.finishedGoodName === item.productName);
      if (!bom) return;

      setDirty(true);
      const willBeManual = !isCurrentlyManual;
      setManualModeItems(p => ({ ...p, [itemCode]: willBeManual }));
      
      setConsumptionData(prev => {
          const updated = { ...prev };
          const itemData = updated[itemCode];
          if (!itemData) return prev;

          if (willBeManual) {
              const mergeManual = (phase, sourceList) => {
                  const existing = itemData.materials[phase] || [];
                  return sourceList.map(m => {
                      const ex = existing.find(e => e.name === m.name);
                      return {
                          name: m.name,
                          itemCode: m.sku || m.id || '',
                          value: ex ? (ex.adjustedValue || ex.value) : '',
                          adjustedValue: ''
                      };
                  });
              };
              itemData.materials = {
                  top: mergeManual('top', genericMaterials),
                  foam: mergeManual('foam', genericMaterials),
                  adhesive: mergeManual('adhesive', genericMaterials),
                  packing: mergeManual('packing', packingMaterials)
              };
          } else {
              const getBomPhase = (phaseKey) => {
                  if (bom.phases && bom.phases[phaseKey]) return bom.phases[phaseKey];
                  if (bom.materials && bom.materials[phaseKey]) return bom.materials[phaseKey];
                  return [];
              };
              const calculateBomValue = (mat) => {
                  const qty = mat.quantity || mat.value;
                  if (!qty) return '';
                  return (parseFloat(qty) * item.outputQty).toFixed(2);
              };
              const mergeBOM = (phaseKey) => {
                  const bomMats = getBomPhase(phaseKey);
                  const existing = itemData.materials[phaseKey] || [];
                  return bomMats.map(m => {
                      const ex = existing.find(e => e.name === m.name);
                      return {
                          name: m.name,
                          itemCode: m.itemCode || m.rmId || '',
                          bomValue: calculateBomValue(m),
                          value: calculateBomValue(m),
                          adjustedValue: ex ? (ex.adjustedValue || ex.value) : ''
                      };
                  });
              };
              itemData.materials = {
                  top: mergeBOM('top'),
                  foam: mergeBOM('foam'),
                  adhesive: mergeBOM('adhesive'),
                  packing: mergeBOM('packing')
              };
          }
          return updated;
      });
  };

`;

content = content.substring(0, start) + replacement + content.substring(end);
fs.writeFileSync('src/components/production/PlanConsumption.jsx', content);
console.log('Successfully patched PlanConsumption.jsx');
