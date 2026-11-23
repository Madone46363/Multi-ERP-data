import { useMemo, useState } from 'react'
import { Button, Input } from 'antd'
import { useStore, money } from '../store/useStore'

/** Simple customer-facing storefront rendered from the product catalogue. */
export default function Storefront({ embedded }: { embedded?: boolean }) {
  const products = useStore((s) => s.products)
  const categories = useStore((s) => s.categories)
  const settings = useStore((s) => s.settings)
  const [cart, setCart] = useState<{ id: number; qty: number }[]>([])
  const [q, setQ] = useState('')
  const [cat, setCat] = useState<number | null>(null)
  const sym = settings.currencySymbol

  const rows = useMemo(
    () =>
      products.filter(
        (p) =>
          (!cat || p.categoryId === cat) &&
          (!q || p.name.toLowerCase().includes(q.toLowerCase())),
      ),
    [products, q, cat],
  )

  const cartCount = cart.reduce((a, c) => a + c.qty, 0)
  const cartTotal = cart.reduce((a, c) => {
    const p = products.find((x) => x.id === c.id)
    return a + (p ? p.price * c.qty : 0)
  }, 0)

  const add = (id: number) =>
    setCart((c) => {
      const has = c.find((x) => x.id === id)
      return has ? c.map((x) => (x.id === id ? { ...x, qty: x.qty + 1 } : x)) : [...c, { id, qty: 1 }]
    })

  return (
    <div
      style={{
        background: 'var(--surface-0)',
        minHeight: embedded ? undefined : '100vh',
        color: 'var(--text-primary)',
      }}
    >
      {/* top strip */}
      <div style={{ background: 'var(--accent)', color: '#04121c', textAlign: 'center', fontSize: 12.5, padding: '7px 12px', fontWeight: 600 }}>
        Free delivery on orders over {money(50, sym)} — use code WELCOME10 for 10% off
      </div>

      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 22px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div
            style={{
              width: 34, height: 34, borderRadius: 9, background: 'var(--accent)',
              display: 'grid', placeItems: 'center', color: '#04121c', fontWeight: 800,
            }}
          >
            S
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{settings.storeName}</div>
            <div style={{ fontSize: 10.5, color: 'var(--text-tertiary)' }}>{settings.tagline}</div>
          </div>
        </div>
        <Input.Search
          placeholder="Search products…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ maxWidth: 380, marginLeft: 'auto' }}
          allowClear
        />
        <Button type="primary">Cart · {cartCount} · {money(cartTotal, sym)}</Button>
      </div>

      {/* hero */}
      <div
        style={{
          padding: '38px 22px',
          background: 'linear-gradient(120deg, #0f131c 0%, #16243a 60%, #0f131c 100%)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div style={{ maxWidth: 620 }}>
          <div style={{ fontSize: 11, letterSpacing: 1.4, textTransform: 'uppercase', color: 'var(--accent)', fontWeight: 700 }}>
            New season
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: '8px 0 10px', lineHeight: 1.15 }}>
            Everyday essentials, delivered fast
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, margin: 0 }}>
            Fresh groceries, tech and home goods from {settings.storeName}. Same-day dispatch on orders before 3pm.
          </p>
        </div>
      </div>

      {/* filters */}
      <div style={{ padding: '14px 22px 0', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Button size="small" type={cat === null ? 'primary' : 'default'} onClick={() => setCat(null)}>
          All
        </Button>
        {categories
          .filter((c) => !c.parentId)
          .slice(0, 9)
          .map((c) => (
            <Button
              key={c.id}
              size="small"
              type={cat === c.id ? 'primary' : 'default'}
              onClick={() => setCat(c.id)}
            >
              {c.name}
            </Button>
          ))}
      </div>

      {/* product grid */}
      <div
        style={{
          padding: 22,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: 14,
        }}
      >
        {rows.slice(0, 24).map((p) => (
          <div
            key={p.id}
            style={{
              background: 'var(--surface-1)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: 12,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                height: 96, borderRadius: 9, background: 'var(--surface-3)',
                display: 'grid', placeItems: 'center', fontSize: 40, marginBottom: 9,
              }}
            >
              {p.emoji ?? '📦'}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3, minHeight: 34 }}>{p.name}</div>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 6 }}>
              {categories.find((c) => c.id === p.categoryId)?.name}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 'auto' }}>
              <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--accent)' }}>
                {money(p.price, sym)}
              </span>
              <Button size="small" style={{ marginLeft: 'auto' }} onClick={() => add(p.id)}>
                Add
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', padding: '20px 0 34px', color: 'var(--text-tertiary)', fontSize: 12 }}>
        {settings.storeName} — {settings.address} · {settings.phone}
      </div>
    </div>
  )
}
