import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  Account, Attendance, Brand, Category, Customer, Department, Designation,
  Employee, Expense, JournalEntry, LeaveRequest, Payroll, Product, Purchase,
  Sale, StoreSettings, Supplier, Unit, User, Warehouse,
} from '../types'
import * as seed from '../data/seed'

export interface AppState {
  /* auth */
  user: User | null
  login: (email: string, password: string) => boolean
  logout: () => void

  /* settings */
  settings: StoreSettings
  updateSettings: (patch: Partial<StoreSettings>) => void
  sidebarCollapsed: boolean
  toggleSidebar: () => void

  /* master data */
  products: Product[]
  categories: Category[]
  brands: Brand[]
  units: Unit[]
  warehouses: Warehouse[]
  customers: Customer[]
  suppliers: Supplier[]

  /* transactions */
  sales: Sale[]
  purchases: Purchase[]
  expenses: Expense[]
  accounts: Account[]
  journalEntries: JournalEntry[]

  /* hrm */
  employees: Employee[]
  attendance: Attendance[]
  leaveRequests: LeaveRequest[]
  payroll: Payroll[]
  departments: Department[]
  designations: Designation[]

  /* generic buckets for long-tail modules */
  records: Record<string, Record<string, unknown>[]>

  /* actions */
  addProduct: (p: Omit<Product, 'id'>) => void
  updateProduct: (id: number, patch: Partial<Product>) => void
  deleteProduct: (id: number) => void
  addSale: (s: Omit<Sale, 'id' | 'reference'>) => Sale
  addPurchase: (p: Omit<Purchase, 'id' | 'reference'>) => void
  addCustomer: (c: Omit<Customer, 'id'>) => void
  updateCustomer: (id: number, patch: Partial<Customer>) => void
  deleteCustomer: (id: number) => void
  addSupplier: (s: Omit<Supplier, 'id'>) => void
  deleteSupplier: (id: number) => void
  addExpense: (e: Omit<Expense, 'id' | 'reference'>) => void
  addEmployee: (e: Omit<Employee, 'id'>) => void
  updateEmployee: (id: number, patch: Partial<Employee>) => void
  addCategory: (name: string, parentId?: number | null) => void
  addBrand: (name: string) => void
  addWarehouse: (w: Omit<Warehouse, 'id'>) => void

  recordFor: (key: string) => Record<string, unknown>[]
  addRecord: (key: string, row: Record<string, unknown>) => void
  updateRecord: (key: string, id: string | number, patch: Record<string, unknown>) => void
  deleteRecord: (key: string, id: string | number) => void

  resetDemo: () => void
}

