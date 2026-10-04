import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import GlobalPagination from '../ui/GlobalPagination';

export default function MasterBatchRecord() {
    const { state, toggleGlobalPagination, currencySymbol, currencyCode } = useApp();
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('All Time');
    
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    const isPaginated = state.isGlobalPaginated;

    const allBatches = useMemo(() => {
        const batches = [];
        (state.productionPlans || []).forEach(plan => {
            if (plan.status === 'Cancelled') return;
            
            const planOtherCons = (state.otherConsumptions || []).filter(oc => oc.planId === plan.id);
            
            // Calculate total non-wastage output for the plan
            let planTotalOutput = 0;
            (plan.items || []).forEach(it => {
                (it.outputs || []).forEach(out => {
                    const qty = parseFloat(out.quantity) || 0;
                    const isWastage = out.typeName?.toLowerCase().includes('wastage');
                    if (!isWastage) {
                        planTotalOutput += qty;
                    }
                });
            });

            (plan.items || []).forEach(item => {
                const itemConsumptions = plan.consumptions?.[item.itemCode] || null;
                const itemOutputs = item.outputs || [];
                
                if (itemOutputs.length > 0) {
                    let totalConsumedQty = 0;
                    let totalConsumedCost = 0;
                    const rawConsumptionDetails = [];
        
                    if (itemConsumptions && itemConsumptions.materials) {
                        ['top', 'foam', 'adhesive', 'packing'].forEach(phase => {
                            const arr = itemConsumptions.materials[phase] || [];
                            arr.forEach(m => {
                                const actualQty = m.adjustedValue !== undefined && m.adjustedValue !== '' ? parseFloat(m.adjustedValue) : parseFloat(m.value) || 0;
                                const targetQty = parseFloat(m.bomValue) || 0;
                                if (actualQty > 0 || targetQty > 0) {
                                    const materialItem = state.items?.find(i => i.id === m.id || i.sku === m.id || i.sku === m.itemCode || i.id === m.itemCode);
                                    const priceStr = materialItem?.price ? String(materialItem.price).replace(/[^0-9.]/g, '') : '0';
                                    const price = parseFloat(priceStr) || 0;
                                    const cost = actualQty * price;
                                    
                                    totalConsumedQty += actualQty;
                                    totalConsumedCost += cost;
                                    
                                    rawConsumptionDetails.push({
                                        id: m.id || m.itemCode || (materialItem ? materialItem.id : m.name),
                                        name: m.name,
                                        unit: m.unit || materialItem?.uom || 'Unit',
                                        target: targetQty,
                                        actual: actualQty,
                                        price: price
                                    });
                                }
                            });
                        });
                    }

                    // Proportional distribution based on actual produced output of this item
                    let itemProducedQty = 0;
                    (item.outputs || []).forEach(out => {
                        const qty = parseFloat(out.quantity) || 0;
                        const isWastage = out.typeName?.toLowerCase().includes('wastage');
                        if (!isWastage) {
                            itemProducedQty += qty;
                        }
                    });

                    const proportion = planTotalOutput > 0 ? (itemProducedQty / planTotalOutput) : (1 / (plan.items?.length || 1));

                    // Add distributed other consumptions
                    planOtherCons.forEach(oc => {
                        const splitQty = (parseFloat(oc.quantity) || 0) * proportion;
                        const splitCost = ((parseFloat(oc.quantity) || 0) * (parseFloat(oc.price) || 0)) * proportion;
                        
                        totalConsumedQty += splitQty;
                        totalConsumedCost += splitCost;
                        
                        rawConsumptionDetails.push({
                            id: oc.itemCode || oc.itemId,
                            name: `${oc.itemName} (Other Cons. Split)`,
                            unit: oc.unit || 'Unit',
                            target: 0,
                            actual: splitQty,
                            price: parseFloat(oc.price) || 0
                        });
                    });

                    // Combine/Group duplicate raw materials to sum quantities & costs
                    const combinedMap = {};
                    rawConsumptionDetails.forEach(m => {
                        const key = m.id || m.name;
                        if (!combinedMap[key]) {
                            combinedMap[key] = {
                                id: m.id,
                                name: m.name,
                                unit: m.unit,
                                target: 0,
                                actual: 0,
                                price: m.price
                            };
                        }
                        combinedMap[key].target += m.target;
                        combinedMap[key].actual += m.actual;
                    });
 
                    const consumptionDetails = Object.values(combinedMap).map(m => {
                        const cost = m.actual * m.price;
                        let variance = 0;
                        if (m.target > 0) {
                            variance = ((m.actual - m.target) / m.target) * 100;
                        } else if (m.actual > 0) {
                            variance = 100;
                        }
                        return {
                            ...m,
                            cost,
                            variance
                        };
                    });
        
                    let totalOutputQty = 0;
                    let totalOutputValue = 0;
                    const outputDetails = [];
        
                    const productItem = state.items?.find(i => i.sku === item.itemCode || i.id === item.itemCode || i.name === item.productName);
                    const productPriceStr = productItem?.price ? String(productItem.price).replace(/[^0-9.]/g, '') : '0';
                    const productPrice = parseFloat(productPriceStr) || 0;
        
                    const batchTypes = state.batchOutputTypes || [
                        { id: 1, name: 'Finished Good', uom: 'Meters', category: 'Finish Good' },
                        { id: 2, name: 'Wastage', uom: 'Kgs', category: 'Wastage' },
                        { id: 3, name: 'B-Grade', uom: 'Meters', category: 'Finish Good' }
                    ];
 
                    itemOutputs.forEach(out => {
                        const qty = parseFloat(out.quantity) || 0;
                        if (qty > 0) {
                            const typeObj = batchTypes.find(t => String(t.id) === String(out.typeId) || t.name === out.typeName);
                            const isWastage = (typeObj && typeObj.category) 
                                ? typeObj.category === 'Wastage' 
                                : out.typeName?.toLowerCase().includes('wastage');
                            
                            const val = qty * productPrice;
                            if (!isWastage) {
                                totalOutputQty += qty;
                                totalOutputValue += val;
                            }
                            
                            outputDetails.push({
                                typeName: out.typeName,
                                quantity: qty,
                                value: val,
                                uom: out.uom || productItem?.uom || 'kg',
                                isWastage: isWastage
                            });
                        }
                    });
        
                    let efficiency = 0;
                    if (totalConsumedQty > 0) {
                        efficiency = (totalOutputQty / totalConsumedQty) * 100;
                    }
        
                    const reqQty = parseFloat(item.quantity || 0);
                    const isCompleted = (totalOutputQty >= reqQty && reqQty > 0) || plan.status === 'Completed';
        
                    batches.push({
                        batchCode: item.itemCode,
                        productName: item.productName,
                        date: itemOutputs[0]?.date || plan.createdAt || new Date().toISOString(),
                        status: isCompleted ? 'Completed' : 'Partial',
                        totalConsumedQty,
                        totalConsumedCost,
                        totalOutputQty,
                        totalOutputValue,
                        efficiency,
                        consumptionDetails,
                        outputDetails,
                        planId: plan.id,
                        requestedQty: reqQty
                    });
                }
            });
        });
        
        return batches.sort((a,b) => new Date(b.date) - new Date(a.date));
    }, [state.productionPlans, state.items, state.otherConsumptions]);

    const filteredBatches = useMemo(() => {
        let result = allBatches;
        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            result = result.filter(b => 
                (b.batchCode && b.batchCode.toLowerCase().includes(lower)) ||
                (b.productName && b.productName.toLowerCase().includes(lower))
            );
        }
        
        if (dateFilter === 'Last 30 Days') {
            const limit = new Date();
            limit.setDate(limit.getDate() - 30);
            result = result.filter(b => new Date(b.date) >= limit);
        } else if (dateFilter === 'Last 7 Days') {
            const limit = new Date();
            limit.setDate(limit.getDate() - 7);
            result = result.filter(b => new Date(b.date) >= limit);
        }
        
        return result;
    }, [allBatches, searchTerm, dateFilter]);

    const displayedBatches = useMemo(() => {
        if (!isPaginated) return filteredBatches;
        const start = (currentPage - 1) * itemsPerPage;
        return filteredBatches.slice(start, start + itemsPerPage);
    }, [filteredBatches, isPaginated, currentPage, itemsPerPage]);

    const formatCurrency = (val) => `${currencySymbol}${parseFloat(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const formatDate = (d) => new Date(d).toLocaleString('en-GB', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    if (selectedBatch) {
        return <BatchSpecificationDetail batch={selectedBatch} onBack={() => setSelectedBatch(null)} formatCurrency={formatCurrency} formatDate={formatDate} />;
    }

    return (
        <div className="flex flex-col h-full overflow-hidden bg-background">
            <div className="flex-1 overflow-y-auto p-8 lg:px-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
                    <div>
                        <h2 className="font-display text-3xl font-bold text-on-surface tracking-tight">Batch Production History</h2>
                        <p className="text-on-surface-variant font-body text-sm mt-2 max-w-xl">Comprehensive ledger of synthetic material outputs, consumption metrics, and production yields.</p>
                    </div>
                    <div className="flex flex-wrap gap-3 items-center bg-surface-container-low p-2 rounded-xl border border-outline-variant/10">
                        <select 
                            className="bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-3 py-2 text-sm text-on-surface focus:ring-primary focus:border-primary"
                            value={dateFilter}
                            onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
                        >
                            <option value="All Time">All Time</option>
                            <option value="Last 30 Days">Last 30 Days</option>
                            <option value="Last 7 Days">Last 7 Days</option>
                        </select>
                        <div className="flex items-center bg-surface-container-lowest rounded-lg px-3 py-2 shadow-sm border border-outline-variant/10 focus-within:border-primary transition-colors">
                            <span className="material-symbols-outlined text-on-surface-variant text-[18px] mr-2">search</span>
                            <input 
                                className="bg-transparent border-none p-0 text-sm font-body text-on-surface w-40 focus:ring-0 placeholder-outline-variant" 
                                placeholder="Search Batch ID..." 
                                type="text"
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-6">
                    {displayedBatches.map((batch, idx) => {
                        const getStatusColor = (eff) => {
                            if (eff > 95) return 'bg-primary';
                            if (eff > 85) return 'bg-secondary';
                            if (eff > 75) return 'bg-[#d97706]'; // amber
                            return 'bg-tertiary';
                        };
                        const getStatusTextClass = (eff) => {
                            if (eff > 95) return 'text-primary';
                            if (eff > 85) return 'text-secondary';
                            if (eff > 75) return 'text-[#d97706]'; // amber
                            return 'text-tertiary';
                        };

                        return (
                            <div key={`${batch.batchCode}-${idx}`} className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/10 flex flex-col relative overflow-hidden group hover:shadow-md transition-all duration-300">
                                <div className={`absolute top-0 left-0 w-full h-1 ${getStatusColor(batch.efficiency)}`}></div>
                                <div className="flex justify-between items-start mb-5">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="font-display font-bold text-lg text-primary tracking-wide">#{batch.batchCode}</span>
                                            <span className={`text-xs font-medium px-2 py-0.5 rounded flex items-center gap-1 ${batch.status === 'Completed' ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container-high text-on-surface-variant'}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${batch.status === 'Completed' ? 'bg-primary' : 'bg-outline'}`}></span> {batch.status}
                                            </span>
                                        </div>
                                        <h3 className="font-body font-semibold text-on-surface text-xl">{batch.productName}</h3>
                                    </div>
                                    <span className="text-xs text-on-surface-variant font-body font-medium bg-surface px-2.5 py-1 rounded-md border border-outline-variant/10">
                                        {formatDate(batch.date)}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 bg-surface-container-low rounded-xl p-4 mb-5 border border-outline-variant/5">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-body text-on-surface-variant mb-1 uppercase tracking-wider font-semibold">Material Consumed</span>
                                        <span className="font-display font-bold text-on-surface text-lg">{batch.totalConsumedQty.toLocaleString(undefined, { maximumFractionDigits: 2 })} units</span>
                                        <span className="text-xs font-body text-secondary mt-0.5 font-medium">Cost: {formatCurrency(batch.totalConsumedCost)}</span>
                                    </div>
                                    <div className="flex flex-col border-l border-outline-variant/10 pl-4">
                                        <span className="text-xs font-body text-on-surface-variant mb-1 uppercase tracking-wider font-semibold">Finished Output</span>
                                        <span className="font-display font-bold text-on-surface text-lg">{batch.totalOutputQty.toLocaleString(undefined, { maximumFractionDigits: 2 })} units</span>
                                        <span className="text-xs font-body text-primary mt-0.5 font-medium">Value: {formatCurrency(batch.totalOutputValue)}</span>
                                    </div>
                                </div>
                                <div className="mb-6">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-sm font-body font-medium text-on-surface">Yield Efficiency</span>
                                        <span className={`text-sm font-display font-bold ${getStatusTextClass(batch.efficiency)}`}>
                                            {batch.efficiency.toFixed(1)}%
                                        </span>
                                    </div>
                                    <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden flex">
                                        <div className={`h-full ${getStatusColor(batch.efficiency)} rounded-full`} style={{ width: `${Math.min(100, Math.max(0, batch.efficiency))}%` }}></div>
                                    </div>
                                </div>
                                <div className="mt-auto flex justify-between items-center pt-2">
                                    <button 
                                        onClick={() => setSelectedBatch(batch)}
                                        className="text-primary hover:text-primary-container font-display font-bold text-sm flex items-center gap-1 transition-colors"
                                    >
                                        View Detailed Specs <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                    {displayedBatches.length === 0 && (
                        <div className="col-span-full py-12 flex flex-col items-center justify-center text-on-surface-variant bg-surface-container-lowest rounded-xl border border-outline-variant/20 border-dashed">
                            <span className="material-symbols-outlined text-4xl mb-3 text-outline">inbox</span>
                            <p className="font-medium">No master batch records found</p>
                            <p className="text-sm mt-1">Batches will appear here once outputs and consumptions are recorded.</p>
                        </div>
                    )}
                </div>
            </div>
            
            <GlobalPagination 
                totalItems={filteredBatches.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
        </div>
    );
}

