import { useEffect, useState } from 'react'
import { Notice, Empty } from './ui'

const idOf = (obj) => {
  const keys = ['id', 'userId']
  for (const key of keys) {
    if (obj?.[key] !== undefined) return obj[key]
  }
}

export function Users({ api }) {
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .users()
      .then(setUsers)
      .catch((err) => {
        setError(err.message)
        setUsers([])
      })
  }, [api])

  async function handleRoleChange(user, newRole) {
    try {
      const updated = await api.updateUser(idOf(user), {
        ...user,
        role: newRole,
      })
      setUsers(
        users.map((item) =>
          idOf(item) === idOf(user)
            ? updated || { ...item, role: newRole }
            : item
        )
      )
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="grid gap-3">
      {error && <Notice error={error} onClose={() => setError('')} />}

      {users.map((user) => (
        <UserRow
          key={idOf(user)}
          user={user}
          onRoleChange={(role) => handleRoleChange(user, role)}
        />
      ))}

      {!users.length && !error && (
        <Empty text="No users returned by the API." />
      )}
    </div>
  )
}

function UserRow({ user, onRoleChange }) {
  const displayName = user.name || user.username || `User ${user.id}`
  const currentRole = user.role?.name || user.role || 'USER'

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border border-line bg-white p-4">
      <span>
        <strong>{displayName}</strong>
        <small className="ml-3 text-[#657069]">{user.email}</small>
      </span>

      <select
        value={currentRole}
        onChange={(e) => onRoleChange(e.target.value)}
        className="rounded-md border border-line bg-white px-2 py-2 text-sm text-moss"
      >
        <option>USER</option>
        <option>ADMIN</option>
        <option>SUPER_ADMIN</option>
      </select>
    </div>
  )
}
