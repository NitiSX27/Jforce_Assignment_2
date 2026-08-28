import { Empty } from './ui'

const money = (value) => `₹${Number(value || 0).toFixed(2)}`
const idOf = (obj) => {
  const keys = ['id', 'orderId']
  for (const key of keys) {
    if (obj?.[key] !== undefined) return obj[key]
  }
}

export function Orders({ orders }) {
  return (
    <div className="grid gap-3">
      {orders.map((order) => (
        <OrderRow key={idOf(order)} order={order} />
      ))}
      {!orders.length && <Empty text="No orders placed yet." />}
    </div>
  )
}

function OrderRow({ order }) {
  const items = order.items || order.orderItems || []
  const total = order.total || order.totalAmount

  return (
    <article className="border border-line bg-white p-5">
      <div className="flex flex-wrap justify-between gap-2">
        <strong>Order #{idOf(order)}</strong>
        <span className="rounded-full bg-[#e8eee6] px-3 py-1 text-xs font-semibold text-moss">
          {order.status || 'PLACED'}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-sm text-[#657069]">
        <span>{items.length} item(s)</span>
        <strong className="text-ink">{money(total)}</strong>
      </div>
    </article>
  )
}