function BatchSpecificationDetail({ batch, onBack, formatCurrency, formatDate }) {
    // Separate finished goods and wastage
    const finishedGoodsList = batch.outputDetails.filter(o => !o.isWastage);
    const wastageList = batch.outputDetails.filter(o => o.isWastage);

    const totalFgQty = finishedGoodsList.reduce((sum, o) => sum + o.quantity, 0);
    const fgValue = finishedGoodsList.reduce((sum, o) => sum + o.value, 0);
    const wastageQty = wastageList.reduce((sum, o) => sum + o.quantity, 0);
    const wastageValue = wastageList.reduce((sum, o) => sum + o.value, 0);
    
    const totalCost = batch.totalConsumedCost;
    
    // Calculate other consumption cost portion
    const otherConsumptionCost = batch.consumptionDetails
        .filter(c => c.name && c.name.includes('(Other Cons. Split)'))
        .reduce((sum, c) => sum + (c.cost || 0), 0);
        
    const rawMaterialCost = totalCost - otherConsumptionCost;
    const costPerFgUnit = totalFgQty > 0 ? (totalCost / totalFgQty) : 0;
    const fgUom = finishedGoodsList[0]?.uom || 'Unit';

    const handlePrintBatch = (batch) => {
        const printWindow = window.open('', '_blank');
        const consumptionRows = batch.consumptionDetails.map(m => `
            <tr>
                <td>${m.name}</td>
                <td style="text-align: right;">${m.target > 0 ? `${m.target.toLocaleString(undefined, {maximumFractionDigits:2})} ${m.unit}` : '-'}</td>
                <td style="text-align: right; font-weight: bold;">${m.actual.toLocaleString(undefined, {maximumFractionDigits:2})} ${m.unit}</td>
                <td style="text-align: right;">$${parseFloat(m.price || 0).toFixed(2)}</td>
                <td style="text-align: right; font-weight: bold;">$${parseFloat(m.cost || 0).toFixed(2)}</td>
                <td style="text-align: center;">${m.target > 0 ? `${m.variance > 0 ? '+' : ''}${m.variance.toFixed(1)}%` : '-'}</td>
            </tr>
        `).join('');

        const outputRows = batch.outputDetails.map(o => `
            <tr>
                <td>${o.typeName}</td>
                <td>${o.isWastage ? 'Wastage Output' : 'Finished Good Yield'}</td>
                <td style="text-align: right; font-weight: bold;">${o.quantity.toLocaleString(undefined, {maximumFractionDigits:2})} ${o.uom}</td>
                <td style="text-align: right; font-weight: bold;">$${parseFloat(o.value || 0).toFixed(2)}</td>
            </tr>
        `).join('');

        printWindow.document.write(`
            <html>
                <head>
                    <title>Master Batch Record - Batch #${batch.batchCode}</title>
                    <style>
                        body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #333; }
                        .header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; text-align: center; }
                        .title { font-size: 24px; font-weight: bold; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 1px; }
                        .subtitle { font-size: 14px; color: #666; }
                        .section-title { font-size: 16px; font-weight: bold; border-bottom: 1px solid #333; padding-bottom: 5px; margin-top: 30px; margin-bottom: 15px; text-transform: uppercase; }
                        .meta-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px; font-size: 13px; }
                        .meta-item { margin-bottom: 5px; }
                        .details-table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
                        .details-table th, .details-table td { border: 1px solid #ddd; padding: 10px 12px; text-align: left; font-size: 11px; }
                        .details-table th { background-color: #f5f5f5; font-weight: bold; text-transform: uppercase; }
                        .summary-box { background-color: #fafafa; border: 1px solid #ddd; padding: 20px; border-radius: 5px; font-size: 13px; }
                        .summary-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
                        .summary-row.total { font-weight: bold; border-top: 1px solid #ccc; padding-top: 8px; margin-top: 8px; font-size: 14px; }
                        .signatures { display: flex; justify-content: space-between; margin-top: 70px; }
                        .signature-line { border-top: 1px solid #333; width: 220px; text-align: center; font-size: 11px; padding-top: 8px; font-weight: bold; }
                        .footer { margin-top: 60px; font-size: 11px; color: #888; text-align: center; border-top: 1px solid #eee; padding-top: 15px; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div class="title">Flashvision ERP</div>
                        <div class="subtitle">Master Batch Production Record</div>
                    </div>
                    
                    <div class="meta-grid">
                        <div class="meta-item"><strong>Batch Reference:</strong> #${batch.batchCode}</div>
                        <div class="meta-item"><strong>Product Name:</strong> ${batch.productName}</div>
                        <div class="meta-item"><strong>Production Date:</strong> ${new Date(batch.date).toLocaleString()}</div>
                        <div class="meta-item"><strong>Batch Status:</strong> ${batch.status}</div>
                        <div class="meta-item"><strong>Requested Output:</strong> ${batch.requestedQty.toLocaleString()} m</div>
                        <div class="meta-item"><strong>Actual Output Yield:</strong> ${batch.totalOutputQty.toLocaleString()} m</div>
                    </div>

                    <div class="section-title">Raw Material Consumption Details</div>
                    <table class="details-table">
                        <thead>
                            <tr>
                                <th>Material Name</th>
                                <th style="text-align: right;">Target Qty</th>
                                <th style="text-align: right;">Actual Qty</th>
                                <th style="text-align: right;">Unit Price</th>
                                <th style="text-align: right;">Total Cost</th>
                                <th style="text-align: center;">Variance</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${consumptionRows}
                        </tbody>
                    </table>

                    <div class="section-title">Output Summary & Yield Breakdown</div>
                    <table class="details-table">
                        <thead>
                            <tr>
                                <th>Output Type</th>
                                <th>Category</th>
                                <th style="text-align: right;">Output Quantity</th>
                                <th style="text-align: right;">Estimated Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${outputRows}
                        </tbody>
                    </table>

                    <div class="section-title">Valuation & Cost Summary</div>
                    <div class="summary-box">
                        <div class="summary-row">
                            <span>Finished Goods Value:</span>
                            <strong>$${parseFloat(fgValue || 0).toFixed(2)}</strong>
                        </div>
                        <div class="summary-row">
                            <span>Wastage Loss Value:</span>
                            <strong>$${parseFloat(wastageValue || 0).toFixed(2)}</strong>
                        </div>
                        <div class="summary-row">
                            <span>Raw Material Cost (BOM):</span>
                            <strong>$${parseFloat(rawMaterialCost || 0).toFixed(2)}</strong>
                        </div>
                        <div class="summary-row">
                            <span>Other Consumption Estimated Cost:</span>
                            <strong>$${parseFloat(otherConsumptionCost || 0).toFixed(2)}</strong>
                        </div>
                        <div class="summary-row total">
                            <span>Total Batch Costing Value:</span>
                            <span>$${parseFloat(totalCost || 0).toFixed(2)}</span>
                        </div>
                        <div class="summary-row" style="margin-top: 10px; font-weight: bold; color: #004277;">
                            <span>Cost per Unit Finished Good:</span>
                            <span>$${parseFloat(costPerFgUnit || 0).toFixed(2)} / ${fgUom}</span>
                        </div>
                    </div>

                    <div style="margin-top: 25px; font-size: 13px;">
                        <strong>Mass Balance Efficiency:</strong> ${batch.efficiency.toFixed(1)}%
                    </div>
                    
                    <div class="signatures">
                        <div class="signature-line">Produced By (Operator)</div>
                        <div class="signature-line">Quality Control Assurance</div>
                        <div class="signature-line">Plant Manager Sign-Off</div>
                    </div>

                    <div class="footer">
                        System Generated Document &bull; Flashvision ERP Master Batch Record
                    </div>
                    
                    <script>
                        window.onload = function() {
                            window.print();
                            setTimeout(function() { window.close(); }, 500);
                        };
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    return (
        <div className="flex flex-col h-full overflow-hidden bg-background">
            <div className="flex-1 overflow-y-auto p-8 lg:p-12">
                <div className="flex items-center justify-between mb-8 flex-wrap gap-4 border-b border-outline-variant/10 pb-6">
                    <div className="flex items-center gap-4">
                        <button onClick={onBack} className="p-2 bg-surface hover:bg-surface-container-low rounded-full transition-colors border border-outline-variant/20 shadow-sm text-on-surface-variant flex items-center justify-center">
                            <span className="material-symbols-outlined text-xl">arrow_back</span>
                        </button>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <span className="bg-primary-container text-on-primary-container text-xs px-2 py-0.5 rounded font-bold uppercase tracking-wider">{batch.status}</span>
                                <span className="text-on-surface-variant text-sm font-medium">{formatDate(batch.date)}</span>
                            </div>
                            <h2 className="font-display text-3xl font-bold text-on-surface tracking-tight leading-none">
                                Batch #{batch.batchCode} - <span className="text-primary font-manrope">{batch.productName}</span>
                            </h2>
                        </div>
                    </div>
                    <div>
                        <button 
                            onClick={() => handlePrintBatch(batch)}
                            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-on-primary font-label font-semibold hover:opacity-90 transition-opacity shadow-sm"
                        >
                            <span className="material-symbols-outlined text-sm">print</span>
                            Print Batch Record
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 pb-12">
                    <div className="xl:col-span-8 space-y-6">
                        <h3 className="font-display text-xl font-bold text-on-surface">Raw Material Consumption</h3>
                        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs border-collapse">
                                    <thead>
                                        <tr className="bg-surface-container-low text-on-surface-variant font-bold border-b border-outline-variant/10">
                                            <th className="py-3.5 px-4">Material Name</th>
                                            <th className="py-3.5 px-4 text-right">Target Qty</th>
                                            <th className="py-3.5 px-4 text-right">Actual Qty</th>
                                            <th className="py-3.5 px-4 text-right">Unit Price</th>
                                            <th className="py-3.5 px-4 text-right">Total Cost</th>
                                            <th className="py-3.5 px-4 text-center">Variance</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-outline-variant/5">
                                        {batch.consumptionDetails.map((m, idx) => (
                                            <tr key={idx} className="hover:bg-surface-container-low/20 transition-colors">
                                                <td className="py-3 px-4 font-semibold text-on-surface">{m.name}</td>
                                                <td className="py-3 px-4 text-right font-medium">{m.target > 0 ? `${m.target.toLocaleString(undefined, {maximumFractionDigits:2})} ${m.unit}` : '-'}</td>
                                                <td className="py-3 px-4 text-right font-bold text-on-surface">{m.actual.toLocaleString(undefined, {maximumFractionDigits:2})} {m.unit}</td>
                                                <td className="py-3 px-4 text-right font-medium">{formatCurrency(m.price)}</td>
                                                <td className="py-3 px-4 text-right font-bold text-primary">{formatCurrency(m.cost)}</td>
                                                <td className="py-3 px-4 text-center">
                                                    {m.target > 0 ? (
                                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${m.variance > 10 ? 'bg-error-container text-on-error-container' : m.variance < -10 ? 'bg-tertiary-container text-on-tertiary-container' : 'bg-surface-container text-on-surface-variant'}`}>
                                                            {m.variance > 0 ? '+' : ''}{m.variance.toFixed(1)}%
                                                        </span>
                                                    ) : (
                                                        <span className="text-on-surface-variant opacity-40">-</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="xl:col-span-4 space-y-6">
                        <h3 className="font-display text-xl font-bold text-on-surface">Batch Costing & Valuation</h3>
                        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10 p-6 flex flex-col gap-4">
                            {/* Raw details list */}
                            <div className="space-y-3">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-label mb-1">Output Breakdown</span>
                                {batch.outputDetails.map((out, idx) => (
                                    <div key={idx} className={`flex items-center justify-between p-3.5 rounded-xl border ${out.isWastage ? 'bg-error-container/10 border-error/20 border-l-4 border-l-error' : 'bg-primary-fixed/20 border-primary/20 border-l-4 border-l-primary'}`}>
                                        <div>
                                            <h4 className="font-bold text-on-surface text-sm mb-0.5">{out.typeName}</h4>
                                            <p className="text-on-surface-variant text-[10px] font-semibold">{out.isWastage ? 'Wastage Output' : 'Finished Good Yield'}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`font-display text-base font-extrabold ${out.isWastage ? 'text-error' : 'text-primary'}`}>{out.quantity.toLocaleString(undefined, {maximumFractionDigits:2})} {out.uom}</span>
                                            <div className="text-[11px] font-bold text-on-surface-variant mt-0.5">{formatCurrency(out.value)}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Separator / Valuation Summary */}
                            <div className="border-t border-outline-variant/15 pt-4 flex flex-col gap-3">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-label">Valuation & Cost Summary</span>
                                
                                <div className="flex justify-between items-center text-xs font-semibold">
                                    <span className="text-on-surface-variant">Finished Goods Value:</span>
                                    <span className="font-extrabold text-primary-dim text-sm">{formatCurrency(fgValue)}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs font-semibold">
                                    <span className="text-on-surface-variant">Wastage Loss Value:</span>
                                    <span className="font-extrabold text-error-dim text-sm">{formatCurrency(wastageValue)}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs font-semibold">
                                    <span className="text-on-surface-variant">Raw Material Cost (BOM):</span>
                                    <span className="font-extrabold text-secondary text-sm">{formatCurrency(rawMaterialCost)}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs font-semibold">
                                    <span className="text-on-surface-variant">Other Consumption Estimated Cost:</span>
                                    <span className="font-extrabold text-tertiary text-sm">{formatCurrency(otherConsumptionCost)}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs font-semibold">
                                    <span className="text-on-surface-variant">Total Costing Value:</span>
                                    <span className="font-extrabold text-secondary text-sm">{formatCurrency(totalCost)}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs font-semibold bg-surface-container/30 p-2.5 rounded-lg border border-outline-variant/5">
                                    <span className="text-on-surface font-bold">Cost per Unit Finished Good:</span>
                                    <span className="font-extrabold text-primary text-sm">{formatCurrency(costPerFgUnit)} / {fgUom}</span>
                                </div>
                            </div>

                            {/* Mass balance */}
                            <div className="mt-2 pt-4 border-t border-outline-variant/15">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-label mb-2">Mass Balance</span>
                                <div className="flex justify-between items-center text-xs font-semibold">
                                    <span className="text-on-surface-variant">Total Input Mass:</span>
                                    <span className="font-bold text-on-surface">{batch.totalConsumedQty.toLocaleString(undefined, {maximumFractionDigits:2})} units</span>
                                </div>
                                <div className="flex justify-between items-center text-xs font-semibold mt-2">
                                    <span className="text-on-surface-variant">Total Output Mass:</span>
                                    <span className="font-bold text-on-surface">{batch.totalOutputQty.toLocaleString(undefined, {maximumFractionDigits:2})} units</span>
                                </div>
                                <div className="flex justify-between items-center text-xs font-semibold mt-3 pt-3 border-t border-outline-variant/10">
                                    <span className="text-on-surface-variant font-bold">Volatile / Yield Loss:</span>
                                    <span className={`font-extrabold ${batch.totalConsumedQty - batch.totalOutputQty > 0 ? 'text-tertiary' : 'text-primary'}`}>
                                        {(batch.totalConsumedQty - batch.totalOutputQty).toLocaleString(undefined, {maximumFractionDigits:2})} units
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
