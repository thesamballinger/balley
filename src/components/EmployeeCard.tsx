import React from 'react';
import { FaBriefcase, FaUniversity } from 'react-icons/fa';

export type Employee = {
  id: number | string;
  name: string;
  firstName?: string;
  lastName?: string;
  role: string;
  employmentType: 'Employee (W2)';
  payRate: number;
  payRateType: 'hour' | 'year';
  avatar?: string;
  email?: string;
  phone?: string;
  birthdate?: string;
  ssn?: string;
  ssnLast4?: string;
  address?: string;
  federalWithholdings?: {
    filingStatus: 'Single' | 'Married' | 'Jointly' | 'Head of household';
    allowances: number;
    dependents: number;
    extraWithholdings: number;
  };
  stateWithholdings?: {
    filingStatus: 'Single' | 'Married';
    allowances: number;
    dependents: number;
    extraWithholdings: number;
  };
  paymentMethod?: {
    bankName: string;
    accountLast4: string;
    payFrequency: string;
  };
};

interface EmployeeCardProps {
  employee: Employee;
  isSelected: boolean;
  onSelect: (employeeId: number | string) => void;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({
  employee,
  isSelected,
  onSelect,
}) => {
  const handleClick = () => {
    onSelect(employee.id);
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
    if (employee.payRateType === 'hour') {
      return `$${employee.payRate} / hour`;
    } else {
      return `$${employee.payRate.toLocaleString()} / year`;
    }
  };

  // Generate avatar URL (using DiceBear API for fun avatars)
  const getAvatarUrl = () => {
    return employee.avatar || `https://api.dicebear.com/7.x/personas/svg?seed=${employee.name}`;
  };

  return (
    <div
      onClick={handleClick}
      className={`employee-card ${isSelected ? 'selected' : ''}`}
      style={{
        backgroundColor: getBackgroundColor(employee.name),
      }}
    >
      <img
        src={getAvatarUrl()}
        alt={`${employee.name} avatar`}
        className="employee-avatar"
      />
      <h3 className="employee-name">{employee.name}</h3>
      <p className="employee-role">
        <span className="icon">
          <FaBriefcase />
        </span>
        {employee.role}
      </p>
      <p className="employee-pay">
        <span className="icon">
          <FaUniversity />
        </span>
        {formatPayRate()}
      </p>
    </div>
  );
};

export default EmployeeCard;
