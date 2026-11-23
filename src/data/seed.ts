import type {
  Account, Attendance, Brand, Category, Customer, Department, Designation,
  Employee, Expense, JournalEntry, LeaveRequest, Payroll, Product, Purchase,
  Sale, StoreSettings, Supplier, Unit, Warehouse,
} from '../types'

const today = new Date()
const iso = (d: Date) => d.toISOString().slice(0, 10)
const daysAgo = (n: number) => {
  const d = new Date(today)
  d.setDate(d.getDate() - n)
  return iso(d)
}

export const settings: StoreSettings = {
  storeName: 'Stocky Inc.',
  tagline: 'Ultimate Inventory With POS',
  primaryColor: '#6d28d9',
  currency: 'USD',
  currencySymbol: '$',
  currencyPosition: 'before',
  decimalPlaces: 2,
  phone: '+1 555 0100',
  email: 'admin@stockysaas.site',
  address: '1200 Market Street, San Francisco, CA 94103',
  language: 'en',
  timezone: 'America/Los_Angeles',
  dateFormat: 'YYYY-MM-DD',
  invoiceFooter: 'Thank you for your business!',
}

export const warehouses: Warehouse[] = [
  { id: 1, name: 'Default Warehouse', phone: '+1 555 0101', email: 'default@stockysaas.site', address: '1200 Market Street', city: 'San Francisco' },
  { id: 2, name: 'Downtown Store', phone: '+1 555 0102', email: 'downtown@stockysaas.site', address: '88 5th Avenue', city: 'San Francisco' },
  { id: 3, name: 'Airport Outlet', phone: '+1 555 0103', email: 'airport@stockysaas.site', address: 'SFO Terminal 2', city: 'San Francisco' },
]

export const categories: Category[] = [
  { id: 1, name: 'Electronics' },
  { id: 2, name: 'Grocery' },
  { id: 3, name: 'Toys & Baby' },
  { id: 4, name: 'Stationery' },
  { id: 5, name: 'Beverages' },
  { id: 6, name: 'Fashion' },
  { id: 7, name: 'Home & Living' },
  { id: 8, name: 'Health & Beauty' },
  { id: 9, name: 'Sports' },
  { id: 10, name: 'Automotive' },
  { id: 11, name: 'Laptops', parentId: 1 },
  { id: 12, name: 'Audio', parentId: 1 },
  { id: 13, name: 'Smart Home', parentId: 1 },
  { id: 14, name: 'Fresh Produce', parentId: 2 },
  { id: 15, name: 'Bakery', parentId: 2 },
  { id: 16, name: 'Dairy', parentId: 2 },
]

export const brands: Brand[] = [
  { id: 1, name: 'TechNova' },
  { id: 2, name: 'FreshMart' },
  { id: 3, name: 'LittleJoy' },
  { id: 4, name: 'Atelier' },
  { id: 5, name: 'Paper & Co' },
  { id: 6, name: 'Nike' },
  { id: 7, name: 'Samsung' },
  { id: 8, name: 'Apple' },
  { id: 9, name: 'Generic' },
]

export const units: Unit[] = [
  { id: 1, name: 'Piece', shortName: 'pc' },
  { id: 2, name: 'Kilogram', shortName: 'kg' },
  { id: 3, name: 'Gram', shortName: 'g', baseUnit: 'Kilogram', operator: '÷', operationValue: 1000 },
  { id: 4, name: 'Litre', shortName: 'L' },
  { id: 5, name: 'Box', shortName: 'box' },
  { id: 6, name: 'Pack', shortName: 'pk' },
]

