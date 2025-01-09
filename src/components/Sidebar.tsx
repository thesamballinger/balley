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
  | 'profile'
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
  profile: <FaUser />,
  settings: <FaCog />,
};

const SideBar = ({
  selectedSection,
  onSectionSelect,
}: SideBarProps) => {
  return (
    <div className="sidebar">
      <h2>balley</h2>
      {['home', 'payroll', 'employees', 'balley A.I.', 'profile', 'settings'].map((section) => (
        <div
          key={section}
          className={`nav-item ${selectedSection === section ? 'selected' : ''} ${section === 'profile' ? 'profile-gap' : ''} ${section === 'balley A.I.' ? 'balleyAI' : ''}`}
          onClick={() => onSectionSelect(section as NavSection)}
        >
          <span className="icon">{icons[section as NavSection]}</span>
          {section.charAt(0).toUpperCase() + section.slice(1)}
        </div>
      ))}
    </div>
  );
};

export default SideBar;