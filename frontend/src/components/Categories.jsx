import { useState } from 'react'
import { Button } from './ui'

const idOf = (obj) => {
  const keys = ['id', 'categoryId']
  for (const key of keys) {
    if (obj?.[key] !== undefined) return obj[key]
  }
}

export function Categories({ categories, onRefresh, api }) {
  const [name, setName] = useState('')

  async function handleCreate(e) {
    e.preventDefault()
    await api.createCategory({ name })
    setName('')
    onRefresh()
  }

  async function handleDelete(categoryId) {
    await api.deleteCategory(categoryId)
    onRefresh()
  }

  return (
    <div className="grid gap-3">
      <form onSubmit={handleCreate} className="flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category name"
          className="rounded-md border border-line bg-white px-3 py-2"
          required
        />
        <Button>Add category</Button>
      </form>

      {categories.map((category) => (
        <div
          key={idOf(category)}
          className="flex items-center justify-between border border-line bg-white p-4"
        >
          <span className="font-semibold">{category.name}</span>
          <button
            onClick={() => handleDelete(idOf(category))}
            className="text-coral"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  )
}
