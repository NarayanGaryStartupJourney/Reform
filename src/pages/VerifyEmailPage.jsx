import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';
import { getUserToken, isUserLoggedIn } from '../shared/utils/authStorage';
import PageContainer from '../shared/components/layout/PageContainer';
import PageHeader from '../shared/components/layout/PageHeader';
import '../shared/styles/AnalysisSkeleton.css';

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('checking'); // 'checking', 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const token = searchParams.get('token');

  useEffect(() => {
    // Auto-verify if token is in URL
    if (token) {
      verifyEmail(token);
    } else {
      // Check verification status if no token
      checkVerificationStatus();
    }
  }, [token]);

  const verifyEmail = async (verificationToken) => {
    setStatus('verifying');
    setMessage('Verifying your email...');

    try {
      const response = await fetch(
        `${API_ENDPOINTS.VERIFY_EMAIL}?token=${encodeURIComponent(verificationToken)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Verification failed');
      }

      setStatus('success');
      setMessage('Email verified successfully! Redirecting to your profile...');
      
      // Redirect to profile page after 2 seconds
      setTimeout(() => {
        navigate('/profile?verified=true');
      }, 2000);
    } catch (err) {
      setStatus('error');
      setMessage(err.message || 'Failed to verify email. The token may be invalid or expired.');
    }
  };

  const checkVerificationStatus = async () => {
    const authToken = getUserToken();
    if (!authToken) {
      setStatus('error');
      setMessage('Please log in to verify your email.');
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.VERIFICATION_STATUS, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to check verification status');
      }

      const data = await response.json();
      
      if (data.is_verified) {
        setStatus('success');
        setMessage('Your email is already verified!');
        setTimeout(() => {
          navigate('/profile');
        }, 2000);
      } else {
        setStatus('checking');
        setMessage('');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Failed to check verification status.');
    }
  };

  const handleSendEmail = async () => {
    const authToken = getUserToken();
    if (!authToken) {
      navigate('/?login=1');
      return;
    }

    setIsSending(true);
    setMessage('');

    try {
      const response = await fetch(API_ENDPOINTS.SEND_VERIFICATION_EMAIL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to send verification email');
      }

      setMessage('Verification email sent! Please check your inbox.');
    } catch (err) {
      setMessage(err.message || 'Failed to send verification email');
    } finally {
      setIsSending(false);
    }
  };

  if (!isUserLoggedIn()) {
    return (
      <PageContainer>
        <PageHeader onLoginClick={() => navigate('/?login=1')} />
        <div className="skeleton-shell">
          <div className="skeleton-card" style={{ textAlign: 'center', padding: '40px' }}>
            <h2>Please log in</h2>
            <p>You need to be logged in to verify your email.</p>
            <button 
              className="btn btn-primary" 
              onClick={() => navigate('/?login=1')}
              style={{ marginTop: '20px' }}
            >
              Log In
            </button>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader onLoginClick={() => navigate('/?login=1')} />
      <div className="skeleton-shell">
        <header className="skeleton-header">
          <div>
            <p className="skeleton-eyebrow">Account</p>
            <h1 className="skeleton-title">Verify Email</h1>
            <p className="skeleton-subtitle">Verify your email address to unlock all features</p>
          </div>
        </header>

        <div className="skeleton-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          {status === 'checking' && (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <h3>Email Verification</h3>
              <p style={{ margin: '20px 0', color: 'var(--text-secondary)' }}>
                Click the verification link in your email, or request a new verification email below.
              </p>
              <button
                onClick={handleSendEmail}
                disabled={isSending}
                className="btn btn-primary"
                style={{ marginTop: '20px' }}
              >
                {isSending ? 'Sending...' : 'Send Verification Email'}
              </button>
              {message && (
                <p style={{ 
                  marginTop: '20px', 
                  color: message.includes('sent') ? 'var(--accent-green)' : 'var(--accent-orange)',
                  fontSize: '0.9rem'
                }}>
                  {message}
                </p>
              )}
            </div>
          )}

          {status === 'verifying' && (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
              <h3>Verifying...</h3>
              <p style={{ margin: '20px 0', color: 'var(--text-secondary)' }}>
                {message}
              </p>
            </div>
          )}

          {status === 'success' && (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>✅</div>
              <h3 style={{ color: 'var(--accent-green)' }}>Email Verified!</h3>
              <p style={{ margin: '20px 0', color: 'var(--text-secondary)' }}>
                {message}
              </p>
            </div>
          )}

          {status === 'error' && (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>❌</div>
              <h3 style={{ color: 'var(--accent-orange)' }}>Verification Failed</h3>
              <p style={{ margin: '20px 0', color: 'var(--text-secondary)' }}>
                {message}
              </p>
              <button
                onClick={handleSendEmail}
                disabled={isSending}
                className="btn btn-primary"
                style={{ marginTop: '20px' }}
              >
                {isSending ? 'Sending...' : 'Request New Verification Email'}
              </button>
              {message && message.includes('sent') && (
                <p style={{ 
                  marginTop: '20px', 
                  color: 'var(--accent-green)',
                  fontSize: '0.9rem'
                }}>
                  {message}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default VerifyEmailPage;

