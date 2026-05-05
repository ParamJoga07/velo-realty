import React, { useState } from 'react';
import API_BASE_URL from '../config';
import './AdminLogin.css';

type AdminLoginProps = {
  onLogin: (token: string) => void;
  onCancel: () => void;
};

export function AdminLogin({ onLogin, onCancel }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      const res = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData
      });

      const data = await res.json();
      if (res.ok) {
        onLogin(data.access_token);
      } else {
        setError(data.detail || 'Login failed');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-overlay animate-in">
      <div className="admin-login-card glass-morphism">
        <div className="login-header">
          <div className=""><img src="/Velo Logo Single.png" alt="Logo" height={50}/></div>
          <h2>Superadmin Access</h2>
          <p>Please enter your credentials to manage the ecosystem.</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              placeholder="superadmin"
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="••••••••"
              required 
            />
          </div>
          {error && <div className="login-error">{error}</div>}
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
          <button type="button" className="login-cancel" onClick={onCancel}>
            Back to Public Site
          </button>
        </form>
      </div>
    </div>
  );
}
