import React, { useState } from 'react';
import { authenticatedFetchJson } from '../../utils/authenticatedFetch';
import { API_ENDPOINTS } from '../../../config/api';

function PasswordChangeSection({ navigate }) {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

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
      await authenticatedFetchJson(API_ENDPOINTS.CHANGE_PASSWORD, {
        method: 'POST',
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword
        })
      }, navigate);

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

  const handleCancel = () => {
    setShowChangePassword(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setPasswordSuccess('');
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <label style={{
          display: 'block',
          color: 'var(--text-secondary)',
          fontSize: '0.9rem',
          margin: 0
        }}>
          Password
        </label>
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
              onClick={handleCancel}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default PasswordChangeSection;

