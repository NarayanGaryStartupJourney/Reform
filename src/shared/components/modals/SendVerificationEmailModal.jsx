import React, { useState } from 'react';
import { API_ENDPOINTS } from '../../../config/api';
import { getUserToken } from '../../utils/authStorage';
import '../../styles/social/CreatePostModal.css';

const SendVerificationEmailModal = ({ isOpen, onClose, onEmailSent }) => {
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleSendEmail = async () => {
    const token = getUserToken();
    if (!token) {
      setError('Not authenticated');
      return;
    }

    setIsSending(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(API_ENDPOINTS.SEND_VERIFICATION_EMAIL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to send verification email');
      }

      setSuccess('Verification email sent! Please check your inbox.');
      
      // Call callback if provided
      if (onEmailSent) {
        onEmailSent();
      }
      
      // Auto-close after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to send verification email');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Verify Your Email</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div style={{ padding: '24px' }}>
          <p style={{ 
            margin: '0 0 20px 0', 
            color: 'var(--text-secondary)',
            lineHeight: '1.6'
          }}>
            We'll send a verification link to your email address. Click the link in the email to verify your account.
          </p>

          {error && (
            <div className="form-error">
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div style={{
              marginBottom: '16px',
              padding: '12px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid var(--accent-green)',
              borderRadius: '8px'
            }}>
              <p style={{ margin: 0, color: 'var(--accent-green)', fontSize: '0.9rem' }}>
                {success}
              </p>
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              style={{
                padding: '8px 16px',
                fontSize: '0.9rem'
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSendEmail}
              disabled={isSending || success}
              className="btn btn-primary"
              style={{
                padding: '8px 16px',
                fontSize: '0.9rem',
                opacity: (isSending || success) ? 0.7 : 1,
                cursor: (isSending || success) ? 'not-allowed' : 'pointer'
              }}
            >
              {isSending ? 'Sending...' : success ? 'Sent!' : 'Send Verification Email'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendVerificationEmailModal;

