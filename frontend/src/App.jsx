import { useEffect, useState } from 'react'
import { api } from './api'

export default function App() {
  const [role, setRole] = useState(null)
  const [userId, setUserId] = useState(null)
  const [email, setEmail] = useState(() => localStorage.getItem('market-email') || '')
  const [password, setPassword] = useState(() => localStorage.getItem('market-password') || '')
  const [page, setPage] = useState('catalogue')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [cart, setCart] = useState(null)
  const [addresses, setAddresses] = useState([])
  const [orders, setOrders] = useState([])

  useEffect(() => {
    api.setCredentials(email, password)
  }, [email, password])

  useEffect(() => {
    if (role && userId) loadData()
  }, [userId, role])

  useEffect(() => {
    const savedEmail = localStorage.getItem('market-email')
    const savedPassword = localStorage.getItem('market-password')
    if (savedEmail && savedPassword && !role) {
      handleLogin(savedEmail, savedPassword)
    }
  }, [])

  async function handleLogin(e, p) {
    setLoading(true)
    setError('')
    try {
      setEmail(e)
      setPassword(p)
      const user = await api.getMe()
      if (!user || !user.userId) {
        throw new Error('Invalid response: missing user ID')
      }
      setUserId(user.userId)
      setRole(user.role)
      localStorage.setItem('market-email', e)
      localStorage.setItem('market-password', p)
    } catch (err) {
      setError(err.status === 401 ? 'Invalid credentials' : err.message)
      api.setCredentials('', '')
    } finally {
      setLoading(false)
    }
  }

  async function loadData() {
    try {
      setLoading(true)
      const prods = role !== 'USER' ? await api.adminProducts() : await api.products()
      const cats = await api.categories()
      const cartData = await api.cart(userId)
      const addrs = await api.addresses(userId)
      const ords = await api.orders(userId)

      setProducts(prods || [])
      setCategories(cats || [])
      setCart(cartData)
      setAddresses(addrs || [])
      setOrders(ords || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleLogout() {
    setRole(null)
    setUserId(null)
    setEmail('')
    setPassword('')
    localStorage.removeItem('market-email')
    localStorage.removeItem('market-password')
  }

  if (!role) {
    return (
      <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px', border: '1px solid #ccc' }}>
        <h2>Login</h2>
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        <form onSubmit={(e) => { e.preventDefault(); handleLogin(email, password) }}>
          <div style={{ marginBottom: '10px' }}>
            <label>Email:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '5px', marginTop: '5px' }} />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Password:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '5px', marginTop: '5px' }} />
          </div>
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px' }}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    )
  }

  const isAdmin = role !== 'USER'
  const isSuper = role === 'SUPER_ADMIN'

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
        <h1>Store</h1>
        <div>
          <span>{email} ({role})</span>
          <button onClick={handleLogout} style={{ marginLeft: '10px', padding: '5px 10px' }}>Logout</button>
        </div>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

      <div style={{ display: 'flex', gap: '20px' }}>
        <aside style={{ width: '150px' }}>
          <NavButton current={page} value="catalogue" onClick={() => setPage('catalogue')}>Catalogue</NavButton>
          <NavButton current={page} value="cart" onClick={() => setPage('cart')}>Cart</NavButton>
          <NavButton current={page} value="addresses" onClick={() => setPage('addresses')}>Addresses</NavButton>
          <NavButton current={page} value="orders" onClick={() => setPage('orders')}>Orders</NavButton>
          {isAdmin && (
            <>
              <NavButton current={page} value="admin-products" onClick={() => setPage('admin-products')}>Products</NavButton>
              <NavButton current={page} value="inventory" onClick={() => setPage('inventory')}>Inventory</NavButton>
            </>
          )}
          {isSuper && (
            <>
              <NavButton current={page} value="users" onClick={() => setPage('users')}>Users</NavButton>
              <NavButton current={page} value="categories" onClick={() => setPage('categories')}>Categories</NavButton>
              <NavButton current={page} value="all-orders" onClick={() => setPage('all-orders')}>All Orders</NavButton>
            </>
          )}
        </aside>

        <main style={{ flex: 1 }}>
          {page === 'catalogue' && <Catalogue products={products} categories={categories} userId={userId} onRefresh={loadData} />}
          {page === 'cart' && <CartPage cart={cart} addresses={addresses} userId={userId} onRefresh={loadData} />}
          {page === 'addresses' && <AddressesPage addresses={addresses} userId={userId} onRefresh={loadData} />}
          {page === 'orders' && <OrdersPage orders={orders} />}
          {page === 'admin-products' && <AdminProductsPage products={products} categories={categories} onRefresh={loadData} />}
          {page === 'inventory' && <InventoryPage products={products} onRefresh={loadData} />}
          {page === 'categories' && <CategoriesPage categories={categories} onRefresh={loadData} />}
          {page === 'users' && <UsersPage />}
          {page === 'all-orders' && <AllOrdersPage />}
        </main>
      </div>
    </div>
  )
}

