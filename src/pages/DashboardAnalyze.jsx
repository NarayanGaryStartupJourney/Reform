import React, { useState } from 'react';
import ProfileMenu from '../shared/components/ProfileMenu';
import AnalysisSkeleton from '../shared/components/AnalysisSkeleton';
import './DashboardAnalyze.css';

const DashboardAnalyze = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  return (
    <div style={{ 
      minHeight: '100vh', 
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', gap: '12px' }}>
        <h1 className="app-header" style={{ 
          fontWeight: 700,
          color: 'var(--text-primary)',
          margin: 0
        }}>
          Reform - Exercise Analyzer
        </h1>
        {isLoggedIn && <ProfileMenu />}
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
      </div>
      
      <AnalysisSkeleton
        showNotes={true}
        syncCardHeights={false}
        headerTitle="Upload a Session"
        headerSubtitle="Select your exercise type, upload a video, and include any coaching notes. Kick off the AI-powered analysis pipeline optimized for Reform athletes."
      />
    </div>
  );
};

export default DashboardAnalyze;
