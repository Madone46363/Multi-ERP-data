import { useState } from 'react'
import { Card, Input } from 'antd'
import { useStore, money } from '../store/useStore'

export default function PriceCheck() {
  const products = useStore((s) => s.products)
  const categories = useStore((s) => s.categories)
  const settings = useStore((s) => s.settings)
  const [sku, setSku] = useState('')

  const found = products.find((p) => p.code.toLowerCase() === sku.toLowerCase())

  return (
    <Card title="Price Check">
      <div style={{ maxWidth: 480 }}>
        <Input
          size="large"
          placeholder="Scan or type product code / SKU…"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
          autoFocus
        />
        {found && (
          <div
            style={{
              marginTop: 20,
              padding: 20,
              background: 'var(--surface-2)',
              borderRadius: 10,
              border: '1px solid var(--border)',
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>{found.name}</div>
            <div style={{ fontSize: 12.5, color: 'var(--text-tertiary)', marginBottom: 14 }}>
              {categories.find((c) => c.id === found.categoryId)?.name} · SKU {found.code}
            </div>
            <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--accent)' }}>
              {money(found.price, settings.currencySymbol)}
            </div>
            <div style={{ marginTop: 10, fontSize: 12.5, color: 'var(--text-secondary)' }}>
              Stock: <strong>{found.stock} units</strong>
            </div>
          </div>
        )}
        {sku && !found && (
          <div style={{ marginTop: 20, padding: 16, background: 'var(--surface-2)', borderRadius: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
            No product found with SKU "{sku}"
          </div>
        )}
      </div>
    </Card>
  )
}
