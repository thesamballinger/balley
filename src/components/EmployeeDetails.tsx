import React, { useState } from 'react';
import { Employee } from './EmployeeCard';
import { FaEdit, FaSave, FaTimes, FaEnvelope, FaPhone, FaCalendarAlt, FaIdCard, FaHome, FaUser, FaDollarSign, FaUniversity } from 'react-icons/fa';

interface EmployeeDetailsProps {
  employee: Employee;
  onSave: (updatedEmployee: Employee) => void;
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

  const handleSave = () => {
    onSave(displayData);
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

      {/* Employee Info */}
      <div className="details-section">
        <h3>Employee Info</h3>
        <div className="details-row">
          <div className="details-icon"><FaUser /></div>
          <p>Male</p>
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
            />
          ) : (
            <p>{displayData.birthdate}</p>
          )}
        </div>
        <div className="details-row">
          <div className="details-icon"><FaIdCard /></div>
          <p>SSN: *** - ** - {displayData.ssnLast4}</p>
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

      {/* Federal Withholdings */}
      <div className="details-section">
        <h3>Federal Withholdings</h3>
        <div className="details-row">
          <div className="details-icon"><FaUser /></div>
          <p>Married</p>
        </div>
        <div className="details-row">
          <div className="details-icon"><FaUser /></div>
          <p>Jointly</p>
        </div>
        <div className="details-row">
          <div className="details-icon"><FaUser /></div>
          <p>Head of household</p>
        </div>
        <div className="details-row">
          <div className="details-icon"><FaUser /></div>
          <p>0 dependents</p>
        </div>
        <div className="details-row">
          <div className="details-icon"><FaDollarSign /></div>
          <p>Extra withholdings: $0</p>
        </div>
      </div>

      {/* State Withholdings */}
      <div className="details-section">
        <h3>State Withholdings</h3>
        <div className="details-row">
          <div className="details-icon"><FaUser /></div>
          <p>Married</p>
        </div>
        <div className="details-row">
          <div className="details-icon"><FaUser /></div>
          <p>0 allowances</p>
        </div>
        <div className="details-row">
          <div className="details-icon"><FaUser /></div>
          <p>0 dependents</p>
        </div>
        <div className="details-row">
          <div className="details-icon"><FaDollarSign /></div>
          <p>Extra withholdings: $0</p>
        </div>
      </div>

      {/* Payment Method */}
      <div className="details-section">
        <h3>Payment</h3>
        <div className="details-row">
          <div className="details-icon"><FaUniversity /></div>
          <p>{displayData.paymentMethod?.bankName || 'No bank'} Checking</p>
        </div>
        <div className="details-row">
          <div className="details-icon"><FaIdCard /></div>
          <p>**** {displayData.paymentMethod?.accountLast4 || '0000'}</p>
        </div>
        <div className="details-row">
          <div className="details-icon"><FaCalendarAlt /></div>
          <p>{displayData.paymentMethod?.payFrequency || 'No payment schedule'}</p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
