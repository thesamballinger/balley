import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaClock, FaPlay, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import { Employee } from '../types/Employee.ts';
import checkApi from '../services/checkApi.ts';
import '../styles/components/PayrollWizard.css';
import PayrollEmployeeCard from './PayrollEmployeeCard.tsx';

interface PayrollWizardProps {
  onComplete?: () => void;
}

const PayrollWizard: React.FC<PayrollWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [payrollDate, setPayrollDate] = useState<string>('');
  const [nextPayday, setNextPayday] = useState<string>('');
  const [runByDate, setRunByDate] = useState<string>('');
  const [isToday, setIsToday] = useState(false);
  const [payrollSummary, setPayrollSummary] = useState({
    totalGross: 0,
    totalTaxes: 0,
    totalNet: 0,
    employeeCount: 0
  });

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const data = await checkApi.getEmployees();
        // Filter only active employees with complete onboarding
        const activeEmployees = data.filter(emp => 
          emp.active !== false && 
          (!emp.onboard || emp.onboard.status === 'complete')
        );
        setEmployees(activeEmployees);
        
        // Calculate payroll summary
        calculatePayrollSummary(activeEmployees);
      } catch (error) {
        console.error('Error fetching employees for payroll:', error);
      } finally {
        setLoading(false);
      }
    };

    // Set dates
    const today = new Date();
    const nextPayday = new Date(today);
    
    // Find next 1st or 15th
    if (today.getDate() < 15) {
      nextPayday.setDate(15);
    } else {
      nextPayday.setMonth(nextPayday.getMonth() + 1);
      nextPayday.setDate(1);
    }
    
    // Format dates
    setNextPayday(formatDate(nextPayday, true));
    
    // Run by date is typically a few days before
    const runBy = new Date(nextPayday);
    runBy.setDate(runBy.getDate() - 4); // 4 days before payday
    setRunByDate(formatDate(runBy, true));
    
    // Check if run by date is today
    const todayStr = formatDate(today);
    const runByStr = formatDate(runBy);
    setIsToday(todayStr === runByStr);
    
    // Set payroll date (usually the period end date)
    setPayrollDate(formatDate(today));

    fetchEmployees();
  }, []);

  const formatDate = (date: Date, includeMonth = false) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    if (includeMonth) {
      return `${months[date.getMonth()]} ${date.getDate()}${getOrdinalSuffix(date.getDate())}`;
    }
    
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const getOrdinalSuffix = (day: number) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  const calculatePayrollSummary = (employees: Employee[]) => {
    let totalGross = 0;
    let totalTaxes = 0;
    let totalNet = 0;

    employees.forEach(employee => {
      // Calculate estimated pay based on pay rate
      let grossPay = 0;
      
      if (employee.payRate) {
        if (employee.payRateType === 'hour') {
          // Assume 80 hours per bi-weekly pay period
          grossPay = employee.payRate * 80;
        } else {
          // Annual salary divided by 24 for bi-weekly
          grossPay = employee.payRate / 24;
        }
      }
      
      // Estimate taxes (simplified for demo)
      const estimatedTax = grossPay * 0.25; // 25% tax rate for demo
      
      totalGross += grossPay;
      totalTaxes += estimatedTax;
      totalNet += (grossPay - estimatedTax);
    });

    setPayrollSummary({
      totalGross,
      totalTaxes,
      totalNet,
      employeeCount: employees.length
    });
  };

  const handleNextStep = () => {
    setStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setStep(prev => Math.max(1, prev - 1));
  };

  const handleRunPayroll = async () => {
    try {
      // In a real app, this would call the API to run payroll
      console.log('Running payroll for', payrollDate);
      
      // Move to confirmation step
      setStep(4);
      
      // Call onComplete callback if provided
      if (onComplete) {
        setTimeout(onComplete, 2000);
      }
    } catch (error) {
      console.error('Error running payroll:', error);
    }
  };

  const renderWelcomeStep = () => {
    return (
      <div className="payroll-welcome">
        <div className="payroll-card">
          <h2>Hey {localStorage.getItem('userName') || 'there'} 👋</h2>
          
          <div className="payroll-info">
            <div className="info-item">
              <div className="info-icon">
                <FaCalendarAlt />
              </div>
              <div className="info-text">
                <p>This is your next payday</p>
                <h3>{nextPayday}</h3>
              </div>
            </div>
            
            <div className="info-item">
              <div className="info-icon alert">
                <FaClock />
              </div>
              <div className="info-text">
                <p>You need to run this payroll by:</p>
                <h3>{runByDate} {isToday && '(today)'}</h3>
              </div>
            </div>
          </div>
          
          <button 
            className="primary-button"
            onClick={handleNextStep}
          >
            <FaPlay /> Start payroll
          </button>
        </div>
      </div>
    );
  };

  const renderReviewStep = () => {
    return (
      <div className="payroll-review">
        <h2>Review Payroll</h2>
        
        <div className="payroll-summary">
          <div className="summary-card">
            <div className="summary-item">
              <span className="summary-label">Total Gross Pay</span>
              <span className="summary-value">${payrollSummary.totalGross.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Total Taxes & Deductions</span>
              <span className="summary-value">-${payrollSummary.totalTaxes.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="summary-item total">
              <span className="summary-label">Total Net Pay</span>
              <span className="summary-value">${payrollSummary.totalNet.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
        
        <h3>Employee Details</h3>
        
        <div className="employee-list">
          {loading ? (
            <div className="loading">Loading employee data...</div>
          ) : (
            employees.map(employee => {
              // Calculate pay for this employee
              let grossPay = 0;
              
              if (employee.payRate) {
                if (employee.payRateType === 'hour') {
                  // Assume 80 hours per bi-weekly pay period
                  grossPay = employee.payRate * 80;
                } else {
                  // Annual salary divided by 24 for bi-weekly
                  grossPay = employee.payRate / 24;
                }
              }
              
              // Estimate taxes (simplified for demo)
              const taxes = grossPay * 0.25; // 25% tax rate for demo
              const netPay = grossPay - taxes;
              
              return (
                <PayrollEmployeeCard
                  key={employee.id}
                  employee={employee}
                  grossPay={grossPay}
                  taxes={taxes}
                  netPay={netPay}
                />
              );
            })
          )}
        </div>
        
        <div className="wizard-buttons">
          <button className="secondary-button" onClick={handlePrevStep}>
            Back
          </button>
          <button className="primary-button" onClick={handleNextStep}>
            Continue
          </button>
        </div>
      </div>
    );
  };

  const renderConfirmStep = () => {
    return (
      <div className="payroll-confirm">
        <h2>Confirm and Run Payroll</h2>
        
        <div className="confirm-card">
          <div className="confirm-icon">
            <FaExclamationTriangle />
          </div>
          <div className="confirm-text">
            <h3>Important: This will process real payments</h3>
            <p>
              You are about to run payroll for {payrollSummary.employeeCount} employees with a total net pay of 
              ${payrollSummary.totalNet.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.
            </p>
            <p>
              Funds will be withdrawn from your company account and employees will be paid on {nextPayday}.
            </p>
          </div>
        </div>
        
        <div className="wizard-buttons">
          <button className="secondary-button" onClick={handlePrevStep}>
            Back
          </button>
          <button className="primary-button confirm" onClick={handleRunPayroll}>
            Run Payroll
          </button>
        </div>
      </div>
    );
  };

  const renderSuccessStep = () => {
    return (
      <div className="payroll-success">
        <div className="success-card">
          <div className="success-icon">
            <FaCheck />
          </div>
          <h2>Payroll Successfully Submitted!</h2>
          <p>
            Your payroll has been scheduled for {nextPayday}. 
            Employees will receive their payments on time.
          </p>
          <p>
            Total amount: ${payrollSummary.totalNet.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p>
            You can view the details in the Reports section.
          </p>
        </div>
      </div>
    );
  };

  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        return renderWelcomeStep();
      case 2:
        return renderReviewStep();
      case 3:
        return renderConfirmStep();
      case 4:
        return renderSuccessStep();
      default:
        return renderWelcomeStep();
    }
  };

  return (
    <div className="payroll-wizard">
      {/* Progress indicator */}
      <div className="wizard-progress">
        <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
          <div className="step-number">1</div>
          <div className="step-label">Welcome</div>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
          <div className="step-number">2</div>
          <div className="step-label">Review</div>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <div className="step-label">Confirm</div>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${step >= 4 ? 'active' : ''}`}>
          <div className="step-number">4</div>
          <div className="step-label">Complete</div>
        </div>
      </div>
      
      {/* Current step content */}
      <div className="wizard-content">
        {renderCurrentStep()}
      </div>
    </div>
  );
};

export default PayrollWizard;
