// script.js

const signupUsername = document.getElementById('signup-username');
const signupEmail = document.getElementById('signup-email');
const signupPassword = document.getElementById('signup-password');
const signupBtn = document.getElementById('signup-btn');
const signupMsg = document.getElementById('signup-msg');

const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');
const loginBtn = document.getElementById('login-btn');
const loginMsg = document.getElementById('login-msg');

const chatSection = document.getElementById('chat-section');
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const logoutBtn = document.getElementById('logout-btn');

const signupSection = document.getElementById('signup-section');
const loginSection = document.getElementById('login-section');

// Backend base URL
const BASE_URL = 'http://localhost:3000/api';

// --- Helper function to set messages ---
function showMessage(element, message, success = true) {
  element.style.color = success ? 'green' : 'red';
  element.innerText = message;
}

// --- Signup ---
signupBtn.addEventListener('click', async () => {
  const username = signupUsername.value.trim();
  const email = signupEmail.value.trim();
  const password = signupPassword.value.trim();

  if (!username || !email || !password) {
    showMessage(signupMsg, 'All fields are required', false);
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });

    const data = await res.json();

    if (res.ok) {
      showMessage(signupMsg, 'Signup successful! You can now login.');
      signupUsername.value = '';
      signupEmail.value = '';
      signupPassword.value = '';
    } else {
      showMessage(signupMsg, data.message || 'Signup failed', false);
    }
  } catch (err) {
    showMessage(signupMsg, 'Server error', false);
    console.error(err);
  }
});

// --- Login ---
loginBtn.addEventListener('click', async () => {
  const email = loginEmail.value.trim();
  const password = loginPassword.value.trim();

  if (!email || !password) {
    showMessage(loginMsg, 'All fields are required', false);
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      showMessage(loginMsg, 'Login successful!');

      loginSection.style.display = 'none';
      signupSection.style.display = 'none';
      chatSection.style.display = 'block';

      loadMessages();
    } else {
      showMessage(loginMsg, data.message || 'Login failed', false);
    }
  } catch (err) {
    showMessage(loginMsg, 'Server error', false);
    console.error(err);
  }
});

// --- Load messages ---
async function loadMessages() {
  messagesDiv.innerHTML = '';

  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const res = await fetch(`${BASE_URL}/messages`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    if (res.ok) {
      data.forEach(msg => {
        const p = document.createElement('p');
        p.innerText = `${msg.username}: ${msg.text}`;
        messagesDiv.appendChild(p);
      });
    } else {
      console.error('Failed to load messages', data);
    }
  } catch (err) {
    console.error(err);
  }
}

// --- Send message ---
sendBtn.addEventListener('click', async () => {
  const text = messageInput.value.trim();
  if (!text) return;

  const token = localStorage.getItem('token');

  try {
    const res = await fetch(`${BASE_URL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ text })
    });

    const data = await res.json();
    if (res.ok) {
      const p = document.createElement('p');
      const user = JSON.parse(localStorage.getItem('user'));
      p.innerText = `${user.username}: ${text}`;
      messagesDiv.appendChild(p);
      messageInput.value = '';
    } else {
      console.error('Send message failed', data);
    }
  } catch (err) {
    console.error(err);
  }
});

// --- Logout ---
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');

  chatSection.style.display = 'none';
  loginSection.style.display = 'block';
  signupSection.style.display = 'block';
});