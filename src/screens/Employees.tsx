import React, { useState, useEffect } from 'react';
import EmployeeCard from '../components/EmployeeCard.tsx';
import ContractorCard from '../components/ContractorCard.tsx';
import EmployeeDetails from '../components/EmployeeDetails.tsx';
import ContractorDetails from '../components/ContractorDetails.tsx';
import AddEmployeeWizard from '../components/AddEmployeeWizard.tsx';
import AddContractorWizard from '../components/AddContractorWizard.tsx';
import { FaPlus, FaSearch, FaUserTie, FaUsers, FaSpinner } from 'react-icons/fa';
import { Employee } from '../types/Employee.ts';
import { Contractor } from '../types/Contractor.ts';
import { checkApi, localStorageService } from '../services/checkApi.ts';
import '../styles/screens/Employees.css';

const Employees: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'employees' | 'contractors'>('employees');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [selectedContractorId, setSelectedContractorId] = useState<string | null>(null);
  const [showAddEmployeeWizard, setShowAddEmployeeWizard] = useState(false);
  const [showAddContractorWizard, setShowAddContractorWizard] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch employees and contractors on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch employees from our FastAPI backend
        console.log('Fetching employees...');
        const fetchedEmployees = await checkApi.getEmployees();
        console.log('Fetched employees:', fetchedEmployees);
        setEmployees(fetchedEmployees);
        
        // For contractors, we'll use local storage
        const storedContractors = localStorageService.getContractors();
        setContractors(storedContractors);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load employees. Please try again later.');
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Test API connection on mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('Testing API connection...');
        await checkApi.getEmployees();
        console.log('API connection successful');
      } catch (error) {
        console.error('Connection test failed', error);
      }
    };
    
    testConnection();
  }, []);

  // Add this after fetching employees
  useEffect(() => {
    if (employees.length > 0) {
      console.log('First employee structure:', employees[0]);
      console.log('Employee IDs:', employees.map(e => e.id));
    }
  }, [employees]);

  // Handle adding a new employee
  const handleAddEmployee = async (newEmployee: Omit<Employee, 'id'>) => {
    try {
      setIsLoading(true);
      
      // Create employee via our FastAPI backend
      const createdEmployee = await checkApi.createEmployee(newEmployee as Partial<Employee>);
      
      // Update local state
      setEmployees(prev => [...prev, createdEmployee]);
      setShowAddEmployeeWizard(false);
      setIsLoading(false);
      
      // Select the newly created employee
      setSelectedEmployeeId(createdEmployee.id as string);
      setActiveTab('employees');
    } catch (error) {
      console.error('Error adding employee:', error);
      setError('Failed to add employee. Please try again.');
      setIsLoading(false);
    }
  };

  // Handle adding a new contractor
  const handleAddContractor = (newContractor: Omit<Contractor, 'id'>) => {
    // Add contractor to local storage
    const createdContractor = localStorageService.addContractor(newContractor as Contractor);
    
    // Update local state
    setContractors(prev => [...prev, createdContractor]);
    setShowAddContractorWizard(false);
    
    // Select the newly created contractor
    setSelectedContractorId(createdContractor.id as string);
    setActiveTab('contractors');
  };

  // Handle updating an employee
  const handleUpdateEmployee = async (updatedEmployee: Employee) => {
    try {
      setIsLoading(true);
      
      // Update employee via our FastAPI backend
      const result = await checkApi.updateEmployee(
        updatedEmployee.id as string, 
        updatedEmployee
      );
      
      // Update local state
      setEmployees(prev => 
        prev.map(emp => emp.id === updatedEmployee.id ? result : emp)
      );
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error updating employee:', error);
      setError('Failed to update employee. Please try again.');
      setIsLoading(false);
    }
  };

  // Handle updating a contractor
  const handleUpdateContractor = (updatedContractor: Contractor) => {
    // Update contractor in local storage
    const result = localStorageService.updateContractor(
      updatedContractor.id as string,
      updatedContractor
    );
    
    if (result) {
      // Update local state
      setContractors(prev => 
        prev.map(c => c.id === updatedContractor.id ? result : c)
      );
    }
  };

  // Filter employees and contractors based on search term
  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredContractors = contractors.filter(con => 
    con.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    con.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get selected employee and contractor
  const selectedEmployee = employees.find(emp => emp.id === selectedEmployeeId);
  const selectedContractor = contractors.find(con => con.id === selectedContractorId);

  return (
    <div className="employees-screen">
      <div className="employees-header">
        <div className="tab-container">
          <button 
            className={`tab-button ${activeTab === 'employees' ? 'active' : ''}`}
            onClick={() => setActiveTab('employees')}
          >
            <FaUsers /> Employees ({employees.length})
          </button>
          <button 
            className={`tab-button ${activeTab === 'contractors' ? 'active' : ''}`}
            onClick={() => setActiveTab('contractors')}
          >
            <FaUserTie /> Contractors ({contractors.length})
          </button>
        </div>
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
          <FaPlus /> Add {activeTab === 'employees' ? 'Employee' : 'Contractor'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="employees-content">
        <div className="employees-list">
          {isLoading ? (
            <div className="loading-container">
              <FaSpinner className="spinner" />
              <p>Loading...</p>
            </div>
          ) : activeTab === 'employees' ? (
            filteredEmployees.length > 0 ? (
              filteredEmployees.map((employee) => (
                <EmployeeCard
                  key={employee.id}
                  employee={employee}
                  isSelected={employee.id === selectedEmployeeId}
                  onClick={(id) => setSelectedEmployeeId(id)}
                />
              ))
            ) : (
              <div className="empty-state">
                <p>No employees found</p>
              </div>
            )
          ) : (
            filteredContractors.length > 0 ? (
              filteredContractors.map(contractor => (
                <ContractorCard
                  key={contractor.id}
                  contractor={contractor}
                  isSelected={contractor.id === selectedContractorId}
                  onClick={() => setSelectedContractorId(contractor.id as string)}
                />
              ))
            ) : (
              <div className="empty-state">
                <p>No contractors found</p>
              </div>
            )
          )}
        </div>

        <div className="employee-details-container">
          {activeTab === 'employees' && selectedEmployee ? (
            <EmployeeDetails 
              employee={selectedEmployee} 
              onSave={handleUpdateEmployee}
            />
          ) : activeTab === 'contractors' && selectedContractor ? (
            <ContractorDetails 
              contractor={selectedContractor}
              onSave={handleUpdateContractor}
            />
          ) : (
            <div className="empty-details">
              <p>Select an {activeTab === 'employees' ? 'employee' : 'contractor'} to view details</p>
            </div>
          )}
        </div>
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
