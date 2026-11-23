import { Card, Col, Row, Statistic, Table } from 'antd'
import { useStore, money } from '../store/useStore'

export default function Accounting() {
  const accounts = useStore((s) => s.accounts)
  const expenses = useStore((s) => s.expenses)
  const sales = useStore((s) => s.sales)
  const purchases = useStore((s) => s.purchases)
  const settings = useStore((s) => s.settings)
  const sym = settings.currencySymbol

  const totalSales = sales.reduce((a, s) => a + s.total, 0)
  const totalPurchases = purchases.reduce((a, p) => a + p.total, 0)
  const totalExpenses = expenses.reduce((a, e) => a + e.amount, 0)
  const profit = totalSales - totalPurchases - totalExpenses

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Row gutter={16}>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="Total revenue" value={money(totalSales, sym)} valueStyle={{ color: 'var(--success)' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="Total expenses" value={money(totalExpenses + totalPurchases, sym)} valueStyle={{ color: 'var(--danger)' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="Net profit" value={money(profit, sym)} valueStyle={{ color: profit > 0 ? 'var(--success)' : 'var(--danger)' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="Cash in hand" value={money(accounts.find((a) => a.name === 'Cash')?.balance ?? 0, sym)} /></Card>
        </Col>
      </Row>

      <Card title="Chart of Accounts">
        <Table
          dataSource={accounts}
          rowKey="id"
          size="small"
          pagination={false}
          columns={[
            { title: 'Account', dataIndex: 'name', render: (v: string) => <strong>{v}</strong> },
            { title: 'Type', dataIndex: 'type' },
            { title: 'Balance', dataIndex: 'balance', align: 'right', render: (v: number) => money(v, sym) },
          ]}
        />
      </Card>

      <Card title="Recent Expenses">
        <Table
          dataSource={expenses.slice(0, 8)}
          rowKey="id"
          size="small"
          pagination={false}
          columns={[
            { title: 'Date', dataIndex: 'date', width: 110 },
            { title: 'Reference', dataIndex: 'reference', width: 120 },
            { title: 'Category', dataIndex: 'category' },
            { title: 'Description', dataIndex: 'description' },
            { title: 'Amount', dataIndex: 'amount', width: 120, align: 'right', render: (v: number) => <strong>{money(v, sym)}</strong> },
          ]}
        />
      </Card>
    </div>
  )
}
