/**
 * AnalysisSkeleton Usage Examples
 * 
 * This file demonstrates how to use the AnalysisSkeleton component
 * in different scenarios. DO NOT import this file - it's for reference only.
 */

import AnalysisSkeleton from './AnalysisSkeleton';

// Example 1: Basic usage (like DashboardAnalyze page)
function DashboardAnalyzeExample() {
  return (
    <div>
      <h1>Reform - Exercise Analyzer</h1>
      <AnalysisSkeleton
        showNotes={true}
        syncCardHeights={false}
      />
    </div>
  );
}

// Example 2: Landing page usage (with height sync)
function LandingPageExample() {
  return (
    <div>
      <h1>Reform - Exercise Analyzer</h1>
      <AnalysisSkeleton
        showNotes={false}
        syncCardHeights={true}
        headerTitle="Upload a Session"
        headerSubtitle="Select your exercise type, upload a video, and include any coaching notes. Kick off the AI-powered analysis pipeline optimized for Reform athletes."
        onAnalysisComplete={(results) => {
          console.log('Analysis complete!', results);
        }}
      />
    </div>
  );
}

// Example 3: Custom header
function CustomHeaderExample() {
  return (
    <AnalysisSkeleton
      showNotes={true}
      syncCardHeights={false}
      headerTitle="New Workout Analysis"
      headerSubtitle="Upload your exercise video to get detailed form analysis and feedback."
    />
  );
}

// Example 4: With callback
function WithCallbackExample() {
  const handleAnalysisComplete = (results) => {
    // Save to database, show notification, etc.
    console.log('Analysis results:', results);
    // You can also access results via the component's internal state
    // if you need to lift state up, you'd need to modify the component
  };

  return (
    <AnalysisSkeleton
      showNotes={false}
      syncCardHeights={true}
      onAnalysisComplete={handleAnalysisComplete}
    />
  );
}

