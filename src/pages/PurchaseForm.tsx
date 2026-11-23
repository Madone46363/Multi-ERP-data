import { useState } from 'react'
import { Button, Card, Col, DatePicker, Divider, Input, InputNumber, Row, Select, Space, Table, message } from 'antd'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import { useStore, money } from '../store/useStore'
import type { PurchaseItem } from '../types'

export default function PurchaseForm() {
  const navigate = useNavigate()
  const products = useStore((s) => s.products)
  const suppliers = useStore((s) => s.suppliers)
  const addPurchase = useStore((s) => s.addPurchase)
  const settings = useStore((s) => s.settings)
  const sym = settings.currencySymbol

  const [items, setItems] = useState<PurchaseItem[]>([])
  const [supplierId, setSupplierId] = useState(suppliers[0]?.id ?? 1)
  const [date, setDate] = useState(dayjs())
  const [paid, setPaid] = useState(0)
  const [discount, setDiscount] = useState(0)

  const addLine = (productId: number) => {
    const p = products.find((x) => x.id === productId)
    if (!p) return
    setItems((cur) => {
      if (cur.find((l) => l.productId === productId)) return cur
      return [
        ...cur,
        { productId, productName: p.name, code: p.code, unitCost: p.cost, qty: 1, discount: 0, tax: 0, subtotal: p.cost },
      ]
    })
  }

  const subtotal = items.reduce((a, i) => a + i.subtotal, 0)
  const total = Math.max(0, +(subtotal - discount).toFixed(2))

  const submit = () => {
    if (!items.length) return message.warning('Add at least one product')
    addPurchase({
      supplierId,
      warehouseId: 1,
      date: date.format('YYYY-MM-DD'),
      items,
      subtotal: +subtotal.toFixed(2),
      discount,
      tax: 0,
      shipping: 0,
      total,
      paid: +paid.toFixed(2),
      status: 'received',
      paymentStatus: paid >= total ? 'paid' : paid > 0 ? 'partial' : 'due',
      paymentMethod: 'bank transfer',
    })
    message.success('Purchase created — stock updated')
    navigate('/purchases')
  }

  return (
    <Card title="Create Purchase">
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <label style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Supplier</label>
          <Select
            style={{ width: '100%', marginTop: 4 }}
            value={supplierId}
            onChange={setSupplierId}
            options={suppliers.map((s) => ({ value: s.id, label: s.name }))}
          />
        </Col>
        <Col xs={24} md={12}>
          <label style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Date</label>
          <DatePicker style={{ width: '100%', marginTop: 4 }} value={date} onChange={(d) => d && setDate(d)} />
        </Col>
      </Row>

      <Divider style={{ margin: '18px 0 12px' }} />

      <Select
        showSearch
        placeholder="Add a product…"
        optionFilterProp="label"
        style={{ width: 340, marginBottom: 12 }}
        value={null}
        onChange={(v) => v && addLine(Number(v))}
        options={products.map((p) => ({ value: p.id, label: `${p.name} — ${money(p.cost, sym)}` }))}
        labelRender={() => <span>Add a product…</span>}
      />

      <Table
        dataSource={items}
        rowKey="productId"
        size="small"
        pagination={false}
        columns={[
          { title: 'Product', dataIndex: 'productName' },
          { title: 'Code', dataIndex: 'code', width: 110 },
          {
            title: 'Unit cost',
            width: 130,
            render: (_: unknown, r) => (
              <InputNumber
                min={0}
                size="small"
                value={r.unitCost}
                style={{ width: 100 }}
                onChange={(v) =>
                  setItems((c) =>
                    c.map((l) =>
                      l.productId === r.productId
                        ? { ...l, unitCost: Number(v) || 0, subtotal: +((Number(v) || 0) * l.qty).toFixed(2) }
                        : l,
                    ),
                  )
                }
              />
            ),
          },
          {
            title: 'Qty',
            width: 110,
            render: (_: unknown, r) => (
              <InputNumber
                min={1}
                size="small"
                value={r.qty}
                style={{ width: 70 }}
                onChange={(v) =>
                  setItems((c) =>
                    c.map((l) =>
                      l.productId === r.productId
                        ? { ...l, qty: Number(v) || 1, subtotal: +((Number(v) || 1) * l.unitCost).toFixed(2) }
                        : l,
                    ),
                  )
                }
              />
            ),
          },
          { title: 'Subtotal', dataIndex: 'subtotal', width: 120, align: 'right', render: (v: number) => <strong>{money(v, sym)}</strong> },
          {
            title: '',
            width: 60,
            render: (_: unknown, r) => (
              <Button size="small" danger onClick={() => setItems((c) => c.filter((l) => l.productId !== r.productId))}>✕</Button>
            ),
          },
        ]}
      />

      <Row gutter={16} style={{ marginTop: 18 }}>
        <Col xs={24} md={12}>
          <Input.TextArea rows={3} placeholder="Notes" />
        </Col>
        <Col xs={24} md={12}>
          <div style={{ display: 'grid', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
              <span>{money(subtotal, sym)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Discount</span>
              <InputNumber min={0} prefix={sym} style={{ width: 140 }} value={discount} onChange={(v) => setDiscount(Number(v) || 0)} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Paid</span>
              <InputNumber min={0} prefix={sym} style={{ width: 140 }} value={paid} onChange={(v) => setPaid(Number(v) || 0)} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 20, fontWeight: 800, borderTop: '1px solid var(--border)', paddingTop: 10 }}>
              <span>Grand total</span>
              <span style={{ color: 'var(--accent)' }}>{money(total, sym)}</span>
            </div>
          </div>
        </Col>
      </Row>

      <Space style={{ marginTop: 20 }}>
        <Button type="primary" onClick={submit}>Save Purchase</Button>
        <Button onClick={() => navigate('/purchases')}>Cancel</Button>
      </Space>
    </Card>
  )
}
