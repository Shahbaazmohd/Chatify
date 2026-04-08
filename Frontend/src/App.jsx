import { useState } from 'react'
import './App.css'

const API_URL = 'http://localhost:3000/api/auth'

function App() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleSignup = async () => {
    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      })

      const data = await res.json()
      console.log(data)
      setMessage(data.message)
    } catch (err) {
      console.error(err)
      setMessage('Signup failed. Check console for details.')
    }
  }

  const handleLogin = async () => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()
      console.log(data)
      setMessage(data.message)

      if (data.token) {
        localStorage.setItem('token', data.token)
      }
    } catch (err) {
      console.error(err)
      setMessage('Login failed. Check console for details.')
    }
  }

  return (
    <div className="app-container">
      <h1>Signup / Login</h1>
      <div className="auth-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="button-row">
          <button onClick={handleSignup}>Signup</button>
          <button onClick={handleLogin}>Login</button>
        </div>
        {message && <p className="status-message">{message}</p>}
      </div>
    </div>
  )
}

export default App
