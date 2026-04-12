import { useState, useEffect } from 'react';

function readStoredUser() {
  try {
    const saved = localStorage.getItem('chatifyUser');
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    localStorage.removeItem('chatifyUser');
    localStorage.removeItem('chatifyToken');
    return null;
  }
}

export default function App() {
  const [user, setUser] = useState(() => readStoredUser());
  const [token, setToken] = useState(() => localStorage.getItem('chatifyToken') || '');
  // Dev: same-origin /api via Vite proxy so httpOnly JWT cookies work. Prod: set VITE_API_URL.
  const API =
    import.meta.env.VITE_API_URL ??
    (import.meta.env.DEV ? '' : 'https://chatify-backend.onrender.com');
  const [signupData, setSignupData] = useState({ fullName: '', email: '', password: '' });
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');

  // ✅ Fetch messages from backend (JWT in httpOnly cookie)
  const fetchMessages = async () => {
    if (!user) return;
    try {
      const res = await fetch(`${API}/api/messages`, {
        credentials: 'include',
      });
      if (res.status === 401) {
        localStorage.removeItem('chatifyUser');
        localStorage.removeItem('chatifyToken');
        setUser(null);
        setToken('');
        setMessages([]);
        return;
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        setMessages(data);
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.error('Fetch messages error:', err);
      setMessages([]);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [user]);

  // ✅ Signup
  const handleSignup = async () => {
    try {
      const res = await fetch(`${API}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          fullName: signupData.fullName,
          email: signupData.email,
          password: signupData.password,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('chatifyUser', JSON.stringify(data));
        localStorage.setItem('chatifyToken', 'cookie');
        setUser(data);
        setToken('cookie');
      } else {
        alert(data.message || 'Signup failed');
      }
    } catch (err) {
      console.error('Signup error:', err);
    }
  };

  // ✅ Login
  const handleLogin = async () => {
    console.log("Login clicked");
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('chatifyUser', JSON.stringify(data));
        setUser(data);
        setToken('cookie');
        localStorage.setItem('chatifyToken', 'cookie');
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  // ✅ Send message
  const handleSendMessage = async () => {
    if (!messageInput) return;
    try {
      const res = await fetch(`${API}/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ text: messageInput }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to send message');
      }

      const senderName = user.username || user.fullName || 'You';
      setMessages((prev) => [...prev, { _id: data.message._id, username: senderName, text: messageInput, createdAt: data.message.createdAt }]);
      setMessageInput('');
    } catch (err) {
      console.error('Send message error:', err);
      alert(err.message);
    }
  };

  // ✅ Logout
  const handleLogout = async () => {
    try {
      await fetch(`${API}/api/auth/logout`, { method: 'POST', credentials: 'include' });
    } catch {
      /* ignore */
    }
    localStorage.removeItem('chatifyToken');
    localStorage.removeItem('chatifyUser');
    setToken('');
    setUser(null);
    setMessages([]);
  };

  // ✅ JSX Rendering
  if (!user) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Chatify</h1>
        <div style={{ marginBottom: '30px' }}>
          <h2>Signup</h2>
          <input
            placeholder="Full Name"
            value={signupData.fullName}
            onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
          />
          <input
            placeholder="Email"
            value={signupData.email}
            onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
          />
          <input
            placeholder="Password"
            type="password"
            value={signupData.password}
            onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
          />
          <button type="button" onClick={handleSignup}>Signup</button>
        </div>

        <div>
          <h2>Login</h2>
          <input
            placeholder="Email"
            value={loginData.email}
            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
          />
          <input
            placeholder="Password"
            type="password"
            value={loginData.password}
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
          />
          <button type="button" onClick={handleLogin}>Login</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Chatify</h1>
      <h2>Chat Room</h2>
      <p>Logged in as: <strong>{user.username || user.fullName || user.email}</strong></p>
      <button onClick={handleLogout}>Logout</button>

      <div id="messages" style={{ border: '1px solid #ccc', padding: '10px', height: '300px', overflowY: 'scroll', marginTop: '10px' }}>
        {messages.map((msg) => (
          <p key={msg._id}>
            <strong>{msg.username || 'Unknown'}:</strong> {msg.text}
          </p>
        ))}
      </div>

      <div style={{ marginTop: '10px' }}>
        <input
          placeholder="Type a message"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}











