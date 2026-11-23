import { useMemo, useState } from 'react'
import { Button, Col, Row, Segmented, Table, Tag } from 'antd'
import { useNavigate } from 'react-router-dom'
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import { useStore, money } from '../store/useStore'

const C = {
  sales: '#38bdf8',
  purchases: '#a78bfa',
  sent: '#f472b6',
  received: '#34d399',
  grid: 'rgba(148,163,184,.12)',
  axis: '#64748b',
}
const PIE_COLORS = ['#38bdf8', '#a78bfa', '#34d399', '#fbbf24', '#f472b6', '#fb7185', '#94a3b8']

const card: React.CSSProperties = {
  background: 'var(--surface-1)',
  border: '1px solid var(--border)',
  borderRadius: 12,
  padding: 16,
  height: '100%',
}

function Stat({
  label, value, tone,
}: { label: string; value: string; tone?: string }) {
  return (
    <div style={card}>
      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: tone ?? 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>
        {value}
      </div>
    </div>
  )
}

function Panel({ title, extra, children }: { title: string; extra?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ ...card, padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontWeight: 650, fontSize: 14 }}>{title}</span>
        {extra}
      </div>
      {children}
    </div>
  )
}

const tooltipStyle = {
  background: '#0f131c',
  border: '1px solid rgba(148,163,184,.2)',
  borderRadius: 8,
  color: '#f1f5f9',
  fontSize: 12,
}

