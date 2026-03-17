import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Routes, Route, useNavigate, Navigate, Link } from 'react-router-dom';
import './App.css';

interface FormData {
  ownerName: string;
  companyEmail: string;
  password: string;
  confirmPassword: string;
  businessService: string;
  displayName: string;
  businessLocation: string;
  houseNo: string;
  areaStreet: string;
  pincode: string;
  city: string;
  state: string;
  panNumber: string;
  panName: string;
  gstRegistered: string;
  gstNumber: string;
  fssaiNumber: string;
  fssaiExpiry: string;
  bankName: string;
  accountType: string;
  accountHolderName: string;
  accountNumber: string;
  confirmAccountNumber: string;
  ifscCode: string;
  partnershipAgreed: boolean;
  // File names for UI
  displayImageName?: string;
  panDocName?: string;
  gstDocName?: string;
  fssaiDocName?: string;
  bankDocName?: string;
}

interface StepProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof FormData) => void;
  handleRemoveFile: (fieldName: keyof FormData) => void;
  showPassword?: boolean;
  setShowPassword?: (val: boolean) => void;
  showConfirmPassword?: boolean;
  setShowConfirmPassword?: (val: boolean) => void;
}

const Step1 = ({ formData, handleInputChange, showPassword, setShowPassword, showConfirmPassword, setShowConfirmPassword }: StepProps) => (
  <div>
    <h2 className="step-title">Owner Details</h2>
    <p className="step-description">Please provide your personal information to set up your account.</p>
    <div className="form-group">
      <label className="input-label">Owner Name</label>
      <input type="text" name="ownerName" className="input-field" value={formData.ownerName} onChange={handleInputChange} placeholder="Enter your full name" />
    </div>
    <div className="form-group">
      <label className="input-label">Company Email ID</label>
      <input type="email" name="companyEmail" className="input-field" value={formData.companyEmail} onChange={handleInputChange} placeholder="hello@company.com" />
      <p className="field-helper-text">⚠️ Please provide the correct email ID — invoices, credit notes and all communications will be sent to this email.</p>
    </div>
    <div className="form-group">
      <label className="input-label">Password</label>
      <div className="input-group-with-icon">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          className="input-field"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="••••••••"
        />
        <button
          type="button"
          className="input-icon-btn"
          onClick={() => setShowPassword && setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
              <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          )}
        </button>
      </div>
    </div>
    <div className="form-group">
      <label className="input-label">Confirm Password</label>
      <div className="input-group-with-icon">
        <input
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          className="input-field"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          placeholder="••••••••"
        />
        <button
          type="button"
          className="input-icon-btn"
          onClick={() => setShowConfirmPassword && setShowConfirmPassword(!showConfirmPassword)}
        >
          {showConfirmPassword ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
              <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          )}
        </button>
      </div>
    </div>
  </div>
);

const Step2 = ({ formData, handleInputChange, handleFileChange, handleRemoveFile }: StepProps) => (
  <div>
    <h2 className="step-title">Business Details</h2>
    <p className="step-description">Tell us more about your business services and location.</p>

    <div className="step-two-layout">
      <div className="step-two-form">
        <div className="form-group">
          <label className="input-label">Business Service</label>
          <select name="businessService" className="input-field" value={formData.businessService} onChange={handleInputChange}>
            <option value="">Select Service</option>
            <option value="catering">Catering</option>
            <option value="mehendi">Mehendi</option>
            <option value="makeup">Makeup</option>
            <option value="private_theaters">Private Theaters</option>
          </select>
        </div>
        <div className="form-group">
          <label className="input-label">Display Name</label>
          <input type="text" name="displayName" className="input-field" value={formData.displayName} onChange={handleInputChange} placeholder="Your Business Name" />
        </div>
        <div className="form-group">
          <label className="input-label">Display Image</label>
          <div className="compact-upload-tile">
            {formData.displayImageName ? (
              <div className="uploaded-file-info">
                <div className="file-icon-name">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                  <span className="file-name">{formData.displayImageName}</span>
                </div>
                <button type="button" className="remove-file-btn" onClick={() => handleRemoveFile('displayImageName')}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            ) : (
              <>
                <input type="file" id="displayImage" className="hidden-file-input" accept="image/*" onChange={(e) => handleFileChange(e, 'displayImageName')} />
                <label htmlFor="displayImage" className="upload-tile-label">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  <span>Upload</span>
                </label>
              </>
            )}
          </div>
        </div>
        <div className="location-section">
          <div className="location-header">
            <h3 className="location-title">Location Details</h3>
            <button type="button" className="map-button">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span>Choose on map</span>
            </button>
          </div>

          <div className="form-group">
            <label className="input-label">House No / Floor</label>
            <input type="text" name="houseNo" className="input-field" value={formData.houseNo || ''} onChange={handleInputChange} placeholder="e.g. 123, 4th Floor" />
          </div>
          <div className="form-group">
            <label className="input-label">Area / Street</label>
            <input type="text" name="areaStreet" className="input-field" value={formData.areaStreet || ''} onChange={handleInputChange} placeholder="e.g. MG Road, Indiranagar" />
          </div>

          <div className="form-row side-by-side">
            <div className="form-group flex-1">
              <label className="input-label">Pin-code</label>
              <input type="text" name="pincode" className="input-field" value={formData.pincode || ''} onChange={handleInputChange} placeholder="e.g. 560001" maxLength={6} />
            </div>
            <div className="form-group flex-1">
              <label className="input-label">City</label>
              <input type="text" name="city" className="input-field" value={formData.city || ''} onChange={handleInputChange} placeholder="e.g. Bengaluru" />
            </div>
          </div>

          <div className="form-group">
            <label className="input-label">State</label>
            <input type="text" name="state" className="input-field" value={formData.state || ''} onChange={handleInputChange} placeholder="e.g. Karnataka" />
          </div>
        </div>
      </div>

      <div className="step-two-preview">
        <h3 className="preview-label">Customer View Reference</h3>
        <div className="customer-card-preview">
          <div className="preview-image-placeholder">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
          </div>
          <div className="preview-info">
            <h4 className="preview-business-name">{formData.displayName || 'Your Business Name'}</h4>
            <div className="preview-tags">
              <span className="preview-tag">{formData.businessService ? (formData.businessService.charAt(0).toUpperCase() + formData.businessService.slice(1).replace('_', ' ')) : 'Select Service'}</span>
              <span className="preview-tag star">★ 4.8 (120+)</span>
            </div>
            <p className="preview-location">{formData.businessLocation || 'City, State'}</p>
          </div>
        </div>
        <p className="preview-note">This is how your business will appear to customers on the platform.</p>
      </div>
    </div>
  </div>
);

const Step3 = ({ formData, handleInputChange, handleFileChange, handleRemoveFile }: StepProps) => (
  <div>
    <h2 className="step-title">Business Identity</h2>
    <p className="step-description">Verify your business identity by providing PAN and GST details.</p>
    <div className="form-group">
      <label className="input-label">Business/Owner PAN</label>
      <input type="text" name="panNumber" className="input-field" value={formData.panNumber} onChange={handleInputChange} placeholder="ABCDE1234F" />
    </div>
    <div className="form-group">
      <label className="input-label">Full Name on PAN</label>
      <input type="text" name="panName" className="input-field" value={formData.panName} onChange={handleInputChange} placeholder="Name exactly as on PAN" />
    </div>
    <div className="form-group">
      <label className="input-label">PAN PDF/DOC</label>
      <div className="compact-upload-tile">
        {formData.panDocName ? (
          <div className="uploaded-file-info">
            <div className="file-icon-name">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <span className="file-name">{formData.panDocName}</span>
            </div>
            <button type="button" className="remove-file-btn" onClick={() => handleRemoveFile('panDocName')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        ) : (
          <>
            <input type="file" id="panDoc" className="hidden-file-input" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => handleFileChange(e, 'panDocName')} />
            <label htmlFor="panDoc" className="upload-tile-label">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              <span>Upload</span>
            </label>
          </>
        )}
      </div>
    </div>

    <div className="form-group">
      <label className="input-label">GST Registered</label>
      <select name="gstRegistered" className="input-field" value={formData.gstRegistered} onChange={handleInputChange}>
        <option value="No">No</option>
        <option value="Yes">Yes</option>
      </select>
    </div>

    {formData.gstRegistered === 'Yes' && (
      <>
        <div className="form-group">
          <label className="input-label">GSTIN</label>
          <input type="text" name="gstNumber" className="input-field" value={formData.gstNumber} onChange={handleInputChange} placeholder="GST Number" />
        </div>
        <div className="form-group">
          <label className="input-label">GST PDF/DOC</label>
          <div className="compact-upload-tile">
            {formData.gstDocName ? (
              <div className="uploaded-file-info">
                <div className="file-icon-name">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                  <span className="file-name">{formData.gstDocName}</span>
                </div>
                <button type="button" className="remove-file-btn" onClick={() => handleRemoveFile('gstDocName')}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            ) : (
              <>
                <input type="file" id="gstDoc" className="hidden-file-input" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => handleFileChange(e, 'gstDocName')} />
                <label htmlFor="gstDoc" className="upload-tile-label">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  <span>Upload</span>
                </label>
              </>
            )}
          </div>
        </div>
      </>
    )}

    {formData.businessService === 'catering' && (
      <>
        <div className="form-separator">Specific Details</div>
        <div className="form-group">
          <label className="input-label">FSSAI Number</label>
          <div className="requirements-info-box">
            <p className="requirements-title">Requirements</p>
            <ul className="requirements-list">
              <li>The FSSAI certificate should either match the name of the restaurant or the owner</li>
              <li>The address on FSSAI certificate should match the address of the restaurant</li>
              <li>The FSSAI certificate should not be expiring before 30 days</li>
            </ul>
          </div>
          <input type="text" name="fssaiNumber" className="input-field" value={formData.fssaiNumber} onChange={handleInputChange} placeholder="FSSAI License Number" />
        </div>
        <div className="form-group">
          <label className="input-label">FSSAI Expiry Date</label>
          <input type="date" name="fssaiExpiry" className="input-field" value={formData.fssaiExpiry} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label className="input-label">FSSAI PDF/DOC</label>
          <div className="compact-upload-tile">
            {formData.fssaiDocName ? (
              <div className="uploaded-file-info">
                <div className="file-icon-name">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                  <span className="file-name">{formData.fssaiDocName}</span>
                </div>
                <button type="button" className="remove-file-btn" onClick={() => handleRemoveFile('fssaiDocName')}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            ) : (
              <>
                <input type="file" id="fssaiDoc" className="hidden-file-input" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => handleFileChange(e, 'fssaiDocName')} />
                <label htmlFor="fssaiDoc" className="upload-tile-label">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  <span>Upload</span>
                </label>
              </>
            )}
          </div>
        </div>
      </>
    )}
  </div>
);