type SeedProduct = [string, string, number, number, number, number, number, string]
const seedProducts: SeedProduct[] = [
  // name, code, categoryId, unitId, cost, price, stock, emoji
  ['Hardcover Notebook A5', 'PRD-0001', 4, 1, 3.2, 4.5, 148, '📓'],
  ['Spaghetti 500g', 'PRD-0002', 2, 6, 1.1, 1.6, 212, '🍝'],
  ['Orange Juice 1L', 'PRD-0003', 5, 4, 1.8, 2.6, 96, '🧃'],
  ['Red Apples', 'PRD-0004', 14, 2, 1.6, 2.4, 84, '🍎'],
  ['Whole Milk 1L', 'PRD-0005', 16, 4, 1.2, 1.7, 120, '🥛'],
  ['Vine Tomatoes 500g', 'PRD-0006', 14, 6, 1.4, 2.1, 66, '🍅'],
  ['Butter Croissants 4-pack', 'PRD-0007', 15, 6, 2.4, 3.6, 44, '🥐'],
  ['Wireless Earbuds Pro', 'PRD-0008', 12, 1, 42.0, 79.0, 38, '🎧'],
  ['Smart Watch Series 9', 'PRD-0009', 1, 1, 148.0, 249.0, 22, '⌚'],
  ['Laptop Stand Aluminium', 'PRD-0010', 11, 1, 18.0, 34.5, 57, '💻'],
  ['Bluetooth Speaker Mini', 'PRD-0011', 12, 1, 22.0, 44.0, 41, '🔊'],
  ['Smart LED Bulb', 'PRD-0012', 13, 1, 6.5, 12.9, 130, '💡'],
  ['USB-C Charger 65W', 'PRD-0013', 1, 1, 14.0, 27.0, 76, '🔌'],
  ['Mechanical Keyboard RGB', 'PRD-0014', 1, 1, 48.0, 89.0, 29, '⌨️'],
  ['Robot Vacuum Cleaner', 'PRD-0015', 13, 1, 168.0, 289.0, 11, '🤖'],
  ['Baby Stroller Comfort Ride – Graphite', 'TY-0001', 3, 1, 96.0, 189.0, 5, '👶'],
  ['Compact Travel Stroller', 'TY-0002', 3, 1, 72.0, 139.0, 5, '🍼'],
  ['Infant Car Seat with Base (0–13 kg)', 'TY-0003', 3, 1, 88.0, 169.0, 5, '🚼'],
  ['Convertible Car Seat 0–36 kg', 'TY-0004', 3, 1, 104.0, 199.0, 5, '🪑'],
  ['Soft Baby Carrier – 4 Positions', 'TY-0005', 3, 1, 42.0, 79.0, 5, '🎒'],
  ['Organic Cotton Onesie', 'TY-0006', 3, 1, 7.5, 14.0, 62, '👕'],
  ['Wooden Stacking Blocks', 'TY-0007', 3, 1, 11.0, 22.0, 34, '🧱'],
  ['Organic Green Tea 20 bags', 'PRD-0016', 5, 5, 2.9, 5.5, 88, '🍵'],
  ['Sparkling Water 6-pack', 'PRD-0017', 5, 6, 3.2, 5.9, 74, '💧'],
  ['Dark Chocolate 70%', 'PRD-0018', 2, 1, 1.9, 3.4, 105, '🍫'],
  ['Sourdough Loaf', 'PRD-0019', 15, 1, 2.2, 4.2, 28, '🍞'],
  ['Greek Yogurt 500g', 'PRD-0020', 16, 5, 2.1, 3.8, 51, '🥣'],
  ['Bamboo Cutting Board', 'PRD-0021', 7, 1, 8.0, 16.5, 47, '🔪'],
  ['Aroma Diffuser', 'PRD-0022', 7, 1, 13.5, 26.0, 39, '🕯️'],
  ['Ceramic Mug Set (4)', 'PRD-0023', 7, 5, 9.0, 18.0, 31, '☕'],
  ['Merino Wool Scarf', 'PRD-0024', 6, 1, 18.0, 39.0, 25, '🧣'],
  ['Leather Wallet', 'PRD-0025', 6, 1, 21.0, 45.0, 28, '👛'],
  ['Running Shoes Air', 'PRD-0026', 9, 1, 42.0, 89.0, 36, '👟'],
  ['Yoga Mat 6mm', 'PRD-0027', 9, 1, 12.0, 24.0, 44, '🧘'],
  ['Vitamin C Serum', 'PRD-0028', 8, 1, 8.5, 19.0, 58, '🧴'],
  ['Sunscreen SPF50', 'PRD-0029', 8, 1, 6.0, 13.5, 67, '☀️'],
  ['Car Phone Holder', 'PRD-0030', 10, 1, 4.5, 11.0, 82, '📱'],
  ['Engine Oil 5W-30 4L', 'PRD-0031', 10, 1, 22.0, 38.0, 26, '🛢️'],
]