export default function Dashboard() {
  const navigate = useNavigate()
  const sales = useStore((s) => s.sales)
  const purchases = useStore((s) => s.purchases)
  const products = useStore((s) => s.products)
  const customers = useStore((s) => s.customers)
  const settings = useStore((s) => s.settings)
  const [range, setRange] = useState<'7D' | '30D' | 'MTD' | 'YTD'>('7D')

  const sym = settings.currencySymbol

  const kpi = useMemo(() => {
    const salesTotal = sales.reduce((a, s) => a + s.total, 0)
    const purchasesTotal = purchases.reduce((a, p) => a + p.total, 0)
    const salesDue = sales.reduce((a, s) => a + (s.total - s.paid), 0)
    const purchaseDue = purchases.reduce((a, p) => a + (p.total - p.paid), 0)
    const profit = sales.reduce((a, sale) => {
      const cogs = sale.items.reduce((c, it) => {
        const p = products.find((x) => x.id === it.productId)
        return c + (p ? p.cost * it.qty : 0)
      }, 0)
      return a + (sale.total - cogs)
    }, 0)
    const stockCost = products.reduce((a, p) => a + p.cost * p.stock, 0)
    const stockRetail = products.reduce((a, p) => a + p.price * p.stock, 0)
    return {
      salesTotal, purchasesTotal, salesDue, purchaseDue, profit,
      invoices: sales.length, stockCost, stockRetail,
      salesReturn: 4.1, purchaseReturn: 7.1,
    }
  }, [sales, purchases, products])

  const trend = useMemo(() => {
    const days = range === '7D' ? 7 : range === '30D' ? 30 : range === 'MTD' ? 22 : 90
    const out: { date: string; Sales: number; Purchases: number }[] = []
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toISOString().slice(0, 10)
      const s = sales.filter((x) => x.date === key).reduce((a, x) => a + x.total, 0)
      const p = purchases.filter((x) => x.date === key).reduce((a, x) => a + x.total, 0)
      out.push({ date: key.slice(5), Sales: +s.toFixed(2), Purchases: +p.toFixed(2) })
    }
    return out
  }, [sales, purchases, range])

  const topProducts = useMemo(() => {
    const map = new Map<number, { name: string; qty: number; amount: number }>()
    sales.forEach((s) =>
      s.items.forEach((it) => {
        const cur = map.get(it.productId) ?? { name: it.productName, qty: 0, amount: 0 }
        cur.qty += it.qty
        cur.amount += it.subtotal
        map.set(it.productId, cur)
      }),
    )
    return [...map.values()].sort((a, b) => b.qty - a.qty).slice(0, 5)
  }, [sales])

  const topCustomers = useMemo(() => {
    const map = new Map<number, number>()
    sales.forEach((s) => map.set(s.customerId, (map.get(s.customerId) ?? 0) + s.total))
    const total = [...map.values()].reduce((a, b) => a + b, 0) || 1
    return [...map.entries()]
      .map(([id, amt]) => ({
        name: customers.find((c) => c.id === id)?.name ?? 'Unknown',
        amount: amt,
        pct: Math.round((amt / total) * 100),
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)
  }, [sales, customers])

  const byPayment = useMemo(() => {
    const map = new Map<string, number>()
    sales.forEach((s) => map.set(s.paymentMethod, (map.get(s.paymentMethod) ?? 0) + s.total))
    const total = [...map.values()].reduce((a, b) => a + b, 0) || 1
    return [...map.entries()]
      .map(([name, amount]) => ({ name, amount, pct: Math.round((amount / total) * 100) }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 6)
  }, [sales])

  const lowStock = useMemo(
    () => products.filter((p) => p.stock <= p.alertQuantity).slice(0, 5),
    [products],
  )

  return (
    <div>
      {/* Greeting */}
      <div style={{ marginBottom: 18 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>
          Good afternoon, {'John Doe'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', margin: '2px 0 0', fontSize: 13 }}>
          Live figures from your store
        </p>
      </div>

      {/* Range filter */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <Segmented
          options={['7D', '30D', 'MTD', 'YTD']}
          value={range}
          onChange={(v) => setRange(v as typeof range)}
          size="small"
        />
        <span style={{ flex: 1 }} />
        <Button size="small" onClick={() => window.location.reload()}>↻ Refresh</Button>
      </div>

      {/* KPI grid */}
      <Row gutter={[12, 12]}>
        <Col xs={12} sm={12} md={6} xl={3}><Stat label="Sales" value={money(kpi.salesTotal, sym)} /></Col>
        <Col xs={12} sm={12} md={6} xl={3}><Stat label="Purchases" value={money(kpi.purchasesTotal, sym)} /></Col>
        <Col xs={12} sm={12} md={6} xl={3}><Stat label="Sales Return" value={money(kpi.salesReturn, sym)} /></Col>
        <Col xs={12} sm={12} md={6} xl={3}><Stat label="Purchases Return" value={money(kpi.purchaseReturn, sym)} /></Col>
        <Col xs={12} sm={12} md={6} xl={3}><Stat label="Sales Due" value={money(kpi.salesDue, sym)} tone="#fbbf24" /></Col>
        <Col xs={12} sm={12} md={6} xl={3}><Stat label="Purchase due" value={money(kpi.purchaseDue, sym)} tone="#fbbf24" /></Col>
        <Col xs={12} sm={12} md={6} xl={3}><Stat label="Invoices" value={String(kpi.invoices)} /></Col>
        <Col xs={12} sm={12} md={6} xl={3}><Stat label="Profit" value={money(kpi.profit, sym)} tone="#34d399" /></Col>
      </Row>

      {/* Charts */}
      <Row gutter={[12, 12]} style={{ marginTop: 12 }}>
        <Col xs={24} xl={12}>
          <Panel title="Sales & Purchases">
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={trend} margin={{ left: -18, right: 6, top: 6, bottom: 0 }}>
                <defs>
                  <linearGradient id="gSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.sales} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={C.sales} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gPurch" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.purchases} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={C.purchases} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={C.grid} vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: C.axis }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: C.axis }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="Sales" stroke={C.sales} fill="url(#gSales)" strokeWidth={2} />
                <Area type="monotone" dataKey="Purchases" stroke={C.purchases} fill="url(#gPurch)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </Panel>
        </Col>

        <Col xs={24} xl={12}>
          <Panel title="Top Selling Products">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={topProducts} layout="vertical" margin={{ left: 8, right: 16 }}>
                <CartesianGrid stroke={C.grid} horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: C.axis }} axisLine={false} tickLine={false} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={130}
                  tick={{ fontSize: 10.5, fill: C.axis }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="qty" name="Sold" fill={C.sales} radius={[0, 6, 6, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </Panel>
        </Col>
      </Row>

      <Row gutter={[12, 12]} style={{ marginTop: 12 }}>
        <Col xs={24} lg={8}>
          <Panel title="Top customers">
            {topCustomers.map((c, i) => (
              <div key={c.name} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 4 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{c.name}</span>
                  <span style={{ fontWeight: 600 }}>{c.pct}%</span>
                </div>
                <div style={{ height: 6, borderRadius: 4, background: 'var(--surface-3)' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${c.pct}%`,
                      borderRadius: 4,
                      background: PIE_COLORS[i % PIE_COLORS.length],
                    }}
                  />
                </div>
              </div>
            ))}
          </Panel>
        </Col>

        <Col xs={24} lg={8}>
          <Panel title="Sales by Payment">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={byPayment} dataKey="amount" nameKey="name" innerRadius={45} outerRadius={78} paddingAngle={2}>
                  {byPayment.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => money(v, sym)} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 12px', fontSize: 11.5, marginTop: 4 }}>
              {byPayment.map((p, i) => (
                <span key={p.name} style={{ color: 'var(--text-secondary)' }}>
                  <span
                    style={{
                      display: 'inline-block', width: 8, height: 8, borderRadius: 2,
                      background: PIE_COLORS[i % PIE_COLORS.length], marginRight: 5,
                    }}
                  />
                  {p.name} · {p.pct}%
                </span>
              ))}
            </div>
          </Panel>
        </Col>

        <Col xs={24} lg={8}>
          <Panel title="Stock Value">
            <div style={{ display: 'grid', gap: 12 }}>
              {[
                ['By cost', kpi.stockCost, '#38bdf8'],
                ['By retail', kpi.stockRetail, '#34d399'],
                ['By wholesale', kpi.stockRetail * 0.82, '#a78bfa'],
              ].map(([label, val, color]) => (
                <div key={String(label)}>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{label}</div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: String(color) }}>
                    {money(Number(val), sym)}
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </Col>
      </Row>

      <Row gutter={[12, 12]} style={{ marginTop: 12 }}>
        <Col xs={24} lg={12}>
          <Panel
            title="Stock Alert"
            extra={<a onClick={() => navigate('/products')} style={{ fontSize: 12 }}>View all</a>}
          >
            {lowStock.length === 0 && (
              <div style={{ color: 'var(--text-tertiary)', fontSize: 13 }}>All stock levels are healthy.</div>
            )}
            {lowStock.map((p) => (
              <div
                key={p.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 0', borderBottom: '1px dashed var(--border)',
                }}
              >
                <div
                  style={{
                    width: 34, height: 34, borderRadius: 8, background: 'var(--surface-3)',
                    display: 'grid', placeItems: 'center', fontSize: 16,
                  }}
                >
                  {p.emoji ?? '📦'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
                    {p.code} · Downtown Store
                  </div>
                </div>
                <Tag color={p.stock === 0 ? 'red' : 'orange'} style={{ margin: 0 }}>
                  {p.stock} / {p.alertQuantity}
                </Tag>
              </div>
            ))}
          </Panel>
        </Col>

        <Col xs={24} lg={12}>
          <Panel
            title="Recent Sales"
            extra={<a onClick={() => navigate('/sales')} style={{ fontSize: 12 }}>View all</a>}
          >
            <Table
              dataSource={[...sales].sort((a, b) => b.id - a.id).slice(0, 5)}
              rowKey="id"
              pagination={false}
              size="small"
              scroll={{ x: 480 }}
              columns={[
                { title: 'Reference', dataIndex: 'reference', width: 90 },
                {
                  title: 'Customer',
                  dataIndex: 'customerId',
                  render: (id: number) => customers.find((c) => c.id === id)?.name ?? '—',
                },
                {
                  title: 'Status',
                  dataIndex: 'status',
                  width: 90,
                  render: (v: string) => <Tag color="green">{v}</Tag>,
                },
                {
                  title: 'Total',
                  dataIndex: 'total',
                  width: 90,
                  align: 'right',
                  render: (v: number) => <span className="money">{money(v, sym)}</span>,
                },
              ]}
            />
          </Panel>
        </Col>
      </Row>
    </div>
  )
}
