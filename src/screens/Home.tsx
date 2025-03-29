import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaChartPie, FaEye, FaPaypal, FaCheckCircle, FaChevronRight } from 'react-icons/fa';
import checkApi from '../services/checkApi.ts';
import { Employee } from '../types/Employee.ts';
import '../styles/screens/Home.css';

const Home: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [totalOutstanding, setTotalOutstanding] = useState(58764.25); // Mock data
  const [nextPayrollDate, setNextPayrollDate] = useState('');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [payrollBreakdown, setPayrollBreakdown] = useState({
    salaries: 234.20,
    taxes: 95.86,
    benefits: 181.34,
    other: 37.13
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch employees
        const employeeData = await checkApi.getEmployees();
        setEmployees(employeeData);
        
        // Set mock transactions based on employees
        const mockTransactions = generateMockTransactions(employeeData);
        setTransactions(mockTransactions);
        
        // Set user name (in a real app, this would come from auth)
        setUserName('Gavano');
        
        // Set next payroll date
        const today = new Date();
        const nextMonth = new Date(today);
        nextMonth.setMonth(today.getMonth() + 1);
        nextMonth.setDate(1);
        setNextPayrollDate(`${getMonthName(nextMonth.getMonth())} 1st, ${nextMonth.getFullYear()}`);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Helper to generate mock transactions
  const generateMockTransactions = (employees: Employee[]) => {
    if (!employees.length) return [];
    
    // Use the first employee for mock data
    const employee = employees[0];
    
    // Create 5 months of transactions
    const today = new Date();
    const transactions = [];
    
    for (let i = 0; i < 5; i++) {
      const date = new Date();
      date.setMonth(today.getMonth() - i);
      date.setDate(1);
      
      transactions.push({
        id: `trans-${i}`,
        employeeId: employee.id,
        employeeName: employee.name || `${employee.first_name} ${employee.last_name}`,
        amount: 1546.12,
        date: date,
        company: 'Saphore Inc.'
      });
    }
    
    return transactions;
  };

  // Helper to get month name
  const getMonthName = (monthIndex: number): string => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthIndex];
  };

  // Format date for display
  const formatDate = (date: Date): string => {
    const day = date.getDate();
    const month = getMonthName(date.getMonth()).substring(0, 3);
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
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
    <div className="home-container">
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      ) : (
        <>
          <div className="welcome-header">
            <h1>Welcome {userName}!</h1>
            <p>Here's a quick overview of your payroll</p>
          </div>
          
          <div className="dashboard-grid">
            {/* Next Payroll Card */}
            <div className="dashboard-card next-payroll">
              <h3>Next Payroll</h3>
              <div className="next-payroll-date">
                <FaCalendarAlt className="calendar-icon" />
                <span>{nextPayrollDate}</span>
              </div>
              <button className="action-button">
                Run Payroll
              </button>
            </div>
            
            {/* Total Outstanding Card */}
            <div className="dashboard-card outstanding">
              <h3>Total Outstanding</h3>
              <div className="amount-display">
                <span className="currency">$</span>
                <span className="amount">{Math.floor(totalOutstanding).toLocaleString()}</span>
                <span className="decimals">.{(totalOutstanding % 1).toFixed(2).substring(2)}</span>
              </div>
              <div className="trend-indicator positive">
                <span>↑ 3.2% from last month</span>
              </div>
            </div>
            
            {/* Payment Method Card */}
            <div className="dashboard-card payment-method">
              <div className="card-header">
                <h3>Withdraw Method</h3>
                <button className="more-options">•••</button>
              </div>
              <div className="payment-method-content">
                <div className="payment-provider">
                  <FaPaypal className="provider-icon" />
                  <div className="provider-details">
                    <span className="provider-name">PayPal</span>
                    <span className="provider-status">Verified</span>
                  </div>
                </div>
                <div className="connection-status">
                  <FaCheckCircle className="status-icon" />
                  <span>Connected</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="dashboard-row">
            {/* Payroll Summary Card */}
            <div className="dashboard-card payroll-summary">
              <div className="card-header">
                <h3>Payroll Summary</h3>
                <div className="period-selector">
                  <span>Last 30 days</span>
                  <span className="dropdown-arrow">▼</span>
                </div>
              </div>
              
              <div className="summary-content">
                <div className="chart-container">
                  <div className="donut-chart">
                    {/* This would be replaced with a real chart library in production */}
                    <div className="chart-placeholder">
                      <FaChartPie className="chart-icon" />
                    </div>
                  </div>
                </div>
                
                <div className="breakdown-list">
                  <div className="breakdown-item salaries">
                    <div className="item-label">
                      <span className="color-indicator"></span>
                      <span>Salaries</span>
                    </div>
                    <div className="item-amount">
                      <span className="currency">$</span>
                      <span>{payrollBreakdown.salaries.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="breakdown-item taxes">
                    <div className="item-label">
                      <span className="color-indicator"></span>
                      <span>Taxes</span>
                    </div>
                    <div className="item-amount">
                      <span className="currency">$</span>
                      <span>{payrollBreakdown.taxes.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="breakdown-item benefits">
                    <div className="item-label">
                      <span className="color-indicator"></span>
                      <span>Benefits</span>
                    </div>
                    <div className="item-amount">
                      <span className="currency">$</span>
                      <span>{payrollBreakdown.benefits.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="breakdown-item other">
                    <div className="item-label">
                      <span className="color-indicator"></span>
                      <span>Other</span>
                    </div>
                    <div className="item-amount">
                      <span className="currency">$</span>
                      <span>{payrollBreakdown.other.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <button className="view-all-button">
                <FaEye className="button-icon" />
                <span>View Transactions</span>
              </button>
            </div>
            
            {/* Transaction History Card */}
            <div className="dashboard-card transaction-history">
              <div className="card-header">
                <h3>Transaction History</h3>
                <button className="view-all-link">See All</button>
              </div>
              
              <div className="transaction-list">
                {transactions.map((transaction, index) => (
                  <div className="transaction-item" key={transaction.id}>
                    <div className="transaction-avatar" style={{ backgroundColor: getBackgroundColor(transaction.employeeName) }}>
                      <img 
                        src={`https://api.dicebear.com/7.x/personas/svg?seed=${transaction.employeeName}`} 
                        alt={`${transaction.employeeName} avatar`} 
                      />
                    </div>
                    
                    <div className="transaction-details">
                      <div className="transaction-name">{transaction.employeeName}</div>
                      <div className="transaction-company">{transaction.company}</div>
                    </div>
                    
                    <div className="transaction-amount">
                      <div className="amount">${transaction.amount.toFixed(2)}</div>
                      <div className="date">{formatDate(transaction.date)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Announcement Banner */}
          <div className="announcement-banner">
            <div className="banner-icon">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path d="M20 0L0 20H10V40H30V20H40L20 0Z" fill="#FF5A5F"/>
              </svg>
            </div>
            <div className="banner-content">
              <h3>Heads up, Minnesota Employers!</h3>
              <p>The state minimum wage rates for 2024 have increased to $10.85/hour (large employers) and $8.85/hour...</p>
            </div>
            <button className="banner-action">
              <FaChevronRight />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
