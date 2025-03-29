import React from 'react';
import { Employee } from '../types/Employee.ts';
import '../styles/components/PayrollEmployeeCard.css';

interface PayrollEmployeeCardProps {
  employee: Employee;
  grossPay: number;
  taxes: number;
  netPay: number;
}

const PayrollEmployeeCard: React.FC<PayrollEmployeeCardProps> = ({
  employee,
  grossPay,
  taxes,
  netPay
}) => {
  return (
    <div className="payroll-employee-card">
      <div className="employee-header">
        <img 
          src={employee.avatar || `https://api.dicebear.com/7.x/personas/svg?seed=${employee.name}`} 
          alt={`${employee.name} avatar`} 
          className="employee-avatar" 
        />
        <div className="employee-info">
          <h3 className="employee-name">{employee.name}</h3>
          <p className="employee-role">{employee.role}</p>
        </div>
      </div>
      
      <div className="pay-details">
        <div className="pay-item">
          <span className="pay-label">Gross Pay</span>
          <span className="pay-value">${grossPay.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="pay-item">
          <span className="pay-label">Taxes & Deductions</span>
          <span className="pay-value">-${taxes.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="pay-item total">
          <span className="pay-label">Net Pay</span>
          <span className="pay-value">${netPay.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      </div>
    </div>
  );
};

export default PayrollEmployeeCard;
