import { useState, useEffect } from 'react';

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('chatifyUser');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('chatifyToken') || '');
  const [signupData, setSignupData] = useState({ fullName: '', email: '', password: '' });
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');

  const API = import.meta.env.VITE_API_URL || 'https://chatify-backend.onrender.com';
  // ✅ Fetch messages from backend
  const fetchMessages = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API}/api/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log(data);
      // Check if it's an array
      if (Array.isArray(data)) {
        setMessages(data);
      } else {
        console.error("Not an array:", data);
        setMessages([]); // fallback
      }
    } catch (err) {
      console.error('Fetch messages error:', err);
      setMessages([]); // ensuring array fallback on error too
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [token]);

  // ✅ Signup
  const handleSignup = async () => {
    try {
      const res = await fetch(`${API}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData),
      });
      const data = await res.json();
      alert(data.message);
    } catch (err) {
      console.error('Signup error:', err);
    }
  };

  // ✅ Login
  const handleLogin = async () => {
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('chatifyToken', data.token);
        localStorage.setItem('chatifyUser', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
      } else {
        alert(data.message);
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
          Authorization: `Bearer ${token}`,
        },
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
  const handleLogout = () => {
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
          <button onClick={handleSignup}>Signup</button>
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
          <button onClick={handleLogin}>Login</button>
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
