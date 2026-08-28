import { useState } from 'react'
import { Button, Field, Notice } from './ui'

export function Login({ onLogin, error, loading }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    console.log('Login attempt with:', { email, password })
    onLogin(email, password)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper">
      <div className="w-full max-w-sm border border-line bg-white p-8">
        <h1 className="mb-6 font-display text-3xl">Login</h1>
        
        {error && <Notice error={`❌ ${error}`} onClose={() => {}} />}
        
        <form onSubmit={handleSubmit} className="grid gap-4">
          <Field
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            required
          />
          
          <Field
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            required
          />
          
          <Button disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        
        <p className="mt-4 border-t border-line pt-4 text-xs text-[#657069]">
          💡 Open browser console (F12) to see login details
        </p>
      </div>
    </div>
  )
}
