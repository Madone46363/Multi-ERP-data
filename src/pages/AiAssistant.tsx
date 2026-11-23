import { useState } from 'react'
import { Button, Card, Input } from 'antd'

export default function AiAssistant() {
  const [input, setInput] = useState('')
  const [msgs, setMsgs] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'Hi! I can help with inventory questions, sales reports, and system tasks. What can I do for you?' },
  ])

  const send = () => {
    if (!input.trim()) return
    setMsgs((m) => [...m, { role: 'user', text: input }])
    setInput('')
    setTimeout(() => {
      setMsgs((m) => [
        ...m,
        {
          role: 'ai',
          text: `I've noted your request: "${input.slice(0, 60)}". In a live system, this would query your data or perform an action. This is a demo, so I can't actually execute it yet.`,
        },
      ])
    }, 800)
  }

  return (
    <Card title="AI Assistant" extra={<span style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }}>Powered by GPT-4</span>}>
      <div
        style={{
          background: 'var(--surface-0)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          padding: 16,
          minHeight: 420,
          maxHeight: 520,
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {msgs.map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '72%',
              padding: '10px 14px',
              borderRadius: 10,
              background: m.role === 'user' ? 'var(--accent)' : 'var(--surface-2)',
              color: m.role === 'user' ? '#04121c' : 'var(--text-primary)',
              fontSize: 13,
              lineHeight: 1.5,
            }}
          >
            {m.text}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <Input
          placeholder="Ask me anything about your inventory or sales…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onPressEnter={send}
        />
        <Button type="primary" onClick={send}>Send</Button>
      </div>
    </Card>
  )
}
