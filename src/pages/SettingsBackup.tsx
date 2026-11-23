import { Alert, Button, Card, Space, message } from 'antd'
import { useStore } from '../store/useStore'

export default function SettingsBackup() {
  const store = useStore()

  const exportData = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      products: store.products,
      categories: store.categories,
      customers: store.customers,
      suppliers: store.suppliers,
      sales: store.sales,
      purchases: store.purchases,
      expenses: store.expenses,
      employees: store.employees,
      records: store.records,
      settings: store.settings,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `stocky-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    message.success('Backup downloaded')
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Card title="Backup">
        <Alert
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
          message="Browser storage"
          description="All data in this demo is stored in your browser's local storage. Download a JSON backup before clearing browser data."
        />
        <Space>
          <Button type="primary" onClick={exportData}>📥 Download backup (JSON)</Button>
          <Button
            danger
            onClick={() => {
              store.resetDemo()
              message.success('Demo data restored')
            }}
          >
            ♻ Reset to demo data
          </Button>
        </Space>
      </Card>

      <Card title="Record counts" size="small">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
          {[
            ['Products', store.products.length],
            ['Customers', store.customers.length],
            ['Suppliers', store.suppliers.length],
            ['Sales', store.sales.length],
            ['Purchases', store.purchases.length],
            ['Expenses', store.expenses.length],
            ['Employees', store.employees.length],
            ['Custom records', Object.values(store.records).reduce((a, r) => a + r.length, 0)],
          ].map(([label, count]) => (
            <div key={String(label)} style={{ background: 'var(--surface-2)', borderRadius: 8, padding: 12 }}>
              <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }}>{label}</div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{count}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
