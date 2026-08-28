import { useState } from 'react'
import { Button } from './ui'

const idOf = (obj) => {
  const keys = ['id', 'productId']
  for (const key of keys) {
    if (obj?.[key] !== undefined) return obj[key]
  }
}

export function Inventory({ products, onRefresh, api }) {
  return (
    <div className="grid gap-3">
      {products.map((product) => (
        <InventoryRow
          key={idOf(product)}
          product={product}
          onRefresh={onRefresh}
          api={api}
        />
      ))}
    </div>
  )
}

function InventoryRow({ product, onRefresh, api }) {
  const currentQty = product.inventory?.quantity ?? product.quantity ?? 0
  const [quantity, setQuantity] = useState(currentQty)

  async function handleUpdate() {
    await api.inventory(idOf(product), quantity)
    onRefresh()
  }

  return (
    <div className="flex flex-wrap items-center gap-4 border border-line bg-white p-4">
      <div className="flex-1">
        <strong>{product.name}</strong>
        <p className="text-sm text-[#657069]">
          Current quantity: {currentQty}
        </p>
      </div>

      <input
        type="number"
        min="0"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        className="w-24 rounded-md border border-line px-3 py-2"
      />

      <Button onClick={handleUpdate}>Update</Button>
    </div>
  )
}