export const products: Product[] = seedProducts.map((p, i) => {
  const [name, code, categoryId, unitId, cost, price, stock, emoji] = p
  return {
    id: i + 1,
    name,
    code,
    type: 'standard',
    barcodeSymbology: 'CODE128',
    categoryId,
    subCategoryId: null,
    brandId: categoryId === 1 || categoryId === 11 || categoryId === 12 || categoryId === 13 ? 1 : categoryId === 3 ? 3 : categoryId === 6 ? 4 : 9,
    unitId,
    cost,
    price,
    taxType: 'exclusive',
    taxRate: 0,
    taxMethod: 'percentage',
    alertQuantity: 10,
    emoji,
    stock,
    warehouseId: stock <= 5 ? 2 : 1,
    featured: i % 4 === 0,
    featuredSlider: i % 7 === 0,
    warranty: categoryId === 1 ? '12 months' : '',
    expDate: categoryId === 2 || categoryId === 15 || categoryId === 16 ? daysAgo(-90) : null,
    description: `${name} — quality product from the ${categories.find((c) => c.id === categoryId)?.name ?? 'store'} range.`,
  }
})

export const customers: Customer[] = [
  { id: 1, name: 'walk-in-customer', email: 'info@stockysaas.site', phone: '+1 555 0100', walletBalance: 0, hasLogin: false },
  { id: 2, name: 'John Carter', email: 'john.carter@example.com', phone: '+1 555 2210', address: '24 Elm Street', city: 'San Francisco', country: 'USA', walletBalance: 120.5, hasLogin: true, rewardPoints: 340 },
  { id: 3, name: 'Emily Stone', email: 'emily.stone@example.com', phone: '+1 555 3312', address: '7 Birch Lane', city: 'Oakland', country: 'USA', walletBalance: 45.0, hasLogin: true, rewardPoints: 210 },
  { id: 4, name: 'Michael Reed', email: 'michael.reed@example.com', phone: '+1 555 4410', address: '390 Pine Road', city: 'San Jose', country: 'USA', walletBalance: 0, hasLogin: true, rewardPoints: 95 },
  { id: 5, name: 'Ava Martin', email: 'ava.martin@example.com', phone: '+1 555 5512', address: '18 Oak Avenue', city: 'Berkeley', country: 'USA', walletBalance: 12.25, hasLogin: true, rewardPoints: 60 },
  { id: 6, name: 'Liam Bennett', email: 'liam.bennett@example.com', phone: '+1 555 6611', city: 'San Francisco', country: 'USA', walletBalance: 0, hasLogin: false, isPending: true },
  { id: 7, name: 'Sophia Clark', email: 'sophia.clark@example.com', phone: '+1 555 7720', city: 'Daly City', country: 'USA', walletBalance: 78.0, hasLogin: true, rewardPoints: 480 },
  { id: 8, name: 'Noah Harris', email: 'noah.harris@example.com', phone: '+1 555 8830', city: 'Fremont', country: 'USA', walletBalance: 0, hasLogin: true, rewardPoints: 30 },
  { id: 9, name: 'Isabella Ward', email: 'isabella.ward@example.com', phone: '+1 555 9941', city: 'Palo Alto', country: 'USA', walletBalance: 250.0, hasLogin: true, rewardPoints: 720 },
  { id: 10, name: 'Ethan Moore', email: 'ethan.moore@example.com', phone: '+1 555 1152', city: 'San Mateo', country: 'USA', walletBalance: 0, hasLogin: false, isPending: true },
]

export const suppliers: Supplier[] = [
  { id: 1, name: 'Pacific Wholesale Ltd', email: 'orders@pacificwholesale.com', phone: '+1 555 7001', company: 'Pacific Wholesale Ltd', address: '500 Harbor Blvd', taxNumber: 'US-8871234', walletBalance: 0 },
  { id: 2, name: 'Global Tech Distribution', email: 'sales@globaltechdist.com', phone: '+1 555 7002', company: 'Global Tech Distribution', address: '9 Innovation Way', taxNumber: 'US-5561234', walletBalance: 420.0 },
  { id: 3, name: 'Fresh Foods Supply Co', email: 'hello@freshfoodssupply.com', phone: '+1 555 7003', company: 'Fresh Foods Supply Co', address: '210 Farm Road', taxNumber: 'US-3321234', walletBalance: 0 },
  { id: 4, name: 'LittleJoy Importers', email: 'info@littlejoyimporters.com', phone: '+1 555 7004', company: 'LittleJoy Importers', address: '31 Nursery Lane', taxNumber: 'US-7711234', walletBalance: 150.0 },
  { id: 5, name: 'Atelier Textiles', email: 'supply@ateliertextiles.com', phone: '+1 555 7005', company: 'Atelier Textiles', address: '12 Silk Street', taxNumber: 'US-9921234', walletBalance: 0 },
]

