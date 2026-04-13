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
  const [contacts, setContacts] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  // ✅ Fetch contacts
  const fetchContacts = async () => {
    if (!user) return;
    try {
      const res = await fetch(`${API}/api/messages/contacts`, {
        credentials: 'include',
      });
      if (res.status === 401) {
        handleLogout();
        return;
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        setContacts(data);
      }
    } catch (err) {
      console.error('Fetch contacts error:', err);
    }
  };

  // ✅ Fetch messages with selected user
  const fetchMessages = async () => {
    if (!user || !selectedUser) return;
    try {
      const res = await fetch(`${API}/api/messages/${selectedUser._id}`, {
        credentials: 'include',
      });
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
    fetchContacts();
  }, [user]);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages();
    } else {
      setMessages([]);
    }
  }, [selectedUser]);

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
    if (!messageInput || !selectedUser) return;
    try {
      const res = await fetch(`${API}/api/messages/send/${selectedUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ text: messageInput }),
      });

      // If we attempt to parse non-JSON, it throws an error. So check content type:
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        throw new Error(`Expected JSON but got HTML/Text. Backend responded with: \n${text.substring(0, 100)}...`);
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to send message');
      }

      // Append successfully sent message
      setMessages((prev) => [...prev, data]);
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
    setSelectedUser(null);
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
    <div style={{ padding: '20px', display: 'flex', gap: '20px' }}>
      {/* Sidebar: Contacts */}
      <div style={{ width: '250px', borderRight: '1px solid #ccc', paddingRight: '10px' }}>
        <h1>Chatify</h1>
        <p>Logged in as: <br /><strong>{user.username || user.fullName || user.email}</strong></p>
        <button onClick={handleLogout}>Logout</button>

        <h3 style={{ marginTop: '20px' }}>Contacts</h3>
        {contacts.length === 0 && <p>No contacts found.</p>}
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {contacts.map((contact) => (
            <li
              key={contact._id}
              onClick={() => setSelectedUser(contact)}
              style={{
                padding: '10px',
                borderBottom: '1px solid #eee',
                cursor: 'pointer',
                backgroundColor: selectedUser?._id === contact._id ? '#eee' : 'transparent'
              }}
            >
              {contact.fullName || contact.username || contact.email}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Chat Area */}
      <div style={{ flex: 1 }}>
        {selectedUser ? (
          <>
            <h2>Chatting with {selectedUser.fullName || selectedUser.username}</h2>
            <div id="messages" style={{ border: '1px solid #ccc', padding: '10px', height: '400px', overflowY: 'scroll', marginTop: '10px' }}>
              {messages.map((msg) => {
                const isMe = msg.senderId === user._id;
                return (
                  <div key={msg._id} style={{ textAlign: isMe ? 'right' : 'left', marginBottom: '10px' }}>
                    <span style={{
                      display: 'inline-block',
                      background: isMe ? '#007bff' : '#e9ecef',
                      color: isMe ? 'white' : 'black',
                      padding: '8px 12px',
                      borderRadius: '15px'
                    }}>
                      {msg.text}
                    </span>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: '10px', display: 'flex' }}>
              <input
                style={{ flex: 1, padding: '10px' }}
                placeholder="Type a message"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button style={{ padding: '10px 20px', marginLeft: '10px' }} onClick={handleSendMessage}>Send</button>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <h2>Select a user to start chatting</h2>
          </div>
        )}
      </div>
    </div>
  );
}











