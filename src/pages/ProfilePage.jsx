import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';

function ProfilePage() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/?login=1');
        return;
      }

      const response = await fetch(API_ENDPOINTS.ME, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('isLoggedIn');
          navigate('/?login=1');
          return;
        }
        throw new Error('Failed to fetch user info');
      }

      const data = await response.json();
      setUserInfo(data);
    } catch (err) {
      setError(err.message || 'Failed to load profile information');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    // Validation
    if (!currentPassword) {
      setPasswordError('Please enter your current password');
      return;
    }

    if (!newPassword) {
      setPasswordError('Please enter a new password');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    setIsChangingPassword(true);

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(API_ENDPOINTS.CHANGE_PASSWORD, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to change password');
      }

      setPasswordSuccess('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowChangePassword(false);
    } catch (err) {
      setPasswordError(err.message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)'
      }}>
        <p style={{ color: 'var(--text-primary)' }}>Loading...</p>
      </div>
    );
  }

  if (error && !userInfo) {
    return (
      <div style={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)',
        padding: '20px'
      }}>
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '24px',
          maxWidth: '500px',
          width: '100%'
        }}>
          <p style={{ color: 'var(--accent-orange)', marginBottom: '16px' }}>{error}</p>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              cursor: 'pointer'
            }}
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto',
      background: 'var(--bg-primary)'
    }}>
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            background: 'transparent',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            marginBottom: '20px'
          }}
        >
          ← Back
        </button>
        <h1 style={{ 
          color: 'var(--text-primary)',
          margin: '0 0 30px 0'
        }}>
          Profile
        </h1>
      </div>

      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '32px',
        marginBottom: '20px'
      }}>
        <h2 style={{ 
          color: 'var(--text-primary)',
          marginTop: 0,
          marginBottom: '24px'
        }}>
          Account Information
        </h2>

        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            marginBottom: '8px'
          }}>
            Full Name
          </label>
          <div style={{
            padding: '12px',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            color: 'var(--text-primary)'
          }}>
            {userInfo?.full_name}
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            marginBottom: '8px'
          }}>
            Email
          </label>
          <div style={{
            padding: '12px',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            color: 'var(--text-primary)'
          }}>
            {userInfo?.email}
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            marginBottom: '8px'
          }}>
            Account Status
          </label>
          <div style={{
            padding: '12px',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            color: 'var(--text-primary)'
          }}>
            {userInfo?.is_verified ? '✓ Verified' : '⚠ Not Verified'}
          </div>
        </div>
      </div>

      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '32px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ 
            color: 'var(--text-primary)',
            margin: 0
          }}>
            Password
          </h2>
          {!showChangePassword && (
            <button
              onClick={() => setShowChangePassword(true)}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'var(--score-excellent)',
                color: '#fff',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Change Password
            </button>
          )}
        </div>

        {showChangePassword && (
          <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{
                display: 'block',
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
                marginBottom: '8px'
              }}>
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
                marginBottom: '8px'
              }}>
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
                marginBottom: '8px'
              }}>
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>

            {passwordError && (
              <p style={{ color: 'var(--accent-orange)', margin: 0, fontSize: '0.9rem' }}>
                {passwordError}
              </p>
            )}

            {passwordSuccess && (
              <p style={{ color: 'var(--accent-green)', margin: 0, fontSize: '0.9rem' }}>
                {passwordSuccess}
              </p>
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="submit"
                disabled={isChangingPassword}
                style={{
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  background: isChangingPassword ? 'var(--bg-tertiary)' : 'var(--score-excellent)',
                  color: '#fff',
                  cursor: isChangingPassword ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                  opacity: isChangingPassword ? 0.7 : 1
                }}
              >
                {isChangingPassword ? 'Changing...' : 'Update Password'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowChangePassword(false);
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                  setPasswordError('');
                  setPasswordSuccess('');
                }}
                style={{
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: 'transparent',
                  color: 'var(--text-primary)',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;

