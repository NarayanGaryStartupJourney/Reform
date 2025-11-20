import React from 'react';
import AnalysisSkeleton from '../shared/components/AnalysisSkeleton';
import PageHeader from '../shared/components/PageHeader';
import PageContainer from '../shared/components/PageContainer';
import './DashboardAnalyze.css';

const DashboardAnalyze = () => {
  return (
    <PageContainer>
      <PageHeader onLoginClick={() => window.location.href = '/?login=1'} />
      
      <AnalysisSkeleton
        showNotes={true}
        syncCardHeights={false}
        headerTitle="Upload a Session"
        headerSubtitle="Select your exercise type, upload a video, and include any coaching notes. Kick off the AI-powered analysis pipeline optimized for Reform athletes."
      />
    </PageContainer>
  );
};

export default DashboardAnalyze;
