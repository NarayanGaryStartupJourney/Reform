import React from 'react';
import ProfileMenu from './ProfileMenu';
import { isUserLoggedIn } from '../utils/authStorage';

/**
 * Common page header component used across multiple pages
 * Displays title, ProfileMenu (if logged in), and Dashboard/Login button
 * 
 * @param {Object} props
 * @param {Function} props.onLoginClick - Callback when Login button is clicked
 */
const PageHeader = ({ onLoginClick }) => {
  const isLoggedIn = isUserLoggedIn();

  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', gap: '12px' }}>
      <h1 className="app-header" style={{ 
        fontWeight: 700,
        color: 'var(--text-primary)',
        margin: 0
      }}>
        Reform - Exercise Analyzer
      </h1>
      {isLoggedIn && <ProfileMenu />}
      {isLoggedIn ? (
        <a
          href="/dashboard/index.html"
          style={{
            marginLeft: 'auto',
            padding: '8px 16px',
            borderRadius: '999px',
            border: '1px solid var(--border-color)',
            backgroundColor: 'transparent',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            fontWeight: 600,
            textDecoration: 'none'
          }}
        >
          <span role="img" aria-label="dashboard" style={{ fontSize: '1.1rem' }}>📊</span>
          Dashboard
        </a>
      ) : (
        <button
          onClick={onLoginClick}
          style={{
            marginLeft: 'auto',
            padding: '8px 16px',
            borderRadius: '999px',
            border: '1px solid var(--border-color)',
            backgroundColor: 'transparent',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          <span role="img" aria-label="login" style={{ fontSize: '1.1rem' }}>🔐</span>
          Login
        </button>
      )}
    </div>
  );
};

export default PageHeader;