const Step4 = ({ formData, handleInputChange, handleFileChange, handleRemoveFile }: StepProps) => (
  <div>
    <h2 className="step-title">Bank Details</h2>
    <p className="step-description">Enter your bank account details for smooth payment processing.</p>
    <div className="form-group">
      <label className="input-label">Select Bank</label>
      <select name="bankName" className="input-field" value={formData.bankName} onChange={handleInputChange}>
        <option value="">Select Bank</option>
        <option value="sbi">State Bank of India</option>
        <option value="hdfc">HDFC Bank</option>
        <option value="icici">ICICI Bank</option>
        <option value="axis">Axis Bank</option>
        <option value="other">Other</option>
      </select>
    </div>
    <div className="form-group">
      <label className="input-label">Account Type</label>
      <select name="accountType" className="input-field" value={formData.accountType} onChange={handleInputChange}>
        <option value="">Select Account Type</option>
        <option value="savings">Savings</option>
        <option value="current">Current</option>
      </select>
    </div>
    <div className="form-group">
      <label className="input-label">Bank Holder's Name</label>
      <input type="text" name="accountHolderName" className="input-field" value={formData.accountHolderName} onChange={handleInputChange} placeholder="Name exactly as on bank account" />
    </div>
    <div className="form-group">
      <label className="input-label">Account Number</label>
      <input type="password" name="accountNumber" className="input-field" value={formData.accountNumber} onChange={handleInputChange} placeholder="Enter Account Number" />
    </div>
    <div className="form-group">
      <label className="input-label">Confirm Account Number</label>
      <input type="text" name="confirmAccountNumber" className="input-field" value={formData.confirmAccountNumber} onChange={handleInputChange} placeholder="Confirm Account Number" />
    </div>
    <div className="form-group">
      <label className="input-label">IFSC Code</label>
      <input type="text" name="ifscCode" className="input-field" value={formData.ifscCode} onChange={handleInputChange} placeholder="e.g. SBIN0001234" />
    </div>
    <div className="form-group">
      <label className="input-label">Upload Passbook / Statement / Cheque</label>
      <div className="compact-upload-tile">
        {formData.bankDocName ? (
          <div className="uploaded-file-info">
            <div className="file-icon-name">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <span className="file-name">{formData.bankDocName}</span>
            </div>
            <button type="button" className="remove-file-btn" onClick={() => handleRemoveFile('bankDocName')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        ) : (
          <>
            <input type="file" id="bankDoc" className="hidden-file-input" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => handleFileChange(e, 'bankDocName')} />
            <label htmlFor="bankDoc" className="upload-tile-label">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              <span>Upload</span>
            </label>
          </>
        )}
      </div>
    </div>
  </div>
);

const Step5 = ({ formData, handleInputChange }: StepProps) => (
  <div>
    <h2 className="step-title">Partnership</h2>
    <p className="step-description">Review the partnership terms and agree to proceed.</p>
    <div className="checkbox-group" style={{ margin: '2rem 0' }}>
      <input
        type="checkbox"
        id="partnershipAgreed"
        name="partnershipAgreed"
        checked={formData.partnershipAgreed}
        onChange={handleInputChange}
      />
      <label htmlFor="partnershipAgreed">I agree to the <a href="#">Partnership Terms &amp; Conditions</a></label>
    </div>
  </div>
);

