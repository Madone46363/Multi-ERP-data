import { useMemo, useState } from 'react'
import {
  Button, Card, Col, DatePicker, Divider, Input, InputNumber, Row, Select, Space,
  Table, message,
} from 'antd'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import { useStore, money } from '../store/useStore'
import type { SaleItem } from '../types'

/* ---------------- Sales list ---------------- */
export function SalesList({ customerScreen }: { customerScreen?: boolean } = {}) {
  const navigate = useNavigate()
  const sales = useStore((s) => s.sales)
  const customers = useStore((s) => s.customers)
  const settings = useStore((s) => s.settings)
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<string | null>(null)

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase()
    return sales.filter(
      (s) =>
        (!status || s.paymentStatus === status) &&
        (!query ||
          s.reference.toLowerCase().includes(query) ||
          (customers.find((c) => c.id === s.customerId)?.name ?? '').toLowerCase().includes(query)),
    )
  }, [sales, q, status, customers])

  const sym = settings.currencySymbol

  if (customerScreen) {
    const latest = sales[0]
    return (
      <Card title="Customer Facing Screen">
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Last transaction</div>
          <div style={{ fontSize: 42, fontWeight: 800, color: 'var(--accent)', margin: '10px 0' }}>
            {latest ? money(latest.total, sym) : money(0, sym)}
          </div>
          <div style={{ color: 'var(--text-secondary)' }}>
            {latest?.reference} · {latest?.items.length ?? 0} items
          </div>
          <div style={{ marginTop: 30, fontSize: 15, color: 'var(--text-secondary)' }}>
            Thank you for shopping with us!
          </div>
        </div>
      </Card>
    )
  }

  return (
    <>
      <Card
        title={`Sales (${rows.length})`}
        extra={<Button type="primary" onClick={() => navigate('/sales/create')}>+ Create Sale</Button>}
      >
        <Space style={{ marginBottom: 14, flexWrap: 'wrap' }}>
          <Input.Search
            placeholder="Search reference or customer…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{ width: 280 }}
            allowClear
          />
          <Select
            placeholder="Payment status"
            allowClear
            value={status}
            onChange={(v) => setStatus(v ?? null)}
            style={{ width: 170 }}
            options={[
              { value: 'paid', label: 'Paid' },
              { value: 'partial', label: 'Partial' },
              { value: 'due', label: 'Due' },
            ]}
          />
        </Space>

        <Table
          dataSource={rows}
          rowKey="id"
          size="small"
          scroll={{ x: 900 }}
          pagination={{ pageSize: 15, showSizeChanger: true }}
          columns={[
            { title: 'Date', dataIndex: 'date', width: 110 },
            { title: 'Reference', dataIndex: 'reference', width: 120 },
            {
              title: 'Customer',
              dataIndex: 'customerId',
              render: (id: number) => customers.find((c) => c.id === id)?.name ?? '—',
            },
            { title: 'Warehouse', dataIndex: 'warehouseId', width: 100, render: () => 'Default' },
            { title: 'Status', dataIndex: 'status', width: 100 },
            { title: 'Payment', dataIndex: 'paymentStatus', width: 100 },
            { title: 'Total', dataIndex: 'total', width: 110, align: 'right', render: (v: number) => <strong>{money(v, sym)}</strong> },
            { title: 'Paid', dataIndex: 'paid', width: 110, align: 'right', render: (v: number) => money(v, sym) },
            {
              title: 'Due',
              width: 100,
              align: 'right',
              render: (_: unknown, r) => <span style={{ color: '#fbbf24' }}>{money(r.total - r.paid, sym)}</span>,
            },
          ]}
        />
      </Card>
    </>
  )
}

