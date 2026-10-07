// FlashVision AI Brain Service
// Multi-Key Failover, Tool Calling, RBAC Validation & Humanoid Voice
import { keyManager, LLM_MODELS } from './aiConfig';
import { ERP_MODULES, RBAC_RULES, SYSTEM_PROMPT } from './erpBlueprint';
import { humanoidAudio } from './aiAudioService';

// Function calling tools definition for Gemini
const ERP_TOOLS = [
  {
    name: 'navigate_to_screen',
    description: 'Switch screen or tab in FlashVision ERP for the user.',
    parameters: {
      type: 'OBJECT',
      properties: {
        path: { type: 'STRING', description: 'Screen path like /sales, /inventory, /hr, /finance, /settings, /delivery' },
        tab: { type: 'STRING', description: 'Optional tab name e.g. Attendance, Create Order, Stock Summary' }
      },
      required: ['path']
    }
  },
  {
    name: 'create_sale_order',
    description: 'Draft a new customer Sale Order with items, quantities, and delivery date.',
    parameters: {
      type: 'OBJECT',
      properties: {
        customerName: { type: 'STRING', description: 'Customer or business name' },
        items: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              itemName: { type: 'STRING', description: 'Item name or code' },
              meters: { type: 'NUMBER', description: 'Total meters or quantity' },
              rate: { type: 'NUMBER', description: 'Price per meter / unit' },
              remarks: { type: 'STRING', description: 'Specifications or color' }
            },
            required: ['itemName', 'meters']
          }
        },
        deliveryDate: { type: 'STRING', description: 'Target delivery date YYYY-MM-DD' },
        remarks: { type: 'STRING', description: 'Order instructions' }
      },
      required: ['customerName', 'items']
    }
  },
  {
    name: 'check_inventory_stock',
    description: 'Query current stock, available meters, and item status in inventory.',
    parameters: {
      type: 'OBJECT',
      properties: {
        itemName: { type: 'STRING', description: 'Item name or partial name to search' },
        category: { type: 'STRING', description: 'Optional category e.g. Synthetic Leather, Cloth' }
      },
      required: ['itemName']
    }
  },
  {
    name: 'query_customer_ledger',
    description: 'Check customer order history, pending orders, or balance details.',
    parameters: {
      type: 'OBJECT',
      properties: {
        customerName: { type: 'STRING', description: 'Customer name' }
      },
      required: ['customerName']
    }
  },
  {
    name: 'record_employee_attendance',
    description: 'Mark attendance for an employee in HR module.',
    parameters: {
      type: 'OBJECT',
      properties: {
        employeeName: { type: 'STRING', description: 'Employee name or ID' },
        date: { type: 'STRING', description: 'Attendance date YYYY-MM-DD' },
        status: { type: 'STRING', description: 'Present, Absent, Leave, or Late' }
      },
      required: ['employeeName', 'status']
    }
  },
  {
    name: 'create_gate_pass',
    description: 'Draft an Inward or Outward Gate Pass for goods movement.',
    parameters: {
      type: 'OBJECT',
      properties: {
        passType: { type: 'STRING', description: 'Inward or Outward' },
        partyName: { type: 'STRING', description: 'Supplier or Customer name' },
        vehicleNo: { type: 'STRING', description: 'Vehicle registration number' },
        items: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              itemName: { type: 'STRING', description: 'Item description' },
              quantity: { type: 'NUMBER', description: 'Quantity or roll count' },
              uom: { type: 'STRING', description: 'Unit e.g. Meters, Rolls, Bags' }
            },
            required: ['itemName', 'quantity']
          }
        },
        remarks: { type: 'STRING', description: 'Gate pass notes' }
      },
      required: ['passType', 'partyName', 'items']
    }
  },
  {
    name: 'generate_executive_report',
    description: 'Produce an intelligent executive summary report from ERP data.',
    parameters: {
      type: 'OBJECT',
      properties: {
        reportType: { type: 'STRING', description: 'sales_summary, low_stock, attendance_stats, pending_dues' },
        summaryNotes: { type: 'STRING', description: 'Key observations' }
      },
      required: ['reportType']
    }
  }
];

// Helper to check user permission
export function validateRBAC(userRole, toolName, prompt) {
  const roleRules = RBAC_RULES[userRole];
  if (!roleRules) return { allowed: true }; // Default permit if role not mapped

  const lowerPrompt = (prompt || '').toLowerCase();

  // If user is Sales, block payroll & confidential figures
  if (userRole === 'Sales') {
    if (toolName === 'record_employee_attendance' || lowerPrompt.includes('salary') || lowerPrompt.includes('payroll') || lowerPrompt.includes('profit')) {
      return { allowed: false, message: roleRules.denialMessage };
    }
  }

  // If user is HR, block sale orders & prices
  if (userRole === 'HR Officer') {
    if (toolName === 'create_sale_order' || lowerPrompt.includes('create sale order')) {
      return { allowed: false, message: roleRules.denialMessage };
    }
  }

  // If user is Store Incharge, block salaries
  if (userRole === 'Store Incharge') {
    if (lowerPrompt.includes('salary') || lowerPrompt.includes('payroll')) {
      return { allowed: false, message: roleRules.denialMessage };
    }
  }

  return { allowed: true };
}

