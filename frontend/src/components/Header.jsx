export function Header({ email, role, onLogout, onHome }) {
  return (
    <header className="border-b border-line bg-paper">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5 lg:px-8">
        <button onClick={onHome} className="text-left">
          <span className="text-xs uppercase tracking-[.18em] text-moss">
            product operations
          </span>
        </button>
        
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-sm">
            <strong>{email}</strong>
            <span className="text-[#657069]"> ({role.replace('_', ' ')})</span>
          </span>
          
          <button onClick={onLogout} className="text-sm text-coral">
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
