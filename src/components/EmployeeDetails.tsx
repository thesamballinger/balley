import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaPhone, FaCalendarAlt, FaIdCard, FaMapMarkerAlt, FaInfoCircle, FaEdit, FaSave, FaTimes, FaUniversity, FaDollarSign, FaCheckCircle, FaTimesCircle, FaExclamationCircle, FaBuilding, FaBriefcase } from 'react-icons/fa';
import { Employee } from '../types/Employee';
import Tooltip from './Tooltip';
import '../styles/components/EmployeeDetails.css';

interface EmployeeDetailsProps {
  employee: Employee;
  onSave: (id: string, updatedEmployee: Partial<Employee>) => void;
}

const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({ employee, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [displayData, setDisplayData] = useState<Employee>(employee);

  // Update local state when employee prop changes
  useEffect(() => {
    setDisplayData(employee);
  }, [employee]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDisplayData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNestedInputChange = (category: string, field: string, value: any) => {
    setDisplayData(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    if (employee.id) {
      onSave(employee.id, displayData);
      setIsEditing(false);
    } else {
      console.error('Cannot save: Employee ID is missing');
    }
  };

  const handleCancel = () => {
    setDisplayData(employee);
    setIsEditing(false);
  };

  // Generate background color based on name (for consistency with cards)
  const getBackgroundColor = (name: string) => {
    const colors = ['#ff9999', '#99ccff', '#99ff99', '#ffcc99', '#cc99ff', '#ff99cc'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const formatPayRate = () => {
    if (!displayData.payRate) {
      // Check if we have earning rates data but no mapped payRate
      if (displayData.earningRates && displayData.earningRates.length > 0) {
        const rate = displayData.earningRates[0];
        const amount = rate.amount || 0;
        const period = rate.period === 'hourly' ? 'hour' : 'year';
        
        if (period === 'hour') {
          return `$${amount} / hour`;
        } else {
          return `$${amount.toLocaleString()} / year`;
        }
      }
      
      return 'Pay rate not set';
    }
    
    if (displayData.payRateType === 'hour') {
      return `$${displayData.payRate} / hour`;
    } else {
      return `$${Number(displayData.payRate).toLocaleString()} / year`;
    }
  };

  // Render SSN validation status
  const renderSsnValidationStatus = () => {
    if (!displayData.ssn_validation_status) return null;
    
    let icon = <FaInfoCircle />;
    let statusText = 'Unknown';
    let statusClass = 'status-unknown';
    
    switch (displayData.ssn_validation_status) {
      case 'valid':
        icon = <FaCheckCircle className="status-valid" />;
        statusText = 'Valid';
        statusClass = 'status-valid';
        break;
      case 'invalid':
        icon = <FaTimesCircle className="status-invalid" />;
        statusText = 'Invalid';
        statusClass = 'status-invalid';
        break;
      case 'pending':
        icon = <FaExclamationCircle className="status-pending" />;
        statusText = 'Pending';
        statusClass = 'status-pending';
        break;
    }
    
    return (
      <span className={`ssn-validation ${statusClass}`} title={`SSN Validation: ${statusText}`}>
        {icon} {statusText}
      </span>
    );
  };

  // Render onboarding status
  const renderOnboardingStatus = () => {
    if (!displayData.onboard) return null;
    
    const status = displayData.onboard.status;
    const remainingSteps = displayData.onboard.remaining_steps?.length || 0;
    
    let statusClass = 'status-unknown';
    let statusText = 'Unknown';
    
    switch (status) {
      case 'complete':
        statusClass = 'status-complete';
        statusText = 'Complete';
        break;
      case 'in_progress':
        statusClass = 'status-in-progress';
        statusText = 'In Progress';
        break;
      case 'blocked':
        statusClass = 'status-blocked';
        statusText = 'Blocked';
        break;
    }
    
    return (
      <div className={`onboarding-status ${statusClass}`}>
        {statusText}
        {remainingSteps > 0 && (
          <span className="remaining-steps">
            ({remainingSteps} steps remaining)
          </span>
        )}
      </div>
    );
  };

  // Enhanced version that shows specific steps
  const renderRemainingSteps = () => {
    if (!displayData.onboard?.remaining_steps?.length) return null;
    
    return (
      <div className="remaining-steps-details">
        <h4>Remaining Steps:</h4>
        <ul>
          {displayData.onboard.remaining_steps.map((step, index) => (
            <li key={index}>
              {formatStepName(step)}
              {displayData.onboard?.blocking_steps?.includes(step) && 
                <span className="blocking-step-indicator"> (blocking)</span>
              }
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // Helper to format step names for display
  const formatStepName = (stepId: string) => {
    const stepNames: Record<string, string> = {
      'ssn': 'Provide Social Security Number',
      'federal_tax_withholding': 'Set up Federal Tax Withholding',
      'state_tax_withholding': 'Set up State Tax Withholding',
      'bank_account': 'Add Bank Account Details',
      'i9': 'Complete I-9 Verification',
      // Add other step mappings as needed
    };
    
    return stepNames[stepId] || stepId.replace(/_/g, ' ');
  };

  if (!displayData) return null;

  return (
    <div className="employee-details-card">
      {/* Header with avatar and name */}
      <div className="employee-details-header" style={{ backgroundColor: getBackgroundColor(displayData.name || 'Unknown') }}>
        <img
          src={displayData.avatar || `https://api.dicebear.com/7.x/personas/svg?seed=${displayData.name}`}
          alt={`${displayData.name || 'Employee'} avatar`}
          className="employee-details-avatar"
        />
        <div className="employee-details-name-container">
          <h2 className="employee-details-name">{displayData.name || 'Unnamed Employee'}</h2>
          <p className="employee-details-role">{displayData.role || 'No role specified'}</p>
          {displayData.active === false && <span className="employee-status-inactive">Inactive</span>}
        </div>
        <div className="employee-details-actions">
          {isEditing ? (
            <>
              <button className="action-button save-button" onClick={handleSave}>
                <FaSave /> Save
              </button>
              <button className="action-button cancel-button" onClick={handleCancel}>
                <FaTimes /> Cancel
              </button>
            </>
          ) : (
            <button className="action-button edit-button" onClick={() => setIsEditing(true)}>
              <FaEdit /> Edit
            </button>
          )}
        </div>
      </div>

      {/* Onboarding status section */}
      {displayData.onboard && (
        <div className="details-section onboarding-section">
          <h3 className="details-section-title">Onboarding Status</h3>
          {renderOnboardingStatus()}
          {renderRemainingSteps()}
          {displayData.onboard.blocking_steps?.length > 0 && (
            <div className="blocking-steps">
              <h4>Blocking Steps:</h4>
              <ul>
                {displayData.onboard.blocking_steps.map((step, index) => (
                  <li key={index}>{step.replace(/_/g, ' ')}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Personal information section */}
      <div className="details-section">
        <h3 className="details-section-title">Personal Information</h3>
        <div className="details-grid">
          {/* Email */}
          <div className="details-item">
            <div className="details-icon"><FaEnvelope /></div>
            <div className="details-text">
              <span className="details-label">Email</span>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={displayData.email || ''}
                  onChange={handleInputChange}
                  className="details-input"
                  placeholder="Email address"
                />
              ) : (
                <span className="details-value">{displayData.email || 'No email provided'}</span>
              )}
            </div>
          </div>
          
          {/* Phone */}
          <div className="details-item">
            <div className="details-icon"><FaPhone /></div>
            <div className="details-text">
              <span className="details-label">Phone</span>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={displayData.phone || ''}
                  onChange={handleInputChange}
                  className="details-input"
                  placeholder="Phone number"
                />
              ) : (
                <span className="details-value">{displayData.phone || 'No phone provided'}</span>
              )}
            </div>
          </div>
          
          {/* Birthdate */}
          <div className="details-item">
            <div className="details-icon"><FaCalendarAlt /></div>
            <div className="details-text">
              <span className="details-label">Birthdate</span>
              {isEditing ? (
                <input
                  type="date"
                  name="birthdate"
                  value={displayData.birthdate || ''}
                  onChange={handleInputChange}
                  className="details-input"
                />
              ) : (
                <span className="details-value">
                  {displayData.birthdate ? new Date(displayData.birthdate).toLocaleDateString() : 'Not provided'}
                </span>
              )}
            </div>
          </div>
          
          {/* SSN Last 4 */}
          <div className="details-item">
            <div className="details-icon"><FaIdCard /></div>
            <div className="details-text">
              <span className="details-label">SSN Last 4</span>
              {isEditing ? (
                <input
                  type="text"
                  name="ssnLast4"
                  value={displayData.ssnLast4 || ''}
                  onChange={handleInputChange}
                  className="details-input"
                  placeholder="Last 4 digits of SSN"
                  maxLength={4}
                  pattern="[0-9]{4}"
                />
              ) : (
                <span className="details-value">
                  {displayData.ssnLast4 ? `***-**-${displayData.ssnLast4}` : 'Not provided'}
                  {renderSsnValidationStatus()}
                </span>
              )}
            </div>
          </div>
          
          {/* Address */}
          <div className="details-item">
            <div className="details-icon"><FaMapMarkerAlt /></div>
            <div className="details-text">
              <span className="details-label">Address</span>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={displayData.address || ''}
                  onChange={handleInputChange}
                  className="details-input"
                  placeholder="Full address"
                />
              ) : (
                <span className="details-value">{displayData.address || 'No address provided'}</span>
              )}
            </div>
          </div>
          
          {/* Workplace */}
          {displayData.primary_workplace && (
            <div className="details-item">
              <div className="details-icon"><FaBuilding /></div>
              <div className="details-text">
                <span className="details-label">Primary Workplace</span>
                <span className="details-value">{displayData.primary_workplace}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Employment information section */}
      <div className="details-section">
        <h3 className="details-section-title">Employment Information</h3>
        <div className="details-grid">
          {/* Role */}
          <div className="details-item">
            <div className="details-icon"><FaBriefcase /></div>
            <div className="details-text">
              <span className="details-label">Role</span>
              {isEditing ? (
                <input
                  type="text"
                  name="role"
                  value={displayData.role || ''}
                  onChange={handleInputChange}
                  className="details-input"
                  placeholder="Job title"
                />
              ) : (
                <span className="details-value">{displayData.role || 'Not specified'}</span>
              )}
            </div>
          </div>
          
          {/* Employment Type */}
          <div className="details-item">
            <div className="details-icon"><FaIdCard /></div>
            <div className="details-text">
              <span className="details-label">Employment Type</span>
              {isEditing ? (
                <select
                  name="employmentType"
                  value={displayData.employmentType || 'Employee (W2)'}
                  onChange={handleInputChange}
                  className="details-input"
                >
                  <option value="Employee (W2)">Employee (W2)</option>
                  <option value="Contractor (1099)">Contractor (1099)</option>
                </select>
              ) : (
                <span className="details-value">{displayData.employmentType || 'Employee (W2)'}</span>
              )}
            </div>
          </div>
          
          {/* Pay Rate */}
          <div className="details-item">
            <div className="details-icon"><FaDollarSign /></div>
            <div className="details-text">
              <span className="details-label">Pay Rate</span>
              {isEditing ? (
                <div className="pay-rate-input-group">
                  <input
                    type="number"
                    name="payRate"
                    value={displayData.payRate || ''}
                    onChange={handleInputChange}
                    className="details-input pay-rate-input"
                    placeholder="Amount"
                    min="0"
                    step="0.01"
                  />
                  <select
                    name="payRateType"
                    value={displayData.payRateType || 'hour'}
                    onChange={handleInputChange}
                    className="details-input"
                  >
                    <option value="hour">per hour</option>
                    <option value="year">per year</option>
                  </select>
                </div>
              ) : (
                <span className="details-value">
                  {formatPayRate()}
                </span>
              )}
            </div>
          </div>
          
          {/* Bank Name */}
          <div className="details-item">
            <div className="details-icon"><FaUniversity /></div>
            <div className="details-text">
              <span className="details-label">Bank</span>
              {isEditing ? (
                <input
                  type="text"
                  value={displayData.paymentMethod?.bankName || ''}
                  onChange={(e) => handleNestedInputChange('paymentMethod', 'bankName', e.target.value)}
                  className="details-input"
                  placeholder="Bank name"
                />
              ) : (
                <span className="details-value">
                  {displayData.paymentMethod?.bankName || 'No bank information'}
                </span>
              )}
            </div>
          </div>
          
          {/* Account Last 4 */}
          <div className="details-item">
            <div className="details-icon"><FaIdCard /></div>
            <div className="details-text">
              <span className="details-label">Account</span>
              {isEditing ? (
                <input
                  type="text"
                  value={displayData.paymentMethod?.accountLast4 || ''}
                  onChange={(e) => handleNestedInputChange('paymentMethod', 'accountLast4', e.target.value)}
                  className="details-input"
                  placeholder="Last 4 digits"
                  maxLength={4}
                  pattern="[0-9]{4}"
                />
              ) : (
                <span className="details-value">
                  {displayData.paymentMethod?.accountLast4 
                    ? `****${displayData.paymentMethod.accountLast4}` 
                    : 'No account information'}
                </span>
              )}
            </div>
          </div>
          
          {/* Pay Frequency */}
          <div className="details-item">
            <div className="details-icon"><FaCalendarAlt /></div>
            <div className="details-text">
              <span className="details-label">Pay Frequency</span>
              {isEditing ? (
                <select
                  value={displayData.paymentMethod?.payFrequency || 'Bi-weekly payouts'}
                  onChange={(e) => handleNestedInputChange('paymentMethod', 'payFrequency', e.target.value)}
                  className="details-input"
                >
                  <option value="Weekly payouts">Weekly</option>
                  <option value="Bi-weekly payouts">Bi-weekly</option>
                  <option value="Monthly payouts">Monthly</option>
                </select>
              ) : (
                <span className="details-value">
                  {displayData.paymentMethod?.payFrequency || 'Not specified'}
                </span>
              )}
            </div>
          </div>
          
          {/* W2 Electronic Consent */}
          {displayData.w2_electronic_consent_provided !== undefined && (
            <div className="details-item">
              <div className="details-icon"><FaIdCard /></div>
              <div className="details-text">
                <span className="details-label">W2 Electronic Consent</span>
                <span className="details-value">
                  {displayData.w2_electronic_consent_provided ? 'Provided' : 'Not provided'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
