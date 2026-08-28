import { Button, Empty } from './ui'

const money = (value) => `₹${Number(value || 0).toFixed(2)}`
const idOf = (obj) => {
  const keys = ['id', 'productId', 'cartItemId']
  for (const key of keys) {
    if (obj?.[key] !== undefined) return obj[key]
  }
}

export function Cart({ cart, addresses, onMutate, onCheckout, api }) {
  const items = cart?.items || cart?.cartItems || []
  const total =
    cart?.total ??
    items.reduce(
      (sum, i) =>
        sum +
        Number(i.product?.price || i.price || 0) * Number(i.quantity || 0),
      0
    )

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
      <section className="border border-line bg-white">
        {items.map((item) => (
          <CartItem
            key={idOf(item)}
            item={item}
            onMutate={onMutate}
            api={api}
          />
        ))}
        {!items.length && (
          <Empty text="Your cart is ready for something useful." />
        )}
      </section>

      <CartSummary
        total={total}
        addresses={addresses}
        onCheckout={onCheckout}
      />
    </div>
  )
}

function CartItem({ item, onMutate, api }) {
  const product = item.product || {}
  const quantity = item.quantity || 1

  return (
    <div className="flex items-center gap-4 border-b border-line p-4">
      <div className="grid h-12 w-12 place-items-center bg-[#e8eee6] font-display text-xl text-moss">
        {product.name?.[0] || 'P'}
      </div>

      <div className="min-w-0 flex-1">
        <strong>{product.name || item.productName}</strong>
        <p className="text-sm text-[#657069]">{money(product.price || item.price)}</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="rounded border border-line px-2 py-1"
          onClick={() =>
            onMutate(() =>
              api.updateCartItem(idOf(item), Math.max(1, quantity - 1))
            )
          }
        >
          Decrease
        </button>

        <span className="w-5 text-center">{quantity}</span>

        <button
          className="rounded border border-line px-2 py-1"
          onClick={() =>
            onMutate(() => api.updateCartItem(idOf(item), quantity + 1))
          }
        >
          Increase
        </button>

        <button
          className="ml-3 px-2 py-1 text-coral"
          onClick={() => onMutate(() => api.removeCartItem(idOf(item)))}
        >
          Remove
        </button>
      </div>
    </div>
  )
}

function CartSummary({ total, addresses, onCheckout }) {
  const money = (value) => `₹${Number(value || 0).toFixed(2)}`

  return (
    <aside className="h-fit border border-line bg-white p-5">
      <p className="text-xs font-bold uppercase tracking-wider text-moss">
        Order summary
      </p>

      <div className="my-5 flex justify-between text-lg">
        <span>Total</span>
        <strong>{money(total)}</strong>
      </div>

      <label className="mb-3 grid gap-1 text-sm font-semibold">
        Delivery address
        <select
          id="checkout-address"
          className="rounded-md border border-line bg-white px-3 py-2 font-normal"
          defaultValue=""
        >
          <option value="" disabled>
            Select an address
          </option>
          {addresses.map((address) => (
            <option key={idOf(address)} value={idOf(address)}>
              {address.addressLine || address.street}
            </option>
          ))}
        </select>
      </label>

      <Button onClick={onCheckout}>Place order</Button>
    </aside>
  )
}
