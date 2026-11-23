import { Card, Table } from 'antd'
import { useStore } from '../store/useStore'

export default function Labels() {
  const products = useStore((s) => s.products)
  const categories = useStore((s) => s.categories)
  const settings = useStore((s) => s.settings)

  return (
    <Card title="Print Labels">
      <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 14 }}>
        Select products to generate printable barcode labels for shelves or packaging.
      </div>
      <Table
        dataSource={products.slice(0, 20)}
        rowKey="id"
        size="small"
        rowSelection={{ type: 'checkbox' }}
        pagination={{ pageSize: 15 }}
        columns={[
          { title: 'SKU', dataIndex: 'sku', width: 110 },
          { title: 'Name', dataIndex: 'name', render: (v: string) => <strong>{v}</strong> },
          { title: 'Category', dataIndex: 'categoryId', width: 140, render: (id: number) => categories.find((c) => c.id === id)?.name ?? '—' },
          { title: 'Price', dataIndex: 'price', width: 100, align: 'right', render: (v: number) => `${settings.currencySymbol}${v}` },
        ]}
      />
    </Card>
  )
}
