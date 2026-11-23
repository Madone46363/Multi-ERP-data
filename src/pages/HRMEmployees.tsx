import { useMemo, useState } from 'react'
import { Button, Card, Col, Form, Input, InputNumber, Modal, Row, Select, Table, Tag, message } from 'antd'
import { useStore, money } from '../store/useStore'

/* ---------- Employees ---------- */
export default function HRMEmployees() {
  const employees = useStore((s) => s.employees)
  const departments = useStore((s) => s.departments)
  const designations = useStore((s) => s.designations)
  const addEmployee = useStore((s) => s.addEmployee)
  const updateEmployee = useStore((s) => s.updateEmployee)
  const settings = useStore((s) => s.settings)
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm()
  const [q, setQ] = useState('')

  const rows = employees.filter(
    (e) =>
      !q ||
      e.name.toLowerCase().includes(q.toLowerCase()) ||
      e.email.toLowerCase().includes(q.toLowerCase()),
  )

  const submit = async () => {
    const v = await form.validateFields()
    addEmployee({ ...v, status: 'active', employeeType: v.employeeType ?? 'permanent' })
    message.success('Employee added')
    setOpen(false)
    form.resetFields()
  }

  return (
    <Card
      title={`Employees (${rows.length})`}
      extra={<Button type="primary" onClick={() => setOpen(true)}>+ Add Employee</Button>}
    >
      <Input.Search
        placeholder="Search employees…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        style={{ width: 280, marginBottom: 14 }}
        allowClear
      />
      <Table
        dataSource={rows}
        rowKey="id"
        size="small"
        scroll={{ x: 900 }}
        pagination={{ pageSize: 12 }}
        columns={[
          { title: 'Name', dataIndex: 'name', render: (v: string) => <strong>{v}</strong> },
          { title: 'Email', dataIndex: 'email' },
          { title: 'Department', dataIndex: 'department', width: 130 },
          { title: 'Designation', dataIndex: 'designation', width: 170 },
          { title: 'Type', dataIndex: 'employeeType', width: 110, render: (v: string) => <Tag>{v}</Tag> },
          {
            title: 'Salary',
            dataIndex: 'salary',
            width: 110,
            align: 'right',
            render: (v: number) => money(v, settings.currencySymbol),
          },
          {
            title: 'Status',
            dataIndex: 'status',
            width: 100,
            render: (v: string, r) => (
              <Tag
                color={v === 'active' ? 'green' : 'default'}
                style={{ cursor: 'pointer' }}
                onClick={() => updateEmployee(r.id, { status: v === 'active' ? 'inactive' : 'active' })}
              >
                {v}
              </Tag>
            ),
          },
        ]}
      />

      <Modal open={open} title="Add Employee" onCancel={() => setOpen(false)} onOk={submit} okText="Save" width={680}>
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col xs={24} md={12}><Form.Item label="Name" name="name" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col xs={24} md={12}><Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}><Input /></Form.Item></Col>
            <Col xs={24} md={12}><Form.Item label="Phone" name="phone"><Input /></Form.Item></Col>
            <Col xs={24} md={12}>
              <Form.Item label="Department" name="department" rules={[{ required: true }]}>
                <Select options={departments.map((d) => ({ value: d.name, label: d.name }))} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Designation" name="designation" rules={[{ required: true }]}>
                <Select options={designations.map((d) => ({ value: d.name, label: d.name }))} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}><Form.Item label="Salary" name="salary" rules={[{ required: true }]}><InputNumber style={{ width: '100%' }} /></Form.Item></Col>
            <Col xs={24} md={12}><Form.Item label="Join Date" name="joinDate" rules={[{ required: true }]}><Input placeholder="2026-01-01" /></Form.Item></Col>
            <Col xs={24} md={12}>
              <Form.Item label="Employment Type" name="employeeType" initialValue="permanent">
                <Select options={['permanent', 'contract', 'intern'].map((t) => ({ value: t, label: t }))} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </Card>
  )
}

