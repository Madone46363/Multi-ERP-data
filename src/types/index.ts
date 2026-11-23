export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'manager' | 'cashier'
  avatarColor: string
}

export interface Category {
  id: number
  name: string
  parentId?: number | null
}

export interface Brand {
  id: number
  name: string
  image?: string
}

export interface Unit {
  id: number
  name: string
  shortName: string
  baseUnit?: string
  operator?: '×' | '÷'
  operationValue?: number
}

export interface Warehouse {
  id: number
  name: string
  phone?: string
  email?: string
  address?: string
  city?: string
}

export interface Product {
  id: number
  name: string
  code: string
  type: 'standard' | 'variable' | 'service'
  barcodeSymbology?: string
  categoryId: number
  subCategoryId?: number | null
  brandId?: number | null
  unitId: number
  cost: number
  price: number
  taxType: 'none' | 'exclusive' | 'inclusive'
  taxRate: number
  taxMethod: string
  alertQuantity: number
  image?: string
  emoji?: string
  description?: string
  stock: number
  warehouseId: number
  featured?: boolean
  featuredSlider?: boolean
  isVariant?: boolean
  isBatch?: boolean
  isSerial?: boolean
  isRental?: boolean
  promoPrice?: number | null
  promoStart?: string | null
  promoEnd?: string | null
  warranty?: string
  expDate?: string | null
}

export interface Customer {
  id: number
  name: string
  email: string
  phone: string
  address?: string
  city?: string
  state?: string
  country?: string
  gstNumber?: string
  taxNumber?: string
  walletBalance: number
  creditLimit?: number
  rewardPoints?: number
  hasLogin?: boolean
  isPending?: boolean
}

export interface Supplier {
  id: number
  name: string
  email: string
  phone: string
  company?: string
  address?: string
  taxNumber?: string
  walletBalance: number
}

export interface SaleItem {
  productId: number
  productName: string
  code: string
  unitPrice: number
  qty: number
  discount: number
  tax: number
  subtotal: number
}

export interface Sale {
  id: number
  reference: string
  customerId: number
  warehouseId: number
  date: string
  items: SaleItem[]
  subtotal: number
  discount: number
  tax: number
  shipping: number
  total: number
  paid: number
  status: 'completed' | 'pending' | 'draft' | 'returned'
  paymentStatus: 'paid' | 'partial' | 'due'
  paymentMethod: string
  notes?: string
  pos?: boolean
  cashier?: string
}

export interface PurchaseItem {
  productId: number
  productName: string
  code: string
  unitCost: number
  qty: number
  discount: number
  tax: number
  subtotal: number
}

export interface Purchase {
  id: number
  reference: string
  supplierId: number
  warehouseId: number
  date: string
  items: PurchaseItem[]
  subtotal: number
  discount: number
  tax: number
  shipping: number
  total: number
  paid: number
  status: 'received' | 'pending' | 'ordered' | 'draft'
  paymentStatus: 'paid' | 'partial' | 'due'
  paymentMethod: string
  notes?: string
}

export interface Expense {
  id: number
  reference: string
  category: string
  amount: number
  date: string
  warehouseId: number
  account: string
  description?: string
}

export interface Deposit {
  id: number
  reference: string
  amount: number
  date: string
  accountId: string
  customerOrSupplier: string
  type: 'customer' | 'supplier'
}

export interface Account {
  id: number
  name: string
  code: string
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense'
  balance: number
  parent?: number | null
}

export interface JournalEntry {
  id: number
  date: string
  reference: string
  description: string
  lines: { account: string; debit: number; credit: number }[]
  status: 'posted' | 'draft'
}

export interface Employee {
  id: number
  name: string
  email: string
  phone: string
  department: string
  designation: string
  salary: number
  joinDate: string
  status: 'active' | 'inactive'
  employeeType: 'permanent' | 'contract' | 'intern'
}

export interface Attendance {
  id: number
  employeeId: number
  date: string
  status: 'present' | 'absent' | 'leave' | 'late'
  checkIn?: string
  checkOut?: string
}

export interface LeaveRequest {
  id: number
  employeeId: number
  leaveType: string
  from: string
  to: string
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  days: number
}

export interface Payroll {
  id: number
  employeeId: number
  month: string
  baseSalary: number
  bonuses: number
  deductions: number
  netPay: number
  status: 'paid' | 'pending'
}

export interface Department {
  id: number
  name: string
  head?: string
  employees?: number
}

export interface Designation {
  id: number
  name: string
  department: string
}

export interface Queue {
  [key: string]: unknown
}

export interface StoreSettings {
  storeName: string
  tagline: string
  primaryColor: string
  currency: string
  currencySymbol: string
  currencyPosition: 'before' | 'after'
  decimalPlaces: number
  phone: string
  email: string
  address: string
  logo?: string
  favicon?: string
  language: string
  timezone: string
  dateFormat: string
  invoiceFooter?: string
}
