import { useState } from 'react'
import { Button, Empty } from './ui'

const money = (value) => `₹${Number(value || 0).toFixed(2)}`
const idOf = (obj) => {
  const keys = ['id', 'productId', 'categoryId']
  for (const key of keys) {
    if (obj?.[key] !== undefined) return obj[key]
  }
}

export function Catalogue({ products, categories, onAdd }) {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const visible = products.filter((p) => {
    if (p.enabled === false) return false
    if (selectedCategory === 'all') return true
    const productCatId = String(p.category?.id || p.categoryId)
    return productCatId === selectedCategory
  })

  return (
    <section>
      <div className="mb-5 flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`rounded-full px-4 py-2 text-sm ${
            selectedCategory === 'all'
              ? 'bg-coral text-white'
              : 'bg-white text-ink'
          }`}
        >
          All products
        </button>
        
        {categories.map((category) => (
          <button
            key={idOf(category)}
            onClick={() => setSelectedCategory(String(idOf(category)))}
            className={`rounded-full px-4 py-2 text-sm ${
              selectedCategory === String(idOf(category))
                ? 'bg-coral text-white'
                : 'bg-white text-ink'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {visible.map((product) => (
          <ProductCard
            key={idOf(product)}
            product={product}
            onAdd={() => onAdd(idOf(product))}
          />
        ))}
      </div>

      {!visible.length && (
        <Empty text="No enabled products in this category." />
      )}
    </section>
  )
}

function ProductCard({ product, onAdd }) {
  return (
    <article className="border border-line bg-white p-5">
      <div className="mb-8 flex h-28 items-end justify-between bg-[#e8eee6] p-4">
        <span className="font-display text-4xl text-moss">
          {product.name?.[0] || 'P'}
        </span>
        <span className="text-xs uppercase tracking-wider text-moss">
          {product.categoryName || product.category?.name || 'General'}
        </span>
      </div>

      <h2 className="font-display text-2xl">{product.name}</h2>
      
      <p className="my-2 min-h-10 text-sm text-[#657069]">
        {product.description || 'A considered addition to your everyday kit.'}
      </p>

      <div className="mt-5 flex items-center justify-between">
        <strong>{money(product.price)}</strong>
        <Button onClick={onAdd}>Add to cart</Button>
      </div>
    </article>
  )
}
