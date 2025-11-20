import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';
import { getUserToken } from '../shared/utils/authStorage';
import PageHeader from '../shared/components/PageHeader';
import PageContainer from '../shared/components/PageContainer';
import '../shared/components/AnalysisSkeletonV2.css';
import './DashboardPage.css';

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
  const [username, setUsername] = useState('');
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [usernameSuccess, setUsernameSuccess] = useState('');
  const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const token = getUserToken();
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
      setUsername(data.username || '');
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
      const token = getUserToken();
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

  const handleUpdateUsername = async () => {
    setUsernameError('');
    setUsernameSuccess('');
    
    const trimmedUsername = username.trim().toLowerCase();
    
    if (!trimmedUsername) {
      setUsernameError('Username cannot be empty');
      return;
    }
    
    setIsUpdatingUsername(true);
    
    try {
      const token = getUserToken();
      const response = await fetch(API_ENDPOINTS.UPDATE_USERNAME, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: trimmedUsername
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to update username');
      }

      setUsernameSuccess('Username updated successfully');
      setUserInfo({ ...userInfo, username: trimmedUsername });
      setIsEditingUsername(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setUsernameSuccess('');
      }, 3000);
    } catch (err) {
      setUsernameError(err.message || 'Failed to update username');
    } finally {
      setIsUpdatingUsername(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <PageHeader onLoginClick={() => navigate('/?login=1')} />
        <div className="skeleton-v2-shell">
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 0'
          }}>
            <p style={{ color: 'var(--text-primary)' }}>Loading...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (error && !userInfo) {
    return (
      <PageContainer>
        <PageHeader onLoginClick={() => navigate('/?login=1')} />
        <div className="skeleton-v2-shell">
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 0'
          }}>
            <div className="skeleton-v2-card" style={{ maxWidth: '500px', width: '100%' }}>
              <p style={{ color: 'var(--accent-orange)', marginBottom: '16px' }}>{error}</p>
              <button
                onClick={() => navigate('/')}
                className="btn btn-secondary"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader onLoginClick={() => navigate('/?login=1')} />
      
      <div className="skeleton-v2-shell">
        <header className="skeleton-v2-header">
          <div>
            <p className="skeleton-v2-eyebrow">User Profile</p>
            <h1 className="skeleton-v2-title">{userInfo?.full_name || 'Profile'}</h1>
          </div>
        </header>

        <div className="skeleton-v2-grid">
          <article className="skeleton-v2-card">
            <h3>Account Information</h3>

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
          </article>

          <article className="skeleton-v2-card">
            <h3 style={{ margin: '0 0 20px 0' }}>Account Settings</h3>
            
            {/* Username Section */}
            <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--border-color)' }}>
              <label style={{
                display: 'block',
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
                marginBottom: '8px'
              }}>
                Username
              </label>
              {isEditingUsername ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isUpdatingUsername}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                      fontSize: '0.95rem'
                    }}
                    placeholder="Enter username"
                  />
                  {usernameError && (
                    <p style={{ color: 'var(--accent-orange)', margin: 0, fontSize: '0.85rem' }}>
                      {usernameError}
                    </p>
                  )}
                  {usernameSuccess && (
                    <p style={{ color: 'var(--accent-green)', margin: 0, fontSize: '0.85rem' }}>
                      {usernameSuccess}
                    </p>
                  )}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={handleUpdateUsername}
                      disabled={isUpdatingUsername}
                      className="btn btn-primary"
                      style={{
                        padding: '8px 16px',
                        fontSize: '0.9rem',
                        opacity: isUpdatingUsername ? 0.7 : 1,
                        cursor: isUpdatingUsername ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {isUpdatingUsername ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingUsername(false);
                        setUsername(userInfo?.username || '');
                        setUsernameError('');
                        setUsernameSuccess('');
                      }}
                      disabled={isUpdatingUsername}
                      className="btn btn-secondary"
                      style={{
                        padding: '8px 16px',
                        fontSize: '0.9rem'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{
                    padding: '12px',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: userInfo?.username ? 'var(--text-primary)' : 'var(--text-muted)',
                    fontSize: '0.95rem',
                    flex: 1,
                    marginRight: '12px'
                  }}>
                    {userInfo?.username || 'Not set'}
                  </div>
                  <button
                    onClick={() => setIsEditingUsername(true)}
                    className="btn btn-secondary"
                    style={{
                      padding: '8px 16px',
                      fontSize: '0.9rem'
                    }}
                  >
                    {userInfo?.username ? 'Edit' : 'Set Username'}
                  </button>
                </div>
              )}
            </div>

            {/* Password Section */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0 }}>Password</h3>
                {!showChangePassword && (
                  <button
                    onClick={() => setShowChangePassword(true)}
                    className="btn btn-secondary"
                    style={{
                      padding: '8px 16px',
                      fontSize: '0.9rem'
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
                className="btn btn-primary"
                style={{
                  opacity: isChangingPassword ? 0.7 : 1,
                  cursor: isChangingPassword ? 'not-allowed' : 'pointer'
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
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
            </div>
          </article>
        </div>
      </div>
    </PageContainer>
  );
}

export default ProfilePage;

