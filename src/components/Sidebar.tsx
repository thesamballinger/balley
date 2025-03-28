import React from 'react';
import '../styles/Sidebar.css';
import { FaUser, FaCog } from 'react-icons/fa';
import { MdDashboard } from "react-icons/md";
import { RiMoneyDollarBoxFill } from "react-icons/ri";
import { BsPersonSquare } from "react-icons/bs";
import { RiRobot2Fill } from "react-icons/ri";

export type NavSection = 
  | 'home'
  | 'payroll'
  | 'employees'
  | 'balley A.I.'
  | 'settings';

interface SideBarProps {
  selectedSection: NavSection;
  onSectionSelect: (section: NavSection) => void;
}

const icons = {
  home: <MdDashboard />,
  payroll: <RiMoneyDollarBoxFill />,
  employees: <BsPersonSquare />,
  'balley A.I.': <RiRobot2Fill />,
  settings: <FaCog />,
};

const SideBar = ({
  selectedSection,
  onSectionSelect,
}: SideBarProps) => {
  return (
    <div className="sidebar">
      <h2>balley</h2>
      
      <div className="nav-menu">
        {['home', 'payroll', 'employees', 'balley A.I.'].map((section) => (
          <div
            key={section}
            className={`nav-item ${selectedSection === section ? 'selected' : ''} ${section === 'balley A.I.' ? 'balleyAI' : ''}`}
            onClick={() => onSectionSelect(section as NavSection)}
          >
            <span className="icon">{icons[section as NavSection]}</span>
            {section === 'home' ? 'Home' : 
             section === 'balley A.I.' ? 'AI Assistant' : 
             section.charAt(0).toUpperCase() + section.slice(1)}
          </div>
        ))}
      </div>
      
      <div className="profile-section">
        <div className="profile-container">
          <img 
            src="https://api.dicebear.com/7.x/personas/svg?seed=Gavano" 
            alt="Profile" 
            className="profile-avatar" 
          />
          <div className="profile-info">
            <span className="profile-name">Gavano</span>
            <span className="profile-role">HR Manager</span>
          </div>
        </div>
        
        <div
          className={`nav-item ${selectedSection === 'settings' ? 'selected' : ''}`}
          onClick={() => onSectionSelect('settings')}
        >
          <span className="icon">{icons.settings}</span>
          Settings
        </div>
      </div>
    </div>
  );
};

export default SideBar;