/**
 * @file ErrorState.jsx
 * @description Presentational component for handling application-level 
 * errors such as 404 (City Not Found) or Connection failures.
 */

import React from 'react';

/**
 * ErrorState Component
 * 
 * @param {Object} props
 * @param {String} props.title - The primary error message
 * @param {String} props.message - Descriptive secondary text
 * @param {Function} props.onRetry - Callback to reset error state or retry action
 */
export default function ErrorState({ title, message, onRetry }) {
  /**
   * Handle Dismiss
   * Resets the error state in the parent App component.
   */
  const handleDismiss = () => {
    onRetry();
  };

  return (
    <div 
      className="animate-fade" 
      style={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '60vh',
        padding: '24px'
      }}
    >
      <div 
        className="glass-tile" 
        style={{ 
          textAlign: 'center', 
          maxWidth: '440px', 
          padding: '48px 32px',
          border: '1px solid rgba(244, 63, 94, 0.2)', /* Subtle rose border for error */
          boxShadow: '0 0 60px rgba(244, 63, 94, 0.1)'
        }}
      >
        {/* Error Icon - High Vis Alert Circle */}
        <div style={{ marginBottom: '24px', color: 'var(--accent-rose)' }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        {/* Primary Message */}
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '12px', letterSpacing: '-0.5px' }}>
          {title}
        </h2>

        {/* Informative Description */}
        <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', lineHeight: 1.6, fontSize: '1rem', fontWeight: 500 }}>
          {message}
        </p>

        {/* Intent Dismissal / Retry - High Contrast Action */}
        <button 
          className="search-bar" 
          onClick={handleDismiss}
          style={{ 
            height: '48px', 
            width: '100%', 
            justifyContent: 'center', 
            background: 'rgba(255, 255, 255, 0.05)', 
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'var(--text-primary)',
            fontSize: '1rem',
            fontWeight: 700
          }}
        >
          Dismiss Error
        </button>
      </div>
    </div>
  );
}