/* ---------------- Create sale ---------------- */
export function SaleForm() {
  const navigate = useNavigate()
  const products = useStore((s) => s.products)
  const customers = useStore((s) => s.customers)
  const addSale = useStore((s) => s.addSale)
  const settings = useStore((s) => s.settings)
  const sym = settings.currencySymbol

  const [items, setItems] = useState<SaleItem[]>([])
  const [customerId, setCustomerId] = useState(1)
  const [discount, setDiscount] = useState(0)
  const [paid, setPaid] = useState(0)
  const [method, setMethod] = useState('Cash')
  const [notes, setNotes] = useState('')
  const [date, setDate] = useState(dayjs())

  const addLine = (productId: number) => {
    const p = products.find((x) => x.id === productId)
    if (!p) return
    setItems((cur) => {
      const has = cur.find((l) => l.productId === productId)
      if (has) {
        return cur.map((l) =>
          l.productId === productId
            ? { ...l, qty: l.qty + 1, subtotal: +(l.unitPrice * (l.qty + 1)).toFixed(2) }
            : l,
        )
      }
      return [
        ...cur,
        { productId, productName: p.name, code: p.code, unitPrice: p.price, qty: 1, discount: 0, tax: 0, subtotal: p.price },
      ]
    })
  }

  const subtotal = items.reduce((a, i) => a + i.subtotal, 0)
  const total = Math.max(0, +(subtotal - discount).toFixed(2))

  const submit = () => {
    if (!items.length) return message.warning('Add at least one product')
    const sale = addSale({
      customerId,
      warehouseId: 1,
      date: date.format('YYYY-MM-DD'),
      items,
      subtotal: +subtotal.toFixed(2),
      discount,
      tax: 0,
      shipping: 0,
      total,
      paid: +paid.toFixed(2),
      status: 'completed',
      paymentStatus: paid >= total ? 'paid' : paid > 0 ? 'partial' : 'due',
      paymentMethod: method,
      notes,
      cashier: 'John Doe',
    })
    message.success(`Sale ${sale.reference} created`)
    navigate('/sales')
  }

  return (
    <Card title="Create Sale">
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <label style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Customer</label>
          <Select
            showSearch
            optionFilterProp="label"
            style={{ width: '100%', marginTop: 4 }}
            value={customerId}
            onChange={setCustomerId}
            options={customers.map((c) => ({ value: c.id, label: c.name }))}
          />
        </Col>
        <Col xs={24} md={12}>
          <label style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Date</label>
          <DatePicker style={{ width: '100%', marginTop: 4 }} value={date} onChange={(d) => d && setDate(d)} />
        </Col>
      </Row>

      <Divider style={{ margin: '18px 0 12px' }} />

      <Space style={{ marginBottom: 12 }}>
        <Select
          showSearch
          placeholder="Add a product…"
          optionFilterProp="label"
          style={{ width: 340 }}
          value={null}
          onChange={(v) => v && addLine(Number(v))}
          options={products.map((p) => ({ value: p.id, label: `${p.name} — ${money(p.price, sym)}` }))}
          labelRender={() => <span>Add a product…</span>}
        />
      </Space>

      <Table
        dataSource={items}
        rowKey="productId"
        size="small"
        pagination={false}
        locale={{ emptyText: 'No items yet' }}
        columns={[
          { title: 'Product', dataIndex: 'productName' },
          { title: 'Code', dataIndex: 'code', width: 110 },
          {
            title: 'Unit price',
            dataIndex: 'unitPrice',
            width: 120,
            align: 'right',
            render: (v: number) => money(v, sym),
          },
          {
            title: 'Qty',
            width: 100,
            render: (_: unknown, r) => (
              <InputNumber
                min={1}
                value={r.qty}
                onChange={(v) =>
                  setItems((cur) =>
                    cur.map((l) =>
                      l.productId === r.productId
                        ? { ...l, qty: Number(v) || 1, subtotal: +((Number(v) || 1) * l.unitPrice).toFixed(2) }
                        : l,
                    ),
                  )
                }
                size="small"
                style={{ width: 70 }}
              />
            ),
          },
          {
            title: 'Subtotal',
            dataIndex: 'subtotal',
            width: 120,
            align: 'right',
            render: (v: number) => <strong>{money(v, sym)}</strong>,
          },
          {
            title: '',
            width: 60,
            render: (_: unknown, r) => (
              <Button size="small" danger onClick={() => setItems((c) => c.filter((l) => l.productId !== r.productId))}>
                ✕
              </Button>
            ),
          },
        ]}
      />

      <Row gutter={16} style={{ marginTop: 20 }}>
        <Col xs={24} md={12}>
          <label style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Notes</label>
          <Input.TextArea rows={3} style={{ marginTop: 4 }} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </Col>
        <Col xs={24} md={12}>
          <div style={{ display: 'grid', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
              <span>{money(subtotal, sym)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Discount</span>
              <InputNumber min={0} style={{ width: 140 }} prefix={sym} value={discount} onChange={(v) => setDiscount(Number(v) || 0)} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Paid now</span>
              <InputNumber min={0} style={{ width: 140 }} prefix={sym} value={paid} onChange={(v) => setPaid(Number(v) || 0)} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Payment method</span>
              <Select
                style={{ width: 140 }}
                value={method}
                onChange={setMethod}
                options={['Cash', 'Credit Card', 'bank transfer', 'Check', 'TPE'].map((m) => ({ value: m, label: m }))}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 20, fontWeight: 800, borderTop: '1px solid var(--border)', paddingTop: 10 }}>
              <span>Grand total</span>
              <span style={{ color: 'var(--accent)' }}>{money(total, sym)}</span>
            </div>
          </div>
        </Col>
      </Row>

      <Space style={{ marginTop: 20 }}>
        <Button type="primary" onClick={submit}>Save Sale</Button>
        <Button onClick={() => navigate('/sales')}>Cancel</Button>
      </Space>
    </Card>
  )
}
