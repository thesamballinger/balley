import React, { useState } from 'react';
import { FaTimes, FaUser, FaEnvelope, FaPhone, FaDollarSign, FaBriefcase, FaCalendarAlt, FaIdCard, FaHome } from 'react-icons/fa';
import { Employee } from '../types/Employee.ts';
import '../styles/components/AddEmployeeWizard.css';

interface AddEmployeeWizardProps {
  onClose: () => void;
  onAddEmployee: (employee: Omit<Employee, 'id'>) => void;
}

const AddEmployeeWizard: React.FC<AddEmployeeWizardProps> = ({ onClose, onAddEmployee }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Omit<Employee, 'id'>>({
    name: '',
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    phone: '',
    role: '',
    employmentType: 'Employee (W2)',
    payRate: 0,
    payRateType: 'hour',
    avatar: `https://api.dicebear.com/7.x/personas/svg?seed=${Math.random()}`,
    birthdate: '',
    ssnLast4: '',
    address: '',
    federalWithholdings: {
      filingStatus: 'Single',
      allowances: 0,
      dependents: 0,
      extraWithholdings: 0
    },
    stateWithholdings: {
      filingStatus: 'Single',
      allowances: 0,
      dependents: 0,
      extraWithholdings: 0
    },
    paymentMethod: {
      bankName: '',
      accountLast4: '',
      payFrequency: 'Bi-weekly payouts'
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNestedInputChange = (category: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddEmployee(formData);
    onClose();
  };

  const nextStep = () => {
    setStep(prevStep => prevStep + 1);
  };

  const prevStep = () => {
    setStep(prevStep => prevStep - 1);
  };

  return (
    <div className="wizard-overlay">
      <div className="wizard-container">
        <div className="wizard-header">
          <h2>Add New Employee</h2>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        
        <div className="wizard-progress">
          <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>1</div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>2</div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>3</div>
        </div>
        
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="wizard-step">
              <h3>Basic Information</h3>
              
              <div className="form-group">
                <label>First Name</label>
                <div className="input-with-icon">
                  <FaUser className="input-icon" />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    placeholder="First Name"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Last Name</label>
                <div className="input-with-icon">
                  <FaUser className="input-icon" />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    placeholder="Last Name"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Email</label>
                <div className="input-with-icon">
                  <FaEnvelope className="input-icon" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Email Address"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Phone</label>
                <div className="input-with-icon">
                  <FaPhone className="input-icon" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Phone Number"
                  />
                </div>
              </div>
              
              <div className="wizard-buttons">
                <button type="button" onClick={onClose} className="secondary-button">
                  Cancel
                </button>
                <button type="button" onClick={nextStep} className="primary-button">
                  Next
                </button>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="wizard-step">
              <h3>Employment Details</h3>
              
              <div className="form-group">
                <label>Role</label>
                <div className="input-with-icon">
                  <FaBriefcase className="input-icon" />
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                    placeholder="Job Title"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Pay Rate</label>
                <div className="input-with-icon">
                  <FaDollarSign className="input-icon" />
                  <input
                    type="number"
                    name="payRate"
                    value={formData.payRate}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="Pay Rate"
                  />
                  <select
                    name="payRateType"
                    value={formData.payRateType}
                    onChange={handleInputChange}
                  >
                    <option value="hour">per hour</option>
                    <option value="year">per year</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label>Date of Birth</label>
                <div className="input-with-icon">
                  <FaCalendarAlt className="input-icon" />
                  <input
                    type="date"
                    name="birthdate"
                    value={formData.birthdate}
                    onChange={handleInputChange}
                    placeholder="Date of Birth"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Last 4 of SSN</label>
                <div className="input-with-icon">
                  <FaIdCard className="input-icon" />
                  <input
                    type="text"
                    name="ssnLast4"
                    value={formData.ssnLast4}
                    onChange={handleInputChange}
                    maxLength={4}
                    pattern="[0-9]{4}"
                    placeholder="Last 4 digits of SSN"
                  />
                </div>
              </div>
              
              <div className="wizard-buttons">
                <button type="button" onClick={prevStep} className="secondary-button">
                  Back
                </button>
                <button type="button" onClick={nextStep} className="primary-button">
                  Next
                </button>
              </div>
            </div>
          )}
          
          {step === 3 && (
            <div className="wizard-step">
              <h3>Address & Payment</h3>
              
              <div className="form-group">
                <label>Address</label>
                <div className="input-with-icon">
                  <FaHome className="input-icon" />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Full Address"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Bank Name</label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.paymentMethod.bankName}
                  onChange={(e) => handleNestedInputChange('paymentMethod', 'bankName', e.target.value)}
                  placeholder="Bank Name"
                />
              </div>
              
              <div className="form-group">
                <label>Last 4 of Account</label>
                <input
                  type="text"
                  name="accountLast4"
                  value={formData.paymentMethod.accountLast4}
                  onChange={(e) => handleNestedInputChange('paymentMethod', 'accountLast4', e.target.value)}
                  maxLength={4}
                  pattern="[0-9]{4}"
                  placeholder="Last 4 digits of account"
                />
              </div>
              
              <div className="form-group">
                <label>Pay Frequency</label>
                <select
                  name="payFrequency"
                  value={formData.paymentMethod.payFrequency}
                  onChange={(e) => handleNestedInputChange('paymentMethod', 'payFrequency', e.target.value)}
                >
                  <option value="Weekly payouts">Weekly</option>
                  <option value="Bi-weekly payouts">Bi-weekly</option>
                  <option value="Monthly payouts">Monthly</option>
                </select>
              </div>
              
              <div className="wizard-buttons">
                <button type="button" onClick={prevStep} className="secondary-button">
                  Back
                </button>
                <button type="submit" className="primary-button">
                  Add Employee
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeWizard;
