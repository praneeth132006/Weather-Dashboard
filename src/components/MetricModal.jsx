/**
 * @file MetricModal.jsx
 * @description A premium, accessible modal component designed to display
 * detailed meteorological data and explanations when a weather tile is clicked.
 */

import React, { useEffect } from 'react';

/**
 * MetricModal Component
 * 
 * @param {Object} props
 * @param {Boolean} props.isOpen - Controls the visibility of the modal
 * @param {Function} props.onClose - Callback function to close the modal
 * @param {Object} props.metric - The metric data object containing title, value, and description
 */
export default function MetricModal({ isOpen, onClose, metric }) {
  
  // Prevent background scrolling when modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // If modal state is closed or metric data is missing, render nothing
  if (!isOpen || !metric) return null;

  /**
   * Handle Backdrop Click
   * Closes the modal if the user clicks outside the content area.
   */
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="modal-overlay animate-fade" 
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-content animate-scale" style={{ borderTop: metric.color ? `4px solid ${metric.color}` : '1px solid rgba(255, 255, 255, 0.1)' }}>
        {/* Close Button - Premium Minimalist Style */}
        <button 
          className="modal-close" 
          onClick={onClose}
          aria-label="Close modal"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Modal Header - Icon + Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ color: metric.color || 'var(--accent-blue)', opacity: 0.8 }}>
            {metric.icon}
          </div>
          <h2 id="modal-title" className="modal-title">{metric.title}</h2>
        </div>

        {/* Primary Value Display */}
        <div style={{ marginBottom: '32px' }}>
          <span style={{ fontSize: '3.5rem', fontWeight: 700, color: metric.color || 'var(--text-primary)', letterSpacing: '-1px' }}>
            {metric.value}
          </span>
          <p style={{ marginTop: '4px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Current Reading
          </p>
        </div>

        {/* Detailed Explanation Section */}
        <div className="modal-description">
          <h4 style={{ color: 'var(--text-primary)', marginBottom: '12px', fontSize: '1.2rem', fontWeight: 700 }}>
            Insight & Analysis
          </h4>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
            {metric.description}
          </p>
        </div>

        {/* Footer Insight */}
        {metric.insight && (
          <div style={{ marginTop: '32px', padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)' }}>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontStyle: 'italic', fontWeight: 500, lineHeight: 1.5 }}>
              <span style={{ color: metric.color || 'var(--accent-blue)', fontWeight: 700, marginRight: '8px' }}>Pro Tip:</span>
              {metric.insight}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
