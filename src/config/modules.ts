export interface FieldDef {
  key: string
  label: string
  type?: 'text' | 'number' | 'date' | 'select' | 'textarea'
  options?: string[]
  required?: boolean
  width?: number
}

export interface ModuleDef {
  title: string
  fields: FieldDef[]
  sample?: Record<string, unknown>[]
}

const d = (n: number) => {
  const dt = new Date()
  dt.setDate(dt.getDate() - n)
  return dt.toISOString().slice(0, 10)
}

export const modules: Record<string, ModuleDef> = {
  /* ---------- Products ---------- */
  batches: {
    title: 'Batches',
    fields: [
      { key: 'batchNo', label: 'Batch No', required: true },
      { key: 'product', label: 'Product', required: true },
      { key: 'qty', label: 'Quantity', type: 'number' },
      { key: 'expiry', label: 'Expiry Date', type: 'date' },
      { key: 'warehouse', label: 'Warehouse' },
    ],
    sample: [
      { batchNo: 'BT-1001', product: 'Whole Milk 1L', qty: 60, expiry: d(-25), warehouse: 'Default Warehouse' },
      { batchNo: 'BT-1002', product: 'Greek Yogurt 500g', qty: 30, expiry: d(-18), warehouse: 'Downtown Store' },
    ],
  },
  serials: {
    title: 'Serial Numbers / IMEI',
    fields: [
      { key: 'serial', label: 'Serial / IMEI', required: true },
      { key: 'product', label: 'Product', required: true },
      { key: 'status', label: 'Status', type: 'select', options: ['in stock', 'sold', 'returned'] },
      { key: 'warehouse', label: 'Warehouse' },
    ],
    sample: [
      { serial: 'SN-9F2A-1188', product: 'Smart Watch Series 9', status: 'in stock', warehouse: 'Default Warehouse' },
      { serial: 'SN-7K3B-4421', product: 'Wireless Earbuds Pro', status: 'sold', warehouse: 'Default Warehouse' },
    ],
  },
  stockCounts: {
    title: 'Count Stock',
    fields: [
      { key: 'reference', label: 'Reference', required: true },
      { key: 'warehouse', label: 'Warehouse' },
      { key: 'date', label: 'Date', type: 'date' },
      { key: 'items', label: 'Items Counted', type: 'number' },
      { key: 'status', label: 'Status', type: 'select', options: ['draft', 'completed'] },
    ],
    sample: [{ reference: 'SC-0001', warehouse: 'Default Warehouse', date: d(4), items: 38, status: 'completed' }],
  },

  /* ---------- Sales ---------- */
  saleReturns: {
    title: 'Sales Return',
    fields: [
      { key: 'reference', label: 'Reference', required: true },
      { key: 'customer', label: 'Customer' },
      { key: 'date', label: 'Date', type: 'date' },
      { key: 'amount', label: 'Amount', type: 'number' },
      { key: 'reason', label: 'Reason', type: 'textarea' },
    ],
    sample: [{ reference: 'SR-0001', customer: 'Emily Stone', date: d(3), amount: 4.1, reason: 'Damaged packaging' }],
  },
  shipments: {
    title: 'Shipments',
    fields: [
      { key: 'reference', label: 'Reference', required: true },
      { key: 'sale', label: 'Sale' },
      { key: 'courier', label: 'Courier' },
      { key: 'tracking', label: 'Tracking No.' },
      { key: 'status', label: 'Status', type: 'select', options: ['pending', 'in transit', 'delivered'] },
      { key: 'date', label: 'Date', type: 'date' },
    ],
    sample: [{ reference: 'SH-0001', sale: 'SL_0006', courier: 'FedEx', tracking: 'FX88213344', status: 'in transit', date: d(2) }],
  },
  offlineSales: {
    title: 'Offline Sales',
    fields: [
      { key: 'reference', label: 'Reference', required: true },
      { key: 'device', label: 'Device' },
      { key: 'date', label: 'Date', type: 'date' },
      { key: 'total', label: 'Total', type: 'number' },
      { key: 'synced', label: 'Synced', type: 'select', options: ['yes', 'no'] },
    ],
    sample: [{ reference: 'OS-0001', device: 'POS Terminal 2', date: d(1), total: 142.3, synced: 'yes' }],
  },
  posDevices: {
    title: 'POS Devices',
    fields: [
      { key: 'name', label: 'Device Name', required: true },
      { key: 'code', label: 'Device Code' },
      { key: 'warehouse', label: 'Warehouse' },
      { key: 'status', label: 'Status', type: 'select', options: ['active', 'inactive'] },
    ],
    sample: [{ name: 'Front Counter', code: 'POS-01', warehouse: 'Default Warehouse', status: 'active' }],
  },

  /* ---------- Purchases ---------- */
  purchaseReturns: {
    title: 'Purchases Return',
    fields: [
      { key: 'reference', label: 'Reference', required: true },
      { key: 'supplier', label: 'Supplier' },
      { key: 'date', label: 'Date', type: 'date' },
      { key: 'amount', label: 'Amount', type: 'number' },
      { key: 'reason', label: 'Reason', type: 'textarea' },
    ],
    sample: [{ reference: 'PRT-0001', supplier: 'Fresh Foods Supply Co', date: d(5), amount: 7.1, reason: 'Short delivery' }],
  },
  quotations: {
    title: 'Quotations',
    fields: [
      { key: 'reference', label: 'Reference', required: true },
      { key: 'customer', label: 'Customer' },
      { key: 'date', label: 'Date', type: 'date' },
      { key: 'total', label: 'Total', type: 'number' },
      { key: 'status', label: 'Status', type: 'select', options: ['draft', 'sent', 'accepted', 'rejected'] },
    ],
    sample: [{ reference: 'QT-0001', customer: 'John Carter', date: d(6), total: 320.0, status: 'sent' }],
  },
  adjustments: {
    title: 'Adjustments',
    fields: [
      { key: 'reference', label: 'Reference', required: true },
      { key: 'warehouse', label: 'Warehouse' },
      { key: 'date', label: 'Date', type: 'date' },
      { key: 'qty', label: 'Quantity', type: 'number' },
      { key: 'type', label: 'Type', type: 'select', options: ['add', 'subtract'] },
    ],
    sample: [{ reference: 'AD-0001', warehouse: 'Default Warehouse', date: d(7), qty: -3, type: 'subtract' }],
  },
  transfers: {
    title: 'Transfers',
    fields: [
      { key: 'reference', label: 'Reference', required: true },
      { key: 'from', label: 'From Warehouse' },
      { key: 'to', label: 'To Warehouse' },
      { key: 'date', label: 'Date', type: 'date' },
      { key: 'qty', label: 'Quantity', type: 'number' },
    ],
    sample: [{ reference: 'TR-0001', from: 'Default Warehouse', to: 'Downtown Store', date: d(4), qty: 20 }],
  },
  damages: {
    title: 'Damages',
    fields: [
      { key: 'reference', label: 'Reference', required: true },
      { key: 'product', label: 'Product' },
      { key: 'qty', label: 'Quantity', type: 'number' },
      { key: 'date', label: 'Date', type: 'date' },
      { key: 'reason', label: 'Reason', type: 'textarea' },
    ],
    sample: [{ reference: 'DM-0001', product: 'Ceramic Mug Set (4)', qty: 2, date: d(9), reason: 'Broken in transit' }],
  },

  /* ---------- Couriers ---------- */
  couriers: {
    title: 'Couriers',
    fields: [
      { key: 'name', label: 'Courier', required: true },
      { key: 'phone', label: 'Phone' },
      { key: 'trackingUrl', label: 'Tracking URL' },
      { key: 'status', label: 'Status', type: 'select', options: ['active', 'inactive'] },
    ],
    sample: [
      { name: 'FedEx', phone: '+1 800 463 3339', trackingUrl: 'fedex.com', status: 'active' },
      { name: 'UPS', phone: '+1 800 742 5877', trackingUrl: 'ups.com', status: 'active' },
      { name: 'DHL Express', phone: '+1 800 225 5345', trackingUrl: 'dhl.com', status: 'active' },
    ],
  },
  courierShipments: {
    title: 'Courier Shipments',
    fields: [
      { key: 'tracking', label: 'Tracking No', required: true },
      { key: 'courier', label: 'Courier' },
      { key: 'destination', label: 'Destination' },
      { key: 'status', label: 'Status', type: 'select', options: ['picked up', 'in transit', 'out for delivery', 'delivered'] },
      { key: 'date', label: 'Date', type: 'date' },
    ],
    sample: [{ tracking: 'FX88213344', courier: 'FedEx', destination: 'Oakland, CA', status: 'in transit', date: d(2) }],
  },
  courierAccounts: {
    title: 'Courier Accounts',
    fields: [
      { key: 'courier', label: 'Courier', required: true },
      { key: 'account', label: 'Account Number' },
      { key: 'apiKey', label: 'API Key' },
      { key: 'status', label: 'Status', type: 'select', options: ['connected', 'disconnected'] },
    ],
    sample: [{ courier: 'FedEx', account: 'FX-991203', apiKey: '••••••••', status: 'connected' }],
  },
  courierLogs: {
    title: 'Courier Logs',
    fields: [
      { key: 'event', label: 'Event', required: true },
      { key: 'courier', label: 'Courier' },
      { key: 'timestamp', label: 'Timestamp', type: 'date' },
      { key: 'detail', label: 'Detail', type: 'textarea' },
    ],
    sample: [{ event: 'Shipment created', courier: 'FedEx', timestamp: d(2), detail: 'Label generated for SL_0006' }],
  },

  /* ---------- People ---------- */
  giftCards: {
    title: 'Gift Cards',
    fields: [
      { key: 'code', label: 'Card Code', required: true },
      { key: 'customer', label: 'Issued To' },
      { key: 'value', label: 'Value', type: 'number' },
      { key: 'balance', label: 'Balance', type: 'number' },
      { key: 'expiry', label: 'Expiry', type: 'date' },
    ],
    sample: [{ code: 'GC-4482-1190', customer: 'Ava Martin', value: 50, balance: 32.5, expiry: d(-180) }],
  },

  /* ---------- HRM ---------- */
  holidays: {
    title: 'Holidays',
    fields: [
      { key: 'name', label: 'Holiday', required: true },
      { key: 'date', label: 'Date', type: 'date' },
      { key: 'type', label: 'Type', type: 'select', options: ['public', 'company', 'optional'] },
    ],
    sample: [
      { name: 'Thanksgiving', date: '2026-11-26', type: 'public' },
      { name: 'Christmas Day', date: '2026-12-25', type: 'public' },
      { name: 'New Year', date: '2027-01-01', type: 'public' },
    ],
  },
  contracts: {
    title: 'Contracts',
    fields: [
      { key: 'employee', label: 'Employee', required: true },
      { key: 'type', label: 'Type', type: 'select', options: ['permanent', 'contract', 'intern'] },
      { key: 'start', label: 'Start Date', type: 'date' },
      { key: 'end', label: 'End Date', type: 'date' },
      { key: 'salary', label: 'Salary', type: 'number' },
    ],
    sample: [{ employee: 'Liam Bennett', type: 'contract', start: '2024-06-12', end: '2026-06-11', salary: 2900 }],
  },
  jobPosts: {
    title: 'Recruitment',
    fields: [
      { key: 'title', label: 'Job Title', required: true },
      { key: 'department', label: 'Department' },
      { key: 'type', label: 'Type', type: 'select', options: ['full-time', 'part-time', 'contract'] },
      { key: 'posted', label: 'Posted', type: 'date' },
      { key: 'applicants', label: 'Applicants', type: 'number' },
      { key: 'status', label: 'Status', type: 'select', options: ['open', 'closed'] },
    ],
    sample: [{ title: 'Warehouse Associate', department: 'Warehouse', type: 'full-time', posted: d(12), applicants: 14, status: 'open' }],
  },

  /* ---------- Accounting ---------- */
  deposits: {
    title: 'Deposits',
    fields: [
      { key: 'reference', label: 'Reference', required: true },
      { key: 'account', label: 'Account' },
      { key: 'amount', label: 'Amount', type: 'number' },
      { key: 'date', label: 'Date', type: 'date' },
      { key: 'note', label: 'Note', type: 'textarea' },
    ],
    sample: [{ reference: 'DEP-0001', account: 'Cash', amount: 1200, date: d(5), note: 'Daily cash deposit' }],
  },
  moneyTransfers: {
    title: 'Money Transfers',
    fields: [
      { key: 'reference', label: 'Reference', required: true },
      { key: 'from', label: 'From Account' },
      { key: 'to', label: 'To Account' },
      { key: 'amount', label: 'Amount', type: 'number' },
      { key: 'date', label: 'Date', type: 'date' },
    ],
    sample: [{ reference: 'MT-0001', from: 'Cash', to: 'Bank Account', amount: 2000, date: d(3) }],
  },
  expenseCategories: {
    title: 'Expense Category',
    fields: [
      { key: 'name', label: 'Category', required: true },
      { key: 'description', label: 'Description', type: 'textarea' },
    ],
    sample: [
      { name: 'Rent', description: 'Store and warehouse rent' },
      { name: 'Utilities', description: 'Electricity, water, internet' },
      { name: 'Salaries', description: 'Payroll' },
      { name: 'Marketing', description: 'Ads and promotions' },
    ],
  },

  /* ---------- Marketing ---------- */
  campaigns: {
    title: 'Campaigns',
    fields: [
      { key: 'name', label: 'Campaign', required: true },
      { key: 'channel', label: 'Channel', type: 'select', options: ['SMS', 'Email', 'WhatsApp'] },
      { key: 'start', label: 'Start', type: 'date' },
      { key: 'end', label: 'End', type: 'date' },
      { key: 'audience', label: 'Audience', type: 'number' },
      { key: 'status', label: 'Status', type: 'select', options: ['draft', 'running', 'completed'] },
    ],
    sample: [{ name: 'Black Friday Blast', channel: 'Email', start: d(5), end: d(-2), audience: 4200, status: 'running' }],
  },
  segments: {
    title: 'Customer Segments',
    fields: [
      { key: 'name', label: 'Segment', required: true },
      { key: 'rule', label: 'Rule' },
      { key: 'customers', label: 'Customers', type: 'number' },
    ],
    sample: [
      { name: 'High spenders', rule: 'Total spent > $500', customers: 24 },
      { name: 'Inactive 90d', rule: 'No order in 90 days', customers: 63 },
    ],
  },
  smsTemplates: {
    title: 'SMS Templates',
    fields: [
      { key: 'name', label: 'Template', required: true },
      { key: 'body', label: 'Body', type: 'textarea' },
    ],
    sample: [{ name: 'Order confirmation', body: 'Hi {name}, your order {ref} has been confirmed.' }],
  },
  emailTemplates: {
    title: 'Email Templates',
    fields: [
      { key: 'name', label: 'Template', required: true },
      { key: 'subject', label: 'Subject' },
      { key: 'body', label: 'Body', type: 'textarea' },
    ],
    sample: [{ name: 'Welcome', subject: 'Welcome to Stocky', body: 'Thanks for joining!' }],
  },

  /* ---------- CRM ---------- */
  leads: {
    title: 'Leads',
    fields: [
      { key: 'name', label: 'Name', required: true },
      { key: 'company', label: 'Company' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'source', label: 'Source', type: 'select', options: ['web form', 'referral', 'cold call', 'event'] },
      { key: 'value', label: 'Est. Value', type: 'number' },
      { key: 'status', label: 'Status', type: 'select', options: ['new', 'contacted', 'qualified', 'lost'] },
    ],
    sample: [
      { name: 'Rachel Kim', company: 'Northwind Retail', email: 'rachel@northwind.com', phone: '+1 555 3321', source: 'web form', value: 8500, status: 'qualified' },
      { name: 'David Ortiz', company: 'BlueSky Foods', email: 'david@bluesky.com', phone: '+1 555 4412', source: 'referral', value: 3200, status: 'contacted' },
    ],
  },
  deals: {
    title: 'Deals',
    fields: [
      { key: 'name', label: 'Deal', required: true },
      { key: 'customer', label: 'Customer' },
      { key: 'stage', label: 'Stage', type: 'select', options: ['prospecting', 'proposal', 'negotiation', 'won', 'lost'] },
      { key: 'value', label: 'Value', type: 'number' },
      { key: 'closeDate', label: 'Close Date', type: 'date' },
    ],
    sample: [{ name: 'Northwind bulk order', customer: 'Northwind Retail', stage: 'negotiation', value: 12500, closeDate: d(-14) }],
  },
  activities: {
    title: 'Activities',
    fields: [
      { key: 'subject', label: 'Subject', required: true },
      { key: 'type', label: 'Type', type: 'select', options: ['call', 'email', 'meeting', 'task'] },
      { key: 'due', label: 'Due', type: 'date' },
      { key: 'owner', label: 'Owner' },
      { key: 'status', label: 'Status', type: 'select', options: ['open', 'done'] },
    ],
    sample: [{ subject: 'Follow up with BlueSky Foods', type: 'call', due: d(-1), owner: 'John Doe', status: 'open' }],
  },

  /* ---------- Projects ---------- */
  projects: {
    title: 'Projects',
    fields: [
      { key: 'name', label: 'Project', required: true },
      { key: 'client', label: 'Client' },
      { key: 'start', label: 'Start', type: 'date' },
      { key: 'deadline', label: 'Deadline', type: 'date' },
      { key: 'budget', label: 'Budget', type: 'number' },
      { key: 'status', label: 'Status', type: 'select', options: ['planning', 'active', 'completed', 'on hold'] },
    ],
    sample: [{ name: 'Storefront redesign', client: 'Internal', start: d(30), deadline: d(-20), budget: 15000, status: 'active' }],
  },
  tasks: {
    title: 'Tasks',
    fields: [
      { key: 'title', label: 'Task', required: true },
      { key: 'project', label: 'Project' },
      { key: 'assignee', label: 'Assignee' },
      { key: 'priority', label: 'Priority', type: 'select', options: ['low', 'medium', 'high', 'urgent'] },
      { key: 'due', label: 'Due', type: 'date' },
      { key: 'status', label: 'Status', type: 'select', options: ['todo', 'in progress', 'review', 'done'] },
    ],
    sample: [{ title: 'Build POS offline mode', project: 'Storefront redesign', assignee: 'Michael Reed', priority: 'high', due: d(-7), status: 'in progress' }],
  },
  milestones: {
    title: 'Milestones',
    fields: [
      { key: 'name', label: 'Milestone', required: true },
      { key: 'project', label: 'Project' },
      { key: 'due', label: 'Due', type: 'date' },
      { key: 'status', label: 'Status', type: 'select', options: ['pending', 'achieved'] },
    ],
    sample: [{ name: 'Design signoff', project: 'Storefront redesign', due: d(-10), status: 'achieved' }],
  },
  timesheets: {
    title: 'Timesheets',
    fields: [
      { key: 'employee', label: 'Employee', required: true },
      { key: 'project', label: 'Project' },
      { key: 'date', label: 'Date', type: 'date' },
      { key: 'hours', label: 'Hours', type: 'number' },
      { key: 'note', label: 'Note', type: 'textarea' },
    ],
    sample: [{ employee: 'Michael Reed', project: 'Storefront redesign', date: d(1), hours: 6.5, note: 'POS module' }],
  },

  /* ---------- Manufacturing ---------- */
  productionOrders: {
    title: 'Production Orders',
    fields: [
      { key: 'reference', label: 'Reference', required: true },
      { key: 'product', label: 'Product' },
      { key: 'qty', label: 'Quantity', type: 'number' },
      { key: 'start', label: 'Start', type: 'date' },
      { key: 'due', label: 'Due', type: 'date' },
      { key: 'status', label: 'Status', type: 'select', options: ['planned', 'in progress', 'completed'] },
    ],
    sample: [{ reference: 'PO-0001', product: 'Ceramic Mug Set (4)', qty: 200, start: d(10), due: d(-5), status: 'in progress' }],
  },
  boms: {
    title: 'Bills of Materials',
    fields: [
      { key: 'product', label: 'Finished Product', required: true },
      { key: 'components', label: 'Components' },
      { key: 'cost', label: 'Unit Cost', type: 'number' },
    ],
    sample: [{ product: 'Ceramic Mug Set (4)', components: 'Ceramic body ×4, Glaze, Packaging', cost: 9.0 }],
  },
  workCentres: {
    title: 'Work Centres',
    fields: [
      { key: 'name', label: 'Work Centre', required: true },
      { key: 'capacity', label: 'Capacity / day', type: 'number' },
      { key: 'costPerHour', label: 'Cost / hour', type: 'number' },
    ],
    sample: [{ name: 'Kiln Line A', capacity: 400, costPerHour: 22 }],
  },
  qcChecks: {
    title: 'Quality Control',
    fields: [
      { key: 'reference', label: 'Reference', required: true },
      { key: 'product', label: 'Product' },
      { key: 'result', label: 'Result', type: 'select', options: ['pass', 'fail', 'rework'] },
      { key: 'date', label: 'Date', type: 'date' },
      { key: 'inspector', label: 'Inspector' },
    ],
    sample: [{ reference: 'QC-0001', product: 'Ceramic Mug Set (4)', result: 'pass', date: d(4), inspector: 'Ava Martin' }],
  },

  /* ---------- Assets ---------- */
  assets: {
    title: 'Assets',
    fields: [
      { key: 'name', label: 'Asset', required: true },
      { key: 'category', label: 'Category' },
      { key: 'purchaseDate', label: 'Purchase Date', type: 'date' },
      { key: 'value', label: 'Value', type: 'number' },
      { key: 'location', label: 'Location' },
      { key: 'status', label: 'Status', type: 'select', options: ['in use', 'idle', 'maintenance', 'retired'] },
    ],
    sample: [
      { name: 'Forklift #1', category: 'Equipment', purchaseDate: '2022-04-10', value: 22000, location: 'Warehouse', status: 'in use' },
      { name: 'POS Terminal A', category: 'IT', purchaseDate: '2023-01-20', value: 1400, location: 'Front Counter', status: 'in use' },
    ],
  },
  assetAssignments: {
    title: 'Asset Assignments',
    fields: [
      { key: 'asset', label: 'Asset', required: true },
      { key: 'assignedTo', label: 'Assigned To' },
      { key: 'date', label: 'Date', type: 'date' },
      { key: 'status', label: 'Status', type: 'select', options: ['active', 'returned'] },
    ],
    sample: [{ asset: 'Forklift #1', assignedTo: 'Ava Martin', date: d(20), status: 'active' }],
  },
  assetMaintenance: {
    title: 'Asset Maintenance',
    fields: [
      { key: 'asset', label: 'Asset', required: true },
      { key: 'type', label: 'Type', type: 'select', options: ['preventive', 'repair', 'inspection'] },
      { key: 'date', label: 'Date', type: 'date' },
      { key: 'cost', label: 'Cost', type: 'number' },
      { key: 'note', label: 'Note', type: 'textarea' },
    ],
    sample: [{ asset: 'Forklift #1', type: 'preventive', date: d(8), cost: 320, note: 'Annual service' }],
  },
  depreciation: {
    title: 'Depreciation',
    fields: [
      { key: 'asset', label: 'Asset', required: true },
      { key: 'method', label: 'Method', type: 'select', options: ['straight line', 'declining'] },
      { key: 'rate', label: 'Rate %', type: 'number' },
      { key: 'amount', label: 'Amount', type: 'number' },
      { key: 'date', label: 'Date', type: 'date' },
    ],
    sample: [{ asset: 'Forklift #1', method: 'straight line', rate: 10, amount: 2200, date: d(30) }],
  },

  /* ---------- Bookings ---------- */
  bookingRequests: {
    title: 'Booking Requests',
    fields: [
      { key: 'customer', label: 'Customer', required: true },
      { key: 'service', label: 'Service' },
      { key: 'date', label: 'Date', type: 'date' },
      { key: 'time', label: 'Time' },
      { key: 'status', label: 'Status', type: 'select', options: ['pending', 'confirmed', 'cancelled'] },
    ],
    sample: [{ customer: 'Emily Stone', service: 'Consultation', date: d(-3), time: '14:30', status: 'confirmed' }],
  },
  bookingServices: {
    title: 'Services',
    fields: [
      { key: 'name', label: 'Service', required: true },
      { key: 'duration', label: 'Duration (min)', type: 'number' },
      { key: 'price', label: 'Price', type: 'number' },
    ],
    sample: [
      { name: 'Consultation', duration: 30, price: 45 },
      { name: 'Full service', duration: 90, price: 120 },
    ],
  },

  /* ---------- Service ---------- */
  serviceJobs: {
    title: 'Service Jobs',
    fields: [
      { key: 'reference', label: 'Reference', required: true },
      { key: 'customer', label: 'Customer' },
      { key: 'device', label: 'Device / Item' },
      { key: 'technician', label: 'Technician' },
      { key: 'status', label: 'Status', type: 'select', options: ['received', 'diagnosing', 'awaiting approval', 'in progress', 'ready', 'completed'] },
      { key: 'date', label: 'Date', type: 'date' },
    ],
    sample: [{ reference: 'SJ-0001', customer: 'John Carter', device: 'Laptop Dell XPS', technician: 'Michael Reed', status: 'in progress', date: d(2) }],
  },
  technicians: {
    title: 'Service Technicians',
    fields: [
      { key: 'name', label: 'Technician', required: true },
      { key: 'speciality', label: 'Speciality' },
      { key: 'phone', label: 'Phone' },
      { key: 'status', label: 'Status', type: 'select', options: ['available', 'busy', 'off'] },
    ],
    sample: [{ name: 'Michael Reed', speciality: 'Hardware', phone: '+1 555 9004', status: 'available' }],
  },
  checklists: {
    title: 'Checklists',
    fields: [
      { key: 'name', label: 'Checklist', required: true },
      { key: 'category', label: 'Category' },
      { key: 'items', label: 'Items', type: 'number' },
    ],
    sample: [{ name: 'Laptop intake', category: 'Hardware', items: 8 }],
  },

  /* ---------- Online store ---------- */
  onlineOrders: {
    title: 'Online Orders',
    fields: [
      { key: 'reference', label: 'Reference', required: true },
      { key: 'customer', label: 'Customer' },
      { key: 'total', label: 'Total', type: 'number' },
      { key: 'date', label: 'Date', type: 'date' },
      { key: 'status', label: 'Status', type: 'select', options: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] },
      { key: 'payment', label: 'Payment', type: 'select', options: ['paid', 'unpaid', 'refunded'] },
    ],
    sample: [
      { reference: 'WEB-1001', customer: 'Sophia Clark', total: 149.9, date: d(1), status: 'processing', payment: 'paid' },
      { reference: 'WEB-1002', customer: 'Noah Harris', total: 44.0, date: d(2), status: 'shipped', payment: 'paid' },
    ],
  },
  collections: {
    title: 'Collections',
    fields: [
      { key: 'name', label: 'Collection', required: true },
      { key: 'products', label: 'Products', type: 'number' },
      { key: 'status', label: 'Status', type: 'select', options: ['active', 'hidden'] },
    ],
    sample: [
      { name: 'New arrivals', products: 12, status: 'active' },
      { name: 'Best sellers', products: 8, status: 'active' },
    ],
  },
  banners: {
    title: 'Banners',
    fields: [
      { key: 'title', label: 'Title', required: true },
      { key: 'position', label: 'Position', type: 'select', options: ['hero slider', 'top strip', 'category tile', 'footer'] },
      { key: 'status', label: 'Status', type: 'select', options: ['active', 'hidden'] },
    ],
    sample: [{ title: 'Holiday Sale — up to 40% off', position: 'hero slider', status: 'active' }],
  },
  coupons: {
    title: 'Coupons',
    fields: [
      { key: 'code', label: 'Code', required: true },
      { key: 'type', label: 'Type', type: 'select', options: ['percentage', 'fixed'] },
      { key: 'value', label: 'Value', type: 'number' },
      { key: 'expiry', label: 'Expiry', type: 'date' },
      { key: 'uses', label: 'Uses', type: 'number' },
      { key: 'status', label: 'Status', type: 'select', options: ['active', 'expired'] },
    ],
    sample: [{ code: 'WELCOME10', type: 'percentage', value: 10, expiry: d(-60), uses: 42, status: 'active' }],
  },
  flashSales: {
    title: 'Flash Sales',
    fields: [
      { key: 'name', label: 'Name', required: true },
      { key: 'discount', label: 'Discount %', type: 'number' },
      { key: 'start', label: 'Start', type: 'date' },
      { key: 'end', label: 'End', type: 'date' },
      { key: 'status', label: 'Status', type: 'select', options: ['scheduled', 'running', 'ended'] },
    ],
    sample: [{ name: 'Weekend Flash', discount: 25, start: d(2), end: d(-1), status: 'running' }],
  },
  reviews: {
    title: 'Product Reviews',
    fields: [
      { key: 'product', label: 'Product', required: true },
      { key: 'customer', label: 'Customer' },
      { key: 'rating', label: 'Rating', type: 'number' },
      { key: 'comment', label: 'Comment', type: 'textarea' },
      { key: 'status', label: 'Status', type: 'select', options: ['pending', 'approved', 'rejected'] },
    ],
    sample: [{ product: 'Wireless Earbuds Pro', customer: 'John Carter', rating: 5, comment: 'Great sound, comfortable fit.', status: 'approved' }],
  },
  subscribers: {
    title: 'Subscribers',
    fields: [
      { key: 'email', label: 'Email', required: true },
      { key: 'date', label: 'Subscribed', type: 'date' },
      { key: 'status', label: 'Status', type: 'select', options: ['subscribed', 'unsubscribed'] },
    ],
    sample: [{ email: 'ava.martin@example.com', date: d(20), status: 'subscribed' }],
  },
  shippingMethods: {
    title: 'Shipping Methods',
    fields: [
      { key: 'name', label: 'Method', required: true },
      { key: 'cost', label: 'Cost', type: 'number' },
      { key: 'days', label: 'Delivery Days', type: 'number' },
      { key: 'status', label: 'Status', type: 'select', options: ['active', 'inactive'] },
    ],
    sample: [
      { name: 'Standard', cost: 5.9, days: 5, status: 'active' },
      { name: 'Express', cost: 14.9, days: 2, status: 'active' },
    ],
  },
  taxRates: {
    title: 'Tax Rates',
    fields: [
      { key: 'name', label: 'Name', required: true },
      { key: 'rate', label: 'Rate %', type: 'number' },
      { key: 'region', label: 'Region' },
    ],
    sample: [
      { name: 'CA Sales Tax', rate: 8.5, region: 'California' },
      { name: 'Standard VAT', rate: 20, region: 'EU' },
    ],
  },
  pages: {
    title: 'Pages',
    fields: [
      { key: 'title', label: 'Page Title', required: true },
      { key: 'slug', label: 'Slug' },
      { key: 'status', label: 'Status', type: 'select', options: ['published', 'draft'] },
      { key: 'updated', label: 'Updated', type: 'date' },
    ],
    sample: [{ title: 'About us', slug: '/about', status: 'published', updated: d(15) }],
  },

  /* ---------- Real estate ---------- */
  properties: {
    title: 'Properties',
    fields: [
      { key: 'title', label: 'Property', required: true },
      { key: 'type', label: 'Type', type: 'select', options: ['house', 'apartment', 'villa', 'commercial', 'land'] },
      { key: 'price', label: 'Price', type: 'number' },
      { key: 'beds', label: 'Beds', type: 'number' },
      { key: 'baths', label: 'Baths', type: 'number' },
      { key: 'area', label: 'Area (sqft)', type: 'number' },
      { key: 'city', label: 'City' },
      { key: 'status', label: 'Status', type: 'select', options: ['available', 'under offer', 'sold'] },
    ],
    sample: [
      { title: '3-bed modern family home', type: 'house', price: 845000, beds: 3, baths: 2, area: 1850, city: 'San Francisco', status: 'available' },
      { title: 'Downtown studio apartment', type: 'apartment', price: 415000, beds: 1, baths: 1, area: 620, city: 'Oakland', status: 'under offer' },
    ],
  },
  propertyCategories: {
    title: 'Property Categories',
    fields: [
      { key: 'name', label: 'Category', required: true },
      { key: 'properties', label: 'Properties', type: 'number' },
    ],
    sample: [
      { name: 'Residential', properties: 24 },
      { name: 'Commercial', properties: 9 },
    ],
  },
  propertyInquiries: {
    title: 'Property Inquiries',
    fields: [
      { key: 'property', label: 'Property', required: true },
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'message', label: 'Message', type: 'textarea' },
      { key: 'date', label: 'Date', type: 'date' },
      { key: 'status', label: 'Status', type: 'select', options: ['new', 'contacted', 'closed'] },
    ],
    sample: [{ property: '3-bed modern family home', name: 'Rachel Kim', email: 'rachel@example.com', message: 'Is this still available?', date: d(1), status: 'new' }],
  },

  /* ---------- Fleet ---------- */
  vehicles: {
    title: 'Vehicles',
    fields: [
      { key: 'plate', label: 'Plate', required: true },
      { key: 'model', label: 'Model' },
      { key: 'year', label: 'Year', type: 'number' },
      { key: 'driver', label: 'Driver' },
      { key: 'mileage', label: 'Mileage', type: 'number' },
      { key: 'status', label: 'Status', type: 'select', options: ['active', 'maintenance', 'retired'] },
    ],
    sample: [{ plate: 'CA-8842-XY', model: 'Ford Transit', year: 2021, driver: 'Liam Bennett', mileage: 84210, status: 'active' }],
  },
  fleetMaintenance: {
    title: 'Fleet Maintenance',
    fields: [
      { key: 'vehicle', label: 'Vehicle', required: true },
      { key: 'type', label: 'Type', type: 'select', options: ['oil change', 'tyres', 'brakes', 'inspection', 'repair'] },
      { key: 'date', label: 'Date', type: 'date' },
      { key: 'cost', label: 'Cost', type: 'number' },
    ],
    sample: [{ vehicle: 'CA-8842-XY', type: 'oil change', date: d(12), cost: 180 }],
  },
  fuelLogs: {
    title: 'Fuel Logs',
    fields: [
      { key: 'vehicle', label: 'Vehicle', required: true },
      { key: 'date', label: 'Date', type: 'date' },
      { key: 'litres', label: 'Litres', type: 'number' },
      { key: 'cost', label: 'Cost', type: 'number' },
    ],
    sample: [{ vehicle: 'CA-8842-XY', date: d(3), litres: 62.5, cost: 94.2 }],
  },
  fleetAssignments: {
    title: 'Fleet Assignments',
    fields: [
      { key: 'vehicle', label: 'Vehicle', required: true },
      { key: 'driver', label: 'Driver' },
      { key: 'from', label: 'From', type: 'date' },
      { key: 'to', label: 'To', type: 'date' },
    ],
    sample: [{ vehicle: 'CA-8842-XY', driver: 'Liam Bennett', from: d(30), to: d(-30) }],
  },

  /* ---------- Hospital ---------- */
  patients: {
    title: 'Patients',
    fields: [
      { key: 'name', label: 'Patient', required: true },
      { key: 'dob', label: 'Date of Birth', type: 'date' },
      { key: 'gender', label: 'Gender', type: 'select', options: ['male', 'female', 'other'] },
      { key: 'phone', label: 'Phone' },
      { key: 'blood', label: 'Blood Group' },
    ],
    sample: [{ name: 'Emma Collins', dob: '1988-05-14', gender: 'female', phone: '+1 555 8833', blood: 'O+' }],
  },
  appointments: {
    title: 'Appointments',
    fields: [
      { key: 'patient', label: 'Patient', required: true },
      { key: 'doctor', label: 'Doctor' },
      { key: 'date', label: 'Date', type: 'date' },
      { key: 'time', label: 'Time' },
      { key: 'status', label: 'Status', type: 'select', options: ['scheduled', 'completed', 'cancelled'] },
    ],
    sample: [{ patient: 'Emma Collins', doctor: 'Dr. Sarah Nolan', date: d(-2), time: '10:00', status: 'scheduled' }],
  },
  consultations: {
    title: 'Consultations',
    fields: [
      { key: 'patient', label: 'Patient', required: true },
      { key: 'doctor', label: 'Doctor' },
      { key: 'date', label: 'Date', type: 'date' },
      { key: 'diagnosis', label: 'Diagnosis', type: 'textarea' },
      { key: 'fee', label: 'Fee', type: 'number' },
    ],
    sample: [{ patient: 'Emma Collins', doctor: 'Dr. Sarah Nolan', date: d(1), diagnosis: 'Seasonal allergies', fee: 120 }],
  },
  wards: {
    title: 'Wards & Beds',
    fields: [
      { key: 'ward', label: 'Ward', required: true },
      { key: 'beds', label: 'Beds', type: 'number' },
      { key: 'occupied', label: 'Occupied', type: 'number' },
      { key: 'floor', label: 'Floor' },
    ],
    sample: [{ ward: 'General Ward A', beds: 20, occupied: 14, floor: '1' }],
  },
  labOrders: {
    title: 'Lab Orders',
    fields: [
      { key: 'reference', label: 'Reference', required: true },
      { key: 'patient', label: 'Patient' },
      { key: 'test', label: 'Test' },
      { key: 'date', label: 'Date', type: 'date' },
      { key: 'status', label: 'Status', type: 'select', options: ['ordered', 'collected', 'resulted'] },
    ],
    sample: [{ reference: 'LAB-0001', patient: 'Emma Collins', test: 'CBC', date: d(2), status: 'resulted' }],
  },
  doctors: {
    title: 'Doctors',
    fields: [
      { key: 'name', label: 'Doctor', required: true },
      { key: 'speciality', label: 'Speciality' },
      { key: 'phone', label: 'Phone' },
      { key: 'fee', label: 'Consultation Fee', type: 'number' },
    ],
    sample: [{ name: 'Dr. Sarah Nolan', speciality: 'General Medicine', phone: '+1 555 7700', fee: 120 }],
  },

  /* ---------- School ---------- */
  students: {
    title: 'Students',
    fields: [
      { key: 'name', label: 'Student', required: true },
      { key: 'roll', label: 'Roll No' },
      { key: 'grade', label: 'Grade' },
      { key: 'guardian', label: 'Guardian' },
      { key: 'phone', label: 'Phone' },
    ],
    sample: [{ name: 'Lucas Bennett', roll: 'S-1042', grade: 'Grade 5', guardian: 'Liam Bennett', phone: '+1 555 6611' }],
  },
  enrolments: {
    title: 'Enrolment',
    fields: [
      { key: 'student', label: 'Student', required: true },
      { key: 'year', label: 'Academic Year' },
      { key: 'grade', label: 'Grade' },
      { key: 'date', label: 'Date', type: 'date' },
      { key: 'status', label: 'Status', type: 'select', options: ['enrolled', 'pending', 'withdrawn'] },
    ],
    sample: [{ student: 'Lucas Bennett', year: '2026-27', grade: 'Grade 5', date: d(60), status: 'enrolled' }],
  },
  studentAttendance: {
    title: 'Attendance',
    fields: [
      { key: 'student', label: 'Student', required: true },
      { key: 'date', label: 'Date', type: 'date' },
      { key: 'status', label: 'Status', type: 'select', options: ['present', 'absent', 'late', 'excused'] },
    ],
    sample: [{ student: 'Lucas Bennett', date: d(1), status: 'present' }],
  },
  exams: {
    title: 'Exams & Results',
    fields: [
      { key: 'exam', label: 'Exam', required: true },
      { key: 'grade', label: 'Grade' },
      { key: 'date', label: 'Date', type: 'date' },
      { key: 'subject', label: 'Subject' },
      { key: 'maxMarks', label: 'Max Marks', type: 'number' },
    ],
    sample: [{ exam: 'Mid-term', grade: 'Grade 5', date: d(20), subject: 'Mathematics', maxMarks: 100 }],
  },
  fees: {
    title: 'Fees',
    fields: [
      { key: 'student', label: 'Student', required: true },
      { key: 'term', label: 'Term' },
      { key: 'amount', label: 'Amount', type: 'number' },
      { key: 'due', label: 'Due Date', type: 'date' },
      { key: 'status', label: 'Status', type: 'select', options: ['paid', 'unpaid', 'partial'] },
    ],
    sample: [{ student: 'Lucas Bennett', term: 'Term 2', amount: 1800, due: d(-15), status: 'paid' }],
  },
  teachers: {
    title: 'Teachers',
    fields: [
      { key: 'name', label: 'Teacher', required: true },
      { key: 'subject', label: 'Subject' },
      { key: 'phone', label: 'Phone' },
      { key: 'email', label: 'Email' },
    ],
    sample: [{ name: 'Ms. Clara Hughes', subject: 'Mathematics', phone: '+1 555 2244', email: 'clara@school.edu' }],
  },

  /* ---------- Restaurant ---------- */
  floorPlan: {
    title: 'Floor Plan',
    fields: [
      { key: 'table', label: 'Table', required: true },
      { key: 'seats', label: 'Seats', type: 'number' },
      { key: 'zone', label: 'Zone', type: 'select', options: ['indoor', 'patio', 'bar', 'private'] },
      { key: 'status', label: 'Status', type: 'select', options: ['free', 'occupied', 'reserved'] },
    ],
    sample: [
      { table: 'T1', seats: 4, zone: 'indoor', status: 'occupied' },
      { table: 'T2', seats: 2, zone: 'patio', status: 'free' },
    ],
  },
  restaurantOrders: {
    title: 'Orders',
    fields: [
      { key: 'reference', label: 'Reference', required: true },
      { key: 'table', label: 'Table' },
      { key: 'items', label: 'Items', type: 'number' },
      { key: 'total', label: 'Total', type: 'number' },
      { key: 'status', label: 'Status', type: 'select', options: ['open', 'preparing', 'served', 'paid'] },
      { key: 'time', label: 'Time' },
    ],
    sample: [{ reference: 'R-0001', table: 'T1', items: 3, total: 62.4, status: 'preparing', time: '19:20' }],
  },
  reservations: {
    title: 'Reservations',
    fields: [
      { key: 'name', label: 'Guest', required: true },
      { key: 'phone', label: 'Phone' },
      { key: 'date', label: 'Date', type: 'date' },
      { key: 'time', label: 'Time' },
      { key: 'party', label: 'Party Size', type: 'number' },
      { key: 'status', label: 'Status', type: 'select', options: ['booked', 'seated', 'cancelled', 'no-show'] },
    ],
    sample: [{ name: 'Rachel Kim', phone: '+1 555 3321', date: d(-1), time: '20:00', party: 4, status: 'booked' }],
  },
  menuItems: {
    title: 'Menu',
    fields: [
      { key: 'name', label: 'Item', required: true },
      { key: 'category', label: 'Category' },
      { key: 'price', label: 'Price', type: 'number' },
      { key: 'available', label: 'Available', type: 'select', options: ['yes', 'no'] },
    ],
    sample: [
      { name: 'Margherita Pizza', category: 'Mains', price: 14.5, available: 'yes' },
      { name: 'Caesar Salad', category: 'Starters', price: 9.0, available: 'yes' },
    ],
  },

  /* ---------- Rental ---------- */
  rentalItems: {
    title: 'Rental Items',
    fields: [
      { key: 'name', label: 'Item', required: true },
      { key: 'category', label: 'Category' },
      { key: 'dailyRate', label: 'Daily Rate', type: 'number' },
      { key: 'available', label: 'Available', type: 'number' },
    ],
    sample: [
      { name: 'Camping Tent 4P', category: 'Outdoor', dailyRate: 18, available: 6 },
      { name: 'Projector HD', category: 'Electronics', dailyRate: 35, available: 3 },
    ],
  },
  rentalReservations: {
    title: 'Reservations',
    fields: [
      { key: 'reference', label: 'Reference', required: true },
      { key: 'customer', label: 'Customer' },
      { key: 'item', label: 'Item' },
      { key: 'from', label: 'From', type: 'date' },
      { key: 'to', label: 'To', type: 'date' },
      { key: 'status', label: 'Status', type: 'select', options: ['reserved', 'active', 'returned', 'cancelled'] },
    ],
    sample: [{ reference: 'RR-0001', customer: 'Ava Martin', item: 'Camping Tent 4P', from: d(-3), to: d(-8), status: 'reserved' }],
  },
  rentalContracts: {
    title: 'Rental Contracts',
    fields: [
      { key: 'reference', label: 'Reference', required: true },
      { key: 'customer', label: 'Customer' },
      { key: 'start', label: 'Start', type: 'date' },
      { key: 'end', label: 'End', type: 'date' },
      { key: 'deposit', label: 'Deposit', type: 'number' },
    ],
    sample: [{ reference: 'RC-0001', customer: 'Ava Martin', start: d(3), end: d(-5), deposit: 100 }],
  },
  rentalInvoices: {
    title: 'Rental Invoices',
    fields: [
      { key: 'reference', label: 'Reference', required: true },
      { key: 'customer', label: 'Customer' },
      { key: 'amount', label: 'Amount', type: 'number' },
      { key: 'date', label: 'Date', type: 'date' },
      { key: 'status', label: 'Status', type: 'select', options: ['paid', 'unpaid'] },
    ],
    sample: [{ reference: 'RI-0001', customer: 'Ava Martin', amount: 90, date: d(3), status: 'paid' }],
  },

  /* ---------- System ---------- */
  invoices: {
    title: 'Billing & Invoices',
    fields: [
      { key: 'reference', label: 'Invoice', required: true },
      { key: 'period', label: 'Period' },
      { key: 'amount', label: 'Amount', type: 'number' },
      { key: 'date', label: 'Date', type: 'date' },
      { key: 'status', label: 'Status', type: 'select', options: ['paid', 'due'] },
    ],
    sample: [
      { reference: 'INV-2026-10', period: 'October 2026', amount: 49, date: d(24), status: 'paid' },
      { reference: 'INV-2026-11', period: 'November 2026', amount: 49, date: d(-6), status: 'due' },
    ],
  },
  auditLogs: {
    title: 'Audit Log',
    fields: [
      { key: 'user', label: 'User', required: true },
      { key: 'action', label: 'Action' },
      { key: 'target', label: 'Target' },
      { key: 'timestamp', label: 'Timestamp', type: 'date' },
      { key: 'ip', label: 'IP' },
    ],
    sample: [
      { user: 'john@stockysaas.site', action: 'created sale', target: 'SL_0006', timestamp: d(1), ip: '203.0.113.24' },
      { user: 'john@stockysaas.site', action: 'updated product', target: 'PRD-0008', timestamp: d(2), ip: '203.0.113.24' },
    ],
  },
}

export const moduleForPath = (path: string): string | null => {
  const map: Record<string, string> = {
    '/products/batches': 'batches',
    '/products/serials': 'serials',
    '/products/count-stock': 'stockCounts',
    '/sales/returns': 'saleReturns',
    '/sales/shipments': 'shipments',
    '/sales/offline': 'offlineSales',
    '/sales/devices': 'posDevices',
    '/purchases/returns': 'purchaseReturns',
    '/purchases/quotations': 'quotations',
    '/purchases/adjustments': 'adjustments',
    '/purchases/transfers': 'transfers',
    '/purchases/damages': 'damages',
  }
  return map[path] ?? null
}
