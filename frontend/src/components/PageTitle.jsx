import { Button } from './ui'

export function PageTitle({ title, role, onRefresh }) {
  return (
    <div className="mb-7 flex items-end justify-between gap-4">
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-[.2em] text-coral">
          {role.replace('_', ' ')}
        </p>
        <h1 className="font-display text-4xl">{title}</h1>
      </div>
      <Button secondary onClick={onRefresh}>
        Refresh
      </Button>
    </div>
  )
}