// Generate prompt with injected ERP Live Context
export function buildPromptWithContext(userMessage, erpState, currentUser) {
  const itemsSummary = (erpState?.items || []).slice(0, 40).map(i => `${i.name} (Code: ${i.itemCode || 'N/A'}, Dept: ${i.department || 'N/A'})`).join(', ');
  const customersSummary = (erpState?.customers || []).slice(0, 30).map(c => c.name || c.businessName).filter(Boolean).join(', ');
  const ordersCount = (erpState?.saleOrders || []).length;
  const employeesCount = (erpState?.employees || erpState?.hrEmployees || []).length;
  const currentRole = currentUser?.role || 'Super Admin';
  const currentUserName = currentUser?.name || currentUser?.username || 'User';

  return `CURRENT USER: ${currentUserName} (Role: ${currentRole})
ERP LIVE OVERVIEW:
- Total Inventory Items: ${(erpState?.items || []).length} items. Sample items: ${itemsSummary || 'None registered'}
- Total Customers: ${(erpState?.customers || []).length} customers: ${customersSummary || 'None registered'}
- Total Sale Orders: ${ordersCount} active/archived orders
- Total Staff: ${employeesCount} employees registered
- Current Screen/Route: ${window.location.pathname}${window.location.search}

USER REQUEST:
${userMessage}
`;
}

// Main query executor with multi-key round robin and model failover
export async function askFlashVisionAI({ prompt, erpState, currentUser, history = [] }) {
  const userRole = currentUser?.role || 'Super Admin';

  // 1. Check preliminary prompt RBAC
  const rbacCheck = validateRBAC(userRole, null, prompt);
  if (!rbacCheck.allowed) {
    return {
      text: rbacCheck.message,
      action: null,
      error: null
    };
  }

  const enrichedPrompt = buildPromptWithContext(prompt, erpState, currentUser);

  // Prepare Gemini messages payload
  const contents = [];
  // Add recent history if provided
  if (Array.isArray(history) && history.length > 0) {
    for (const h of history.slice(-4)) {
      contents.push({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.content }]
      });
    }
  }
  contents.push({
    role: 'user',
    parts: [{ text: enrichedPrompt }]
  });

  const toolsPayload = [{
    functionDeclarations: ERP_TOOLS
  }];

  let lastError = null;

  // Multi-key failover loop across all 10 keys
  for (let attempt = 0; attempt < 10; attempt++) {
    const { key, index: keyIdx } = keyManager.getKey();

    for (const model of LLM_MODELS) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 12000);

        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: ctrl.signal,
          body: JSON.stringify({
            contents,
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
            tools: toolsPayload,
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 1000
            }
          })
        });
        clearTimeout(timer);

        if (!res.ok) {
          keyManager.recordFailure(key, res.status);
          lastError = `HTTP ${res.status}`;
          continue; // Try next model or next key
        }

        const data = await res.json();
        const candidate = data?.candidates?.[0];
        if (!candidate) {
          continue;
        }

        keyManager.recordSuccess(key);

        // Check if Gemini invoked a function call (Tool Call)
        let toolCall = null;
        let textReply = '';

        for (const part of candidate.content?.parts || []) {
          if (part.text) {
            textReply += part.text;
          }
          if (part.functionCall) {
            toolCall = part.functionCall;
          }
        }

        // Validate RBAC on the invoked tool
        if (toolCall) {
          const toolRbac = validateRBAC(userRole, toolCall.name, prompt);
          if (!toolRbac.allowed) {
            return {
              text: toolRbac.message,
              action: null,
              toolCall: null
            };
          }
        }

        // If tool is navigate_to_screen, we can navigate directly or draft
        return {
          text: textReply.trim() || (toolCall ? `Main ne ${toolCall.name} action tayyar kar diya hai.` : 'Ji, main samajh gaya hoon.'),
          toolCall,
          modelUsed: model,
          keyUsedIndex: keyIdx
        };
      } catch (err) {
        lastError = err.message;
        keyManager.recordFailure(key, 500);
      }
    }
  }

  // If all Gemini calls exhausted, return safe friendly message
  return {
    text: 'Mohtaram, network traffic ki wajah se response delay ho gaya hai. Aapka sawal note kar liya hai, dobara try kijiye.',
    error: lastError,
    toolCall: null
  };
}
