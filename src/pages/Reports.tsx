import { useMemo, useState } from 'react'
import { Card, Col, Row, Segmented, Statistic } from 'antd'
import {
  Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from 'recharts'
import { useStore, money } from '../store/useStore'

const C = { grid: 'rgba(148,163,184,.12)', axis: '#64748b' }
const tooltipStyle = {
  background: '#0f131c', border: '1px solid rgba(148,163,184,.2)',
  borderRadius: 8, color: '#f1f5f9', fontSize: 12,
}

const reportList = [
  'Sales Report', 'Purchases Report', 'Profit & Loss', 'Payments', 'Sales Return',
  'Purchases Return', 'Cash Flow', 'Profit by Product', 'Profit by Category',
  'Profit by Customer', 'Profit by Warehouse', 'Stock Inventory Valuation',
  'Product Quantity Alerts', 'Expiry Report', 'Top Selling Products', 'Best Customers',
  'Top Suppliers', 'Users Report', 'Tax Summary', 'Discount Summary',
]

export default function Reports() {
  const sales = useStore((s) => s.sales)
  const purchases = useStore((s) => s.purchases)
  const products = useStore((s) => s.products)
  const customers = useStore((s) => s.customers)
  const suppliers = useStore((s) => s.suppliers)
  const expenses = useStore((s) => s.expenses)
  const settings = useStore((s) => s.settings)
  const [range, setRange] = useState<'7D' | '30D' | 'YTD'>('7D')
  const sym = settings.currencySymbol

  const trend = useMemo(() => {
    const days = range === '7D' ? 7 : range === '30D' ? 30 : 90
    const out: { date: string; Sales: number; Purchases: number }[] = []
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toISOString().slice(0, 10)
      out.push({
        date: key.slice(5),
        Sales: +sales.filter((x) => x.date === key).reduce((a, x) => a + x.total, 0).toFixed(2),
        Purchases: +purchases.filter((x) => x.date === key).reduce((a, x) => a + x.total, 0).toFixed(2),
      })
    }
    return out
  }, [sales, purchases, range])

  const profitByProduct = useMemo(() => {
    const map = new Map<string, { sold: number; revenue: number; cost: number }>()
    sales.forEach((s) =>
      s.items.forEach((it) => {
        const p = products.find((x) => x.id === it.productId)
        const cur = map.get(it.productName) ?? { sold: 0, revenue: 0, cost: 0 }
        cur.sold += it.qty
        cur.revenue += it.subtotal
        cur.cost += (p?.cost ?? 0) * it.qty
        map.set(it.productName, cur)
      }),
    )
    return [...map.entries()]
      .map(([name, v]) => ({ name, profit: +(v.revenue - v.cost).toFixed(2) }))
      .sort((a, b) => b.profit - a.profit)
      .slice(0, 7)
  }, [sales, products])

  const salesByCustomer = useMemo(() => {
    const map = new Map<number, number>()
    sales.forEach((s) => map.set(s.customerId, (map.get(s.customerId) ?? 0) + s.total))
    return [...map.entries()]
      .map(([id, total]) => ({ name: customers.find((c) => c.id === id)?.name ?? '—', total: +total.toFixed(2) }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 7)
  }, [sales, customers])

  const supplierTotals = useMemo(
    () =>
      suppliers
        .map((s) => ({
          name: s.name,
          total: +purchases.filter((p) => p.supplierId === s.id).reduce((a, p) => a + p.total, 0).toFixed(2),
        }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 6),
    [suppliers, purchases],
  )

  const totals = useMemo(() => {
    const revenue = sales.reduce((a, s) => a + s.total, 0)
    const cogs = sales.reduce((a, s) => a + s.items.reduce((c, it) => {
      const p = products.find((x) => x.id === it.productId)
      return c + (p?.cost ?? 0) * it.qty
    }, 0), 0)
    const exp = expenses.reduce((a, e) => a + e.amount, 0)
    return { revenue, cogs, exp, net: revenue - cogs - exp }
  }, [sales, products, expenses])

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Card
        title="Reports"
        extra={
          <Segmented
            options={['7D', '30D', 'YTD']}
            value={range}
            onChange={(v) => setRange(v as typeof range)}
            size="small"
          />
        }
      >
        <Row gutter={[12, 12]}>
          <Col xs={24} md={6}><Statistic title="Revenue" value={money(totals.revenue, sym)} /></Col>
          <Col xs={24} md={6}><Statistic title="Cost of goods sold" value={money(totals.cogs, sym)} /></Col>
          <Col xs={24} md={6}><Statistic title="Operating expenses" value={money(totals.exp, sym)} /></Col>
          <Col xs={24} md={6}>
            <Statistic title="Net profit" value={money(totals.net, sym)} valueStyle={{ color: totals.net >= 0 ? 'var(--success)' : 'var(--danger)' }} />
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={12}>
          <Card title="Sales vs Purchases" size="small">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={trend} margin={{ left: -18, right: 8 }}>
                <CartesianGrid stroke={C.grid} vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: C.axis }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: C.axis }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="Sales" stroke="#38bdf8" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Purchases" stroke="#a78bfa" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} xl={12}>
          <Card title="Profit by Product" size="small">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={profitByProduct} layout="vertical" margin={{ left: 8, right: 16 }}>
                <CartesianGrid stroke={C.grid} horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: C.axis }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 10.5, fill: C.axis }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="profit" fill="#34d399" radius={[0, 6, 6, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} xl={12}>
          <Card title="Best Customers" size="small">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={salesByCustomer} layout="vertical" margin={{ left: 8, right: 16 }}>
                <CartesianGrid stroke={C.grid} horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: C.axis }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 10.5, fill: C.axis }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="total" fill="#38bdf8" radius={[0, 6, 6, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} xl={12}>
          <Card title="Top Suppliers" size="small">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={supplierTotals} layout="vertical" margin={{ left: 8, right: 16 }}>
                <CartesianGrid stroke={C.grid} horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: C.axis }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 10.5, fill: C.axis }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="total" fill="#a78bfa" radius={[0, 6, 6, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Card title="All Reports" size="small">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 8 }}>
          {reportList.map((r) => (
            <div
              key={r}
              style={{
                padding: '9px 12px', borderRadius: 8, background: 'var(--surface-2)',
                fontSize: 12.5, cursor: 'pointer', border: '1px solid var(--border)',
              }}
            >
              📄 {r}
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
