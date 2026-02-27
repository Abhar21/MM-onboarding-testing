import { useState, useEffect } from 'react';
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

function App() {
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
  const [currentScreen, setCurrentScreen] = useState<'login' | 'signup' | 'onboarding' | 'success'>(() => {
    const savedScreen = localStorage.getItem('onboardingScreen');
    return (savedScreen as 'login' | 'signup' | 'onboarding' | 'success') || 'login';
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

  const renderStepIndicator = () => {
    const stepsData = [
      { id: 1, title: 'Owner Details', subtitle: 'Enter your personal information' },
      { id: 2, title: 'Business Details', subtitle: 'Tell us about your business' },
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

  const renderStep1 = () => (
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
            onClick={() => setShowPassword(!showPassword)}
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
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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

  const renderStep2 = () => (
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

  const renderStep3 = () => (
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

  const renderStep4 = () => (
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

  const renderStep5 = () => (
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

  if (currentScreen === 'success') {
    return (
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
            onClick={() => {
              setCurrentScreen('login');
              setCurrentStep(1);
              setIsTimerActive(false);
              setTimer(59);
              setHasSentOtp(false);
            }}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (currentScreen === 'onboarding') {
    return (
      <div className="onboarding-full-layout">
        {/* Left Side: Sidebar */}
        <div className="onboarding-sidebar-column">
          <div className="onboarding-sidebar-header">
            {/* Main Brand Logo & Name (Shown on both or just desktop sidebar) */}
            <div className="onboarding-brand-group">
              <svg width="28" height="28" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0H12L24 12V20L12 8H0V0Z" fill="#0077ff" />
                <path d="M0 12H12L24 24V32L12 20H0V12Z" fill="#0077ff" fillOpacity="0.7" />
              </svg>
              <div className="onboarding-brand-text">
                <span className="onboarding-brand-name">MyPartner</span>
              </div>
            </div>
          </div>

          <div className="onboarding-sidebar-content desktop-only">
            {renderStepIndicator()}
          </div>

          {/* Mobile Top Header: Brand (Left) & Login (Right) */}
          <div className="mobile-only mobile-top-nav">
            <div className="onboarding-brand-group mobile-branding">
              <svg width="22" height="22" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0H12L24 12V20L12 8H0V0Z" fill="#0077ff" />
                <path d="M0 12H12L24 24V32L12 20H0V12Z" fill="#0077ff" fillOpacity="0.7" />
              </svg>
              <span className="onboarding-brand-name mobile-brand-name">MyPartner</span>
            </div>
            <div className="mobile-login-link-container">
              <a href="#" className="mobile-login-btn" onClick={(e) => { e.preventDefault(); setCurrentScreen('login'); }}>
                Login
              </a>
            </div>
          </div>

          <div className="sidebar-login-footer desktop-only">
            <span className="sidebar-login-text">
              Already have an account?{' '}
              <a href="#" onClick={(e) => { e.preventDefault(); setCurrentScreen('login'); }}>Login</a>
            </span>
          </div>
        </div>

        {/* Right Side: Main Form */}
        <div className="onboarding-main-column">
          <div className={`onboarding-main-content ${currentStep === 2 ? 'wide' : ''}`}>
            {/* Mobile-only Step Numbers below the header line */}
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

            <div className="onboarding-step-form-area">
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
              {currentStep === 4 && renderStep4()}
              {currentStep === 5 && renderStep5()}
            </div>

            <div className="onboarding-actions-bottom">
              <div className="onboarding-actions-wrapper">
                <button
                  className="btn btn-secondary-gray btn-wide"
                  onClick={prevStep}
                  style={{ visibility: currentStep === 1 ? 'hidden' : 'visible' }}>
                  Back
                </button>

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
      </div>
    );
  }

  const renderAuthLayout = (children: React.ReactNode) => (
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

  if (currentScreen === 'signup') {
    return renderAuthLayout(
      <>
        <div className="login-form-header">
          <h1 className="login-form-title">Create Account</h1>
          <p className="login-form-subtitle">Enter your details to get started</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); setCurrentScreen('onboarding'); }} className="login-form">
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
        <div className="login-footer-text-wrap">
          <p className="login-register-text">
            Already have an account?{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); setCurrentScreen('login'); }}>Login</a>
          </p>
        </div>
      </>
    );
  }

  // Default: Login screen
  return renderAuthLayout(
    <>
      <div className="login-form-header">
        <h1 className="login-form-title">Welcome back</h1>
        <p className="login-form-subtitle">Sign in to your partner account</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); setCurrentScreen('onboarding'); }} className="login-form">
        <div className="form-group">
          <label className="input-label" htmlFor="loginId">Mobile Number / Email ID / Partner ID</label>
          <input
            type="text"
            id="loginId"
            className="input-field"
            placeholder="Enter mobile, email or partner ID"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            autoComplete="username"
          />
        </div>

        <div className="form-group">
          <div className="login-label-row">
            <label className="input-label" htmlFor="loginPassword">Password</label>
          </div>
          <div className="input-group-with-icon">
            <input
              type={showLoginPassword ? 'text' : 'password'}
              id="loginPassword"
              className="input-field"
              placeholder="Enter your password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowLoginPassword(p => !p)}
              tabIndex={-1}
            >
              {showLoginPassword ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          <div className="forgot-password-container">
            <a href="#" className="forgot-password-link">Forgot password?</a>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary-blue login-submit-btn"
          disabled={!loginId.trim() || !loginPassword.trim()}
        >
          Login
        </button>
      </form>
      <div className="login-footer-text-wrap">
        <p className="login-register-text">
          Don't have an account?{' '}
          <a href="#" onClick={(e) => { e.preventDefault(); setCurrentScreen('signup'); }}>Create Account</a>
        </p>
      </div>
    </>
  );
}

export default App;
