import { useMemo, useState } from 'react'
import {
  Button, Card, Col, DatePicker, Form, Input, InputNumber, Modal, Popconfirm,
  Row, Select, Space, Table, message,
} from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { useStore } from '../store/useStore'
import { modules } from '../config/modules'
import type { FieldDef } from '../config/modules'

interface Props {
  moduleKey?: string
  title?: string
  /** auto mode: resolve module from the current URL */
  auto?: boolean
}

const pathToKey = (path: string): string | null => {
  const seg = path.split('/').filter(Boolean)
  const last = seg[seg.length - 1]
  const aliases: Record<string, string> = {
    requests: 'bookingRequests',
    jobs: 'serviceJobs',
    vehicles: 'vehicles',
    patients: 'patients',
    students: 'students',
    orders: 'productionOrders',
    properties: 'properties',
    leads: 'leads',
    deals: 'deals',
    tasks: 'tasks',
    projects: 'projects',
    assets: 'assets',
    'floor': 'floorPlan',
    'online': 'onlineOrders',
  }
  // find matching module key by scanning nav path parts
  for (const key of Object.keys(modules)) {
    const parts = path.toLowerCase().split('/').filter(Boolean)
    const keyLower = key.toLowerCase()
    if (parts.includes(keyLower) || parts.some((p) => p === keyLower)) return key
  }
  return aliases[last] ?? null
}

const renderField = (f: FieldDef) => {
  switch (f.type) {
    case 'number':
      return <InputNumber style={{ width: '100%' }} />
    case 'date':
      return <DatePicker style={{ width: '100%' }} />
    case 'select':
      return (
        <Select
          options={(f.options ?? []).map((o) => ({ value: o, label: o }))}
          placeholder="Select…"
        />
      )
    case 'textarea':
      return <Input.TextArea rows={2} />
    default:
      return <Input />
  }
}

const toDayjs = (v: unknown) => (v ? dayjs(String(v)) : undefined)

export default function GenericModule({ moduleKey, title, auto }: Props) {
  const location = useLocation()
  const navigate = useNavigate()
  const store = useStore()
  const [form] = Form.useForm()
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | number | null>(null)
  const [q, setQ] = useState('')

  const key = moduleKey ?? (auto ? pathToKey(location.pathname) : null)
  const def = key ? modules[key] : null

  const rows = useMemo(() => {
    if (!key) return []
    const base = store.recordFor(key)
    const sample = modules[key]?.sample ?? []
    const merged = [...base, ...sample].sort((a, b) => Number(b.id ?? 0) - Number(a.id ?? 0))
    if (!q.trim()) return merged
    const query = q.toLowerCase()
    return merged.filter((r) =>
      Object.values(r).some((v) => String(v ?? '').toLowerCase().includes(query)),
    )
  }, [key, store, q])

  if (!def || !key) {
    return (
      <Card title="Coming soon">
        <div style={{ color: 'var(--text-secondary)', marginBottom: 14 }}>
          This section is part of the full module set. Use the sidebar to explore built-out areas.
        </div>
        <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
      </Card>
    )
  }

  const columns = [
    ...def.fields.map((f) => ({
      title: f.label,
      dataIndex: f.key,
      key: f.key,
      width: f.width,
      render: (v: unknown) => (v === undefined || v === null || v === '' ? '—' : String(v)),
    })),
    {
      title: '',
      width: 120,
      render: (_: unknown, r: Record<string, unknown>) => (
        <Space size={4}>
          <Button
            size="small"
            onClick={() => {
              setEditingId(r.id as number)
              form.setFieldsValue({
                ...r,
                ...(r.date ? { date: toDayjs(r.date) } : {}),
                ...(r.start ? { start: toDayjs(r.start) } : {}),
                ...(r.end ? { end: toDayjs(r.end) } : {}),
                ...(r.due ? { due: toDayjs(r.due) } : {}),
                ...(r.expiry ? { expiry: toDayjs(r.expiry) } : {}),
              })
              setOpen(true)
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete record?"
            onConfirm={() => {
              store.deleteRecord(key, r.id as number)
              message.success('Deleted')
            }}
          >
            <Button size="small" danger>Del</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const submit = async () => {
    const values = await form.validateFields()
    const flat: Record<string, unknown> = {}
    Object.entries(values).forEach(([k, v]) => {
      if (v && typeof v === 'object' && 'format' in (v as object)) {
        flat[k] = (v as { format: (f: string) => string }).format('YYYY-MM-DD')
      } else {
        flat[k] = v
      }
    })
    if (editingId != null) {
      store.updateRecord(key, editingId, flat)
      message.success('Record updated')
    } else {
      store.addRecord(key, flat)
      message.success('Record added')
    }
    form.resetFields()
    setOpen(false)
    setEditingId(null)
  }

  return (
    <Card
      title={title ?? def.title}
      extra={
        <Button
          type="primary"
          onClick={() => {
            setEditingId(null)
            form.resetFields()
            setOpen(true)
          }}
        >
          + Add {def.title.replace(/s$/, '').replace(/s\b/, '')}
        </Button>
      }
    >
      <Input.Search
        placeholder="Search…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        style={{ width: 280, marginBottom: 14 }}
        allowClear
      />
      <Table
        dataSource={rows as Record<string, unknown>[]}
        rowKey={(r) => String(r.id)}
        size="small"
        scroll={{ x: 800 }}
        pagination={{ pageSize: 12, showSizeChanger: true }}
        columns={columns}
      />

      <Modal
        open={open}
        title={editingId != null ? `Edit ${def.title}` : `New ${def.title}`}
        onCancel={() => {
          setOpen(false)
          setEditingId(null)
          form.resetFields()
        }}
        onOk={submit}
        okText="Save"
        width={640}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            {def.fields.map((f) => (
              <Col xs={24} md={12} key={f.key}>
                <Form.Item
                  label={f.label}
                  name={f.key}
                  rules={f.required ? [{ required: true, message: `${f.label} is required` }] : []}
                >
                  {renderField(f)}
                </Form.Item>
              </Col>
            ))}
          </Row>
        </Form>
      </Modal>
    </Card>
  )
}
