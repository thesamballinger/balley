import React, { useState } from 'react';
import { Contractor } from './ContractorCard';
import { FaEdit, FaSave, FaTimes, FaEnvelope, FaPhone, FaBuilding, FaIdCard, FaHome, FaDollarSign, FaUniversity } from 'react-icons/fa';

interface ContractorDetailsProps {
  contractor: Contractor;
  onSave: (updatedContractor: Contractor) => void;
}

const ContractorDetails: React.FC<ContractorDetailsProps> = ({ contractor, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [displayData, setDisplayData] = useState<Contractor>(contractor);

  // Update local state when contractor prop changes
  React.useEffect(() => {
    setDisplayData(contractor);
  }, [contractor]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDisplayData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    onSave(displayData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDisplayData(contractor);
    setIsEditing(false);
  };

  // Generate background color based on name (for consistency with cards)
  const getBackgroundColor = (name: string) => {
    const colors = ['#99ff99', '#ffcc99', '#cc99ff', '#ff99cc', '#ff9999', '#99ccff'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  if (!displayData) return null;

  return (
    <div className="contractor-details-card">
      {/* Header with avatar and name */}
      <div className="contractor-details-header" style={{ backgroundColor: getBackgroundColor(displayData.name) }}>
        <img
          src={displayData.avatar || `https://api.dicebear.com/7.x/personas/svg?seed=${displayData.name}`}
          alt={`${displayData.name} avatar`}
          className="contractor-details-avatar"
        />
        <div className="contractor-details-title">
          <h2>{displayData.name}</h2>
          <p>{displayData.role} • Contractor (1099)</p>
        </div>
        
        {/* Edit/Save buttons */}
        <div className="contractor-details-actions">
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

      {/* Contact Info */}
      <div className="details-section">
        <h3>Contact</h3>
        <div className="details-row">
          <div className="details-icon"><FaEnvelope /></div>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={displayData.email || ''}
              onChange={handleInputChange}
              className="details-input"
            />
          ) : (
            <p>{displayData.email}</p>
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
            />
          ) : (
            <p>{displayData.phone}</p>
          )}
        </div>
      </div>

      {/* Company Info */}
      <div className="details-section">
        <h3>Company Information</h3>
        <div className="details-row">
          <div className="details-icon"><FaBuilding /></div>
          {isEditing ? (
            <input
              type="text"
              name="company"
              value={displayData.company || ''}
              onChange={handleInputChange}
              className="details-input"
            />
          ) : (
            <p>{displayData.company}</p>
          )}
        </div>
        <div className="details-row">
          <div className="details-icon"><FaIdCard /></div>
          {isEditing ? (
            <input
              type="text"
              name="taxId"
              value={displayData.taxId || ''}
              onChange={handleInputChange}
              className="details-input"
            />
          ) : (
            <p>Tax ID: {displayData.taxId}</p>
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
            />
          ) : (
            <p>{displayData.address}</p>
          )}
        </div>
      </div>

      {/* Payment Info */}
      <div className="details-section">
        <h3>Payment</h3>
        <div className="details-row">
          <div className="details-icon"><FaDollarSign /></div>
          {isEditing ? (
            <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
              <input
                type="number"
                name="payRate"
                value={displayData.payRate || 0}
                onChange={handleInputChange}
                className="details-input"
                style={{ flex: 1 }}
              />
              <select 
                name="payRateType"
                value={displayData.payRateType}
                onChange={(e) => setDisplayData(prev => ({
                  ...prev,
                  payRateType: e.target.value as 'hour' | 'year'
                }))}
                className="details-input"
                style={{ flex: 1 }}
              >
                <option value="hour">per hour</option>
                <option value="year">per year</option>
              </select>
            </div>
          ) : (
            <p>
              {displayData.payRateType === 'hour' 
                ? `$${displayData.payRate} per hour` 
                : `$${displayData.payRate.toLocaleString()} per year`}
            </p>
          )}
        </div>
        <div className="details-row">
          <div className="details-icon"><FaUniversity /></div>
          <p>{displayData.paymentMethod?.bankName || 'No bank'} Checking</p>
        </div>
        <div className="details-row">
          <div className="details-icon"><FaIdCard /></div>
          <p>**** {displayData.paymentMethod?.accountLast4 || '0000'}</p>
        </div>
      </div>
    </div>
  );
};

export default ContractorDetails;
