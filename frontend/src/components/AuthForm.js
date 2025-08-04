// frontend/src/components/AuthForm.js
import React, { useState } from 'react';

export default function AuthForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');

  const register = async () => {
    const res = await fetch('http://localhost:8000/register', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    setMessage(data.msg || data.detail);
  };

  const login = async () => {
    const res = await fetch('http://localhost:8000/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.access_token) {
      setToken(data.access_token);
      setMessage('Logged in!');
    } else {
      setMessage(data.detail);
    }
  };

  const accessProtected = async () => {
    const res = await fetch('http://localhost:8000/protected', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setMessage(data.msg || data.detail);
  };

  return (
    <div>
      <h2>Auth Form</h2>
      <input placeholder="Username" onChange={(e) => setUsername(e.target.value)} /><br />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} /><br />
      <button onClick={register}>Register</button>
      <button onClick={login}>Login</button>
      <button onClick={accessProtected}>Access Protected</button>
      <p>{message}</p>
    </div>
  );
}