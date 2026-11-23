import { useMemo, useState } from 'react'
import { Button, Card, Input, Select, Space, Table, Tag } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useStore, money } from '../store/useStore'

export default function Purchases() {
  const navigate = useNavigate()
  const purchases = useStore((s) => s.purchases)
  const suppliers = useStore((s) => s.suppliers)
  const settings = useStore((s) => s.settings)
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<string | null>(null)

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase()
    return purchases.filter(
      (p) =>
        (!status || p.paymentStatus === status) &&
        (!query ||
          p.reference.toLowerCase().includes(query) ||
          (suppliers.find((s) => s.id === p.supplierId)?.name ?? '').toLowerCase().includes(query)),
    )
  }, [purchases, q, status, suppliers])

  const sym = settings.currencySymbol

  return (
    <Card
      title={`Purchases (${rows.length})`}
      extra={<Button type="primary" onClick={() => navigate('/purchases/create')}>+ Create Purchase</Button>}
    >
      <Space style={{ marginBottom: 14, flexWrap: 'wrap' }}>
        <Input.Search
          placeholder="Search reference or supplier…"
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
            title: 'Supplier',
            dataIndex: 'supplierId',
            render: (id: number) => suppliers.find((s) => s.id === id)?.name ?? '—',
          },
          {
            title: 'Status',
            dataIndex: 'status',
            width: 100,
            render: (v: string) => <Tag color={v === 'received' ? 'green' : 'orange'}>{v}</Tag>,
          },
          {
            title: 'Payment',
            dataIndex: 'paymentStatus',
            width: 100,
            render: (v: string) => <Tag color={v === 'paid' ? 'green' : v === 'partial' ? 'orange' : 'red'}>{v}</Tag>,
          },
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
  )
}
