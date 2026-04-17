/* MobileDashboard.tsx - Isolated components for Mobile Devices */
import React, { useState, useEffect, useRef } from 'react';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  TouchSensor,
  type DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import './MobileDashboard.css';
import ManageMembershipModal from './ManageMembership';
import MembershipStatusBanner from './MembershipStatusBanner';

/* ─────────────────── MOBILE INTERFACES ─────────────────── */

interface Coupon {
  id: string;
  code: string;
  type: string;
  value: string;
  status: string;
  usage: string;
  validFrom: string;
  validTo: string;
  maxCap?: string;
  minAmount?: string;
  source: 'vendor' | 'platform';
  applicability: string;
  selectedTargets?: string[];
  scope?: 'all' | 'specific';
  perUserLimit?: string;
}

interface MenuItem {
  name: string;
  description: string;
  image: string | null;
}

interface Section {
  name: string;
  items: (MenuItem | string)[];
  type: string;
  status?: string;
  limit?: number;
}

interface Menu {
  id: number;
  name: string;
  sections: Section[];
  status: string;
  category?: string;
  price?: string | number;
  image?: string | null;
  minMembers?: string;
  maxMembers?: string;
  dietType?: string;
}

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface NavigationGroup {
  title: string;
  items: NavigationItem[];
}

interface Booking {
  id: string;
  type: string;
  menu: string;
  guests: number;
  collect: string;
  time: string;
  targetTime: string;
  theme: string;
  status: string;
  taxType: string;
  customer?: string;
  phone?: string;
  email?: string;
  address?: string;
  date?: string;
  category?: string;
  menuName?: string;
  amount?: string | number;
  paid?: string | number;
  menuDetails?: {
    categories: Section[];
  };
}

interface Document {
  type: string;
  identifier: string;
  date: string;
  status: string;
}

interface BankAccount {
  id: string;
  bankName: string;
  holderName: string;
  accountNumber: string;
  ifsc: string;
  accountType: string;
  status: string;
  lastUpdated: string;
  isPrimary: boolean;
}

interface ProfileData {
  header?: {
    name: string;
    id: string;
    status: string;
    joined: string;
    gstType: string;
    service: string;
  };
  owner?: {
    name?: string;
    email?: string;
    mobile?: string;
    profilePic?: string | null;
  };
  business?: {
    category: string;
    displayName: string;
    address: string;
    city: string;
    state: string;
    radius: string;
    gstRegistered: boolean;
    fssai: string;
  };
  identity?: {
    pan: string;
    gst: string;
    fssai: string;
  };
  partnership?: {
    joinedDate: string;
    plan: string;
    gstType: string;
    agreement: string;
  };
  documents?: Document[];
  bankAccounts?: BankAccount[];
  activeTab?: string;
}

interface MenuIdentity {
  name: string;
  dietType: string;
  price: string;
  minMembers: string;
  maxMembers: string;
  image: string | null;
}

