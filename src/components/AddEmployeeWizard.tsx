import React, { useState } from 'react';
import { FaTimes, FaUser, FaBriefcase, FaEnvelope, FaPhone, FaCalendarAlt, FaIdCard, FaHome, FaDollarSign, FaUniversity } from 'react-icons/fa';
import EmployeeAvatarSelector from './EmployeeAvatarSelector.tsx';
import { Employee } from './EmployeeCard.tsx';

interface AddEmployeeWizardProps {
  onClose: () => void;
  onAddEmployee: (employee: Omit<Employee, 'id'>) => void;
}

type WizardStep = 
  | 'name'
  | 'contact'
  | 'role'
  | 'payType'
  | 'payRate'
  | 'summary';

const AddEmployeeWizard: React.FC<AddEmployeeWizardProps> = ({ onClose, onAddEmployee }) => {
  const [currentStep, setCurrentStep] = useState<WizardStep>('name');
  const [progress, setProgress] = useState(0);
  
  // Form state
  const [formData, setFormData] = useState<Omit<Employee, 'id'>>({
    name: '',
    firstName: '',
    lastName: '',
    role: '',
    employmentType: 'Employee (W2)',
    payRate: 0,
    payRateType: 'hour',
    avatar: '',
    email: '',
    phone: '',
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

  const updateFormData = (updates: Partial<Omit<Employee, 'id'>>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    switch (currentStep) {
      case 'name':
        setCurrentStep('contact');
        setProgress(20);
        break;
      case 'contact':
        setCurrentStep('role');
        setProgress(40);
        break;
      case 'role':
        setCurrentStep('payType');
        setProgress(60);
        break;
      case 'payType':
        setCurrentStep('payRate');
        setProgress(80);
        break;
      case 'payRate':
        setCurrentStep('summary');
        setProgress(100);
        break;
      case 'summary':
        handleSubmit();
        break;
    }
  };

  const handlePrevious = () => {
    switch (currentStep) {
      case 'contact':
        setCurrentStep('name');
        setProgress(0);
        break;
      case 'role':
        setCurrentStep('contact');
        setProgress(20);
        break;
      case 'payType':
        setCurrentStep('role');
        setProgress(40);
        break;
      case 'payRate':
        setCurrentStep('payType');
        setProgress(60);
        break;
      case 'summary':
        setCurrentStep('payRate');
        setProgress(80);
        break;
    }
  };

  const handleSubmit = () => {
    // Combine first and last name if name is not set
    if (!formData.name && formData.firstName && formData.lastName) {
      updateFormData({ name: `${formData.firstName} ${formData.lastName}` });
    }
    
    onAddEmployee(formData);
    onClose();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'name':
        return (
          <div>
            <h2>Who's joining your team?</h2>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <FaUser size={24} style={{ marginRight: '10px' }} />
              <input
                type="text"
                placeholder="First and last name"
                value={`${formData.firstName || ''} ${formData.lastName || ''}`.trim()}
                onChange={(e) => {
                  const nameParts = e.target.value.split(' ');
                  const firstName = nameParts[0] || '';
                  const lastName = nameParts.slice(1).join(' ') || '';
                  updateFormData({ 
                    firstName, 
                    lastName,
                    name: e.target.value.trim()
                  });
                }}
                style={{
                  padding: '12px',
                  fontSize: '16px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  width: '100%'
                }}
              />
            </div>
            <EmployeeAvatarSelector 
              onSelect={(avatarUrl) => updateFormData({ avatar: avatarUrl })}
            />
          </div>
        );
      
      case 'contact':
        return (
          <div>
            <h2>How can we reach them?</h2>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <FaEnvelope size={24} style={{ marginRight: '10px' }} />
              <input
                type="email"
                placeholder="Email"
                value={formData.email || ''}
                onChange={(e) => updateFormData({ email: e.target.value })}
                style={{
                  padding: '12px',
                  fontSize: '16px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  width: '100%'
                }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <FaPhone size={24} style={{ marginRight: '10px' }} />
              <input
                type="tel"
                placeholder="Phone"
                value={formData.phone || ''}
                onChange={(e) => updateFormData({ phone: e.target.value })}
                style={{
                  padding: '12px',
                  fontSize: '16px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  width: '100%'
                }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <FaHome size={24} style={{ marginRight: '10px' }} />
              <input
                type="text"
                placeholder="Address"
                value={formData.address || ''}
                onChange={(e) => updateFormData({ address: e.target.value })}
                style={{
                  padding: '12px',
                  fontSize: '16px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  width: '100%'
                }}
              />
            </div>
          </div>
        );
      
      case 'role':
        return (
          <div>
            <h2>What's their role?</h2>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '30px' }}>
              <div 
                onClick={() => updateFormData({ employmentType: 'Contractor (1099)' })}
                style={{
                  padding: '20px',
                  border: formData.employmentType === 'Contractor (1099)' ? '2px solid #007bff' : '1px solid #ddd',
                  borderRadius: '8px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  width: '45%'
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>👷</div>
                <h3>Contractor<br/>(1099)</h3>
              </div>
              <div 
                onClick={() => updateFormData({ employmentType: 'Employee (W2)' })}
                style={{
                  padding: '20px',
                  border: formData.employmentType === 'Employee (W2)' ? '2px solid #007bff' : '1px solid #ddd',
                  borderRadius: '8px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  width: '45%'
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>👔</div>
                <h3>Employee<br/>(W-2)</h3>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <FaBriefcase size={24} style={{ marginRight: '10px', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Job title (e.g. Software Engineer)"
                value={formData.role || ''}
                onChange={(e) => updateFormData({ role: e.target.value })}
                style={{
                  padding: '12px',
                  fontSize: '16px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  width: '100%'
                }}
              />
            </div>
          </div>
        );
      
      case 'payType':
        return (
          <div>
            <h2>What's their pay?</h2>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '30px' }}>
              <div 
                onClick={() => updateFormData({ payRateType: 'hour' })}
                style={{
                  padding: '20px',
                  border: formData.payRateType === 'hour' ? '2px solid #007bff' : '1px solid #ddd',
                  borderRadius: '8px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  width: '45%'
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>⏱️</div>
                <h3>Hourly</h3>
              </div>
              <div 
                onClick={() => updateFormData({ payRateType: 'year' })}
                style={{
                  padding: '20px',
                  border: formData.payRateType === 'year' ? '2px solid #007bff' : '1px solid #ddd',
                  borderRadius: '8px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  width: '45%'
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>📅</div>
                <h3>Salaried</h3>
              </div>
            </div>
          </div>
        );
      
      case 'payRate':
        return (
          <div>
            <h2>What's their pay?</h2>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <FaDollarSign size={24} style={{ marginRight: '10px', flexShrink: 0 }} />
              <input
                type="number"
                placeholder={formData.payRateType === 'hour' ? "Hourly rate" : "Annual salary"}
                value={formData.payRate || ''}
                onChange={(e) => updateFormData({ payRate: parseFloat(e.target.value) || 0 })}
                style={{
                  padding: '12px',
                  fontSize: '16px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  width: '100%'
                }}
              />
              <span style={{ marginLeft: '10px', flexShrink: 0 }}>
                / {formData.payRateType === 'hour' ? 'hour' : 'year'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <FaUniversity size={24} style={{ marginRight: '10px', flexShrink: 0 }} />
              <select
                value={formData.paymentMethod?.payFrequency || 'Bi-weekly payouts'}
                onChange={(e) => updateFormData({ 
                  paymentMethod: { 
                    ...formData.paymentMethod as any, 
                    payFrequency: e.target.value 
                  } 
                })}
                style={{
                  padding: '12px',
                  fontSize: '16px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  width: '100%'
                }}
              >
                <option value="Weekly payouts">Weekly payouts</option>
                <option value="Bi-weekly payouts">Bi-weekly payouts</option>
                <option value="Monthly payouts">Monthly payouts</option>
                <option value="Semi-monthly payouts">Semi-monthly payouts</option>
              </select>
            </div>
          </div>
        );
      
      case 'summary':
        return (
          <div>
            <h2>That's it! Time to Invite them!</h2>
            <h3>Here's what we'll send to {formData.name}:</h3>
            
            <div style={{ 
              border: '1px solid #ddd', 
              borderRadius: '12px', 
              padding: '20px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                <FaBriefcase size={24} style={{ marginRight: '10px', flexShrink: 0 }} />
                <div>
                  <strong>Role: {formData.role} - </strong>
                  <span style={{ color: '#007bff' }}>{formData.employmentType}</span>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                <FaDollarSign size={24} style={{ marginRight: '10px', flexShrink: 0 }} />
                <div>
                  <strong>Pay: </strong>
                  <span style={{ color: '#007bff' }}>
                    ${formData.payRate.toLocaleString()} / {formData.payRateType}
                  </span>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <FaEnvelope size={24} style={{ marginRight: '10px', flexShrink: 0 }} />
                <div>
                  <strong>Invite Link to: </strong>
                  <span style={{ color: '#007bff' }}>{formData.email}</span>
                </div>
              </div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <img 
                src={formData.avatar || `https://api.dicebear.com/7.x/personas/svg?seed=${formData.name}`}
                alt="Employee avatar"
                style={{ 
                  width: '120px', 
                  height: '120px', 
                  borderRadius: '50%',
                  border: '2px solid #ddd'
                }}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '15px',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflow: 'auto',
        padding: '20px',
        position: 'relative'
      }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '15px',
            left: '15px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer'
          }}
        >
          <FaTimes />
        </button>
        
        {/* Progress bar */}
        <div style={{
          height: '8px',
          backgroundColor: '#e0e0e0',
          borderRadius: '4px',
          marginBottom: '20px',
          marginTop: '10px'
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            backgroundColor: '#007bff',
            borderRadius: '4px',
            transition: 'width 0.3s ease'
          }} />
        </div>
        
        {/* Step content */}
        <div style={{ padding: '10px 0 30px' }}>
          {renderStepContent()}
        </div>
        
        {/* Navigation buttons */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          marginTop: '20px'
        }}>
          {currentStep !== 'name' ? (
            <button
              onClick={handlePrevious}
              style={{
                padding: '10px 20px',
                backgroundColor: '#e0e0e0',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              Previous
            </button>
          ) : <div></div>}
          
          <button
            onClick={handleNext}
            style={{
              padding: '10px 30px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            {currentStep === 'summary' ? 'Send invite 🚀' : 'Go'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeWizard;
