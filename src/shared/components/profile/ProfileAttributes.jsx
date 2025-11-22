import React, { useState } from 'react';
import { authenticatedFetchJson } from '../../utils/authenticatedFetch';
import { API_ENDPOINTS } from '../../../config/api';

function ProfileAttributes({ userInfo, navigate, onUpdate }) {
  const [technicalLevel, setTechnicalLevel] = useState(userInfo?.technical_level || '');
  const [favoriteExercise, setFavoriteExercise] = useState(userInfo?.favorite_exercise || '');
  const [communityPreference, setCommunityPreference] = useState(userInfo?.community_preference || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');

  const handleUpdateProfile = async () => {
    setProfileError('');
    setProfileSuccess('');
    setIsUpdatingProfile(true);

    try {
      const data = await authenticatedFetchJson(API_ENDPOINTS.UPDATE_PROFILE, {
        method: 'POST',
        body: JSON.stringify({
          technical_level: technicalLevel || null,
          favorite_exercise: favoriteExercise || null,
          community_preference: communityPreference || null
        })
      }, navigate);

      setProfileSuccess('Profile updated successfully');
      onUpdate({
        ...userInfo,
        technical_level: data.technical_level,
        favorite_exercise: data.favorite_exercise,
        community_preference: data.community_preference
      });
      
      setTimeout(() => setProfileSuccess(''), 3000);
    } catch (err) {
      setProfileError(err.message || 'Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  return (
    <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--border-color)' }}>
      <h3 style={{ margin: '0 0 20px 0' }}>Profile Attributes</h3>

      {profileError && (
        <p style={{ color: 'var(--accent-orange)', marginBottom: '12px', fontSize: '0.9rem' }}>
          {profileError}
        </p>
      )}

      {profileSuccess && (
        <p style={{ color: 'var(--accent-green)', marginBottom: '12px', fontSize: '0.9rem' }}>
          {profileSuccess}
        </p>
      )}

      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          color: 'var(--text-secondary)',
          fontSize: '0.9rem',
          marginBottom: '8px'
        }}>
          Technical Level
        </label>
        <select
          value={technicalLevel}
          onChange={(e) => setTechnicalLevel(e.target.value)}
          disabled={isUpdatingProfile}
          style={{
            width: '100%',
            padding: '12px',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            color: 'var(--text-primary)',
            fontSize: '0.95rem',
            cursor: 'pointer'
          }}
        >
          <option value="">Select level...</option>
          <option value="beginner">Beginner</option>
          <option value="novice">Novice</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
          <option value="elite">Elite</option>
        </select>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          color: 'var(--text-secondary)',
          fontSize: '0.9rem',
          marginBottom: '8px'
        }}>
          Favorite Exercise
        </label>
        <input
          type="text"
          value={favoriteExercise}
          onChange={(e) => setFavoriteExercise(e.target.value)}
          placeholder="Enter favorite exercise (dropdown coming soon)"
          disabled={isUpdatingProfile}
          style={{
            width: '100%',
            padding: '12px',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            color: 'var(--text-primary)',
            fontSize: '0.95rem'
          }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          color: 'var(--text-secondary)',
          fontSize: '0.9rem',
          marginBottom: '8px'
        }}>
          Community Preference
        </label>
        <select
          value={communityPreference}
          onChange={(e) => setCommunityPreference(e.target.value)}
          disabled={isUpdatingProfile}
          style={{
            width: '100%',
            padding: '12px',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            color: 'var(--text-primary)',
            fontSize: '0.95rem',
            cursor: 'pointer'
          }}
        >
          <option value="">Select preference...</option>
          <option value="share_to_similar_levels">Share to Similar Levels</option>
          <option value="share_to_pt">Share to PT</option>
          <option value="compete_with_someone">Compete with Someone</option>
        </select>
      </div>

      <button
        onClick={handleUpdateProfile}
        disabled={isUpdatingProfile}
        className="btn btn-primary"
        style={{
          padding: '8px 16px',
          fontSize: '0.9rem',
          opacity: isUpdatingProfile ? 0.7 : 1,
          cursor: isUpdatingProfile ? 'not-allowed' : 'pointer'
        }}
      >
        {isUpdatingProfile ? 'Saving...' : 'Save Profile Attributes'}
      </button>
    </div>
  );
}

export default ProfileAttributes;

