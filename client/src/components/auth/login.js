import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const apiUrl = process.env.REACT_APP_API_URL;

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async e => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.success) {
        const { token, role } = data;

        // Lưu token vào localStorage
        localStorage.setItem('token', token);

        // Cập nhật trạng thái người dùng
        setUser({ token, role });

        // Điều hướng dựa trên role
        switch (role) {
          case 'admin':
            navigate('/admin-dashboard');
            break;
          case 'adminW':
            navigate('/warehouse-dashboard');
            break;
          case 'staff':
            navigate('/staff/dashboard');
            break;
          default:
            alert('Vai trò không hợp lệ!');
        }
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const goToRegister = () => {
    navigate('/register');
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
