import { useState } from 'react'
import { Button, Field } from './ui'

const money = (value) => `₹${Number(value || 0).toFixed(2)}`
const idOf = (obj) => {
  const keys = ['id', 'productId']
  for (const key of keys) {
    if (obj?.[key] !== undefined) return obj[key]
  }
}

export function AdminProducts({ products, categories, onRefresh, api }) {
  const initialForm = {
    name: '',
    description: '',
    price: '',
    enabled: true,
    categoryId: '',
  }

  const [form, setForm] = useState(initialForm)
  const [editing, setEditing] = useState(null)

  async function handleSave(e) {
    e.preventDefault()
    const body = {
      ...form,
      price: Number(form.price),
      categoryId: form.categoryId ? Number(form.categoryId) : null,
    }

    try {
      if (editing) {
        await api.updateProduct(editing, body)
      } else {
        await api.createProduct(body)
      }
      setForm(initialForm)
      setEditing(null)
      onRefresh()
    } catch (err) {
      alert(err.message)
    }
  }

  function handleEdit(product) {
    setEditing(idOf(product))
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      enabled: product.enabled !== false,
      categoryId: product.category?.id || product.categoryId || '',
    })
  }

  async function handleDelete(productId) {
    await api.deleteProduct(productId)
    onRefresh()
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
      <section className="overflow-x-auto border border-line bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-wider text-moss">
            <tr>
              <th className="p-4">Product</th>
              <th className="p-4">Price</th>
              <th className="p-4">Status</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={idOf(product)} className="border-b border-line">
                <td className="p-4 font-semibold">{product.name}</td>
                <td className="p-4">{money(product.price)}</td>
                <td className="p-4">
                  {product.enabled === false ? 'Disabled' : 'Enabled'}
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleEdit(product)}
                    className="px-2 py-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(idOf(product))}
                    className="px-2 py-1 text-coral"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <form onSubmit={handleSave} className="h-fit border border-line bg-white p-5">
        <h2 className="mb-4 font-display text-2xl">
          {editing ? 'Edit product' : 'New product'}
        </h2>

        <div className="grid gap-3">
          <Field
            label="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <Field
            label="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <Field
            label="Price"
            type="number"
            step="0.01"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />

          <label className="grid gap-1 text-sm font-semibold text-ink">
            Category
            <select
              value={form.categoryId}
              onChange={(e) =>
                setForm({ ...form, categoryId: e.target.value })
              }
              className="rounded-md border border-line bg-white px-3 py-2 font-normal"
            >
              <option value="">General</option>
              {categories.map((cat) => (
                <option key={idOf(cat)} value={idOf(cat)}>
                  {cat.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-2 text-sm font-semibold">
            <input
              type="checkbox"
              checked={form.enabled}
              onChange={(e) =>
                setForm({ ...form, enabled: e.target.checked })
              }
            />
            Enabled
          </label>

          <Button>{editing ? 'Update' : 'Create'}</Button>
          {editing && (
            <Button
              secondary
              onClick={() => {
                setEditing(null)
                setForm(initialForm)
              }}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
