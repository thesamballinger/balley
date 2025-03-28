import React from 'react';
import { FaBriefcase, FaUniversity } from 'react-icons/fa';
import { Employee } from '../types/Employee.ts';
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
      onClick(employee.id as string);
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
