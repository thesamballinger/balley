import React, { useState } from 'react';
import { Employee } from '../types/Employee.ts';
import { FaEdit, FaSave, FaTimes, FaEnvelope, FaPhone, FaCalendarAlt, 
  FaIdCard, FaHome, FaUser, FaDollarSign, FaUniversity, FaInfoCircle,
  FaFileAlt, FaPercentage, FaUsers, FaMoneyBillWave } from 'react-icons/fa';
import Tooltip from './Tooltip.tsx';
import '../styles/components/EmployeeDetails.css';

interface EmployeeDetailsProps {
  employee: Employee;
  onSave: (id: string, updatedEmployee: Partial<Employee>) => void;
}

const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({ employee, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [displayData, setDisplayData] = useState<Employee>(employee);

  // Update local state when employee prop changes
  React.useEffect(() => {
    setDisplayData(employee);
  }, [employee]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        ...prev[category as keyof Employee],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    onSave(employee.id as string, displayData);
    setIsEditing(false);
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
    if (displayData.payRateType === 'hour') {
      return `$${displayData.payRate}/hour`;
    } else {
      return `$${displayData.payRate.toLocaleString()}/year`;
    }
  };

  if (!displayData) return null;

  return (
    <div className="employee-details-card">
      {/* Header with avatar and name */}
      <div className="employee-details-header" style={{ backgroundColor: getBackgroundColor(displayData.name) }}>
        <img
          src={displayData.avatar || `https://api.dicebear.com/7.x/personas/svg?seed=${displayData.name}`}
          alt={`${displayData.name} avatar`}
          className="employee-details-avatar"
        />
        <div className="employee-details-title">
          <h2>{displayData.name}</h2>
          <p>{displayData.role} • {displayData.employmentType}</p>
        </div>
        
        {/* Edit/Save buttons */}
        <div className="employee-details-actions">
          {isEditing ? (
            <>
              <button onClick={handleSave} className="save-button">
                <FaSave /> Save
              </button>
              <button onClick={handleCancel} className="cancel-button">
                <FaTimes /> Cancel
              </button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} className="edit-button">
              <FaEdit /> Edit
            </button>
          )}
        </div>
      </div>

      {/* Contact Information */}
      <div className="details-section">
        <h3 className="section-title">
          Contact
          <Tooltip content="Employee's contact information">
            <FaInfoCircle className="info-icon" />
          </Tooltip>
        </h3>
        <div className="details-row">
          <div className="details-icon"><FaEnvelope /></div>
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
            <p>{displayData.email || 'No email provided'}</p>
          )}
        </div>
        <div className="details-row">
          <div className="details-icon"><FaPhone /></div>
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
            <p>{displayData.phone || 'No phone provided'}</p>
          )}
        </div>
      </div>

      {/* Employee Information */}
      <div className="details-section">
        <h3 className="section-title">
          Employee info
          <Tooltip content="Personal information used for payroll and tax purposes">
            <FaInfoCircle className="info-icon" />
          </Tooltip>
        </h3>
        <div className="details-row">
          <div className="details-icon"><FaUser /></div>
          {isEditing ? (
            <div className="input-group">
              <input
                type="text"
                name="firstName"
                value={displayData.firstName || ''}
                onChange={handleInputChange}
                className="details-input"
                placeholder="First name"
              />
              <input
                type="text"
                name="lastName"
                value={displayData.lastName || ''}
                onChange={handleInputChange}
                className="details-input"
                placeholder="Last name"
              />
            </div>
          ) : (
            <p>{displayData.firstName} {displayData.lastName}</p>
          )}
        </div>
        <div className="details-row">
          <div className="details-icon"><FaCalendarAlt /></div>
          {isEditing ? (
            <input
              type="text"
              name="birthdate"
              value={displayData.birthdate || ''}
              onChange={handleInputChange}
              className="details-input"
              placeholder="Birth date (YYYY-MM-DD)"
            />
          ) : (
            <p>{displayData.birthdate || 'No birthdate provided'}</p>
          )}
        </div>
        <div className="details-row">
          <div className="details-icon"><FaIdCard /></div>
          {isEditing ? (
            <input
              type="text"
              name="ssn"
              value={displayData.ssn || ''}
              onChange={handleInputChange}
              className="details-input"
              placeholder="SSN (only visible during editing)"
            />
          ) : (
            <p>SSN: *** - ** - {displayData.ssnLast4 || '****'}</p>
          )}
        </div>
        <div className="details-row">
          <div className="details-icon"><FaHome /></div>
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
            <p>{displayData.address || 'No address provided'}</p>
          )}
        </div>
      </div>

      {/* Federal Withholdings */}
      <div className="details-section">
        <h3 className="section-title">
          Federal withholdings
          <Tooltip content="Tax withholding information for federal taxes">
            <FaInfoCircle className="info-icon" />
          </Tooltip>
        </h3>
        <div className="details-row">
          <div className="details-icon"><FaFileAlt /></div>
          {isEditing ? (
            <select
              value={displayData.federalWithholdings?.filingStatus || 'Single'}
              onChange={(e) => handleNestedInputChange('federalWithholdings', 'filingStatus', e.target.value)}
              className="details-input"
            >
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Jointly">Jointly</option>
              <option value="Head of household">Head of household</option>
            </select>
          ) : (
            <p>{displayData.federalWithholdings?.filingStatus || 'Single'}</p>
          )}
        </div>
        <div className="details-row">
          <div className="details-icon"><FaUsers /></div>
          {isEditing ? (
            <input
              type="number"
              value={displayData.federalWithholdings?.dependents || 0}
              onChange={(e) => handleNestedInputChange('federalWithholdings', 'dependents', parseInt(e.target.value))}
              className="details-input"
              min="0"
            />
          ) : (
            <p>{displayData.federalWithholdings?.dependents || 0} dependents</p>
          )}
        </div>
        <div className="details-row">
          <div className="details-icon"><FaMoneyBillWave /></div>
          {isEditing ? (
            <div className="input-group">
              <span className="input-prefix">$</span>
              <input
                type="number"
                value={displayData.federalWithholdings?.extraWithholdings || 0}
                onChange={(e) => handleNestedInputChange('federalWithholdings', 'extraWithholdings', parseFloat(e.target.value))}
                className="details-input"
                min="0"
                step="0.01"
              />
            </div>
          ) : (
            <p>Extra withholdings: ${displayData.federalWithholdings?.extraWithholdings || 0}</p>
          )}
        </div>
      </div>

      {/* State Withholdings */}
      <div className="details-section">
        <h3 className="section-title">
          State withholdings
          <Tooltip content="Tax withholding information for state taxes">
            <FaInfoCircle className="info-icon" />
          </Tooltip>
        </h3>
        <div className="details-row">
          <div className="details-icon"><FaFileAlt /></div>
          {isEditing ? (
            <select
              value={displayData.stateWithholdings?.filingStatus || 'Single'}
              onChange={(e) => handleNestedInputChange('stateWithholdings', 'filingStatus', e.target.value)}
              className="details-input"
            >
              <option value="Single">Single</option>
              <option value="Married">Married</option>
            </select>
          ) : (
            <p>{displayData.stateWithholdings?.filingStatus || 'Single'}</p>
          )}
        </div>
        <div className="details-row">
          <div className="details-icon"><FaPercentage /></div>
          {isEditing ? (
            <input
              type="number"
              value={displayData.stateWithholdings?.allowances || 0}
              onChange={(e) => handleNestedInputChange('stateWithholdings', 'allowances', parseInt(e.target.value))}
              className="details-input"
              min="0"
            />
          ) : (
            <p>{displayData.stateWithholdings?.allowances || 0} allowances</p>
          )}
        </div>
        <div className="details-row">
          <div className="details-icon"><FaUsers /></div>
          {isEditing ? (
            <input
              type="number"
              value={displayData.stateWithholdings?.dependents || 0}
              onChange={(e) => handleNestedInputChange('stateWithholdings', 'dependents', parseInt(e.target.value))}
              className="details-input"
              min="0"
            />
          ) : (
            <p>{displayData.stateWithholdings?.dependents || 0} dependents</p>
          )}
        </div>
        <div className="details-row">
          <div className="details-icon"><FaMoneyBillWave /></div>
          {isEditing ? (
            <div className="input-group">
              <span className="input-prefix">$</span>
              <input
                type="number"
                value={displayData.stateWithholdings?.extraWithholdings || 0}
                onChange={(e) => handleNestedInputChange('stateWithholdings', 'extraWithholdings', parseFloat(e.target.value))}
                className="details-input"
                min="0"
                step="0.01"
              />
            </div>
          ) : (
            <p>Extra withholdings: ${displayData.stateWithholdings?.extraWithholdings || 0}</p>
          )}
        </div>
      </div>

      {/* Payment Information */}
      <div className="details-section">
        <h3 className="section-title">
          Payment
          <Tooltip content="Payment method and schedule information">
            <FaInfoCircle className="info-icon" />
          </Tooltip>
        </h3>
        <div className="details-row">
          <div className="details-icon"><FaDollarSign /></div>
          {isEditing ? (
            <div className="input-group">
              <span className="input-prefix">$</span>
              <input
                type="number"
                name="payRate"
                value={displayData.payRate || 0}
                onChange={handleInputChange}
                className="details-input"
                min="0"
                step="0.01"
              />
              <select
                name="payRateType"
                value={displayData.payRateType}
                onChange={handleInputChange}
                className="details-input"
              >
                <option value="hour">per hour</option>
                <option value="year">per year</option>
              </select>
            </div>
          ) : (
            <p>{formatPayRate()}</p>
          )}
        </div>
        <div className="details-row">
          <div className="details-icon"><FaUniversity /></div>
          {isEditing ? (
            <input
              type="text"
              value={displayData.paymentMethod?.bankName || ''}
              onChange={(e) => handleNestedInputChange('paymentMethod', 'bankName', e.target.value)}
              className="details-input"
              placeholder="Bank name"
            />
          ) : (
            <p>{displayData.paymentMethod?.bankName || 'No bank information'}</p>
          )}
        </div>
        <div className="details-row">
          <div className="details-icon"><FaIdCard /></div>
          {isEditing ? (
            <input
              type="text"
              value={displayData.paymentMethod?.accountLast4 || ''}
              onChange={(e) => handleNestedInputChange('paymentMethod', 'accountLast4', e.target.value)}
              className="details-input"
              placeholder="Last 4 digits of account"
              maxLength={4}
            />
          ) : (
            <p>**** {displayData.paymentMethod?.accountLast4 || '0000'}</p>
          )}
        </div>
        <div className="details-row">
          <div className="details-icon"><FaCalendarAlt /></div>
          {isEditing ? (
            <input
              type="text"
              value={displayData.paymentMethod?.payFrequency || ''}
              onChange={(e) => handleNestedInputChange('paymentMethod', 'payFrequency', e.target.value)}
              className="details-input"
              placeholder="Payment frequency"
            />
          ) : (
            <p>{displayData.paymentMethod?.payFrequency || 'No payment schedule'}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
