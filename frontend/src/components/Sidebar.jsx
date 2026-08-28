export function Sidebar({ nav, currentPage, onNavigate }) {
  return (
    <aside className="lg:sticky lg:top-6 lg:h-fit">
      <p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-moss">
        Workspace
      </p>
      
      <nav className="grid grid-cols-2 gap-1 lg:grid-cols-1">
        {nav.map(([key, label]) => (
          <button
            key={key}
            onClick={() => onNavigate(key)}
            className={`rounded-md px-3 py-2 text-left text-sm font-semibold ${
              currentPage === key
                ? 'bg-ink text-white'
                : 'text-ink hover:bg-white'
            }`}
          >
            {label}
          </button>
        ))}
      </nav>
    </aside>
  )
}
