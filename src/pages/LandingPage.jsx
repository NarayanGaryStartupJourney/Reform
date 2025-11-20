import React, { useState, useEffect } from 'react';
import AnalysisSkeleton from '../shared/components/AnalysisSkeleton';
import PageHeader from '../shared/components/PageHeader';
import PageContainer from '../shared/components/PageContainer';
import LoginModal from '../shared/components/LoginModal';
import { isUserLoggedIn } from '../shared/utils/authStorage';
import './DashboardAnalyze.css';

function LandingPage() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => isUserLoggedIn());

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('login') === '1') {
      setShowLoginModal(true);
      params.delete('login');
      const newSearch = params.toString();
      const newUrl = `${window.location.pathname}${newSearch ? `?${newSearch}` : ''}${window.location.hash}`;
      window.history.replaceState({}, '', newUrl);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    // Redirect to dashboard after successful login
    window.location.href = '/dashboard/index.html';
  };

  return (
    <PageContainer className="App">
      <PageHeader onLoginClick={() => setShowLoginModal(true)} />

      <div style={{ marginTop: '30px' }}>
        <AnalysisSkeleton
          showNotes={false}
          syncCardHeights={true}
          headerTitle="Upload a Session"
          headerSubtitle="Select your exercise type, upload a video, and include any coaching notes. Kick off the AI-powered analysis pipeline optimized for Reform athletes."
          onSignInClick={() => setShowLoginModal(true)}
        />
      </div>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </PageContainer>
  );
}

export default LandingPage;
