import { useMemo, useState } from 'react'
import { Button, Card, Input, Select, Space, Table, Tag, Popconfirm, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useStore, money } from '../store/useStore'

export default function Products() {
  const navigate = useNavigate()
  const products = useStore((s) => s.products)
  const categories = useStore((s) => s.categories)
  const units = useStore((s) => s.units)
  const settings = useStore((s) => s.settings)
  const deleteProduct = useStore((s) => s.deleteProduct)
  const [q, setQ] = useState('')
  const [cat, setCat] = useState<number | null>(null)

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase()
    return products.filter(
      (p) =>
        (!cat || p.categoryId === cat) &&
        (!query || p.name.toLowerCase().includes(query) || p.code.toLowerCase().includes(query)),
    )
  }, [products, q, cat])

  const sym = settings.currencySymbol

  return (
    <Card
      title={`All Products (${rows.length})`}
      extra={
        <Space>
          <Button onClick={() => navigate('/products/categories')}>Categories</Button>
          <Button type="primary" onClick={() => navigate('/products/create')}>
            + Create Product
          </Button>
        </Space>
      }
    >
      <Space style={{ marginBottom: 14, flexWrap: 'wrap' }}>
        <Input.Search
          placeholder="Search by name or code…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ width: 280 }}
          allowClear
        />
        <Select
          placeholder="Category"
          allowClear
          value={cat}
          onChange={(v) => setCat(v ?? null)}
          style={{ width: 200 }}
          options={categories.map((c) => ({ value: c.id, label: c.name }))}
        />
      </Space>

      <Table
        dataSource={rows}
        rowKey="id"
        size="small"
        scroll={{ x: 980 }}
        pagination={{ pageSize: 12, showSizeChanger: true }}
        columns={[
          {
            title: 'Product',
            dataIndex: 'name',
            render: (_: string, r) => (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 18 }}>{r.emoji ?? '📦'}</span>
                <div>
                  <div style={{ fontWeight: 600 }}>{r.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{r.code}</div>
                </div>
              </div>
            ),
          },
          {
            title: 'Category',
            dataIndex: 'categoryId',
            width: 140,
            render: (id: number) => categories.find((c) => c.id === id)?.name ?? '—',
          },
          {
            title: 'Unit',
            dataIndex: 'unitId',
            width: 80,
            render: (id: number) => units.find((u) => u.id === id)?.shortName ?? '—',
          },
          {
            title: 'Cost',
            dataIndex: 'cost',
            width: 100,
            align: 'right',
            render: (v: number) => money(v, sym),
          },
          {
            title: 'Price',
            dataIndex: 'price',
            width: 100,
            align: 'right',
            render: (v: number) => <strong>{money(v, sym)}</strong>,
          },
          {
            title: 'Stock',
            dataIndex: 'stock',
            width: 100,
            align: 'center',
            render: (v: number, r) => (
              <Tag color={v === 0 ? 'red' : v <= r.alertQuantity ? 'orange' : 'green'}>{v}</Tag>
            ),
          },
          {
            title: 'Actions',
            width: 120,
            render: (_: unknown, r) => (
              <Space size={4}>
                <Button size="small" onClick={() => navigate('/products/create')}>Edit</Button>
                <Popconfirm
                  title="Delete this product?"
                  onConfirm={() => {
                    deleteProduct(r.id)
                    message.success('Product deleted')
                  }}
                >
                  <Button size="small" danger>Del</Button>
                </Popconfirm>
              </Space>
            ),
          },
        ]}
      />
    </Card>
  )
}