/* ---------- Attendance ---------- */
export function HRMAttendance() {
  const attendance = useStore((s) => s.attendance)
  const employees = useStore((s) => s.employees)
  const [day, setDay] = useState(attendance[attendance.length - 1]?.date)

  const days = useMemo(() => [...new Set(attendance.map((a) => a.date))].sort().reverse(), [attendance])
  const rows = attendance.filter((a) => a.date === day)

  return (
    <Card
      title="Attendance Register"
      extra={
        <Select
          style={{ width: 170 }}
          value={day}
          onChange={setDay}
          options={days.map((d) => ({ value: d, label: d }))}
        />
      }
    >
      <Table
        dataSource={rows}
        rowKey="id"
        size="small"
        pagination={false}
        columns={[
          {
            title: 'Employee',
            dataIndex: 'employeeId',
            render: (id: number) => employees.find((e) => e.id === id)?.name ?? '—',
          },
          { title: 'Department', render: (_, r) => employees.find((e) => e.id === r.employeeId)?.department ?? '—' },
          {
            title: 'Status',
            dataIndex: 'status',
            render: (v: string) => (
              <Tag color={v === 'present' ? 'green' : v === 'late' ? 'orange' : v === 'leave' ? 'blue' : 'red'}>{v}</Tag>
            ),
          },
          { title: 'Check in', dataIndex: 'checkIn', render: (v) => v ?? '—' },
          { title: 'Check out', dataIndex: 'checkOut', render: (v) => v ?? '—' },
        ]}
      />
    </Card>
  )
}

/* ---------- Leave ---------- */
export function HRMLeave() {
  const leaveRequests = useStore((s) => s.leaveRequests)
  const employees = useStore((s) => s.employees)

  return (
    <Card title="Leave Requests">
      <Table
        dataSource={leaveRequests}
        rowKey="id"
        size="small"
        pagination={false}
        columns={[
          { title: 'Employee', dataIndex: 'employeeId', render: (id: number) => employees.find((e) => e.id === id)?.name ?? '—' },
          { title: 'Type', dataIndex: 'leaveType' },
          { title: 'From', dataIndex: 'from' },
          { title: 'To', dataIndex: 'to' },
          { title: 'Days', dataIndex: 'days', width: 70, align: 'center' },
          { title: 'Reason', dataIndex: 'reason' },
          {
            title: 'Status',
            dataIndex: 'status',
            width: 110,
            render: (v: string) => <Tag color={v === 'approved' ? 'green' : v === 'rejected' ? 'red' : 'orange'}>{v}</Tag>,
          },
        ]}
      />
    </Card>
  )
}

/* ---------- Payroll ---------- */
export function HRMPayroll() {
  const payroll = useStore((s) => s.payroll)
  const employees = useStore((s) => s.employees)
  const settings = useStore((s) => s.settings)
  const sym = settings.currencySymbol

  const total = payroll.filter((p) => p.status === 'pending').reduce((a, p) => a + p.netPay, 0)

  return (
    <Card
      title="Payroll"
      extra={<span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Pending total: <strong style={{ color: '#fbbf24' }}>{money(total, sym)}</strong></span>}
    >
      <Table
        dataSource={payroll}
        rowKey="id"
        size="small"
        pagination={{ pageSize: 12 }}
        columns={[
          { title: 'Employee', dataIndex: 'employeeId', render: (id: number) => employees.find((e) => e.id === id)?.name ?? '—' },
          { title: 'Month', dataIndex: 'month', width: 110 },
          { title: 'Base', dataIndex: 'baseSalary', width: 110, align: 'right', render: (v: number) => money(v, sym) },
          { title: 'Bonus', dataIndex: 'bonuses', width: 100, align: 'right', render: (v: number) => money(v, sym) },
          { title: 'Deductions', dataIndex: 'deductions', width: 120, align: 'right', render: (v: number) => money(v, sym) },
          { title: 'Net pay', dataIndex: 'netPay', width: 120, align: 'right', render: (v: number) => <strong>{money(v, sym)}</strong> },
          {
            title: 'Status',
            dataIndex: 'status',
            width: 100,
            render: (v: string) => <Tag color={v === 'paid' ? 'green' : 'orange'}>{v}</Tag>,
          },
        ]}
      />
    </Card>
  )
}

export { HRMEmployeesPlaceholder as _unused }

function HRMEmployeesPlaceholder() {
  return null
}
