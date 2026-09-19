import LoginForm from '../components/auth/LoginForm'
import brandLogo from '../assets/G&T.png'

function Login({ user, onLogin, onLogout }) {
  return (
    <section className="auth-page">
      <div className="auth-art" aria-hidden="true">
        <span className="auth-art-sun" />
        <span className="auth-art-line auth-art-line-one" />
        <span className="auth-art-line auth-art-line-two" />
        <img className="auth-art-logo" src={brandLogo} alt="G&T Collections" />
      </div>
      <LoginForm user={user} onLogin={onLogin} onLogout={onLogout} />
    </section>
  )
}

export default Login
