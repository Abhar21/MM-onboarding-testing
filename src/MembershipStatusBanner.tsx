import React from 'react';
import './MembershipStatusBanner.css';

interface MembershipStatusBannerProps {
  status: 'active' | 'paused' | 'cancelled_active' | 'cancelled_expired';
  onAction: () => void;
  onDismiss?: () => void;
  isDashboard?: boolean;
}

const MembershipStatusBanner: React.FC<MembershipStatusBannerProps> = ({ 
  status, 
  onAction, 
  onDismiss, 
  isDashboard = false 
}) => {
  if (status === 'active' || status === 'cancelled_expired') return null;

  const isPaused = status === 'paused';

  return (
    <div className={`membership-status-banner-v72 ${isDashboard ? 'dashboard-banner' : 'modal-banner-v72'}`}>
      <div className="banner-left-v72">
        <span className="banner-icon-v72">⚠️</span>
        <div className="banner-content-v72">
          <span className="banner-message-v72">
            {isPaused 
              ? "Your membership is scheduled to pause for 1 month" 
              : "Your membership will be cancelled at the end of your billing period"}
          </span>
          <span className="banner-subtext-v72">
            {isPaused 
              ? "Starts on 20 May • Resumes on 20 June" 
              : "Active until 28 May 2026"}
          </span>
        </div>
      </div>

      <div className="banner-actions-v72">
        <button className="banner-btn-primary-v72" onClick={onAction}>
          {isPaused ? "Resume Now" : "Reactivate Plan"}
        </button>


        {onDismiss && (
          <button className="banner-close-btn-v72" onClick={onDismiss} aria-label="Dismiss">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12"></path>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default MembershipStatusBanner;