const paymentMethods = ['Cash', 'Credit Card', 'bank transfer', 'Check', 'TPE', 'Western Union', 'other']

const pick = <T,>(arr: T[], i: number) => arr[i % arr.length]

/** Deterministic pseudo-random so the demo looks the same on every load. */
const rnd = (seed: number) => {
  const x = Math.sin(seed * 99991) * 10000
  return x - Math.floor(x)
}

export const sales: Sale[] = []
export const purchases: Purchase[] = []

let saleNo = 0
for (let d = 6; d >= 0; d--) {
  const count = 2 + Math.floor(rnd(d * 3 + 1) * 3)
  for (let k = 0; k < count; k++) {
    saleNo++
    const seed = d * 17 + k * 5
    const itemCount = 1 + Math.floor(rnd(seed) * 3)
    const items = []
    let subtotal = 0
    for (let it = 0; it < itemCount; it++) {
      const p = products[Math.floor(rnd(seed + it * 11) * products.length)]
      const qty = 1 + Math.floor(rnd(seed + it * 7) * 4)
      const line = +(p.price * qty).toFixed(2)
      subtotal += line
      items.push({
        productId: p.id,
        productName: p.name,
        code: p.code,
        unitPrice: p.price,
        qty,
        discount: 0,
        tax: 0,
        subtotal: line,
      })
    }
    const discount = rnd(seed + 3) > 0.8 ? +(subtotal * 0.05).toFixed(2) : 0
    const total = +(subtotal - discount).toFixed(2)
    const isDue = rnd(seed + 9) > 0.85
    const paid = isDue ? +(total * 0.5).toFixed(2) : total
    const customer = pick(customers, Math.floor(rnd(seed + 4) * customers.length))
    sales.push({
      id: saleNo,
      reference: `SL_${String(saleNo).padStart(4, '0')}`,
      customerId: customer.id,
      warehouseId: 1,
      date: daysAgo(d),
      items,
      subtotal: +subtotal.toFixed(2),
      discount,
      tax: 0,
      shipping: 0,
      total,
      paid,
      status: 'completed',
      paymentStatus: isDue ? 'partial' : 'paid',
      paymentMethod: pick(paymentMethods, seed),
      pos: rnd(seed + 12) > 0.6,
      cashier: 'John Doe',
    })
  }
}

let purchNo = 0
for (let d = 6; d >= 0; d -= 2) {
  purchNo++
  const supplier = pick(suppliers, purchNo)
  const itemCount = 2 + Math.floor(rnd(d + 50) * 3)
  const items = []
  let subtotal = 0
  for (let it = 0; it < itemCount; it++) {
    const p = products[Math.floor(rnd(d + it * 13 + 40) * products.length)]
    const qty = 5 + Math.floor(rnd(d + it * 3 + 40) * 20)
    const line = +(p.cost * qty).toFixed(2)
    subtotal += line
    items.push({
      productId: p.id,
      productName: p.name,
      code: p.code,
      unitCost: p.cost,
      qty,
      discount: 0,
      tax: 0,
      subtotal: line,
    })
  }
  const total = +subtotal.toFixed(2)
  const due = rnd(d + 60) > 0.6
  purchases.push({
    id: purchNo,
    reference: `PR_${String(purchNo).padStart(4, '0')}`,
    supplierId: supplier.id,
    warehouseId: 1,
    date: daysAgo(d),
    items,
    subtotal: total,
    discount: 0,
    tax: 0,
    shipping: 0,
    total,
    paid: due ? +(total * 0.7).toFixed(2) : total,
    status: 'received',
    paymentStatus: due ? 'partial' : 'paid',
    paymentMethod: 'bank transfer',
  })
}

export const expenses: Expense[] = [
  { id: 1, reference: 'EXP_0001', category: 'Rent', amount: 2400, date: daysAgo(20), warehouseId: 1, account: 'Cash', description: 'Monthly store rent' },
  { id: 2, reference: 'EXP_0002', category: 'Utilities', amount: 312.4, date: daysAgo(18), warehouseId: 1, account: 'Bank', description: 'Electricity & water' },
  { id: 3, reference: 'EXP_0003', category: 'Salaries', amount: 8600, date: daysAgo(15), warehouseId: 1, account: 'Bank', description: 'Payroll run' },
  { id: 4, reference: 'EXP_0004', category: 'Marketing', amount: 540, date: daysAgo(10), warehouseId: 2, account: 'Credit Card', description: 'Social media ads' },
  { id: 5, reference: 'EXP_0005', category: 'Logistics', amount: 275.9, date: daysAgo(6), warehouseId: 1, account: 'Cash', description: 'Courier charges' },
  { id: 6, reference: 'EXP_0006', category: 'Maintenance', amount: 189, date: daysAgo(3), warehouseId: 2, account: 'Cash', description: 'POS terminal repair' },
]