const nextId = (rows: { id: number }[]) => (rows.length ? Math.max(...rows.map((r) => r.id)) + 1 : 1)

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      login: (email, password) => {
        if (email.trim().toLowerCase() === 'john@stockysaas.site' && password === '12345678') {
          set({ user: seed.demoUser })
          return true
        }
        return false
      },
      logout: () => set({ user: null }),

      settings: seed.settings,
      updateSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),
      sidebarCollapsed: false,
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

      products: seed.products,
      categories: seed.categories,
      brands: seed.brands,
      units: seed.units,
      warehouses: seed.warehouses,
      customers: seed.customers,
      suppliers: seed.suppliers,

      sales: seed.sales,
      purchases: seed.purchases,
      expenses: seed.expenses,
      accounts: seed.accounts,
      journalEntries: seed.journalEntries,

      employees: seed.employees,
      attendance: seed.attendance,
      leaveRequests: seed.leaveRequests,
      payroll: seed.payroll,
      departments: seed.departments,
      designations: seed.designations,

      records: {},

      addProduct: (p) =>
        set((s) => ({ products: [{ ...p, id: nextId(s.products) } as Product, ...s.products] })),
      updateProduct: (id, patch) =>
        set((s) => ({ products: s.products.map((p) => (p.id === id ? { ...p, ...patch } : p)) })),
      deleteProduct: (id) => set((s) => ({ products: s.products.filter((p) => p.id !== id) })),

      addSale: (sale) => {
        const s = get()
        const id = nextId(s.sales)
        const full: Sale = { ...sale, id, reference: `SL_${String(id).padStart(4, '0')}` }
        set({
          sales: [full, ...s.sales],
          products: s.products.map((p) => {
            const line = sale.items.find((i) => i.productId === p.id)
            return line ? { ...p, stock: Math.max(0, p.stock - line.qty) } : p
          }),
        })
        return full
      },

      addPurchase: (purchase) => {
        const s = get()
        const id = nextId(s.purchases)
        set({
          purchases: [{ ...purchase, id, reference: `PR_${String(id).padStart(4, '0')}` }, ...s.purchases],
          products: s.products.map((p) => {
            const line = purchase.items.find((i) => i.productId === p.id)
            return line ? { ...p, stock: p.stock + line.qty } : p
          }),
        })
      },

      addCustomer: (c) => set((s) => ({ customers: [...s.customers, { ...c, id: nextId(s.customers) }] })),
      updateCustomer: (id, patch) =>
        set((s) => ({ customers: s.customers.map((c) => (c.id === id ? { ...c, ...patch } : c)) })),
      deleteCustomer: (id) => set((s) => ({ customers: s.customers.filter((c) => c.id !== id) })),

      addSupplier: (sup) => set((s) => ({ suppliers: [...s.suppliers, { ...sup, id: nextId(s.suppliers) }] })),
      deleteSupplier: (id) => set((s) => ({ suppliers: s.suppliers.filter((x) => x.id !== id) })),

      addExpense: (e) =>
        set((s) => {
          const id = nextId(s.expenses)
          return { expenses: [{ ...e, id, reference: `EXP_${String(id).padStart(4, '0')}` }, ...s.expenses] }
        }),

      addEmployee: (e) => set((s) => ({ employees: [...s.employees, { ...e, id: nextId(s.employees) }] })),
      updateEmployee: (id, patch) =>
        set((s) => ({ employees: s.employees.map((e) => (e.id === id ? { ...e, ...patch } : e)) })),

      addCategory: (name, parentId = null) =>
        set((s) => ({ categories: [...s.categories, { id: nextId(s.categories), name, parentId }] })),
      addBrand: (name) => set((s) => ({ brands: [...s.brands, { id: nextId(s.brands), name }] })),
      addWarehouse: (w) => set((s) => ({ warehouses: [...s.warehouses, { ...w, id: nextId(s.warehouses) }] })),

      recordFor: (key) => get().records[key] ?? [],
      addRecord: (key, row) =>
        set((s) => {
          const rows = s.records[key] ?? []
          const id = rows.length ? Math.max(...rows.map((r) => Number(r.id) || 0)) + 1 : 1
          return { records: { ...s.records, [key]: [{ ...row, id }, ...rows] } }
        }),
      updateRecord: (key, id, patch) =>
        set((s) => ({
          records: {
            ...s.records,
            [key]: (s.records[key] ?? []).map((r) => (r.id === id ? { ...r, ...patch } : r)),
          },
        })),
      deleteRecord: (key, id) =>
        set((s) => ({
          records: { ...s.records, [key]: (s.records[key] ?? []).filter((r) => r.id !== id) },
        })),

      resetDemo: () =>
        set({
          products: seed.products,
          categories: seed.categories,
          brands: seed.brands,
          units: seed.units,
          warehouses: seed.warehouses,
          customers: seed.customers,
          suppliers: seed.suppliers,
          sales: seed.sales,
          purchases: seed.purchases,
          expenses: seed.expenses,
          accounts: seed.accounts,
          journalEntries: seed.journalEntries,
          employees: seed.employees,
          attendance: seed.attendance,
          leaveRequests: seed.leaveRequests,
          payroll: seed.payroll,
          departments: seed.departments,
          designations: seed.designations,
          records: {},
          settings: seed.settings,
        }),
    }),
    {
      name: 'stocky-erp-v1',
      partialize: (state) => {
        const { login: _l, logout: _o, ...rest } = state
        const { ...actions } = rest
        const data: Record<string, unknown> = {}
        Object.entries(actions).forEach(([k, v]) => {
          if (typeof v !== 'function') data[k] = v
        })
        return data as unknown as AppState
      },
    },
  ),
)

export const money = (n: number, symbol = '$') =>
  symbol + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
