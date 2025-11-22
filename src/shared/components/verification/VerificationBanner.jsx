import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../../../config/api';
import { getUserToken } from '../../utils/authStorage';
import './VerificationBanner.css';

const VerificationBanner = ({ onVerificationComplete }) => {
  const navigate = useNavigate();
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSendEmail = async () => {
    const token = getUserToken();
    if (!token) {
      navigate('/?login=1');
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
      setTimeout(() => setSuccess(''), 5000);
      
      // Refresh user info if callback provided
      if (onVerificationComplete) {
        onVerificationComplete();
      }
    } catch (err) {
      setError(err.message || 'Failed to send verification email');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="verification-banner">
      <div className="verification-banner-content">
        <div className="verification-banner-icon">✉️</div>
        <div className="verification-banner-text">
          <strong>Verify your email address</strong>
          <p>Please verify your email to use social features like posting, liking, and commenting.</p>
        </div>
        <div className="verification-banner-actions">
          <button
            onClick={handleSendEmail}
            disabled={isSending}
            className="btn btn-primary"
          >
            {isSending ? 'Sending...' : 'Send Verification Email'}
          </button>
        </div>
      </div>
      
      {error && (
        <div className="verification-banner-error">
          {error}
        </div>
      )}
      
      {success && (
        <div className="verification-banner-success">
          {success}
        </div>
      )}
    </div>
  );
};

export default VerificationBanner;

