import { useMemo, useState } from 'react'
import { Button, Input, InputNumber, Modal, Select, message } from 'antd'
import { useStore, money } from '../store/useStore'
import type { SaleItem } from '../types'

interface CartLine extends SaleItem {
  productId: number
  maxQty: number
}

export default function POS() {
  const products = useStore((s) => s.products)
  const categories = useStore((s) => s.categories)
  const customers = useStore((s) => s.customers)
  const settings = useStore((s) => s.settings)
  const addSale = useStore((s) => s.addSale)

  const [query, setQuery] = useState('')
  const [cat, setCat] = useState<number | null>(null)
  const [cart, setCart] = useState<CartLine[]>([])
  const [customerId, setCustomerId] = useState(1)
  const [discount, setDiscount] = useState(0)
  const [payOpen, setPayOpen] = useState(false)
  const [paying, setPaying] = useState(0)
  const [method, setMethod] = useState('Cash')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products.filter(
      (p) =>
        (!cat || p.categoryId === cat) &&
        (!q || p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q)),
    )
  }, [products, query, cat])

  const add = (productId: number) => {
    const p = products.find((x) => x.id === productId)
    if (!p) return
    setCart((c) => {
      const existing = c.find((l) => l.productId === productId)
      if (existing) {
        return c.map((l) =>
          l.productId === productId ? { ...l, qty: l.qty + 1, subtotal: +(l.unitPrice * (l.qty + 1)).toFixed(2) } : l,
        )
      }
      return [
        ...c,
        {
          productId,
          productName: p.name,
          code: p.code,
          unitPrice: p.price,
          qty: 1,
          discount: 0,
          tax: 0,
          subtotal: p.price,
          maxQty: p.stock,
        },
      ]
    })
  }

  const setQty = (productId: number, qty: number) => {
    if (qty <= 0) {
      setCart((c) => c.filter((l) => l.productId !== productId))
      return
    }
    setCart((c) =>
      c.map((l) =>
        l.productId === productId ? { ...l, qty, subtotal: +(l.unitPrice * qty).toFixed(2) } : l,
      ),
    )
  }

  const subtotal = cart.reduce((a, l) => a + l.subtotal, 0)
  const grandTotal = Math.max(0, +(subtotal - discount).toFixed(2))
  const sym = settings.currencySymbol

  const openPay = () => {
    if (!cart.length) {
      message.warning('Cart is empty')
      return
    }
    setPaying(grandTotal)
    setPayOpen(true)
  }

  const completeSale = () => {
    addSale({
      customerId,
      warehouseId: 1,
      date: new Date().toISOString().slice(0, 10),
      items: cart.map(({ maxQty: _m, ...rest }) => rest),
      subtotal: +subtotal.toFixed(2),
      discount,
      tax: 0,
      shipping: 0,
      total: grandTotal,
      paid: +paying.toFixed(2),
      status: 'completed',
      paymentStatus: paying >= grandTotal ? 'paid' : 'partial',
      paymentMethod: method,
      pos: true,
      cashier: 'John Doe',
    })
    message.success(`Sale completed — ${money(grandTotal, sym)}`)
    setCart([])
    setDiscount(0)
    setPayOpen(false)
  }

  return (
    <div className="pos-wrap">
      <div className="pos-products">
        <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
          <Input.Search
            placeholder="Scan barcode or search products…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ flex: 1, minWidth: 220 }}
            allowClear
          />
          <Select
            placeholder="All categories"
            allowClear
            style={{ width: 200 }}
            value={cat}
            onChange={(v) => setCat(v ?? null)}
            options={categories.filter((c) => !c.parentId).map((c) => ({ value: c.id, label: c.name }))}
          />
        </div>
        <div className="pos-grid">
          {filtered.map((p) => (
            <div className="pos-tile" key={p.id} onClick={() => add(p.id)}>
              <div className="thumb">{p.emoji ?? '📦'}</div>
              <div className="pname">{p.name}</div>
              <div className="pprice">{money(p.price, sym)}</div>
              <div style={{ fontSize: 10.5, color: p.stock <= p.alertQuantity ? '#fbbf24' : '#64748b' }}>
                {p.stock} in stock
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ color: '#64748b', fontSize: 13, padding: 20 }}>No products match your search.</div>
          )}
        </div>
      </div>

      <div className="pos-cart">
        <div style={{ padding: '12px 12px 8px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontWeight: 650, fontSize: 14, marginBottom: 8 }}>Current Order</div>
          <Select
            showSearch
            style={{ width: '100%' }}
            value={customerId}
            onChange={setCustomerId}
            optionFilterProp="label"
            options={customers.map((c) => ({ value: c.id, label: c.name }))}
          />
        </div>

        <div className="pos-cart-items">
          {cart.length === 0 && (
            <div style={{ textAlign: 'center', color: '#64748b', fontSize: 13, padding: 30 }}>
              Click a product to add it to the cart.
            </div>
          )}
          {cart.map((l) => (
            <div className="cart-line" key={l.productId}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="nm">{l.productName}</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>{money(l.unitPrice, sym)} each</div>
              </div>
              <div className="qty">
                <Button size="small" onClick={() => setQty(l.productId, l.qty - 1)}>−</Button>
                <span style={{ width: 24, textAlign: 'center', fontSize: 12.5, fontWeight: 600 }}>{l.qty}</span>
                <Button size="small" onClick={() => setQty(l.productId, l.qty + 1)}>+</Button>
              </div>
              <div style={{ width: 64, textAlign: 'right', fontSize: 12.5, fontWeight: 700 }}>
                {money(l.subtotal, sym)}
              </div>
            </div>
          ))}
        </div>

        <div className="pos-footer">
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 6 }}>
            <span style={{ color: '#94a3b8' }}>Subtotal</span>
            <span className="money">{money(subtotal, sym)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ color: '#94a3b8', fontSize: 12.5 }}>Discount</span>
            <InputNumber
              min={0}
              max={subtotal}
              value={discount}
              onChange={(v) => setDiscount(Number(v) || 0)}
              style={{ width: 110 }}
              prefix={sym}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 800, marginBottom: 12 }}>
            <span>Total</span>
            <span style={{ color: '#38bdf8' }}>{money(grandTotal, sym)}</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button style={{ flex: 1 }} onClick={() => { setCart([]); setDiscount(0) }}>Clear</Button>
            <Button type="primary" style={{ flex: 2 }} onClick={openPay}>
              Pay {money(grandTotal, sym)}
            </Button>
          </div>
        </div>
      </div>

      <Modal
        open={payOpen}
        title="Complete payment"
        onCancel={() => setPayOpen(false)}
        onOk={completeSale}
        okText={`Confirm ${money(paying, sym)}`}
        destroyOnClose
      >
        <div style={{ display: 'grid', gap: 14, paddingTop: 8 }}>
          <div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>Payment method</div>
            <Select
              style={{ width: '100%' }}
              value={method}
              onChange={setMethod}
              options={['Cash', 'Credit Card', 'bank transfer', 'Check', 'TPE', 'Western Union'].map((m) => ({ value: m, label: m }))}
            />
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>Amount received</div>
            <InputNumber
              style={{ width: '100%' }}
              value={paying}
              min={0}
              onChange={(v) => setPaying(Number(v) || 0)}
              prefix={sym}
              size="large"
            />
          </div>
          {paying > grandTotal && (
            <div style={{ fontSize: 13, color: '#34d399' }}>
              Change due: {money(paying - grandTotal, sym)}
            </div>
          )}
          <div style={{ display: 'flex', gap: 8 }}>
            {[grandTotal, 50, 100, 200].map((v, i) => (
              <Button key={i} size="small" onClick={() => setPaying(v)}>
                {money(v, sym)}
              </Button>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  )
}
