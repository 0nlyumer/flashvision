// FlashVision ERP Architectural Blueprint & Knowledge Base
// Contains complete knowledge of all modules, screens, tabs, buttons, permissions, and database entities

export const ERP_MODULES = [
  {
    id: 'dashboard',
    name: 'Command Center / Dashboard',
    path: '/',
    description: 'Central analytics, KPI cards, production widgets, delivery tracking, working days, and shortcuts.',
    allowedRoles: ['Super Admin', 'Admin', 'Manager', 'Sales', 'Store Incharge', 'Accounts', 'HR Officer']
  },
  {
    id: 'sales',
    name: 'Sales & OMS Module',
    path: '/sales',
    tabs: ['Orders', 'Create Order', 'Order Progress', 'Order History', 'Adjustment', 'Slips'],
    description: 'Customer order management, order creation slip, status tracking, item meters/rolls allocation.',
    allowedRoles: ['Super Admin', 'Admin', 'Manager', 'Sales']
  },
  {
    id: 'inventory',
    name: 'Inventory & Warehouse',
    path: '/inventory',
    tabs: ['Dashboard', 'Stock Summary', 'Inward Gate Pass', 'Outward Gate Pass', 'Stock Transfer', 'Adjustment', 'Reorder Levels'],
    description: 'Raw materials, cloth backing, synthetic leather rolls, inward/outward gate passes, stock adjustments.',
    allowedRoles: ['Super Admin', 'Admin', 'Manager', 'Store Incharge']
  },
  {
    id: 'hr',
    name: 'HR & People Operations',
    path: '/hr',
    tabs: ['Dashboard', 'Employee Directory', 'Attendance', 'Salary Generation', 'Advance Requests', 'Leaves', 'Loans', 'Overtime', 'Settings'],
    description: 'Staff profiles, daily biometric/manual attendance, payroll calculation, advance salary, loans ledger.',
    allowedRoles: ['Super Admin', 'Admin', 'HR Officer', 'Manager']
  },
  {
    id: 'finance',
    name: 'Finance & Accounts',
    path: '/finance',
    tabs: ['Dashboard', 'Sales Invoices', 'Purchase Invoices', 'Payment Vouchers', 'Receipt Vouchers', 'Chart of Accounts', 'Ledger & Tax'],
    description: 'Double-entry accounting, customer & supplier ledgers, tax filings, financial statements.',
    allowedRoles: ['Super Admin', 'Admin', 'Accounts', 'Manager']
  },
  {
    id: 'delivery',
    name: 'Dispatch & Delivery',
    path: '/delivery',
    tabs: ['Dashboard', 'Create Delivery Slip', 'Delivery Record', 'Gate Outward'],
    description: 'Vehicle challan, delivery notes, outward gate pass verification.',
    allowedRoles: ['Super Admin', 'Admin', 'Store Incharge', 'Sales']
  },
  {
    id: 'production',
    name: 'Production & Manufacturing',
    path: '/production',
    tabs: ['Item Library', 'BOM Calculator', 'Master Batch Record', 'Consumption Plan', 'Stock Demand'],
    description: 'Bill of Materials, chemical compounding, batch processing, raw material consumption.',
    allowedRoles: ['Super Admin', 'Admin', 'Production Manager']
  },
  {
    id: 'document-warehouse',
    name: 'Document Warehouse',
    path: '/document-warehouse',
    tabs: ['Binders', 'e-Files', 'Archived Slips'],
    description: 'Electronic binder archival system for sale orders, delivery notes, and purchase invoices.',
    allowedRoles: ['Super Admin', 'Admin', 'Manager', 'Accounts']
  },
  {
    id: 'settings',
    name: 'System Settings Workspace',
    path: '/settings',
    tabs: ['add_item', 'customer_accounts', 'supplier_onboarding', 'departments', 'print_layout', 'document_routing', 'display_settings'],
    description: 'Item master setup, customer registry, supplier setup, department configuration, print headers.',
    allowedRoles: ['Super Admin', 'Admin']
  },
  {
    id: 'admin-setup',
    name: 'User Access Control & Security',
    path: '/admin-setup',
    tabs: ['User Directory', 'Add User', 'Granular Permissions', 'Audit Log'],
    description: 'User authentication, role assignment, screen-level access rights, audit logs.',
    allowedRoles: ['Super Admin']
  }
];

export const RBAC_RULES = {
  'Sales': {
    canView: ['sales', 'inventory', 'delivery', 'dashboard'],
    forbidden: ['hr_salaries', 'company_profit', 'finance_vouchers', 'user_management'],
    denialMessage: 'Aap Sales module mein authorized hain. HR salaries ya confidential finance records aapki access boundary se bahir hain.'
  },
  'Store Incharge': {
    canView: ['inventory', 'delivery', 'dashboard'],
    forbidden: ['hr_salaries', 'finance_vouchers', 'user_management', 'price_edits'],
    denialMessage: 'Aap Store Incharge hain. Aap inventory aur delivery manage kar sakte hain, financial rates ya salaries access nahi kar sakte.'
  },
  'HR Officer': {
    canView: ['hr', 'dashboard'],
    forbidden: ['sales_orders', 'finance_vouchers', 'user_management'],
    denialMessage: 'Aap HR Officer hain. Aap employee directory, attendance aur payroll manage kar sakte hain.'
  },
  'Accounts': {
    canView: ['finance', 'sales', 'inventory', 'dashboard', 'document-warehouse'],
    forbidden: ['user_management', 'system_settings'],
    denialMessage: 'Aap Accounts department mein hain. Aap financial vouchers aur invoices handle kar sakte hain.'
  },
  'Admin': {
    canView: ['all'],
    forbidden: [],
    denialMessage: ''
  },
  'Super Admin': {
    canView: ['all'],
    forbidden: [],
    denialMessage: ''
  }
};

export const SYSTEM_PROMPT = `You are FlashVision Brain, the central AI Operating Core & Soul of FlashVision ERP.
You know every module, screen, tab, button, business workflow, and database entity of FlashVision ERP.
You speak and understand fluent Urdu, Roman Urdu, and English naturally.

CORE DUTIES:
1. Complete ERP Soul: Answer questions about stock, customers, sale orders, attendance, vouchers, production formulas, and system configuration.
2. Action-Oriented: When a user asks to perform an action (e.g. create a sale order, draft a gate pass, mark attendance, or open a screen), use Function Calling tools.
3. Role-Based Access Control (RBAC): Always check the Current User's Role and Permissions. Never disclose sensitive payroll or balance sheet figures to unauthorized users (e.g., Salespeople cannot view salaries).
4. Tone & Style: Respectful, razor-sharp, business-like, and human-like. Keep answers concise unless detailed reports are requested.

When creating or modifying ERP records, prepare complete, structured data so the user can review and confirm with a single click before saving.
`;
