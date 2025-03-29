import React from 'react';
import { FaBriefcase, FaUniversity, FaCircle } from 'react-icons/fa';
import { Employee } from '../types/Employee';
import '../styles/components/EmployeeCard.css';

interface EmployeeCardProps {
  employee: Employee;
  isSelected: boolean;
  onClick: (id: string) => void;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({
  employee,
  isSelected,
  onClick,
}) => {
  const handleClick = () => {
    if (employee.id) {
      onClick(employee.id);
    } else {
      console.error('Employee ID is missing:', employee);
    }
  };

  // Generate background color based on name (for consistency)
  const getBackgroundColor = (name: string) => {
    const colors = ['#ff9999', '#99ccff', '#99ff99', '#ffcc99', '#cc99ff', '#ff99cc'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  // Format pay rate for display
  const formatPayRate = () => {
    console.log(`Formatting pay rate for ${employee.name}:`, {
      payRate: employee.payRate,
      payRateType: employee.payRateType,
      earningRates: employee.earningRates
    });
    
    if (!employee.payRate) {
      // Check if we have earning rates data but no mapped payRate
      if (employee.earningRates && employee.earningRates.length > 0) {
        const rate = employee.earningRates[0];
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
    
    if (employee.payRateType === 'hour') {
      return `$${employee.payRate} / hour`;
    } else {
      return `$${Number(employee.payRate).toLocaleString()} / year`;
    }
  };

  // Generate avatar URL (using DiceBear API for fun avatars)
  const getAvatarUrl = () => {
    return employee.avatar || `https://api.dicebear.com/7.x/personas/svg?seed=${employee.name}`;
  };

  // Get onboarding status
  const getOnboardingStatus = () => {
    if (!employee.onboard) return null;
    
    const status = employee.onboard.status;
    let statusColor = '#999'; // Default gray
    
    switch (status) {
      case 'complete':
        statusColor = '#4caf50'; // Green
        break;
      case 'in_progress':
        statusColor = '#ff9800'; // Orange
        break;
      case 'blocked':
        statusColor = '#f44336'; // Red
        break;
      default:
        statusColor = '#999'; // Gray
    }
    
    return (
      <div className="onboarding-status" title={`Onboarding: ${status.replace('_', ' ')}`}>
        <FaCircle style={{ color: statusColor, fontSize: '10px' }} />
      </div>
    );
  };

  return (
    <div
      onClick={handleClick}
      className={`employee-card ${isSelected ? 'selected' : ''}`}
      style={{
        backgroundColor: getBackgroundColor(employee.name || 'Unknown'),
      }}
    >
      {getOnboardingStatus()}
      <img
        src={getAvatarUrl()}
        alt={`${employee.name || 'Employee'} avatar`}
        className="employee-avatar"
      />
      <h3 className="employee-name">{employee.name || 'Unnamed Employee'}</h3>
      <p className="employee-role">
        <span className="icon">
          <FaBriefcase />
        </span>
        {employee.role || 'No role specified'}
      </p>
      <p className="employee-pay">
        <span className="icon">
          <FaUniversity />
        </span>
        {formatPayRate()}
      </p>
      {employee.active === false && (
        <div className="inactive-badge">Inactive</div>
      )}
    </div>
  );
};

export default EmployeeCard;
