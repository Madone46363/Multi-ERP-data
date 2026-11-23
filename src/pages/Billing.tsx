import { Card } from 'antd'

export default function Billing() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Card title="Subscription Plan">
        <div style={{ background: 'var(--surface-2)', borderRadius: 10, padding: 20, maxWidth: 460 }}>
          <div style={{ fontSize: 12, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 700 }}>
            Current plan
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, margin: '6px 0 4px' }}>Pro</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Unlimited users · Full module access · Priority support</div>
          <div style={{ marginTop: 14, fontSize: 15 }}>
            <span style={{ fontSize: 28, fontWeight: 800 }}>$99</span>
            <span style={{ color: 'var(--text-tertiary)', fontSize: 13 }}> / month</span>
          </div>
          <div style={{ marginTop: 16, fontSize: 12, color: 'var(--text-tertiary)' }}>
            Next billing date: <strong>Dec 23, 2026</strong>
          </div>
        </div>
      </Card>

      <Card title="All Plans" size="small">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
          {[
            { name: 'Starter', price: 29, users: 2 },
            { name: 'Business', price: 59, users: 10 },
            { name: 'Pro', price: 99, users: '∞' },
            { name: 'Enterprise', price: 'Custom', users: '∞' },
          ].map((p) => (
            <div
              key={p.name}
              style={{
                background: 'var(--surface-2)',
                border: p.name === 'Pro' ? '2px solid var(--accent)' : '1px solid var(--border)',
                borderRadius: 10,
                padding: 16,
              }}
            >
              <div style={{ fontSize: 15, fontWeight: 700 }}>{p.name}</div>
              <div style={{ fontSize: 24, fontWeight: 800, margin: '10px 0 6px' }}>
                {typeof p.price === 'number' ? `$${p.price}` : p.price}
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }}>Up to {p.users} users</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
