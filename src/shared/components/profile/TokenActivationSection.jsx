import React, { useState } from 'react';
import { activateTokens } from '../../utils/tokenActivation';

function TokenActivationSection({ isTokenActivated, onActivationComplete }) {
  const [isActivatingTokens, setIsActivatingTokens] = useState(false);
  const [tokenActivationError, setTokenActivationError] = useState('');
  const [tokenActivationSuccess, setTokenActivationSuccess] = useState('');

  const handleActivateTokens = async () => {
    setTokenActivationError('');
    setTokenActivationSuccess('');
    setIsActivatingTokens(true);

    try {
      const result = await activateTokens();
      setTokenActivationSuccess(result.message);
      onActivationComplete(true);
      setTimeout(() => setTokenActivationSuccess(''), 3000);
    } catch (err) {
      setTokenActivationError(err.message || 'Failed to activate tokens');
    } finally {
      setIsActivatingTokens(false);
    }
  };

  if (isTokenActivated === true) return null;

  return (
    <div style={{
      marginTop: '20px',
      padding: '20px',
      background: 'var(--bg-tertiary)',
      borderRadius: '8px',
      border: '1px solid var(--border-color)'
    }}>
      <h4 style={{ marginTop: 0, marginBottom: '12px' }}>Activate Token System</h4>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '0.9rem' }}>
        Activate your token system to receive 10 free monthly tokens. This is a one-time activation.
      </p>

      {tokenActivationError && (
        <p style={{ color: 'var(--accent-orange)', marginBottom: '12px', fontSize: '0.9rem' }}>
          {tokenActivationError}
        </p>
      )}

      {tokenActivationSuccess && (
        <p style={{ color: 'var(--accent-green)', marginBottom: '12px', fontSize: '0.9rem' }}>
          {tokenActivationSuccess}
        </p>
      )}

      <button
        onClick={handleActivateTokens}
        disabled={isActivatingTokens}
        className="btn btn-primary"
        style={{
          opacity: isActivatingTokens ? 0.7 : 1,
          cursor: isActivatingTokens ? 'not-allowed' : 'pointer'
        }}
      >
        {isActivatingTokens ? 'Activating...' : 'Activate Token System'}
      </button>
    </div>
  );
}

export default TokenActivationSection;

