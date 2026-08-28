import { useState } from 'react'
import { Button, Field, Empty } from './ui'

const idOf = (obj) => {
  const keys = ['id', 'addressId']
  for (const key of keys) {
    if (obj?.[key] !== undefined) return obj[key]
  }
}

export function Addresses({ addresses, onAdd }) {
  const [form, setForm] = useState({
    addressLine: '',
    city: '',
    state: '',
    postalCode: '',
  })

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    onAdd(form)
    setForm({
      addressLine: '',
      city: '',
      state: '',
      postalCode: '',
    })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <section className="grid gap-3">
        {addresses.map((address) => (
          <AddressCard key={idOf(address)} address={address} />
        ))}
        {!addresses.length && <Empty text="No saved addresses yet." />}
      </section>

      <form className="h-fit border border-line bg-white p-5" onSubmit={handleSubmit}>
        <h2 className="mb-4 font-display text-2xl">Add address</h2>

        <div className="grid gap-3">
          <Field
            label="Address"
            name="addressLine"
            value={form.addressLine}
            onChange={handleChange}
            required
          />

          <Field
            label="City"
            name="city"
            value={form.city}
            onChange={handleChange}
            required
          />

          <Field
            label="State"
            name="state"
            value={form.state}
            onChange={handleChange}
            required
          />

          <Field
            label="Postal code"
            name="postalCode"
            value={form.postalCode}
            onChange={handleChange}
            required
          />

          <Button>Save address</Button>
        </div>
      </form>
    </div>
  )
}

function AddressCard({ address }) {
  const fullAddress = [address.city, address.state, address.postalCode]
    .filter(Boolean)
    .join(', ')

  return (
    <div className="border border-line bg-white p-4">
      <strong>{address.addressLine || address.street}</strong>
      <p className="text-sm text-[#657069]">{fullAddress}</p>
    </div>
  )
}
