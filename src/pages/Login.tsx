import { useState } from 'react'
import { Button, Form, Input, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'

export default function Login() {
  const [loading, setLoading] = useState(false)
  const login = useStore((s) => s.login)
  const navigate = useNavigate()

  const onFinish = (values: { email: string; password: string }) => {
    setLoading(true)
    setTimeout(() => {
      const success = login(values.email, values.password)
      setLoading(false)
      if (success) {
        message.success('Welcome back!')
        navigate('/dashboard')
      } else {
        message.error('Invalid credentials. Try john@stockysaas.site / 12345678')
      }
    }, 400)
  }

  return (
    <div className="login-wrap">
      <div className="login-hero">
        <h1 style={{ fontSize: 42, fontWeight: 800, margin: 0, lineHeight: 1.1 }}>
          Ultimate Inventory <br />
          With POS
        </h1>
        <p style={{ fontSize: 18, opacity: 0.92, marginTop: 18, lineHeight: 1.6 }}>
          Complete business management suite — inventory, point-of-sale, accounting, HR, and more.
          Built for retail, wholesale, and multi-industry operations.
        </p>
        <div style={{ marginTop: 32, display: 'flex', gap: 24, flexWrap: 'wrap', fontSize: 14 }}>
          <div>✓ Multi-warehouse inventory</div>
          <div>✓ POS & online store</div>
          <div>✓ Double-entry accounting</div>
          <div>✓ HRM & payroll</div>
        </div>
      </div>

      <div className="login-form-side">
        <div className="login-card">
          <div style={{ marginBottom: 28 }}>
            <div
              style={{
                width: 46, height: 46, borderRadius: 11,
                background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                display: 'grid', placeItems: 'center', color: '#fff',
                fontWeight: 800, fontSize: 20, marginBottom: 12,
              }}
            >
              S
            </div>
            <h2 style={{ margin: '0 0 4px', fontSize: 24, fontWeight: 700 }}>Sign In</h2>
            <p style={{ color: '#7575a0', margin: 0, fontSize: 14 }}>
              Enter your credentials to continue
            </p>
          </div>

          <Form layout="vertical" onFinish={onFinish} autoComplete="off" size="large">
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Please enter your email' }]}
              initialValue="john@stockysaas.site"
            >
              <Input placeholder="you@example.com" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please enter your password' }]}
              initialValue="12345678"
            >
              <Input.Password placeholder="••••••••" />
            </Form.Item>

            <Form.Item style={{ marginBottom: 10 }}>
              <Button type="primary" htmlType="submit" block loading={loading}>
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <div style={{ marginTop: 20, padding: 14, background: '#f7f8fc', borderRadius: 8, fontSize: 12 }}>
            <div style={{ fontWeight: 600, marginBottom: 4, color: '#6d28d9' }}>Demo Credentials</div>
            <div style={{ color: '#5a5a7a' }}>
              Email: <strong>john@stockysaas.site</strong><br />
              Password: <strong>12345678</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
