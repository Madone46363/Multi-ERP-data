import { Button, Card, Col, Form, Input, Row, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'

export default function SupplierForm() {
  const navigate = useNavigate()
  const addSupplier = useStore((s) => s.addSupplier)

  const onFinish = (v: Record<string, string>) => {
    addSupplier({
      name: v.name,
      company: v.company ?? v.name,
      email: v.email ?? '',
      phone: v.phone ?? '',
      address: v.address ?? '',
      taxNumber: v.taxNumber ?? '',
      walletBalance: 0,
    })
    message.success('Supplier created')
    navigate('/people/suppliers')
  }

  return (
    <Card title="Create Supplier">
      <Form layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          <Col xs={24} md={12}><Form.Item label="Name" name="name" rules={[{ required: true }]}><Input /></Form.Item></Col>
          <Col xs={24} md={12}><Form.Item label="Company" name="company"><Input /></Form.Item></Col>
          <Col xs={24} md={12}><Form.Item label="Email" name="email" rules={[{ type: 'email' }]}><Input /></Form.Item></Col>
          <Col xs={24} md={12}><Form.Item label="Phone" name="phone"><Input /></Form.Item></Col>
          <Col xs={24} md={12}><Form.Item label="Tax number" name="taxNumber"><Input /></Form.Item></Col>
          <Col xs={24} md={12}><Form.Item label="Address" name="address"><Input /></Form.Item></Col>
        </Row>
        <Button type="primary" htmlType="submit">Save Supplier</Button>
        <Button style={{ marginLeft: 10 }} onClick={() => navigate('/people/suppliers')}>Cancel</Button>
      </Form>
    </Card>
  )
}