/* ─────────────────── MOBILE UTILS ─────────────────── */
const MobileCountdown = ({ targetISO }: { targetISO: string }) => {
  const calculateInitialTime = () => {
    const now = new Date().getTime();
    const target = new Date(targetISO).getTime();
    const diff = target - now;
    if (diff <= 0) return 'Started';
    const hh = Math.floor(diff / (1000 * 60 * 60)).toString().padStart(2, '0');
    const mm = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
    const ss = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  };

  const [timeLeft, setTimeLeft] = useState(calculateInitialTime());

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(targetISO).getTime();
      const diff = target - now;
      if (diff <= 0) {
        setTimeLeft('Started');
      } else {
        const hh = Math.floor(diff / (1000 * 60 * 60)).toString().padStart(2, '0');
        const mm = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
        const ss = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0');
        setTimeLeft(`${hh}:${mm}:${ss}`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [targetISO]);

  return <span>Starts in {timeLeft}</span>;
};

/* ─────────────────── MOBILE HOME VIEW ─────────────────── */
const MobileHomeView = ({ setActiveTab }: { setActiveTab: (tab: string) => void }) => {
  const todayDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  // Purity Fix: Compute static dates outside or inside useEffect to avoid render-time impurity
  const todayBookings = [
    { id: 'BK-12405', type: 'Lunch', menu: 'Standard Business Lunch', guests: 150, collect: '₹75,000', time: '10:00 AM', targetTime: new Date(new Date().getTime() + 2 * 3600 * 1000).toISOString(), theme: 'warning' },
    { id: 'BK-12410', type: 'Dinner', menu: 'Premium Buffet Menu 2', guests: 45, collect: '₹31,500', time: '04:00 PM', targetTime: new Date(new Date().getTime() + 8 * 3600 * 1000).toISOString(), theme: 'info' }
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
  booking: Booking;
  onBack: () => void;
}) => {
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);
  const [isMenuSheetOpen, setIsMenuSheetOpen] = useState(false);
  const [showCalculations, setShowCalculations] = useState(false);
  const [isBreakdownExpanded, setIsBreakdownExpanded] = useState(false);

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
                <span>
                  {booking.date ? new Date(booking.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'TBD'} • {booking.time}
                </span>
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
              {booking.menuDetails?.categories.slice(0, 1).map((cat: Section, idx: number) => (
                <div key={idx} className="menu-category-group-v50">
                  <div className="cat-header-v50">
                    <span className="cat-name-v50">{cat.name}</span>
                    <span className={`cat-status-pill-v50 ${cat.status === 'All Items Included' ? 'all' : 'custom'}`}>
                      {cat.status}
                    </span>
                  </div>
                  <div className="cat-items-flex-v50">
                    {cat.items.slice(0, 4).map((item: any, i: number) => (
                      <div key={i} className="menu-item-pill-v50">
                        {typeof item === 'string' ? item : item.name}
                      </div>
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
          {(() => {
            const amountPaid = Number(booking.paid || 0);
            const commission = Math.round(amountPaid * 0.10);
            const commissionGst = Math.round(commission * 0.18);
            const tds = Math.round(amountPaid * 0.001);
            const totalDeductions = commission + commissionGst + tds;
            const vendorPayout = amountPaid - totalDeductions;
            const totalEarnings = vendorPayout + (Number(booking.amount || 0) - amountPaid);

            const eventDateObj = new Date(booking.date || '');
            const payoutStart = new Date(eventDateObj);
            payoutStart.setDate(eventDateObj.getDate() - 2);
            const payoutEnd = new Date(eventDateObj);
            payoutEnd.setDate(eventDateObj.getDate());

            const startMonth = payoutStart.toLocaleDateString('en-GB', { month: 'short' });
            const endMonth = payoutEnd.toLocaleDateString('en-GB', { month: 'short' });
            const estimateStr = startMonth === endMonth
              ? `${payoutStart.getDate()}-${payoutEnd.getDate()} ${startMonth} ${payoutStart.getFullYear()}`
              : `${payoutStart.getDate()} ${startMonth} - ${payoutEnd.getDate()} ${endMonth} ${payoutStart.getFullYear()}`;

            const diffHrsToEvent = (eventDateObj.getTime() - new Date().getTime()) / (1000 * 60 * 60);
            const diffDaysToEvent = diffHrsToEvent / 24;

            return (
              <div className="financial-breakdown-v30 mobile-version">
                <div className="section-header-row-v30" style={{ marginBottom: '8px' }}>
                  <h3 className="section-title-v50 small" style={{ margin: 0 }}>Payment Summary</h3>
                  <button
                    className="calculation-toggle-btn-v30"
                    onClick={() => setIsBreakdownExpanded(!isBreakdownExpanded)}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points={isBreakdownExpanded ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}></polyline>
                    </svg>
                    {isBreakdownExpanded ? 'Hide details' : 'Show details'}
                  </button>
                </div>

                {isBreakdownExpanded && (
                  <>
                    {/* Step 1: Total Booking Value */}
                    <div className="breakdown-section-v30">
                      <div className="section-label-v30">1. Total Booking Value</div>
                      <div className="breakdown-row-v30" style={{ alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <label style={{ fontWeight: 600, fontSize: '1.05rem', color: '#1e293b' }}>Booking Amount</label>
                          <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 500 }}>Includes GST</span>
                        </div>
                        <span style={{ fontWeight: 700, fontSize: '1.25rem', color: '#0f172a' }}>₹{Number((booking as any).originalAmount || booking.amount || 0).toLocaleString()}</span>
                      </div>
                      {((booking as any).discount > 0) && (
                        <>
                          <div className="breakdown-row-v30" style={{ color: '#ef4444', marginTop: '12px' }}>
                            <label>Discount Applied</label>
                            <span style={{ color: '#ef4444' }}>-₹{Number((booking as any).discount).toLocaleString()}</span>
                          </div>
                          <span className="helper-text-v30">Discount applied on total booking value</span>
                        </>
                      )}
                      <div className="breakdown-row-v30 highlight-row">
                        <label style={{ fontWeight: 700 }}>Final Booking Value</label>
                        <span style={{ fontSize: '1.1rem' }}>₹{Number(booking.amount || 0).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Step 2: Payment Split */}
                    <div className="breakdown-section-v30">
                      <div className="section-label-v30">2. Payment Split</div>
                      <div className="breakdown-row-v30">
                        <label>Platform Payment (Advance)</label>
                        <span style={{ color: '#10b981' }}>₹{Number(booking.paid || 0).toLocaleString()}</span>
                      </div>
                      <div className="breakdown-row-v30">
                        <label>Paid at Event Payment (Remaining)</label>
                        <span style={{ color: '#f59e0b' }}>₹{(Number(booking.amount || 0) - Number(booking.paid || 0)).toLocaleString()}</span>
                      </div>
                      <div className="breakdown-note-v30 collection-highlight-v30">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                        <span>Remaining amount is collected directly from customer</span>
                      </div>
                    </div>

                    {/* Step 3: Platform Deductions */}
                    <div className="breakdown-section-v30">
                      <div className="section-header-row-v30">
                        <div className="section-label-v30">3. Platform Deductions</div>
                        <button
                          className="calculation-toggle-btn-v30"
                          onClick={() => setShowCalculations(!showCalculations)}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points={showCalculations ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}></polyline>
                          </svg>
                          {showCalculations ? 'Hide details' : 'Show details'}
                        </button>
                      </div>

                      {showCalculations && (
                        <div className="details-wrapper-v30">
                          <div className="deduction-item-v30">
                            <span>Platform Commission (10%)</span>
                            <span className="deduction-value">-₹{commission.toLocaleString()}</span>
                          </div>
                          <div className="deduction-item-v30">
                            <span>GST on Commission (18%)</span>
                            <span className="deduction-value">-₹{commissionGst.toLocaleString()}</span>
                          </div>
                          <div className="deduction-item-v30">
                            <span>TDS (0.1%)</span>
                            <span className="deduction-value">-₹{tds.toLocaleString()}</span>
                          </div>
                          <div className="breakdown-note-v30" style={{ marginTop: '8px' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                            <span>Deductions calculated on platform amount, GST & TDS are claimable</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                <div className="section-label-v30" style={{ marginTop: '0px', marginBottom: '4px' }}>Final Settlement</div>
                {booking.status === 'Live' || booking.status === 'Completed' || (booking.status === 'Upcoming' && diffDaysToEvent < 2) ? (
                  <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.06)', borderRadius: '8px', padding: '14px 12px', margin: '0 0 8px 0', border: '1px solid rgba(16, 185, 129, 0.15)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div className="breakdown-row-v30" style={{ borderBottom: 'none', paddingBottom: 0, paddingTop: 0 }}>
                      <label style={{ fontWeight: 600, color: '#0f172a' }}>You Receive (Payout)</label>
                      <span style={{ color: '#10b981', fontSize: '1.25rem', fontWeight: 700 }}>₹{vendorPayout.toLocaleString()}</span>
                    </div>
                    <div className="breakdown-row-v30" style={{ paddingTop: 0, marginTop: 0, borderBottom: 'none' }}>
                      <label style={{ color: '#047857', fontWeight: 500, fontSize: '0.9rem' }}>
                        {booking.status === 'Live' || booking.status === 'Completed' || (booking.status === 'Upcoming' && diffDaysToEvent < 2) ? 'Payout date' : 'Estimate payout date'}
                      </label>
                      <span style={{ color: '#047857', fontWeight: 600, fontSize: '0.9rem' }}>{estimateStr}</span>
                    </div>
                    <div className="breakdown-note-v30" style={{ marginTop: '4px', color: '#059669', opacity: 0.9, backgroundColor: 'rgba(16, 185, 129, 0.04)', padding: '8px', borderRadius: '6px' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                      <span style={{ fontSize: '0.8rem' }}>Payout between 12–48 hrs before event</span>
                    </div>
                  </div>
                ) : (
                    <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.06)', borderRadius: '8px', padding: '14px 12px', margin: '0 0 8px 0', border: '1px solid rgba(16, 185, 129, 0.15)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div className="breakdown-row-v30" style={{ borderBottom: 'none', paddingBottom: 0, paddingTop: 0 }}>
                        <label style={{ fontWeight: 600, color: '#1e293b' }}>You Receive (Payout)</label>
                        <span style={{ color: '#10b981', fontSize: '1.25rem', fontWeight: 700 }}>₹{vendorPayout.toLocaleString()}</span>
                      </div>
                      <div className="breakdown-row-v30" style={{ paddingTop: 0, marginTop: 0, borderBottom: 'none' }}>
                        <label style={{ color: '#047857', fontWeight: 500, fontSize: '0.9rem' }}>Estimate payout date</label>
                        <span style={{ color: '#047857', fontWeight: 600, fontSize: '0.9rem' }}>{estimateStr}</span>
                      </div>
                      <div className="breakdown-note-v30" style={{ marginTop: '4px', color: '#047857', opacity: 0.8, backgroundColor: 'rgba(16, 185, 129, 0.04)', padding: '8px', borderRadius: '6px' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                        <span style={{ fontSize: '0.8rem' }}>Payout between 12–48 hrs before event</span>
                      </div>
                    </div>
                )}



                {/* Step 5: Total Earnings */}
                <div className="total-earnings-card-v30 mobile">
                  <div className="earnings-label">
                    <label>TOTAL EARNINGS</label>
                    <span>₹{totalEarnings.toLocaleString()}</span>
                    <div className="incl-gst-bottom-v30">(Incl. GST)</div>
                    <div className="earnings-helper-v30">Includes Paid at Event + platform payout</div>
                  </div>
                </div>
              </div>
            );
          })()}
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
            {/* Advance Receipt: Shown for all except Cancelled? No, user said both for cancelled. */}
            {/* Upcoming, Live, Completed, Cancelled all get Advance Receipt */}
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

            {/* Tax Invoice: Only for Completed */}
            {booking.status === 'Completed' && (
              <div className="doc-row-v50">
                <div className="doc-left-v50">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                  <div className="doc-info-v50">
                    <span className="doc-name-v50">Tax Invoice (Final)</span>
                    <span className="doc-meta-v50">PDF • 2.4 MB</span>
                  </div>
                </div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </div>
            )}

            {/* Credit Note: Only for Cancelled */}
            {booking.status === 'Cancelled' && (
              <div className="doc-row-v50">
                <div className="doc-left-v50">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                  <div className="doc-info-v50">
                    <span className="doc-name-v50">Credit Note</span>
                    <span className="doc-meta-v50">PDF • 1.1 MB</span>
                  </div>
                </div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </div>
            )}
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
              {booking.menuDetails?.categories.map((cat: Section, idx: number) => (
                <div key={idx} className="sheet-menu-cat-block-v50">
                  <div className="sheet-cat-header-v50">
                    <span className="name">{cat.name}</span>
                    <span className="status">{cat.status}</span>
                  </div>
                  <div className="sheet-cat-items-v50">
                    {cat.items.map((item: any, i: number) => (
                      <div key={i} className="sheet-menu-item-v50">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        <span>{typeof item === 'string' ? item : item.name}</span>
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
      type: 'Wedding Catering',
      serviceCategory: 'Lunch',
      category: 'Lunch',
      menuName: 'Premium Sadhya Menu',
      guests: 200,
      amount: 145000,
      originalAmount: 160000,
      discount: 15000,
      payout: 41235,
      paid: 43500,
      status: 'Live',
      address: '402, Skyline Residency, Sector 44, Bengaluru',
      menuSelection: [
        { name: 'Starters', type: 'Selected', items: ['Paneer Tikka', 'Hara Bhara Kabab'] },
        { name: 'Main Course', type: 'All Items', items: ['Paneer Butter Masala', 'Dal Makhani', 'Veg Pulao', 'Butter Naan'] },
        { name: 'Desserts', type: 'Selected', items: ['Gulab Jamun', 'Rasmalai'] }
      ],
      menuDetails: {
        categories: [
          { name: 'Starters', items: ['Paneer Tikka', 'Hara Bhara Kabab'], status: 'All Items Included' },
          { name: 'Main Course', items: ['Paneer Butter Masala', 'Dal Makhani', 'Veg Pulao', 'Butter Naan'], status: 'Customer Selected' },
          { name: 'Desserts', items: ['Gulab Jamun', 'Rasmalai'], status: 'All Items Included' }
        ]
      },
      timeline: [
        { status: 'Pending', time: '15 Mar, 09:00 AM' },
        { status: 'Confirmed', time: '15 Mar, 02:30 PM' },
        { status: 'Live', time: '20 Mar, 08:00 AM' }
      ],
      taxType: 'B2C'
    },
    {
      id: 'BK-12405',
      customer: 'Siddharth Malhotra',
      date: new Date(Date.now() + 48 * 3600000).toISOString().split('T')[0], // Exactly 2 days away
      time: '07:30 PM',
      type: 'Corporate Gala',
      serviceCategory: 'Dinner',
      category: 'Dinner',
      menuName: 'Executive Buffet',
      guests: 150,
      amount: 418000,
      originalAmount: 450000,
      discount: 32000,
      payout: 118935,
      paid: 125500,
      status: 'Upcoming',
      address: 'Apartment 701, Prestige Ferns Residency, Bellandur',
      menuSelection: [
        { name: 'Dinner', type: 'Selected', items: ['Jeera Rice', 'Paneer Tikka', 'Butter Naan'] },
        { name: 'Drinks', type: 'All Items', items: ['Butter Milk', 'Fresh Lime Soda'] }
      ],
      menuDetails: {
        categories: [
          { name: 'Dinner', items: ['Jeera Rice', 'Paneer Tikka', 'Butter Naan'], status: 'Customer Selected' },
          { name: 'Drinks', items: ['Butter Milk', 'Fresh Lime Soda'], status: 'All Items Included' }
        ]
      },
      timeline: [
        { status: 'Pending', time: '18 Mar, 11:15 AM' },
        { status: 'Confirmed', time: '18 Mar, 05:00 PM' }
      ],
      taxType: 'B2B'
    },
    {
      id: 'BK-12398',
      customer: 'Ananya Pandey',
      date: new Date(Date.now() - 24 * 3600000).toISOString().split('T')[0], // Yesterday
      time: '04:30 PM',
      type: 'Engagement Party',
      serviceCategory: 'Snacks',
      category: 'Snacks',
      menuName: 'High Tea Special',
      guests: 80,
      amount: 45000,
      originalAmount: 50000,
      discount: 5000,
      payout: 12825,
      paid: 13500,
      status: 'Completed',
      address: 'No. 34, 1st Cross, Indiranagar 2nd Stage',
      menuSelection: [
        { name: 'Breakfast', type: 'All Items', items: ['Samosa', 'Chai', 'Sandwich'] }
      ],
      menuDetails: {
        categories: [
          { name: 'Snacks', items: ['Samosa', 'Chai', 'Sandwich'], status: 'All Included' }
        ]
      },
      timeline: [
        { status: 'Pending', time: '10 Mar, 10:00 AM' },
        { status: 'Confirmed', time: '10 Mar, 12:00 PM' },
        { status: 'Live', time: '19 Mar, 09:00 AM' },
        { status: 'Completed', time: '20 Mar, 11:00 PM' }
      ],
      taxType: 'B2B'
    },
    {
      id: 'BK-12410',
      customer: 'Varun Dhawan',
      date: new Date(Date.now() + 120 * 3600000).toISOString().split('T')[0], // 5 days away
      time: '08:00 PM',
      type: 'Private Dinner',
      serviceCategory: 'Dinner',
      category: 'Dinner',
      menuName: 'Romantic Four-Course',
      guests: 12,
      amount: 15000,
      originalAmount: 18000,
      discount: 3000,
      payout: 4275,
      paid: 4500,
      status: 'Upcoming',
      address: 'Flat 4A, Green Meadows Appts, Koramangala',
      menuSelection: [
        { name: 'Dinner', type: 'Selected', items: ['Salad', 'Soup', 'Main Course'] }
      ],
      menuDetails: {
        categories: [
          { name: 'Dinner', items: ['Soup', 'Main Course'], status: 'All Included' }
        ]
      },
      timeline: [
        { status: 'Pending', time: '21 Mar, 08:30 AM' }
      ],
      taxType: 'B2C'
    },
    {
      id: 'BK-12419',
      customer: 'Rohit Verma',
      date: new Date(Date.now() + 48 * 3600000).toISOString().split('T')[0], // 2 days from now
      time: '08:00 PM',
      type: 'Anniversary Dinner',
      serviceCategory: 'Dinner',
      category: 'Dinner',
      menuName: 'Premium Feast',
      guests: 30,
      amount: 45000,
      originalAmount: 50000,
      discount: 5000,
      payout: 12825,
      paid: 13500,
      status: 'Cancelled',
      cancelledBy: 'Customer',
      address: 'Penthouse B, Brigade Exotica, Old Madras Road',
      menuSelection: [
        { name: 'Dinner', type: 'Selected', items: ['Dal Makhani', 'Naan'] }
      ],
      menuDetails: {
        categories: [
          { name: 'Dinner', items: ['Dal Makhani', 'Naan'], status: 'All Included' }
        ]
      },
      timeline: [
        { status: 'Pending', time: '24 Mar, 09:00 AM' },
        { status: 'Cancelled', time: '25 Mar, 04:00 PM' }
      ],
      taxType: 'B2B'
    },
    {
      id: 'BK-12430',
      customer: 'Rahul Mehra',
      date: new Date(Date.now() + 96 * 3600000).toISOString().split('T')[0], // 4 days from now
      time: '01:30 PM',
      type: 'Birthday Kids',
      serviceCategory: 'Lunch',
      category: 'Lunch',
      menuName: 'Kids Special Menu',
      guests: 40,
      amount: 25000,
      originalAmount: 28000,
      discount: 3000,
      payout: 7125,
      paid: 7500,
      status: 'Cancelled',
      cancelledBy: 'Vendor',
      address: 'Cloud 9 Apartments, Indiranagar',
      menuSelection: [
        { name: 'Lunch', type: 'Selected', items: ['Mini Pizza', 'Pasta', 'Fries'] }
      ],
      menuDetails: {
        categories: [
          { name: 'Lunch', items: ['Mini Pizza', 'Pasta', 'Fries'], status: 'All Included' }
        ]
      },
      timeline: [
        { status: 'Pending', time: '10 Mar, 10:00 AM' },
        { status: 'Cancelled', time: '11 Mar, 02:00 PM' }
      ],
      taxType: 'B2C'
    },
    {
      id: 'BK-12435',
      customer: 'Sia Kapoor',
      date: new Date(Date.now() - 72 * 3600000).toISOString().split('T')[0],
      time: '08:30 PM',
      type: 'Private Dinner',
      serviceCategory: 'Dinner',
      category: 'Dinner',
      menuName: 'Gourmet Italian',
      guests: 15,
      amount: 35000,
      originalAmount: 38000,
      discount: 3000,
      payout: 9975,
      paid: 10500,
      status: 'Cancelled',
      cancelledBy: 'Customer',
      address: 'Villa 12, Palm Meadows, Whitefield',
      menuSelection: [
        { name: 'Dinner', type: 'Selected', items: ['Antipasti', 'Risotto'] }
      ],
      menuDetails: {
        categories: [
          { name: 'Dinner', items: ['Antipasti', 'Risotto'], status: 'All Included' }
        ]
      },
      timeline: [
        { status: 'Pending', time: '12 Mar, 04:00 PM' },
        { status: 'Cancelled', time: '13 Mar, 10:30 AM' }
      ],
      taxType: 'B2B'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [rangeShortcut, setRangeShortcut] = useState('Today & Upcoming');
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
    if (rangeShortcut === 'Today & Upcoming') {
      if (b.date < today) return false;
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
  }).sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
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
            {['All', 'Today & Upcoming', 'This Month'].map(s => (
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
                  {['All', 'Live', 'Upcoming', 'Completed', 'Cancelled'].map(s => (
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
  const fullMonthNames: Record<string, string> = {
    'Apr': 'April', 'May': 'May', 'Jun': 'June', 'Jul': 'July', 'Aug': 'August', 'Sep': 'September',
    'Oct': 'October', 'Nov': 'November', 'Dec': 'December', 'Jan': 'January', 'Feb': 'February', 'Mar': 'March'
  };

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
      {/* Header Section */}
      <div className="mobile-revenue-header-v52">
        <h3 className="rev-header-title-v52">Revenue Insights & Trends</h3>
        <p className="rev-header-subtitle-v52">
          Financial performance and growth analysis for {fullMonthNames[selectedMonth]} {selectedFY}
        </p>
      </div>

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

      {/* KPI Hierarchy - Modernized v52 */}
      <div className="revenue-kpi-row-v52">
        {/* Total Earnings Hero Card */}
        <div className="rev-kpi-card-v52 rev-hero-green-v52">
          <div className="rev-card-main-info-v52">
            <div className="rev-card-title-v52">Total Earnings (incl. GST)</div>
            <div className="rev-card-value-v52">₹4,05,000</div>
            <div className="rev-card-subtitle-v52">Includes platform + Paid at Event earnings</div>
          </div>
          <div className="rev-card-footer-v52">
            <span>Platform: ₹1,62,000</span>
            <span style={{ opacity: 0.5 }}>|</span>
            <span>Paid at Event: ₹2,43,000</span>
          </div>
        </div>

        {/* Net Received Card */}
        <div className="rev-kpi-card-v52 rev-white-card-v52 net-received-card-v52">
          <div className="rev-card-main-info-v52">
            <div className="rev-card-title-v52">NET RECEIVED</div>
            <div className="rev-card-value-v52">₹3,96,000</div>
            <div className="rev-card-subtitle-v52">Amount credited after platform charges & TDS</div>
          </div>
        </div>

        {/* Total Bookings Card */}
        <div className="rev-kpi-card-v52 rev-white-card-v52 bookings-card-v52">
          <div className="rev-card-main-info-v52">
            <div className="rev-card-title-v52">TOTAL BOOKINGS</div>
            <div className="rev-card-value-v52">30</div>
            <div className="rev-card-subtitle-v52">Total orders processed for this period</div>
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

      </div>


      {/* Payout Summary */}
      <div className="mobile-rev-action-card-v51">
        <div className="card-head-v51">
          <div className="payout-title-group-v52">
            <h4>Payout Summary</h4>
            <p className="payout-context-v52">Showing payouts for selected period</p>
          </div>
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
        </div>
        <div className="payout-footer-notes-v52">
          <div className="payout-note-v52">Payouts are processed 24–48 hours before the event date</div>
          <div className="payout-deduction-note-v52">Payout amounts are after TDS deductions</div>
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
                      <label>TDS (0.1%)</label>
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
  const [selectedQuarter, setSelectedQuarter] = useState('Q4 (Jan-Mar)');
  const [gstType, setGstType] = useState('regular');

  const monthsList = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
  const quartersList = ['Q1 (Apr-Jun)', 'Q2 (Jul-Sep)', 'Q3 (Oct-Dec)', 'Q4 (Jan-Mar)'];

  return (
    <div className="mobile-gst-container-v52">
      <div className="gst-type-segment-v52">
        <div
          className={`gst-segment-item-v52 ${gstType === 'regular' ? 'active' : ''}`}
          onClick={() => setGstType('regular')}
        >
          GST Regular
        </div>
        <div
          className={`gst-segment-item-v52 ${gstType === 'composition' ? 'active' : ''}`}
          onClick={() => setGstType('composition')}
        >
          GST Composition
        </div>
        <div
          className={`gst-segment-item-v52 ${gstType === 'non-gst' ? 'active' : ''}`}
          onClick={() => setGstType('non-gst')}
        >
          Non-GST
        </div>
      </div>

      <div className="gst-header-section-v52">
        <h2 className="gst-main-title-v52">
          {gstType === 'non-gst' ? 'Earnings Overview' : 'GST Reporting & Compliance'}
        </h2>
        <p className="gst-main-subtitle-v52">
          {gstType === 'non-gst'
            ? 'Summary of your earnings and platform charges'
            : `Manage your GST filings for ${gstType === 'composition' ? selectedQuarter : selectedMonth} ${selectedFY.replace('FY ', '')}`}
        </p>
      </div>

      {/* Filters Section */}
      <div className="gst-filters-v52">
        <select value={selectedFY} onChange={e => setSelectedFY(e.target.value)} className="gst-select-v52">
          <option>FY 2025–26</option>
          <option>FY 2024–25</option>
        </select>

        {gstType === 'composition' ? (
          <select value={selectedQuarter} onChange={e => setSelectedQuarter(e.target.value)} className="gst-select-v52">
            {quartersList.map((q, idx) => (
              <option key={idx} value={q}>{q}</option>
            ))}
          </select>
        ) : (
          <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className="gst-select-v52">
            {monthsList.map((m, idx) => (
              <option key={idx} value={m}>{m} '26</option>
            ))}
          </select>
        )}
      </div>

      {/* KPI Cards (Stacked Layout) */}
      <div className="gst-kpi-stack-v52">
        {/* Regular GST View */}
        {gstType === 'regular' && (
          <>
            {/* Card 1: Total Taxable Value */}
            <div className="gst-kpi-card-v52">
              <div className="gst-card-label-row-v52">
                <label>Total Taxable Value</label>
                <svg className="gst-info-icon-v52" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              </div>
              <div className="gst-card-value-v52">₹8,25,000</div>
              <p className="gst-card-subtitle-v52">Includes platform and Paid at Event earnings</p>
              <div className="gst-card-divider-v52 dashed"></div>

              <div className="gst-breakdown-box-v52" style={{ marginBottom: '16px' }}>
                <div className="gst-breakdown-row-v52" style={{ justifyContent: 'space-between', display: 'flex' }}>
                  <div className="inline-entry-v52">
                    <span className="label-v52">Platform:</span>
                    <span className="val-v52">₹3,30,000</span>
                  </div>
                  <div className="inline-entry-v52">
                    <span className="label-v52">Paid at Event:</span>
                    <span className="val-v52">₹4,95,000</span>
                  </div>
                </div>
              </div>

              <div className="gst-badge-row-v52" style={{ gap: '10px' }}>
                <div className="gst-status-pill-v52 verified" style={{ borderRadius: '6px' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Platform data is verified
                </div>
                <div className="gst-status-pill-v52 warning-banner-v52">
                  Paid at Event earnings are self-reported
                </div>
              </div>
            </div>

            {/* Card 2: Total Output GST */}
            <div className="gst-kpi-card-v52">
              <div className="gst-card-label-row-v52">
                <label>Total Output GST</label>
                <svg className="gst-info-icon-v52" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              </div>
              <div className="gst-card-value-v52">₹1,48,500</div>
              <div className="gst-card-divider-v52"></div>
              <div className="gst-breakdown-box-v52">
                <div className="gst-breakdown-row-v52">
                  <label>Platform GST</label>
                  <span>₹59,400</span>
                </div>
                <div className="gst-breakdown-row-v52">
                  <label>Paid at Event GST</label>
                  <span>₹89,100</span>
                </div>
              </div>
            </div>

            {/* Card 3: Input Tax Credit (ITC) */}
            <div className="gst-kpi-card-v52">
              <div className="gst-card-label-row-v52">
                <label>Input Tax Credit (ITC)</label>
                <svg className="gst-info-icon-v52" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              </div>
              <div className="gst-card-value-v52">₹12,400</div>
              <p className="gst-card-subtitle-v52">Includes GST paid on platform fees and eligible expenses</p>
            </div>

            {/* Card 4: Net GST Payable */}
            <div className="gst-kpi-card-v52 gst-payable-card-v52">
              <div className="gst-card-label-row-v52">
                <label>Net GST Payable</label>
                <svg className="gst-info-icon-v52" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              </div>
              <div className="gst-card-value-v52">₹1,36,100</div>
              <p className="gst-card-subtitle-v52">After ITC adjustment</p>
              <div className="gst-status-pill-v52 due">Due by April 20, 2026</div>
            </div>
          </>
        )}

        {/* Composition GST View */}
        {gstType === 'composition' && (
          <>
            {/* Composition Info Banner */}
            <div className="gst-info-banner-v52">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0077ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              <div className="info-banner-content-v52">
                <div className="info-banner-title-v52">You are under GST Composition Scheme</div>
                <div className="info-banner-subtitle-v52">Pay a fixed tax on your total turnover and ITC is not claimable</div>
              </div>
            </div>

            {/* Card 1: Total Turnover (Quarter) */}
            <div className="gst-kpi-card-v52">
              <div className="gst-card-label-row-v52">
                <label>Total Turnover (Quarter)</label>
                <svg className="gst-info-icon-v52" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              </div>
              <div className="gst-card-value-v52">₹8,25,000</div>
              <p className="gst-card-subtitle-v52">Includes platform and Paid at Event earnings</p>
              <div className="gst-card-divider-v52 dashed"></div>

              <div className="gst-breakdown-box-v52" style={{ marginBottom: '16px' }}>
                <div className="gst-breakdown-row-v52" style={{ justifyContent: 'space-between', display: 'flex' }}>
                  <div className="inline-entry-v52">
                    <span className="label-v52">Platform:</span>
                    <span className="val-v52">₹3,30,000</span>
                  </div>
                  <div className="inline-entry-v52">
                    <span className="label-v52">Paid at Event:</span>
                    <span className="val-v52">₹4,95,000</span>
                  </div>
                </div>
              </div>

              <div className="gst-badge-row-v52" style={{ gap: '10px' }}>
                <div className="gst-status-pill-v52 verified" style={{ borderRadius: '6px' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Platform data is verified
                </div>
                <div className="gst-status-pill-v52 warning-banner-v52">
                  Paid at Event earnings are self-reported
                </div>
              </div>
            </div>

            {/* Card 2: Estimated Tax Payable */}
            <div className="gst-kpi-card-v52">
              <div className="gst-card-label-row-v52">
                <label>Estimated Tax Payable</label>
                <svg className="gst-info-icon-v52" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              </div>
              <div className="gst-card-value-v52 primary-blue-v52">₹49,500</div>
              <p className="comp-rate-label-v52">@6% composition rate</p>

              <div className="comp-calc-info-v52">
                <p>Composition tax is calculated based on your business type (1% / 5% / 6%)</p>
                <p className="ca-recommend-v52">We recommend verifying the correct rate with your Chartered Accountant (CA)</p>
              </div>
            </div>

            {/* Card 3: CMP-08 Due Date */}
            <div className="gst-kpi-card-v52 highlight-blue-card-v52">
              <div className="gst-card-label-row-v52">
                <label>CMP-08 Due Date</label>
                <svg className="gst-info-icon-v52" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              </div>
              <div className="gst-card-value-v52">April 18, 2026</div>
              <div className="gst-status-pill-v52 due-pill-v52">Due in 9 days</div>
            </div>
          </>
        )}

        {/* Non-GST View */}
        {gstType === 'non-gst' && (
          <>
            {/* Non-GST Info Banner */}
            <div className="gst-info-banner-v52">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0077ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              <div className="info-banner-content-v52">
                <div className="info-banner-title-v52">GST is not applicable for your account</div>
                <div className="info-banner-subtitle-v52">No need to collect or file GST</div>
              </div>
            </div>

            {/* Card 1: Total Earnings */}
            <div className="gst-kpi-card-v52">
              <div className="gst-card-label-row-v52">
                <label>Total Earnings</label>
                <svg className="gst-info-icon-v52" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              </div>
              <div className="gst-card-value-v52">₹8,25,000</div>
              <p className="gst-card-subtitle-v52">Includes platform and Paid at Event earnings</p>
              <div className="gst-card-divider-v52 dashed"></div>

              <div className="gst-breakdown-box-v52" style={{ marginBottom: '16px' }}>
                <div className="gst-breakdown-row-v52" style={{ justifyContent: 'space-between', display: 'flex' }}>
                  <div className="inline-entry-v52">
                    <span className="label-v52">Platform:</span>
                    <span className="val-v52">₹3,30,000</span>
                  </div>
                  <div className="inline-entry-v52">
                    <span className="label-v52">Paid at Event:</span>
                    <span className="val-v52">₹4,95,000</span>
                  </div>
                </div>
              </div>

              <div className="gst-badge-row-v52" style={{ gap: '10px', marginBottom: '16px' }}>
                <div className="gst-status-pill-v52 verified" style={{ borderRadius: '6px' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Platform data is verified
                </div>
                <div className="gst-status-pill-v52 warning-banner-v52">
                  Paid at Event earnings are self-reported
                </div>
              </div>

              <p className="gst-card-footnote-v52">
                GST registration may be required if your total business turnover exceeds ₹20L in a financial year.
              </p>
            </div>

            {/* Card 2: Platform Charges */}
            <div className="gst-kpi-card-v52">
              <div className="gst-card-label-row-v52">
                <label>Platform Charges</label>
                <svg className="gst-info-icon-v52" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              </div>
              <div className="gst-card-value-v52">₹5,400</div>
              <p className="gst-card-subtitle-v52">Includes platform commission and applicable taxes</p>
              <p className="gst-card-footnote-v52">
                (GST included in platform charges is not claimable for non-GST registered vendors)
              </p>
            </div>
          </>
        )}
      </div>

      {/* Upcoming Filing Deadlines - Only for Regular */}
      {gstType === 'regular' && (
        <div className="gst-section-v52">
          <h3 className="section-title-v52">Upcoming Filing Deadlines</h3>
          <div className="split-card-v52">
            <div className="deadline-item-v52">
              <div className="deadline-info-v52">
                <div className="deadline-item-title-v52">GSTR-1 (Outward Supplies)</div>
                <div className="deadline-item-date-v52">Due Date: April 11, 2026</div>
              </div>
              <div className="deadline-pill-v52 orange">DUE IN 2 DAYS</div>
            </div>

            <div className="split-divider-v52"></div>

            <div className="deadline-item-v52">
              <div className="deadline-info-v52">
                <div className="deadline-item-title-v52">GSTR-3B (Summary Return)</div>
                <div className="deadline-item-date-v52">Due Date: April 20, 2026</div>
              </div>
              <div className="deadline-pill-v52 slate">DUE IN 11 DAYS</div>
            </div>

            <div className="deadline-success-note-v52">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>No missed deadlines this month</span>
            </div>
          </div>
        </div>
      )}

      {/* GST Breakdown Section - Only for Regular & Composition */}
      {gstType !== 'non-gst' && (
        <div className="gst-section-v52">
          {gstType === 'regular' ? (
            <>
              <div className="gst-breakdown-header-v52">
                <h3 className="section-title-v52">GST Breakdown for March</h3>
              </div>

              <div className="split-card-v52">
                <div className="breakdown-item-v52">
                  <div className="item-info-v52">
                    <label>CGST (intra-state)</label>
                    <span className="subtitle-v52">Central Goods and Services Tax</span>
                  </div>
                  <span className="value-v52">₹37,125</span>
                </div>

                <div className="breakdown-item-v52">
                  <div className="item-info-v52">
                    <label>SGST (intra-state)</label>
                    <span className="subtitle-v52">State Goods and Services Tax</span>
                  </div>
                  <span className="value-v52">₹37,125</span>
                </div>

                <div className="breakdown-item-v52">
                  <div className="item-info-v52">
                    <label>IGST (inter-state)</label>
                    <span className="subtitle-v52">Integrated Goods and Services Tax</span>
                  </div>
                  <span className="value-v52">₹74,250</span>
                </div>

                <div className="split-divider-v52"></div>

                <div className="split-row-v52 bold">
                  <label>GST Collected</label>
                  <span>₹1,48,500</span>
                </div>
                <div className="split-row-v52 error bold">
                  <label>ITC Available</label>
                  <span>-₹12,400</span>
                </div>

                <div className="final-payable-box-v52">
                  <div className="final-label-v52">Final GST Payable</div>
                  <div className="final-value-v52">₹1,36,100</div>
                </div>

                <div className="gst-report-period-v52">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  <span>This report includes transactions received between March 01, 2026 and March 31, 2026</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="monthly-ref-header-v52">
                <h3 className="section-title-v52">Monthly Breakdown (for reference)</h3>
                <div className="monthly-instructions-v52">
                  <p>Monthly breakdown is for reference. Tax is filed quarterly.</p>
                  <p>Platform charges include commission + GST (GST is not claimable under composition scheme)</p>
                </div>
              </div>

              {/* January Card */}
              <div className="month-record-card-v52">
                <div className="record-month-name-v52">January</div>
                <div className="record-data-grid-v52">
                  <div className="record-row-v52">
                    <div className="record-label-v52">Total Turnover</div>
                    <div className="record-value-container-v52">
                      <span className="record-main-val-v52">₹2,50,000</span>
                      <span className="turnover-split-muted-v52">₹1,00,000 platform + ₹1,50,000 Paid at Event</span>
                    </div>
                  </div>
                  <div className="record-row-v52">
                    <div className="record-label-v52">Estimated Tax</div>
                    <div className="record-value-container-v52">
                      <span className="record-main-val-v52">₹15,000</span>
                    </div>
                  </div>
                  <div className="record-row-v52">
                    <div className="record-label-v52">Platform Fee</div>
                    <div className="record-value-container-v52">
                      <span className="record-main-val-v52">₹1,800</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* February Card */}
              <div className="month-record-card-v52">
                <div className="record-month-name-v52">February</div>
                <div className="record-data-grid-v52">
                  <div className="record-row-v52">
                    <div className="record-label-v52">Total Turnover</div>
                    <div className="record-value-container-v52">
                      <span className="record-main-val-v52">₹3,00,000</span>
                      <span className="turnover-split-muted-v52">₹1,20,000 platform + ₹1,80,000 Paid at Event</span>
                    </div>
                  </div>
                  <div className="record-row-v52">
                    <div className="record-label-v52">Estimated Tax</div>
                    <div className="record-value-container-v52">
                      <span className="record-main-val-v52">₹18,000</span>
                    </div>
                  </div>
                  <div className="record-row-v52">
                    <div className="record-label-v52">Platform Fee</div>
                    <div className="record-value-container-v52">
                      <span className="record-main-val-v52">₹1,800</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* March Card */}
              <div className="month-record-card-v52">
                <div className="record-month-name-v52">March</div>
                <div className="record-data-grid-v52">
                  <div className="record-row-v52">
                    <div className="record-label-v52">Total Turnover</div>
                    <div className="record-value-container-v52">
                      <span className="record-main-val-v52">₹2,75,000</span>
                      <span className="turnover-split-muted-v52">₹1,10,000 platform + ₹1,65,000 Paid at Event</span>
                    </div>
                  </div>
                  <div className="record-row-v52">
                    <div className="record-label-v52">Estimated Tax</div>
                    <div className="record-value-container-v52">
                      <span className="record-main-val-v52">₹16,500</span>
                    </div>
                  </div>
                  <div className="record-row-v52">
                    <div className="record-label-v52">Platform Fee</div>
                    <div className="record-value-container-v52">
                      <span className="record-main-val-v52">₹1,800</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Quarter Card */}
              <div className="month-record-card-v52 quarter-total-highlight-v52">
                <div className="record-month-name-v52">Total (Quarter)</div>
                <div className="record-data-grid-v52">
                  <div className="record-row-v52">
                    <div className="record-label-v52">Total Turnover</div>
                    <div className="record-value-container-v52">
                      <span className="record-main-val-v52">₹8,25,000</span>
                      <span className="turnover-split-muted-v52">₹3,30,000 platform + ₹4,95,000 Paid at Event</span>
                    </div>
                  </div>
                  <div className="record-row-v52">
                    <div className="record-label-v52">Estimated Tax</div>
                    <div className="record-value-container-v52">
                      <span className="record-main-val-v52">₹49,500</span>
                    </div>
                  </div>
                  <div className="record-row-v52">
                    <div className="record-label-v52">Platform Fee</div>
                    <div className="record-value-container-v52">
                      <span className="record-main-val-v52">₹5,400</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Compliance Documents - Only for GST Registered */}
      {gstType !== 'non-gst' && (
        <div className="gst-section-v52">
          <h3 className="section-title-v52">Compliance Documents</h3>
          <div className="split-card-v52">
            <div className="doc-category-v52" style={{ marginTop: 0 }}>
              <div className="doc-sublabel-v52">REPORTS</div>
              <div className="doc-grid-v52">
                <button className="doc-btn-v52">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0077ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  <span>GSTR-1 Data</span>
                </button>
                <button className="doc-btn-v52">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0077ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  <span>GSTR-3B Summary</span>
                </button>
              </div>
            </div>

            <div className="doc-category-v52">
              <div className="doc-sublabel-v52">INVOICES</div>
              <div className="doc-grid-v52">
                <button className="doc-btn-v52">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0077ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  <span>B2B Invoices</span>
                </button>
              </div>
            </div>

            <div className="doc-category-v52">
              <div className="doc-sublabel-v52">OPTIONAL</div>
              <div className="doc-grid-v52">
                <button className="doc-btn-v52">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0077ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  <span>Full GST Summary</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Info Section - Only for GST Registered */}
      {gstType !== 'non-gst' && (
        <div className="gst-footer-info-v52">
          <div className="footer-notice-v52 c-accountant">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            <p>Share this report with your <strong>Chartered Accountant (CA)</strong> for final GST filing.</p>
          </div>
          <div className="footer-notice-v52 disclaimer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            <div className="disclaimer-list-v52">
              {gstType === 'regular' ? (
                <>
                  <p>• This report includes platform transactions and self-reported earnings. Please verify all details before filing.</p>
                  <p>• GST reporting is based on common tax rules. Consult with your tax advisor for specific cases.</p>
                </>
              ) : (
                <>
                  <p>• Tax is calculated on total turnover</p>
                  <p>• Input Tax Credit (ITC) is not applicable under composition scheme</p>
                  <p>• GST is not charged separately to customers</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
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
      <div className="tds-header-section-v53">
        <h2 className="tds-main-title-v53">TDS Compliance Dashboard</h2>
        <p className="tds-main-subtitle-v53">Track your Tax Deducted at Source (TDS) and download certificates.</p>
      </div>
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

      <div className="tds-summary-grid-v53">
        <div className="tds-summary-card-v53">
          <div className="summary-label-v53">Total Amount Received</div>
          <div className="summary-value-v53">₹{totalNet.toLocaleString()}</div>
          <div className="summary-subtext-v53">(after TDS deduction)</div>
        </div>

        <div className="tds-summary-card-v53">
          <div className="summary-label-v53">Total TDS Deducted</div>
          <div className="summary-value-v53 highlight-blue">₹{totalTDS.toLocaleString()}</div>
          <div className="regulatory-info-v53">
            0.1% TDS is deducted as per government regulations and can be claimed while filing your income tax return.
          </div>
        </div>
      </div>


      {/* Monthly TDS Breakdown */}
      <div className="tds-section-v53">
        <div className="section-header-v53">
          <div className="title-group-v53">
            <h3 className="section-title-v53">Monthly TDS Breakdown</h3>
            <span className="section-subtitle-v53">Q2 (Jul–Sep 2025)</span>
          </div>
        </div>

        <div className="tds-month-stack-v53">
          {monthlyData.map(d => (
            <div key={d.month} className="tds-month-card-v53">
              <div className="month-name-v53">{d.month} 2025</div>
              <div className="month-grid-v53">
                <div className="grid-item-v53">
                  <label>PAYOUT AMOUNT (BEFORE TDS)</label>
                  <span>₹{d.earnings.toLocaleString()}</span>
                </div>
                <div className="grid-item-v53">
                  <label>TDS DEDUCTED</label>
                  <span>₹{d.tds.toLocaleString()}</span>
                </div>
                <div className="grid-item-v53 highlight">
                  <label>NET RECEIVED</label>
                  <span className="net-val-v53">₹{d.net.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}

          {/* Total Row */}
          <div className="tds-total-card-v53">
            <div className="total-label-v53">Total</div>
            <div className="month-grid-v53">
              <div className="grid-item-v53">
                <label>PAYOUT AMOUNT (BEFORE TDS)</label>
                <span>₹{totalEarnings.toLocaleString()}</span>
              </div>
              <div className="grid-item-v53">
                <label>TDS DEDUCTED</label>
                <span>₹{totalTDS.toLocaleString()}</span>
              </div>
              <div className="grid-item-v53 highlight">
                <label>NET RECEIVED</label>
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
        <div className="cert-header-section-v53">
          <div className="cert-title-row-v53">
            <h3 className="section-title-v53">Your TDS Certificate (Form 16A)</h3>
            <span className="cert-status-badge-new-v53">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              Available
            </span>
          </div>
          <span className="cert-quarter-sub-v53">Quarter: Q2 (Jul – Sep 2025)</span>
        </div>

        <p className="cert-main-desc-v53">
          Use this certificate to claim your TDS while filing your income tax return (ITR).
        </p>

        <div className="cert-info-box-v53">
          <div className="cert-issue-date-v53">ISSUED ON: 15 NOV 2025</div>
          <div className="cert-includes-text-v53">Includes all TDS deducted for Jul – Sep 2025</div>
        </div>

        <button className="primary-doc-btn-v53">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          Download Form 16A
        </button>

        <p className="cert-helper-v53">
          This certificate will also reflect in your Form 26AS
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
  profileData: ProfileData;
  navigationGroups: NavigationGroup[];
  onLogout: () => void;
  membershipStatus: any;
  setMembershipStatus: any;
  isBannerDismissed: boolean;
  setIsBannerDismissed: (val: boolean) => void;
  // Menu Creation Props
  isAddingMenu: boolean;
  setIsAddingMenu: (val: boolean) => void;
  menuStep: number;
  setMenuStep: (step: number | ((prev: number) => number)) => void;
  menuIdentity: MenuIdentity;
  setMenuIdentity: React.Dispatch<React.SetStateAction<any>>;
  sections: Section[];
  setSections: React.Dispatch<React.SetStateAction<Section[]>>;
  isAddingSection: boolean;
  setIsAddingSection: (val: boolean) => void;
  currentSection: Section;
  setCurrentSection: React.Dispatch<React.SetStateAction<any>>;
  sectionEditingIndex: number | null;
  setSectionEditingIndex: (val: number | null) => void;
  resetAddMenu: () => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSaveSection: () => void;
  menuEditingId: number | null;
  setMenuEditingId: (val: number | null) => void;
  // Global Menus
  menus: Menu[];
  setMenus: React.Dispatch<React.SetStateAction<Menu[]>>;
  // Boost Credits Props
  boostCredits: number;
  setBoostCredits: any;
  isBoostSheetOpen: boolean;
  setIsBoostSheetOpen: any;
  showBoostToast: boolean;
  setShowBoostToast: any;
  isCalendarView: boolean;
  setIsCalendarView: any;
  selectedBoostDates: string[];
  setSelectedBoostDates: any;
  mockBookingData: Record<string, string>;
  isUsageDetailsView: boolean;
  setIsUsageDetailsView: any;
  usageHistory: any[];
}

/* ─────────────────── MOBILE COUPON FORM VIEW (v59) ─────────────────── */

const MobileCouponFormView = ({
  onClose,
  onSave,
  initialData = null
}: {
  onClose: () => void,
  onSave: (coupon: Coupon) => void,
  initialData?: Coupon | null
}) => {
  const [form, setForm] = useState({
    code: '',
    discountType: 'percentage' as 'percentage' | 'flat',
    discountValue: '',
    maxCap: '',
    scope: 'all' as 'all' | 'specific',
    selectedTargets: [] as string[],
    minAmount: '',
    totalLimit: '',
    isUnlimited: false,
    perUserLimit: '1',
    validFrom: new Date().toISOString().split('T')[0],
    validTo: '',
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        code: initialData.code || '',
        discountType: initialData.type === 'Percentage' ? 'percentage' : 'flat',
        discountValue: initialData.value ? initialData.value.replace(/[^\d.]/g, '') : '',
        maxCap: initialData.maxCap || '',
        scope: initialData.scope || (initialData.applicability === 'orders' ? 'all' : 'specific'), // Rough mapping
        selectedTargets: initialData.selectedTargets || [],
        minAmount: initialData.minAmount || '',
        totalLimit: initialData.usage ? initialData.usage.split('/')[1] : '',
        isUnlimited: initialData.usage?.includes('∞') || false,
        perUserLimit: initialData.perUserLimit || '1',
        validFrom: initialData.validFrom || new Date().toISOString().split('T')[0],
        validTo: initialData.validTo || '',
      });
    }
  }, [initialData]);

  const categories = ['Breakfast', 'Lunch', 'Snacks', 'Dinner'];

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    setForm({ ...form, code });
  };

  const toggleTarget = (target: string) => {
    setForm(prev => ({
      ...prev,
      selectedTargets: prev.selectedTargets.includes(target)
        ? prev.selectedTargets.filter(t => t !== target)
        : [...prev.selectedTargets, target]
    }));
  };

  const isFormValid = form.code && form.discountValue && (form.scope === 'all' || form.selectedTargets.length > 0);

  const handleSubmit = () => {
    // Sanitize values
    const cleanValue = form.discountValue.replace(/[^\d.]/g, '');
    onSave({
      ...form,
      id: initialData?.id || Math.random().toString(36).substr(2, 9),
      type: form.discountType === 'percentage' ? 'Percentage' : 'Flat Amount',
      value: form.discountType === 'percentage' ? `${cleanValue}%` : `₹${cleanValue}`,
      status: initialData?.status || 'Active',
      usage: initialData?.usage || `0/${form.isUnlimited ? '∞' : (form.totalLimit || '∞')}`,
      source: 'vendor',
      applicability: 'orders'
    });
    onClose();
  };

  return (
    <div className="mobile-create-coupon-overlay-v59">
      <header className="create-coupon-header-v59">
        <button className="mobile-action-btn-v50" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b' }}>
          {initialData ? 'Edit Coupon' : 'Create New Coupon'}
        </h2>
      </header>

      <div className="create-coupon-body-v59">
        <div className="create-coupon-preview-sticky-v59">
          <div className="preview-card-v60">
            <div className="preview-header-v60">
              <span className="preview-status-badge-v60">
                <div className="status-dot-v60"></div>
                Active
              </span>
              <div className="preview-discount-row-v60">
                <div className="preview-discount-value-v60">
                  {form.discountType === 'percentage' ? '%' : '₹'}{form.discountValue || '0'}
                  <span className="preview-discount-off-v60">OFF</span>
                </div>
                <div className="preview-code-box-v60">
                  <span className="preview-code-label-v60">CODE:</span>
                  <span className="preview-code-text-v60">{form.code || 'AUTUMN25'}</span>
                </div>
              </div>
            </div>

            <div className="preview-divider-v60"></div>

            <div className="preview-details-grid-v60">
              <div className="preview-detail-item-v60">
                <span className="preview-detail-label-v60">Min. Booking Amount</span>
                <span className="preview-detail-value-v60">₹ {form.minAmount || '0'}</span>
              </div>
              <div className="preview-detail-item-v60">
                <span className="preview-detail-label-v60">Maximum Discount Cap</span>
                <span className="preview-detail-value-v60">₹ {form.discountType === 'flat' ? 'Not Applicable' : (form.maxCap || '0')}</span>
              </div>
              <div className="preview-detail-item-v60">
                <span className="preview-detail-label-v60">Total Usage Limit</span>
                <span className="preview-detail-value-v60">{form.isUnlimited ? 'Unlimited' : (form.totalLimit || 'Unlimited')}</span>
              </div>
              <div className="preview-detail-item-v60">
                <span className="preview-detail-label-v60">Per User Limit</span>
                <span className="preview-detail-value-v60">{form.perUserLimit || '1'}</span>
              </div>
              <div className="preview-detail-item-v60">
                <span className="preview-detail-label-v60">Validity Period</span>
                <span className="preview-detail-value-v60">
                  {(() => {
                    try {
                      const from = form.validFrom ? new Date(form.validFrom) : new Date();
                      const to = form.validTo ? new Date(form.validTo) : null;
                      const fromStr = isNaN(from.getTime()) ? 'Today' : from.toLocaleDateString('en-GB');
                      const toStr = (to && !isNaN(to.getTime())) ? to.toLocaleDateString('en-GB') : 'No Expiry';
                      return `${fromStr} — ${toStr}`;
                    } catch (e) {
                      return 'Today — No Expiry';
                    }
                  })()}
                </span>
              </div>
              <div className="preview-detail-item-v60">
                <span className="preview-detail-label-v60">Applicability</span>
                <span className="preview-detail-value-v60">{form.scope === ('all' as 'all' | 'specific') ? 'All Categories' : 'Specific Categories'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Coupon Details */}
        <div className="create-coupon-section-v59">
          <span className="create-coupon-label-v59">Coupon Code</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              className="coupon-input-v59"
              style={{ flex: 1 }}
              placeholder="e.g. SAVE500"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
            />
            <button
              className="coupon-action-btn-v58 primary"
              style={{ flex: 'none', padding: '0 16px', borderRadius: '12px' }}
              onClick={generateCode}
            >
              Generate
            </button>
          </div>

          <div style={{ marginTop: '16px' }}>
            <span className="create-coupon-label-v59">Discount Type & Value</span>
            <div className="coupon-toggle-group-v59" style={{ marginBottom: '12px' }}>
              <button
                className={`coupon-toggle-btn-v59 ${form.discountType === 'percentage' ? 'active' : ''}`}
                onClick={() => setForm({ ...form, discountType: 'percentage' })}
              >
                % Percentage
              </button>
              <button
                className={`coupon-toggle-btn-v59 ${form.discountType === 'flat' ? 'active' : ''}`}
                onClick={() => setForm({ ...form, discountType: 'flat' })}
              >
                ₹ Flat Amount
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontWeight: 800, color: '#94a3b8' }}>
                {form.discountType === 'percentage' ? '%' : '₹'}
              </span>
              <input
                type="number"
                className="coupon-input-v59"
                style={{ paddingLeft: '36px' }}
                placeholder="0.00"
                value={form.discountValue}
                onChange={(e) => setForm({ ...form, discountValue: e.target.value.replace(/[^\d.]/g, '') })}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Limits */}
        <div className="create-coupon-section-v59">
          <div style={{ marginBottom: '16px' }}>
            <span className="create-coupon-label-v59">Minimum Booking Amount</span>
            <input
              type="number"
              className="coupon-input-v59"
              placeholder="₹ 0"
              value={form.minAmount}
              onChange={(e) => setForm({ ...form, minAmount: e.target.value.replace(/[^\d.]/g, '') })}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <span className="create-coupon-label-v59">Maximum Discount Cap</span>
            <input
              type="number"
              className="coupon-input-v59"
              placeholder={form.discountType === 'flat' ? 'Not Applicable' : 'No Limit'}
              disabled={form.discountType === 'flat'}
              value={form.discountType === 'flat' ? '' : form.maxCap}
              onChange={(e) => setForm({ ...form, maxCap: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <span className="create-coupon-label-v59">Total Uses</span>
              <input
                type="number"
                className="coupon-input-v59"
                placeholder="Unlimited"
                disabled={form.isUnlimited}
                value={form.totalLimit}
                onChange={(e) => setForm({ ...form, totalLimit: e.target.value })}
              />
            </div>
            <div>
              <span className="create-coupon-label-v59">Per User Limit</span>
              <input
                type="number"
                className="coupon-input-v59"
                value={form.perUserLimit}
                onChange={(e) => setForm({ ...form, perUserLimit: e.target.value })}
              />
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
            <input
              type="checkbox"
              checked={form.isUnlimited}
              onChange={(e) => setForm({ ...form, isUnlimited: e.target.checked })}
            />
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b' }}>UNLIMITED USES</span>
          </label>
        </div>

        {/* Section 3: Applicability */}
        <div className="create-coupon-section-v59">
          <span className="create-coupon-label-v59">Target Categories</span>
          <div className="applicability-grid-v59">
            <button
              className={`applicability-card-v59 ${form.scope === 'all' ? 'active' : ''}`}
              onClick={() => setForm({ ...form, scope: 'all', selectedTargets: [] })}
            >
              <svg className="applicability-icon-v59" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              <span className="applicability-title-v59">All Items</span>
            </button>
            <button
              className={`applicability-card-v59 ${form.scope === 'specific' ? 'active' : ''}`}
              onClick={() => setForm({ ...form, scope: 'specific' })}
            >
              <svg className="applicability-icon-v59" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
              <span className="applicability-title-v59">Specific</span>
            </button>
          </div>

          {form.scope === 'specific' && (
            <div className="target-chips-v59">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`target-chip-v59 ${form.selectedTargets.includes(cat) ? 'active' : ''}`}
                  onClick={() => toggleTarget(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Section 4: Validity */}
        <div className="create-coupon-section-v59">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <span className="create-coupon-label-v59">Valid From</span>
              <input
                type="date"
                className="coupon-input-v59"
                value={form.validFrom}
                onChange={(e) => setForm({ ...form, validFrom: e.target.value })}
              />
            </div>
            <div>
              <span className="create-coupon-label-v59">Expires On</span>
              <input
                type="date"
                className="coupon-input-v59"
                value={form.validTo}
                onChange={(e) => setForm({ ...form, validTo: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="create-coupon-footer-v59">
        <button
          className="submit-coupon-btn-v59"
          disabled={!isFormValid}
          onClick={handleSubmit}
        >
          Create Coupon
        </button>
      </div>
    </div>
  );
};

const MobileCouponsView = ({
  coupons,
  setCoupons,
  setEditingCoupon,
  setIsAddingCoupon
}: {
  coupons: Coupon[],
  setCoupons: React.Dispatch<React.SetStateAction<Coupon[]>>,
  setEditingCoupon: (val: Coupon) => void,
  setIsAddingCoupon: (val: boolean) => void
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'vendor' | 'platform'>('vendor');

  const filteredCoupons = coupons.filter(c => c.source === activeSubTab);

  const renderValidityStatus = (validTo: string) => {
    if (!validTo) return { text: 'No Expiry', class: 'validity-calm-v58' };
    const expiry = new Date(validTo);
    if (isNaN(expiry.getTime())) return { text: 'No Expiry', class: 'validity-calm-v58' };

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: 'Expired', class: 'validity-urgent-v58' };
    if (diffDays === 0) return { text: 'Expires today', class: 'validity-urgent-v58' };
    if (diffDays <= 3) return { text: `${diffDays} days left`, class: 'validity-soon-v58' };
    return { text: `${diffDays} days left`, class: 'validity-calm-v58' };
  };

  const getUsagePercentage = (usage: string) => {
    if (!usage) return 0;
    const [current, total] = usage.split('/');
    if (total === '∞' || !total) return 100;
    const currNum = parseInt(current) || 0;
    const totNum = parseInt(total) || 1;
    return Math.min(100, (currNum / totNum) * 100);
  };

  const toggleStatus = (id: string) => {
    setCoupons((prev: Coupon[]) => prev.map((c: Coupon) =>
      c.id === id ? { ...c, status: c.status === 'Active' ? 'Inactive' : 'Active' } : c
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
                  {new Date(coupon.validFrom).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                  {coupon.validTo ? ` → ${new Date(coupon.validTo).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}` : ' (No Expiry)'}
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
                  <button
                    className="coupon-action-btn-v58 primary"
                    onClick={() => {
                      setEditingCoupon(coupon);
                      setIsAddingCoupon(true);
                    }}
                  >
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
        <button className="coupons-fab-v58" onClick={() => setIsAddingCoupon(true)}>
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

/* ─────────────────── MOBILE PROFILE VIEW (v60) ─────────────────── */

const MobileProfileView = ({
  profileData,
  onEdit,
  onAddBank,
  onSetPrimary,
  onDeleteBank
}: {
  profileData: ProfileData,
  onEdit: () => void,
  onAddBank: () => void,
  onSetPrimary: (id: string) => void,
  onDeleteBank: (id: string) => void
}) => {
  const [activeSubTab, setActiveSubTab] = useState('Summary');
  const subTabs = ['Summary', 'Documents', 'Bank Details'];

  const renderSummary = () => (
    <div className="profile-summary-v60">
      <div className="profile-card-v60">
        <div className="profile-card-header-v60">
          <h3>Personal Details</h3>
        </div>
        <div className="profile-card-body-v60">
          <div className="profile-field-v60">
            <label>OWNER NAME</label>
            <p>{profileData.owner?.name || 'Bhargav'}</p>
            <span className="verified-badge-v60">verified from pan</span>
          </div>
          <div className="profile-field-v60">
            <label>MOBILE NUMBER</label>
            <p>{profileData.owner?.mobile || '+91 96000 00001'}</p>
          </div>
          <div className="profile-field-v60">
            <label>MAIL ID</label>
            <p>{profileData.owner?.email || 'contact@cateringent3.com'}</p>
          </div>
        </div>
      </div>

      <div className="profile-card-v60">
        <div className="profile-card-header-v60">
          <h3>Business Details</h3>
        </div>
        <div className="profile-card-body-v60">
          <div className="profile-field-v60">
            <label>BUSINESS NAME</label>
            <p>{profileData.header?.name || 'Catering Enterprise 3'}</p>
            <span className="verified-badge-v60">verified from fssai</span>
          </div>
          <div className="profile-field-v60">
            <label>SERVICE CATEGORY</label>
            <p>{profileData.business?.category || 'Catering'}</p>
          </div>
          <div className="profile-field-v60">
            <label>ADDRESS</label>
            <p>{profileData.business?.address || 'Plot No. 42, Sector 5, HSR Layout, Bengaluru, Karnataka 560102'}</p>
            <span className="verified-badge-v60">verified from fssai</span>
          </div>
        </div>
      </div>

      <div className="profile-preview-card-v60">
        <div className="preview-label-v60">BUSINESS PREVIEW</div>
        <div className="customer-app-card-v60">
          <div className="app-card-image-v60">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
          </div>
          <div className="app-card-info-v60">
            <h4>{profileData.header?.name || 'Catering Enterprise 3'}</h4>
            <div className="app-card-meta-v60">
              <span className="cat-chip-v60">Catering</span>
              <span className="rating-chip-v60">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                4.8 (120+)
              </span>
            </div>
            <div className="app-card-loc-v60">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <span>Hyderabad, Telangana</span>
            </div>
          </div>
        </div>
        <p className="preview-note-v60">This is how your business appears to customers.</p>
      </div>

      <div className="profile-footer-note-v60">
        Details verified by the GST, FSSAI, PAN can't be editable
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="profile-documents-v60">
      {(profileData.documents || [
        { type: 'GST Certificate', identifier: '36AAAAA0000A1Z5', date: '14 Feb 2026', status: 'Verified' },
        { type: 'PAN Card', identifier: 'ABCDE1234F', date: '14 Feb 2026', status: 'Verified' },
        { type: 'FSSAI License', identifier: '12345678901234', date: '14 Feb 2026', status: 'Verified' }
      ]).map((doc, idx) => (
        <div key={idx} className="doc-item-card-v60">
          <div className="doc-icon-v60">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
          </div>
          <div className="doc-info-v60">
            <h4>{doc.type}</h4>
            <p>{doc.identifier}</p>
            <span>Verified on {doc.date}</span>
          </div>
          <div className="doc-status-v60">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
        </div>
      ))}
    </div>
  );

  const renderBankDetails = () => (
    <div className="profile-bank-v60">
      <button className="add-bank-btn-v62" onClick={onAddBank}>
        <div className="add-bank-icon-v62">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </div>
        <span>Add Bank Account</span>
      </button>

      {(profileData.bankAccounts || [
        { id: '1', bankName: 'HDFC Bank', holderName: 'Bhargav', accountNumber: 'XXXX XXXX 9012', ifsc: 'HDFC0001234', accountType: 'Savings Account', status: 'Verified', lastUpdated: '14 Feb 2026', isPrimary: true },
        { id: '2', bankName: 'ICICI Bank', holderName: 'Bhargav', accountNumber: 'XXXX XXXX 5678', ifsc: 'ICIC0005678', accountType: 'Savings Account', status: 'Verified', lastUpdated: '20 Mar 2026', isPrimary: false }
      ]).map((acc, idx) => (
        <div key={idx} className="bank-account-card-v60">
          <div className="bank-card-header-v60">
            <div className="bank-name-group-v60">
              <div className="bank-logo-v60">{acc.bankName.charAt(0)}</div>
              <div>
                <h4>{acc.bankName}</h4>
                <p>{acc.accountType}</p>
              </div>
            </div>
            <div className="bank-header-actions-v62">
              {acc.isPrimary ? (
                <span className="primary-pill-v60">Primary</span>
              ) : (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button className="set-primary-btn-v63" onClick={() => onSetPrimary(acc.id)}>
                    Set as Primary
                  </button>
                  <button className="delete-bank-btn-v62" onClick={() => onDeleteBank(acc.id)}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="bank-card-body-v60">
            <div className="bank-row-v60">
              <label>Account Holder</label>
              <span>{acc.holderName}</span>
            </div>
            <div className="bank-row-v60">
              <label>Account Number</label>
              <span>{acc.accountNumber}</span>
            </div>
            <div className="bank-row-v60">
              <label>IFSC Code</label>
              <span>{acc.ifsc}</span>
            </div>
          </div>
          <div className="bank-card-footer-v60 bank-footer-v62">
            <span className="verified-status-v60">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
              Verified
            </span>
            <span className="last-updated-v62">Last Updated: {acc.lastUpdated}</span>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="mobile-profile-view-v60 mobile-scroller-v50">
      <div className="profile-header-container-v60">
        <div className="profile-header-title-row-v60">
          <h1 className="profile-business-name-v60">{profileData.header?.name || 'Catering Enterprise 3'}</h1>
          <button className="edit-profile-btn-v60" onClick={onEdit}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            Edit
          </button>
        </div>

        <div className="profile-meta-chips-v60">
          <span className="meta-chip-v60 id-chip-v60">{profileData.header?.id || 'MYMCATKAR0003'}</span>
          <span className="meta-status-pill-v60 active-v60">Active</span>
        </div>

        <div className="profile-quick-stats-v60">
          <div className="stat-item-v60">
            <label>Joined</label>
            <span>{profileData.header?.joined || '18 Nov 2024'}</span>
          </div>
          <div className="stat-item-v60">
            <label>GST Type</label>
            <span>{profileData.header?.gstType || 'Regular'}</span>
          </div>
          <div className="stat-item-v60">
            <label>Service</label>
            <span>{profileData.header?.service || 'Catering'}</span>
          </div>
        </div>
      </div>

      <div className="profile-tabs-nav-v60">
        {subTabs.map(tab => (
          <button
            key={tab}
            className={`profile-tab-btn-v60 ${activeSubTab === tab ? 'active' : ''}`}
            onClick={() => setActiveSubTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="profile-content-area-v60">
        {activeSubTab === 'Summary' && renderSummary()}
        {activeSubTab === 'Documents' && renderDocuments()}
        {activeSubTab === 'Bank Details' && renderBankDetails()}
      </div>
    </div>
  );
};

/* ─────────────────── MOBILE ADD BANK VIEW (v63) ─────────────────── */

const MobileAddBankView = ({
  onClose,
  handleImageUpload
}: {
  onClose: () => void,
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
}) => {
  return (
    <div className="mobile-full-overlay-v61">
      <div className="add-bank-container-v63">
        {/* Header */}
        <div className="edit-profile-header-v61">
          <div className="header-icon-box-v63">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          </div>
          <div className="header-content-v61">
            <h2>Add Bank Details</h2>
            <p>Submit new account details for verification.</p>
          </div>
          <button className="close-overlay-btn-v61" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Body */}
        <div className="edit-profile-body-v61 add-bank-body-v63">
          <div className="mobile-form-grid-v63">
            <div className="form-field-v63">
              <label>BANK NAME</label>
              <input type="text" placeholder="e.g. HDFC Bank" />
            </div>
            <div className="form-field-v63">
              <label>ACCOUNT TYPE</label>
              <select className="form-select-v63">
                <option>Savings Account</option>
                <option>Current Account</option>
              </select>
            </div>
            <div className="form-field-v63">
              <label>ACCOUNT HOLDER NAME</label>
              <input type="text" placeholder="Name as on passbook" />
            </div>
            <div className="form-field-v63">
              <label>IFSC CODE</label>
              <input type="text" placeholder="e.g. HDFC0001234" />
            </div>
            <div className="form-field-v63">
              <label>ACCOUNT NUMBER</label>
              <input type="text" placeholder="Enter account number" />
            </div>
            <div className="form-field-v63">
              <label>CONFIRM ACCOUNT NUMBER</label>
              <input type="text" placeholder="Re-enter account number" />
            </div>
          </div>

          <div className="upload-section-v61" style={{ marginTop: '24px' }}>
            <label>UPLOAD PASSBOOK / CANCELLED CHEQUE</label>
            <div className="image-dropzone-v61" onClick={() => document.getElementById('bank-doc-upload')?.click()}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
              <span>CLICK TO UPLOAD PDF OR IMAGE</span>
              <input
                id="bank-doc-upload"
                type="file"
                hidden
                onChange={handleImageUpload}
                accept="image/*,application/pdf"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="edit-profile-footer-v61">
          <button className="footer-cancel-btn-v61" onClick={onClose}>Cancel</button>
          <button className="footer-save-btn-v61 inactive-v63" disabled>Submit for Verification</button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────── MOBILE EDIT PROFILE VIEW (v61) ─────────────────── */

const MobileEditProfileView = ({
  onClose,
  handleImageUpload
}: {
  onClose: () => void,
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
}) => {
  return (
    <div className="mobile-full-overlay-v61">
      <div className="edit-profile-container-v61">
        {/* Header */}
        <div className="edit-profile-header-v61">
          <div className="header-icon-box-v61">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1e293b" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </div>
          <div className="header-content-v61">
            <h2>Edit Profile</h2>
            <p>Update your basic profile information.</p>
          </div>
          <button className="close-overlay-btn-v61" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Body */}
        <div className="edit-profile-body-v61">
          <div className="upload-section-v61">
            <label>BUSINESS IMAGE</label>
            <div className="image-dropzone-v61" onClick={() => document.getElementById('profile-img-upload')?.click()}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
              <span>CLICK TO CHANGE BUSINESS IMAGE</span>
              <input
                id="profile-img-upload"
                type="file"
                hidden
                onChange={handleImageUpload}
                accept="image/*"
              />
            </div>
          </div>

          <div className="account-notice-box-v61">
            <p>
              To change your Mobile Number or Email Address, please go to
              <span className="notice-link-v61"> Settings &gt; Account</span>.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="edit-profile-footer-v61">
          <button className="footer-cancel-btn-v61" onClick={onClose}>Cancel</button>
          <button className="footer-save-btn-v61" onClick={onClose}>Save Changes</button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────── MOBILE SECURITY CONFIRM MODAL (v69) ─────────────────── */

const MobileSecurityConfirmModal = ({
  type,
  onClose,
  onConfirm
}: {
  type: 'logout-all' | 'remove-device',
  onClose: () => void,
  onConfirm: () => void
}) => {
  const isLogoutAll = type === 'logout-all';

  return (
    <div className="confirm-overlay-v69">
      <div className="confirm-modal-v69">
        <div className="confirm-body-v69">
          <div className="confirm-icon-bg-v69">
            {isLogoutAll ? (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            ) : (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="3"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            )}
          </div>
          <h2 className="confirm-title-v69">
            {isLogoutAll ? 'Logout all devices?' : 'Remove Device?'}
          </h2>
          <p className="confirm-subtitle-v69">
            {isLogoutAll
              ? 'Are you sure you want to logout all devices?'
              : 'Are you sure you want to remove the device? By removing, they will logout on their device.'}
          </p>
        </div>
        <div className="confirm-footer-v69">
          <button className="confirm-cancel-btn-v69" onClick={onClose}>Cancel</button>
          <button className="confirm-action-btn-v69" onClick={() => { onConfirm(); onClose(); }}>
            {isLogoutAll ? 'Logout All' : 'Remove'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────── MOBILE CHANGE PASSWORD VIEW (v67) ─────────────────── */

const MobileChangePasswordView = ({ onClose }: { onClose: () => void }) => {
  const [step, setStep] = useState<'verify' | 'otp' | 'new-password'>('verify');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const renderVerifyStep = () => (
    <div className="pw-modal-v67">
      <div className="pw-header-v67">
        <div className="pw-icon-box-v67 lock">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
        </div>
        <div className="pw-title-main-v67">
          <h2>Change Password</h2>
          <p>Verify your current password to continue.</p>
        </div>
      </div>

      <div className="pw-body-v67">
        <p className="pw-instruction-v67">
          For your security, please verify your identity by entering your current password.
        </p>

        <div className="pw-form-field-v67">
          <label>CURRENT PASSWORD</label>
          <div className="pw-input-wrapper-v67">
            <input
              type={showCurrentPassword ? 'text' : 'password'}
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <button
              className="pw-toggle-btn-v67"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
          </div>
        </div>

        <button className="forgot-pw-link-v67" onClick={() => setStep('otp')}>Forgot password?</button>
      </div>

      <div className="pw-footer-v67">
        <button className="pw-cancel-btn-v67" onClick={onClose}>Cancel</button>
        <button
          className={`pw-continue-btn-v67 ${currentPassword.length > 0 ? 'active' : 'disabled'}`}
          onClick={() => currentPassword.length > 0 && setStep('otp')}
          disabled={currentPassword.length === 0}
        >
          Continue
        </button>
      </div>
    </div>
  );

  const renderOtpStep = () => (
    <div className="pw-modal-v67">
      <div className="pw-header-v67">
        <div className="pw-icon-box-v67 lock">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
        </div>
        <div className="pw-title-main-v67">
          <h2>Change Password</h2>
          <p>Verify code sent to your email.</p>
        </div>
      </div>

      <div className="pw-body-v67 text-center">
        <div className="mail-icon-bubble-v67">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0077ff" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
        </div>
        <p className="pw-instruction-v67">
          Enter the 6-digit code sent to emails
        </p>

        <div className="otp-container-v67">
          {otp.map((digit, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(i, e.target.value)}
              className="otp-dot-input-v67"
            />
          ))}
        </div>

        <div className="otp-meta-v67">
          <span>Valid for 05:00</span>
          <button className="resend-code-btn-v67">Resend Code</button>
        </div>
      </div>

      <div className="pw-footer-v67">
        <button className="pw-cancel-btn-v67" onClick={onClose}>Cancel</button>
        <button
          className={`pw-continue-btn-v67 ${otp.every(d => d !== '') ? 'active' : 'disabled'}`}
          onClick={() => otp.every(d => d !== '') && setStep('new-password')}
          disabled={!otp.every(d => d !== '')}
        >
          Verify & Continue
        </button>
      </div>
    </div>
  );

  const renderNewPasswordStep = () => {
    const hasMinLength = newPassword.length >= 8;
    const hasUpper = /[A-Z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const hasSpecial = /[!@#$%^&*]/.test(newPassword);
    const strength = [hasMinLength, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;

    return (
      <div className="pw-modal-v67">
        <div className="pw-header-v67">
          <div className="pw-icon-box-v67 lock">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          </div>
          <div className="pw-title-main-v67">
            <h2>Change Password</h2>
            <p>Create a strong new password.</p>
          </div>
        </div>

        <div className="pw-body-v67">
          <div className="pw-form-field-v67">
            <label>NEW PASSWORD</label>
            <div className="pw-input-wrapper-v67">
              <input
                type={showNewPassword ? 'text' : 'password'}
                placeholder="Min. 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                className="pw-toggle-btn-v67"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              </button>
            </div>
          </div>

          <div className="strength-meter-v68">
            <div className="strength-labels-v68">
              <span className={hasMinLength ? 'active' : ''}>8+ chars</span>
              <span className={hasUpper ? 'active' : ''}>Upper</span>
              <span className={hasNumber ? 'active' : ''}>Number</span>
              <span className={hasSpecial ? 'active' : ''}>Special</span>
            </div>
            <div className="strength-bar-bg-v68">
              <div
                className="strength-progress-v68"
                style={{
                  width: `${(strength / 4) * 100}%`,
                  backgroundColor: strength === 4 ? '#22c55e' : strength >= 2 ? '#f59e0b' : '#ef4444'
                }}
              />
            </div>
          </div>

          <div className="pw-form-field-v67" style={{ marginTop: '20px' }}>
            <label>CONFIRM NEW PASSWORD</label>
            <div className="pw-input-wrapper-v67">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Repeat new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                className="pw-toggle-btn-v67"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              </button>
            </div>
          </div>
        </div>

        <div className="pw-footer-v67">
          <button className="pw-cancel-btn-v67" onClick={onClose}>Cancel</button>
          <button
            className={`pw-continue-btn-v67 ${strength === 4 && confirmPassword === newPassword ? 'active' : 'disabled'}`}
            onClick={onClose}
            disabled={strength < 4 || confirmPassword !== newPassword}
          >
            Reset Password
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="pw-overlay-v67">
      {step === 'verify' && renderVerifyStep()}
      {step === 'otp' && renderOtpStep()}
      {step === 'new-password' && renderNewPasswordStep()}
    </div>
  );
};

/* ─────────────────── MOBILE SETTINGS VIEW (v64) ─────────────────── */

const MobileSettingsView = ({
  profileData,
  setIsChangingPassword,
  setSecurityConfirmModal,
  membershipStatus,
  setMembershipStatus,
  isBannerDismissed,
  setIsBannerDismissed,
  isManageModalOpen,
  setIsManageModalOpen
}: {
  profileData: any,
  setIsChangingPassword: (v: boolean) => void,
  setSecurityConfirmModal: (type: 'logout-all' | 'remove-device' | null) => void,
  membershipStatus: any,
  setMembershipStatus: any,
  isBannerDismissed: boolean,
  setIsBannerDismissed: (val: boolean) => void,
  isManageModalOpen: boolean,
  setIsManageModalOpen: (val: boolean) => void
}) => {
  const [activeSubTab, setActiveSubTab] = useState('Account');
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const subTabs = ['Account', 'Documents', 'myMembership', 'Security', 'Danger'];

  const renderAccountSettings = () => (
    <div className="settings-account-tab-v64">
      <div className="settings-section-v64">
        <h3 className="settings-section-title-v64">Account Settings</h3>

        <div className="settings-field-row-v64">
          <div className="field-info-v64">
            <label>Mobile Number</label>
            <p>{profileData.owner?.mobile || '9600000001'}</p>
          </div>
          <button className="field-edit-btn-v64">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
          </button>
        </div>

        <div className="settings-field-row-v64">
          <div className="field-info-v64">
            <label>Email Address</label>
            <p>{profileData.owner?.email || 'contact@cateringent3.com'}</p>
          </div>
          <button className="field-edit-btn-v64">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
          </button>
        </div>
      </div>
    </div>
  );

  const renderDocumentsSettings = () => {
    const policies = [
      { id: 'tnc', title: 'Terms & Conditions', date: '22 Jan 2026', type: 'updated' },
      { id: 'privacy', title: 'Privacy Policy', date: '15 Feb 2026', type: 'updated' },
      { id: 'refund', title: 'Refund & Cancellation Policy', date: '10 Jan 2026', type: 'updated' },
      { id: 'tds', title: 'TDS Policy', date: '01 Mar 2026', type: 'updated' },
    ];

    const agreements = [
      { id: 'vendor', title: 'Vendor Agreement', date: '03 Mar 2026', type: 'accepted' },
    ];

    const DocRow = ({ title, date, type }: { title: string, date: string, type: string }) => (
      <div className="doc-row-v65">
        <div className="doc-main-v65">
          <div className={`doc-icon-container-v65 ${type}`}>
            {type === 'accepted' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0077ff" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            )}
          </div>
          <div className="doc-info-v65">
            <h4>{title}</h4>
            <p>{type === 'accepted' ? 'Accepted on' : 'Last Updated'}: {date}</p>
          </div>
        </div>
        <div className="doc-actions-v65">
          <button className="view-doc-btn-v65">View</button>
          <button className="download-doc-btn-v65">Download</button>
        </div>
      </div>
    );

    return (
      <div className="settings-documents-tab-v65">
        <div className="settings-section-v64">
          <h3 className="settings-section-title-v64">Platform Policies</h3>
          <div className="docs-list-v65">
            {policies.map(doc => <DocRow key={doc.id} {...doc} />)}
          </div>
        </div>

        <div className="settings-section-v64" style={{ marginTop: '32px' }}>
          <h3 className="settings-section-title-v64">Vendor Agreement</h3>
          <div className="docs-list-v65">
            {agreements.map(doc => <DocRow key={doc.id} {...doc} />)}
          </div>
        </div>
      </div>
    );
  };

  const renderSecuritySettings = (setIsChangingPassword: (v: boolean) => void, setSecurityConfirmModal: (type: 'logout-all' | 'remove-device' | null) => void) => {
    const sessions = [
      { id: 1, device: 'MacBook Pro 16"', browser: 'Chrome', status: 'Current Session', location: 'Mumbai, India', type: 'laptop' },
      { id: 2, device: 'iPhone 13 Pro', browser: 'Safari', status: 'Yesterday at 10:45 AM', location: 'Mumbai, India', type: 'mobile' },
      { id: 3, device: 'Windows PC', browser: 'Edge', status: 'Oct 24, 2023 at 4:30 PM', location: 'Delhi, India', type: 'laptop' }
    ];

    return (
      <div className="settings-security-tab-v66">
        {/* Change Password Section */}
        <div className="settings-section-v64">
          <h3 className="settings-section-title-v64">Login Credentials</h3>
          <div className="security-card-v66">
            <div className="security-info-v66">
              <div className="security-text-v66">
                <h4>Password</h4>
                <p>Last changed 3 months ago</p>
              </div>
            </div>
            <button className="security-action-btn-v66" onClick={() => setIsChangingPassword(true)}>Change Password</button>
          </div>
        </div>

        {/* Login Activity Section */}
        <div className="settings-section-v64" style={{ marginTop: '24px' }}>
          <div className="security-section-title-row-v66">
            <h3 className="settings-section-title-v64">Login Activity</h3>
            <button className="logout-all-btn-v66" onClick={() => setSecurityConfirmModal('logout-all')}>Logout all devices</button>
          </div>
          <div className="sessions-list-v66">
            {sessions.map(session => (
              <div key={session.id} className="session-item-v66">
                <div className="session-main-v66">
                  <div className="device-icon-v66">
                    {session.type === 'laptop' ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0077ff" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="2" y1="20" x2="22" y2="20"></line></svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0077ff" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
                    )}
                  </div>
                  <div className="session-info-v66">
                    <div className="device-name-v66">
                      {session.device} • {session.browser}
                    </div>
                    <div className="session-meta-v66">
                      <span className={`status-v66 ${session.status === 'Current Session' ? 'active' : ''}`}>
                        {session.status}
                      </span>
                      {session.location && (
                        <>
                          <span className="dot-v66">•</span>
                          <span className="location-v66">{session.location}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {session.status !== 'Current Session' && (
                  <button className="revoke-btn-v66" onClick={() => setSecurityConfirmModal('remove-device')}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderSubscriptionSettings = () => {
    const billingHistory = [
      { id: 'INV-102', date: '15 Jan 2026', amount: '₹2,994', plan: '6 Months Plan', validity: '15 Jan 2026 – 14 Jul 2026', method: 'UPI ••••9823' },
      { id: 'INV-091', date: '15 Jul 2025', amount: '₹2,994', plan: '6 Months Plan', validity: '15 Jul 2025 – 14 Jan 2026', method: 'UPI ••••9823' },
      { id: 'INV-084', date: '15 Jan 2025', amount: '₹2,994', plan: '6 Months Plan', validity: '15 Jan 2025 – 14 Jul 2025', method: 'UPI ••••9823' },
      { id: 'INV-077', date: '15 Jul 2024', amount: '₹2,994', plan: '6 Months Plan', validity: '15 Jul 2024 – 14 Jan 2025', method: 'UPI ••••9823' },
      { id: 'INV-065', date: '15 Jan 2024', amount: '₹2,994', plan: '6 Months Plan', validity: '15 Jan 2024 – 14 Jul 2024', method: 'UPI ••••9823' }
    ];

    return (
      <div className="subscription-tab-v70">
        <div className="plan-section-v70">
          <div className="subscription-header-row-v70">
            <h3 className="settings-section-title-v64">myMembership Plan</h3>
            <button
              className="manage-subscription-btn-v70"
              onClick={() => setIsManageModalOpen(true)}
            >
              Manage myMembership
            </button>
          </div>
          <div className="plan-card-v70">
            <div className="plan-sparkles-v70">
              <svg className="sparkle-v70-1" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" opacity="0.4"><path d="M12 1L14.39 8.26L22 9.27L16.5 14.14L18.18 21.02L12 17.77L5.82 21.02L7.5 14.14L2 9.27L9.61 8.26L12 1Z"></path></svg>
              <svg className="sparkle-v70-2" width="10" height="10" viewBox="0 0 24 24" fill="currentColor" opacity="0.3"><path d="M12 1L14.39 8.26L22 9.27L16.5 14.14L18.18 21.02L12 17.77L5.82 21.02L7.5 14.14L2 9.27L9.61 8.26L12 1Z"></path></svg>
            </div>
            <div className="plan-header-v70">
              <span className="plan-label-v70">CURRENT ACTIVE PLAN</span>
              <span className="plan-badge-v70">ACTIVE</span>
            </div>

            <div className="plan-main-v70">
              <div className="plan-title-wrapper-v70">
                <h2 className="plan-name-v70">Growth Plan</h2>
                <span className="save-tag-v70">Saved ₹1,200/year</span>
              </div>
              <div className="plan-pricing-v70">
                <span className="price-v70">₹499 / month</span>
                <span className="duration-v70">• 6 Months plan</span>
              </div>
            </div>

            <div className="plan-footer-v70">
              <div className="next-billing-v70">
                <span className="billing-label-v70">Next billing date</span>
                <span className="billing-date-v70">April 01, 2026</span>
              </div>
            </div>

            <div className="upgrade-banner-v70">
              <div className="upgrade-info-v70">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"></path></svg>
                <span>Upgrade to 12 Months • <strong>Save ₹1,800/year</strong></span>
              </div>
              <button className="explore-plans-btn-v70" onClick={() => setIsPlanModalOpen(true)}>
                EXPLORE PLANS <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
            </div>
          </div>
        </div>

        <div className="billing-history-section-v70">
          <h3 className="settings-section-title-v64">Billing History</h3>
          <div className="billing-cards-list-v70">
            {billingHistory.map((invoice) => (
              <div key={invoice.id} className="billing-card-v70">
                <div className="card-top-row-v70">
                  <div className="card-id-group-v70">
                    <span className="card-date-v70">{invoice.date}</span>
                    <span className="card-id-v70">{invoice.id}</span>
                  </div>
                  <span className="card-amount-v70">{invoice.amount}</span>
                </div>

                <div className="card-middle-row-v70">
                  <div className="card-plan-info-v70">
                    <span className="card-plan-name-v70">{invoice.plan}</span>
                    <span className="card-validity-v70">{invoice.validity}</span>
                  </div>
                </div>

                <div className="card-bottom-row-v70">
                  <div className="card-payment-method-v70">
                    <span className="payment-label-v70">{invoice.method.split(' ')[0]}</span>
                    <span className="payment-digits-v70">{invoice.method.split(' ')[1]}</span>
                  </div>
                  <button className="download-invoice-btn-v70">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pagination-footer-v70">
            <span className="results-count-v70">Showing 5 of 12 records</span>
            <button className="load-more-btn-v70">Load More Records</button>
          </div>
        </div>

        <div className="razorpay-footer-v70">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          <span>Secure Payments by Razorpay</span>
        </div>
      </div>
    );
  };

  const renderDangerZone = () => (
    <div className="settings-danger-tab-v64">
      <div className="settings-section-v64">
        <h3 className="settings-section-title-v64" style={{ color: '#e11d48' }}>Danger Zone</h3>
        <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px' }}>
          Deleting your account is permanent and cannot be undone. Please proceed with caution.
        </p>
        <div className="settings-danger-zone-v64" style={{ marginTop: 0, paddingTop: 0, borderTop: 'none' }}>
          <button className="danger-link-v64">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>
            Deactivate Account
          </button>
        </div>
      </div>
    </div>
  );

  const renderPlanModal = () => {
    if (!isPlanModalOpen) return null;

    const plans = [
      {
        id: 'starter',
        name: 'Starter Plan',
        duration: '3 Months • Total ₹1,797',
        price: '₹599 /mo',
        annualBase: '₹7,188/year',
        type: 'blue',
        benefits: ['TDS Filing Support', 'Free Listing & Onboarding', 'Monthly Reports Access'],
        isCurrent: false
      },
      {
        id: 'growth',
        name: 'Growth Plan',
        duration: '6 Months • Total ₹2,994',
        price: '₹499 /mo',
        annualBase: '₹7,188/year',
        savings: 'Save ₹1,200/year',
        type: 'purple',
        badge: 'Most Popular',
        benefits: ['TDS Filing Support', 'Faster Payout Tracking', 'Priority Vendor Support'],
        isCurrent: true
      },
      {
        id: 'saving',
        name: 'Saving Plan',
        duration: '12 Months • Total ₹5,388',
        price: '₹449 /mo',
        annualBase: '₹7,188/year',
        savings: 'Save ₹1,800/year',
        type: 'gold',
        badge: 'Best Value',
        benefits: ['Full TDS Tracking', 'Priority Payout Support', 'Long-Term Savings Benefits'],
        isCurrent: false
      }
    ];

    return (
      <div className="plan-modal-overlay-v71">
        <div className="plan-modal-container-v71 mobile-scroller-v50">
          <div className="plan-modal-header-v71">
            <h3>Choose myMembership Plan</h3>
            <button className="plan-modal-close-v71" onClick={() => setIsPlanModalOpen(false)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          <div className="plan-modal-body-v71">
            <div className="plan-grid-list-v71">
              {plans.map((plan) => (
                <div key={plan.id} className={`plan-grid-card-v71 theme-${plan.type}-v71`}>
                  {plan.badge && <span className="plan-modal-badge-v71">{plan.badge}</span>}

                  <div className="plan-grid-sparkles-v71">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" opacity="0.4"><path d="M12 1L14.39 8.26L22 9.27L16.5 14.14L18.18 21.02L12 17.77L5.82 21.02L7.5 14.14L2 9.27L9.61 8.26L12 1Z"></path></svg>
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor" opacity="0.3"><path d="M12 1L14.39 8.26L22 9.27L16.5 14.14L18.18 21.02L12 17.77L5.82 21.02L7.5 14.14L2 9.27L9.61 8.26L12 1Z"></path></svg>
                  </div>

                  <div className="plan-grid-top-v71">
                    <h4>{plan.name}</h4>
                    <span className="plan-grid-duration-v71">{plan.duration}</span>
                  </div>

                  <div className="plan-grid-main-v71">
                    <div className="plan-grid-price-row-v71">
                      <span className="plan-grid-amount-v71">{plan.price.split(' ')[0]}</span>
                      <span className="plan-grid-mo-v71">/mo</span>
                    </div>
                    <div className="plan-grid-savings-row-v71">
                      <span className="plan-grid-base-v71">{plan.annualBase}</span>
                      {plan.savings && <span className="plan-grid-save-tag-v71">{plan.savings}</span>}
                    </div>
                  </div>

                  <button
                    className={`plan-switch-btn-v71 ${plan.isCurrent ? 'current-plan-v71' : ''}`}
                    disabled={plan.isCurrent}
                  >
                    {plan.isCurrent ? 'Current Active Plan' : 'Switch Plan'}
                  </button>

                  <div className="plan-benefits-v71">
                    <span className="benefits-label-v71">BENEFITS</span>
                    <ul className="benefits-list-v71">
                      {plan.benefits.map((benefit, idx) => (
                        <li key={idx}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mobile-settings-view-v64 mobile-scroller-v50">
      {activeSubTab === 'myMembership' && !isBannerDismissed && (
        <MembershipStatusBanner
          status={membershipStatus}
          isDashboard={true}
          onAction={() => setIsManageModalOpen(true)}
          onDismiss={() => setIsBannerDismissed(true)}
        />
      )}
      {renderPlanModal()}
      <div className="settings-header-v64">
        <h2>Settings</h2>
        <p>Manage your account preferences, myMembership, and security.</p>
      </div>

      <div className="profile-tabs-nav-v60 settings-tabs-v64 border-bottom-v64">
        {subTabs.map(tab => (
          <button
            key={tab}
            className={`profile-tab-btn-v60 ${activeSubTab === tab ? 'active' : ''}`}
            onClick={() => setActiveSubTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="settings-content-area-v64">
        {activeSubTab === 'Account' && renderAccountSettings()}
        {activeSubTab === 'Documents' && renderDocumentsSettings()}
        {activeSubTab === 'Security' && renderSecuritySettings(setIsChangingPassword, setSecurityConfirmModal)}
        {activeSubTab === 'myMembership' && renderSubscriptionSettings()}
        <ManageMembershipModal
          isOpen={isManageModalOpen}
          onClose={() => setIsManageModalOpen(false)}
          status={membershipStatus}
          setStatus={setMembershipStatus}
          onUpgrade={() => {
            setIsManageModalOpen(false);
            setIsPlanModalOpen(true);
          }}
        />
        {activeSubTab === 'Danger' && renderDangerZone()}
        {activeSubTab !== 'Account' && activeSubTab !== 'Documents' && activeSubTab !== 'Security' && activeSubTab !== 'myMembership' && activeSubTab !== 'Danger' && (
          <div className="settings-placeholder-v64">
            <div className="placeholder-icon-v64">⚙️</div>
            <h4>{activeSubTab} coming soon</h4>
            <p>We're polishing this section for you.</p>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─────────────────── MOBILE GST FILING VIEW (v52) ─────────────────── */

const MobileSectionEditor = ({
  onClose,
  currentSection,
  setCurrentSection,
  handleSaveSection
}: {
  onClose: () => void;
  currentSection: Section;
  setCurrentSection: React.Dispatch<React.SetStateAction<Section>>;
  handleSaveSection: () => void;
}) => {
  const addItem = () => {
    setCurrentSection((prev: Section) => ({
      ...prev,
      items: [...prev.items, { name: '', description: '', image: null }]
    }));
  };

  const removeItem = (index: number) => {
    setCurrentSection((prev: Section) => ({
      ...prev,
      items: (prev.items as any[]).filter((_: any, i: number) => i !== index)
    }));
  };

  const updateItem = (index: number, field: string, value: any) => {
    setCurrentSection((prev: Section) => {
      const newItems = [...(prev.items as any[])];
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
    <div className="mobile-bottom-sheet-overlay-v55" onClick={onClose}>
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
              onChange={(e) => setCurrentSection((prev: Section) => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div className="selection-row-v55">
            <div className="selection-type-col-v55">
              <label className="mobile-form-label-big-v55">Selection Type</label>
              <select
                className="mobile-select-v55"
                value={currentSection.type}
                onChange={(e) => setCurrentSection((prev: Section) => ({ ...prev, type: e.target.value }))}
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
                onChange={(e) => setCurrentSection((prev: Section) => ({ ...prev, limit: parseInt(e.target.value) || 0 }))}
              />
            </div>
          </div>

          <div style={{ borderTop: '1px solid #f1f5f9', margin: '24px 0' }}></div>

          <h3 className="mobile-form-label-big-v55">Items in this Section</h3>

          <div className="mobile-items-list-v55">
            {(currentSection.items as any[]).map((item: any, i: number) => (
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
            <button className="btn-cancel-v55" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
            <button
              className="btn-save-v55"
              style={{ flex: 2 }}
              disabled={!currentSection.name || (currentSection.items as any[]).some((it: any) => !it.name)}
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

const MobileSortableSectionItem = ({ sec, idx, onEdit, onDelete }: any) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: idx.toString() });

  const style = {
    transform: transform ? CSS.Translate.toString(transform) : undefined,
    transition: transform ? transition : 'transform 200ms cubic-bezier(0.2, 0, 0, 1)',
    zIndex: isDragging ? 2000 : 1,
    opacity: isDragging ? 0.9 : 1,
    scale: isDragging ? '1.02' : '1',
    boxShadow: isDragging ? '0 10px 15px -3px rgb(0 0 0 / 0.1)' : 'none',
    position: 'relative' as const,
  };

  return (
    <div ref={setNodeRef} style={style} className={`mobile-section-card-v55 ${isDragging ? 'dragging' : ''}`}>
      <div className="mobile-sec-content-v55" style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
        <div className="mobile-drag-handle-v55" {...attributes} {...listeners}>
          <GripVertical size={20} />
        </div>
        <div className="sec-info-v55">
          <h4>{sec.name}</h4>
          <p>{sec.items.length} Items • {sec.type === 'All Included' ? 'All Chosen' : `Choose ${sec.limit}`}</p>
        </div>
      </div>
      <div className="sec-actions-v55">
        <button className="mobile-action-btn-v50" onClick={onEdit}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0077ff" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
        </button>
        <button className="mobile-action-btn-v50" onClick={onDelete}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
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
  sectionEditingIndex: _sectionEditingIndex,
  setSectionEditingIndex,
  resetAddMenu,
  handleImageUpload,
  handleSaveSection,
  menuEditingId,
  menus: _menus,
  setMenus
}: {
  menuStep: number;
  setMenuStep: React.Dispatch<React.SetStateAction<number>>;
  menuIdentity: MenuIdentity;
  setMenuIdentity: React.Dispatch<React.SetStateAction<MenuIdentity>>;
  sections: Section[];
  setSections: React.Dispatch<React.SetStateAction<Section[]>>;
  isAddingSection: boolean;
  setIsAddingSection: (val: boolean) => void;
  currentSection: Section;
  setCurrentSection: React.Dispatch<React.SetStateAction<Section>>;
  sectionEditingIndex: number | null;
  setSectionEditingIndex: (val: number | null) => void;
  resetAddMenu: () => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSaveSection: () => void;
  menuEditingId: number | null;
  menus: Menu[];
  setMenus: React.Dispatch<React.SetStateAction<Menu[]>>;
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSections((items: Section[]) => {
        const oldIndex = parseInt(active.id.toString());
        const newIndex = parseInt(over.id.toString());
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const totalItems = sections.reduce((acc: number, sec: Section) => acc + (sec.items?.length || 0), 0);
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
      setMenus((prev: Menu[]) => prev.map((m: Menu) => m.id === menuEditingId ? {
        ...m,
        name: menuIdentity.name,
        price: menuIdentity.price,
        minMembers: menuIdentity.minMembers,
        maxMembers: menuIdentity.maxMembers,
        dietType: menuIdentity.dietType,
        image: menuIdentity.image,
        sections: [...sections]
      } : m));
    } else {
      const newMenuObj: Menu = {
        id: Date.now(),
        name: menuIdentity.name,
        price: menuIdentity.price,
        status: 'Active',
        category: 'breakfast',
        minMembers: menuIdentity.minMembers,
        maxMembers: menuIdentity.maxMembers,
        dietType: menuIdentity.dietType,
        image: menuIdentity.image,
        sections: [...sections]
      };
      setMenus((prev: Menu[]) => [...prev, newMenuObj]);
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
                onChange={(e) => setMenuIdentity((prev: MenuIdentity) => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className="mobile-form-group-v55">
              <label className="mobile-label-v55">Diet Preference</label>
              <div className="mobile-radio-group-v55">
                {['Veg', 'Non-Veg'].map(type => (
                  <button
                    key={type}
                    className={`mobile-radio-btn-v55 ${type === 'Veg' ? 'veg' : 'nonveg'} ${menuIdentity.dietType === type ? 'active' : ''}`}
                    onClick={() => setMenuIdentity((prev: MenuIdentity) => ({ ...prev, dietType: type }))}
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
                  onChange={(e) => setMenuIdentity((prev: MenuIdentity) => ({ ...prev, price: e.target.value }))}
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
                  onChange={(e) => setMenuIdentity((prev: MenuIdentity) => ({ ...prev, minMembers: e.target.value }))}
                />
              </div>
              <div className="mobile-form-group-v55" style={{ flex: 1 }}>
                <label className="mobile-label-v55">Max Pax</label>
                <input
                  type="number"
                  className="mobile-input-v55"
                  placeholder="500"
                  value={menuIdentity.maxMembers}
                  onChange={(e) => setMenuIdentity((prev: MenuIdentity) => ({ ...prev, maxMembers: e.target.value }))}
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
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={sections.map((_: any, i: number) => i.toString())}
                  strategy={verticalListSortingStrategy}
                >
                  {sections.map((sec: Section, idx: number) => (
                    <MobileSortableSectionItem
                      key={idx}
                      idx={idx}
                      sec={sec}
                      onEdit={() => {
                        setCurrentSection({ ...sec });
                        setSectionEditingIndex(idx);
                        setIsAddingSection(true);
                      }}
                      onDelete={() => setSections((prev: Section[]) => prev.filter((_: Section, i: number) => i !== idx))}
                    />
                  ))}
                </SortableContext>
              </DndContext>
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
                onClose={() => setIsAddingSection(false)}
                currentSection={currentSection}
                setCurrentSection={setCurrentSection}
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
              {sections.map((sec: Section, i: number) => (
                <div key={i} className="mobile-section-card-v55" style={{ display: 'block' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>{sec.name}</span>
                    <span style={{ fontSize: '0.75rem', background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', color: '#475569' }}>{sec.type}</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {(sec.items as any[]).map((it: any, j: number) => (
                      <span key={j} style={{ fontSize: '0.8rem', color: '#64748b' }}>{typeof it === 'string' ? it : it.name}{j < sec.items.length - 1 ? ' • ' : ''}</span>
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
            disabled={(menuStep === 1 && !menuIdentity.name) || (menuStep === 2 && (sections.length === 0 || isAddingSection))}
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
  setMenuIdentity,
  setSections,
  setMenuEditingId,
  setMenuStep
}: {
  setIsAddingMenu: (val: boolean) => void,
  menus: any[],
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

            <div className="service-notice-box-v54">
              <div className="notice-icon-v54">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
              </div>
              <div className="notice-text-v54">
                <strong>Note:</strong> Customers can book this service at least 4 days in advance, due to refund policy & Live status.
              </div>
            </div>

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
                <label>Booking Capacity</label>
                <input
                  type="number"
                  min="1"
                  value={manageBookingsCount}
                  onChange={(e) => setManageBookingsCount(Number(e.target.value))}
                  disabled={!isEditing}
                />
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
                {f === 'Veg' && <span className="dot-v54 veg"></span>}
                {f === 'Non-Veg' && <span className="dot-v54 nonveg"></span>}
                {f}
              </button>
            ))}
          </div>

          <div className="menu-item-stack-v54">
            {filteredMenus.map((item: any) => (
              <div key={item.id} className="menu-item-card-v54">
                {/* Header Image with Overlays */}
                <div className="item-image-header-v54">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="header-img-v54" />
                  ) : (
                    <div className="placeholder-img-v54">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="live-status-badge-v54">LIVE</div>

                  {/* Top Right Action Buttons */}
                  <div className="header-actions-v54">
                    <button className="header-action-btn-v54" onClick={() => {
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
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                    </button>
                    <button className="header-action-btn-v54 settings" onClick={() => {
                      // Placeholder for settings/extra options
                      console.log('Settings clicked for', item.id);
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                    </button>
                  </div>
                </div>

                {/* Content Section */}
                <div className="item-content-body-v54">
                  <h3 className="item-title-v54-new">{item.name}</h3>
                  <div className="item-meta-row-v54">
                    <div className="guest-capacity-v54">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                      <span>min {item.minMembers || '20'} - max {item.maxMembers || '100'}</span>
                    </div>
                    <span className={`diet-badge-v54 ${item.dietType?.toLowerCase() || 'veg'}`}>
                      <span className="dot">▣</span>
                      {item.dietType || 'Veg'}
                    </span>
                  </div>

                  <div className="item-divider-v54"></div>

                  {/* Price Box */}
                  <div className="item-price-card-v54">
                    <label>Starting</label>
                    <div className="price-value-v54">
                      ₹{item.price} <span>/ Person</span>
                    </div>
                  </div>
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

const MobileDashboard = (props: MobileDashboardProps) => {
  const {
    activeTab,
    setActiveTab,
    profileData,
    navigationGroups,
    onLogout,
    membershipStatus,
    setMembershipStatus,
    isBannerDismissed,
    setIsBannerDismissed,
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
    setMenus,
    // Boost Credits Props
    boostCredits,
    setBoostCredits,
    isBoostSheetOpen,
    setIsBoostSheetOpen,
    showBoostToast,
    setShowBoostToast,
    isCalendarView,
    setIsCalendarView,
    isUsageDetailsView,
    setIsUsageDetailsView,
    selectedBoostDates,
    setSelectedBoostDates,
    mockBookingData,
    usageHistory
  } = props;

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [isAddingCoupon, setIsAddingCoupon] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddingBank, setIsAddingBank] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [securityConfirmModal, setSecurityConfirmModal] = useState<'logout-all' | 'remove-device' | null>(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [coupons, setCoupons] = useState<Coupon[]>([
    { id: '1', code: 'WELCOME10', type: 'Percentage', value: '10%', status: 'Active', usage: '45/100', validFrom: '2026-03-01', validTo: '2026-03-31', maxCap: '500', minAmount: '1000', source: 'vendor', applicability: 'orders', scope: 'all', perUserLimit: '1' },
    { id: '2', code: 'FLAT500', type: 'Flat Amount', value: '₹500', status: 'Paused', usage: '12/50', validFrom: '2026-03-20', validTo: '2026-04-15', minAmount: '2000', source: 'vendor', applicability: 'orders', maxCap: '0', scope: 'all', perUserLimit: '1' },
    { id: '3', code: 'PLATFORM25', type: 'Percentage', value: '25%', status: 'Active', usage: '1050/5000', validFrom: '2026-01-01', validTo: '2026-12-31', maxCap: '1000', minAmount: '2000', source: 'platform', applicability: 'subscription', scope: 'all', perUserLimit: '1' },
    { id: '4', code: 'HOLIDAY15', type: 'Percentage', value: '15%', status: 'Active', usage: '800/2000', validFrom: '2026-03-15', validTo: '2026-04-30', maxCap: '750', minAmount: '1500', source: 'platform', applicability: 'orders', scope: 'all', perUserLimit: '1' },
  ]);

  // Close drawer on tab change
  useEffect(() => {
    setIsDrawerOpen(false);
  }, [activeTab]);

  const renderBannerOnHome = () => {
    if (activeTab === 'dashboard' && !isBannerDismissed && (membershipStatus === 'paused' || membershipStatus === 'cancelled_active')) {
      return (
        <div style={{ padding: '0 16px 12px 16px' }}>
          <MembershipStatusBanner
            status={membershipStatus}
            isDashboard={true}
            onAction={() => {
              setActiveTab('settings');
              setIsManageModalOpen(true);
            }}
            onDismiss={() => setIsBannerDismissed(true)}
          />
        </div>
      );
    }
    return null;
  };

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
          {/* Boost Credits Chip */}
          <button 
            className="mobile-boost-pill-v25" 
            onClick={() => setIsBoostSheetOpen(true)}
          >
            <span className="boost-icon">📈</span>
            <span className="boost-text">{boostCredits > 0 ? `${boostCredits}` : ''}</span>
          </button>

          <button className="mobile-action-btn-v50">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
          </button>
          <div className="mobile-avatar-circle-v50">
            {profileData?.owner?.name?.charAt(0) || 'B'}
          </div>
        </div>
      </div>

      {renderBannerOnHome()}

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
        <MobileCouponsView
          coupons={coupons}
          setCoupons={setCoupons}
          setEditingCoupon={(coupon: Coupon) => {
            setEditingCoupon(coupon);
            setIsAddingCoupon(true);
          }}
          setIsAddingCoupon={setIsAddingCoupon}
        />
      ) : activeTab === 'tickets' ? (
        <MobileSupportView />
      ) : activeTab === 'service-settings' ? (
        <MobileServiceSettingsView
          setIsAddingMenu={setIsAddingMenu}
          menus={menus}
          setMenuIdentity={setMenuIdentity}
          setSections={setSections}
          setMenuEditingId={setMenuEditingId}
          setMenuStep={setMenuStep}
        />
      ) : activeTab === 'settings' ? (
        <MobileSettingsView
          profileData={profileData}
          setIsChangingPassword={setIsChangingPassword}
          setSecurityConfirmModal={setSecurityConfirmModal}
          membershipStatus={membershipStatus}
          setMembershipStatus={setMembershipStatus}
          isBannerDismissed={isBannerDismissed}
          setIsBannerDismissed={setIsBannerDismissed}
          isManageModalOpen={isManageModalOpen}
          setIsManageModalOpen={setIsManageModalOpen}
        />
      ) : activeTab === 'profile' ? (
        <MobileProfileView
          profileData={profileData}
          onEdit={() => setIsEditingProfile(true)}
          onAddBank={() => setIsAddingBank(true)}
          onDeleteBank={(id) => {
            if (window.confirm('Are you sure you want to delete this bank account?')) {
              console.log('Deleting bank:', id);
            }
          }}
          onSetPrimary={(id) => {
            console.log('Setting primary bank:', id);
            alert('Primary bank account updated!');
          }}
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

      {/* Full Screen Coupon Form Overlay */}
      {isAddingCoupon && (
        <MobileCouponFormView
          initialData={editingCoupon}
          onClose={() => {
            setIsAddingCoupon(false);
            setEditingCoupon(null);
          }}
          onSave={(newCoupon: Coupon) => {
            const exists = coupons.find(c => c.id === newCoupon.id);
            if (exists) {
              setCoupons((prev: Coupon[]) => prev.map((c: Coupon) => c.id === newCoupon.id ? newCoupon : c));
            } else {
              setCoupons((prev: Coupon[]) => [newCoupon, ...prev]);
            }
            setIsAddingCoupon(false);
            setEditingCoupon(null);
          }}
        />
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
                    {group.items.map((item: NavigationItem) => (
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
      {/* Full Screen Edit Profile Overlay */}
      {isEditingProfile && (
        <MobileEditProfileView
          onClose={() => setIsEditingProfile(false)}
          handleImageUpload={handleImageUpload}
        />
      )}

      {/* Full Screen Add Bank Overlay */}
      {isAddingBank && (
        <MobileAddBankView
          onClose={() => setIsAddingBank(false)}
          handleImageUpload={handleImageUpload}
        />
      )}

      {/* Change Password Overlay */}
      {isChangingPassword && (
        <MobileChangePasswordView onClose={() => setIsChangingPassword(false)} />
      )}

      {/* Security Confirmation Modals */}
      {securityConfirmModal && (
        <MobileSecurityConfirmModal
          type={securityConfirmModal}
          onClose={() => setSecurityConfirmModal(null)}
          onConfirm={() => console.log('Confirmed:', securityConfirmModal)}
        />
      )}

      {/* Boost Bottom Sheet */}
      {isBoostSheetOpen && (
        <div className="mobile-boost-sheet-overlay-v25" onClick={() => {
          setIsBoostSheetOpen(false);
          setIsCalendarView(false);
          setSelectedBoostDates([]);
        }}>
          <div className="mobile-boost-bottom-sheet-v25" onClick={e => e.stopPropagation()}>
            <div className="mobile-boost-sheet-header-v25 redesign single-row">
              <button 
                className={`mobile-boost-back-btn-pill-v25 icon-only ${(!isCalendarView && !isUsageDetailsView) ? 'hidden' : ''}`}
                onClick={() => {
                  if (isCalendarView) {
                    setIsCalendarView(false);
                  } else {
                    setIsUsageDetailsView(false);
                  }
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
              </button>
              
              <h2 className="mobile-boost-sheet-title">
                {isCalendarView ? 'Select Dates' : (isUsageDetailsView ? 'Usage Overview' : 'Boost Your Profile')}
              </h2>

              <button className="mobile-boost-sheet-close-v25" onClick={() => {
                setIsBoostSheetOpen(false);
                setIsCalendarView(false);
                setIsUsageDetailsView(false);
                setSelectedBoostDates([]);
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <div className="mobile-boost-sheet-content-v25">
              {isCalendarView ? (
                <div className="mobile-calendar-view-container-v25">
                  <div className="mobile-calendar-month-header-v25">
                    <h3>April 2026</h3>
                  </div>
                  
                  <div className="mobile-calendar-grid-v25">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                      <div key={idx} className="mobile-calendar-weekday-v25">{day}</div>
                    ))}
                    {[null, null, null].map((_, i) => <div key={`empty-${i}`} className="mobile-calendar-day-empty-v25"></div>)}
                    
                    {Array.from({ length: 30 }, (_, i) => {
                      const day = i + 1;
                      const dateStr = `2026-04-${day < 10 ? '0' + day : day}`;
                      const status = mockBookingData[dateStr] || 'available';
                      const isSelected = selectedBoostDates.includes(dateStr);
                      const isFull = status === 'full';
                      const isPast = day < 17; // Today is April 17, 2026
                      
                      return (
                        <div 
                          key={day} 
                          className={`mobile-calendar-day-v25 state-${status} ${isSelected ? 'selected' : ''} ${isFull || isPast ? 'disabled' : ''}`}
                          onClick={() => {
                            if (isFull || isPast) return;
                            if (isSelected) {
                              setSelectedBoostDates((prev: string[]) => prev.filter(d => d !== dateStr));
                            } else if (selectedBoostDates.length < boostCredits) {
                              setSelectedBoostDates((prev: string[]) => [...prev, dateStr]);
                            }
                          }}
                        >
                          <span className="day-number">{day}</span>
                          {status === 'recommended' && <span className="mobile-recommended-dot"></span>}
                        </div>
                      );
                    })}
                  </div>

                  <div className="mobile-calendar-legend-v25">
                    <div className="mobile-legend-item"><span className="mobile-swatch state-available"></span> Available</div>
                    <div className="mobile-legend-item"><span className="mobile-swatch state-full"></span> Full</div>
                    <div className="mobile-legend-item"><span className="mobile-swatch state-partial"></span> Partial</div>
                    <div className="mobile-legend-item"><span className="mobile-swatch state-recommended"></span> Recommended</div>
                  </div>

                  <div className="mobile-selection-stats-v25">
                    <p className="mobile-stats-count-v25">{selectedBoostDates.length} days selected</p>
                    <p className="mobile-stats-credits-v25">Credits left: {boostCredits - selectedBoostDates.length}</p>
                  </div>

                  <div className="mobile-boost-sheet-actions">
                    <button 
                      className={`mobile-boost-now-btn-v25 ${selectedBoostDates.length === 0 ? 'disabled' : ''}`}
                      onClick={() => {
                        if (selectedBoostDates.length > 0) {
                          setBoostCredits((prev: number) => prev - selectedBoostDates.length);
                          setIsBoostSheetOpen(false);
                          setIsCalendarView(false);
                          setIsUsageDetailsView(false);
                          setSelectedBoostDates([]);
                          setShowBoostToast(true);
                          setTimeout(() => setShowBoostToast(false), 3000);
                        }
                      }}
                      disabled={selectedBoostDates.length === 0}
                    >
                      Confirm Boost
                    </button>
                    <button className="mobile-boost-view-details-btn-v25" onClick={() => setIsCalendarView(false)}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : isUsageDetailsView ? (
                <div className="mobile-usage-details-container-v25">
                  <div className="mobile-usage-summary-card-v25">
                    <div className="mobile-usage-grid-v25">
                      <div className="mobile-stat-item">
                        <label>Credits Left</label>
                        <span>{boostCredits}</span>
                      </div>
                      <div className="mobile-stat-item">
                        <label>Used</label>
                        <span>{10 - boostCredits}</span>
                      </div>
                    </div>
                    <div className="mobile-usage-progress-container-v25">
                      <div className="mobile-usage-progress-bar-v25" style={{ width: `${(boostCredits / 10) * 100}%` }}></div>
                    </div>
                    <p className="mobile-usage-expiry-v25">Valid till 15 May 2026</p>
                  </div>

                  <div className="mobile-active-boost-card-v25">
                    <div className="mobile-active-header-v25">
                      <h3>Active Boost</h3>
                      <span className="mobile-active-badge">Featured</span>
                    </div>
                    <p className="mobile-active-timer-v25">Expires in 18 hours</p>
                  </div>

                  <div className="mobile-usage-history-list-v25">
                    <h3 className="mobile-usage-subtitle-v25">Usage History</h3>
                    {usageHistory.map((item, idx) => (
                      <div key={idx} className="mobile-history-item-v25">
                        <div className="mobile-history-main-v25">
                          <span className="mobile-history-date-v25">{item.date}</span>
                          <span className="mobile-history-status-v25">{item.status}</span>
                        </div>
                        <div className="mobile-history-stats-v25">
                          <span>{item.views} views</span>
                          <span className="bullet">•</span>
                          <span>{item.bookings} bookings</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mobile-boost-sheet-actions">
                    <button 
                      className={`mobile-boost-now-btn-v25 ${boostCredits === 0 ? 'disabled' : ''}`}
                      onClick={() => {
                        setIsCalendarView(true);
                      }}
                      disabled={boostCredits === 0}
                    >
                      Boost Again
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mobile-boost-summary-redesign-v25">
                  {/* Hero Credits Card */}
                  <div className="mobile-boost-credits-hero-v25">
                    <div className="mobile-hero-credits-main">
                      <span className="mobile-hero-credits-count">{boostCredits}</span>
                      <span className="mobile-hero-credits-label">Credits Available</span>
                    </div>
                    <div className="mobile-hero-credits-footer">
                      <div className="mobile-hero-status-item">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                        <span>1 credit = 24h</span>
                      </div>
                      <div className="mobile-hero-status-item">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        <span>Exp. 30 days</span>
                      </div>
                    </div>
                  </div>

                  {/* Simplified Benefits */}
                  <div className="mobile-boost-benefits-simple-v25">
                    <div className="mobile-simple-benefit-item">
                      <div className="benefit-dot"></div>
                      <span>Get featured at top</span>
                    </div>
                    <div className="mobile-simple-benefit-item">
                      <div className="benefit-dot"></div>
                      <span>Increase bookings</span>
                    </div>
                  </div>

                  {/* Smart Tip */}
                  <div className="mobile-boost-smart-tip-v25">
                    <div className="tip-icon">💡</div>
                    <p>Use on low booking days for better results</p>
                  </div>

                  {/* Actions */}
                  <div className="mobile-boost-sheet-actions vertical">
                    <button 
                      className={`mobile-boost-now-btn-v25 ${boostCredits === 0 ? 'disabled' : ''}`}
                      onClick={() => setIsCalendarView(true)}
                      disabled={boostCredits === 0}
                    >
                      Boost Now
                    </button>
                    <button className="mobile-boost-view-usage-link-v25" onClick={() => setIsUsageDetailsView(true)}>
                      View Usage Details
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Boost Success Toast */}
      {showBoostToast && (
        <div className="mobile-boost-toast-v25">
          <span className="toast-icon">🚀</span>
          <span className="toast-msg">Your profile is now featured</span>
        </div>
      )}
    </div>
  );
};

export default MobileDashboard;
