import { useState } from 'react'

function LoginForm({ user, loginNotice, onLogin, onLogout }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (user) {
    return (
      <div className="auth-card auth-logged-in">
        <span className="auth-mark">G&T</span>
        <p className="eyebrow">My Profile</p>
        <h2>{user.fullName}</h2>
        <p className="auth-muted">You are signed in as {user.email}.</p>
        {user.role && <p className="auth-muted">Account type: {user.role}</p>}
        <button type="button" className="primary-button wide" onClick={onLogout}>Log out</button>
      </div>
    )
  }

  const handleLogin = async () => {
    setError('')
    setLoading(true)
    try {
      await onLogin()
    } catch (loginError) {
      console.error(loginError)
      setError('Login failed. Check the browser console (F12) for details.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-card">
      <span className="auth-mark">G&T</span>
      <p className="eyebrow">G&T Collections</p>
      <h2>Welcome back</h2>
      <p className="auth-muted">Sign in with Google to access your account, favorites, and orders.</p>
      {loginNotice && <p className="auth-muted" role="status">{loginNotice}</p>}
      {error && <p className="auth-error" role="alert">{error}</p>}
      <button type="button" className="primary-button wide" onClick={handleLogin} disabled={loading}>
        {loading ? 'Signing in…' : 'Continue with Google'}
      </button>
    </div>
  )
}

export default LoginForm
