export const money = (value) => `₹${Number(value || 0).toFixed(2)}`

export const idOf = (obj) => {
  if (!obj) return null
  const keys = ['id', 'productId', 'categoryId', 'cartItemId', 'orderId', 'userId', 'addressId']
  for (const key of keys) {
    if (obj[key] !== undefined) return obj[key]
  }
  return null
}
