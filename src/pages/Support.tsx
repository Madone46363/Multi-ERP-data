import { Card, Input } from 'antd'

export default function Support() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Card title="Contact Support">
        <div style={{ display: 'grid', gap: 14, maxWidth: 540 }}>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 6 }}>Email</div>
            <Input placeholder="Your email" />
          </div>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 6 }}>Subject</div>
            <Input placeholder="Brief subject" />
          </div>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 6 }}>Message</div>
            <Input.TextArea rows={6} placeholder="Describe your issue or question…" />
          </div>
          <button
            style={{
              padding: '9px 18px',
              borderRadius: 8,
              background: 'var(--accent)',
              color: '#04121c',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Send Message
          </button>
        </div>
      </Card>

      <Card title="Resources" size="small">
        <div style={{ display: 'grid', gap: 10 }}>
          {[
            '📖 Documentation',
            '🎓 Video Tutorials',
            '💬 Community Forum',
            '🐛 Report a Bug',
            '✨ Feature Requests',
          ].map((r) => (
            <div
              key={r}
              style={{
                padding: '10px 14px',
                background: 'var(--surface-2)',
                borderRadius: 8,
                fontSize: 13,
                cursor: 'pointer',
                border: '1px solid var(--border)',
              }}
            >
              {r}
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
