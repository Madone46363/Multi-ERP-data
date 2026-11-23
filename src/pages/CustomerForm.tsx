import { Button, Card, Col, Form, Input, Row, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'

export default function CustomerForm() {
  const navigate = useNavigate()
  const addCustomer = useStore((s) => s.addCustomer)

  const onFinish = (v: Record<string, string>) => {
    addCustomer({
      name: v.name,
      email: v.email ?? '',
      phone: v.phone ?? '',
      address: v.address ?? '',
      city: v.city ?? '',
      state: v.state ?? '',
      country: v.country ?? 'USA',
      gstNumber: v.gstNumber ?? '',
      walletBalance: 0,
      hasLogin: false,
    })
    message.success('Customer created')
    navigate('/people/customers')
  }

  return (
    <Card title="Create Customer">
      <Form layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          <Col xs={24} md={12}><Form.Item label="Name" name="name" rules={[{ required: true }]}><Input /></Form.Item></Col>
          <Col xs={24} md={12}><Form.Item label="Email" name="email" rules={[{ type: 'email' }]}><Input /></Form.Item></Col>
          <Col xs={24} md={12}><Form.Item label="Phone" name="phone"><Input /></Form.Item></Col>
          <Col xs={24} md={12}><Form.Item label="Tax / GST number" name="gstNumber"><Input /></Form.Item></Col>
          <Col xs={24} md={12}><Form.Item label="Address" name="address"><Input /></Form.Item></Col>
          <Col xs={24} md={6}><Form.Item label="City" name="city"><Input /></Form.Item></Col>
          <Col xs={24} md={6}><Form.Item label="Country" name="country" initialValue="USA"><Input /></Form.Item></Col>
        </Row>
        <Button type="primary" htmlType="submit">Save Customer</Button>
        <Button style={{ marginLeft: 10 }} onClick={() => navigate('/people/customers')}>Cancel</Button>
      </Form>
    </Card>
  )
}
