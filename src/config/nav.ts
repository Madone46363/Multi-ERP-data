import type { ReactNode } from 'react'

export interface NavLeaf {
  label: string
  path: string
  icon?: string
  /** module key used by the generic CRUD engine */
  crud?: string
  badge?: string
}

export interface NavGroup {
  label: string
  icon?: string
  children: (NavLeaf | NavGroup)[]
}

export interface NavSection {
  title?: string
  items: (NavLeaf | NavGroup)[]
}

const isGroup = (n: NavLeaf | NavGroup): n is NavGroup => 'children' in n

export const navSections: NavSection[] = [
  {
    items: [
      { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
      { label: 'POS', path: '/pos', icon: 'pos' },
      { label: 'AI Assistant', path: '/ai-assistant', icon: 'ai' },
    ],
  },
  {
    title: 'Catalog',
    items: [
      {
        label: 'Products',
        icon: 'products',
        children: [
          { label: 'All Products', path: '/products' },
          { label: 'Create Product', path: '/products/create' },
          { label: 'Categories', path: '/products/categories' },
          { label: 'Brands', path: '/products/brands' },
          { label: 'Units', path: '/products/units' },
          { label: 'Batches', path: '/products/batches', crud: 'batches' },
          { label: 'Serial Numbers', path: '/products/serials', crud: 'serials' },
          { label: 'Print Labels', path: '/products/labels' },
          { label: 'Count Stock', path: '/products/count-stock', crud: 'stockCounts' },
          { label: 'Price Check', path: '/products/price-check' },
        ],
      },
      {
        label: 'Sales',
        icon: 'sales',
        children: [
          { label: 'All Sales', path: '/sales' },
          { label: 'Create Sale', path: '/sales/create' },
          { label: 'Sales Return', path: '/sales/returns', crud: 'saleReturns' },
          { label: 'Shipments', path: '/sales/shipments', crud: 'shipments' },
          { label: 'Offline Sales', path: '/sales/offline', crud: 'offlineSales' },
          { label: 'POS Devices', path: '/sales/devices', crud: 'posDevices' },
          { label: 'Customer Screen', path: '/sales/customer-screen' },
          { label: 'Kitchen Display', path: '/sales/kitchen-display' },
        ],
      },
      {
        label: 'Purchases',
        icon: 'purchases',
        children: [
          { label: 'All Purchases', path: '/purchases' },
          { label: 'Create Purchase', path: '/purchases/create' },
          { label: 'Purchases Return', path: '/purchases/returns', crud: 'purchaseReturns' },
          { label: 'Quotations', path: '/purchases/quotations', crud: 'quotations' },
          { label: 'Adjustments', path: '/purchases/adjustments', crud: 'adjustments' },
          { label: 'Transfers', path: '/purchases/transfers', crud: 'transfers' },
          { label: 'Damages', path: '/purchases/damages', crud: 'damages' },
        ],
      },
      {
        label: 'Couriers',
        icon: 'courier',
        children: [
          { label: 'Couriers', path: '/couriers', crud: 'couriers' },
          { label: 'Courier Shipments', path: '/couriers/shipments', crud: 'courierShipments' },
          { label: 'Courier Accounts', path: '/couriers/accounts', crud: 'courierAccounts' },
          { label: 'Courier Settings', path: '/couriers/settings' },
          { label: 'Courier Logs', path: '/couriers/logs', crud: 'courierLogs' },
        ],
      },
    ],
  },
  {
    title: 'People',
    items: [
      {
        label: 'People',
        icon: 'people',
        children: [
          { label: 'Customers', path: '/people/customers' },
          { label: 'Create Customer', path: '/people/customers/create' },
          { label: 'Customer Wallets', path: '/people/customer-wallets' },
          { label: 'Gift Cards', path: '/people/gift-cards', crud: 'giftCards' },
          { label: 'Suppliers', path: '/people/suppliers' },
          { label: 'Create Supplier', path: '/people/suppliers/create' },
          { label: 'Supplier Wallets', path: '/people/supplier-wallets' },
        ],
      },
      {
        label: 'HRM',
        icon: 'hrm',
        children: [
          { label: 'Employees', path: '/hrm/employees' },
          { label: 'Departments', path: '/hrm/departments' },
          { label: 'Designations', path: '/hrm/designations' },
          { label: 'Attendance', path: '/hrm/attendance' },
          { label: 'Leave Requests', path: '/hrm/leave' },
          { label: 'Payroll', path: '/hrm/payroll' },
          { label: 'Holidays', path: '/hrm/holidays', crud: 'holidays' },
          { label: 'Contracts', path: '/hrm/contracts', crud: 'contracts' },
          { label: 'Recruitment', path: '/hrm/recruitment', crud: 'jobPosts' },
        ],
      },
    ],
  },
  {
    title: 'Operations',
    items: [
      {
        label: 'Accounting',
        icon: 'accounting',
        children: [
          { label: 'Chart of Accounts', path: '/accounting/accounts' },
          { label: 'Journal Entries', path: '/accounting/journal' },
          { label: 'Trial Balance', path: '/accounting/trial-balance' },
          { label: 'Profit & Loss', path: '/accounting/profit-loss' },
          { label: 'Balance Sheet', path: '/accounting/balance-sheet' },
          { label: 'Expenses', path: '/accounting/expenses' },
          { label: 'Deposits', path: '/accounting/deposits', crud: 'deposits' },
          { label: 'Money Transfers', path: '/accounting/transfers', crud: 'moneyTransfers' },
          { label: 'Expense Category', path: '/accounting/expense-categories', crud: 'expenseCategories' },
        ],
      },
      { label: 'Reports', path: '/reports', icon: 'reports' },
      {
        label: 'Marketing',
        icon: 'marketing',
        children: [
          { label: 'Campaigns', path: '/marketing/campaigns', crud: 'campaigns' },
          { label: 'Customer Segments', path: '/marketing/segments', crud: 'segments' },
          { label: 'SMS Templates', path: '/marketing/sms', crud: 'smsTemplates' },
          { label: 'Email Templates', path: '/marketing/email', crud: 'emailTemplates' },
        ],
      },
      {
        label: 'CRM',
        icon: 'crm',
        children: [
          { label: 'Leads', path: '/crm/leads', crud: 'leads' },
          { label: 'Pipeline', path: '/crm/pipeline' },
          { label: 'Deals', path: '/crm/deals', crud: 'deals' },
          { label: 'Activities', path: '/crm/activities', crud: 'activities' },
        ],
      },
      {
        label: 'Projects',
        icon: 'projects',
        children: [
          { label: 'Projects', path: '/projects', crud: 'projects' },
          { label: 'Tasks', path: '/projects/tasks', crud: 'tasks' },
          { label: 'Milestones', path: '/projects/milestones', crud: 'milestones' },
          { label: 'Timesheets', path: '/projects/timesheets', crud: 'timesheets' },
        ],
      },
      {
        label: 'Manufacturing',
        icon: 'manufacturing',
        children: [
          { label: 'Production Orders', path: '/manufacturing/orders', crud: 'productionOrders' },
          { label: 'Bills of Materials', path: '/manufacturing/bom', crud: 'boms' },
          { label: 'Work Centres', path: '/manufacturing/work-centres', crud: 'workCentres' },
          { label: 'Quality Control', path: '/manufacturing/qc', crud: 'qcChecks' },
        ],
      },
      {
        label: 'Assets',
        icon: 'assets',
        children: [
          { label: 'Assets List', path: '/assets', crud: 'assets' },
          { label: 'Assignments', path: '/assets/assignments', crud: 'assetAssignments' },
          { label: 'Maintenance', path: '/assets/maintenance', crud: 'assetMaintenance' },
          { label: 'Depreciation', path: '/assets/depreciation', crud: 'depreciation' },
        ],
      },
      {
        label: 'Bookings',
        icon: 'booking',
        children: [
          { label: 'Booking Requests', path: '/bookings/requests', crud: 'bookingRequests' },
          { label: 'Services', path: '/bookings/services', crud: 'bookingServices' },
          { label: 'Staff & Hours', path: '/bookings/staff' },
        ],
      },
      {
        label: 'Service',
        icon: 'service',
        children: [
          { label: 'Service Jobs', path: '/service/jobs', crud: 'serviceJobs' },
          { label: 'Technicians', path: '/service/technicians', crud: 'technicians' },
          { label: 'Checklists', path: '/service/checklists', crud: 'checklists' },
        ],
      },
    ],
  },
  {
    title: 'Industry',
    items: [
      {
        label: 'Online Store',
        icon: 'store',
        children: [
          { label: 'Visit Online Store', path: '/store' },
          { label: 'Online Orders', path: '/online/orders', crud: 'onlineOrders' },
          { label: 'Collections', path: '/online/collections', crud: 'collections' },
          { label: 'Banners', path: '/online/banners', crud: 'banners' },
          { label: 'Coupons', path: '/online/coupons', crud: 'coupons' },
          { label: 'Flash Sales', path: '/online/flash-sales', crud: 'flashSales' },
          { label: 'Product Reviews', path: '/online/reviews', crud: 'reviews' },
          { label: 'Subscribers', path: '/online/subscribers', crud: 'subscribers' },
          { label: 'Shipping Methods', path: '/online/shipping', crud: 'shippingMethods' },
          { label: 'Tax Rates', path: '/online/tax-rates', crud: 'taxRates' },
          { label: 'Pages', path: '/online/pages', crud: 'pages' },
        ],
      },
      {
        label: 'Real Estate',
        icon: 'realestate',
        children: [
          { label: 'Properties', path: '/realestate/properties', crud: 'properties' },
          { label: 'Property Categories', path: '/realestate/categories', crud: 'propertyCategories' },
          { label: 'Property Inquiries', path: '/realestate/inquiries', crud: 'propertyInquiries' },
        ],
      },
      {
        label: 'Fleet',
        icon: 'fleet',
        children: [
          { label: 'Vehicles', path: '/fleet/vehicles', crud: 'vehicles' },
          { label: 'Maintenance', path: '/fleet/maintenance', crud: 'fleetMaintenance' },
          { label: 'Fuel Logs', path: '/fleet/fuel', crud: 'fuelLogs' },
          { label: 'Assignments', path: '/fleet/assignments', crud: 'fleetAssignments' },
        ],
      },
      {
        label: 'Hospital',
        icon: 'hospital',
        children: [
          { label: 'Patients', path: '/hospital/patients', crud: 'patients' },
          { label: 'Appointments', path: '/hospital/appointments', crud: 'appointments' },
          { label: 'Consultations', path: '/hospital/consultations', crud: 'consultations' },
          { label: 'Wards & Beds', path: '/hospital/wards', crud: 'wards' },
          { label: 'Lab Orders', path: '/hospital/lab-orders', crud: 'labOrders' },
          { label: 'Doctors', path: '/hospital/doctors', crud: 'doctors' },
        ],
      },
      {
        label: 'School',
        icon: 'school',
        children: [
          { label: 'Students', path: '/school/students', crud: 'students' },
          { label: 'Enrolment', path: '/school/enrolment', crud: 'enrolments' },
          { label: 'Attendance', path: '/school/attendance', crud: 'studentAttendance' },
          { label: 'Exams & Results', path: '/school/exams', crud: 'exams' },
          { label: 'Fees', path: '/school/fees', crud: 'fees' },
          { label: 'Teachers', path: '/school/teachers', crud: 'teachers' },
        ],
      },
      {
        label: 'Restaurant',
        icon: 'restaurant',
        children: [
          { label: 'Floor Plan', path: '/restaurant/floor', crud: 'floorPlan' },
          { label: 'Orders', path: '/restaurant/orders', crud: 'restaurantOrders' },
          { label: 'Reservations', path: '/restaurant/reservations', crud: 'reservations' },
          { label: 'Menu', path: '/restaurant/menu', crud: 'menuItems' },
        ],
      },
      {
        label: 'Rental',
        icon: 'rental',
        children: [
          { label: 'Rental Items', path: '/rental/items', crud: 'rentalItems' },
          { label: 'Reservations', path: '/rental/reservations', crud: 'rentalReservations' },
          { label: 'Contracts', path: '/rental/contracts', crud: 'rentalContracts' },
          { label: 'Invoices', path: '/rental/invoices', crud: 'rentalInvoices' },
        ],
      },
    ],
  },
  {
    title: 'System',
    items: [
      {
        label: 'Settings',
        icon: 'settings',
        children: [
          { label: 'System Settings', path: '/settings' },
          { label: 'Warehouses', path: '/settings/warehouses' },
          { label: 'Currency', path: '/settings/currency' },
          { label: 'Payment Methods', path: '/settings/payment-methods' },
          { label: 'POS Settings', path: '/settings/pos' },
          { label: 'Modules', path: '/settings/modules' },
          { label: 'Backup', path: '/settings/backup' },
          { label: 'Audit Log', path: '/settings/audit-log', crud: 'auditLogs' },
        ],
      },
      {
        label: 'Billing',
        icon: 'billing',
        children: [
          { label: 'Current Plan', path: '/billing/plan' },
          { label: 'Change Plan', path: '/billing/change-plan' },
          { label: 'Invoices', path: '/billing/invoices', crud: 'invoices' },
        ],
      },
      { label: 'Support', path: '/support', icon: 'support' },
    ],
  },
]

export const flattenNav = (): NavLeaf[] => {
  const out: NavLeaf[] = []
  const walk = (items: (NavLeaf | NavGroup)[]) => {
    items.forEach((i) => {
      if (isGroup(i)) walk(i.children)
      else out.push(i)
    })
  }
  navSections.forEach((s) => walk(s.items))
  return out
}

export const titleForPath = (path: string): string => {
  const leaf = flattenNav().find((l) => l.path === path)
  if (leaf) {
    const group = navSections
      .flatMap((s) => s.items)
      .find((i): i is NavGroup => isGroup(i) && i.children.some((c) => !isGroup(c) && c.path === path))
    return group ? `${group.label} · ${leaf.label}` : leaf.label
  }
  return 'Dashboard'
}

export type { ReactNode }
