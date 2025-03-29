import React, { useState, useEffect } from 'react';
import { FaBell, FaCalendarAlt, FaClock, FaPlay, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import checkApi from '../services/checkApi.ts';
import { Employee } from '../types/Employee.ts';
import '../styles/screens/Payroll.css';

const Payroll: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [payrollDate, setPayrollDate] = useState<string>('');
  const [nextPayday, setNextPayday] = useState<string>('');
  const [payrollDeadline, setPayrollDeadline] = useState<string>('');
  const [isPayrollRunning, setIsPayrollRunning] = useState(false);
  const [payrollComplete, setPayrollComplete] = useState(false);
  const [payrollErrors, setPayrollErrors] = useState<string[]>([]);

  // Fetch employees and payroll schedule on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch employees
        const employeeData = await checkApi.getEmployees();
        setEmployees(employeeData);
        
        // Set payroll dates (this would come from the API in a real implementation)
        const today = new Date();
        const nextPaydayDate = new Date(today);
        
        // Set next payday to the 15th of current month or 1st of next month
        const currentDay = today.getDate();
        if (currentDay < 15) {
          nextPaydayDate.setDate(15);
        } else {
          nextPaydayDate.setMonth(today.getMonth() + 1);
          nextPaydayDate.setDate(1);
        }
        
        // Format dates
        setNextPayday(formatDate(nextPaydayDate, true));
        
        // Set deadline (typically a few days before payday)
        const deadlineDate = new Date(nextPaydayDate);
        deadlineDate.setDate(nextPaydayDate.getDate() - 4);
        setPayrollDeadline(formatDate(deadlineDate, true));
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching payroll data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Format date helper
  const formatDate = (date: Date, includeMonth = false): string => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const day = date.getDate();
    const month = months[date.getMonth()];
    
    // Add suffix to day
    let daySuffix = 'th';
    if (day === 1 || day === 21 || day === 31) daySuffix = 'st';
    if (day === 2 || day === 22) daySuffix = 'nd';
    if (day === 3 || day === 23) daySuffix = 'rd';
    
    return includeMonth ? `${month} ${day}${daySuffix}` : `${day}${daySuffix}`;
  };

  // Check if today is the deadline
  const isToday = (dateString: string): boolean => {
    const today = new Date();
    return dateString.includes(formatDate(today, true));
  };

  // Handle running payroll
  const handleRunPayroll = async () => {
    try {
      setIsPayrollRunning(true);
      
      // Simulate API call to run payroll
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Move to confirmation step
      setCurrentStep(3);
      setPayrollComplete(true);
      setIsPayrollRunning(false);
    } catch (error) {
      console.error('Error running payroll:', error);
      setPayrollErrors(['Failed to process payroll. Please try again.']);
      setIsPayrollRunning(false);
    }
  };

  // Render welcome card
  const renderWelcomeCard = () => {
    return (
      <div className="payroll-welcome-card">
        <div className="payroll-welcome-header">
          <h2>Hey {employees[0]?.firstName || 'there'} 👋</h2>
        </div>
        
        <div className="payroll-info-section">
          <div className="payroll-info-item">
            <FaCalendarAlt className="payroll-info-icon" />
            <div className="payroll-info-text">
              <p>This is your next payday</p>
              <p className="payroll-date">{nextPayday}</p>
            </div>
          </div>
          
          <div className="payroll-info-item">
            <FaClock className="payroll-info-icon" />
            <div className="payroll-info-text">
              <p>You need to run this payroll by:</p>
              <p className="payroll-date urgent">{payrollDeadline} {isToday(payrollDeadline) && '(today)'}</p>
            </div>
          </div>
        </div>
        
        <button 
          className="run-payroll-button"
          onClick={() => setCurrentStep(1)}
        >
          <FaPlay /> Run payroll
        </button>
      </div>
    );
  };

  // Render employee review step
  const renderEmployeeReview = () => {
    return (
      <div className="payroll-step-container">
        <h2>Review Employee Payments</h2>
        <p className="step-description">
          Review and confirm payment details for each employee before proceeding.
        </p>
        
        <div className="employee-payments-list">
          {employees.map(employee => (
            <EmployeePaymentCard 
              key={employee.id} 
              employee={employee} 
              payDate={nextPayday}
            />
          ))}
        </div>
        
        <div className="payroll-step-actions">
          <button 
            className="secondary-button"
            onClick={() => setCurrentStep(0)}
          >
            Back
          </button>
          <button 
            className="primary-button"
            onClick={() => setCurrentStep(2)}
          >
            Continue
          </button>
        </div>
      </div>
    );
  };

  // Render confirmation step
  const renderConfirmation = () => {
    return (
      <div className="payroll-step-container">
        <h2>Confirm Payroll Run</h2>
        <p className="step-description">
          You're about to process payroll for {employees.length} employees with a total of ${calculateTotalPayroll()}.
        </p>
        
        <div className="payroll-summary">
          <div className="summary-item">
            <span>Pay date:</span>
            <span>{nextPayday}</span>
          </div>
          <div className="summary-item">
            <span>Total payroll:</span>
            <span>${calculateTotalPayroll()}</span>
          </div>
          <div className="summary-item">
            <span>Employees:</span>
            <span>{employees.length}</span>
          </div>
        </div>
        
        <div className="payroll-step-actions">
          <button 
            className="secondary-button"
            onClick={() => setCurrentStep(1)}
            disabled={isPayrollRunning}
          >
            Back
          </button>
          <button 
            className="primary-button run-payroll-button"
            onClick={handleRunPayroll}
            disabled={isPayrollRunning}
          >
            {isPayrollRunning ? 'Processing...' : 'Run Payroll'}
          </button>
        </div>
      </div>
    );
  };

  // Render completion step
  const renderCompletion = () => {
    return (
      <div className="payroll-step-container">
        <div className="payroll-complete-header">
          <FaCheck className="complete-icon" />
          <h2>Payroll Complete!</h2>
        </div>
        
        <p className="step-description">
          Payroll has been successfully processed for {employees.length} employees.
          Payments will be issued on {nextPayday}.
        </p>
        
        <div className="payroll-summary">
          <div className="summary-item">
            <span>Pay date:</span>
            <span>{nextPayday}</span>
          </div>
          <div className="summary-item">
            <span>Total payroll:</span>
            <span>${calculateTotalPayroll()}</span>
          </div>
          <div className="summary-item">
            <span>Employees paid:</span>
            <span>{employees.length}</span>
          </div>
        </div>
        
        <button 
          className="primary-button"
          onClick={() => setCurrentStep(0)}
        >
          Return to Dashboard
        </button>
      </div>
    );
  };

  // Helper to calculate total payroll amount
  const calculateTotalPayroll = (): string => {
    let total = 0;
    
    employees.forEach(employee => {
      if (employee.payRate) {
        if (employee.payRateType === 'hour') {
          // Assume 80 hours per pay period (bi-weekly)
          total += employee.payRate * 80;
        } else {
          // Annual salary divided by 24 pay periods
          total += employee.payRate / 24;
        }
      }
    });
    
    return total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Render the appropriate step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderWelcomeCard();
      case 1:
        return renderEmployeeReview();
      case 2:
        return renderConfirmation();
      case 3:
        return renderCompletion();
      default:
        return renderWelcomeCard();
    }
  };

  // Main render
  return (
    <div className="payroll-container">
      <div className="payroll-header">
        <h1>Run Payroll</h1>
        <div className="payroll-schedule">
          <FaBell className="schedule-icon" />
          <span>
            Payroll is set to payout employees the <span className="highlight">1st</span> & <span className="highlight">15th</span> of every month
          </span>
        </div>
      </div>
      
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading payroll data...</p>
        </div>
      ) : (
        <div className="payroll-content">
          {renderCurrentStep()}
        </div>
      )}
    </div>
  );
};

