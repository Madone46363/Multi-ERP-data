import { useMemo, useState } from 'react'
import { Button, Card, Input, Table, Tag, Popconfirm, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useStore, money } from '../store/useStore'

export default function Customers() {
  const navigate = useNavigate()
  const customers = useStore((s) => s.customers)
  const sales = useStore((s) => s.sales)
  const deleteCustomer = useStore((s) => s.deleteCustomer)
  const settings = useStore((s) => s.settings)
  const [q, setQ] = useState('')

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase()
    return customers
      .filter((c) => !query || c.name.toLowerCase().includes(query) || c.email.toLowerCase().includes(query))
      .map((c) => ({
        ...c,
        purchaseTotal: sales.filter((s) => s.customerId === c.id).reduce((a, s) => a + s.total, 0),
        orderCount: sales.filter((s) => s.customerId === c.id).length,
      }))
  }, [customers, sales, q])

  const sym = settings.currencySymbol

  return (
    <Card
      title={`Customers (${rows.length})`}
      extra={<Button type="primary" onClick={() => navigate('/people/customers/create')}>+ Create Customer</Button>}
    >
      <Input.Search
        placeholder="Search name or email…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        style={{ width: 300, marginBottom: 14 }}
        allowClear
      />
      <Table
        dataSource={rows}
        rowKey="id"
        size="small"
        scroll={{ x: 950 }}
        pagination={{ pageSize: 12 }}
        columns={[
          { title: 'Name', dataIndex: 'name', render: (v: string) => <strong>{v}</strong> },
          { title: 'Email', dataIndex: 'email' },
          { title: 'Phone', dataIndex: 'phone', width: 140 },
          { title: 'City', dataIndex: 'city', width: 130, render: (v) => v ?? '—' },
          {
            title: 'Login',
            dataIndex: 'hasLogin',
            width: 90,
            render: (v: boolean) => <Tag color={v ? 'green' : 'default'}>{v ? 'yes' : 'no'}</Tag>,
          },
          {
            title: 'Wallet',
            dataIndex: 'walletBalance',
            width: 110,
            align: 'right',
            render: (v: number) => money(v, sym),
          },
          { title: 'Orders', dataIndex: 'orderCount', width: 80, align: 'center' },
          {
            title: 'Total spent',
            dataIndex: 'purchaseTotal',
            width: 130,
            align: 'right',
            render: (v: number) => <strong>{money(v, sym)}</strong>,
          },
          {
            title: '',
            width: 70,
            render: (_: unknown, r) => (
              <Popconfirm
                title="Delete customer?"
                onConfirm={() => {
                  deleteCustomer(r.id)
                  message.success('Customer deleted')
                }}
              >
                <Button size="small" danger>Del</Button>
              </Popconfirm>
            ),
          },
        ]}
      />
    </Card>
  )
}
