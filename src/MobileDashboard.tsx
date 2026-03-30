/* MobileDashboard.tsx - Isolated components for Mobile Devices */
import React, { useState, useEffect } from 'react';
import './MobileDashboard.css';

/* ─────────────────── MOBILE UTILS ─────────────────── */
const MobileCountdown = ({ targetISO }: { targetISO: string }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const target = new Date(targetISO).getTime();
      const diff = target - now;

      if (diff <= 0) return 'Started';

      const hh = Math.floor(diff / (1000 * 60 * 60)).toString().padStart(2, '0');
      const mm = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
      const ss = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0');

      return `${hh}:${mm}:${ss}`;
    };

    setTimeLeft(calculateTime());
    const timer = setInterval(() => setTimeLeft(calculateTime()), 1000);
    return () => clearInterval(timer);
  }, [targetISO]);

  return <span>Starts in {timeLeft}</span>;
};

/* ─────────────────── MOBILE HOME VIEW ─────────────────── */
const MobileHomeView = ({ setActiveTab }: { setActiveTab: (tab: string) => void }) => {
  const todayDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  
  const todayBookings = [
    { id: 'BK-12405', type: 'Lunch', menu: 'Standard Business Lunch', guests: 150, collect: '₹75,000', time: '10:00 AM', targetTime: new Date(Date.now() + 2 * 3600 * 1000).toISOString(), theme: 'warning' },
    { id: 'BK-12410', type: 'Dinner', menu: 'Premium Buffet Menu 2', guests: 45, collect: '₹31,500', time: '04:00 PM', targetTime: new Date(Date.now() + 8 * 3600 * 1000).toISOString(), theme: 'info' }
  ];

  return (
    <div className="mobile-scroller-v50">
      <div className="mobile-home-header-v50">
        <h1 className="mobile-title-v50">Dashboard Overview</h1>
        <div className="mobile-subtitle-v50">
          <span>{todayDate}</span>
          <span className="mobile-rating-badge-v50">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '4px' }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            4.3 Rating
          </span>
        </div>
      </div>

      <div className="mobile-summary-stack-v50">
        <div className="mobile-stat-item-v50 highlight">
          <span className="mobile-item-label-v50">Today's Bookings</span>
          <span className="mobile-item-value-v50">02</span>
        </div>
        <div className="mobile-stat-item-v50">
          <span className="mobile-item-label-v50">Today's Revenue</span>
          <span className="mobile-item-value-v50">₹45,800</span>
        </div>
        <div className="mobile-stat-item-v50">
          <span className="mobile-item-label-v50">Next Booking</span>
          <span className="mobile-item-value-v50 small">Starts in 2h 15m</span>
        </div>
      </div>

      <div className="mobile-section-v50">
        <div className="mobile-section-head-v50">
          <h3 className="mobile-h3-v50">Today's Bookings</h3>
        </div>
        <div className="mobile-card-list-v50">
          {todayBookings.map((b, i) => (
            <div key={i} className="mobile-today-card-v50 clickable" onClick={() => setActiveTab('bookings')}>
              <div className="card-row-top-v50">
                <span className="card-time-v50">{b.time}</span>
                <div className={`card-status-pill-v50 ${b.theme}`}>
                  <MobileCountdown targetISO={b.targetTime} />
                </div>
              </div>
              <div className="mobile-chips-row-v50">
                <span className="mobile-chip-v50">{b.type}</span>
                <span className="mobile-chip-v50">{b.menu}</span>
                <span className="mobile-chip-v50">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                  {b.guests}
                </span>
                <span className="mobile-chip-v50">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="5" width="20" height="14" rx="2"></rect><circle cx="12" cy="12" r="3"></circle></svg>
                  {b.collect}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mobile-section-v50">
        <div className="mobile-section-head-v50">
          <h3 className="mobile-h3-v50">Upcoming Bookings</h3>
        </div>
        <div className="mobile-card-list-v50">
          {[
            { id: 'BK-12415', title: 'Dinner • Premium Buffet', date: 'Tomorrow', time: '09:00 AM', timer: 'Starts in 25h', guests: 300, collect: '₹1,05,000' },
            { id: 'BK-12420', title: 'Lunch • Business Lunch', date: 'Tomorrow', time: '12:30 PM', timer: 'Starts in 28h', guests: 80, collect: '₹39,200' },
            { id: 'BK-12425', title: 'Dinner • Celebration', date: '26 Mar', time: '08:00 PM', timer: 'Starts in 52h', guests: 120, collect: '₹1,00,800' },
          ].map((booking, idx) => (
            <div key={idx} className="mobile-compact-upcoming-v50 clickable" onClick={() => setActiveTab('bookings')}>
              <div className="upcoming-date-box-v50">
                <strong>{booking.date}</strong>
                <span>{booking.time}</span>
              </div>
              <div className="upcoming-data-col-v50">
                <p className="upcoming-id-v50">{booking.id} • {booking.title}</p>
                <div className="mobile-chips-row-v50">
                  <span className="mobile-chip-v50" style={{ padding: '4px 8px', fontSize: '0.7rem' }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                    {booking.guests}
                  </span>
                  <span className="mobile-chip-v50" style={{ padding: '4px 8px', fontSize: '0.7rem' }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="5" width="20" height="14" rx="2"></rect><circle cx="12" cy="12" r="3"></circle></svg>
                    {booking.collect}
                  </span>
                </div>
              </div>
            </div>
          ))}
          <button 
            className="mobile-view-all-v50" 
            onClick={() => setActiveTab('bookings')}
            style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'white', border: '1.5px solid #e2e8f0', color: '#0077ff', fontWeight: '700', marginTop: '8px' }}
          >
            View All Upcoming Bookings
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────── MOBILE DASHBOARD WRAPPER ─────────────────── */
interface MobileDashboardProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  profileData: any;
  navigationGroups: any[];
  onLogout: () => void;
}

const MobileDashboard: React.FC<MobileDashboardProps> = ({ 
  activeTab, 
  setActiveTab, 
  profileData, 
  navigationGroups,
  onLogout 
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Close drawer on tab change
  useEffect(() => {
    setIsDrawerOpen(false);
  }, [activeTab]);

  return (
    <div className="mobile-dashboard-wrapper-v50">
      {/* Global Top Nav */}
      <div className="mobile-top-bar-v50">
        <button className="mobile-action-btn-v50" onClick={() => setIsDrawerOpen(true)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
        <div className="mobile-bar-center-v50">
          <h2>
            {navigationGroups.flatMap(g => g.items).find(i => i.id === activeTab)?.label || 'Dashboard'}
          </h2>
        </div>
        <div className="mobile-bar-right-v50">
          <button className="mobile-action-btn-v50">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
          </button>
          <div className="mobile-avatar-circle-v50">
            {profileData?.owner?.name?.charAt(0) || 'B'}
          </div>
        </div>
      </div>

      {/* Main View Area */}
      {activeTab === 'dashboard' ? (
        <MobileHomeView setActiveTab={setActiveTab} />
      ) : (
        <div className="mobile-scroller-v50" style={{ textAlign: 'center', color: '#64748b', paddingTop: '100px' }}>
          <p>Mobile view for <strong>{activeTab}</strong> component coming soon...</p>
          <button 
            onClick={() => setActiveTab('dashboard')}
            style={{ marginTop: '20px', color: '#0077ff', fontWeight: '700', border: 'none', background: 'none' }}
          >
            ← Back to Dashboard Overview
          </button>
        </div>
      )}

      {/* Drawer Menu */}
      {isDrawerOpen && (
        <div className="mobile-overlay-v50" onClick={() => setIsDrawerOpen(false)}>
          <div className="mobile-drawer-v50" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-top-v50">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <svg width="24" height="24" viewBox="0 0 24 32" fill="none"><path d="M0 0H12L24 12V20L12 8H0V0Z" fill="#0077ff" /></svg>
                <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#1e293b' }}>MyPartner</span>
              </div>
              <button className="mobile-action-btn-v50" onClick={() => setIsDrawerOpen(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <div className="drawer-body-v50">
              {navigationGroups.map(group => (
                <div key={group.title} className="drawer-nav-group-v50">
                  <h3 className="drawer-nav-label-v50">{group.title}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {group.items.map((item: any) => (
                      <button
                        key={item.id}
                        className={`drawer-item-v50 ${activeTab === item.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(item.id)}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="drawer-footer-v50">
              <button className="logout-mobile-v50" onClick={onLogout}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                <span>Logout Session</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileDashboard;