// Employee Payment Card Component
interface EmployeePaymentCardProps {
  employee: Employee;
  payDate: string;
}

const EmployeePaymentCard: React.FC<EmployeePaymentCardProps> = ({ employee, payDate }) => {
  // Calculate payment amount
  const calculatePayment = (): string => {
    if (!employee.payRate) return '0.00';
    
    let amount = 0;
    if (employee.payRateType === 'hour') {
      // Assume 80 hours per pay period (bi-weekly)
      amount = employee.payRate * 80;
    } else {
      // Annual salary divided by 24 pay periods
      amount = employee.payRate / 24;
    }
    
    return amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Generate background color based on name (for consistency with employee cards)
  const getBackgroundColor = (name: string) => {
    const colors = ['#ff9999', '#99ccff', '#99ff99', '#ffcc99', '#cc99ff', '#ff99cc'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="employee-payment-card">
      <div className="employee-payment-avatar" style={{ backgroundColor: getBackgroundColor(employee.name || '') }}>
        <img 
          src={employee.avatar || `https://api.dicebear.com/7.x/personas/svg?seed=${employee.name}`} 
          alt={`${employee.name} avatar`} 
        />
      </div>
      
      <div className="employee-payment-info">
        <h3>{employee.name}</h3>
        <p className="employee-role">{employee.role}</p>
      </div>
      
      <div className="employee-payment-details">
        <div className="payment-detail">
          <span className="detail-label">Pay date:</span>
          <span className="detail-value">{payDate}</span>
        </div>
        
        <div className="payment-detail">
          <span className="detail-label">Pay rate:</span>
          <span className="detail-value">
            ${employee.payRate || 0} {employee.payRateType === 'hour' ? '/hour' : '/year'}
          </span>
        </div>
        
        {employee.payRateType === 'hour' && (
          <div className="payment-detail">
            <span className="detail-label">Hours:</span>
            <span className="detail-value">80</span>
          </div>
        )}
      </div>
      
      <div className="employee-payment-amount">
        <span className="amount-label">Net pay:</span>
        <span className="amount-value">${calculatePayment()}</span>
      </div>
    </div>
  );
};

export default Payroll;
