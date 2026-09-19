import { useState } from 'react'

function LoginForm({ user, onLogin, onLogout }) {
  const [mode, setMode] = useState('login')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')

  if (user) {
    return (
      <div className="auth-card auth-logged-in">
        <span className="auth-mark">G&T</span>
        <p className="eyebrow">Welcome back</p>
        <h2>{user.fullName}</h2>
        <p className="auth-muted">You are signed in as {user.email}.</p>
        <button type="button" className="primary-button wide" onClick={onLogout}>Log out</button>
      </div>
    )
  }

  const isRegistering = mode === 'register'

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
    setError('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (form.name.trim().length < 2) {
      setError('Please enter your full name.')
      return
    }

    if (!form.email.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    onLogin({
      fullName: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      rememberMe,
    })
  }

  return (
    <div className="auth-card">
      <span className="auth-mark">G&T</span>
      <p className="eyebrow">G&T Collections</p>
      <h2>{isRegistering ? 'Create your account' : 'Welcome back'}</h2>
      <p className="auth-muted">
        {isRegistering ? 'Save your edits and keep every favorite close.' : 'Sign in to access your favorites and orders.'}
      </p>

      <div className="auth-tabs" role="tablist" aria-label="Authentication mode">
        <button type="button" className={!isRegistering ? 'active' : ''} onClick={() => setMode('login')}>Log in</button>
        <button type="button" className={isRegistering ? 'active' : ''} onClick={() => setMode('register')}>Create account</button>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Full name
          <input value={form.name} onChange={(event) => updateField('name', event.target.value)} placeholder="Your full name" autoComplete="name" />
        </label>
        <label>
          Email address
          <input type="email" value={form.email} onChange={(event) => updateField('email', event.target.value)} placeholder="you@example.com" autoComplete="email" />
        </label>
        <label>
          Password
          <span className="password-field">
            <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={(event) => updateField('password', event.target.value)} placeholder="At least 6 characters" autoComplete={isRegistering ? 'new-password' : 'current-password'} />
            <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </span>
        </label>

        {!isRegistering && (
          <label className="checkbox-label">
            <input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} />
            Remember me
          </label>
        )}

        {error && <p className="auth-error" role="alert">{error}</p>}
        <button type="submit" className="primary-button wide">{isRegistering ? 'Create account' : 'Log in'}</button>
      </form>
    </div>
  )
}

export default LoginForm
