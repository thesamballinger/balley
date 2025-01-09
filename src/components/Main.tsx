import React from 'react';
import '../styles/Main.css';
import { NavSection } from './Sidebar.tsx';

interface MainProps {
  selectedSection: NavSection;
}

const Main: React.FC<MainProps> = ({ selectedSection }) => {
  const renderContent = () => {
    switch (selectedSection) {
      case 'home':
        return <h2>Home Screen Content</h2>;
      case 'payroll':
        return <h2>Payroll Screen Content</h2>;
      case 'employees':
        return <h2>Employees Screen Content</h2>;
      case 'balley A.I.':
        return <h2>AI Assistant Screen Content</h2>;
      case 'profile':
        return <h2>Profile Screen Content</h2>;
      case 'settings':
        return <h2>Settings Screen Content</h2>;
      default:
        return <h2>Home Screen Content</h2>;
    }
  };

  return (
    <div className="main-container">
      {renderContent()}
    </div>
  );
};

export default Main;