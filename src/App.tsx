import { useState, type ReactNode } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { Badge, Dropdown, Input } from 'antd'
import { useStore } from './store/useStore'
import { navSections, titleForPath, type NavGroup, type NavLeaf } from './config/nav'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import POS from './pages/POS'
import Products from './pages/Products'
import ProductForm from './pages/ProductForm'
import SimpleList from './pages/master/SimpleList'
import { SalesList, SaleForm } from './pages/SalesList'
import Purchases from './pages/Purchases'
import PurchaseForm from './pages/PurchaseForm'
import Customers from './pages/Customers'
import CustomerForm from './pages/CustomerForm'
import Suppliers from './pages/Suppliers'
import SupplierForm from './pages/SupplierForm'
import Reports from './pages/Reports'
import HRMEmployees, { HRMAttendance, HRMLeave, HRMPayroll } from './pages/HRMEmployees'
import Accounting from './pages/Accounting'
import Storefront from './pages/Storefront'
import Settings from './pages/Settings'
import SettingsWarehouses from './pages/SettingsWarehouses'
import SettingsModules from './pages/SettingsModules'
import SettingsBackup from './pages/SettingsBackup'
import Billing from './pages/Billing'
import Support from './pages/Support'
import AiAssistant from './pages/AiAssistant'
import Labels from './pages/Labels'
import PriceCheck from './pages/PriceCheck'
import GenericModule from './pages/GenericModule'

const icons: Record<string, string> = {
  dashboard: '📊', pos: '🧾', ai: '🤖', products: '📦', sales: '🛒', purchases: '📥',
  courier: '🚚', people: '👥', hrm: '🧑‍💼', accounting: '💰', reports: '📈',
  marketing: '📣', crm: '🎯', projects: '🗂️', manufacturing: '🏭', assets: '🏷️',
  booking: '📅', service: '🔧', store: '🛍️', realestate: '🏠', fleet: '🚗',
  hospital: '🏥', school: '🏫', restaurant: '🍽️', rental: '🔑', settings: '⚙️',
  billing: '💳', support: '💬',
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState<string[]>(['Products', 'Sales', 'People'])
  const user = useStore((s) => s.user)

  const toggle = (label: string) =>
    setOpen((o) => (o.includes(label) ? o.filter((x) => x !== label) : [...o, label]))

  const renderItems = (items: (NavLeaf | NavGroup)[], depth = 0): ReactNode[] =>
    items.map((item, idx) => {
      if ('children' in item) {
        const isOpen = open.includes(item.label)
        const anyChildActive = item.children.some(
          (c) => !('children' in c) && location.pathname === c.path,
        )
        return (
          <div key={`${item.label}-${idx}`}>
            <div
              className={`nav-item ${anyChildActive && !isOpen ? 'active' : ''}`}
              onClick={() => toggle(item.label)}
            >
              <span className="nav-ico">{icons[item.icon ?? ''] ?? '•'}</span>
              <span className="nav-label">{item.label}</span>
              <span className="nav-arrow">{isOpen ? '▾' : '▸'}</span>
            </div>
            {isOpen && <div className="nav-sub">{renderItems(item.children, depth + 1)}</div>}
          </div>
        )
      }
      const active = location.pathname === item.path
      return (
        <div
          key={item.path}
          className={`nav-item ${active ? 'active' : ''}`}
          onClick={() => {
            navigate(item.path)
            onNavigate?.()
          }}
        >
          {depth === 0 && <span className="nav-ico">{icons[item.icon ?? ''] ?? '•'}</span>}
          <span className="nav-label">{item.label}</span>
        </div>
      )
    })

  return (
    <nav className="sidebar-scroll">
      {navSections.map((section, i) => (
        <div key={i}>
          {section.title && <div className="nav-group-title">{section.title}</div>}
          {renderItems(section.items)}
        </div>
      ))}
      {user && (
        <div className="nav-group-title" style={{ marginTop: 10 }}>
          {user.name}
        </div>
      )}
    </nav>
  )
}

