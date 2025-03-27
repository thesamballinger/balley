import React, { useState } from 'react';
import { FaTimes, FaUser, FaBriefcase, FaEnvelope, FaPhone, FaBuilding, FaIdCard, FaHome, FaDollarSign, FaUniversity } from 'react-icons/fa';
import EmployeeAvatarSelector from './EmployeeAvatarSelector.tsx';
import { Contractor } from './ContractorCard';

interface AddContractorWizardProps {
  onClose: () => void;
  onAddContractor: (contractor: Omit<Contractor, 'id'>) => void;
}

type WizardStep = 
  | 'name'
  | 'contact'
  | 'company'
  | 'role'
  | 'payRate'
  | 'summary';

const AddContractorWizard: React.FC<AddContractorWizardProps> = ({ onClose, onAddContractor }) => {
  const [currentStep, setCurrentStep] = useState<WizardStep>('name');
  const [progress, setProgress] = useState(0);
  
  // Form state
  const [formData, setFormData] = useState<Omit<Contractor, 'id'>>({
    name: '',
    firstName: '',
    lastName: '',
    role: '',
    payRate: 0,
    payRateType: 'hour',
    avatar: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    taxId: '',
    paymentMethod: {
      bankName: '',
      accountLast4: '',
      payFrequency: 'Monthly payouts'
    }
  });

  const updateFormData = (updates: Partial<Omit<Contractor, 'id'>>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    switch (currentStep) {
      case 'name':
        setCurrentStep('contact');
        setProgress(20);
        break;
      case 'contact':
        setCurrentStep('company');
        setProgress(40);
        break;
      case 'company':
        setCurrentStep('role');
        setProgress(60);
        break;
      case 'role':
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
      case 'company':
        setCurrentStep('contact');
        setProgress(20);
        break;
      case 'role':
        setCurrentStep('company');
        setProgress(40);
        break;
      case 'payRate':
        setCurrentStep('role');
        setProgress(60);
        break;
      case 'summary':
        setCurrentStep('payRate');
        setProgress(80);
        break;
    }
  };

  const handleSubmit = () => {
    // Combine first and last name if name is not provided
    if (!formData.name && formData.firstName && formData.lastName) {
      updateFormData({ name: `${formData.firstName} ${formData.lastName}` });
    }
    
    onAddContractor(formData);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'name':
        return (
          <div>
            <h3>Let's start with the contractor's name</h3>
            <div style={{ margin: '20px 0' }}>
              <EmployeeAvatarSelector 
                onSelect={(avatarUrl) => updateFormData({ avatar: avatarUrl })}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>First Name</label>
                <input
                  type="text"
                  placeholder="First Name"
                  value={formData.firstName || ''}
                  onChange={(e) => updateFormData({ firstName: e.target.value })}
                  style={{
                    padding: '12px',
                    fontSize: '16px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    width: '100%'
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Last Name</label>
                <input
                  type="text"
                  placeholder="Last Name"
                  value={formData.lastName || ''}
                  onChange={(e) => updateFormData({ lastName: e.target.value })}
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
          </div>
        );
      
      case 'contact':
        return (
          <div>
            <h3>How can we contact {formData.firstName || 'the contractor'}?</h3>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <FaEnvelope size={24} style={{ marginRight: '10px', flexShrink: 0 }} />
              <input
                type="email"
                placeholder="Email address"
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
              <FaPhone size={24} style={{ marginRight: '10px', flexShrink: 0 }} />
              <input
                type="tel"
                placeholder="Phone number"
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
              <FaHome size={24} style={{ marginRight: '10px', flexShrink: 0 }} />
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

      case 'company':
        return (
          <div>
            <h3>Company Information</h3>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <FaBuilding size={24} style={{ marginRight: '10px', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Company name"
                value={formData.company || ''}
                onChange={(e) => updateFormData({ company: e.target.value })}
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
              <FaIdCard size={24} style={{ marginRight: '10px', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Tax ID / EIN (XX-XXXXXXX)"
                value={formData.taxId || ''}
                onChange={(e) => updateFormData({ taxId: e.target.value })}
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
            <h3>What role will {formData.firstName || 'the contractor'} have?</h3>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <FaBriefcase size={24} style={{ marginRight: '10px', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Job title (e.g. Software Developer)"
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
      
      case 'payRate':
        return (
          <div>
            <h3>Payment Details</h3>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <FaDollarSign size={24} style={{ marginRight: '10px', flexShrink: 0 }} />
              <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                <input
                  type="number"
                  placeholder="Pay rate"
                  value={formData.payRate || ''}
                  onChange={(e) => updateFormData({ payRate: parseFloat(e.target.value) || 0 })}
                  style={{
                    padding: '12px',
                    fontSize: '16px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    flex: 1
                  }}
                />
                <select
                  value={formData.payRateType}
                  onChange={(e) => updateFormData({ payRateType: e.target.value as 'hour' | 'year' })}
                  style={{
                    padding: '12px',
                    fontSize: '16px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    flex: 1
                  }}
                >
                  <option value="hour">per hour</option>
                  <option value="year">per year</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <FaUniversity size={24} style={{ marginRight: '10px', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Bank name"
                value={formData.paymentMethod?.bankName || ''}
                onChange={(e) => updateFormData({ 
                  paymentMethod: { 
                    ...formData.paymentMethod as any, 
                    bankName: e.target.value 
                  } 
                })}
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
              <FaIdCard size={24} style={{ marginRight: '10px', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Last 4 digits of account"
                value={formData.paymentMethod?.accountLast4 || ''}
                onChange={(e) => updateFormData({ 
                  paymentMethod: { 
                    ...formData.paymentMethod as any, 
                    accountLast4: e.target.value 
                  } 
                })}
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
              <FaUniversity size={24} style={{ marginRight: '10px', flexShrink: 0 }} />
              <select
                value={formData.paymentMethod?.payFrequency || 'Monthly payouts'}
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
                <option value="Upon invoice">Upon invoice</option>
              </select>
            </div>
          </div>
        );
      
      case 'summary':
        return (
          <div>
            <h2>That's it! Time to add the contractor!</h2>
            <h3>Here's a summary of {formData.firstName}'s information:</h3>
            
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              marginBottom: '20px',
              padding: '15px',
              backgroundColor: '#f9f9f9',
              borderRadius: '8px'
            }}>
              <img 
                src={formData.avatar || `https://api.dicebear.com/7.x/personas/svg?seed=${formData.firstName} ${formData.lastName}`}
                alt="Contractor avatar"
                style={{ width: '60px', height: '60px', borderRadius: '50%', marginRight: '15px' }}
              />
              <div>
                <h3 style={{ margin: '0 0 5px' }}>{formData.firstName} {formData.lastName}</h3>
                <p style={{ margin: '0', color: '#666' }}>{formData.role} • {formData.company}</p>
                <p style={{ margin: '5px 0 0', color: '#666' }}>
                  {formData.payRateType === 'hour' 
                    ? `$${formData.payRate}/hour` 
                    : `$${formData.payRate.toLocaleString()}/year`}
                </p>
              </div>
            </div>
            
            <p>
              We'll add {formData.firstName} to your contractor list. You can edit their information anytime.
            </p>
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
            {currentStep === 'summary' ? 'Add Contractor' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddContractorWizard;
