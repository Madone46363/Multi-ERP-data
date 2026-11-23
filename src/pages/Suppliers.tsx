import { useMemo, useState } from 'react'
import { Button, Card, Input, Table, Popconfirm, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useStore, money } from '../store/useStore'

export default function Suppliers() {
  const navigate = useNavigate()
  const suppliers = useStore((s) => s.suppliers)
  const purchases = useStore((s) => s.purchases)
  const deleteSupplier = useStore((s) => s.deleteSupplier)
  const settings = useStore((s) => s.settings)
  const [q, setQ] = useState('')

  const rows = useMemo(
    () =>
      suppliers
        .filter((s) => !q || s.name.toLowerCase().includes(q.toLowerCase()))
        .map((s) => ({
          ...s,
          purchaseTotal: purchases.filter((p) => p.supplierId === s.id).reduce((a, p) => a + p.total, 0),
        })),
    [suppliers, purchases, q],
  )

  const sym = settings.currencySymbol

  return (
    <Card
      title={`Suppliers (${rows.length})`}
      extra={<Button type="primary" onClick={() => navigate('/people/suppliers/create')}>+ Create Supplier</Button>}
    >
      <Input.Search
        placeholder="Search supplier…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        style={{ width: 300, marginBottom: 14 }}
        allowClear
      />
      <Table
        dataSource={rows}
        rowKey="id"
        size="small"
        scroll={{ x: 900 }}
        pagination={{ pageSize: 12 }}
        columns={[
          { title: 'Company', dataIndex: 'name', render: (v: string) => <strong>{v}</strong> },
          { title: 'Email', dataIndex: 'email' },
          { title: 'Phone', dataIndex: 'phone', width: 140 },
          { title: 'Tax No.', dataIndex: 'taxNumber', width: 130 },
          {
            title: 'Wallet',
            dataIndex: 'walletBalance',
            width: 110,
            align: 'right',
            render: (v: number) => money(v, sym),
          },
          {
            title: 'Total purchases',
            dataIndex: 'purchaseTotal',
            width: 150,
            align: 'right',
            render: (v: number) => <strong>{money(v, sym)}</strong>,
          },
          {
            title: '',
            width: 70,
            render: (_: unknown, r) => (
              <Popconfirm
                title="Delete supplier?"
                onConfirm={() => {
                  deleteSupplier(r.id)
                  message.success('Supplier deleted')
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
