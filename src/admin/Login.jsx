import { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { Lock, LogIn } from 'lucide-react'
import { useAuth } from './AuthContext'
import { ErrorBox, Spinner } from './ui'
import Logo from '../components/Logo'

export default function Login() {
  const { loading, session, isAdmin, signIn, signOut } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (loading) return <Spinner />
  if (session && isAdmin) return <Navigate to="/admin" replace />

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true); setError('')
    const { error } = await signIn(email.trim(), password)
    if (error) setError('Incorrect email or password.')
    setBusy(false)
  }

  return (
    <div className="hero-bg grid min-h-screen place-items-center p-5">
      <div className="glass w-full max-w-sm rounded-3xl p-8 shadow-2xl shadow-brand/10">
        <Logo />
        <h1 className="mt-6 flex items-center gap-2 text-2xl font-extrabold"><Lock size={20} className="text-brand" />Admin sign in</h1>
        {session && !isAdmin ? (
          <div className="mt-5 space-y-4">
            <ErrorBox msg="This account is not an admin. Add it to the admin_users table in Supabase, then sign in again." />
            <button onClick={signOut} className="btn-ghost w-full">Sign out</button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-5 space-y-4">
            <label className="block text-sm font-medium">Email<input type="email" required autoComplete="username" className="field mt-1.5" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
            <label className="block text-sm font-medium">Password<input type="password" required autoComplete="current-password" className="field mt-1.5" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
            <ErrorBox msg={error} />
            <button disabled={busy} className="btn-primary w-full disabled:opacity-60">{busy ? 'Signing in…' : 'Sign in'}<LogIn size={16} /></button>
          </form>
        )}
        <Link to="/" className="mt-6 block text-center text-sm text-muted hover:text-brand">Back to website</Link>
      </div>
    </div>
  )
}
