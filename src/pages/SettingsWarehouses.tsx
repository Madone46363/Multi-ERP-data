import { useState } from 'react'
import { Button, Card, Input, Space, Table, message } from 'antd'
import { useStore } from '../store/useStore'

export default function SettingsWarehouses() {
  const warehouses = useStore((s) => s.warehouses)
  const products = useStore((s) => s.products)
  const addWarehouse = useStore((s) => s.addWarehouse)
  const [name, setName] = useState('')
  const [city, setCity] = useState('')

  return (
    <Card title="Warehouse Locations">
      <Space style={{ marginBottom: 14, flexWrap: 'wrap' }}>
        <Input placeholder="Warehouse name" value={name} onChange={(e) => setName(e.target.value)} style={{ width: 220 }} />
        <Input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} style={{ width: 160 }} />
        <Button
          type="primary"
          onClick={() => {
            if (!name.trim()) return message.warning('Enter a name')
            addWarehouse({ name: name.trim(), city })
            setName('')
            setCity('')
            message.success('Warehouse added')
          }}
        >
          Add Warehouse
        </Button>
      </Space>

      <Table
        dataSource={warehouses}
        rowKey="id"
        size="small"
        pagination={false}
        columns={[
          { title: '#', dataIndex: 'id', width: 60 },
          { title: 'Name', dataIndex: 'name', render: (v: string) => <strong>{v}</strong> },
          { title: 'City', dataIndex: 'city', render: (v) => v ?? '—' },
          { title: 'Phone', dataIndex: 'phone', render: (v) => v ?? '—' },
          { title: 'Address', dataIndex: 'address', render: (v) => v ?? '—' },
          {
            title: 'Products',
            width: 110,
            align: 'center',
            render: (_: unknown, r) => products.filter((p) => p.warehouseId === r.id).length,
          },
        ]}
      />
    </Card>
  )
}