export const accounts: Account[] = [
  { id: 1, name: 'Cash', code: '1001', type: 'asset', balance: 18420.55 },
  { id: 2, name: 'Bank Account', code: '1002', type: 'asset', balance: 96430.1 },
  { id: 3, name: 'Accounts Receivable', code: '1100', type: 'asset', balance: 5320.0 },
  { id: 4, name: 'Inventory', code: '1200', type: 'asset', balance: 2587437.95 },
  { id: 5, name: 'Accounts Payable', code: '2001', type: 'liability', balance: 12460.0 },
  { id: 6, name: 'Tax Payable', code: '2100', type: 'liability', balance: 3180.0 },
  { id: 7, name: "Owner's Equity", code: '3001', type: 'equity', balance: 150000.0 },
  { id: 8, name: 'Sales Revenue', code: '4001', type: 'revenue', balance: 428310.4 },
  { id: 9, name: 'Sales Returns', code: '4100', type: 'revenue', balance: 4210.0 },
  { id: 10, name: 'Cost of Goods Sold', code: '5001', type: 'expense', balance: 236120.0 },
  { id: 11, name: 'Salaries Expense', code: '5100', type: 'expense', balance: 86000.0 },
  { id: 12, name: 'Rent Expense', code: '5200', type: 'expense', balance: 28800.0 },
  { id: 13, name: 'Utilities Expense', code: '5300', type: 'expense', balance: 6400.0 },
  { id: 14, name: 'Marketing Expense', code: '5400', type: 'expense', balance: 9800.0 },
]

export const journalEntries: JournalEntry[] = [
  { id: 1, date: daysAgo(20), reference: 'JE-0001', description: 'Rent payment for headquarters', lines: [{ account: 'Rent Expense', debit: 2400, credit: 0 }, { account: 'Cash', debit: 0, credit: 2400 }], status: 'posted' },
  { id: 2, date: daysAgo(15), reference: 'JE-0002', description: 'Monthly payroll', lines: [{ account: 'Salaries Expense', debit: 8600, credit: 0 }, { account: 'Bank Account', debit: 0, credit: 8600 }], status: 'posted' },
  { id: 3, date: daysAgo(9), reference: 'JE-0003', description: 'Credit sale to John Carter', lines: [{ account: 'Accounts Receivable', debit: 117.5, credit: 0 }, { account: 'Sales Revenue', debit: 0, credit: 117.5 }], status: 'posted' },
  { id: 4, date: daysAgo(5), reference: 'JE-0004', description: 'Restock purchase from Pacific Wholesale', lines: [{ account: 'Inventory', debit: 1755, credit: 0 }, { account: 'Accounts Payable', debit: 0, credit: 1755 }], status: 'posted' },
  { id: 5, date: daysAgo(2), reference: 'JE-0005', description: 'Marketing campaign accrual', lines: [{ account: 'Marketing Expense', debit: 540, credit: 0 }, { account: 'Accounts Payable', debit: 0, credit: 540 }], status: 'draft' },
]

export const departments: Department[] = [
  { id: 1, name: 'Sales', head: 'John Doe', employees: 5 },
  { id: 2, name: 'Warehouse', head: 'Ava Martin', employees: 4 },
  { id: 3, name: 'Finance', head: 'Sophia Clark', employees: 2 },
  { id: 4, name: 'IT', head: 'Michael Reed', employees: 3 },
  { id: 5, name: 'HR', head: 'Emily Stone', employees: 2 },
]

export const designations: Designation[] = [
  { id: 1, name: 'Store Manager', department: 'Sales' },
  { id: 2, name: 'Cashier', department: 'Sales' },
  { id: 3, name: 'Warehouse Supervisor', department: 'Warehouse' },
  { id: 4, name: 'Picker / Packer', department: 'Warehouse' },
  { id: 5, name: 'Accountant', department: 'Finance' },
  { id: 6, name: 'Software Engineer', department: 'IT' },
  { id: 7, name: 'HR Generalist', department: 'HR' },
]

