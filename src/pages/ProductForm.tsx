import { Button, Card, Col, Form, Input, InputNumber, Row, Select, Switch, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'

export default function ProductForm() {
  const navigate = useNavigate()
  const categories = useStore((s) => s.categories)
  const brands = useStore((s) => s.brands)
  const units = useStore((s) => s.units)
  const warehouses = useStore((s) => s.warehouses)
  const addProduct = useStore((s) => s.addProduct)
  const settings = useStore((s) => s.settings)

  const onFinish = (v: Record<string, unknown>) => {
    addProduct({
      name: String(v.name),
      code: String(v.code),
      type: (v.type as 'standard') ?? 'standard',
      categoryId: Number(v.categoryId),
      brandId: v.brandId ? Number(v.brandId) : null,
      unitId: Number(v.unitId),
      cost: Number(v.cost ?? 0),
      price: Number(v.price ?? 0),
      taxType: (v.taxType as 'exclusive') ?? 'exclusive',
      taxRate: Number(v.taxRate ?? 0),
      taxMethod: 'percentage',
      alertQuantity: Number(v.alertQuantity ?? 10),
      stock: Number(v.stock ?? 0),
      warehouseId: Number(v.warehouseId ?? 1),
      emoji: String(v.emoji ?? '📦'),
      description: String(v.description ?? ''),
      featured: Boolean(v.featured),
      barcodeSymbology: 'CODE128',
    })
    message.success('Product created')
    navigate('/products')
  }

  return (
    <Card title="Create Product">
      <Form layout="vertical" onFinish={onFinish} initialValues={{ type: 'standard', taxType: 'exclusive', alertQuantity: 10, warehouseId: 1, emoji: '📦' }}>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item label="Product Name" name="name" rules={[{ required: true }]}>
              <Input placeholder="e.g. Wireless Earbuds Pro" />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item label="Product Code / SKU" name="code" rules={[{ required: true }]}>
              <Input placeholder="SKU-0001" />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item label="Icon (emoji)" name="emoji">
              <Input maxLength={2} />
            </Form.Item>
          </Col>

          <Col xs={24} md={6}>
            <Form.Item label="Category" name="categoryId" rules={[{ required: true }]}>
              <Select
                showSearch
                optionFilterProp="label"
                options={categories.map((c) => ({ value: c.id, label: c.name }))}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item label="Brand" name="brandId">
              <Select allowClear options={brands.map((b) => ({ value: b.id, label: b.name }))} />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item label="Unit" name="unitId" rules={[{ required: true }]}>
              <Select options={units.map((u) => ({ value: u.id, label: `${u.name} (${u.shortName})` }))} />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item label="Warehouse" name="warehouseId">
              <Select options={warehouses.map((w) => ({ value: w.id, label: w.name }))} />
            </Form.Item>
          </Col>

          <Col xs={12} md={6}>
            <Form.Item label={`Cost (${settings.currencySymbol})`} name="cost" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={12} md={6}>
            <Form.Item label={`Selling Price (${settings.currencySymbol})`} name="price" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={12} md={6}>
            <Form.Item label="Opening Stock" name="stock">
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={12} md={6}>
            <Form.Item label="Alert Quantity" name="alertQuantity">
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col xs={12} md={6}>
            <Form.Item label="Tax Type" name="taxType">
              <Select options={[{ value: 'exclusive', label: 'Exclusive' }, { value: 'inclusive', label: 'Inclusive' }, { value: 'none', label: 'None' }]} />
            </Form.Item>
          </Col>
          <Col xs={12} md={6}>
            <Form.Item label="Tax Rate (%)" name="taxRate">
              <InputNumber min={0} max={100} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Featured on store" name="featured" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item label="Description" name="description">
              <Input.TextArea rows={3} />
            </Form.Item>
          </Col>
        </Row>

        <Button type="primary" htmlType="submit">Save Product</Button>
        <Button style={{ marginLeft: 10 }} onClick={() => navigate('/products')}>Cancel</Button>
      </Form>
    </Card>
  )
}
