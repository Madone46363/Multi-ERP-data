import { useState } from 'react'
import { Button, Card, Input, Select, Space, Table, message } from 'antd'
import { useStore } from '../../store/useStore'

type Kind = 'categories' | 'brands' | 'units' | 'departments' | 'designations'

const titles: Record<Kind, string> = {
  categories: 'Product Categories',
  brands: 'Brands',
  units: 'Units',
  departments: 'Departments',
  designations: 'Designations',
}

export default function SimpleList({ kind }: { kind: Kind }) {
  const store = useStore()
  const [name, setName] = useState('')
  const [parent, setParent] = useState<number | null>(null)
  const [dept, setDept] = useState('')

  if (kind === 'categories') {
    const rows = store.categories
    return (
      <Card title={titles[kind]}>
        <Space style={{ marginBottom: 14 }}>
          <Input
            placeholder="Category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: 220 }}
          />
          <Select
            placeholder="Parent (optional)"
            allowClear
            style={{ width: 200 }}
            value={parent}
            onChange={(v) => setParent(v ?? null)}
            options={rows.filter((c) => !c.parentId).map((c) => ({ value: c.id, label: c.name }))}
          />
          <Button
            type="primary"
            onClick={() => {
              if (!name.trim()) return message.warning('Enter a name')
              store.addCategory(name.trim(), parent)
              setName('')
              setParent(null)
              message.success('Category added')
            }}
          >
            Add Category
          </Button>
        </Space>
        <Table
          dataSource={rows}
          rowKey="id"
          size="small"
          pagination={false}
          columns={[
            { title: '#', dataIndex: 'id', width: 60 },
            { title: 'Name', dataIndex: 'name' },
            {
              title: 'Parent',
              dataIndex: 'parentId',
              render: (pid: number | null) => (pid ? rows.find((c) => c.id === pid)?.name ?? '—' : '—'),
            },
          ]}
        />
      </Card>
    )
  }

  if (kind === 'brands') {
    const rows = store.brands
    return (
      <Card title={titles[kind]}>
        <Space style={{ marginBottom: 14 }}>
          <Input placeholder="Brand name" value={name} onChange={(e) => setName(e.target.value)} style={{ width: 220 }} />
          <Button
            type="primary"
            onClick={() => {
              if (!name.trim()) return message.warning('Enter a name')
              store.addBrand(name.trim())
              setName('')
              message.success('Brand added')
            }}
          >
            Add Brand
          </Button>
        </Space>
        <Table
          dataSource={rows}
          rowKey="id"
          size="small"
          pagination={false}
          columns={[{ title: '#', dataIndex: 'id', width: 60 }, { title: 'Name', dataIndex: 'name' }]}
        />
      </Card>
    )
  }

  if (kind === 'units') {
    return (
      <Card title={titles[kind]}>
        <Table
          dataSource={store.units}
          rowKey="id"
          size="small"
          pagination={false}
          columns={[
            { title: '#', dataIndex: 'id', width: 60 },
            { title: 'Name', dataIndex: 'name' },
            { title: 'Short', dataIndex: 'shortName', width: 100 },
            { title: 'Base Unit', dataIndex: 'baseUnit', render: (v) => v ?? '—' },
            {
              title: 'Operation',
              render: (_, r) => (r.baseUnit ? `${r.operator} ${r.operationValue}` : '—'),
            },
          ]}
        />
      </Card>
    )
  }

  if (kind === 'departments') {
    return (
      <Card title={titles[kind]}>
        <Table
          dataSource={store.departments}
          rowKey="id"
          size="small"
          pagination={false}
          columns={[
            { title: '#', dataIndex: 'id', width: 60 },
            { title: 'Department', dataIndex: 'name' },
            { title: 'Head', dataIndex: 'head', render: (v) => v ?? '—' },
            { title: 'Employees', dataIndex: 'employees' },
          ]}
        />
      </Card>
    )
  }

  return (
    <Card title={titles[kind]}>
      <Space style={{ marginBottom: 14 }}>
        <Input placeholder="Designation name" value={name} onChange={(e) => setName(e.target.value)} style={{ width: 220 }} />
        <Select
          placeholder="Department"
          style={{ width: 200 }}
          value={dept || undefined}
          onChange={setDept}
          options={store.departments.map((d) => ({ value: d.name, label: d.name }))}
        />
        <Button
          type="primary"
          onClick={() => {
            if (!name.trim()) return message.warning('Enter a name')
            store.addRecord('designations', { name: name.trim(), department: dept || 'Unassigned' })
            setName('')
            message.success('Designation added')
          }}
        >
          Add Designation
        </Button>
      </Space>
      <Table
        dataSource={store.designations}
        rowKey="id"
        size="small"
        pagination={false}
        columns={[
          { title: '#', dataIndex: 'id', width: 60 },
          { title: 'Designation', dataIndex: 'name' },
          { title: 'Department', dataIndex: 'department' },
        ]}
      />
    </Card>
  )
}
