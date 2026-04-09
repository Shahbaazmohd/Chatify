const API_URL = import.meta.env.VITE_API_URL || 'https://chatify-backend.onrender.com/api';

const handleLogin = async () => {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    });

    const data = await res.json();
    console.log(data);

    if (res.ok) {
      // 🔐 Save token
      localStorage.setItem("token", data.token);

      alert("Login successful");
    } else {
      alert(data.message);
    }

  } catch (error) {
    console.log(error);
  }
};