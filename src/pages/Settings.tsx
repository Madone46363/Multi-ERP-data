import { Card, Col, Form, Input, Row, Select, Switch, Button, message } from 'antd'
import { useStore } from '../store/useStore'

export default function Settings() {
  const settings = useStore((s) => s.settings)
  const updateSettings = useStore((s) => s.updateSettings)

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Card title="System Settings">
        <Form
          layout="vertical"
          initialValues={settings}
          onFinish={(v) => {
            updateSettings(v)
            message.success('Settings saved')
          }}
        >
          <Row gutter={16}>
            <Col xs={24} md={12}><Form.Item label="Store name" name="storeName"><Input /></Form.Item></Col>
            <Col xs={24} md={12}><Form.Item label="Tagline" name="tagline"><Input /></Form.Item></Col>
            <Col xs={24} md={12}><Form.Item label="Email" name="email"><Input /></Form.Item></Col>
            <Col xs={24} md={12}><Form.Item label="Phone" name="phone"><Input /></Form.Item></Col>
            <Col xs={24}><Form.Item label="Address" name="address"><Input /></Form.Item></Col>
            <Col xs={12} md={6}><Form.Item label="Currency" name="currency"><Input /></Form.Item></Col>
            <Col xs={12} md={6}><Form.Item label="Symbol" name="currencySymbol"><Input /></Form.Item></Col>
            <Col xs={12} md={6}>
              <Form.Item label="Symbol position" name="currencyPosition">
                <Select options={[{ value: 'before', label: 'Before' }, { value: 'after', label: 'After' }]} />
              </Form.Item>
            </Col>
            <Col xs={12} md={6}><Form.Item label="Decimals" name="decimalPlaces"><Input /></Form.Item></Col>
            <Col xs={24} md={12}><Form.Item label="Invoice footer" name="invoiceFooter"><Input /></Form.Item></Col>
            <Col xs={24} md={12}>
              <Form.Item label="Language" name="language">
                <Select options={['en', 'es', 'fr', 'ar', 'hi'].map((l) => ({ value: l, label: l }))} />
              </Form.Item>
            </Col>
          </Row>
          <Button type="primary" htmlType="submit">Save Settings</Button>
        </Form>
      </Card>

      <Card title="POS Settings" size="small">
        <div style={{ display: 'grid', gap: 14, maxWidth: 520 }}>
          {[
            ['Show product stock in POS', true],
            ['Allow offline mode', true],
            ['Print receipt automatically', false],
            ['Round cash totals', true],
          ].map(([label, def]) => (
            <div key={String(label)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13 }}>{label}</span>
              <Switch defaultChecked={Boolean(def)} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
