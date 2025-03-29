import React from 'react';
import { FaHome, FaDollarSign, FaUsers, FaRobot, FaCog } from 'react-icons/fa';
import '../styles/components/Sidebar.css';

interface SidebarProps {
  selectedSection: string;
  onSectionSelect: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedSection, onSectionSelect }) => {
  // Handle click on the HR Manager profile
  const handleProfileClick = () => {
    onSectionSelect('profile');
  };
  
  return (
    <div className="sidebar">
      <div className="logo">
        <h1>balley</h1>
      </div>
      
      <nav className="nav-menu">
        <div 
          className={`nav-item ${selectedSection === 'home' ? 'selected' : ''}`}
          onClick={() => onSectionSelect('home')}
        >
          <FaHome className="nav-icon" />
          <span>Home</span>
        </div>
        
        <div 
          className={`nav-item ${selectedSection === 'payroll' ? 'selected' : ''}`}
          onClick={() => onSectionSelect('payroll')}
        >
          <FaDollarSign className="nav-icon" />
          <span>Payroll</span>
        </div>
        
        <div 
          className={`nav-item ${selectedSection === 'employees' ? 'selected' : ''}`}
          onClick={() => onSectionSelect('employees')}
        >
          <FaUsers className="nav-icon" />
          <span>Employees</span>
        </div>
        
        <div 
          className={`nav-item balleyAI ${selectedSection === 'balley A.I.' ? 'selected' : ''}`}
          onClick={() => onSectionSelect('balley A.I.')}
        >
          <FaRobot className="nav-icon" />
          <span>AI Assistant</span>
        </div>
      </nav>
      
      <div className="sidebar-footer">
        <div className="user-profile" onClick={handleProfileClick}>
          <div className="user-avatar">
            <img 
              src="https://api.dicebear.com/7.x/personas/svg?seed=Gavano" 
              alt="User Avatar" 
            />
          </div>
          <div className="user-info">
            <div className="user-name">Gavano</div>
            <div className="user-role">HR Manager</div>
          </div>
        </div>
        
        <div 
          className={`nav-item ${selectedSection === 'settings' ? 'selected' : ''}`}
          onClick={() => onSectionSelect('settings')}
        >
          <FaCog className="nav-icon" />
          <span>Settings</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;