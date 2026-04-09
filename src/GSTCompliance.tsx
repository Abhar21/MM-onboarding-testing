import { useState } from 'react';
import './GSTCompliance.css';

const GSTCompliance = () => {
  const [activeTab, setActiveTab] = useState<'regular' | 'composition' | 'non-gst'>('regular');
  const [selectedMonth, setSelectedMonth] = useState('March');
  const [selectedYear, setSelectedYear] = useState('2025-26');
  const [selectedQuarter, setSelectedQuarter] = useState('Q4');

  // Mock data for Regular GST
  const regularData = {
    taxableValue: {
      total: 825000,
      platform: 650000,
      offline: 175000
    },
    outputGST: 148500,
    itcAvailable: 12400,
    netPayable: 136100,
    breakdown: {
      cgst: 37125,
      sgst: 37125,
      igst: 74250
    },
    timeline: {
      start: 'March 01, 2026',
      end: 'March 31, 2026'
    },
    deadlines: [
      { name: 'GSTR-1 (Outward Supplies)', date: 'April 11, 2026', daysRemaining: 2, status: 'Due' },
      { name: 'GSTR-3B (Summary Return)', date: 'April 20, 2026', daysRemaining: 11, status: 'Upcoming' }
    ]
  };

  // Mock data for Composition GST
  const compositionData = {
    turnover: {
      total: 825000,
      platform: 450000,
      offline: 375000
    },
    taxRate: 6, // 6% composition rate
    estimatedTax: 49500,
    platformFeePaid: 5400,
    dueDate: 'April 18, 2026',
    daysRemaining: 9,
    monthlyBreakdown: [
      { month: 'January', turnover: 250000, platform: 120000, offline: 130000, tax: 15000, fee: 1800 },
      { month: 'February', turnover: 300000, platform: 150000, offline: 150000, tax: 18000, fee: 1800 },
      { month: 'March', turnover: 275000, platform: 180000, offline: 95000, tax: 16500, fee: 1800 }
    ]
  };

  // Mock data for Non-GST dashboard
  const nonGstData = {
    totalEarnings: 825000,
    platformEarnings: 450000,
    tdsDeducted: 450,
    netPaid: 449550,
    tdsRate: 0.1,
    panVerified: true,
    tdsActive: true,
    monthlyBreakdown: [
      { month: 'January', total: 250000, platform: 120000, offline: 130000, tds: 120, net: 119880, fee: 1800 },
      { month: 'February', total: 300000, platform: 150000, offline: 150000, tds: 150, net: 149850, fee: 1800 },
      { month: 'March', total: 275000, platform: 180000, offline: 95000, tds: 180, net: 179820, fee: 1800 }
    ]
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="gst-dashboard-container">
      {/* 0. TAB NAVIGATION */}
      <nav className="gst-tab-nav">
        <button
          className={`gst-tab-item ${activeTab === 'regular' ? 'active' : ''}`}
          onClick={() => setActiveTab('regular')}
        >
          GST Regular
        </button>
        <button
          className={`gst-tab-item ${activeTab === 'composition' ? 'active' : ''}`}
          onClick={() => setActiveTab('composition')}
        >
          GST Composition
        </button>
        <button
          className={`gst-tab-item ${activeTab === 'non-gst' ? 'active' : ''}`}
          onClick={() => setActiveTab('non-gst')}
        >
          Non-GST
        </button>
      </nav>

      {/* 1. HEADER SECTION */}
      <header className="gst-header">
        <div className="gst-title-area">
          <h1>GST Reporting & Compliance</h1>
          <p className="gst-subtitle">
            {activeTab === 'regular' && `Manage your GST filings for ${selectedMonth} ${selectedYear}`}
            {activeTab === 'composition' && `Quarterly tax summary and CMP-08 filing for ${selectedQuarter} 2025-26`}
            {activeTab === 'non-gst' && `Earnings and TDS summary for ${selectedMonth} FY ${selectedYear}`}
          </p>
        </div>

        <div className="gst-filters">
          <select className="gst-filter-select" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
            <option value="2025-26">FY {selectedYear}</option>
            <option value="2024-25">FY 2024-25</option>
          </select>

          {activeTab !== 'composition' && (
            <select className="gst-filter-select" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
              <option value="March">March</option>
              <option value="February">February</option>
              <option value="January">January</option>
            </select>
          )}

          {activeTab === 'composition' && (
            <select className="gst-filter-select" value={selectedQuarter} onChange={(e) => setSelectedQuarter(e.target.value)}>
              <option value="Q4">Q4 (Jan-Mar)</option>
              <option value="Q3">Q3 (Oct-Dec)</option>
              <option value="Q2">Q2 (Jul-Sep)</option>
              <option value="Q1">Q1 (Apr-Jun)</option>
            </select>
          )}
        </div>
      </header>

      {activeTab === 'regular' && (
        <>
          {/* 2. TOP SUMMARY CARDS */}
          <div className="gst-summary-grid">
            {/* Card 1: Total Taxable Value */}
            <div className="gst-summary-card">
              <div className="gst-card-header">
                <h3 className="gst-card-label">
                  Total Taxable Value
                  <span className="gst-info-tooltip" data-tooltip="Total amount on which GST is calculated">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                  </span>
                </h3>
              </div>
              <div className="gst-card-value">{formatCurrency(regularData.taxableValue.total)}</div>
              <div className="gst-card-breakdown">
                <div className="gst-breakdown-item">
                  <span className="gst-breakdown-label">Platform Earnings</span>
                  <span className="gst-breakdown-val">{formatCurrency(regularData.taxableValue.platform)}</span>
                </div>
                <div className="gst-breakdown-item">
                  <span className="gst-breakdown-label">Offline Earnings</span>
                  <span className="gst-breakdown-val">{formatCurrency(regularData.taxableValue.offline)}</span>
                </div>
              </div>
              <div className="gst-data-tag gst-tag-verified">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Platform data verified
              </div>
              <div className="gst-data-tag gst-tag-review">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                Offline data self-reported
              </div>
            </div>

            {/* Card 2: Total Output GST */}
            <div className="gst-summary-card">
              <div className="gst-card-header">
                <h3 className="gst-card-label">
                  Total Output GST
                  <span className="gst-info-tooltip" data-tooltip="GST collected on your sales">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                  </span>
                </h3>
              </div>
              <div className="gst-card-value">{formatCurrency(regularData.outputGST)}</div>
              <div className="gst-card-breakdown">
                <div className="gst-breakdown-item">
                  <span className="gst-breakdown-label">Platform GST</span>
                  <span className="gst-breakdown-val">{formatCurrency(regularData.taxableValue.platform * 0.18)}</span>
                </div>
                <div className="gst-breakdown-item">
                  <span className="gst-breakdown-label">Offline GST</span>
                  <span className="gst-breakdown-val">{formatCurrency(regularData.taxableValue.offline * 0.18)}</span>
                </div>
              </div>
            </div>

            {/* Card 3: Input Tax Credit */}
            <div className="gst-summary-card">
              <div className="gst-card-header">
                <h3 className="gst-card-label">
                  Input Tax Credit (ITC)
                  <span className="gst-info-tooltip" data-tooltip="GST you can claim as credit from platform fees and eligible expenses">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                  </span>
                </h3>
              </div>
              <div className="gst-card-value">{formatCurrency(regularData.itcAvailable)}</div>
              <p className="gst-card-subtitle">Includes GST paid on platform fees and eligible expenses</p>
            </div>

            {/* Card 4: Net GST Payable */}
            <div className="gst-summary-card primary-highlight">
              <div className="gst-card-header">
                <h3 className="gst-card-label">
                  Net GST Payable
                  <span className="gst-info-tooltip" data-tooltip="Final GST amount to be paid after ITC adjustments">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                  </span>
                </h3>
              </div>
              <div className="gst-card-value">{formatCurrency(regularData.netPayable)}</div>
              <div className="gst-card-subtitle">After ITC adjustment</div>
              <div className="gst-card-due-tag">Due by {regularData.deadlines[1].date}</div>
            </div>
          </div>

          <div className="gst-status-bar">
            <div className="gst-status-item important">
              <svg className="gst-icon-check" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              Platform transactions are verified
            </div>
            <div className="gst-status-item">
              <svg className="gst-icon-warning" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              Offline earnings are self-reported and should be reviewed
            </div>
          </div>

          <div className="gst-content-grid">
            <div className="gst-left-col">
              <section className="gst-section-card">
                <h2 className="gst-section-title">
                  GST Breakdown for {selectedMonth}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
                </h2>
                <div className="gst-breakdown-list">
                  <div className="gst-breakdown-row">
                    <div className="gst-row-label-group">
                      <span className="gst-row-label">CGST (intra-state)</span>
                      <span className="gst-row-desc">Central Goods and Services Tax</span>
                    </div>
                    <span className="gst-row-value">{formatCurrency(regularData.breakdown.cgst)}</span>
                  </div>
                  <div className="gst-breakdown-row">
                    <div className="gst-row-label-group">
                      <span className="gst-row-label">SGST (intra-state)</span>
                      <span className="gst-row-desc">State Goods and Services Tax</span>
                    </div>
                    <span className="gst-row-value">{formatCurrency(regularData.breakdown.sgst)}</span>
                  </div>
                  <div className="gst-breakdown-row">
                    <div className="gst-row-label-group">
                      <span className="gst-row-label">IGST (inter-state)</span>
                      <span className="gst-row-desc">Integrated Goods and Services Tax</span>
                    </div>
                    <span className="gst-row-value">{formatCurrency(regularData.breakdown.igst)}</span>
                  </div>
                  <div className="gst-divider"></div>
                  <div className="gst-breakdown-row">
                    <span className="gst-row-label">GST Collected</span>
                    <span className="gst-row-value">{formatCurrency(regularData.outputGST)}</span>
                  </div>
                  <div className="gst-breakdown-row">
                    <span className="gst-row-label">ITC Available</span>
                    <span className="gst-row-value" style={{ color: 'var(--gst-critical)' }}>-{formatCurrency(regularData.itcAvailable)}</span>
                  </div>
                  <div className="gst-total-payable-row">
                    <span className="gst-row-label">Final GST Payable</span>
                    <span className="gst-row-value">{formatCurrency(regularData.netPayable)}</span>
                  </div>
                </div>
                <div className="gst-timeline-info">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  This report includes transactions received between {regularData.timeline.start} and {regularData.timeline.end}
                </div>
              </section>

              <section className="gst-section-card" style={{ marginTop: '2rem' }}>
                <h3 className="gst-section-title">Compliance Documents</h3>
                <div className="gst-docs-container">
                  <div className="gst-doc-group">
                    <h4 className="gst-doc-group-title">Reports</h4>
                    <div className="gst-docs-list">
                      <button className="gst-doc-btn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        GSTR-1 Data
                      </button>
                      <button className="gst-doc-btn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        GSTR-3B Summary
                      </button>
                    </div>
                  </div>
                  <div className="gst-doc-group">
                    <h4 className="gst-doc-group-title">Invoices</h4>
                    <div className="gst-docs-list">
                      <button className="gst-doc-btn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        B2B Invoices
                      </button>
                    </div>
                  </div>
                  <div className="gst-doc-group">
                    <h4 className="gst-doc-group-title">Optional</h4>
                    <div className="gst-docs-list">
                      <button className="gst-doc-btn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        Full GST Summary
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div className="gst-right-col">
              <section className="gst-section-card" style={{ marginBottom: '2rem' }}>
                <h2 className="gst-section-title">Upcoming Filing Deadlines</h2>
                {regularData.deadlines.map((deadline, idx) => (
                  <div key={idx} className="gst-deadline-card">
                    <div className="gst-deadline-info">
                      <h4>{deadline.name}</h4>
                      <p>Due Date: {deadline.date}</p>
                    </div>
                    <div className="gst-deadline-status">
                      <span className={`gst-status-text ${deadline.status === 'Due' ? 'gst-status-due' : ''}`}>
                        Due in {deadline.daysRemaining} days
                      </span>
                    </div>
                  </div>
                ))}
                <div className="gst-deadline-check">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  No missed deadlines this month
                </div>
              </section>
            </div>
          </div>
        </>
      )}

      {activeTab === 'composition' && (
        <div className="gst-composition-view">
          {/* 3.2 TOP CARDS (COMPOSITION) */}
          <div className="gst-summary-grid gst-grid-3">
            <div className="gst-summary-card">
              <div className="gst-card-header">
                <h3 className="gst-card-label">Total Turnover (Quarter)</h3>
              </div>
              <div className="gst-card-value">{formatCurrency(compositionData.turnover.total)}</div>

              <div className="gst-card-breakdown">
                <div className="gst-breakdown-item">
                  <span className="gst-breakdown-label">Platform Earnings</span>
                  <span className="gst-breakdown-val">{formatCurrency(compositionData.turnover.platform)}</span>
                </div>
                <div className="gst-breakdown-item">
                  <span className="gst-breakdown-label">Offline Earnings</span>
                  <span className="gst-breakdown-val">{formatCurrency(compositionData.turnover.offline)}</span>
                </div>
              </div>
            </div>

            <div className="gst-summary-card">
              <div className="gst-card-header">
                <h3 className="gst-card-label">Estimated Tax Payable</h3>
              </div>
              <div className="gst-card-value" style={{ color: 'var(--gst-primary)' }}>{formatCurrency(compositionData.estimatedTax)}</div>
              <p className="gst-card-subtitle">@{compositionData.taxRate}% composition rate</p>
              <p className="gst-card-subtitle" style={{ fontSize: '0.75rem', marginTop: '8px', lineHeight: '1.4' }}>
                Composition tax is calculated based on your business type (1% / 5% / 6%)
              </p>
              <p className="gst-card-subtitle" style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--gst-primary)', marginTop: '4px' }}>
                We recommend verifying the correct rate with your Chartered Accountant (CA)
              </p>
            </div>

            <div className="gst-summary-card primary-highlight">
              <div className="gst-card-header">
                <h3 className="gst-card-label">CMP-08 Due Date</h3>
              </div>
              <div className="gst-card-value">{compositionData.dueDate}</div>
              <div className="gst-card-due-tag">Due in {compositionData.daysRemaining} days</div>
            </div>
          </div>

          <div className="gst-content-grid">
            <div className="gst-left-col">
              {/* 3.3 MONTHLY BREAKDOWN TABLE */}
              <section className="gst-section-card">
                <h2 className="gst-section-title">Monthly Breakdown (for reference)</h2>
                <span className="gst-table-note">Monthly breakdown is for reference. Tax is filed quarterly.</span>
                <span className="gst-table-note">Platform charges include commission + GST (GST is not claimable under composition scheme)</span>
                <div className="gst-composition-table-container">
                  <table className="gst-table">
                    <thead>
                      <tr>
                        <th>Month</th>
                        <th>Total Turnover</th>
                        <th>Estimated Tax</th>
                        <th>Platform Fee</th>
                      </tr>
                    </thead>
                    <tbody>
                      {compositionData.monthlyBreakdown.map((row, idx) => (
                        <tr key={idx}>
                          <td style={{ fontWeight: '600' }}>{row.month}</td>
                          <td>
                            {formatCurrency(row.turnover)}
                            <span className="gst-table-turnover-split">
                              {formatCurrency(row.platform)} platform + {formatCurrency(row.offline)} offline
                            </span>
                          </td>
                          <td>{formatCurrency(row.tax)}</td>
                          <td>{formatCurrency(row.fee)}</td>
                        </tr>
                      ))}
                      {/* Total Row */}
                      <tr className="gst-table-total-row">
                        <td>Total (Quarter)</td>
                        <td>
                          {formatCurrency(compositionData.monthlyBreakdown.reduce((acc, curr) => acc + curr.turnover, 0))}
                          <span className="gst-table-turnover-split">
                            {formatCurrency(compositionData.monthlyBreakdown.reduce((acc, curr) => acc + curr.platform, 0))} platform + {formatCurrency(compositionData.monthlyBreakdown.reduce((acc, curr) => acc + curr.offline, 0))} offline
                          </span>
                        </td>
                        <td>{formatCurrency(compositionData.monthlyBreakdown.reduce((acc, curr) => acc + curr.tax, 0))}</td>
                        <td>{formatCurrency(compositionData.monthlyBreakdown.reduce((acc, curr) => acc + curr.fee, 0))}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

            </div>

            <div className="gst-right-col">
              {/* 3.6 DOWNLOAD SECTION */}
              <section className="gst-section-card">
                <h3 className="gst-section-title">Reports & Documents</h3>
                <div className="gst-docs-container">
                  <button className="gst-doc-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Download CMP-08 Summary
                  </button>
                  <button className="gst-doc-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Download Turnover Summary (Quarter)
                  </button>
                  <button className="gst-doc-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Download Composition Tax Report
                  </button>
                  <button className="gst-doc-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Download Annual Summary (GSTR-4 Ready)
                  </button>
                </div>
              </section>
            </div>
          </div>

          {/* 3.7 DISCLAIMER (COMPOSITION) */}
          <footer className="gst-footer">
            <div className="gst-disclaimer">
              <p>• Tax is calculated on total turnover</p>
              <p>• Input Tax Credit (ITC) is not applicable under composition scheme</p>
              <p>• GST is not charged separately to customers</p>
            </div>
          </footer>
        </div>
      )}

      {activeTab === 'non-gst' && (
        <div className="gst-non-gst-view">
          {/* 1. TOP BANNER */}
          <div className="gst-info-banner">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            <div>
              <strong>You are not registered under GST.</strong>
              GST is not applicable
            </div>
          </div>

          {/* 2. TOP SUMMARY CARDS (NON-GST) */}
          <div className="gst-summary-grid two-cols">
            <div className="gst-summary-card">
              <div className="gst-card-header">
                <h3 className="gst-card-label">Total Earnings</h3>
              </div>
              <div className="gst-card-value">{formatCurrency(nonGstData.totalEarnings)}</div>
              <div className="gst-earnings-split-row">
                <div className="gst-earnings-split-item">
                  <span>Platform:</span>
                  <span>{formatCurrency(nonGstData.platformEarnings)}</span>
                </div>
                <div className="gst-earnings-split-item">
                  <span>Offline:</span>
                  <span>{formatCurrency(nonGstData.totalEarnings - nonGstData.platformEarnings)}</span>
                </div>
              </div>
            </div>

            <div className="gst-summary-card">
              <div className="gst-card-header">
                <h3 className="gst-card-label">Platform Charges</h3>
              </div>
              <div className="gst-card-value">
                {formatCurrency(nonGstData.monthlyBreakdown.reduce((acc, curr) => acc + curr.fee, 0))}
              </div>
              <p className="gst-card-subtitle" style={{ marginTop: '0.75rem', fontSize: '0.75rem' }}>
                Includes commission + GST (GST is not claimable for non-registered vendors)
              </p>
            </div>
          </div>

          <footer className="gst-footer">
            <div className="gst-disclaimer">
              <p>• GST is not applicable for your account</p>
              <p>• TDS is deducted as per Section 194-O</p>
              <p>• TDS can be claimed while filing your income tax return</p>
            </div>
          </footer>
        </div>
      )}

      {/* GLOBAL FOOTER (Only for Regular tab as it was already there) */}
      {activeTab === 'regular' && (
        <footer className="gst-footer">
          <div className="gst-disclaimer">
            <p>• This report includes platform transactions and self-reported earnings. Please verify all details before filing.</p>
            <p>• GST reporting is based on common tax rules. Consult with your tax advisor for specific cases.</p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default GSTCompliance;
