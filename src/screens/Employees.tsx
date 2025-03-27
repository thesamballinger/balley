import React, { useState, useEffect } from 'react';
import EmployeeCard, { Employee } from '../components/EmployeeCard.tsx';
import ContractorCard, { Contractor } from '../components/ContractorCard.tsx';
import EmployeeDetails from '../components/EmployeeDetails.tsx';
import ContractorDetails from '../components/ContractorDetails.tsx';
import AddEmployeeWizard from '../components/AddEmployeeWizard.tsx';
import AddContractorWizard from '../components/AddContractorWizard.tsx';
import { FaPlus, FaSearch, FaUserTie, FaUsers } from 'react-icons/fa';
import '../styles/screens/Employees.css';

type TabType = 'employees' | 'contractors';

const Employees: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('employees');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | number | null>(null);
  const [selectedContractorId, setSelectedContractorId] = useState<string | number | null>(null);
  const [showAddEmployeeWizard, setShowAddEmployeeWizard] = useState(false);
  const [showAddContractorWizard, setShowAddContractorWizard] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch employees and contractors on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        // Mock data for employees
        const mockEmployees: Employee[] = [
          {
            id: '1',
            name: 'Nick Johnson',
            firstName: 'Nick',
            lastName: 'Johnson',
            role: 'Product Manager',
            employmentType: 'Employee (W2)',
            payRate: 70000,
            payRateType: 'year',
            avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Nick Johnson',
            email: 'nickj@gmail.com',
            phone: '(952) 435-6209',
            birthdate: 'May 3, 2000',
            ssnLast4: '2244',
            address: '1209 Earle Way, Burnsville, MN 55306',
            federalWithholdings: {
              filingStatus: 'Married',
              allowances: 0,
              dependents: 0,
              extraWithholdings: 0
            },
            stateWithholdings: {
              filingStatus: 'Married',
              allowances: 0,
              dependents: 0,
              extraWithholdings: 0
            },
            paymentMethod: {
              bankName: 'Wells Fargo',
              accountLast4: '5803',
              payFrequency: 'Bi-weekly payouts'
            }
          },
          {
            id: '2',
            name: 'Meghan Sydney',
            firstName: 'Meghan',
            lastName: 'Sydney',
            role: 'Sales Specialist',
            employmentType: 'Employee (W2)',
            payRate: 28,
            payRateType: 'hour',
            avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Meghan Sydney',
            email: 'meghan@example.com',
            phone: '(612) 555-1234',
            birthdate: 'June 15, 1995',
            ssnLast4: '8765',
            address: '123 Main St, Minneapolis, MN 55401',
            federalWithholdings: {
              filingStatus: 'Single',
              allowances: 1,
              dependents: 0,
              extraWithholdings: 0
            },
            stateWithholdings: {
              filingStatus: 'Single',
              allowances: 1,
              dependents: 0,
              extraWithholdings: 0
            },
            paymentMethod: {
              bankName: 'US Bank',
              accountLast4: '4321',
              payFrequency: 'Bi-weekly payouts'
            }
          }
        ];
        
        // Mock data for contractors
        const mockContractors: Contractor[] = [
          {
            id: '3',
            name: 'Charlie Kirk',
            firstName: 'Charlie',
            lastName: 'Kirk',
            role: 'Software Developer',
            payRate: 40,
            payRateType: 'hour',
            avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Charlie Kirk',
            email: 'charlie@example.com',
            phone: '(651) 555-9876',
            company: 'Kirk Development LLC',
            address: '456 Oak St, St. Paul, MN 55102',
            taxId: '12-3456789',
            paymentMethod: {
              bankName: 'Chase',
              accountLast4: '9876',
              payFrequency: 'Monthly payouts'
            }
          },
          {
            id: '4',
            name: 'Sarah Miller',
            firstName: 'Sarah',
            lastName: 'Miller',
            role: 'UX Designer',
            payRate: 50,
            payRateType: 'hour',
            avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Sarah Miller',
            email: 'sarah@designco.com',
            phone: '(612) 555-4321',
            company: 'Design Co.',
            address: '789 Pine St, Minneapolis, MN 55403',
            taxId: '98-7654321',
            paymentMethod: {
              bankName: 'Bank of America',
              accountLast4: '5432',
              payFrequency: 'Bi-weekly payouts'
            }
          }
        ];
        
        setEmployees(mockEmployees);
        setContractors(mockContractors);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleAddEmployee = (newEmployee: Omit<Employee, 'id'>) => {
    const newId = Date.now().toString();
    const employeeWithId: Employee = {
      ...newEmployee,
      id: newId
    };
    
    setEmployees(prev => [...prev, employeeWithId]);
    setShowAddEmployeeWizard(false);
  };

  const handleAddContractor = (newContractor: Omit<Contractor, 'id'>) => {
    const newId = Date.now().toString();
    const contractorWithId: Contractor = {
      ...newContractor,
      id: newId
    };
    
    setContractors(prev => [...prev, contractorWithId]);
    setShowAddContractorWizard(false);
  };

  const handleUpdateEmployee = (updatedEmployee: Employee) => {
    setEmployees(prev => 
      prev.map(emp => emp.id === updatedEmployee.id ? updatedEmployee : emp)
    );
  };

  const handleUpdateContractor = (updatedContractor: Contractor) => {
    setContractors(prev => 
      prev.map(con => con.id === updatedContractor.id ? updatedContractor : con)
    );
  };

  const handleSelectEmployee = (employeeId: string | number) => {
    setSelectedContractorId(null);
    setSelectedEmployeeId(employeeId === selectedEmployeeId ? null : employeeId);
  };

  const handleSelectContractor = (contractorId: string | number) => {
    setSelectedEmployeeId(null);
    setSelectedContractorId(contractorId === selectedContractorId ? null : contractorId);
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSelectedEmployeeId(null);
    setSelectedContractorId(null);
  };

  // Get the selected employee or contractor
  const selectedEmployee = employees.find(emp => emp.id === selectedEmployeeId);
  const selectedContractor = contractors.find(con => con.id === selectedContractorId);

  // Filter employees and contractors based on search query
  const filteredEmployees = employees.filter(employee => 
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredContractors = contractors.filter(contractor => 
    contractor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contractor.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contractor.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="employees-container">
      <div className="employees-header">
        <h1>
          {activeTab === 'employees' 
            ? `Select from your team of ${employees.length}` 
            : `Select from your contractors (${contractors.length})`}
        </h1>
        <div className="employees-actions">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <button 
            className="add-button"
            onClick={() => activeTab === 'employees' 
              ? setShowAddEmployeeWizard(true) 
              : setShowAddContractorWizard(true)
            }
          >
            <FaPlus /> {activeTab === 'employees' ? 'Add Employee' : 'Add Contractor'}
          </button>
        </div>
      </div>

      <div className="tab-container">
        <div 
          className={`tab ${activeTab === 'employees' ? 'active' : ''}`}
          onClick={() => handleTabChange('employees')}
        >
          <FaUsers /> Employees
        </div>
        <div 
          className={`tab ${activeTab === 'contractors' ? 'active' : ''}`}
          onClick={() => handleTabChange('contractors')}
        >
          <FaUserTie /> Contractors
        </div>
      </div>

      <div className="employees-content">
        <div className={`employees-list ${selectedEmployee || selectedContractor ? 'with-details' : ''}`}>
          {isLoading ? (
            <div className="loading-container">
              <p>Loading...</p>
            </div>
          ) : activeTab === 'employees' ? (
            <div className="employees-grid">
              {filteredEmployees.map(employee => (
                <EmployeeCard
                  key={employee.id}
                  employee={employee}
                  isSelected={employee.id === selectedEmployeeId}
                  onSelect={handleSelectEmployee}
                />
              ))}
              <div 
                className="add-card"
                onClick={() => setShowAddEmployeeWizard(true)}
              >
                <div className="add-icon">+</div>
                <p>Add Employee</p>
              </div>
            </div>
          ) : (
            <div className="employees-grid">
              {filteredContractors.map(contractor => (
                <ContractorCard
                  key={contractor.id}
                  contractor={contractor}
                  isSelected={contractor.id === selectedContractorId}
                  onSelect={handleSelectContractor}
                />
              ))}
              <div 
                className="add-card"
                onClick={() => setShowAddContractorWizard(true)}
              >
                <div className="add-icon">+</div>
                <p>Add Contractor</p>
              </div>
            </div>
          )}
        </div>

        {selectedEmployee && (
          <div className="details-panel">
            <EmployeeDetails 
              employee={selectedEmployee} 
              onSave={handleUpdateEmployee} 
            />
          </div>
        )}

        {selectedContractor && (
          <div className="details-panel">
            <ContractorDetails 
              contractor={selectedContractor} 
              onSave={handleUpdateContractor} 
            />
          </div>
        )}
      </div>

      {showAddEmployeeWizard && (
        <AddEmployeeWizard
          onClose={() => setShowAddEmployeeWizard(false)}
          onAddEmployee={handleAddEmployee}
        />
      )}

      {showAddContractorWizard && (
        <AddContractorWizard
          onClose={() => setShowAddContractorWizard(false)}
          onAddContractor={handleAddContractor}
        />
      )}
    </div>
  );
};

export default Employees;
