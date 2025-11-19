import React, { useState, useEffect, useRef } from 'react';

const ProfileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleLogout = () => {
    // Clear all auth-related data
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
    // Close the menu before redirecting
    setIsOpen(false);
    // Redirect to landing page
    window.location.href = '/';
  };

  return (
    <div 
      ref={menuRef}
      className="profile-menu"
      style={{ position: 'relative' }}
    >
      <button
        className="profile-trigger"
        type="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(255, 255, 255, 0.04)',
          padding: '8px 14px',
          border: '1px solid var(--border-color)',
          borderRadius: '999px',
          color: 'var(--text-primary)',
          cursor: 'pointer',
          fontSize: '0.9rem',
          fontWeight: 500,
          transition: 'all 0.2s ease'
        }}
      >
        <span style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          background: 'var(--accent-green)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: '0.75rem',
          fontWeight: 600
        }}>RA</span>
        <span style={{ fontSize: '0.75rem' }}>▾</span>
      </button>
      {isOpen && (
        <div
          className="menu-list"
          role="menu"
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            background: 'rgba(5, 8, 18, 0.95)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            minWidth: '160px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            pointerEvents: 'auto'
          }}
        >
          <a
            href="/profile"
            role="menuitem"
            style={{
              textDecoration: 'none',
              color: 'var(--text-primary)',
              padding: '10px 12px',
              borderRadius: '10px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: '0.9rem',
              textAlign: 'left',
              transition: 'background 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.05)'}
            onMouseLeave={(e) => e.target.style.background = 'transparent'}
          >
            Profile
          </a>
          <a
            href="#"
            role="menuitem"
            style={{
              textDecoration: 'none',
              color: 'var(--text-primary)',
              padding: '10px 12px',
              borderRadius: '10px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: '0.9rem',
              textAlign: 'left',
              transition: 'background 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.05)'}
            onMouseLeave={(e) => e.target.style.background = 'transparent'}
          >
            History
          </a>
          <a
            href="#"
            role="menuitem"
            style={{
              textDecoration: 'none',
              color: 'var(--text-primary)',
              padding: '10px 12px',
              borderRadius: '10px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: '0.9rem',
              textAlign: 'left',
              transition: 'background 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.05)'}
            onMouseLeave={(e) => e.target.style.background = 'transparent'}
          >
            Followers
          </a>
          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            style={{
              color: 'var(--accent-orange)',
              padding: '10px 12px',
              borderRadius: '10px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: '0.9rem',
              textAlign: 'left',
              transition: 'background 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.05)'}
            onMouseLeave={(e) => e.target.style.background = 'transparent'}
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;

