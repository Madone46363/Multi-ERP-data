import { useState } from 'react'
import { Card, Col, Row, Switch, Tag } from 'antd'

const moduleGroups: { title: string; items: string[] }[] = [
  {
    title: 'Core',
    items: ['Products', 'Sales', 'POS', 'Purchases', 'People', 'Reports', 'Accounting'],
  },
  {
    title: 'People & HR',
    items: ['HRM', 'Payroll', 'Recruitment', 'Projects', 'Timesheets'],
  },
  {
    title: 'Commerce',
    items: ['Online Store', 'Coupons', 'Marketing', 'CRM', 'Loyalty'],
  },
  {
    title: 'Industry',
    items: ['Real Estate', 'Fleet', 'Hospital', 'School', 'Restaurant', 'Rental', 'Manufacturing'],
  },
  {
    title: 'Operations',
    items: ['Couriers', 'Assets', 'Bookings', 'Service & Maintenance', 'Quality Control'],
  },
  {
    title: 'Integrations',
    items: ['WooCommerce', 'Shopify', 'Salla', 'QuickBooks', 'Xero', 'Zapier', 'Mailchimp'],
  },
]

export default function SettingsModules() {
  const [on, setOn] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      moduleGroups.flatMap((g) =>
        g.items.map((i) => [i, ['Products', 'Sales', 'POS', 'Purchases', 'People', 'Reports', 'Accounting', 'HRM', 'Online Store', 'Couriers', 'Marketing', 'CRM', 'Projects'].includes(i)]),
      ),
    ),
  )

  return (
    <Card title="Modules">
      <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 18 }}>
        Enable the modules your business needs. Disabled modules are hidden from the sidebar.
      </div>
      <Row gutter={[16, 16]}>
        {moduleGroups.map((g) => (
          <Col xs={24} md={12} xl={8} key={g.title}>
            <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 10, padding: 14 }}>
              <div style={{ fontWeight: 650, fontSize: 13, marginBottom: 10 }}>
                {g.title} <Tag style={{ marginLeft: 6 }}>{g.items.filter((i) => on[i]).length}/{g.items.length}</Tag>
              </div>
              <div style={{ display: 'grid', gap: 9 }}>
                {g.items.map((item) => (
                  <div key={item} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12.5 }}>{item}</span>
                    <Switch
                      size="small"
                      checked={!!on[item]}
                      onChange={(v) => setOn((s) => ({ ...s, [item]: v }))}
                    />
                  </div>
                ))}
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </Card>
  )
}
