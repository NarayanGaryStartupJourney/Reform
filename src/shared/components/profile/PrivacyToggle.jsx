import React, { useState } from 'react';
import { authenticatedFetchJson } from '../../utils/authenticatedFetch';
import { API_ENDPOINTS } from '../../../config/api';

function PrivacyToggle({ isPublic: initialIsPublic, navigate, onUpdate }) {
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [isUpdatingPrivacy, setIsUpdatingPrivacy] = useState(false);
  const [privacyError, setPrivacyError] = useState('');

  const handleTogglePrivacy = async () => {
    setPrivacyError('');
    setIsUpdatingPrivacy(true);
    
    const newPrivacyValue = !isPublic;
    
    try {
      const data = await authenticatedFetchJson(API_ENDPOINTS.PRIVACY, {
        method: 'PATCH',
        body: JSON.stringify({
          is_public: newPrivacyValue
        })
      }, navigate);

      setIsPublic(data.is_public);
      onUpdate(data.is_public);
    } catch (err) {
      setPrivacyError(err.message || 'Failed to update privacy setting');
    } finally {
      setIsUpdatingPrivacy(false);
    }
  };

  return (
    <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--border-color)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <label style={{
          display: 'block',
          color: 'var(--text-secondary)',
          fontSize: '0.9rem',
          margin: 0
        }}>
          Profile Privacy
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ 
            fontSize: '0.85rem', 
            color: isPublic ? 'var(--text-secondary)' : 'var(--text-primary)',
            fontWeight: isPublic ? 'normal' : '600'
          }}>
            Private
          </span>
          <button
            type="button"
            onClick={handleTogglePrivacy}
            disabled={isUpdatingPrivacy}
            style={{
              position: 'relative',
              width: '48px',
              height: '24px',
              borderRadius: '12px',
              border: 'none',
              background: isPublic ? 'var(--accent-green)' : 'var(--bg-tertiary)',
              cursor: isUpdatingPrivacy ? 'not-allowed' : 'pointer',
              opacity: isUpdatingPrivacy ? 0.7 : 1,
              transition: 'background 0.2s ease',
              outline: 'none'
            }}
            onMouseEnter={(e) => {
              if (!isUpdatingPrivacy) {
                e.target.style.opacity = '0.9';
              }
            }}
            onMouseLeave={(e) => {
              if (!isUpdatingPrivacy) {
                e.target.style.opacity = '1';
              }
            }}
          >
            <span
              style={{
                position: 'absolute',
                top: '2px',
                left: isPublic ? '26px' : '2px',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: '#fff',
                transition: 'left 0.2s ease',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
              }}
            />
          </button>
          <span style={{ 
            fontSize: '0.85rem', 
            color: isPublic ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: isPublic ? '600' : 'normal'
          }}>
            Public
          </span>
        </div>
      </div>
      <p style={{ 
        margin: '8px 0 0 0', 
        fontSize: '0.85rem', 
        color: 'var(--text-secondary)' 
      }}>
        {isPublic 
          ? 'Your profile and posts are visible to everyone' 
          : 'Your profile and posts are only visible to followers'}
      </p>
      {privacyError && (
        <p style={{ color: 'var(--accent-orange)', margin: '8px 0 0 0', fontSize: '0.85rem' }}>
          {privacyError}
        </p>
      )}
    </div>
  );
}

export default PrivacyToggle;

