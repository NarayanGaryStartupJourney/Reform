import React, { useState } from 'react';
import { authenticatedFetchJson } from '../../utils/authenticatedFetch';
import { API_ENDPOINTS } from '../../../config/api';

function UsernameEditor({ userInfo, navigate, onUpdate }) {
  const [username, setUsername] = useState(userInfo?.username || '');
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [usernameSuccess, setUsernameSuccess] = useState('');
  const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);

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
      await authenticatedFetchJson(API_ENDPOINTS.UPDATE_USERNAME, {
        method: 'POST',
        body: JSON.stringify({
          username: trimmedUsername
        })
      }, navigate);

      setUsernameSuccess('Username updated successfully');
      onUpdate({ ...userInfo, username: trimmedUsername });
      setIsEditingUsername(false);
      
      setTimeout(() => {
        setUsernameSuccess('');
      }, 3000);
    } catch (err) {
      setUsernameError(err.message || 'Failed to update username');
    } finally {
      setIsUpdatingUsername(false);
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          <div style={{
            padding: '12px',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            color: userInfo?.username ? 'var(--text-primary)' : 'var(--text-muted)',
            fontSize: '0.95rem',
            flex: 1
          }}>
            {userInfo?.username || 'Not set'}
          </div>
          <button
            onClick={() => setIsEditingUsername(true)}
            className="btn btn-secondary"
            style={{
              padding: '8px 16px',
              fontSize: '0.9rem',
              whiteSpace: 'nowrap'
            }}
          >
            {userInfo?.username ? 'Edit' : 'Set Username'}
          </button>
        </div>
      )}
    </div>
  );
}

export default UsernameEditor;

