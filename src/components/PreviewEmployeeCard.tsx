// src/components/PreviewEmployeeCard.tsx
import React from 'react';
import { FaBriefcase, FaUser, FaUniversity } from 'react-icons/fa';

export type EmployeePreview = {
  id: number | string;
  name: string;
  role: string;
  employmentType: string;
  payRateLabel: string;
};

interface PreviewEmployeeCardProps {
  employee: EmployeePreview;
  isSelected: boolean;
  onSelect: (employeeId: number | string) => void;
}

const PreviewEmployeeCard: React.FC<PreviewEmployeeCardProps> = ({
  employee,
  isSelected,
  onSelect,
}) => {
  const handleClick = () => {
    onSelect(employee.id);
  };

  // Determine background color based on employee name (for now)
  const getBackgroundColor = (name: string) => {
    switch (name) {
      case 'Nick Johnson':
        return '#ff9999'; // Pink
      case 'Meghan Sydney':
        return '#99ccff'; // Blue
      case 'Charlie Kirk':
        return '#99ff99'; // Green
      default:
        return '#ffffff';
    }
  };

  // Placeholder avatar URLs (replace with actual avatars)
  const getAvatarUrl = (name: string) => {
    switch (name) {
      case 'Nick Johnson':
        return 'https://placeholder.com/150'; // TODO: Replace with actual avatar
      case 'Meghan Sydney':
        return 'https://placeholder.com/150'; // TODO: Replace with actual avatar
      case 'Charlie Kirk':
        return 'https://placeholder.com/150'; // TODO: Replace with actual avatar
      default:
        return 'https://placeholder.com/150';
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{
        cursor: 'pointer',
        border: isSelected ? '2px solid #007bff' : 'none',
        borderRadius: '15px',
        padding: '1rem',
        backgroundColor: getBackgroundColor(employee.name),
        boxShadow: '0 0 5px rgba(0,0,0,0.1)',
        width: '150px',
        margin: '1rem',
        textAlign: 'center',
        transition: 'all 0.2s ease',
      }}
    >
      <img
        src={getAvatarUrl(employee.name)}
        alt={`${employee.name} avatar`}
        style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          marginBottom: '0.5rem',
        }}
      />
      <h3 style={{ margin: '0.5rem 0', fontSize: '1rem' }}>{employee.name}</h3>
      <p style={{ margin: '0.25rem 0', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ marginRight: '0.5rem' }}>
          <FaBriefcase />
        </span>
        {employee.role}
      </p>
      <p style={{ margin: '0.25rem 0', color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ marginRight: '0.5rem' }}>
          <FaUser />
        </span>
        {employee.employmentType}
      </p>
      <p style={{ margin: '0.25rem 0', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ marginRight: '0.5rem' }}>
          <FaUniversity />
        </span>
        {employee.payRateLabel}
      </p>
    </div>
  );
};

export default PreviewEmployeeCard;