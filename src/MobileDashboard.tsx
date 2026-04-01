/* MobileDashboard.tsx - Isolated components for Mobile Devices */
import React, { useState, useEffect, useRef } from 'react';
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

/* ─────────────────── MOBILE BOOKINGS DETAIL VIEW ─────────────────── */
const MobileBookingDetailView = ({
  booking,
  onBack
}: {
  booking: any;
  onBack: () => void;
}) => {
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);
  const [isMenuSheetOpen, setIsMenuSheetOpen] = useState(false);

  const handleComplete = () => {
    setIsMarkingComplete(true);
    setTimeout(() => {
      setIsMarkingComplete(false);
      onBack();
    }, 1000);
  };

  return (
    <div className="mobile-detail-page-v50">
      <div className="mobile-detail-header-v50">
        <div className="header-left-v50">
          <button className="back-btn-v50" onClick={onBack}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          </button>
          <span className="detail-id-v50">{booking.id}</span>
        </div>
        <div className="header-right-v50">
          <div className="detail-type-badge-v50">{booking.taxType}</div>
          <div className={`detail-status-badge-v50 ${booking.status.toLowerCase()}`}>
            {booking.status}
          </div>
        </div>
      </div>

      <div className="mobile-detail-content-v50">
        {/* Customer Info Section */}
        <div className="detail-section-v50 card">
          <h3 className="section-title-v50 small">Customer Information</h3>
          <div className="customer-info-box-v50">
            <div className="customer-name-big-v50">{booking.customer}</div>
            <a href={`tel:${booking.phone || '9123456789'}`} className="customer-contact-row-v50">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0077ff" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.28-2.28a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              <span>+91 {booking.phone || '91234 56789'}</span>
            </a>
            <div className="customer-contact-row-v50">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              <span>{booking.email || 'customer@example.com'}</span>
            </div>
            <div className="customer-contact-row-v50">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <span>{booking.address || '402, Skyline Residency, Sector 44, Bengaluru'}</span>
            </div>
          </div>
        </div>

        {/* Event Details Section */}
        <div className="detail-section-v50 card">
          <h3 className="section-title-v50 small">Event Details</h3>
          <div className="event-details-grid-v50">
            <div className="event-info-item-v50">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              <div className="info-text-v50">
                <label>Date & Time</label>
                <span>{new Date(booking.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} • {booking.time}</span>
              </div>
            </div>
            <div className="event-info-item-v50">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><path d="M12 2v20M2 12h20M12 2l4 4-4 4 4 4-4 4-4-4 4-4-4-4 4-4z"></path></svg>
              <div className="info-text-v50">
                <label>Category</label>
                <span>{booking.category}</span>
              </div>
            </div>
            <div className="event-info-item-v50">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
              <div className="info-text-v50">
                <label>Guests</label>
                <span>{booking.guests} People</span>
              </div>
            </div>
            <div className="event-info-item-v50">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
              <div className="info-text-v50">
                <label>Menu Selection</label>
                <span>{booking.menuName}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Details Section */}
        {booking.menuDetails && (
          <div className="detail-section-v50 card">
            <h3 className="section-title-v50 small">Menu Details</h3>
            <div className="menu-summary-container-v50">
              {/* Only show the first section/category in the preview */}
              {booking.menuDetails.categories.slice(0, 1).map((cat: any, idx: number) => (
                <div key={idx} className="menu-category-group-v50">
                  <div className="cat-header-v50">
                    <span className="cat-name-v50">{cat.name}</span>
                    <span className={`cat-status-pill-v50 ${cat.status === 'All Items Included' ? 'all' : 'custom'}`}>
                      {cat.status}
                    </span>
                  </div>
                  <div className="cat-items-flex-v50">
                    {cat.items.slice(0, 4).map((item: string, i: number) => (
                      <div key={i} className="menu-item-pill-v50">{item}</div>
                    ))}
                    {cat.items.length > 4 && (
                      <div className="menu-item-pill-v50 more">+{cat.items.length - 4} more</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button className="view-full-menu-btn-v50" onClick={() => setIsMenuSheetOpen(true)}>
              View Full Menu
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>
        )}

        {/* Payment Summary Section */}
        <div className="detail-section-v50 card">
          <h3 className="section-title-v50 small">Payment Summary</h3>
          <div className="payment-summary-box-v50">
            <div className="payment-main-row-v50">
              <span className="label">Total Booking Value</span>
              <span className="value primary">₹{booking.amount.toLocaleString()}</span>
            </div>
            <div className="payment-divider-v50"></div>
            <div className="payment-sub-grid-v50">
              <div className="payment-sub-item-v50">
                <label>Advance Paid</label>
                <div className="amount-status-v50">
                  <span className="amount received">₹{booking.paid.toLocaleString()}</span>
                  <span className="tag success">Received</span>
                </div>
              </div>
              <div className="payment-sub-item-v50">
                <label>Pending Balance</label>
                <div className="amount-status-v50">
                  <span className="amount pending">₹{(booking.amount - booking.paid).toLocaleString()}</span>
                  <span className="tag warning">Pending</span>
                </div>
              </div>
            </div>
            <div className="payout-info-grid-v50">
              <div className="payout-detail-row-v50">
                <label>Payout:</label>
                <span className="value accent">₹{booking.paid.toLocaleString()}</span>
              </div>
              <div className="payout-detail-row-v50">
                <label>Payout Processed At:</label>
                <span className="value">{
                  (() => {
                    const d = new Date(booking.date);
                    d.setDate(d.getDate() - 1);
                    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
                  })()
                }</span>
              </div>
              <div className="payout-detail-row-v50">
                <label>GST Month:</label>
                <span className="value">{
                  (() => {
                    const d = new Date(booking.date);
                    d.setMonth(d.getMonth() + 1);
                    return d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
                  })()
                }</span>
              </div>
            </div>
          </div>
        </div>

        {/* Warning Note */}
        <div className="mobile-warning-alert-v50">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          <span>Collect remaining amount on event day from customer.</span>
        </div>

        {/* Documents Section */}
        <div className="detail-section-v50">
          <h3 className="section-title-v50 small">Documents</h3>
          <div className="mobile-doc-list-v50">
            <div className="doc-row-v50">
              <div className="doc-left-v50">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                <div className="doc-info-v50">
                  <span className="doc-name-v50">Advance Booking Receipt</span>
                  <span className="doc-meta-v50">PDF • 1.2 MB</span>
                </div>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
            <div className="doc-row-v50">
              <div className="doc-left-v50">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                <div className="doc-info-v50">
                  <span className="doc-name-v50">Tax Invoice (Final)</span>
                  <span className="doc-meta-v50">Unavailable</span>
                </div>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
          </div>
        </div>

        <div style={{ height: '80px' }}></div> {/* Spacer for sticky button */}
      </div>

      {/* Sticky Bottom CTA */}
      <div className="mobile-detail-footer-v50">
        <button
          className="btn-mark-completed-v50"
          onClick={handleComplete}
          disabled={isMarkingComplete}
        >
          {isMarkingComplete ? 'Updating...' : 'Mark as Completed'}
        </button>
      </div>

      {/* Full Menu Bottom Sheet */}
      {isMenuSheetOpen && (
        <div className="mobile-sheet-overlay-v50" onClick={() => setIsMenuSheetOpen(false)}>
          <div className="mobile-bottom-sheet-v50" onClick={e => e.stopPropagation()}>
            <div className="sheet-header-v50">
              <span className="sheet-title-v50">Full Menu Selection</span>
              <button className="sheet-close-v50" onClick={() => setIsMenuSheetOpen(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <div className="sheet-body-v50 scrollable">
              {booking.menuDetails.categories.map((cat: any, idx: number) => (
                <div key={idx} className="sheet-menu-cat-block-v50">
                  <div className="sheet-cat-header-v50">
                    <span className="name">{cat.name}</span>
                    <span className="status">{cat.status}</span>
                  </div>
                  <div className="sheet-cat-items-v50">
                    {cat.items.map((item: string, i: number) => (
                      <div key={i} className="sheet-menu-item-v50">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─────────────────── MOBILE BOOKINGS VIEW ─────────────────── */
const MobileBookingsView = () => {
  const [bookings] = useState([
    {
      id: 'BK-12401',
      customer: 'Amit Khurana',
      date: new Date().toISOString().split('T')[0],
      time: '12:30 PM',
      category: 'Lunch',
      menuName: 'Premium Sadhya Menu',
      guests: 200,
      amount: 145000,
      paid: 43500,
      status: 'Preparing',
      address: '402, Skyline Residency, Sector 44, Bengaluru',
      taxType: 'B2B',
      menuDetails: {
        categories: [
          { name: 'Starters', items: ['Hara Bhara Kabab', 'Paneer Tikka', 'Chilli Gobi', 'Veg Spring Roll'], status: 'All Items Included' },
          { name: 'Main Course', items: ['Dal Makhani', 'Paneer Butter Masala', 'Mixed Veg Curry', 'Assorted Naan', 'Jeera Rice'], status: 'Customer Selected' },
          { name: 'Desserts', items: ['Gulab Jamun', 'Vanilla Ice Cream with Chocolate Sauce', 'Fresh Fruit Salad'], status: 'All Items Included' }
        ]
      }
    },
    {
      id: 'BK-12402',
      customer: 'Bhavya Singh',
      date: new Date().toISOString().split('T')[0],
      time: '01:00 PM',
      category: 'Lunch',
      menuName: 'Traditional South Indian',
      guests: 120,
      amount: 95000,
      paid: 30000,
      status: 'Preparing',
      address: 'Plot 12, HSR Layout, 7th Sector, Bengaluru',
      taxType: 'B2C',
      menuDetails: {
        categories: [
          { name: 'Starters', items: ['Medhu Vada', 'Mini Idli', 'Onion Pakoda'], status: 'All Items Included' },
          { name: 'Main Course', items: ['Sambar Rice', 'Curd Rice', 'Avial', 'Poriyal', 'Appalam'], status: 'Customer Selected' },
          { name: 'Desserts', items: ['Payasam', 'Banana Halwa'], status: 'All Items Included' }
        ]
      }
    },
    {
      id: 'BK-12405',
      customer: 'Siddharth Malhotra',
      date: '2026-03-22',
      time: '07:30 PM',
      category: 'Dinner',
      menuName: 'Executive Buffet',
      guests: 150,
      amount: 85000,
      paid: 25500,
      status: 'Upcoming',
      address: 'Apartment 701, Prestige Ferns Residency, Bellandur',
      taxType: 'B2B',
      menuDetails: {
        categories: [
          { name: 'Starters', items: ['Chicken Tikka', 'Fish Finger', 'Veg Seekh Kabab'], status: 'Customer Selected' },
          { name: 'Main Course', items: ['Butter Chicken', 'Mutton Rogan Josh', 'Dal Tadka', 'Garlic Naan'], status: 'Customer Selected' },
          { name: 'Desserts', items: ['Shahi Tukda', 'Moong Dal Halwa'], status: 'All Items Included' }
        ]
      }
    },
    // Defaulting other bookings with a standard menu for now
    { id: 'BK-12398', customer: 'Ananya Pandey', date: '2026-03-20', time: '04:30 PM', category: 'Snacks', menuName: 'High Tea Special', guests: 80, amount: 45000, paid: 13500, status: 'Completed', address: 'No. 34, 1st Cross, Indiranagar 2nd Stage', taxType: 'B2C', menuDetails: { categories: [{ name: 'Starters', items: ['Samosa', 'Chai', 'Cookies'], status: 'All Included' }] } },
    { id: 'BK-12410', customer: 'Varun Dhawan', date: '2026-03-24', time: '08:00 PM', category: 'Dinner', menuName: 'Romantic Four-Course', guests: 12, amount: 15000, paid: 4500, status: 'Upcoming', address: 'Flat 4A, Green Meadows Appts, Koramangala', taxType: 'B2B', menuDetails: { categories: [{ name: 'Starters', items: ['Soup'], status: 'All Included' }] } },
    { id: 'BK-12412', customer: 'Kareena Kapoor', date: '2026-03-25', time: '01:00 PM', category: 'Lunch', menuName: 'Healthy Salads & Juice', guests: 40, amount: 35000, paid: 10500, status: 'Upcoming', address: 'Villa 5, Sterling Villa Grande, Kadugodi', taxType: 'B2C', menuDetails: { categories: [{ name: 'Starters', items: ['Salad'], status: 'All Included' }] } },
    { id: 'BK-12415', customer: 'Rajeev Mehta', date: '2026-03-26', time: '08:30 PM', category: 'Dinner', menuName: 'Royal North Indian', guests: 50, amount: 40000, paid: 12000, status: 'Upcoming', address: 'Villa 88, Palm Meadows, Whitefield', taxType: 'B2B', menuDetails: { categories: [{ name: 'Starters', items: ['Tikka'], status: 'All Included' }] } },
    { id: 'BK-12416', customer: 'Divya Reddy', date: '2026-03-27', time: '12:00 PM', category: 'Lunch', menuName: 'Continental Feast', guests: 80, amount: 55000, paid: 15000, status: 'Upcoming', address: 'House 56, 12th Main, Jayanagar 4th Block', taxType: 'B2C', menuDetails: { categories: [{ name: 'Starters', items: ['Pasta'], status: 'All Included' }] } },
    { id: 'BK-12417', customer: 'Sita Ram', date: '2026-03-28', time: '07:00 PM', category: 'Dinner', menuName: 'Family Thali Special', guests: 30, amount: 20000, paid: 6000, status: 'Upcoming', address: 'No. 15, Malleshwaram 18th Cross', taxType: 'B2C', menuDetails: { categories: [{ name: 'Starters', items: ['Thali Items'], status: 'All Included' }] } },
    { id: 'BK-12418', customer: 'Arun Kumar', date: '2026-03-29', time: '01:30 PM', category: 'Lunch', menuName: 'Business Buffet', guests: 60, amount: 30000, paid: 9000, status: 'Upcoming', address: 'Apartment 204, Embassy Lake Terraces, Hebbal', taxType: 'B2B', menuDetails: { categories: [{ name: 'Starters', items: ['Paneer'], status: 'All Included' }] } },
    { id: 'BK-12420', customer: 'Nisha Gupta', date: '2026-04-01', time: '08:00 PM', category: 'Dinner', menuName: 'Grand Wedding Feast', guests: 300, amount: 250000, paid: 75000, status: 'Upcoming', address: 'Leela Palace Grand Ballroom, Old Airport Road', taxType: 'B2B', menuDetails: { categories: [{ name: 'Starters', items: ['Many Items'], status: 'All Included' }] } },
    { id: 'BK-12421', customer: 'Rahul Bose', date: '2026-04-02', time: '12:30 PM', category: 'Lunch', menuName: 'Office Gathering Menu', guests: 45, amount: 35000, paid: 10000, status: 'Upcoming', address: 'EcoWorld Block 8-B, Marathahalli-Sarjapur Outer Ring Road', taxType: 'B2C', menuDetails: { categories: [{ name: 'Starters', items: ['Office Snacks'], status: 'All Included' }] } },
    { id: 'BK-12422', customer: 'Vikram Seth', date: '2026-04-03', time: '07:30 PM', category: 'Dinner', menuName: 'Corporate Banquet', guests: 100, amount: 120000, paid: 40000, status: 'Upcoming', address: 'Sheraton Grand, Whitefield Main Road', taxType: 'B2B', menuDetails: { categories: [{ name: 'Starters', items: ['Corporate Items'], status: 'All Included' }] } },
    { id: 'BK-12423', customer: 'Meera Iyer', date: '2026-04-04', time: '01:00 PM', category: 'Lunch', menuName: 'Celebration Meal', guests: 20, amount: 15000, paid: 5000, status: 'Upcoming', address: 'Door No. 12, Benson Cross Road, Benson Town', taxType: 'B2C', menuDetails: { categories: [{ name: 'Starters', items: ['Celebration Snacks'], status: 'All Included' }] } },
    { id: 'BK-12424', customer: 'Deepak Jain', date: '2026-04-05', time: '08:30 PM', category: 'Dinner', menuName: 'Party Platter Special', guests: 75, amount: 65000, paid: 20000, status: 'Upcoming', address: 'Mantri Elegance, Bannerghatta Road', taxType: 'B2C', menuDetails: { categories: [{ name: 'Starters', items: ['Party items'], status: 'All Included' }] } },
    { id: 'BK-12425', customer: 'Sunil Gavaskar', date: '2026-04-10', time: '07:30 PM', category: 'Breakfast', menuName: 'Sunrise Buffet', guests: 50, amount: 50000, paid: 15000, status: 'Upcoming', address: 'G-05, Sobha Quartz, Sarjapur Main Road', taxType: 'B2B', menuDetails: { categories: [{ name: 'Starters', items: ['Breakfast items'], status: 'All Included' }] } },
    { id: 'BK-12426', customer: 'Kapil Dev', date: '2026-04-11', time: '08:00 PM', category: 'Dinner', menuName: 'Legendary Feast', guests: 100, amount: 90000, paid: 30000, status: 'Upcoming', address: 'Lakeside Pavilion, Ulsoor Lake Area', taxType: 'B2B', menuDetails: { categories: [{ name: 'Starters', items: ['Feast items'], status: 'All Included' }] } },
    { id: 'BK-12427', customer: 'Sachin Tendulkar', date: '2026-04-12', time: '01:00 PM', category: 'Lunch', menuName: 'Masterclass Menu', guests: 80, amount: 75000, paid: 25000, status: 'Upcoming', address: 'Godrej Woodsman Estate, Tower B, Bellary Road', taxType: 'B2C', menuDetails: { categories: [{ name: 'Starters', items: ['Master items'], status: 'All Included' }] } },
    { id: 'BK-12428', customer: 'MS Dhoni', date: '2026-04-13', time: '07:00 PM', category: 'Dinner', menuName: 'Captain’s Choice', guests: 150, amount: 150000, paid: 50000, status: 'Upcoming', address: 'Flat 505, Salarpuria Sattva Magnificia, Old Madras Road', taxType: 'B2B', menuDetails: { categories: [{ name: 'Starters', items: ['Captain items'], status: 'All Included' }] } },
    { id: 'BK-12429', customer: 'Virat Kohli', date: '2026-04-14', time: '08:30 PM', category: 'Dinner', menuName: 'Fitness Focused Buffet', guests: 60, amount: 60000, paid: 20000, status: 'Upcoming', address: 'Penthouse A, Brigade Exotica, Old Madras Road', taxType: 'B2B', menuDetails: { categories: [{ name: 'Starters', items: ['Fitness items'], status: 'All Included' }] } },
    { id: 'BK-12430', customer: 'Rohit Sharma', date: '2026-04-15', time: '01:30 PM', category: 'Lunch', menuName: 'Hitman Special', guests: 90, amount: 85000, paid: 25000, status: 'Upcoming', address: 'Tower 2, Floor 15, Karle Town Centre, Nagavara', taxType: 'B2B', menuDetails: { categories: [{ name: 'Starters', items: ['Hitman items'], status: 'All Included' }] } },
    { id: 'BK-12431', customer: 'Hardik Pandya', date: '2026-04-16', time: '07:30 PM', category: 'Dinner', menuName: 'Vibrant Fusion', guests: 40, amount: 45000, paid: 15000, status: 'Upcoming', address: 'House No. 9, Windmill on the Hills, Whitefield', taxType: 'B2B', menuDetails: { categories: [{ name: 'Starters', items: ['Fusion items'], status: 'All Included' }] } },
    { id: 'BK-12432', customer: 'KL Rahul', date: '2026-04-17', time: '08:00 PM', category: 'Dinner', menuName: 'Modern Classic', guests: 25, amount: 30000, paid: 10000, status: 'Upcoming', address: 'Flat 302, Total Environment Learning to Fly, Jayanagar', taxType: 'B2C', menuDetails: { categories: [{ name: 'Starters', items: ['Classic items'], status: 'All Included' }] } },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [rangeShortcut, setRangeShortcut] = useState('All');
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10);
  const [loadingMore, setLoadingMore] = useState(false);

  // Advanced Filters State
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({
    fromDate: '',
    toDate: '',
    status: 'All'
  });
  const [tempFilters, setTempFilters] = useState({ ...appliedFilters });
  const [selectedDetail, setSelectedDetail] = useState<any>(null);

  const today = new Date().toISOString().split('T')[0];

  const stats = {
    total: bookings.length,
    today: bookings.filter(b => b.date === today).length,
    upcoming: bookings.filter(b => b.date > today && b.status !== 'Cancelled').length,
    completed: bookings.filter(b => b.status === 'Completed').length
  };

  const filteredBookings = bookings.filter(b => {
    // 1. Search matching
    const matchesSearch = b.id.toLowerCase().includes(searchTerm.toLowerCase()) || b.customer.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    // 2. Handle Shortcuts (Today, Month, etc) - Overrides advanced date if active
    if (rangeShortcut === 'Today') {
      if (b.date !== today) return false;
    } else if (rangeShortcut === 'This Month') {
      const bDate = new Date(b.date);
      const now = new Date();
      if (bDate.getMonth() !== now.getMonth() || bDate.getFullYear() !== now.getFullYear()) return false;
    } else if (appliedFilters.fromDate || appliedFilters.toDate) {
      // 3. Advanced Date Range (only if no rapid shortcut is active or All is selected)
      if (appliedFilters.fromDate && b.date < appliedFilters.fromDate) return false;
      if (appliedFilters.toDate && b.date > appliedFilters.toDate) return false;
    }

    // 4. Status Filter
    if (appliedFilters.status !== 'All' && b.status !== appliedFilters.status) return false;

    return true;
  });

  const displayedBookings = filteredBookings.slice(0, visibleCount);

  const handleLoadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + 10);
      setLoadingMore(false);
    }, 800);
  };

  const openFilters = () => {
    setTempFilters({ ...appliedFilters });
    setIsFilterSheetOpen(true);
  };

  const applyFilters = () => {
    setAppliedFilters({ ...tempFilters });
    setRangeShortcut('All'); // Clear rapid shortcut if advanced filters applied
    setIsFilterSheetOpen(false);
    setVisibleCount(10);
  };

  const resetFilters = () => {
    setTempFilters({ fromDate: '', toDate: '', status: 'All' });
  };

  const hasActiveAdvancedFilters = appliedFilters.fromDate || appliedFilters.toDate || appliedFilters.status !== 'All';

  if (selectedDetail) {
    return <MobileBookingDetailView booking={selectedDetail} onBack={() => setSelectedDetail(null)} />;
  }

  return (
    <div className="mobile-scroller-v50">
      <div className="mobile-home-header-v50" style={{ marginBottom: '20px' }}>
        <h1 className="mobile-title-v50">Bookings Management</h1>
        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '4px 0 0' }}>Monitor and manage your operations</p>
      </div>

      {/* Stats Grid */}
      <div className="mobile-stats-grid-v50">
        <div className="mobile-stat-card-v50">
          <span className="stat-label">Total</span>
          <span className="stat-value">{stats.total}</span>
          <span className="stat-sub">Overall</span>
        </div>
        <div className="mobile-stat-card-v50 dark">
          <span className="stat-label">Today</span>
          <span className="stat-value">{stats.today}</span>
          <span className="stat-sub">{stats.today} events</span>
        </div>
        <div className="mobile-stat-card-v50">
          <span className="stat-label">Upcoming</span>
          <span className="stat-value">{stats.upcoming}</span>
          <span className="stat-sub">Future</span>
        </div>
        <div className="mobile-stat-card-v50">
          <span className="stat-label">Completed</span>
          <span className="stat-value">{stats.completed}</span>
          <span className="stat-sub">Done</span>
        </div>
      </div>

      {/* Search and Filters Strip */}
      <div className="mobile-search-filter-stack-v50">
        <div className="mobile-search-bar-v50">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input
            type="text"
            placeholder="Search ID or Customer..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setVisibleCount(10);
            }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="mobile-chips-scroll-v50" style={{ flex: 1 }}>
            {['All', 'Today', 'This Month'].map(s => (
              <button
                key={s}
                className={`filter-chip-v50 ${rangeShortcut === s ? 'active' : ''}`}
                onClick={() => {
                  setRangeShortcut(s);
                  setAppliedFilters({ fromDate: '', toDate: '', status: 'All' }); // Clear advanced if choosing rapid
                  setVisibleCount(10);
                }}
              >
                {s}
              </button>
            ))}
          </div>
          <button
            className="mobile-action-btn-v50"
            style={{ padding: '8px', background: 'white', borderRadius: '10px', border: '1px solid #e2e8f0', minWidth: '42px', height: '42px' }}
            onClick={openFilters}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={hasActiveAdvancedFilters ? '#0077ff' : '#64748b'} strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
            {hasActiveAdvancedFilters && <span className="filter-active-dot-v50"></span>}
          </button>
        </div>
      </div>

      <div className="collapsible-banner-v50">
        <button className="banner-trigger-v50" onClick={() => setIsNoteOpen(!isNoteOpen)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0077ff" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          <strong style={{ fontSize: '0.9rem', color: '#1e293b' }}>Important Note</strong>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" style={{ marginLeft: 'auto', transform: isNoteOpen ? 'rotate(180deg)' : 'none' }}><polyline points="6 9 12 15 18 9"></polyline></svg>
        </button>
        {isNoteOpen && (
          <div className="banner-content-v50">
            Collect balance amount directly from the customer. myMooment is not responsible for balance payments.
          </div>
        )}
      </div>

      <div className="mobile-section-v50" style={{ marginTop: '0' }}>
        <div className="mobile-card-list-v50">
          {displayedBookings.map((b) => (
            <div key={b.id} className="mobile-booking-card-v50" onClick={() => setSelectedDetail(b)}>
              <div className="card-header-v50">
                <div className="card-id-v50">
                  {b.id}
                  {b.date === today && <span className="urgent-badge-v50">TODAY</span>}
                </div>
                <div className={`card-status-v50 ${b.status.toLowerCase()}`}>{b.status}</div>
              </div>
              <div className="card-body-v50">
                <h4 className="customer-name-v50">{b.customer}</h4>
                <div className="event-details-v50">
                  <div className="detail-row-v50">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M2 12h20M12 2l4 4-4 4 4 4-4 4-4-4 4-4-4-4 4-4z"></path></svg>
                    <span style={{ fontWeight: '600', color: '#1e293b' }}>{b.category}</span> • {b.menuName}
                  </div>
                  <div className="detail-row-v50">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                    {b.guests} Guests
                  </div>
                  <div className="detail-row-v50">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    {new Date(b.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} • {b.time}
                  </div>
                </div>
                <div className="card-footer-v50">
                  <div className="mobile-chips-row-v50" style={{ margin: 0 }}>
                    <span className="mobile-chip-v50">Paid: ₹{b.paid.toLocaleString()}</span>
                  </div>
                  <div className="price-summary-v50">
                    <span className="total-price-v50">₹{b.amount.toLocaleString()}</span>
                    {b.amount - b.paid > 0 && (
                      <span className="balance-v50">Bal: ₹{(b.amount - b.paid).toLocaleString()}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredBookings.length > 0 && (
          <div className="mobile-pagination-v50">
            <span className="pagination-info-v50">
              Showing {displayedBookings.length} of {filteredBookings.length} bookings
            </span>
            {visibleCount < filteredBookings.length && (
              <button
                className="load-more-btn-v50"
                onClick={handleLoadMore}
                disabled={loadingMore}
              >
                {loadingMore ? (
                  <>
                    <div className="spinner-v50" />
                    <span>Loading...</span>
                  </>
                ) : (
                  'Load More Bookings'
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Filter Bottom Sheet */}
      {isFilterSheetOpen && (
        <div className="mobile-sheet-overlay-v50" onClick={() => setIsFilterSheetOpen(false)}>
          <div className="mobile-bottom-sheet-v50" onClick={e => e.stopPropagation()}>
            <div className="sheet-header-v50">
              <span className="sheet-title-v50">Filter Bookings</span>
              <button className="sheet-close-v50" onClick={() => setIsFilterSheetOpen(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <div className="sheet-body-v50">
              <div className="sheet-section-v50">
                <div className="sheet-section-title-v50">Date Range</div>
                <div className="sheet-date-grid-v50">
                  <div className="date-field-v50">
                    <label>From</label>
                    <input
                      type="date"
                      className="mobile-date-input-v50"
                      value={tempFilters.fromDate}
                      onChange={e => setTempFilters({ ...tempFilters, fromDate: e.target.value })}
                    />
                  </div>
                  <div className="date-field-v50">
                    <label>To</label>
                    <input
                      type="date"
                      className="mobile-date-input-v50"
                      value={tempFilters.toDate}
                      onChange={e => setTempFilters({ ...tempFilters, toDate: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="sheet-section-v50">
                <div className="sheet-section-title-v50">Booking Status</div>
                <div className="sheet-chips-v50">
                  {['All', 'Preparing', 'Upcoming', 'Completed', 'Cancelled'].map(s => (
                    <button
                      key={s}
                      className={`filter-chip-v50 ${tempFilters.status === s ? 'active' : ''}`}
                      onClick={() => setTempFilters({ ...tempFilters, status: s })}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="sheet-footer-v50">
              <button className="btn-sheet-reset-v50" onClick={resetFilters}>Reset</button>
              <button className="btn-sheet-apply-v50" onClick={applyFilters}>Apply Filters</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─────────────────── MOBILE REPORTS VIEW ─────────────────── */

const MobileRevenueView = () => {
  const [selectedFY, setSelectedFY] = useState('FY 2025-26');
  const [selectedMonth, setSelectedMonth] = useState('Mar');
  const [selectedBar, setSelectedBar] = useState<number | null>(11); // Default highlight Mar
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const monthsList = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];

  const trendData = [
    { month: 'Apr', revenue: 65000 },
    { month: 'May', revenue: 72000 },
    { month: 'Jun', revenue: 85000 },
    { month: 'Jul', revenue: 78000 },
    { month: 'Aug', revenue: 92000 },
    { month: 'Sep', revenue: 88000 },
    { month: 'Oct', revenue: 85000 },
    { month: 'Nov', revenue: 92000 },
    { month: 'Dec', revenue: 108000 },
    { month: 'Jan', revenue: 125000 },
    { month: 'Feb', revenue: 118000 },
    { month: 'Mar', revenue: 135000 },
  ];

  const maxVal = Math.max(...trendData.map(d => d.revenue));

  return (
    <div className="mobile-revenue-container-v50">
      {/* Single Row Filters */}
      <div className="mobile-revenue-filters-v50">
        <div className="filter-row-single-v50">
          <select value={selectedFY} onChange={e => setSelectedFY(e.target.value)} className="rev-select-v50">
            <option>FY '25-26</option>
            <option>FY '24-25</option>
          </select>
          <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className="rev-select-v50">
            {monthsList.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      {/* KPI Hierarchy */}
      <div className="mobile-rev-kpi-stack-v50">
        <div className="rev-kpi-hero-card-v50">
          <div className="hero-head-v50">
            <div className="hero-title-group-v50">
              <span className="label-v50">Total Revenue</span>
            </div>
          </div>
          <div className="hero-value-v50">₹4,25,840</div>
        </div>

        <div className="rev-kpi-secondary-row-v50">
          <div className="rev-kpi-card-v51">
            <label>Net Earnings</label>
            <div className="val-v51">₹3,82,410</div>
          </div>
          <div className="rev-kpi-card-v51">
            <label>Total Bookings</label>
            <div className="val-v51">148</div>
          </div>
        </div>
      </div>

      {/* Revenue Trend - Focused on Revenue Only */}
      <div className="mobile-rev-trend-section-v51">
        <div className="chart-header-v51">
          <div className="header-left-v51">
            <h3 className="chart-title-v51">Revenue Trend</h3>
          </div>
          <div className="best-month-mini-v51">
            <label>Best Month</label>
            <span className="val-v51">Jan ₹1,35,000</span>
          </div>
        </div>

        <div className="mobile-scrollable-chart-v50">
          <div className="chart-viewport-v50">
            {trendData.map((d, i) => {
              const val = d.revenue;
              const height = (val / (maxVal * 1.1)) * 100;
              const isActive = selectedBar === i;
              return (
                <div
                  key={i}
                  className="chart-col-v51"
                  onClick={() => setSelectedBar(i === selectedBar ? null : i)}
                >
                  <div className="bar-track-v51">
                    <div
                      className={`bar-fill-v51 ${isActive ? 'active' : ''}`}
                      style={{ height: `${height}%` }}
                    >
                      {isActive && (
                        <div className="bar-tooltip-v51">
                          ₹{d.revenue.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                  <span className={`bar-axis-label-v51 ${isActive ? 'active' : ''}`}>{d.month}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Additional Refined Sections */}
      <div className="mobile-rev-stats-grid-v51">
        <div className="rev-card-v51">
          <div className="card-head-v51">
            <h4>Booking Performance</h4>
          </div>
          <div className="perf-summary-v51">
            <div className="perf-metric-v51">
              <label>Total Bookings</label>
              <span>148</span>
            </div>
            <div className="perf-metric-v51">
              <label>Completed Bookings</label>
              <span className="success">132</span>
            </div>
            <div className="perf-metric-v51">
              <label>Cancelled Bookings</label>
              <span className="danger">16</span>
            </div>
            <div className="perf-divider-v51"></div>
            <div className="perf-metric-v51 highlight">
              <label>Conversion Rate</label>
              <span className="rate-val-v51">89.2%</span>
            </div>
          </div>
        </div>

        <div className="rev-card-v51">
          <div className="card-head-v51">
            <h4>Revenue Breakdown</h4>
          </div>
          <div className="breakdown-v51">
            <div className="breakdown-stat-v51">
              <div className="label-bar-v51">
                <span className="dot b2b"></span>
                <label>B2B Revenue</label>
              </div>
              <span className="val-v51">₹3,25,000 (60%)</span>
            </div>
            <div className="breakdown-stat-v51">
              <div className="label-bar-v51">
                <span className="dot b2c"></span>
                <label>B2C Revenue</label>
              </div>
              <span className="val-v51">₹2,16,666 (40%)</span>
            </div>
            <div className="rev-progress-v51">
              <div className="fill-v51 b2b" style={{ width: '60%' }}></div>
              <div className="fill-v51 b2c" style={{ width: '40%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Payout Summary */}
      <div className="mobile-rev-action-card-v51">
        <div className="card-head-v51">
          <h4>Payout Summary</h4>
          <button className="text-link-v51" onClick={() => setIsHistoryOpen(true)}>
            History <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
        <div className="payout-stack-v50">
          <div className="payout-card-v50 paid">
            <label className="payout-label-v50">PAID PAYOUT</label>
            <div className="payout-val-v50">₹3,25,000</div>
            <div className="payout-badge-v50">CREDITED TO YOUR BANK</div>
          </div>
          <div className="payout-card-v50 upcoming">
            <label className="payout-label-v50">UPCOMING PAYOUT</label>
            <div className="payout-val-v50">₹65,850</div>
            <div className="payout-badge-v50">FROM 4 BOOKINGS</div>
          </div>
          <div className="payout-card-v50 processing">
            <label className="payout-label-v50">PROCESSING PAYOUT</label>
            <div className="payout-val-v50">₹35,000</div>
            <div className="payout-badge-v50">PROCESSING (1-2 DAYS)</div>
          </div>
        </div>
      </div>


      <div className="rev-footnote-v51">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
        <span>Revenue is based on completed bookings. Payouts are processed based on event schedule and settlement timelines</span>
      </div>

      {/* Payout History Sheet */}
      {isHistoryOpen && (
        <MobilePayoutHistorySheet
          onClose={() => setIsHistoryOpen(false)}
          defaultMonth={selectedMonth}
        />
      )}
    </div>
  );
};

/* ─────────────────── MOBILE PAYOUT HISTORY SHEET ─────────────────── */
const MobilePayoutHistorySheet = ({ onClose, defaultMonth }: { onClose: () => void, defaultMonth: string }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [visibleCount, setVisibleCount] = useState(5);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [activePayout, setActivePayout] = useState<any>(null);

  const mockPayouts = [
    { id: 'BK-9824', payoutDate: '25 Mar 2024', eventDate: '21 Mar 2024', amount: 45000, tds: 4500, net: 40500, status: 'Credited', bankRefId: 'TXN-982411' },
    { id: 'BK-9825', payoutDate: '26 Mar 2024', eventDate: '20 Mar 2024', amount: 32000, tds: 3200, net: 28800, status: 'Processing', bankRefId: 'TXN-982512' },
    { id: 'BK-9826', payoutDate: '27 Mar 2024', eventDate: '18 Mar 2024', amount: 15000, tds: 1500, net: 13500, status: 'Upcoming', bankRefId: 'TXN-982613' },
    { id: 'BK-9827', payoutDate: '28 Mar 2024', eventDate: '15 Mar 2024', amount: 55000, tds: 5500, net: 49500, status: 'Processing', bankRefId: 'TXN-982714' },
  ];

  const filtered = mockPayouts.filter(p => {
    const matchesSearch = p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    const matchesMonth = defaultMonth === 'All' || p.payoutDate.includes(defaultMonth);
    return matchesSearch && matchesStatus && matchesMonth;
  });

  const displayed = filtered.slice(0, visibleCount);

  const handleViewDetails = (p: any) => {
    setActivePayout(p);
    setViewMode('detail');
  };

  const handleBackToList = () => {
    setViewMode('list');
    setActivePayout(null);
  };

  return (
    <div className="mobile-sheet-overlay-v50" onClick={onClose}>
      <div className="mobile-payout-history-sheet-v50" onClick={e => e.stopPropagation()}>
        {/* Conditional Header */}
        <div className="sheet-header-v50">
          {viewMode === 'list' ? (
            <div className="header-info-v50">
              <span className="sheet-title-v50">Payout History</span>
              <p className="sheet-subtext-v50">View and download payout details</p>
            </div>
          ) : (
            <div className="sheet-header-title-row-v51">
              <button className="sheet-back-btn-v51" onClick={handleBackToList}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
              </button>
              <span className="sheet-title-v50">Payout Breakdown</span>
            </div>
          )}
          <button className="sheet-close-v50" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {viewMode === 'list' ? (
          <>
            <div className="sheet-controls-v50">
              <div className="search-box-v50">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input
                  type="text"
                  placeholder="Search Booking ID..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="filter-row-v50" style={{ justifyContent: 'space-between' }}>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ width: '100%' }}>
                  <option value="All">All Status</option>
                  <option value="Credited">Credited</option>
                  <option value="Processing">Processing</option>
                  <option value="Upcoming">Upcoming</option>
                </select>
              </div>
            </div>

            <div className="payout-card-list-v50">
              {displayed.map(p => (
                <div key={p.id} className="payout-history-card-v50">
                  <div className="card-top-v50">
                    <span className="booking-id-v50">{p.id}</span>
                    <span className={`status-badge-v50 ${p.status.toLowerCase()}`}>{p.status}</span>
                  </div>

                  <div className="card-stats-grid-v50">
                    <div className="stat-item-v50">
                      <label>Payout Date</label>
                      <span>{p.payoutDate}</span>
                    </div>
                    <div className="stat-item-v50">
                      <label>Event Date</label>
                      <span>{p.eventDate}</span>
                    </div>
                    <div className="stat-item-v50">
                      <label>Amount</label>
                      <span>₹{p.amount.toLocaleString()}</span>
                    </div>
                    <div className="stat-item-v50">
                      <label>TDS (1%)</label>
                      <span>₹{p.tds.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="card-highlight-v50">
                    <label>Net Credited Amount</label>
                    <div className="net-amount-v50">₹{p.net.toLocaleString()}</div>
                  </div>

                  <div className="card-actions-v50">
                    <button className="action-btn-v50 view" onClick={() => handleViewDetails(p)}>View</button>
                    <button
                      className={`action-btn-v50 download ${p.status !== 'Credited' ? 'disabled' : ''}`}
                      disabled={p.status !== 'Credited'}
                    >
                      Download
                    </button>
                  </div>
                </div>
              ))}

              {filtered.length > visibleCount && (
                <button className="load-more-history-v50" onClick={() => setVisibleCount(visibleCount + 10)}>
                  Load More Payouts
                </button>
              )}

              {filtered.length === 0 && (
                <div className="empty-history-v50">
                  <p>No payout matching your search/filters.</p>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Payout Breakdown Detail View */
          <div className="payout-detail-container-v50">
            <div className="payout-breakdown-top-v51">
              <div className="grid-item-v51">
                <label>BOOKING ID</label>
                <span className="booking-id-large-v51">{activePayout.id}</span>
              </div>
              <div className="grid-item-v51 align-right">
                <label>STATUS</label>
                <span className={`status-badge-v50 large ${activePayout.status.toLowerCase()}`}>{activePayout.status}</span>
              </div>
            </div>

            <div className="payout-breakdown-main-v51">
              <div className="breakdown-row-v51">
                <label>Booking Amount</label>
                <span>₹{activePayout.amount.toLocaleString()}</span>
              </div>
              <div className="breakdown-row-v51">
                <label>TDS Deducted (10%)</label>
                <span>₹{activePayout.tds.toLocaleString()}</span>
              </div>
              <div className="breakdown-divider-v51"></div>
              <div className="breakdown-row-v51 highlight">
                <label>Net Credited</label>
                <span className="net-credited-value-v51">₹{activePayout.net.toLocaleString()}</span>
              </div>
            </div>

            <div className="payout-breakdown-bottom-v51">
              <div className="breakdown-row-v51">
                <label>Bank Reference ID</label>
                <span className="bold-v51">{activePayout.bankRefId}</span>
              </div>
              <div className="breakdown-row-v51">
                <label>Date of Transfer</label>
                <span className="bold-v51">{activePayout.payoutDate}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const MobileGSTView = () => {
  const [selectedFY, setSelectedFY] = useState('FY 2025-26');
  const [selectedMonth, setSelectedMonth] = useState('Mar');

  const monthsList = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];

  return (
    <div className="mobile-gst-container-v52">
      {/* Filters Section */}
      <div className="gst-filters-v52">
        <select value={selectedFY} onChange={e => setSelectedFY(e.target.value)} className="gst-select-v52">
          <option>FY 2025–26</option>
          <option>FY 2024–25</option>
        </select>
        <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className="gst-select-v52">
          {monthsList.map(m => (
            <option key={m} value={m}>{m} '26</option>
          ))}
        </select>
      </div>

      {/* KPI Cards (Stacked Layout) */}
      <div className="gst-kpi-stack-v52">
        <div className="gst-kpi-card-v52 primary">
          <div className="card-label-v52">GST Payable</div>
          <div className="card-value-v52">₹73,051</div>
          <div className="card-subtitle-v52">After ITC adjustments</div>
        </div>
        <div className="gst-kpi-card-v52">
          <div className="card-label-v52">Taxable Amount</div>
          <div className="card-value-v52">₹4,25,840</div>
          <div className="card-subtitle-v52">Total taxable value for March FY 2025-26</div>
        </div>
        <div className="gst-kpi-card-v52">
          <div className="card-label-v52">Total GST This Month</div>
          <div className="card-value-v52">₹76,651</div>
          <div className="card-subtitle-v52">Calculated for Mar</div>
        </div>
        <div className="gst-kpi-card-v52">
          <div className="card-label-v52">ITC Available</div>
          <div className="card-value-v52">₹3,600</div>
          <div className="card-subtitle-v52">Available for credit</div>
        </div>
      </div>

      {/* Upcoming Filing Deadlines */}
      <div className="gst-section-v52">
        <h3 className="section-title-v52">Upcoming Filing Deadlines</h3>
        <div className="merged-deadline-card-v52">
          <div className="deadline-item-v52">
            <div className="deadline-info-v52">
              <span className="deadline-title-v52">GSTR-1</span>
              <span className="deadline-date-v52">Due Date: 11 Apr 2026</span>
            </div>
            <div className="deadline-badge-v52">Due in 11 days</div>
          </div>
          <div className="deadline-divider-v52"></div>
          <div className="deadline-item-v52">
            <div className="deadline-info-v52">
              <span className="deadline-title-v52">GSTR-3B</span>
              <span className="deadline-date-v52">Due Date: 20 Apr 2026</span>
            </div>
            <div className="deadline-badge-v52">Due in 20 days</div>
          </div>
        </div>
      </div>

      {/* GST Split Section */}
      <div className="gst-section-v52">
        <h3 className="section-title-v52">GST Split (Mar)</h3>
        <div className="split-card-v52">
          <div className="split-row-v52">
            <label>CGST</label>
            <span>₹17,246</span>
          </div>
          <div className="split-row-v52">
            <label>SGST</label>
            <span>₹17,246</span>
          </div>
          <div className="split-row-v52">
            <label>IGST</label>
            <span>₹42,158</span>
          </div>
          <div className="split-divider-v52"></div>
          <div className="split-row-v52">
            <label>GST Collected</label>
            <span>₹76,651</span>
          </div>
          <div className="split-row-v52 success">
            <label>ITC Available</label>
            <span>-₹3,600</span>
          </div>
          <div className="split-divider-v52"></div>
          <div className="split-row-v52 highlight">
            <label>GST Payable</label>
            <span className="payable-value-v52">₹73,051</span>
          </div>
        </div>
      </div>

      {/* GST Documents */}
      <div className="gst-section-v52">
        <h3 className="section-title-v52">GST Documents</h3>
        <div className="document-stack-v52">
          <button className="doc-btn-v52">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            <span>Download GSTR-1 Data</span>
          </button>
          <button className="doc-btn-v52">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            <span>Download GSTR-3B Summary</span>
          </button>
          <button className="doc-btn-v52">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            <span>Download B2B Invoices</span>
          </button>
          <button className="doc-btn-v52">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            <span>Download GST Summary</span>
          </button>
        </div>
      </div>

      {/* Bottom Info Section */}
      <div className="gst-footer-info-v52">
        <div className="footer-notice-v52 c-accountant">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          <p>Share this report with your <strong>Chartered Accountant (CA)</strong> for final GST filing.</p>
        </div>
        <div className="footer-notice-v52 disclaimer">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          <p>System-generated report based on your bookings. Please <strong>verify all details</strong> before filing.</p>
        </div>
      </div>
    </div>
  );
};


const MobileTDSView = () => {
  const [selectedFY, setSelectedFY] = useState('FY 2025-26');
  const [selectedQuarter, setSelectedQuarter] = useState('Q2 Jul–Sep');

  const monthlyData = [
    { month: 'Jul', earnings: 95000, tds: 950, net: 94050 },
    { month: 'Aug', earnings: 102000, tds: 1020, net: 100980 },
    { month: 'Sep', earnings: 90100, tds: 930, net: 89170 }
  ];

  const totalEarnings = monthlyData.reduce((acc, curr) => acc + curr.earnings, 0);
  const totalTDS = monthlyData.reduce((acc, curr) => acc + curr.tds, 0);
  const totalNet = monthlyData.reduce((acc, curr) => acc + curr.net, 0);

  return (
    <div className="mobile-tds-container-v53">
      {/* Filters Section (Sticky Candidate) */}
      <div className="tds-filters-v53">
        <select value={selectedFY} onChange={e => setSelectedFY(e.target.value)} className="tds-select-v53">
          <option>FY 2025–26</option>
          <option>FY 2024–25</option>
        </select>
        <select value={selectedQuarter} onChange={e => setSelectedQuarter(e.target.value)} className="tds-select-v53">
          <option>Q1 Apr–Jun</option>
          <option>Q2 Jul–Sep</option>
          <option>Q3 Oct–Dec</option>
          <option>Q4 Jan–Mar</option>
        </select>
      </div>

      {/* Summary Cards (Stacked) */}
      <div className="tds-summary-stack-v53">
        <div className="tds-summary-card-v53 primary">
          <div className="summary-label-v53">Total Net Payout</div>
          <div className="summary-value-v53">₹2,87,100</div>
          <div className="summary-subtext-v53">after TDS deduction</div>
        </div>
        <div className="tds-summary-card-v53">
          <div className="summary-label-v53">Total TDS Deducted</div>
          <div className="summary-value-v53">₹2,900</div>
          <div className="summary-subtext-v53">Deposited with Income Tax Department</div>
        </div>
      </div>

      {/* Monthly TDS Breakdown */}
      <div className="tds-section-v53">
        <div className="section-header-v53">
          <div className="title-group-v53">
            <h3 className="section-title-v53">Monthly TDS Breakdown</h3>
            <span className="section-subtitle-v53">Q2 (Jul–Sep 2025)</span>
          </div>
          <button className="export-btn-v53">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            <span>Excel</span>
          </button>
        </div>

        <div className="tds-month-stack-v53">
          {monthlyData.map(d => (
            <div key={d.month} className="tds-month-card-v53">
              <div className="month-name-v53">{d.month} 2025</div>
              <div className="month-grid-v53">
                <div className="grid-item-v53">
                  <label>Earnings</label>
                  <span>₹{d.earnings.toLocaleString()}</span>
                </div>
                <div className="grid-item-v53">
                  <label>TDS</label>
                  <span>₹{d.tds.toLocaleString()}</span>
                </div>
                <div className="grid-item-v53 highlight">
                  <label>Net Received</label>
                  <span className="net-val-v53">₹{d.net.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}

          {/* Total Row */}
          <div className="tds-total-card-v53">
            <div className="total-label-v53">Quarter Total</div>
            <div className="month-grid-v53">
              <div className="grid-item-v53">
                <label>Total Earnings</label>
                <span>₹{totalEarnings.toLocaleString()}</span>
              </div>
              <div className="grid-item-v53">
                <label>Total TDS</label>
                <span>₹{totalTDS.toLocaleString()}</span>
              </div>
              <div className="grid-item-v53 highlight">
                <label>Net Received</label>
                <span className="net-val-v53">₹{totalNet.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
        <p className="tds-footnote-v53">
          This data matches your Form 16A and will also reflect in Form 26AS.
        </p>
      </div>

      {/* TDS Certificate Section */}
      <div className="tds-section-v53 certificate-bg">
        <div className="cert-header-v53">
          <div className="title-group-v53">
            <h3 className="section-title-v53">Your TDS Certificate (Form 16A)</h3>
            <span className="cert-status-badge-v53">Available</span>
          </div>
        </div>
        <div className="cert-details-v53">
          <div className="cert-detail-row-v53">
            <label>Quarter</label>
            <span>Q2 (Jul–Sep 2025)</span>
          </div>
          <div className="cert-detail-row-v53">
            <label>Issued on</label>
            <span>15 Nov 2025</span>
          </div>
        </div>
        <p className="cert-info-v53">
          Your TDS certificate for the selected period is ready for download.
        </p>
        <button className="primary-doc-btn-v53">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          Download Certificate (Form 16A)
        </button>
        <p className="cert-helper-v53">
          This certificate will also reflect in Form 26AS.
        </p>
      </div>
    </div>
  );
};

const MobileReportsView = () => {
  const [activeTab, setActiveTab] = useState('revenue');

  return (
    <div className="mobile-reports-page-v50">
      <div className="reports-primary-header-v51">
        <h1>Reports</h1>
      </div>
      <div className="reports-tab-nav-v50">
        <button
          className={`report-nav-item-v50 ${activeTab === 'revenue' ? 'active' : ''}`}
          onClick={() => setActiveTab('revenue')}
        >
          Revenue
        </button>
        <button
          className={`report-nav-item-v50 ${activeTab === 'gst' ? 'active' : ''}`}
          onClick={() => setActiveTab('gst')}
        >
          GST
        </button>
        <button
          className={`report-nav-item-v50 ${activeTab === 'tds' ? 'active' : ''}`}
          onClick={() => setActiveTab('tds')}
        >
          TDS
        </button>
      </div>

      <div className="report-view-content-v50">
        {activeTab === 'revenue' ? (
          <MobileRevenueView />
        ) : activeTab === 'gst' ? (
          <MobileGSTView />
        ) : activeTab === 'tds' ? (
          <MobileTDSView />
        ) : (
          <div className="report-coming-soon-v51">
            <div className="icon-v51">📊</div>
            <h4>{activeTab.toUpperCase()} Reports</h4>
            <p>We're polishing this view for you.</p>
          </div>
        )}
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
  // Menu Creation Props
  isAddingMenu: boolean;
  setIsAddingMenu: (val: boolean) => void;
  menuStep: number;
  setMenuStep: (step: number | ((prev: number) => number)) => void;
  menuIdentity: any;
  setMenuIdentity: (val: any | ((prev: any) => any)) => void;
  sections: any[];
  setSections: (val: any[] | ((prev: any[]) => any[])) => void;
  isAddingSection: boolean;
  setIsAddingSection: (val: boolean) => void;
  currentSection: any;
  setCurrentSection: (val: any | ((prev: any) => any)) => void;
  sectionEditingIndex: number | null;
  setSectionEditingIndex: (val: number | null) => void;
  resetAddMenu: () => void;
  handleImageUpload: (e: any) => void;
  handleSaveSection: () => void;
  menuEditingId: number | null;
  setMenuEditingId: (val: number | null) => void;
  menus: any[];
  setMenus: (val: any[] | ((prev: any[]) => any[])) => void;
}

/* ─────────────────── MOBILE COUPONS VIEW (v58) ─────────────────── */

const MobileCouponsView = () => {
  const [activeSubTab, setActiveSubTab] = useState<'vendor' | 'platform'>('vendor');
  const [coupons, setCoupons] = useState([
    { id: '1', code: 'WELCOME10', type: 'Percentage', value: '10%', status: 'Active', usage: '45/100', validFrom: '2026-03-01', validTo: '2026-03-31', maxCap: '500', minAmount: '1000', source: 'vendor', applicability: 'orders' },
    { id: '2', code: 'FLAT500', type: 'Flat Amount', value: '₹500', status: 'Paused', usage: '12/50', validFrom: '2026-03-20', validTo: '2026-04-15', minAmount: '2000', source: 'vendor', applicability: 'orders' },
    { id: '3', code: 'PLATFORM25', type: 'Percentage', value: '25%', status: 'Active', usage: '1050/5000', validFrom: '2026-01-01', validTo: '2026-12-31', maxCap: '1000', minAmount: '2000', source: 'platform', applicability: 'subscription' },
    { id: '4', code: 'HOLIDAY15', type: 'Percentage', value: '15%', status: 'Active', usage: '800/2000', validFrom: '2026-03-15', validTo: '2026-04-30', maxCap: '750', minAmount: '1500', source: 'platform', applicability: 'orders' },
  ]);

  const filteredCoupons = coupons.filter(c => c.source === activeSubTab);

  const renderValidityStatus = (validTo: string) => {
    const expiry = new Date(validTo);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: 'Expired', class: 'validity-urgent-v58' };
    if (diffDays === 0) return { text: 'Expires today', class: 'validity-urgent-v58' };
    if (diffDays <= 3) return { text: `${diffDays} days left`, class: 'validity-soon-v58' };
    return { text: `${diffDays} days left`, class: 'validity-calm-v58' };
  };

  const getUsagePercentage = (usage: string) => {
    const [current, total] = usage.split('/');
    if (total === '∞') return 100;
    return Math.min(100, (parseInt(current) / parseInt(total)) * 100);
  };

  const toggleStatus = (id: string) => {
    setCoupons(prev => prev.map(c => 
      c.id === id ? { ...c, status: c.status === 'Active' ? 'Paused' : 'Active' } : c
    ));
  };

  return (
    <div className="mobile-coupons-container-v58 mobile-scroller-v50">
      <div className="mobile-home-header-v50" style={{ marginBottom: '16px' }}>
        <h1 className="mobile-title-v50">Coupons Hub</h1>
        <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '4px 0 0' }}>Manage your promotional offers and monitor usage.</p>
      </div>

      <div className="coupons-tab-bar-v58">
        <button 
          className={`coupon-tab-btn-v58 ${activeSubTab === 'vendor' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('vendor')}
        >
          My Coupons
          <span className="coupon-count-badge-v58">{coupons.filter(c => c.source === 'vendor').length}</span>
        </button>
        <button 
          className={`coupon-tab-btn-v58 ${activeSubTab === 'platform' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('platform')}
        >
          Platform Coupons
          <span className="coupon-count-badge-v58">{coupons.filter(c => c.source === 'platform').length}</span>
        </button>
      </div>

      <div className="mobile-coupon-stack-v58">
        {filteredCoupons.map(coupon => {
          const validity = renderValidityStatus(coupon.validTo);
          const usagePct = getUsagePercentage(coupon.usage);
          
          return (
            <div key={coupon.id} className="mobile-coupon-card-v58">
              <div className="coupon-card-head-v58">
                <span className="coupon-code-badge-v58">{coupon.code}</span>
                <span className={`coupon-status-pill-v58 status-${coupon.status.toLowerCase()}-v58`}>
                  {coupon.status}
                </span>
              </div>

              <div className="coupon-meta-row-v58">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span className="coupon-type-v58">{coupon.type}</span>
                  <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700 }}>
                    Applied for {coupon.applicability.toUpperCase()}
                  </span>
                </div>
                <span className="coupon-value-v58">{coupon.value}</span>
              </div>

              <div className="coupon-validity-v58">
                <div className="validity-dates-v58">
                  {new Date(coupon.validFrom).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} → {new Date(coupon.validTo).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                </div>
                <div className={`validity-status-v58 ${validity.class}`}>
                  {validity.text}
                </div>
              </div>

              <div className="coupon-usage-box-v58">
                <div className="usage-stats-v58">
                  <span className="usage-label-v58">Usage Limit</span>
                  <span className="usage-value-v58">{coupon.usage}</span>
                </div>
                <div className="usage-bar-track-v58">
                  <div className="usage-bar-fill-v58" style={{ width: `${usagePct}%` }}></div>
                </div>
              </div>

              {coupon.source === 'vendor' && (
                <div className="coupon-footer-v58">
                  <button className="coupon-action-btn-v58" onClick={() => toggleStatus(coupon.id)}>
                    {coupon.status === 'Active' ? (
                      <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg> Pause</>
                    ) : (
                      <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg> Resume</>
                    )}
                  </button>
                  <button className="coupon-action-btn-v58 primary">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    Edit
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {activeSubTab === 'vendor' && (
        <button className="coupons-fab-v58">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </button>
      )}
    </div>
  );
};

const MobileSupportView = () => {
  const [category, setCategory] = useState('');
  const [bookingId, setBookingId] = useState('');
  const [description, setDescription] = useState('');

  const categories = [
    'Technical Issue',
    'Payment / Payout Issue',
    'Booking Issue',
    'Account Access',
    'Other'
  ];

  const recentBookings = [
    { id: 'BK-10821', customer: 'Ananya Sharma' },
    { id: 'BK-10744', customer: 'Ravi Krishnan' },
  ];

  const tickets = [
    { id: 'TKT-8842', category: 'Payment / Payout Issue', date: 'Oct 24, 2023', status: 'In Review' },
    { id: 'TKT-8711', category: 'Technical Issue', date: 'Oct 20, 2023', status: 'Resolved' },
    { id: 'TKT-8605', category: 'Booking Issue', date: 'Oct 15, 2023', status: 'Resolved' },
  ];

  return (
    <div className="mobile-support-container-v57 mobile-scroller-v50">
      <div className="mobile-home-header-v50" style={{ marginBottom: '20px' }}>
        <h1 className="mobile-title-v50">Support Tickets</h1>
        <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '4px 0 0' }}>Raise a new issue or track your recent support requests.</p>
      </div>

      <div className="support-form-card-v57">
        <span className="support-section-title-v57">Create New Ticket</span>
        
        <div className="support-form-group-v57">
          <label className="support-label-v57">Issue Category</label>
          <select 
            className="support-select-v57"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        <div className="support-form-group-v57">
          <label className="support-label-v57">Booking ID</label>
          <select 
            className="support-select-v57"
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
            disabled={!category}
          >
            <option value="">{category ? 'Select Recent Booking' : 'Select category first'}</option>
            {recentBookings.map(b => (
              <option key={b.id} value={b.id}>{b.id} — {b.customer}</option>
            ))}
          </select>
        </div>

        <div className="support-form-group-v57">
          <label className="support-label-v57">Describe Your Issue</label>
          <textarea 
            className="support-textarea-v57"
            placeholder="Tell us more about the problem you're facing..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div className="support-form-group-v57">
          <label className="support-label-v57">Proof Upload</label>
          <div className="support-upload-zone-v57">
            <svg className="support-upload-icon-v57" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
            <span className="support-upload-text-v57">Click to upload or drag & drop</span>
            <p className="support-upload-sub-v57">Images, PDF, or DOC (Max 5 files, 10MB each)</p>
          </div>
        </div>

        <button className="support-submit-btn-v57">Submit Ticket</button>
      </div>

      <div className="recent-tickets-header-v57">
        <span className="support-section-title-v57" style={{ marginBottom: '8px' }}>Recent Tickets</span>
      </div>

      <div className="mobile-ticket-stack-v57">
        {tickets.map(tkt => (
          <div key={tkt.id} className="mobile-ticket-card-v57">
            <div className="tkt-card-head-v57">
              <span className="tkt-id-v57">{tkt.id}</span>
              <span className={`tkt-status-v57 ${tkt.status.toLowerCase().replace(/ /g, '-')}`}>
                {tkt.status}
              </span>
            </div>
            <div className="tkt-category-v57">{tkt.category}</div>
            <div className="tkt-date-v57">Created on {tkt.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MobileRatingsView = () => {
  const [filter, setFilter] = useState('All');
  const [showStatus, setShowStatus] = useState(false);

  const reviews = [
    { id: 1, customer: 'Ananya Sharma', bookingId: 'BK-10821', eventDate: '12 Mar 2026', rating: 5, review: 'Absolutely amazing food and service! The team was incredibly professional and the presentation was stunning. Guests kept complimenting the food throughout. Highly recommend!' },
    { id: 2, customer: 'Ravi Krishnan', bookingId: 'BK-10744', eventDate: '5 Mar 2026', rating: 4, review: 'Good overall experience. Food was tasty but setup took a little longer than expected. Would consider booking again.' },
    { id: 3, customer: 'Meera Patel', bookingId: 'BK-10632', eventDate: '28 Feb 2026', rating: 5, review: 'Outstanding experience from start to finish. The menu customisation was excellent and the staff were very attentive.' },
    { id: 4, customer: 'Siddharth R.', bookingId: 'BK-10589', eventDate: '20 Feb 2026', rating: 3, review: 'Food was decent but portions were a bit small for the group size. Communication could improve.' },
    { id: 5, customer: 'Lakshmi N.', bookingId: 'BK-10502', eventDate: '14 Feb 2026', rating: 5, review: "Loved every bit of it! The Valentine's Day special menu was a hit. Thank you for making it memorable." },
    { id: 6, customer: 'Vikram Singh', bookingId: 'BK-10499', eventDate: '12 Feb 2026', rating: 5, review: 'Exceptional service and the food quality was top-notch. Highly recommended for any large gathering!' },
  ];

  const breakdown = [
    { stars: 5, count: 8 },
    { stars: 4, count: 4 },
    { stars: 3, count: 3 },
    { stars: 2, count: 0 },
    { stars: 1, count: 0 },
  ];

  const filteredReviews = filter === 'All' 
    ? reviews 
    : reviews.filter(r => r.rating === parseInt(filter));

  const totalReviews = 15;

  const renderStars = (rating: number) => {
    return (
      <div className="review-rating-stars-v56">
        {[1, 2, 3, 4, 5].map(star => (
          <svg key={star} width="12" height="12" viewBox="0 0 24 24" fill={star <= rating ? '#f59e0b' : 'none'} stroke={star <= rating ? '#f59e0b' : '#cbd5e1'} strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="mobile-ratings-container-v56 mobile-scroller-v50">
      <div className="mobile-home-header-v50" style={{ marginBottom: '20px' }}>
        <h1 className="mobile-title-v50">Ratings & Reviews</h1>
        <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '4px 0 0' }}>What your customers are saying</p>
      </div>

      <div className="ratings-hero-card-v56">
        <span className="hero-star-v56">⭐</span>
        <div className="hero-rating-value-v56">4.3</div>
        <div className="hero-rating-label-v56">Overall Rating</div>
        
        <button className="hero-badge-v56" onClick={() => setShowStatus(true)} style={{ cursor: 'pointer', border: '1px solid #dcfce7' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
          Excellent
        </button>
        
        <div className="hero-reviews-total-v56">{totalReviews} customer reviews</div>
      </div>

      <div className="ratings-breakdown-box-v56">
        <h3 className="breakdown-title-v56">Rating Breakdown</h3>
        {breakdown.map((item) => (
          <div key={item.stars} className="breakdown-row-v56">
            <span className="breakdown-star-label-v56">{item.stars}★</span>
            <div className="breakdown-bar-track-v56">
              <div 
                className="breakdown-bar-fill-v56" 
                style={{ 
                  width: `${(item.count / totalReviews) * 100}%`,
                  background: item.stars >= 4 ? '#22c55e' : item.stars === 3 ? '#f59e0b' : '#ef4444'
                }}
              ></div>
            </div>
            <span className="breakdown-count-v56">{item.count}</span>
          </div>
        ))}

        <div className="ratings-insight-v56">
          <span className="insight-icon-v56">💡</span>
          <div className="insight-text-v56">
            Customers appreciate <strong>food quality</strong> and <strong>presentation</strong> most.
          </div>
        </div>
      </div>

      {/* Filter Horizontal Scroll */}
      <div className="mobile-ratings-filters-v56">
        {['All', '5', '4', '3', '2', '1'].map(f => (
          <button 
            key={f} 
            className={`rating-filter-chip-v56 ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'All' ? 'All' : `${f}★`}
          </button>
        ))}
      </div>

      {/* Review List */}
      <div className="mobile-reviews-list-v56">
        {filteredReviews.length > 0 ? (
          filteredReviews.map(review => (
            <div key={review.id} className="mobile-review-card-v56">
              <div className="review-card-head-v56">
                <div className="review-user-info-v56">
                  <div className="review-avatar-v56">{review.customer.charAt(0)}</div>
                  <div className="review-name-stack-v56">
                    <span className="review-user-name-v56">{review.customer}</span>
                    <div className="review-meta-row-v56">
                      <span>{review.bookingId}</span>
                      <span>•</span>
                      <span>{review.eventDate}</span>
                    </div>
                  </div>
                </div>
                {renderStars(review.rating)}
              </div>
              <p className="review-text-v56">{review.review}</p>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8', fontSize: '0.85rem' }}>
            No reviews found for this filter.
          </div>
        )}
      </div>

      {/* Performance Status Popup */}
      {showStatus && (
        <div className="performance-status-overlay-v56" onClick={() => setShowStatus(false)}>
          <div className="performance-status-content-v56" onClick={e => e.stopPropagation()}>
            <button className="perf-popup-close-v56" onClick={() => setShowStatus(false)}>×</button>
            <span className="perf-status-label-v56">PERFORMANCE STATUS</span>
            <h3 className="perf-status-headline-v56">Boosted visibility applied</h3>
            
            <div className="perf-status-divider-v56"></div>
            
            <div className="perf-scale-grid-v56">
              <div className="perf-scale-item-v56 active">
                <span className="perf-scale-range-v56">4.0 - 5.0</span>
                <span className="perf-scale-label-v56">Excellent</span>
              </div>
              <div className="perf-scale-item-v56">
                <span className="perf-scale-range-v56">3.5 - 3.9</span>
                <span className="perf-scale-label-v56">Good</span>
              </div>
              <div className="perf-scale-item-v56">
                <span className="perf-scale-range-v56">3.0 - 3.4</span>
                <span className="perf-scale-label-v56">Average</span>
              </div>
              <div className="perf-scale-item-v56">
                <span className="perf-scale-range-v56">2.5 - 2.9</span>
                <span className="perf-scale-label-v56">Needs Attention</span>
              </div>
              <div className="perf-scale-item-v56">
                <span className="perf-scale-range-v56">Below 2.5</span>
                <span className="perf-scale-label-v56">Under Review</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─────────────────── MOBILE GST FILING VIEW (v52) ─────────────────── */

const MobileSectionEditor = ({
  currentSection,
  setCurrentSection,
  setIsAddingSection,
  handleSaveSection
}: any) => {
  const addItem = () => {
    setCurrentSection((prev: any) => ({
      ...prev,
      items: [...prev.items, { name: '', description: '', image: null }]
    }));
  };

  const removeItem = (index: number) => {
    setCurrentSection((prev: any) => ({
      ...prev,
      items: prev.items.filter((_: any, i: number) => i !== index)
    }));
  };

  const updateItem = (index: number, field: string, value: any) => {
    setCurrentSection((prev: any) => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };
      return { ...prev, items: newItems };
    });
  };

  const handleItemImage = (index: number) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          updateItem(index, 'image', reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  return (
    <div className="mobile-bottom-sheet-overlay-v55" onClick={() => setIsAddingSection(false)}>
      <div className="mobile-bottom-sheet-v55" onClick={(e) => e.stopPropagation()}>
        <div className="bottom-sheet-content-v55">
          <div className="mobile-form-group-v55">
            <label className="mobile-form-label-big-v55">Section Name</label>
            <input 
              type="text" 
              className="mobile-input-v55" 
              placeholder="e.g. Starters"
              style={{ background: 'white', border: '1.5px solid #eef2f6' }}
              value={currentSection.name}
              onChange={(e) => setCurrentSection((prev: any) => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div className="selection-row-v55">
            <div className="selection-type-col-v55">
              <label className="mobile-form-label-big-v55">Selection Type</label>
              <select 
                className="mobile-select-v55"
                value={currentSection.type}
                onChange={(e) => setCurrentSection((prev: any) => ({ ...prev, type: e.target.value }))}
              >
                <option value="All Included">All Included</option>
                <option value="Limited Selection">Limited Selection</option>
              </select>
            </div>
            <div className="selection-limit-col-v55">
              <label className="mobile-form-label-big-v55">Choose Any</label>
              <input 
                type="number" 
                className="mobile-input-v55" 
                placeholder="0"
                style={{ background: 'white', border: '1.5px solid #eef2f6', textAlign: 'center' }}
                value={currentSection.limit || ''}
                disabled={currentSection.type === 'All Included'}
                onChange={(e) => setCurrentSection((prev: any) => ({ ...prev, limit: parseInt(e.target.value) || 0 }))}
              />
            </div>
          </div>

          <div style={{ borderTop: '1px solid #f1f5f9', margin: '24px 0' }}></div>

          <h3 className="mobile-form-label-big-v55">Items in this Section</h3>
          
          <div className="mobile-items-list-v55">
            {currentSection.items.map((item: any, i: number) => (
              <div key={i} className="item-editor-card-v55" style={{ position: 'relative' }}>
                <div className="photo-upload-placeholder-v55" onClick={() => handleItemImage(i)}>
                  {item.image ? (
                    <img src={item.image} alt="Item" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                      <span>Photo</span>
                    </>
                  )}
                  {item.image && (
                    <button 
                      style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}
                      onClick={(e) => { e.stopPropagation(); updateItem(i, 'image', null); }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                  )}
                </div>
                <div className="item-editor-fields-v55">
                  <input 
                    type="text" 
                    className="item-name-input-v55" 
                    placeholder="Item Name"
                    value={item.name}
                    onChange={(e) => updateItem(i, 'name', e.target.value)}
                  />
                  <textarea 
                    className="item-desc-textarea-v55"
                    placeholder="Short Description (max 1000 chars)"
                    value={item.description}
                    onChange={(e) => updateItem(i, 'description', e.target.value)}
                  />
                </div>
                {currentSection.items.length > 1 && (
                  <button 
                    style={{ position: 'absolute', right: '-8px', top: '-8px', background: '#fee2e2', border: 'none', color: '#ef4444', padding: '6px', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', zIndex: 3 }}
                    onClick={() => removeItem(i)}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                )}
              </div>
            ))}
          </div>

          <button className="btn-add-item-dashed-v55" onClick={addItem}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Add Another Item
          </button>

          <div style={{ display: 'flex', gap: '12px', marginTop: '32px', paddingBottom: '24px' }}>
            <button className="btn-cancel-v55" style={{ flex: 1 }} onClick={() => setIsAddingSection(false)}>Cancel</button>
            <button 
              className="btn-save-v55" 
              style={{ flex: 2 }}
              disabled={!currentSection.name || currentSection.items.some((it: any) => !it.name)}
              onClick={handleSaveSection}
            >
              Save Section
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MobileCreateMenuView = ({
  menuStep,
  setMenuStep,
  menuIdentity,
  setMenuIdentity,
  sections,
  setSections,
  isAddingSection,
  setIsAddingSection,
  currentSection,
  setCurrentSection,
  setSectionEditingIndex,
  resetAddMenu,
  handleImageUpload,
  handleSaveSection,
  menuEditingId,
  setMenus
}: any) => {
  const totalItems = sections.reduce((acc: number, sec: any) => acc + (sec.items?.length || 0), 0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNext = () => {
    if (menuStep < 3) setMenuStep((s: number) => s + 1);
  };

  const handleBack = () => {
    if (menuStep > 1) setMenuStep((s: number) => s - 1);
    else resetAddMenu();
  };

  const finalizeSave = () => {
    if (menuEditingId) {
      setMenus((prev: any[]) => prev.map((m: any) => m.id === menuEditingId ? {
        ...m,
        name: menuIdentity.name,
        price: parseInt(menuIdentity.price) || 0,
        minMembers: menuIdentity.minMembers,
        maxMembers: menuIdentity.maxMembers,
        dietType: menuIdentity.dietType,
        image: menuIdentity.image,
        sections: [...sections]
      } : m));
    } else {
      const newMenuObj = {
        id: Date.now(),
        name: menuIdentity.name,
        price: parseInt(menuIdentity.price) || 0,
        status: 'Active',
        category: 'breakfast', // Default for now
        minMembers: menuIdentity.minMembers,
        maxMembers: menuIdentity.maxMembers,
        dietType: menuIdentity.dietType,
        image: menuIdentity.image,
        sections: [...sections]
      };
      setMenus((prev: any[]) => [...prev, newMenuObj]);
    }
    resetAddMenu();
  };

  return (
    <div className="mobile-create-menu-view-v55">
      <div className="mobile-create-header-v55" style={{ padding: '24px 20px 0 20px', height: 'auto', borderBottom: 'none', position: 'relative' }}>
        <div className="header-center-v55" style={{ textAlign: 'left', margin: 0 }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '4px' }}>{menuEditingId ? 'Edit Menu' : 'Create New Menu'}</h2>
          <p style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: '500', marginBottom: '12px' }}>Create menu basics before adding food sections</p>
        </div>
        <button className="close-btn-header-v55" onClick={resetAddMenu}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>

      <div className="mobile-create-content-v55" style={{ padding: '0 20px 20px' }}>
        <div className="step-indicator-v55" style={{ marginBottom: '24px' }}>
          <div className="step-progress-bar-v55">
            <div className="step-progress-fill-v55" style={{ width: `${(menuStep / 3) * 100}%` }}></div>
          </div>
        </div>

        {menuStep === 1 && (
          <div className="mobile-form-section-v55">
            <div className="mobile-form-group-v55">
              <label className="mobile-label-v55">Menu Name</label>
              <input 
                type="text" 
                className="mobile-input-v55" 
                placeholder="e.g. Premium Buffet"
                value={menuIdentity.name}
                onChange={(e) => setMenuIdentity((prev: any) => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className="mobile-form-group-v55">
              <label className="mobile-label-v55">Diet Preference</label>
              <div className="mobile-radio-group-v55">
                {['Veg', 'Non-Veg'].map(type => (
                  <button 
                    key={type}
                    className={`mobile-radio-btn-v55 ${type === 'Veg' ? 'veg' : 'nonveg'} ${menuIdentity.dietType === type ? 'active' : ''}`}
                    onClick={() => setMenuIdentity((prev: any) => ({ ...prev, dietType: type }))}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="0.5" y="0.5" width="11" height="11" rx="1.5" stroke="currentColor" /><circle cx="6" cy="6" r="3" fill="currentColor" /></svg>
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="mobile-form-group-v55">
              <label className="mobile-label-v55">Price Per Person</label>
              <div className="mobile-input-prefix-v55">
                <span className="mobile-prefix-v55">₹</span>
                <input 
                  type="number" 
                  className="mobile-input-v55" 
                  placeholder="0"
                  value={menuIdentity.price}
                  onChange={(e) => setMenuIdentity((prev: any) => ({ ...prev, price: e.target.value }))}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div className="mobile-form-group-v55" style={{ flex: 1 }}>
                <label className="mobile-label-v55">Min Pax</label>
                <input 
                  type="number" 
                  className="mobile-input-v55" 
                  placeholder="10"
                  value={menuIdentity.minMembers}
                  onChange={(e) => setMenuIdentity((prev: any) => ({ ...prev, minMembers: e.target.value }))}
                />
              </div>
              <div className="mobile-form-group-v55" style={{ flex: 1 }}>
                <label className="mobile-label-v55">Max Pax</label>
                <input 
                  type="number" 
                  className="mobile-input-v55" 
                  placeholder="500"
                  value={menuIdentity.maxMembers}
                  onChange={(e) => setMenuIdentity((prev: any) => ({ ...prev, maxMembers: e.target.value }))}
                />
              </div>
            </div>

            <div className="mobile-form-group-v55">
              <label className="mobile-label-v55">Menu Cover Image</label>
              <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImageUpload} accept="image/*" />
              <div className={`mobile-image-upload-v55 ${menuIdentity.image ? 'has-image' : ''}`} onClick={() => fileInputRef.current?.click()}>
                {menuIdentity.image ? (
                  <>
                    <img src={menuIdentity.image} alt="Preview" className="mobile-upload-preview-v55" />
                    <div className="mobile-upload-overlay-v55">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M23 4v6h-6"></path><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
                      Change
                    </div>
                  </>
                ) : (
                  <>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                    <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '500' }}>Upload Menu Image</span>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {menuStep === 2 && (
          <div className="mobile-step-container-v55">
            <span className="menu-section-label-muted-v55">EXAMPLE</span>
            <div className="example-placeholder-v55"></div>

            <h3 className="menu-title-big-v55">Sections</h3>
            <span className="menu-subtitle-v55">Build food groups inside this menu</span>

            <div className="menu-created-alert-v55">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              Menu was created you can customise or edit from dashboard
            </div>
            
            {sections.length === 0 && !isAddingSection && (
              <div className="no-sections-empty-state-v55">
                <div className="icon-circle-v55">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="M12 20v-6M9 20v-10M6 20v-4M15 20v-12M18 20v-16"></path></svg>
                </div>
                <h4>No sections added yet</h4>
                <p>Start by creating your first food group like Starters or Main Course</p>
                <button 
                  className="mobile-btn-v55 btn-add-first-sec-v55"
                  onClick={() => {
                    setCurrentSection({ name: '', type: 'All Included', limit: 0, items: [{ name: '', description: '', image: null }] });
                    setIsAddingSection(true);
                    setSectionEditingIndex(null);
                  }}
                >
                  + Add First Section
                </button>
              </div>
            )}

            <div className="mobile-sections-list-v55">
              {sections.map((sec: any, idx: number) => (
                <div key={idx} className="mobile-section-card-v55">
                  <div className="sec-info-v55">
                    <h4>{sec.name}</h4>
                    <p>{sec.items.length} Items • {sec.type === 'All Included' ? 'All Chosen' : `Choose ${sec.limit}`}</p>
                  </div>
                  <div className="sec-actions-v55">
                    <button className="mobile-action-btn-v50" onClick={() => {
                      setCurrentSection({ ...sec });
                      setSectionEditingIndex(idx);
                      setIsAddingSection(true);
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0077ff" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button className="mobile-action-btn-v50" onClick={() => setSections((prev: any[]) => prev.filter((_: any, i: number) => i !== idx))}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {!isAddingSection && sections.length > 0 && (
              <button 
                className="btn-add-item-dashed-v55" 
                style={{ marginTop: '16px', border: '1.5px solid #eef2f6', color: '#475569', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}
                onClick={() => {
                  setCurrentSection({ name: '', type: 'All Included', limit: 0, items: [{ name: '', description: '', image: null }] });
                  setIsAddingSection(true);
                  setSectionEditingIndex(null);
                }}
              >
                + Add Section
              </button>
            )}

            {isAddingSection && (
              <MobileSectionEditor 
                currentSection={currentSection}
                setCurrentSection={setCurrentSection}
                setIsAddingSection={setIsAddingSection}
                handleSaveSection={handleSaveSection}
              />
            )}
          </div>
        )}

        {menuStep === 3 && (
          <div className="mobile-step-container-v55">
            <h3 className="mobile-h3-v50" style={{ marginBottom: '16px' }}>Review Menu</h3>
            
            <div className="mobile-form-section-v55" style={{ padding: '0', overflow: 'hidden' }}>
              <div style={{ width: '100%', height: '140px', background: '#f1f5f9' }}>
                {menuIdentity.image ? (
                  <img src={menuIdentity.image} alt="Menu" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>No Image</div>
                )}
              </div>
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: '#1e293b' }}>{menuIdentity.name || 'Untitled Menu'}</h4>
                  <span className={`card-status-pill-v50 ${menuIdentity.dietType === 'Veg' ? 'info' : 'warning'}`} style={{ fontSize: '0.7rem' }}>{menuIdentity.dietType}</span>
                </div>
                <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '600', marginBottom: '12px' }}>
                  {sections.length} Sections • {totalItems} Items
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0077ff' }}>₹{menuIdentity.price || '0'}<span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '500' }}> /person</span></div>
              </div>
            </div>

            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#1e293b', marginBottom: '12px' }}>Contents</h4>
            <div className="mobile-sections-list-v55">
              {sections.map((sec: any, i: number) => (
                <div key={i} className="mobile-section-card-v55" style={{ display: 'block' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>{sec.name}</span>
                      <span style={{ fontSize: '0.75rem', background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', color: '#475569' }}>{sec.type}</span>
                   </div>
                   <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {sec.items.map((it: any, j: number) => (
                        <span key={j} style={{ fontSize: '0.8rem', color: '#64748b' }}>{it.name}{j < sec.items.length - 1 ? ' • ' : ''}</span>
                      ))}
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mobile-sticky-footer-v55" style={{ padding: '8px 20px 12px 20px' }}>
        <div className="step-pill-v55">STEP {menuStep}/3</div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
          <button className="mobile-btn-v55 mobile-btn-outline-v55" style={{ border: '1.5px solid #e2e8f0', color: '#1e293b', fontWeight: '700', padding: '8px 16px', fontSize: '0.75rem' }} onClick={handleBack}>
            {menuStep === 1 ? 'Cancel' : 'Back'}
          </button>
          <button 
            className="mobile-btn-v55 mobile-btn-primary-v55" 
            style={{ padding: '8px 24px', borderRadius: '10px', fontSize: '0.75rem' }}
            disabled={menuStep === 1 && !menuIdentity.name}
            onClick={menuStep === 3 ? finalizeSave : handleNext}
          >
            {menuStep === 3 ? (menuEditingId ? 'Update' : 'Next') : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

const MobileServiceSettingsView = ({ 
  setIsAddingMenu, 
  menus, 
  setMenus,
  setMenuIdentity,
  setSections,
  setMenuEditingId,
  setMenuStep
}: { 
  setIsAddingMenu: (val: boolean) => void,
  menus: any[],
  setMenus: (val: any[] | ((prev: any[]) => any[])) => void,
  setMenuIdentity: (val: any | ((prev: any) => any)) => void,
  setSections: (val: any[] | ((prev: any[]) => any[])) => void,
  setMenuEditingId: (val: number | null) => void,
  setMenuStep: (val: number | ((prev: number) => number)) => void
}) => {
  const [activeService, setActiveService] = useState('Breakfast');
  const [isAcceptingOrders, setIsAcceptingOrders] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStyles, setSelectedStyles] = useState(['Buffet']);
  const [menuFilter, setMenuFilter] = useState('All');
  const [stopAcceptValue, setStopAcceptValue] = useState(2);
  const [stopAcceptUnit, setStopAcceptUnit] = useState('Hours');
  const [manageBookingsCount, setManageBookingsCount] = useState(1);

  const toggleStyle = (style: string) => {
    if (!isEditing) return;
    setSelectedStyles(prev => {
      if (prev.includes(style)) {
        if (prev.length > 1) return prev.filter(s => s !== style);
        return prev;
      }
      return [...prev, style];
    });
  };

  const services = ['Breakfast', 'Lunch', 'Snacks', 'Dinner'];
  const filteredMenus = menus.filter((m: any) => 
    (menuFilter === 'All' || m.dietType === menuFilter) && 
    (m.category?.toLowerCase() === activeService.toLowerCase() || !m.category)
  );

  return (
    <div className="mobile-service-settings-v54">
      {/* Primary Header with Tabs (Reports-style) */}
      <div className="service-header-v54">
        <h1 className="service-title-v54">Service Settings</h1>
        <div className="service-tabs-nav-v54">
          {services.map(s => (
            <button
              key={s}
              className={`service-tab-item-v54 ${activeService === s ? 'active' : ''}`}
              onClick={() => setActiveService(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="settings-scroller-v54">
        {/* Accepting Orders Row */}
        <div className="order-toggle-row-v54">
          <span>Accepting Orders</span>
          <div 
            className={`toggle-switch-v54 ${isAcceptingOrders ? 'on' : ''}`}
            onClick={() => setIsAcceptingOrders(!isAcceptingOrders)}
          >
            <div className="toggle-knob-v54"></div>
          </div>
        </div>

        {/* Merged Settings & Style Card */}
        <div className="settings-card-v54">
          <div className="card-header-v54">
            <h3>Service Configuration</h3>
            <button className="edit-action-btn-v54" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          <div className="card-subsection-v54">
            <h4 className="card-subtitle-v54">Timing & Bookings</h4>
            <div className="form-grid-v54">
              <div className="form-group-v54">
                <label>Start Time</label>
                <input type="time" defaultValue="08:00" disabled={!isEditing} />
              </div>
              <div className="form-group-v54">
                <label>End Time</label>
                <input type="time" defaultValue="11:00" disabled={!isEditing} />
              </div>
              <div className="form-group-v54 full">
                <label>Manage Bookings</label>
                <input 
                  type="number" 
                  min="1" 
                  value={manageBookingsCount} 
                  onChange={(e) => setManageBookingsCount(Number(e.target.value))}
                  disabled={!isEditing} 
                />
              </div>
              <div className="form-group-v54 full inline">
                <label>Stop accepting orders</label>
                <div className="input-group-row-v54">
                  <select 
                    value={stopAcceptValue} 
                    onChange={(e) => setStopAcceptValue(Number(e.target.value))}
                    disabled={!isEditing}
                  >
                    {Array.from({ length: stopAcceptUnit === 'Hours' ? 24 : 30 }, (_, i) => i + 1).map(v => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                  <select 
                    value={stopAcceptUnit} 
                    onChange={(e) => {
                      setStopAcceptUnit(e.target.value);
                      if (e.target.value === 'Hours' && stopAcceptValue > 24) setStopAcceptValue(24);
                    }}
                    disabled={!isEditing}
                  >
                    <option value="Hours">Hours</option>
                    <option value="Days">Days</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="card-divider-v54"></div>

          <div className="card-subsection-v54">
            <h4 className="card-subtitle-v54">Service Style Supported</h4>
            <div className="style-grid-v54">
              <div 
                className={`style-option-v54 ${selectedStyles.includes('Buffet') ? 'selected' : ''} ${!isEditing ? 'disabled' : ''}`}
                onClick={() => toggleStyle('Buffet')}
              >
                <div className="style-icon-v54">🍽️</div>
                <div className="style-info-v54">
                  <h5>Buffet Service</h5>
                  <p>Self-serve experience</p>
                </div>
                <div className="selection-indicator-v54"></div>
              </div>
              <div 
                className={`style-option-v54 ${selectedStyles.includes('Sit-down') ? 'selected' : ''} ${!isEditing ? 'disabled' : ''}`}
                onClick={() => toggleStyle('Sit-down')}
              >
                <div className="style-icon-v54">🤵</div>
                <div className="style-info-v54">
                  <h5>Sit-down Service</h5>
                  <p>Table service with staff</p>
                </div>
                <div className="selection-indicator-v54"></div>
              </div>
            </div>

            <div className={`conditional-input-v54 ${!selectedStyles.includes('Sit-down') ? 'disabled' : ''}`}>
              <label style={{ fontWeight: '800', color: '#1e293b' }}>Extra Cost per person</label>
              <div className="price-input-v54">
                <span>₹</span>
                <input 
                  type="number" 
                  placeholder="0" 
                  defaultValue="50" 
                  disabled={!isEditing || !selectedStyles.includes('Sit-down')} 
                />
              </div>
              <p className="extra-cost-helper-v54">Enter only the extra amount added to your current menu price</p>
            </div>
          </div>
        </div>

        {/* Menu Builder */}
        <div className="menu-builder-section-v54">
          <div className="section-header-v54">
            <h3>Menu Builder</h3>
            <button className="add-menu-btn-v54" onClick={() => setIsAddingMenu(true)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              <span>Add Menu</span>
            </button>
          </div>

          <div className="filter-chips-v54">
            {['All', 'Veg', 'Non-Veg'].map(f => (
              <button 
                key={f}
                className={`filter-chip-v54 ${menuFilter === f ? 'active' : ''}`}
                onClick={() => setMenuFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="menu-item-stack-v54">
            {filteredMenus.map((item: any) => (
              <div key={item.id} className="menu-item-card-v54">
                <div className="item-image-box-v54">
                  {item.image ? (
                    <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                  )}
                </div>
                <div className="item-info-v54">
                  <h4 className="item-title-v54">{item.name}</h4>
                  <div className="item-tag-row-v54">
                    <span className={`type-tag-v54 ${item.dietType?.toLowerCase() === 'veg' ? 'veg' : 'nonveg'}`}>
                      <span className="type-icon-v54">▣</span>
                      {item.dietType}
                    </span>
                    <span className="active-tag-v54">{item.status || 'Active'}</span>
                  </div>
                  <div className="item-price-v54">₹{item.price}</div>
                </div>
                <div className="item-actions-v54">
                  <button className="item-action-icon-v54 btn-edit" onClick={() => {
                    setMenuIdentity({
                      name: item.name,
                      price: item.price.toString(),
                      minMembers: item.minMembers || '',
                      maxMembers: item.maxMembers || '',
                      dietType: item.dietType,
                      image: item.image
                    });
                    setSections(item.sections || []);
                    setMenuEditingId(item.id);
                    setMenuStep(1);
                    setIsAddingMenu(true);
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  </button>
                  <button className="item-action-icon-v54 btn-settings" onClick={() => {
                    if (confirm('Are you sure you want to delete this menu?')) {
                      setMenus((prev: any[]) => prev.filter((m: any) => m.id !== item.id));
                    }
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Save Bar */}
      {isEditing && (
        <div className="sticky-save-bar-v54">
          <button className="mobile-save-btn-v54" onClick={() => setIsEditing(false)}>
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

const MobileDashboard: React.FC<MobileDashboardProps> = ({
  activeTab,
  setActiveTab,
  profileData,
  navigationGroups,
  onLogout,
  isAddingMenu,
  setIsAddingMenu,
  menuStep,
  setMenuStep,
  menuIdentity,
  setMenuIdentity,
  sections,
  setSections,
  isAddingSection,
  setIsAddingSection,
  currentSection,
  setCurrentSection,
  sectionEditingIndex,
  setSectionEditingIndex,
  resetAddMenu,
  handleImageUpload,
  handleSaveSection,
  menuEditingId,
  setMenuEditingId,
  menus,
  setMenus
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // We need menus locally or from context to update them
  // In Dashboard (App.tsx), we lifted menus state. 
  // But we need to pass it down to MobileDashboard as well.
  // Wait, I didn't add 'menus' and 'setMenus' to MobileDashboardProps yet.
  // I should do that.

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
      ) : activeTab === 'bookings' ? (
        <MobileBookingsView />
      ) : activeTab === 'reports' ? (
        <MobileReportsView />
      ) : activeTab === 'ratings' ? (
        <MobileRatingsView />
      ) : activeTab === 'coupons' ? (
        <MobileCouponsView />
      ) : activeTab === 'tickets' ? (
        <MobileSupportView />
      ) : activeTab === 'service-settings' ? (
        <MobileServiceSettingsView 
          setIsAddingMenu={setIsAddingMenu} 
          menus={menus} 
          setMenus={setMenus} 
          setMenuIdentity={setMenuIdentity}
          setSections={setSections}
          setMenuEditingId={setMenuEditingId}
          setMenuStep={setMenuStep}
        />
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

      {/* Full Screen Menu Creation Overlay */}
      {isAddingMenu && (
        <MobileCreateMenuView 
          menuStep={menuStep}
          setMenuStep={setMenuStep}
          menuIdentity={menuIdentity}
          setMenuIdentity={setMenuIdentity}
          sections={sections}
          setSections={setSections}
          isAddingSection={isAddingSection}
          setIsAddingSection={setIsAddingSection}
          currentSection={currentSection}
          setCurrentSection={setCurrentSection}
          sectionEditingIndex={sectionEditingIndex}
          setSectionEditingIndex={setSectionEditingIndex}
          resetAddMenu={resetAddMenu}
          handleImageUpload={handleImageUpload}
          handleSaveSection={handleSaveSection}
          menuEditingId={menuEditingId}
          menus={menus}
          setMenus={setMenus}
        />
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
