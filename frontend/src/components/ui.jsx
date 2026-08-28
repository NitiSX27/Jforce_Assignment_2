export function Button({ children, secondary, ...props }) {
  const baseStyle = 'inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50'
  const variant = secondary
    ? 'border border-line bg-white text-ink hover:border-moss'
    : 'bg-moss text-white hover:bg-ink'
  
  return (
    <button className={`${baseStyle} ${variant}`} {...props}>
      {children}
    </button>
  )
}

export function Field({ label, ...props }) {
  return (
    <label className="grid gap-1 text-sm font-semibold text-ink">
      {label}
      <input
        className="rounded-md border border-line bg-white px-3 py-2 font-normal outline-none focus:border-moss"
        {...props}
      />
    </label>
  )
}

export function Notice({ error, onClose }) {
  if (!error) return null

  return (
    <div className="mb-5 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
      <span className="flex-1">{error}</span>
      <button onClick={onClose}>Close</button>
    </div>
  )
}

export function Empty({ text }) {
  return (
    <div className="border border-dashed border-line bg-white p-10 text-center text-sm text-[#657069]">
      {text}
    </div>
  )
}
