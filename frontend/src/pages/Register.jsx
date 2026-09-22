import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import { UserPlus, User, Mail, KeyRound, Shield } from 'lucide-react';

export const Register = ({ onSuccessRedirect }) => {
  const { register } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const newUser = await register(name, email, password, role);
      showToast(`Account created successfully! Signed in as ${newUser.name}.`, 'success');
      if (onSuccessRedirect) onSuccessRedirect(role === 'admin' ? 'admin' : 'home');
    } catch (err) {
      const msg = err.response?.data?.error || 'Registration failed. Please try again.';
      setErrorMsg(msg);
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '460px', margin: '40px auto', padding: '0 16px' }}>
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.08), 0 8px 10px -6px rgba(0,0,0,0.01)',
          border: '1px solid #e2e8f0',
          padding: '32px 28px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '12px',
              background: '#dcfce7',
              color: '#15803d',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '12px',
            }}
          >
            <UserPlus size={26} />
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#1e293b', margin: '0 0 6px' }}>
            Create New Account
          </h2>
          <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
            Register to receive signed JWT access and refresh tokens
          </p>
        </div>

        {errorMsg && (
          <div
            style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#991b1b',
              padding: '12px 14px',
              borderRadius: '8px',
              fontSize: '14px',
              marginBottom: '20px',
            }}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
              Full Name
            </label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Johnson"
                required
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 38px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                required
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 38px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <KeyRound size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                required
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 38px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
              Account Role
            </label>
            <div style={{ position: 'relative' }}>
              <Shield size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 38px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                  background: '#fff',
                  boxSizing: 'border-box',
                }}
              >
                <option value="customer">Customer (Standard User)</option>
                <option value="admin">Admin (Manage Orders & Products)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              background: '#16a34a',
              color: '#ffffff',
              fontSize: '15px',
              fontWeight: '600',
              cursor: submitting ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 12px rgba(22, 163, 74, 0.25)',
            }}
          >
            {submitting ? 'Creating Account...' : 'Register & Log In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