export const employees: Employee[] = [
  { id: 1, name: 'John Doe', email: 'john@stockysaas.site', phone: '+1 555 9001', department: 'Sales', designation: 'Store Manager', salary: 6200, joinDate: '2021-03-15', status: 'active', employeeType: 'permanent' },
  { id: 2, name: 'Ava Martin', email: 'ava@stockysaas.site', phone: '+1 555 9002', department: 'Warehouse', designation: 'Warehouse Supervisor', salary: 4400, joinDate: '2022-01-10', status: 'active', employeeType: 'permanent' },
  { id: 3, name: 'Sophia Clark', email: 'sophia@stockysaas.site', phone: '+1 555 9003', department: 'Finance', designation: 'Accountant', salary: 5100, joinDate: '2020-08-01', status: 'active', employeeType: 'permanent' },
  { id: 4, name: 'Michael Reed', email: 'michael@stockysaas.site', phone: '+1 555 9004', department: 'IT', designation: 'Software Engineer', salary: 7800, joinDate: '2019-05-20', status: 'active', employeeType: 'permanent' },
  { id: 5, name: 'Emily Stone', email: 'emily@stockysaas.site', phone: '+1 555 9005', department: 'HR', designation: 'HR Generalist', salary: 4200, joinDate: '2023-02-01', status: 'active', employeeType: 'permanent' },
  { id: 6, name: 'Liam Bennett', email: 'liam@stockysaas.site', phone: '+1 555 9006', department: 'Sales', designation: 'Cashier', salary: 2900, joinDate: '2024-06-12', status: 'active', employeeType: 'contract' },
  { id: 7, name: 'Isabella Ward', email: 'isabella@stockysaas.site', phone: '+1 555 9007', department: 'Sales', designation: 'Cashier', salary: 2800, joinDate: '2024-09-03', status: 'active', employeeType: 'contract' },
  { id: 8, name: 'Ethan Moore', email: 'ethan@stockysaas.site', phone: '+1 555 9008', department: 'Warehouse', designation: 'Picker / Packer', salary: 2400, joinDate: '2025-01-15', status: 'inactive', employeeType: 'intern' },
]

export const attendance: Attendance[] = []
let attId = 0
employees.forEach((e) => {
  for (let d = 6; d >= 0; d--) {
    attId++
    const r = rnd(e.id * 31 + d)
    attendance.push({
      id: attId,
      employeeId: e.id,
      date: daysAgo(d),
      status: r > 0.94 ? 'absent' : r > 0.89 ? 'late' : r > 0.86 ? 'leave' : 'present',
      checkIn: r > 0.89 && r < 0.94 ? '09:45' : '09:00',
      checkOut: '18:00',
    })
  }
})

export const leaveRequests: LeaveRequest[] = [
  { id: 1, employeeId: 2, leaveType: 'Annual Leave', from: daysAgo(-4), to: daysAgo(-7), reason: 'Family trip', status: 'pending', days: 4 },
  { id: 2, employeeId: 6, leaveType: 'Sick Leave', from: daysAgo(2), to: daysAgo(1), reason: 'Flu', status: 'approved', days: 2 },
  { id: 3, employeeId: 5, leaveType: 'Casual Leave', from: daysAgo(-10), to: daysAgo(-10), reason: 'Personal errands', status: 'pending', days: 1 },
  { id: 4, employeeId: 3, leaveType: 'Annual Leave', from: daysAgo(30), to: daysAgo(25), reason: 'Vacation', status: 'approved', days: 6 },
]

export const payroll: Payroll[] = employees.flatMap((e, i) => [
  { id: i * 2 + 1, employeeId: e.id, month: '2026-10', baseSalary: e.salary, bonuses: i % 3 === 0 ? 200 : 0, deductions: 0.1 * e.salary, netPay: +(e.salary * 0.9 + (i % 3 === 0 ? 200 : 0)).toFixed(2), status: 'paid' as const },
  { id: i * 2 + 2, employeeId: e.id, month: '2026-11', baseSalary: e.salary, bonuses: 0, deductions: 0.1 * e.salary, netPay: +(e.salary * 0.9).toFixed(2), status: 'pending' as const },
])

export const demoUser = {
  id: 1,
  name: 'John Doe',
  email: 'john@stockysaas.site',
  role: 'admin' as const,
  avatarColor: '#6d28d9',
}