const StepIndicator = ({ currentStep }: { currentStep: number }) => {
  const stepsData = [
    { id: 1, title: 'Owner Details', subtitle: 'Enter your personal information' },
    { id: 2, title: 'Business Details', subtitle: 'Tell us more about your business' },
    { id: 3, title: 'Business Identity', subtitle: 'Verify your business identity' },
    { id: 4, title: 'Bank Details', subtitle: 'Setup your bank account' },
    { id: 5, title: 'Partnership', subtitle: 'Review and agree to terms' },
  ];

  return (
    <div className="vertical-step-indicator">
      {stepsData.map((step, index) => {
        const isCompleted = currentStep > step.id;
        const isActive = currentStep === step.id;
        return (
          <div key={step.id} className="vertical-step-item">
            <div className="vertical-step-icon-container">
              <div className={`vertical-step-circle ${isCompleted ? 'completed' : isActive ? 'active' : ''}`}>
                {isCompleted ? (
                  <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 5L4.5 8.5L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  step.id
                )}
              </div>
              {index < stepsData.length - 1 && (
                <div className={`vertical-step-line ${isCompleted ? 'completed' : ''}`}></div>
              )}
            </div>
            <div className="vertical-step-text">
              <div className={`vertical-step-title ${isCompleted ? 'completed-text' : isActive ? 'active-text' : 'future-text'}`}>
                {step.title}
              </div>
              <div className="vertical-step-subtitle">{step.subtitle}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const AuthLayout = ({ children, currentScreen }: { children: React.ReactNode, currentScreen: string }) => (
  <div className="login-page">
    <div className="login-panel-left">
      <div className="login-panel-content">
        <div className="login-brand">
          <svg width="36" height="36" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0H12L24 12V20L12 8H0V0Z" fill="white" />
            <path d="M0 12H12L24 24V32L12 20H0V12Z" fill="white" fillOpacity="0.7" />
          </svg>
          <span className="login-brand-name">MyPartner</span>
        </div>
        <div className="login-panel-hero">
          <h2>{currentScreen === 'login' ? 'Grow your business with MyPartner' : 'Join the MyPartner community'}</h2>
          <p>{currentScreen === 'login' ? 'Join thousands of restaurant and catering partners delivering great experiences' : 'Start your journey today and reach more customers than ever before'}</p>
          <div className="login-panel-stats">
            <div className="login-stat">
              <span className="login-stat-number">10K+</span>
              <span className="login-stat-label">Partners</span>
            </div>
            <div className="login-stat">
              <span className="login-stat-number">50+</span>
              <span className="login-stat-label">Cities</span>
            </div>
            <div className="login-stat">
              <span className="login-stat-number">4.8★</span>
              <span className="login-stat-label">Rating</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="login-panel-right">
      <div className="login-right-inner">
        <div className="mobile-only mobile-login-branding">
          <svg width="28" height="28" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0H12L24 12V20L12 8H0V0Z" fill="#0077ff" />
            <path d="M0 12H12L24 24V32L12 20H0V12Z" fill="#0077ff" fillOpacity="0.7" />
          </svg>
          <span className="onboarding-brand-name mobile-brand-name">MyPartner</span>
        </div>
        <div className="login-form-box">
          {children}
        </div>
      </div>
    </div>
  </div>
);

const Tickets = () => {
  const [category, setCategory] = useState('');
  const [bookingId, setBookingId] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [tickets, setTickets] = useState([
    { id: 'TKT-8842', category: 'Payment / Payout Issue', date: 'Oct 24, 2023', status: 'In Review' },
    { id: 'TKT-8711', category: 'Technical Issue', date: 'Oct 20, 2023', status: 'Resolved' },
    { id: 'TKT-8605', category: 'Booking Issue', date: 'Oct 15, 2023', status: 'Resolved' },
  ]);

  const categories = [
    'Booking Issue',
    'Payment / Payout Issue',
    'Customer Dispute',
    'Technical Issue',
    'Document Issue',
    'Other'
  ];

  const recentBookings = [
    { id: 'BK-5521', customer: 'Amit Sharma', date: 'Oct 28, 2023' },
    { id: 'BK-5489', customer: 'Priya Verma', date: 'Oct 25, 2023' },
    { id: 'BK-5430', customer: 'Suresh Raina', date: 'Oct 22, 2023' },
  ];

  const showBookingId = ['Booking Issue', 'Payment / Payout Issue', 'Customer Dispute'].includes(category);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      if (files.length + selectedFiles.length > 5) {
        alert('Max 5 files allowed');
        return;
      }
      setFiles(prev => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTicket = {
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      category,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Open'
    };
    setTickets([newTicket, ...tickets]);
    // Reset form
    setCategory('');
    setBookingId('');
    setDescription('');
    setFiles([]);
    alert('Ticket submitted successfully!');
  };

  return (
    <div className="tickets-container">
      <div className="section-header">
        <h2 className="section-title">Support Tickets</h2>
        <p className="section-subtitle">Raise a new issue or track your recent support requests.</p>
      </div>

      <div className="ticket-grid">
        <div className="ticket-form-card">
          <h3 className="card-title">Create New Ticket</h3>
          <form onSubmit={handleSubmit} className="ticket-form">
            <div className="form-group">
              <label className="input-label">Issue Category</label>
              <select
                className="input-field"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select Category</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div className={`form-group ${!showBookingId ? 'disabled-group' : ''}`}>
              <label className="input-label">Booking ID</label>
              <select
                className="input-field"
                value={bookingId}
                onChange={(e) => setBookingId(e.target.value)}
                required={showBookingId}
                disabled={!showBookingId}
              >
                <option value="">{showBookingId ? 'Select Recent Booking' : 'Not applicable for this category'}</option>
                {recentBookings.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.id} — {b.customer} ({b.date})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="input-label">Describe Your Issue</label>
              <textarea
                className="input-field textarea-field"
                placeholder="Tell us more about the problem you're facing..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label className="input-label">Proof Upload</label>
              <div className="file-upload-wrapper">
                <input
                  type="file"
                  id="ticket-files"
                  multiple
                  className="hidden-file-input"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
                <label htmlFor="ticket-files" className="file-upload-dropzone">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                  <span>Click to upload or drag & drop</span>
                  <p>Images, PDF, or DOC (Max 5 files, 10MB each)</p>
                </label>
              </div>
              {files.length > 0 && (
                <div className="ticket-file-list">
                  {files.map((file, idx) => (
                    <div key={idx} className="ticket-file-item">
                      <span className="file-name">{file.name}</span>
                      <button type="button" onClick={() => removeFile(idx)} className="remove-file-x">×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button type="submit" className="btn btn-primary-blue submit-ticket-btn">
              Submit Ticket
            </button>
          </form>
        </div>

        <div className="recent-tickets-card">
          <h3 className="card-title">Recent Tickets</h3>
          <div className="table-responsive">
            <table className="tickets-table">
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Category</th>
                  <th>Created On</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map(tkt => (
                  <tr key={tkt.id}>
                    <td className="ticket-id-cell">{tkt.id}</td>
                    <td>{tkt.category}</td>
                    <td>{tkt.date}</td>
                    <td>
                      <span className={`status-badge ${tkt.status.toLowerCase().replace(/\s/g, '-')}`}>
                        {tkt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const Documents = () => {
  const platformPolicies = [
    { name: 'Terms & Conditions', updated: '22 Jan 2026' },
    { name: 'Privacy Policy', updated: '15 Feb 2026' },
    { name: 'Refund & Cancellation Policy', updated: '10 Jan 2026' },
    { name: 'TDS Policy', updated: '01 Mar 2026' },
  ];

  const vendorAgreement = { name: 'Vendor Agreement', accepted: '03 Mar 2026' };

  return (
    <div className="documents-container">
      <div className="section-header">
        <h2 className="section-title">Documents</h2>
        <p className="section-subtitle">View and download your platform policies and signed agreements.</p>
      </div>

      <div className="documents-grid">
        <div className="documents-card">
          <h3 className="card-title">Platform Policies</h3>
          <div className="document-list">
            {platformPolicies.map((doc, idx) => (
              <div key={idx} className="document-row">
                <div className="doc-info">
                  <div className="doc-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  </div>
                  <div>
                    <span className="doc-name">{doc.name}</span>
                    <span className="doc-date">Last Updated: {doc.updated}</span>
                  </div>
                </div>
                <div className="doc-actions">
                  <button className="doc-btn view-btn">View</button>
                  <button className="doc-btn download-btn">Download</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="documents-card">
          <h3 className="card-title">Vendor Agreement</h3>
          <div className="document-list">
            <div className="document-row">
              <div className="doc-info">
                <div className="doc-icon agreement-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>
                </div>
                <div>
                  <span className="doc-name">{vendorAgreement.name}</span>
                  <span className="doc-date">Accepted on {vendorAgreement.accepted}</span>
                </div>
              </div>
              <div className="doc-actions">
                <button className="doc-btn view-btn">View</button>
                <button className="doc-btn download-btn">Download</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ServiceSettings = () => {
  const [activeCategory, setActiveCategory] = useState('breakfast');

  const categories = [
    { id: 'breakfast', label: 'Breakfast', count: 3, status: 'Active' },
    { id: 'lunch', label: 'Lunch', count: 3, status: 'Active' },
    { id: 'snacks', label: 'Snacks', count: 3, status: 'Active' },
    { id: 'dinner', label: 'Dinner', count: 3, status: 'Active' },
  ];

  const [settings, setSettings] = useState({
    breakfast: { startTime: '07:00', endTime: '11:00', acceptingOrders: true, stopOrdersValue: '2', stopOrdersUnit: 'Hours', style: ['Buffet Service'] },
    lunch: { startTime: '12:00', endTime: '15:30', acceptingOrders: true, stopOrdersValue: '4', stopOrdersUnit: 'Hours', style: ['Buffet Service', 'Sit-down Service'] },
    snacks: { startTime: '16:00', endTime: '18:30', acceptingOrders: false, stopOrdersValue: '2', stopOrdersUnit: 'Hours', style: ['Buffet Service'] },
    dinner: { startTime: '19:00', endTime: '23:00', acceptingOrders: true, stopOrdersValue: '1', stopOrdersUnit: 'Days', style: ['Buffet Service', 'Sit-down Service'] },
  });

  const [menus, setMenus] = useState([
    {
      id: 1, name: 'Standard Breakfast', price: 250, status: 'Active', category: 'breakfast',
      minMembers: '20', maxMembers: '100', foodType: 'Veg', image: null as string | null,
      sections: [
        { name: 'Starters', type: 'All Included', limit: 0, items: [{ name: 'Idli', description: 'Steamed rice cakes', image: null as string | null }] }
      ]
    },
    {
      id: 2, name: 'Premium Lunch Buffet', price: 650, status: 'Active', category: 'lunch',
      minMembers: '50', maxMembers: '200', foodType: 'Veg', image: null as string | null,
      sections: []
    },
    {
      id: 3, name: 'Evening Hi-Tea', price: 180, status: 'Disabled', category: 'snacks',
      minMembers: '15', maxMembers: '50', foodType: 'Veg', image: null as string | null,
      sections: []
    },
  ]);

  const [isAddingMenu, setIsAddingMenu] = useState(false);
  const [menuIdentity, setMenuIdentity] = useState({
    name: '',
    image: null as string | null,
    foodType: 'Veg',
    price: '',
    minMembers: '',
    maxMembers: ''
  });
  const [sections, setSections] = useState<any[]>([]);
  const [currentSection, setCurrentSection] = useState({
    name: '',
    type: 'All Included',
    items: [] as any[], // Changed to array of objects
    limit: 0
  });
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [menuStep, setMenuStep] = useState(1);
  const [sectionEditingIndex, setSectionEditingIndex] = useState<number | null>(null);
  const [menuActionId, setMenuActionId] = useState<number | null>(null);
  const [selectedMenuAction, setSelectedMenuAction] = useState<'hide' | 'delete' | null>(null);
  const [menuEditingId, setMenuEditingId] = useState<number | null>(null);

  // States for item-level creation
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMenuIdentity(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };


  const handleSaveSection = () => {
    if (sectionEditingIndex !== null) {
      setSections(prev => {
        const newSections = [...prev];
        newSections[sectionEditingIndex] = currentSection;
        return newSections;
      });
    } else {
      setSections(prev => [...prev, currentSection]);
    }
    setCurrentSection({ name: '', type: 'All Included', items: [], limit: 0 });
    setIsAddingSection(false);
    setSectionEditingIndex(null);
  };

  const resetAddMenu = () => {
    setIsAddingMenu(false);
    setMenuStep(1);
    setMenuIdentity({
      name: '',
      image: null,
      foodType: 'Veg',
      price: '',
      minMembers: '',
      maxMembers: ''
    });
    setSections([]);
    setCurrentSection({ name: '', type: 'All Included', items: [], limit: 0 });
    setIsAddingSection(false);
    setSectionEditingIndex(null);
    setMenuEditingId(null);
  };

  const currentSettings = settings[activeCategory as keyof typeof settings];

  const handleToggle = () => {
    setSettings(prev => ({
      ...prev,
      [activeCategory]: {
        ...prev[activeCategory as keyof typeof prev],
        acceptingOrders: !prev[activeCategory as keyof typeof prev].acceptingOrders
      }
    }));
  };

  const updateSetting = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [activeCategory]: {
        ...prev[activeCategory as keyof typeof prev],
        [field]: value
      }
    }));
  };

  return (
    <div className="service-settings-container">
      <div className="section-header">
        <h2 className="section-title">Service Settings</h2>
        <p className="section-subtitle">Manage your service timings, styles, and menu builder.</p>
      </div>

      <div className="service-settings-main">
        <div className="category-sidebar-wrapper">
          <div className="sidebar-header">
            <h3 className="sidebar-section-title">Services</h3>
          </div>
          <div className="category-sidebar">
            <div className="category-cards">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  className={`category-card-btn ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  <div className="cat-card-main">
                    <div className="cat-info">
                      <span className="cat-label">{cat.label}</span>
                      <span className="cat-count">{cat.count} items</span>
                    </div>
                    <span className="cat-status-badge">Active</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="settings-content">
          <div className="content-category-header">
            <h3 className="category-title">{activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}</h3>
            <div className="service-toggle-wrapper">
              <span className="service-toggle-label">{currentSettings.acceptingOrders ? 'Accepting Orders' : 'Paused Orders'}</span>
              <label className="service-switch">
                <input type="checkbox" checked={currentSettings.acceptingOrders} onChange={handleToggle} />
                <span className="service-slider round"></span>
              </label>
            </div>
          </div>

          <div className="settings-card">
            <div className="settings-grid-rows">
              <div className="settings-row">
                <div className="form-group">
                  <label className="input-label">Start Time</label>
                  <input type="time" className="input-field" value={currentSettings.startTime} onChange={(e) => updateSetting('startTime', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="input-label">End Time</label>
                  <input type="time" className="input-field" value={currentSettings.endTime} onChange={(e) => updateSetting('endTime', e.target.value)} />
                </div>
              </div>

              <div className="settings-row">
                <div className="form-group">
                  <label className="input-label">Manage Bookings</label>
                  <input type="number" className="input-field" placeholder="Enter booking limit..." />
                </div>
                <div className="form-group">
                  <label className="input-label">Stop Orders Before</label>
                  <div className="stop-orders-wrapper">
                    <input
                      type="number"
                      className="input-field stop-value"
                      value={currentSettings.stopOrdersValue}
                      onChange={(e) => updateSetting('stopOrdersValue', e.target.value)}
                      min="1"
                    />
                    <select
                      className="input-field stop-unit"
                      value={currentSettings.stopOrdersUnit}
                      onChange={(e) => updateSetting('stopOrdersUnit', e.target.value)}
                    >
                      <option>Hours</option>
                      <option>Days</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="service-style-section">
              <label className="input-label">Service Style Supported</label>
              <div className="service-style-cards">
                <div
                  className={`style-card ${currentSettings.style.includes('Buffet Service') ? 'active' : ''}`}
                  onClick={() => {
                    const newStyles = currentSettings.style.includes('Buffet Service')
                      ? currentSettings.style.filter(s => s !== 'Buffet Service')
                      : [...currentSettings.style, 'Buffet Service'];
                    updateSetting('style', newStyles);
                  }}
                >
                  <div className="style-icon-wrapper">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path><path d="M7 2v20"></path><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path></svg>
                  </div>
                  <div className="style-info">
                    <span className="style-name">Buffet Service</span>
                    <span className="style-desc">Self-service meal style</span>
                  </div>
                  <div className="style-checkbox">
                    {currentSettings.style.includes('Buffet Service') && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                  </div>
                </div>

                <div
                  className={`style-card ${currentSettings.style.includes('Sit-down Service') ? 'active' : ''}`}
                  onClick={() => {
                    const newStyles = currentSettings.style.includes('Sit-down Service')
                      ? currentSettings.style.filter(s => s !== 'Sit-down Service')
                      : [...currentSettings.style, 'Sit-down Service'];
                    updateSetting('style', newStyles);
                  }}
                >
                  <div className="style-icon-wrapper">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 21v-7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v7"></path><path d="M4 11V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7"></path><path d="M12 2v10"></path></svg>
                  </div>
                  <div className="style-info">
                    <span className="style-name">Sit-down Service</span>
                    <span className="style-desc">Wait-staff table service</span>
                  </div>
                  <div className="style-checkbox">
                    {currentSettings.style.includes('Sit-down Service') && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="menu-builder-section">
            <div className="menu-builder-header">
              <h3 className="builder-title">Menu Builder</h3>
              <button
                className="btn btn-primary-blue add-menu-btn"
                onClick={() => setIsAddingMenu(true)}
              >
                + Add Menu
              </button>
            </div>

            <div className="menu-list">
              {menus.filter(m => m.category === activeCategory).map(menu => (
                <div key={menu.id} className="menu-card">
                  <div className="menu-card-header">
                    <div className="menu-header-left">
                      <div className="menu-card-image-wrapper">
                        {menu.image ? (
                          <img src={menu.image} alt={menu.name} className="header-menu-image" />
                        ) : (
                          <div className="menu-image-placeholder">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                          </div>
                        )}
                      </div>
                      <div className="menu-main-info">
                        <h4>{menu.name}</h4>
                        <div className="menu-meta">
                          <span className="menu-price">₹{menu.price} per plate</span>
                          <span className={`status-badge ${menu.status.toLowerCase()}`}>{menu.status}</span>
                        </div>
                      </div>
                    </div>
                    <div className="menu-actions">
                      <button
                        className="icon-btn edit-btn"
                        onClick={() => {
                          setMenuIdentity({
                            name: menu.name,
                            price: menu.price.toString(),
                            minMembers: menu.minMembers,
                            maxMembers: menu.maxMembers,
                            foodType: menu.foodType,
                            image: menu.image
                          });
                          setSections([...menu.sections]);
                          setMenuEditingId(menu.id);
                          setMenuStep(1);
                          setIsAddingMenu(true);
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        Edit
                      </button>
                      <button
                        className="icon-btn manage-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuActionId(menuActionId === menu.id ? null : menu.id);
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        Delete / Hide
                      </button>

                      {/* Existing Edit/Delete buttons */}
                    </div>
                  </div>
                </div>
              ))}

              {menuActionId && (
                <div className="modal-overlay" onClick={() => {
                  setMenuActionId(null);
                  setSelectedMenuAction(null);
                }}>
                  <div className="modal-container mini" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                      <div className="modal-title-group">
                        <h3 className="modal-title">Manage Menu</h3>
                        <p className="modal-subtitle">Choose an action for this menu</p>
                      </div>
                      <button className="close-modal" onClick={() => {
                        setMenuActionId(null);
                        setSelectedMenuAction(null);
                      }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      </button>
                    </div>

                    <div className="modal-content" style={{ padding: '0 1.5rem 1.5rem' }}>
                      <div className="action-options-modal">
                        {(() => {
                          const menu = menus.find(m => m.id === menuActionId);
                          if (!menu) return null;
                          return (
                            <>
                              <label className={`action-option-v2 ${selectedMenuAction === 'hide' ? 'selected' : ''}`} onClick={() => setSelectedMenuAction('hide')}>
                                <div className="option-radio">
                                  <div className="radio-inner"></div>
                                </div>
                                <div className="option-info">
                                  <span className="option-label">{menu.status === 'Disabled' ? 'Show Menu' : 'Hide Menu'}</span>
                                  <span className="option-desc">{menu.status === 'Disabled' ? 'Make this menu visible to customers' : 'Temporarily hide this menu from customers'}</span>
                                </div>
                              </label>

                              <label className={`action-option-v2 ${selectedMenuAction === 'delete' ? 'selected delete-selected' : ''}`} onClick={() => setSelectedMenuAction('delete')}>
                                <div className="option-radio">
                                  <div className="radio-inner"></div>
                                </div>
                                <div className="option-info">
                                  <span className="option-label delete">Delete Menu</span>
                                  <span className="option-desc">Permanently remove this menu and its sections</span>
                                </div>
                              </label>
                            </>
                          );
                        })()}
                      </div>
                    </div>

                    <div className="modal-footer" style={{ borderTop: '1px solid #f1f5f9', padding: '1.25rem 1.5rem' }}>
                      <div className="footer-right" style={{ width: '100%', justifyContent: 'flex-end', gap: '0.75rem' }}>
                        <button 
                          className="btn btn-ghost" 
                          onClick={() => {
                            setMenuActionId(null);
                            setSelectedMenuAction(null);
                          }}
                        >
                          Cancel
                        </button>
                        <button 
                          className={`btn ${selectedMenuAction === 'delete' ? 'btn-primary-red' : 'btn-primary-blue'}`}
                          disabled={!selectedMenuAction}
                          style={{ minWidth: '120px' }}
                          onClick={() => {
                            if (selectedMenuAction === 'hide') {
                              setMenus(menus.map(m => m.id === menuActionId ? { ...m, status: m.status === 'Disabled' ? 'Active' : 'Disabled' } : m));
                            } else if (selectedMenuAction === 'delete') {
                              setMenus(menus.filter(m => m.id !== menuActionId));
                            }
                            setMenuActionId(null);
                            setSelectedMenuAction(null);
                          }}
                        >
                          {!selectedMenuAction ? 'Okay' : (selectedMenuAction === 'delete' ? 'Delete Menu' : (menus.find(m => m.id === menuActionId)?.status === 'Disabled' ? 'Show Menu' : 'Hide Menu'))}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {menus.filter(m => m.category === activeCategory).length === 0 && (
                <div className="empty-menu-state">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"></path><path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4"></path><path d="M13 13h4"></path><path d="M13 17h4"></path><path d="M7 13h2v4H7z"></path></svg>
                  <p>No menus added for this category yet.</p>
                  <button
                    className="btn btn-outline"
                    style={{ marginTop: '1rem' }}
                    onClick={() => setIsAddingMenu(true)}
                  >
                    Create First Menu
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

            {isAddingMenu && (
              <div className="modal-overlay">
                <div className="modal-container medium-large">
                  <div className="modal-header">
                    <div className="modal-title-group">
                      <h3 className="modal-title">{menuEditingId ? 'Edit Menu' : 'Create New Menu'}</h3>
                      <p className="modal-subtitle">
                        {menuEditingId ? 'Update menu basics and food sections' : 'Create menu basics before adding food sections'}
                      </p>
                    </div>
                    <button className="close-modal" onClick={resetAddMenu}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                  </div>

                  <div className="modal-content">
                    {menuStep === 1 && (
                      <div className="step-content">
                        <div className="commercial-setup-grid">
                          {/* Block 1: Menu Identity */}
                          <div className="form-section-flat">
                            <h4 className="block-title">Menu Identity</h4>
                            <div className="form-group full-width">
                              <label className="input-label">Menu Name</label>
                              <input
                                type="text"
                                className="input-field"
                                placeholder="e.g. Standard Breakfast"
                                value={menuIdentity.name}
                                onChange={(e) => setMenuIdentity(prev => ({ ...prev, name: e.target.value }))}
                              />
                            </div>
                          </div>

                          <div className="form-section-flat">
                            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                              <label className="input-label">Food Type</label>
                              <div className="radio-group-pills">
                                {['Veg', 'Non-Veg'].map(type => (
                                  <button
                                    key={type}
                                    className={`pill-btn ${type === 'Veg' ? 'pill-veg' : 'pill-non-veg'} ${menuIdentity.foodType === type ? 'active' : ''}`}
                                    onClick={() => setMenuIdentity(prev => ({ ...prev, foodType: type }))}
                                  >
                                    <span className="pill-icon">
                                      {type === 'Veg' ? (
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="0.5" y="0.5" width="11" height="11" rx="1.5" stroke="currentColor" /><circle cx="6" cy="6" r="3" fill="currentColor" /></svg>
                                      ) : (
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="0.5" y="0.5" width="11" height="11" rx="1.5" stroke="currentColor" /><circle cx="6" cy="6" r="3" fill="currentColor" /></svg>
                                      )}
                                    </span>
                                    {type}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="form-group" style={{ maxWidth: '320px', marginBottom: '1.5rem' }}>
                              <label className="input-label">Price Per Person</label>
                              <div className="input-with-prefix-fixed">
                                <span className="prefix-fixed">₹</span>
                                <input
                                  type="number"
                                  className="input-field pill-input"
                                  placeholder="0"
                                  value={menuIdentity.price}
                                  onChange={(e) => setMenuIdentity(prev => ({ ...prev, price: e.target.value }))}
                                />
                              </div>
                            </div>

                            <div className="form-row-2" style={{ marginBottom: '1.5rem' }}>
                              <div className="form-group">
                                <label className="input-label">Minimum Members</label>
                                <input
                                  type="number"
                                  className="input-field"
                                  placeholder="Min pax"
                                  value={menuIdentity.minMembers}
                                  onChange={(e) => setMenuIdentity(prev => ({ ...prev, minMembers: e.target.value }))}
                                />
                                <span className="helper-text-label">Applicable booking size for this menu</span>
                              </div>
                              <div className="form-group">
                                <label className="input-label">Maximum Members</label>
                                <input
                                  type="number"
                                  className="input-field"
                                  placeholder="Max pax"
                                  value={menuIdentity.maxMembers}
                                  onChange={(e) => setMenuIdentity(prev => ({ ...prev, maxMembers: e.target.value }))}
                                />
                                <span className="helper-text-label">Applicable booking size for this menu</span>
                              </div>
                            </div>

                            <div className="form-group full-width">
                              <label className="input-label">Menu Image</label>
                              <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                accept="image/*"
                                onChange={handleImageUpload}
                              />
                              <div className="image-dashed-upload-v2" onClick={() => fileInputRef.current?.click()}>
                                {menuIdentity.image ? (
                                  <div className="upload-preview-container">
                                    <img src={menuIdentity.image} alt="Menu Preview" className="upload-preview-img" />
                                    <div className="upload-overlay-v2">
                                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6"></path><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
                                      <span>Change Image</span>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <div className="upload-icon-circle">
                                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                                    </div>
                                    <div className="upload-texts">
                                      <span className="upload-main">Click to upload menu image</span>
                                      <span className="upload-sub">PNG, JPG or WebP (Max 5MB)</span>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {menuStep === 2 && (
                      <div className="step-content">
                        <h5 className="block-title" style={{ marginBottom: '0.75rem' }}>Example</h5>
                        <div className="builder-helper-minimal" style={{ marginBottom: '1.5rem', background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: 'none', minHeight: '140px' }}>
                        </div>

                        <div className="builder-header-minimal">
                          <h4 className="builder-main-title">Sections</h4>
                          <p className="builder-helper-text">Build food groups inside this menu</p>
                          <div className="menu-status-hint">
                            Menu was created you can customise or edit from dashboard
                          </div>
                        </div>

                        {!isAddingSection && sections.length === 0 && (
                          <div className="builder-empty-state">
                            <div className="empty-state-card">
                              <div className="empty-icon-wrap">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20v-6M9 20V10M15 20V4"></path></svg>
                              </div>
                              <h5>No sections added yet</h5>
                              <p>Start by creating your first food group like Starters or Main Course</p>
                              <button
                                className="btn btn-primary"
                                onClick={() => {
                                  setCurrentSection({ name: '', type: 'All Included', limit: 0, items: [{ name: '', description: '', image: null }] });
                                  setIsAddingSection(true);
                                }}
                              >
                                + Add First Section
                              </button>
                            </div>
                          </div>
                        )}

                        <div className="saved-sections-list">
                          {sections.map((sec, idx) => {
                            if (idx === sectionEditingIndex) return null;
                            return (
                              <div key={idx} className="section-summary-card">
                              <div className="sec-sum-info">
                                <span className="sec-sum-name">{sec.name}</span>
                                <span className="sec-sum-rule">
                                  {sec.type === 'All Included' ? 'All items included' : `Choose any ${sec.limit} from ${sec.items.length} items`}
                                </span>
                              </div>
                              <div className="section-actions-inline">
                                <button className="icon-btn edit-btn" onClick={() => {
                                  setCurrentSection({ ...sec });
                                  setSectionEditingIndex(idx);
                                  setIsAddingSection(true);
                                }}>
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                </button>
                                <button className="icon-btn delete-btn" onClick={() => {
                                  setSections(sections.filter((_, i) => i !== idx));
                                }}>
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                        </div>

                        {!isAddingSection && sections.length > 0 && (
                          <div className="add-sec-bar-inline">
                            <button
                              className="btn btn-outline btn-sm"
                              onClick={() => {
                                setCurrentSection({ name: '', type: 'All Included', limit: 0, items: [{ name: '', description: '', image: null }] });
                                setIsAddingSection(true);
                              }}
                            >
                              + Add Another Section
                            </button>
                          </div>
                        )}

                        {isAddingSection && (
                          <div className="section-inline-editor">
                            <div className="section-form-top">
                              <div className="form-group full-width">
                                <label className="input-label">Section Name</label>
                                <input
                                  type="text"
                                  className="input-field"
                                  placeholder="e.g. Starters"
                                  value={currentSection.name}
                                  onChange={(e) => setCurrentSection(prev => ({ ...prev, name: e.target.value }))}
                                />
                              </div>

                              <div className="selection-type-row">
                                <div className="form-group flex-1">
                                  <label className="input-label">Selection Type</label>
                                  <select
                                    className="input-field"
                                    value={currentSection.type}
                                    onChange={(e) => setCurrentSection(prev => ({ ...prev, type: e.target.value }))}
                                  >
                                    <option>All Included</option>
                                    <option>Limited Selection</option>
                                  </select>
                                </div>
                                <div className="form-group mini-limit">
                                  <label className="input-label">Choose Any</label>
                                  <input
                                    type="number"
                                    className="input-field"
                                    placeholder="0"
                                    disabled={currentSection.type === 'All Included'}
                                    value={currentSection.limit || ''}
                                    onChange={(e) => setCurrentSection(prev => ({ ...prev, limit: parseInt(e.target.value) || 0 }))}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="items-area-inline">
                              <label className="input-label">Items in this Section</label>
                              <div className="item-cards-list">
                                {currentSection.items.map((item, i) => (
                                  <div key={i} className="item-input-card">
                                    <div className="item-form-grid">
                                      <div className="item-form-image">
                                        <div className="item-upload-mini" onClick={() => {
                                          const input = document.createElement('input');
                                          input.type = 'file';
                                          input.accept = 'image/*';
                                          input.onchange = (e) => {
                                            const file = (e.target as HTMLInputElement).files?.[0];
                                            if (file) {
                                              const reader = new FileReader();
                                              reader.onloadend = () => {
                                                const newItems = [...currentSection.items];
                                                newItems[i].image = reader.result as string;
                                                setCurrentSection(prev => ({ ...prev, items: newItems }));
                                              };
                                              reader.readAsDataURL(file);
                                            }
                                          };
                                          input.click();
                                        }}>
                                          {item.image ? (
                                            <img src={item.image} alt="Item" className="uploaded-mini-thumb" />
                                          ) : (
                                            <div className="upload-placeholder-mini">
                                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                                              <span>Photo</span>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="item-form-details">
                                        <div className="form-group">
                                          <input
                                            type="text"
                                            className="input-field item-name-field"
                                            placeholder="Item Name"
                                            value={item.name}
                                            onChange={(e) => {
                                              const newItems = [...currentSection.items];
                                              newItems[i].name = e.target.value;
                                              setCurrentSection(prev => ({ ...prev, items: newItems }));
                                            }}
                                          />
                                        </div>
                                        <div className="form-group">
                                          <textarea
                                            className="input-field item-desc-field"
                                            placeholder="Short Description (max 1000 chars)"
                                            maxLength={1000}
                                            value={item.description}
                                            onChange={(e) => {
                                              const newItems = [...currentSection.items];
                                              newItems[i].description = e.target.value;
                                              setCurrentSection(prev => ({ ...prev, items: newItems }));
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    {currentSection.items.length > 1 && (
                                      <button className="item-remove-btn" onClick={() => {
                                        setCurrentSection(prev => ({ ...prev, items: prev.items.filter((_, idx) => idx !== i) }));
                                      }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                      </button>
                                    )}
                                  </div>
                                ))}
                              </div>

                              <button
                                className="add-item-btn-inline"
                                onClick={() => {
                                  setCurrentSection(prev => ({
                                    ...prev,
                                    items: [...prev.items, { name: '', description: '', image: null }]
                                  }));
                                }}
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                Add Another Item
                              </button>
                            </div>

                            <div className="section-builder-actions">
                              <button className="btn btn-ghost" onClick={() => setIsAddingSection(false)}>Cancel</button>
                              <button
                                className="btn btn-primary-blue"
                                disabled={!currentSection.name || currentSection.items.length === 0}
                                onClick={handleSaveSection}
                              >
                                Save Section
                              </button>
                            </div>
                            <div className="section-save-hint">
                              save the current section to create the new section
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {menuStep === 3 && (
                      <div className="step-content">
                        <div className="preview-card">
                          <div className="preview-identity">
                            <div className="preview-img-box">
                              <img
                                src={menuIdentity.image || "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=160&h=160&fit=crop"}
                                alt="Menu Preview"
                                className="thumbnail-80"
                              />
                            </div>
                            <div className="preview-info">
                              <h4 className="preview-menu-name">{menuIdentity.name || 'Untitled Menu'}</h4>
                              <div className="preview-sub-meta">
                                <span className="preview-category-count">
                                  {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} • {sections.length} Sections
                                </span>
                                <span className={`food-type-tag ${menuIdentity.foodType.toLowerCase()}`}>
                                  <span className="p-type-icon">
                                    {menuIdentity.foodType === 'Veg' ? (
                                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><rect x="0.5" y="0.5" width="11" height="11" rx="1.5" stroke="currentColor" /><circle cx="6" cy="6" r="3" fill="currentColor" /></svg>
                                    ) : (
                                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><rect x="0.5" y="0.5" width="11" height="11" rx="1.5" stroke="currentColor" /><circle cx="6" cy="6" r="3" fill="currentColor" /></svg>
                                    )}
                                  </span>
                                  {menuIdentity.foodType}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="preview-sections-v2">
                            {sections.map((sec, idx) => (
                              <Fragment key={idx}>
                                <div className="preview-section-item-flat">
                                  <div className="p-sec-header">
                                    <span className="p-sec-name">{sec.name}</span>
                                    <span className="p-sec-summary">
                                      {sec.type?.toLowerCase().trim() === 'all included' ? '→ all included' : `→ choose any ${sec.limit} from ${sec.items.length} items`}
                                    </span>
                                  </div>
                                  <div className="p-sec-items-detailed-list">
                                    {sec.items.map((item: any, i: number) => (
                                      <div key={i} className="p-item-detail">
                                        <span className="p-item-name">{item.name}</span>
                                        {item.description && <span className="p-item-desc">• {item.description}</span>}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                {idx < sections.length - 1 && <div className="section-divider"></div>}
                              </Fragment>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="modal-footer">
                    <div className="footer-left">
                      <span className="step-counter-badge">Step {menuStep}/3</span>
                    </div>
                    <div className="footer-right">
                      {menuStep > 1 && (
                        <button className="btn btn-outline" onClick={() => setMenuStep(prev => prev - 1)}>Back</button>
                      )}

                      {menuStep < 3 ? (
                        <button
                          className="btn btn-primary-blue"
                          onClick={() => setMenuStep(prev => prev + 1)}
                          disabled={menuStep === 1 && !menuIdentity.name}
                        >
                          Next
                        </button>
                      ) : (
                        <button
                          className="btn btn-primary-blue"
                          onClick={() => {
                            if (menuEditingId) {
                              setMenus(prev => prev.map(m => m.id === menuEditingId ? {
                                ...m,
                                name: menuIdentity.name,
                                price: parseInt(menuIdentity.price) || 0,
                                minMembers: menuIdentity.minMembers,
                                maxMembers: menuIdentity.maxMembers,
                                foodType: menuIdentity.foodType,
                                image: menuIdentity.image,
                                sections: [...sections]
                              } : m));
                            } else {
                              const newMenuObj = {
                                id: menus.length + 1,
                                name: menuIdentity.name,
                                price: parseInt(menuIdentity.price) || 0,
                                status: 'Active',
                                category: activeCategory,
                                minMembers: menuIdentity.minMembers,
                                maxMembers: menuIdentity.maxMembers,
                                foodType: menuIdentity.foodType,
                                image: menuIdentity.image,
                                sections: [...sections]
                              };
                              setMenus(prev => [...prev, newMenuObj]);
                            }
                            resetAddMenu();
                          }}
                        >
                          Save Menu
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
        </div>
    </div>
  );
};

const VendorProfile = () => {
  const [activeTab, setActiveTab] = useState('Summary');

  const tabs = [
    { id: 'Summary', label: 'Summary' },
    { id: 'Documents', label: 'Documents' },
    { id: 'Bank Details', label: 'Bank Details' }
  ];

  const profileData = {
    header: {
      name: 'Catering Enterprise 3',
      id: 'MYMCATKAR0003',
      status: 'Active',
      joined: '18 Nov 2024',
      gstType: 'Regular',
      service: 'Catering'
    },
    owner: {
      name: 'Bhargav Reddy',
      email: 'contact@cateringent3.com',
      mobile: '+91 98765 43210'
    },
    business: {
      category: 'Enterprise Catering',
      displayName: 'Catering Enterprise 3 Services',
      address: 'Plot 45, Jubilee Hills, Road No. 36',
      city: 'Hyderabad',
      state: 'Telangana',
      radius: '50km Radius'
    },
    identity: {
      pan: 'ABCDE1234F',
      gst: '36AAAAA0000A1Z5',
      fssai: '12345678901234'
    },
    partnership: {
      joinedDate: '18 Nov 2024',
      plan: 'Pro Plan',
      gstType: 'Regular Taxpayer',
      agreement: 'Accepted'
    },
    documents: [
      { type: 'GST Certificate', identifier: '29ABCDE1234F103Z5', date: '14 Feb 2026', status: 'Verified' },
      { type: 'PAN Card', identifier: 'ABCDE1234F', date: '14 Feb 2026', status: 'Verified' },
      { type: 'FSSAI License', identifier: '12345678901234', date: '14 Feb 2026', status: 'Verified' },
      { type: 'Cancelled Cheque', identifier: 'A/C: ****9012', date: '14 Feb 2026', status: 'Verified' }
    ],
    bank: {
      bankName: 'HDFC Bank',
      holderName: 'User 3',
      accountNumber: 'XXXX  XXXX  9012',
      ifsc: 'HDFC0001234',
      accountType: 'Savings Account',
      status: 'Verified',
      lastUpdated: '14 Feb 2026'
    }
  };

  return (
    <div className="profile-v4-container">
      {/* Top Fixed Header */}
      <div className="profile-top-header-v4">
        <h1 className="biz-name-v4">{profileData.header.name}</h1>
        
        <div className="header-meta-row-v4">
          <div className="v-id-badge-v4">{profileData.header.id}</div>
          
          <div className="status-pill-v4">
            <span className="status-dot-v4"></span>
            <span className="status-text-v4">{profileData.header.status}</span>
          </div>
          
          <div className="meta-divider-v4"></div>
          
          <div className="meta-item-v4">
            <span className="m-label-v4">Joined:</span>
            <span className="m-value-v4">{profileData.header.joined}</span>
          </div>
          
          <div className="meta-item-v4">
            <span className="m-label-v4">GST Type:</span>
            <span className="m-value-v4 gst-regular-v4">{profileData.header.gstType}</span>
          </div>
          
          <div className="meta-divider-v4"></div>
          
          <div className="meta-item-v4">
            <span className="m-label-v4">Service:</span>
            <span className="m-value-v4 service-type-v4">{profileData.header.service}</span>
          </div>
        </div>
      </div>

      {/* Primary Tabs */}
      <div className="profile-tabs-nav-v4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn-v4 ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="profile-tab-content-v4">
        {activeTab === 'Summary' && (
          <div className="summary-tab-v4">
            <div className="summary-split-layout-v4">
              <div className="summary-left-v4">
                <div className="summary-card-v4">
                  <div className="summary-card-stacked-v4">
                    {/* Personal Details Group */}
                    <div className="summary-group-v4">
                      <div className="group-title-v4">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        Personal Details
                      </div>
                      <div className="group-content-v4-horizontal">
                        <div className="summary-item-v4">
                          <label>Owner Name</label>
                          <span>{profileData.owner.name}</span>
                        </div>
                        <div className="summary-item-v4">
                          <label>Mobile Number</label>
                          <span>{profileData.owner.mobile}</span>
                        </div>
                        <div className="summary-item-v4">
                          <label>Mail ID</label>
                          <span>{profileData.owner.email}</span>
                        </div>
                      </div>
                    </div>

                    <div className="summary-h-divider-v4"></div>

                    {/* Business Details Group */}
                    <div className="summary-group-v4">
                      <div className="group-title-v4">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                        Business Details
                      </div>
                      <div className="group-content-v4-horizontal">
                        <div className="summary-item-v4">
                          <label>Business Name</label>
                          <span>{profileData.header.name}</span>
                        </div>
                        <div className="summary-item-v4">
                          <label>Service Category</label>
                          <span>{profileData.business.category}</span>
                        </div>
                        <div className="summary-item-v4">
                          <label>Address</label>
                          <span>{profileData.business.address}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="summary-right-v4">
                <div className="business-preview-container-v4">
                  <h4 className="preview-label-v4">Business Preview</h4>
                  <div className="customer-card-preview-v4">
                    <div className="preview-image-placeholder-v4">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                      </svg>
                    </div>
                    <div className="preview-info-v4">
                      <h4 className="preview-business-name-v4">{profileData.header.name}</h4>
                      <div className="preview-tags-v4">
                        <span className="preview-tag-v4">{profileData.business.category}</span>
                        <span className="preview-tag-v4 star-v4">★ 4.8 (120+)</span>
                      </div>
                      <p className="preview-location-v4">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                        {profileData.business.city}, {profileData.business.state}
                      </p>
                    </div>
                  </div>
                  <p className="preview-note-v4">This is how your business appears to customers.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Documents' && (
          <div className="documents-tab-v4">
            <div className="docs-card-v4">
              <div className="docs-card-header-v4">
                <div className="d-title-group-v4">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: '#64748b'}}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                  <h3>Uploaded Documents</h3>
                </div>
              </div>
              <div className="docs-table-wrapper-v4">
                <table className="docs-table-v4">
                  <thead>
                    <tr>
                      <th>DOCUMENT TYPE</th>
                      <th>IDENTIFIER</th>
                      <th>UPLOAD DATE</th>
                      <th>STATUS</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profileData.documents.map((doc, idx) => (
                      <tr key={idx}>
                        <td className="doc-type-cell-v4">{doc.type}</td>
                        <td className="doc-id-cell-v4">{doc.identifier}</td>
                        <td className="doc-date-cell-v4">{doc.date}</td>
                        <td>
                          <span className="v-status-badge-v4 verified">{doc.status}</span>
                        </td>
                        <td>
                          <button className="view-doc-icon-btn-v4">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Bank Details' && (
          <div className="bank-tab-v4">
            <div className="bank-details-card-v4">
              <div className="bank-card-top-v4">
                <div className="bc-header-left-v4">
                  <div className="bc-icon-v4">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"></path><path d="M3 10h18"></path><path d="M5 21V10"></path><path d="M9 21V10"></path><path d="M13 21V10"></path><path d="M17 21V10"></path><path d="M2 5l10-3 10 3"></path></svg>
                  </div>
                  <div className="bc-title-wrap-v4">
                    <div className="bc-title-row-v4">
                      <h3>Bank Account Details</h3>
                      <span className="v-status-badge-v4 verified">Verified</span>
                    </div>
                    <p className="bc-subtitle-v4">Payouts will be sent to this account.</p>
                  </div>
                </div>
                <div className="bc-header-right-v4">
                  <span className="last-updated-v4">Last updated: {profileData.bank.lastUpdated}</span>
                </div>
              </div>

              <div className="bank-info-grid-inner-v4">
                <div className="bi-column-v4">
                  <div className="bi-item-v4">
                    <label>BANK NAME</label>
                    <span>{profileData.bank.bankName}</span>
                  </div>
                  <div className="bi-item-v4">
                    <label>ACCOUNT NUMBER</label>
                    <span className="font-mono">{profileData.bank.accountNumber}</span>
                  </div>
                  <div className="bi-item-v4">
                    <label>ACCOUNT TYPE</label>
                    <span>{profileData.bank.accountType}</span>
                  </div>
                </div>
                <div className="bi-column-v4">
                  <div className="bi-item-v4">
                    <label>ACCOUNT HOLDER NAME</label>
                    <span>{profileData.bank.holderName}</span>
                  </div>
                  <div className="bi-item-v4">
                    <label>IFSC CODE</label>
                    <span>{profileData.bank.ifsc}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Dashboard = ({ navigate }: { navigate: (val: string) => void }) => {
  const navigationGroups = [
    {
      title: 'Business',
      items: [
        {
          id: 'dashboard', label: 'Dashboard', icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
          )
        },
        {
          id: 'bookings', label: 'Bookings', icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          )
        },
        {
          id: 'revenue', label: 'Revenue', icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          )
        },
        {
          id: 'reports', label: 'Reports', icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10"></line>
              <line x1="12" y1="20" x2="12" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>
          )
        }
      ]
    },
    {
      title: 'Operations',
      items: [
        {
          id: 'service-settings', label: 'Service Settings', icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"></path>
            </svg>
          )
        },
        {
          id: 'coupons', label: 'Coupons', icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 5v2"></path>
              <path d="M15 11v2"></path>
              <path d="M15 17v2"></path>
              <path d="M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7a2 2 0 0 1 2-2z"></path>
            </svg>
          )
        },
        {
          id: 'ratings', label: 'Ratings', icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          )
        },
        {
          id: 'tickets', label: 'Tickets', icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path>
              <path d="M13 5v2"></path>
              <path d="M13 17v2"></path>
              <path d="M13 11v2"></path>
            </svg>
          )
        }
      ]
    },
    {
      title: 'Account',
      items: [
        {
          id: 'documents', label: 'Documents', icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
          )
        },
        {
          id: 'profile', label: 'Profile', icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          )
        }
      ]
    }
  ];

  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="dashboard-sidebar-header">
          <svg width="28" height="28" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0H12L24 12V20L12 8H0V0Z" fill="#0077ff" />
            <path d="M0 12H12L24 24V32L12 20H0V12Z" fill="#0077ff" fillOpacity="0.7" />
          </svg>
          <span className="dashboard-brand-name">MyPartner</span>
        </div>
        <nav className="dashboard-nav">
          {navigationGroups.map(group => (
            <div key={group.title} className="nav-group">
              <h3 className="nav-group-title">{group.title}</h3>
              <div className="nav-group-list">
                {group.items.map(item => (
                  <a
                    key={item.id}
                    href="#"
                    className={`dashboard-nav-item ${activeTab === item.id ? 'active' : ''}`}
                    onClick={(e) => { e.preventDefault(); setActiveTab(item.id); }}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </nav>
        <div className="dashboard-sidebar-footer">
          <button className="logout-btn" onClick={() => { navigate('/login'); localStorage.removeItem('onboardingScreen'); }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>
      <main className="dashboard-main">
        <div className="dashboard-content no-header">
          {activeTab === 'dashboard' && (
            <>
              <div className="dashboard-welcome-card">
                <h2>Welcome to your Dashboard!</h2>
                <p>Everything you need to manage your business in one place.</p>
              </div>
              <div className="dashboard-grid">
                <div className="dashboard-stats-card">Stats coming soon...</div>
                <div className="dashboard-stats-card">Recent Activity...</div>
              </div>
            </>
          )}
          {activeTab === 'tickets' && <Tickets />}
          {activeTab === 'documents' && <Documents />}
          {activeTab === 'service-settings' && <ServiceSettings />}
          {activeTab === 'profile' && <VendorProfile />}
          {!['dashboard', 'tickets', 'documents', 'service-settings', 'profile'].includes(activeTab) && (
            <div className="placeholder-screen">
              <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ')}</h2>
              <p>This screen is coming soon.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const SuccessPage = ({ onBackToHome }: { onBackToHome: () => void }) => (
  <div className="success-screen">
    <div className="success-card">
      <div className="success-icon-wrapper">
        <svg className="success-tick" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
          <circle cx="26" cy="26" r="26" fill="#22c55e" />
          <path fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" d="M14 27l8 8 16-16" />
        </svg>
      </div>
      <h2 className="success-title">Submission Successful!</h2>
      <p className="success-message">
        Our team will review your documents, and your account will be activated within <strong>12–48 hours</strong>.
      </p>
      <button
        className="btn btn-primary-blue success-home-btn"
        onClick={onBackToHome}
      >
        Back to Home
      </button>
    </div>
  </div>
);

const SignupPage = ({ mobile, handleMobileChange, handleSendOtp, isTimerActive, timer, hasSentOtp, otp, setOtp, navigate }: any) => (
  <AuthLayout currentScreen="signup">
    <div className="login-form-header">
      <h1 className="login-form-title">Create Account</h1>
      <p className="login-form-subtitle">Enter your details to get started</p>
    </div>

    <form onSubmit={(e) => { e.preventDefault(); navigate('/onboarding'); }} className="login-form">
      <div className="form-group">
        <label className="input-label" htmlFor="signupMobile">Mobile Number</label>
        <div className="input-group-with-icon">
          <input
            type="tel"
            id="signupMobile"
            className="input-field"
            placeholder="Enter 10-digit mobile"
            value={mobile}
            onChange={handleMobileChange}
            maxLength={10}
          />
          <button
            type="button"
            className={`otp-inside-btn ${(mobile.length !== 10 || isTimerActive) ? 'disabled' : ''}`}
            onClick={handleSendOtp}
            disabled={mobile.length !== 10 || isTimerActive}
          >
            {isTimerActive ? `0:${timer < 10 ? '0' : ''}${timer}` : hasSentOtp ? 'Resend' : 'Send'}
          </button>
        </div>
      </div>

      <div className="form-group">
        <label className="input-label" htmlFor="signupOtp">OTP</label>
        <input
          type="text"
          id="signupOtp"
          className="input-field"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
          maxLength={6}
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary-blue login-submit-btn"
        disabled={mobile.length !== 10 || otp.length !== 6}
      >
        Create Account
      </button>

      <p className="signup-agreement-text">
        By clicking you agree to our <a href="#">Terms & Conditions</a> and <a href="#">Privacy Policy</a>
      </p>
    </form>
    <div className="login-card-footer">
      <p className="login-register-text">
        Already have an account?{' '}
        <Link to="/login" className="create-account-link">Login</Link>
      </p>
    </div>
  </AuthLayout>
);

const LoginPage = ({ loginId, setLoginId, loginPassword, setLoginPassword, showLoginPassword, setShowLoginPassword, navigate }: any) => (
  <AuthLayout currentScreen="login">
    <div className="login-form-header">
      <h1 className="login-form-title">Welcome back</h1>
      <p className="login-form-subtitle">Sign in to your partner account</p>
    </div>

    <form onSubmit={(e) => { e.preventDefault(); navigate('/dashboard'); }} className="login-form">
      <div className="form-group">
        <label className="input-label" htmlFor="loginId">Mobile Number / Email ID / Partner ID</label>
        <input
          type="text"
          id="loginId"
          className="input-field"
          placeholder="Enter mobile, email or partner ID"
          value={loginId}
          onChange={(e) => setLoginId(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="input-label" htmlFor="loginPassword">Password</label>
        <div className="input-group-with-icon">
          <input
            type={showLoginPassword ? 'text' : 'password'}
            id="loginPassword"
            className="input-field"
            placeholder="Enter your password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
          />
          <button
            type="button"
            className="password-toggle-btn"
            onClick={() => setShowLoginPassword(!showLoginPassword)}
          >
            {showLoginPassword ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
        <div className="forgot-password-wrap">
          <a href="#" className="forgot-password-link">Forgot password?</a>
        </div>
      </div>

      <button
        type="submit"
        className={`btn btn-primary-blue login-submit-btn ${(!loginId.trim() || !loginPassword.trim()) ? 'disabled' : ''}`}
        disabled={!loginId.trim() || !loginPassword.trim()}
      >
        Login
      </button>
    </form>
    <div className="login-card-footer">
      <p className="login-register-text">
        Don't have an account?{' '}
        <Link to="/signup" className="create-account-link">Create Account</Link>
      </p>
    </div>
  </AuthLayout>
);

const OnboardingPage = ({ currentStep, formData, handleInputChange, handleFileChange, handleRemoveFile, prevStep, nextStep, submitFinal, navigate, showPassword, setShowPassword, showConfirmPassword, setShowConfirmPassword }: any) => (
  <div className="onboarding-layout">
    <div className="onboarding-sidebar">
      <div className="onboarding-logo-container">
        <div className="onboarding-logo">
          <svg width="24" height="24" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0H12L24 12V20L12 8H0V0Z" fill="#0077ff" />
            <path d="M0 12H12L24 24V32L12 20H0V12Z" fill="#0077ff" fillOpacity="0.7" />
          </svg>
        </div>
        <span className="onboarding-logo-text">MyPartner</span>
      </div>

      <StepIndicator currentStep={currentStep} />

      <div className="sidebar-footer">
        <p>Already have an account? <span className="login-link" onClick={() => navigate('/login')}>Login</span></p>
      </div>
    </div>

    <div className="onboarding-main-column">
      <div className="mobile-only-header">
        <div className="mobile-header-top">
          <div className="mobile-header-left">
            <div className="mobile-logo">
              <svg width="20" height="20" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0H12L24 12V20L12 8H0V0Z" fill="#0077ff" />
                <path d="M0 12H12L24 24V32L12 20H0V12Z" fill="#0077ff" fillOpacity="0.7" />
              </svg>
            </div>
            <span className="mobile-brand-name">MyPartner</span>
          </div>
          <button className="mobile-login-btn" onClick={() => navigate('/login')}>Login</button>
        </div>
        <div className="mobile-header-progress-line"></div>
        <div className="mobile-only mobile-step-progress-row">
          {[1, 2, 3, 4, 5].map((s, index) => (
            <div key={s} className="mobile-step-pill-wrapper">
              <div className={`mobile-step-circle ${currentStep === s ? 'active' : currentStep > s ? 'completed' : ''}`}>
                {s}
              </div>
              {index < 4 && (
                <div className={`mobile-step-connecting-line ${currentStep > s ? 'active' : ''}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={`onboarding-content-card ${currentStep === 2 ? 'wide-layout' : ''}`}>
        {currentStep === 1 && <Step1 formData={formData} handleInputChange={handleInputChange} handleFileChange={handleFileChange} handleRemoveFile={handleRemoveFile} showPassword={showPassword} setShowPassword={setShowPassword} showConfirmPassword={showConfirmPassword} setShowConfirmPassword={setShowConfirmPassword} />}
        {currentStep === 2 && <Step2 formData={formData} handleInputChange={handleInputChange} handleFileChange={handleFileChange} handleRemoveFile={handleRemoveFile} />}
        {currentStep === 3 && <Step3 formData={formData} handleInputChange={handleInputChange} handleFileChange={handleFileChange} handleRemoveFile={handleRemoveFile} />}
        {currentStep === 4 && <Step4 formData={formData} handleInputChange={handleInputChange} handleFileChange={handleFileChange} handleRemoveFile={handleRemoveFile} />}
        {currentStep === 5 && <Step5 formData={formData} handleInputChange={handleInputChange} handleFileChange={handleFileChange} handleRemoveFile={handleRemoveFile} />}
      </div>

      <div className="onboarding-actions-bottom">
        <div className="onboarding-actions-wrapper">
          {currentStep > 1 && (
            <button
              className="btn btn-secondary-gray btn-wide"
              onClick={prevStep}>
              Back
            </button>
          )}

          {currentStep < 5 ? (
            <button className="btn btn-primary-blue btn-wide" onClick={nextStep}>
              Next
            </button>
          ) : (
            <button
              className={`btn btn-primary-blue btn-wide ${!formData.partnershipAgreed ? 'disabled' : ''}`}
              onClick={submitFinal}
              disabled={!formData.partnershipAgreed}>
              Create Account
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
);

function App() {
  const navigate = useNavigate();

  // Create Account (Signup) State
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [hasSentOtp, setHasSentOtp] = useState(false);

  // Login State
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Password visibility toggles for onboarding Step 1
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Screen & Step State
  const [currentScreen, setCurrentScreen] = useState<'login' | 'signup' | 'onboarding' | 'success' | 'dashboard'>(() => {
    const savedScreen = localStorage.getItem('onboardingScreen');
    return (savedScreen as 'login' | 'signup' | 'onboarding' | 'success' | 'dashboard') || 'login';
  });
  const [currentStep, setCurrentStep] = useState(1);

  // Onboarding Form State
  const [formData, setFormData] = useState<FormData>(() => {
    const savedData = localStorage.getItem('onboardingFormData');
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (e) {
        console.error("Failed to parse saved form data", e);
      }
    }
    return {
      // Step 1
      ownerName: '',
      companyEmail: '',
      password: '',
      confirmPassword: '',
      // Step 2
      businessService: '',
      displayName: '',
      businessLocation: '',
      houseNo: '',
      areaStreet: '',
      pincode: '',
      city: '',
      state: '',
      // Step 3
      panNumber: '',
      panName: '',
      gstRegistered: 'No',
      gstNumber: '',
      fssaiNumber: '',
      fssaiExpiry: '',
      // Step 4
      bankName: '',
      accountType: '',
      accountHolderName: '',
      accountNumber: '',
      confirmAccountNumber: '',
      ifscCode: '',
      // Step 5
      partnershipAgreed: false,
    };
  });

  // Persist State Changes
  useEffect(() => {
    localStorage.setItem('onboardingScreen', currentScreen);
  }, [currentScreen]);

  useEffect(() => {
    localStorage.setItem('onboardingFormData', JSON.stringify(formData));
  }, [formData]);

  // Signup (Create Account) Logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer]);

  const handleSendOtp = () => {
    if (mobile.length === 10) {
      setTimer(59);
      setIsTimerActive(true);
      setHasSentOtp(true);
    }
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length <= 10) {
      setMobile(val);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    // @ts-ignore
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      };

      // Auto-fetch City and State based on Pin-code
      if (name === 'pincode' && value.length === 6) {
        // Mock data for demonstration
        if (value.startsWith('560')) {
          newData.city = 'Bengaluru';
          newData.state = 'Karnataka';
        } else if (value.startsWith('110')) {
          newData.city = 'New Delhi';
          newData.state = 'Delhi';
        } else if (value.startsWith('400')) {
          newData.city = 'Mumbai';
          newData.state = 'Maharashtra';
        } else if (value.startsWith('600')) {
          newData.city = 'Chennai';
          newData.state = 'Tamil Nadu';
        } else if (value.startsWith('700')) {
          newData.city = 'Kolkata';
          newData.state = 'West Bengal';
        }
      }

      return newData;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof FormData) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        [fieldName]: file.name
      }));
    }
  };

  const handleRemoveFile = (fieldName: keyof FormData) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: ''
    }));
  };

  // Scroll to top on every step change — runs AFTER re-render
  useEffect(() => {
    const mainCol = document.querySelector('.onboarding-main-column');
    if (mainCol) mainCol.scrollTop = 0;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const submitFinal = () => {
    console.log('Final Submission Data:', formData);
    // Clear persisted data upon success
    localStorage.removeItem('onboardingScreen');
    localStorage.removeItem('onboardingStep');
    localStorage.removeItem('onboardingFormData');
    setCurrentScreen('success');
  };
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage loginId={loginId} setLoginId={setLoginId} loginPassword={loginPassword} setLoginPassword={setLoginPassword} showLoginPassword={showLoginPassword} setShowLoginPassword={setShowLoginPassword} navigate={navigate} setCurrentScreen={setCurrentScreen} />} />
      <Route path="/signup" element={<SignupPage mobile={mobile} handleMobileChange={handleMobileChange} handleSendOtp={handleSendOtp} isTimerActive={isTimerActive} timer={timer} hasSentOtp={hasSentOtp} otp={otp} setOtp={setOtp} navigate={navigate} />} />
      <Route path="/onboarding" element={<OnboardingPage currentStep={currentStep} formData={formData} handleInputChange={handleInputChange} handleFileChange={handleFileChange} handleRemoveFile={handleRemoveFile} prevStep={prevStep} nextStep={nextStep} submitFinal={submitFinal} navigate={navigate} setCurrentScreen={setCurrentScreen} showPassword={showPassword} setShowPassword={setShowPassword} showConfirmPassword={showConfirmPassword} setShowConfirmPassword={setShowConfirmPassword} />} />
      <Route path="/dashboard" element={<Dashboard navigate={navigate} />} />
      <Route path="/success" element={<SuccessPage onBackToHome={() => { navigate('/login'); setCurrentStep(1); setIsTimerActive(false); setTimer(59); setHasSentOtp(false); }} />} />
    </Routes>
  );

}

export default App;
