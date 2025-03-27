import React from 'react';
import { FaBriefcase, FaBuilding, FaUniversity } from 'react-icons/fa';

export type Contractor = {
  id: number | string;
  name: string;
  firstName?: string;
  lastName?: string;
  role: string;
  payRate: number;
  payRateType: 'hour' | 'year';
  avatar?: string;
  email?: string;
  phone?: string;
  company?: string;
  address?: string;
  taxId?: string;
  paymentMethod?: {
    bankName: string;
    accountLast4: string;
    payFrequency: string;
  };
};

interface ContractorCardProps {
  contractor: Contractor;
  isSelected: boolean;
  onSelect: (contractorId: number | string) => void;
}

const ContractorCard: React.FC<ContractorCardProps> = ({
  contractor,
  isSelected,
  onSelect,
}) => {
  const handleClick = () => {
    onSelect(contractor.id);
  };

  // Generate background color based on name (for consistency)
  const getBackgroundColor = (name: string) => {
    const colors = ['#99ff99', '#ffcc99', '#cc99ff', '#ff99cc', '#ff9999', '#99ccff'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  // Format pay rate for display
  const formatPayRate = () => {
    if (contractor.payRateType === 'hour') {
      return `$${contractor.payRate} / hour`;
    } else {
      return `$${contractor.payRate.toLocaleString()} / year`;
    }
  };

  // Generate avatar URL (using DiceBear API for fun avatars)
  const getAvatarUrl = () => {
    return contractor.avatar || `https://api.dicebear.com/7.x/personas/svg?seed=${contractor.name}`;
  };

  return (
    <div
      onClick={handleClick}
      className={`contractor-card ${isSelected ? 'selected' : ''}`}
      style={{
        backgroundColor: getBackgroundColor(contractor.name),
      }}
    >
      <img
        src={getAvatarUrl()}
        alt={`${contractor.name} avatar`}
        className="contractor-avatar"
      />
      <h3 className="contractor-name">{contractor.name}</h3>
      <p className="contractor-role">
        <span className="icon">
          <FaBriefcase />
        </span>
        {contractor.role}
      </p>
      {contractor.company && (
        <p className="contractor-company">
          <span className="icon">
            <FaBuilding />
          </span>
          {contractor.company}
        </p>
      )}
      <p className="contractor-pay">
        <span className="icon">
          <FaUniversity />
        </span>
        {formatPayRate()}
      </p>
    </div>
  );
};

export default ContractorCard;