function NavButton({ current, value, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'block',
        width: '100%',
        padding: '8px',
        marginBottom: '5px',
        background: current === value ? '#333' : '#fff',
        color: current === value ? '#fff' : '#000',
        border: '1px solid #ccc',
        cursor: 'pointer'
      }}
    >
      {children}
    </button>
  )
}

function Catalogue({ products, categories, userId, onRefresh }) {
  const [addingId, setAddingId] = useState(null)
  const [categoryId, setCategoryId] = useState('')

  async function addToCart(productId) {
    try {
      setAddingId(productId)
      console.log('Adding to cart:', { userId, productId })
      await api.addCartItem(userId, { productId, quantity: 1 })
      console.log('Added successfully')
      await onRefresh()
      alert('Added to cart!')
    } catch (err) {
      console.error('Add to cart error:', err)
      alert('Error: ' + err.message)
    } finally {
      setAddingId(null)
    }
  }

  return (
    <div>
      <h2>Products</h2>
      <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} style={{ marginBottom: '15px', padding: '5px' }}>
        <option value="">All categories</option>
        {categories.map(category => (
          <option key={category.id} value={category.id}>{category.name}</option>
        ))}
      </select>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
        {products.filter(product => product.inventoryQuantity > 0 && (!categoryId || String(product.categoryId) === categoryId)).map(p => (
          <div key={p.id} style={{ border: '1px solid #ccc', padding: '10px' }}>
            <h3>{p.name}</h3>
            <p>₹{p.price}</p>
            <button
              onClick={() => addToCart(p.id)}
              disabled={addingId === p.id}
              style={{ padding: '5px 10px', width: '100%', cursor: addingId === p.id ? 'not-allowed' : 'pointer' }}
            >
              {addingId === p.id ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function CartPage({ cart, addresses, userId, onRefresh }) {
  const items = Array.isArray(cart) ? cart : (cart?.items || cart?.cartItems || [])
  const [selectedAddress, setSelectedAddress] = useState('')

  async function updateQty(itemId, qty) {
    try {
      await api.updateCartItem(itemId, qty)
      await onRefresh()
    } catch (err) {
      alert(err.message)
    }
  }

  async function removeItem(itemId) {
    try {
      await api.removeCartItem(itemId)
      await onRefresh()
    } catch (err) {
      alert(err.message)
    }
  }

  async function checkout() {
    if (!selectedAddress) return alert('Select an address')
    try {
      await api.checkout(userId, selectedAddress)
      alert('Order placed!')
      await onRefresh()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div>
      <h2>Cart</h2>
      {items.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        items.map(item => (
          <div key={item.id} style={{ display: 'flex', gap: '10px', padding: '10px', borderBottom: '1px solid #ccc', alignItems: 'center' }}>
            <span>{item.product?.name || item.productName}</span>
            <span>₹{item.product?.price ?? item.productPrice ?? item.price ?? 0}</span>
            <button onClick={() => updateQty(item.id, Math.max(1, item.quantity - 1))}>-</button>
            <span>{item.quantity}</span>
            <button onClick={() => updateQty(item.id, item.quantity + 1)}>+</button>
            <button onClick={() => removeItem(item.id)} style={{ marginLeft: 'auto' }}>Remove</button>
          </div>
        ))
      )}
      {items.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <label>Address: <select value={selectedAddress} onChange={(e) => setSelectedAddress(e.target.value)}>
            <option value="">Select</option>
            {addresses.map(a => <option key={a.id} value={a.id}>{a.addressLine || a.street}</option>)}
          </select></label>
          <button onClick={checkout} style={{ marginLeft: '10px', padding: '5px 10px' }}>Checkout</button>
        </div>
      )}
    </div>
  )
}

function AddressesPage({ addresses, userId, onRefresh }) {
  const [form, setForm] = useState({ addressLine: '', city: '', state: '', country: '', postalCode: '' })

  async function addAddress(e) {
    e.preventDefault()
    try {
      await api.addAddress(userId, form)
      setForm({ addressLine: '', city: '', state: '', country: '', postalCode: '' })
      await onRefresh()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div>
      <h2>Addresses</h2>
      <div>
        {addresses.map(a => (
          <div key={a.id} style={{ padding: '10px', border: '1px solid #ccc', marginBottom: '5px' }}>
            {a.addressLine || a.street} - {a.city}, {a.state}
          </div>
        ))}
      </div>
      <form onSubmit={addAddress} style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px' }}>
        <h3>Add Address</h3>
        <input placeholder="Address" value={form.addressLine} onChange={(e) => setForm({ ...form, addressLine: e.target.value })} required style={{ width: '100%', marginBottom: '5px', padding: '5px' }} />
        <input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required style={{ width: '100%', marginBottom: '5px', padding: '5px' }} />
        <input placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} required style={{ width: '100%', marginBottom: '5px', padding: '5px' }} />
        <input placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} required style={{ width: '100%', marginBottom: '5px', padding: '5px' }} />
        <input placeholder="Postal Code" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} required style={{ width: '100%', marginBottom: '5px', padding: '5px' }} />
        <button type="submit" style={{ width: '100%', padding: '8px' }}>Save</button>
      </form>
    </div>
  )
}

function OrdersPage({ orders }) {
  return (
    <div>
      <h2>My Orders</h2>
      {orders.map(o => (
        <div key={o.id} style={{ padding: '10px', border: '1px solid #ccc', marginBottom: '5px' }}>
          Order #{o.id} - {o.status || 'PLACED'} - ₹{o.total || o.totalAmount}
        </div>
      ))}
    </div>
  )
}

function AdminProductsPage({ products, categories, onRefresh }) {
  const [form, setForm] = useState({ name: '', description: '', price: '', enabled: true, categoryId: '' })
  const [editing, setEditing] = useState(null)

  async function save(e) {
    e.preventDefault()
    try {
      const body = { ...form, price: Number(form.price), categoryId: form.categoryId ? Number(form.categoryId) : null }
      if (editing) {
        await api.updateProduct(editing, body)
      } else {
        await api.createProduct(body)
      }
      setForm({ name: '', description: '', price: '', enabled: true, categoryId: '' })
      setEditing(null)
      await onRefresh()
    } catch (err) {
      alert(err.message)
    }
  }

  async function deleteProduct(id) {
    if (!confirm('Delete?')) return
    try {
      await api.deleteProduct(id)
      await onRefresh()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div>
      <h2>Products</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #ccc' }}>
            <th style={{ textAlign: 'left', padding: '10px' }}>Name</th>
            <th style={{ textAlign: 'left', padding: '10px' }}>Price</th>
            <th style={{ textAlign: 'left', padding: '10px' }}>Category</th>
            <th style={{ textAlign: 'left', padding: '10px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id} style={{ borderBottom: '1px solid #ccc' }}>
              <td style={{ padding: '10px' }}>{p.name}</td>
              <td style={{ padding: '10px' }}>₹{p.price}</td>
              <td style={{ padding: '10px' }}>{p.categoryName || 'Uncategorized'}</td>
              <td style={{ padding: '10px' }}>
                <button onClick={() => { setEditing(p.id); setForm({ name: p.name, description: p.description || '', price: p.price, enabled: p.enabled !== false, categoryId: p.categoryId || '' }) }}>Edit</button>
                <button onClick={() => deleteProduct(p.id)} style={{ marginLeft: '5px' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <form onSubmit={save} style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px' }}>
        <h3>{editing ? 'Edit' : 'New'} Product</h3>
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required style={{ width: '100%', marginBottom: '5px', padding: '5px' }} />
        <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ width: '100%', marginBottom: '5px', padding: '5px' }} />
        <input type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required style={{ width: '100%', marginBottom: '5px', padding: '5px' }} />
        <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} style={{ width: '100%', marginBottom: '5px', padding: '5px' }}>
          <option value="">No category</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
        <button type="submit" style={{ width: '100%', padding: '8px' }}>Save</button>
      </form>
    </div>
  )
}

function InventoryPage({ products, onRefresh }) {
  const [quantities, setQuantities] = useState({})

  useEffect(() => {
    let active = true
    Promise.all(products.map(async (product) => {
      try {
        const inventory = await api.getInventory(product.id)
        return [product.id, inventory.quantity]
      } catch (err) {
        if (err.status === 404) return [product.id, 0]
        throw err
      }
    })).then((entries) => {
      if (active) setQuantities(Object.fromEntries(entries))
    }).catch((err) => alert(err.message))

    return () => { active = false }
  }, [products])

  async function updateInventory(productId, quantity) {
    try {
      const value = Number(quantity)
      try {
        await api.getInventory(productId)
        await api.inventory(productId, value)
      } catch (err) {
        if (err.status !== 404) throw err
        await api.addInventory(productId, value)
      }
      setQuantities(current => ({ ...current, [productId]: value }))
      await onRefresh()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div>
      <h2>Inventory</h2>
      {products.map(p => (
        <div key={p.id} style={{ display: 'flex', gap: '10px', padding: '10px', borderBottom: '1px solid #ccc', alignItems: 'center' }}>
          <span>{p.name}</span>
          <span>Stock: {quantities[p.id] ?? 0}</span>
          <input type="number" min="0" value={quantities[p.id] ?? 0} onChange={(e) => setQuantities(current => ({ ...current, [p.id]: e.target.value }))} onBlur={(e) => updateInventory(p.id, e.target.value)} style={{ width: '80px', padding: '5px' }} />
        </div>
      ))}
    </div>
  )
}

function CategoriesPage({ categories, onRefresh }) {
  const [name, setName] = useState('')

  async function addCategory(e) {
    e.preventDefault()
    try {
      await api.createCategory({ name })
      setName('')
      await onRefresh()
    } catch (err) {
      alert(err.message)
    }
  }

  async function deleteCategory(id) {
    if (!confirm('Delete?')) return
    try {
      await api.deleteCategory(id)
      await onRefresh()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div>
      <h2>Categories</h2>
      <div>
        {categories.map(c => (
          <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #ccc' }}>
            <span>{c.name}</span>
            <button onClick={() => deleteCategory(c.id)}>Delete</button>
          </div>
        ))}
      </div>
      <form onSubmit={addCategory} style={{ marginTop: '20px' }}>
        <input placeholder="Category name" value={name} onChange={(e) => setName(e.target.value)} required style={{ padding: '5px' }} />
        <button type="submit" style={{ marginLeft: '5px', padding: '5px 10px' }}>Add</button>
      </form>
    </div>
  )
}

function UsersPage() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    api.users().then(setUsers).catch(() => setUsers([]))
  }, [])

  async function changeRole(userId, role) {
    try {
      await api.updateUserRole(userId, role)
      const updated = await api.users()
      setUsers(updated)
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div>
      <h2>Users</h2>
      {users.map(u => (
        <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #ccc', alignItems: 'center' }}>
          <span>{u.email}</span>
          <select value={u.role?.name || u.role || 'USER'} onChange={(e) => changeRole(u.id, e.target.value)} style={{ padding: '5px' }}>
            <option>USER</option>
            <option>ADMIN</option>
            <option>SUPER_ADMIN</option>
          </select>
        </div>
      ))}
    </div>
  )
}

function AllOrdersPage() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    api.allOrders().then(setOrders).catch(() => setOrders([]))
  }, [])

  return (
    <div>
      <h2>All Orders</h2>
      {orders.map(o => (
        <div key={o.id} style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
          Order #{o.id} - {o.status} - ₹{o.totalAmount ?? o.total ?? 0}
        </div>
      ))}
    </div>
  )
}
