import React, { useState } from 'react';
import './ManageMembership.css';

interface ManageMembershipProps {
// ... (props stay the same)
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  status: MembershipStatus;
  setStatus: (status: MembershipStatus) => void;
}

type MembershipStatus = 'active' | 'paused' | 'cancelled_active' | 'cancelled_expired';

const ManageMembershipModal: React.FC<ManageMembershipProps> = ({ isOpen, onClose, onUpgrade, status, setStatus }) => {
  const [view, setView] = useState<'overview' | 'cancel_confirm' | 'cancel_success'>('overview');

  // Reset view to overview whenever the modal is opened
  React.useEffect(() => {
    if (isOpen) {
      setView('overview');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const renderOverview = () => {
    switch (status) {
      case 'paused':
        return renderPausedState();
      case 'cancelled_active':
        return renderCancelledState(true);
      case 'cancelled_expired':
        return renderCancelledState(false);
      default:
        return renderActiveState();
    }
  };

  const renderActiveState = () => (
    <div className="membership-overview-v6">
      <div className="membership-plan-card">
        <div className="plan-card-header">
          <span className="plan-type-tag">Pro Plan</span>
          <span className="status-badge active">Active</span>
        </div>
        <div className="plan-main-info">
          <h3>Growth Plan</h3>
          <div className="plan-pricing-row">
            <span className="plan-price">₹499</span>
            <span className="plan-period">/ month</span>
          </div>
        </div>
        <div className="plan-card-footer">
          <div className="billing-info">
            <span className="billing-date">Next billing on <strong>28 May 2026</strong></span>
          </div>
          <div className="auto-renew-note">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17L4 12"></path></svg>
            Your plan will renew automatically unless cancelled
          </div>
        </div>
      </div>

      <div className="membership-actions-section">
        <div className="action-item-v6" onClick={onUpgrade}>
          <div className="action-left-v6">
            <span className="action-title-v6">Change Plan</span>
            <span className="action-subtext-v6">Switch to a plan that suits your business needs</span>
          </div>
          <span className="action-btn-v6">Upgrade or Downgrade</span>
        </div>


        <div className="action-item-v6 danger" onClick={() => setView('cancel_confirm')}>
          <div className="action-left-v6">
            <span className="action-title-v6">Cancel Plan</span>
            <span className="action-subtext-v6">Stop auto-renewal of your subscription</span>
          </div>
          <span className="action-btn-v6">Cancel Plan</span>
        </div>
      </div>
    </div>
  );

  const renderPausedState = () => (
    <div className="membership-overview-v6">
      <div className="membership-plan-card paused">
        <div className="plan-card-header">
          <span className="plan-type-tag">Pro Plan</span>
          <span className="status-badge paused">Paused</span>
        </div>
        <div className="plan-main-info">
          <h3>Growth Plan</h3>
          <p style={{ color: '#92400e', fontWeight: 600, margin: '8px 0' }}>Your membership is currently paused</p>
        </div>
        <div className="plan-card-footer" style={{ borderColor: '#fde68a' }}>
          <div style={{ fontSize: '0.85rem', color: '#92400e' }}>
            <div>Paused on: <strong>20 May 2026</strong></div>
            <div>Resumes on: <strong>20 June 2026</strong></div>
          </div>
        </div>
      </div>

      <div className="membership-actions-section">
        <div className="action-item-v6" style={{ borderColor: '#bae6fd' }} onClick={() => setStatus('active')}>
          <div className="action-left-v6">
            <span className="action-title-v6">Resume Now</span>
            <span className="action-subtext-v6">Reactivate your membership immediately and continue receiving bookings</span>
          </div>
          <span className="action-btn-v6 primary">Resume Now</span>
        </div>

        <div className="action-item-v6 danger" onClick={() => setView('cancel_confirm')}>
          <div className="action-left-v6">
            <span className="action-title-v6">Cancel Plan</span>
            <span className="action-subtext-v6">Cancel your membership instead of resuming</span>
          </div>
          <span className="action-btn-v6">Cancel Plan</span>
        </div>
      </div>

      <div className="impact-warning-box" style={{ background: '#fffbeb', borderColor: '#fde68a', marginTop: '24px' }}>
        <h5 style={{ color: '#92400e' }}>During pause:</h5>
        <ul className="impact-list">
          <li style={{ color: '#b45309' }}>You are not receiving new bookings</li>
          <li style={{ color: '#b45309' }}>Your profile visibility is reduced</li>
          <li style={{ color: '#b45309' }}>Existing bookings are not affected</li>
        </ul>
      </div>
      
      <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#64748b', marginTop: '20px' }}>
        Your membership will automatically resume on <strong>20 June 2026</strong> unless cancelled
      </p>
    </div>
  );

  const renderCancelledState = (isActivePeriod: boolean) => (
    <div className="membership-overview-v6">
      <div className="membership-plan-card cancelled">
        <div className="plan-card-header">
          <span className="plan-type-tag">Pro Plan</span>
          <span className="status-badge cancelled">Cancelled</span>
        </div>
        <div className="plan-main-info">
          <h3>Growth Plan</h3>
          <p style={{ color: '#991b1b', fontWeight: 600, margin: '8px 0' }}>
            {isActivePeriod 
              ? "Your membership is cancelled and will expire on 28 May 2026" 
              : "Your membership has expired"}
          </p>
          {isActivePeriod && (
            <span style={{ fontSize: '0.85rem', color: '#ef4444' }}>You can continue using all features until this date</span>
          )}
        </div>
      </div>

      <div className="membership-actions-section">
        {isActivePeriod ? (
          <>
            <div className="action-item-v6" style={{ borderColor: '#bae6fd' }} onClick={() => setStatus('active')}>
              <div className="action-left-v6">
                <span className="action-title-v6">Reactivate Plan</span>
                <span className="action-subtext-v6">Continue your membership without interruption</span>
              </div>
              <span className="action-btn-v6 primary">Reactivate Plan</span>
            </div>
            <div className="action-item-v6" onClick={onUpgrade}>
              <div className="action-left-v6">
                <span className="action-title-v6">View Plans</span>
                <span className="action-subtext-v6">Explore available plans</span>
              </div>
              <span className="action-btn-v6">View Plans</span>
            </div>
          </>
        ) : (
          <>
            <div className="action-item-v6" style={{ borderColor: '#bae6fd' }} onClick={onUpgrade}>
              <div className="action-left-v6">
                <span className="action-title-v6">Choose a Plan</span>
                <span className="action-subtext-v6">Explore available plans and start receiving bookings</span>
              </div>
              <span className="action-btn-v6 primary">Choose a Plan</span>
            </div>
            <div className="action-item-v6" onClick={onUpgrade}>
              <div className="action-left-v6">
                <span className="action-title-v6">View Plans</span>
              </div>
              <span className="action-btn-v6">View Plans</span>
            </div>
          </>
        )}
      </div>

      <div className="impact-warning-box" style={{ background: '#fef2f2', borderColor: '#fecaca', marginTop: '24px' }}>
        <h5 style={{ color: '#991b1b' }}>{isActivePeriod ? "After expiry:" : "Current Impact:"}</h5>
        <ul className="impact-list">
          <li style={{ color: '#b91c1c' }}>{isActivePeriod ? "You will not receive new bookings" : "You are currently not receiving new bookings"}</li>
          {isActivePeriod && <li style={{ color: '#b91c1c' }}>Your profile visibility will be limited</li>}
          {isActivePeriod && <li style={{ color: '#b91c1c' }}>Existing bookings will not be affected</li>}
        </ul>
      </div>
    </div>
  );

  const renderCancelConfirm = () => (
    <div className="cancellation-flow-container">
      <div className="cancel-icon-box">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"></path></svg>
      </div>
      <h3 className="cancel-title">Cancel your plan?</h3>
      <p className="cancel-message">
        Your plan will remain active until <strong>28 May 2026</strong>. <br />
        You can continue receiving bookings until then.
      </p>

      <div className="impact-warning-box">
        <h5>After cancellation:</h5>
        <ul className="impact-list">
          <li>You won't receive new bookings after May 28</li>
          <li>Existing bookings will not be affected</li>
          <li>Your subscription will not renew automatically</li>
        </ul>
      </div>

      <div className="cancel-actions">
        <button className="btn-finish-cancel" onClick={() => { setView('cancel_success'); setStatus('cancelled_active'); }}>Finish Cancellation</button>
        <button className="btn-keep-plan" onClick={() => setView('overview')}>Keep My Plan</button>
      </div>
    </div>
  );

  const renderCancelSuccess = () => (
    <div className="cancellation-flow-container">
      <div className="cancel-icon-box" style={{ background: '#dcfce7', color: '#15803d' }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17L4 12"></path></svg>
      </div>
      <h3 className="cancel-title">Cancellation Scheduled</h3>
      <p className="cancel-message">
        Your plan will be cancelled on <strong>28 May 2026</strong>. <br />
        We're sorry to see you go! You can reactivate anytime before then.
      </p>
      <button className="btn-keep-plan" style={{ width: '100%' }} onClick={onClose}>Close</button>
    </div>
  );


  return (
    <div className="manage-membership-overlay" onClick={onClose}>
      <div className="manage-membership-container" onClick={e => e.stopPropagation()}>
        <div className="membership-modal-header">
          <div className="header-text">
            <h2>Manage myMembership</h2>
            {view !== 'overview' && <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '4px 0 0 0' }}>Cancel Plan</p>}
          </div>
          <button className="close-membership-btn" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="membership-modal-content">
          {view === 'overview' && renderOverview()}
          {view === 'cancel_confirm' && renderCancelConfirm()}
          {view === 'cancel_success' && renderCancelSuccess()}
        </div>
      </div>
    </div>
  );
};

export default ManageMembershipModal;
