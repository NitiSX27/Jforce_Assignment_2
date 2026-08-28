const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'
let credentials = { email: '', password: '' }

const authHeaders = () => credentials.email && credentials.password
  ? { Authorization: `Basic ${btoa(`${credentials.email}:${credentials.password}`)}` }
  : {}

async function request(path, options = {}) {
  const { auth, ...requestOptions } = options
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(auth ? authHeaders() : {}), ...(requestOptions.headers || {}) },
    ...requestOptions,
  })
  const text = await response.text()
  let payload
  try { payload = text ? JSON.parse(text) : null } catch { payload = text }
  if (!response.ok) {
    const validation = payload?.fields
      ? Object.entries(payload.fields).map(([field, message]) => `${field}: ${message}`).join(', ')
      : ''
    const error = new Error(validation || payload?.message || payload?.error || text || `Request failed (${response.status})`)
    error.status = response.status
    error.data = payload
    throw error
  }
  return payload
}

export const api = {
  setCredentials: (email, password) => { credentials = { email, password } },
  getMe: () => request('/api/auth/me', { auth: true }),
  products: () => request('/api/products'),
  adminProducts: () => request('/api/products/admin', { auth: true }),
  categories: () => request('/api/categories'),
  createProduct: (body) => request('/api/products', { auth: true, method: 'POST', body: JSON.stringify(body) }),
  updateProduct: (id, body) => request(`/api/products/${id}`, { auth: true, method: 'PUT', body: JSON.stringify(body) }),
  deleteProduct: (id) => request(`/api/products/${id}`, { auth: true, method: 'DELETE' }),
  cart: (userId) => request(`/api/cart/${userId}`, { auth: true }),
  addCartItem: (userId, body) => request(`/api/cart/${userId}/items`, { auth: true, method: 'POST', body: JSON.stringify(body) }),
  updateCartItem: (id, quantity) => request(`/api/cart/items/${id}?quantity=${quantity}`, { auth: true, method: 'PUT' }),
  removeCartItem: (id) => request(`/api/cart/items/${id}`, { auth: true, method: 'DELETE' }),
  addresses: (userId) => request(`/api/addresses/user/${userId}`, { auth: true }),
  addAddress: (userId, body) => request(`/api/addresses/${userId}`, { auth: true, method: 'POST', body: JSON.stringify(body) }),
  orders: (userId) => request(`/api/orders/user/${userId}`, { auth: true }),
  allOrders: () => request('/api/orders', { auth: true }),
  checkout: (userId, addressId) => request(`/api/orders/checkout/${userId}?addressId=${addressId}`, { auth: true, method: 'POST' }),
  getInventory: (productId) => request(`/api/inventory/product/${productId}`, { auth: true }),
  addInventory: (productId, quantity) => request('/api/inventory', {
    auth: true,
    method: 'POST',
    body: JSON.stringify({ productId, quantity }),
  }),
  inventory: (productId, quantity) => request(`/api/inventory/product/${productId}?quantity=${quantity}`, { auth: true, method: 'PUT' }),
  users: () => request('/api/users', { auth: true }),
  updateUserRole: (userId, role) => request(`/api/users/${userId}/role?name=${encodeURIComponent(role)}`, { auth: true, method: 'PUT' }),
  deleteUser: (id) => request(`/api/users/${id}`, { auth: true, method: 'DELETE' }),
  createCategory: (body) => request('/api/categories', { auth: true, method: 'POST', body: JSON.stringify(body) }),
  updateCategory: (id, body) => request(`/api/categories/${id}`, { auth: true, method: 'PUT', body: JSON.stringify(body) }),
  deleteCategory: (id) => request(`/api/categories/${id}`, { auth: true, method: 'DELETE' }),
}