export default function App() {
  const user = useStore((s) => s.user)
  const sidebarCollapsed = useStore((s) => s.sidebarCollapsed)
  const toggleSidebar = useStore((s) => s.toggleSidebar)
  const logout = useStore((s) => s.logout)
  const settings = useStore((s) => s.settings)
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  if (!user) {
    return (
      <Routes>
        <Route path="/store" element={<Storefront />} />
        <Route path="*" element={<Login />} />
      </Routes>
    )
  }

  const title = titleForPath(location.pathname)

  return (
    <div className="app-shell">
      <aside className={`app-sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-brand">
          <div className="logo">S</div>
          <div>
            <div className="name">{settings.storeName}</div>
            <div className="sub">{settings.tagline}</div>
          </div>
        </div>
        <SidebarNav onNavigate={() => setMobileOpen(false)} />
        <div style={{ padding: 12, borderTop: '1px solid var(--border)' }}>
          <div className="nav-item" onClick={logout}>
            <span className="nav-ico">🚪</span>
            <span className="nav-label">Sign out</span>
          </div>
        </div>
      </aside>

      <div className={`app-main ${sidebarCollapsed ? 'wide' : ''}`}>
        <header className="app-header">
          <button
            onClick={() => {
              toggleSidebar()
              setMobileOpen((v) => !v)
            }}
            style={{
              padding: '4px 10px', cursor: 'pointer', borderRadius: 6,
              border: '1px solid var(--border)', background: 'var(--surface-2)', color: 'var(--text-primary)',
            }}
          >
            ☰
          </button>
          <span className="page-title">{title}</span>
          <div style={{ flex: 1 }} />
          <Input.Search placeholder="Search…" size="small" style={{ width: 200 }} />
          <Badge count={0} size="small">
            <span style={{ fontSize: 16, cursor: 'pointer' }}>🔔</span>
          </Badge>
          <Dropdown
            menu={{
              items: [
                { key: 'profile', label: 'Profile' },
                { key: 'settings', label: 'Settings', onClick: () => navigate('/settings') },
                { key: 'logout', label: 'Sign out', onClick: logout },
              ],
            }}
          >
            <div
              style={{
                width: 34, height: 34, borderRadius: '50%',
                background: user.avatarColor, color: '#fff',
                display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 12,
                cursor: 'pointer',
              }}
            >
              JD
            </div>
          </Dropdown>
        </header>

        <div className="app-content">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/pos" element={<POS />} />
            <Route path="/ai-assistant" element={<AiAssistant />} />

            <Route path="/products" element={<Products />} />
            <Route path="/products/create" element={<ProductForm />} />
            <Route path="/products/categories" element={<SimpleList kind="categories" />} />
            <Route path="/products/brands" element={<SimpleList kind="brands" />} />
            <Route path="/products/units" element={<SimpleList kind="units" />} />
            <Route path="/products/labels" element={<Labels />} />
            <Route path="/products/price-check" element={<PriceCheck />} />

            <Route path="/sales" element={<SalesList />} />
            <Route path="/sales/create" element={<SaleForm />} />
            <Route path="/sales/customer-screen" element={<SalesList customerScreen />} />

            <Route path="/purchases" element={<Purchases />} />
            <Route path="/purchases/create" element={<PurchaseForm />} />

            <Route path="/people/customers" element={<Customers />} />
            <Route path="/people/customers/create" element={<CustomerForm />} />
            <Route path="/people/suppliers" element={<Suppliers />} />
            <Route path="/people/suppliers/create" element={<SupplierForm />} />
            <Route path="/people/gift-cards" element={<GenericModule moduleKey="giftCards" />} />
            <Route path="/people/customer-wallets" element={<Customers />} />
            <Route path="/people/supplier-wallets" element={<Suppliers />} />

            <Route path="/reports" element={<Reports />} />

            <Route path="/hrm/employees" element={<HRMEmployees />} />
            <Route path="/hrm/attendance" element={<HRMAttendance />} />
            <Route path="/hrm/leave" element={<HRMLeave />} />
            <Route path="/hrm/payroll" element={<HRMPayroll />} />
            <Route path="/hrm/departments" element={<SimpleList kind="departments" />} />
            <Route path="/hrm/designations" element={<SimpleList kind="designations" />} />
            <Route path="/hrm/holidays" element={<GenericModule moduleKey="holidays" />} />
            <Route path="/hrm/contracts" element={<GenericModule moduleKey="contracts" />} />
            <Route path="/hrm/recruitment" element={<GenericModule moduleKey="jobPosts" />} />

            <Route path="/accounting" element={<Accounting />} />
            <Route path="/accounting/accounts" element={<Accounting />} />
            <Route path="/accounting/journal" element={<GenericModule moduleKey="deposits" title="Journal Entries" />} />
            <Route path="/accounting/trial-balance" element={<Accounting />} />
            <Route path="/accounting/profit-loss" element={<Accounting />} />
            <Route path="/accounting/balance-sheet" element={<Accounting />} />
            <Route path="/accounting/expenses" element={<Accounting />} />
            <Route path="/accounting/deposits" element={<GenericModule moduleKey="deposits" />} />
            <Route path="/accounting/transfers" element={<GenericModule moduleKey="moneyTransfers" />} />
            <Route path="/accounting/expense-categories" element={<GenericModule moduleKey="expenseCategories" />} />

            <Route path="/store" element={<Storefront embedded />} />

            <Route path="/settings" element={<Settings />} />
            <Route path="/settings/warehouses" element={<SettingsWarehouses />} />
            <Route path="/settings/modules" element={<SettingsModules />} />
            <Route path="/settings/backup" element={<SettingsBackup />} />
            <Route path="/settings/pos" element={<Settings />} />
            <Route path="/settings/currency" element={<Settings />} />
            <Route path="/settings/payment-methods" element={<Settings />} />
            <Route path="/settings/audit-log" element={<GenericModule moduleKey="auditLogs" />} />
            <Route path="/billing/plan" element={<Billing />} />
            <Route path="/billing/change-plan" element={<Billing />} />
            <Route path="/billing/invoices" element={<GenericModule moduleKey="invoices" />} />
            <Route path="/support" element={<Support />} />

            <Route path="*" element={<GenericModule auto />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}
