import React from 'react';
import '../styles/Main.css';
import { NavSection } from './Sidebar.tsx';
import Employees from '../screens/Employees.tsx';
import BalleyAI from '../screens/BalleyAI.tsx';

interface MainProps {
  selectedSection: string;
}

const Main: React.FC<MainProps> = ({ selectedSection }) => {
  const renderContent = () => {
    switch (selectedSection) {
      case 'home':
        return (
          <>
            <div className="main-header">
              <h1>Welcome Gavano!</h1>
              <p>Here's some helpful stats on your payroll and industry within MN</p>
            </div>
            <div className="dashboard-content">
              {/* Dashboard content would go here */}
              <h2>Home Dashboard Content</h2>
            </div>
          </>
        );
      case 'payroll':
        return (
          <>
            <div className="main-header">
              <h1>Payroll</h1>
              <p>Manage your company's payroll</p>
            </div>
            <div className="dashboard-content">
              <h2>Payroll Content</h2>
            </div>
          </>
        );
      case 'employees':
        return <Employees />;
      case 'balley A.I.':
        return <BalleyAI />;
      case 'settings':
        return (
          <>
            <div className="main-header">
              <h1>Settings</h1>
              <p>Configure your account preferences</p>
            </div>
            <div className="dashboard-content">
              <h2>Settings Content</h2>
            </div>
          </>
        );
      default:
        return (
          <>
            <div className="main-header">
              <h1>Welcome Gavano!</h1>
              <p>Here's some helpful stats on your payroll and industry within MN</p>
            </div>
            <div className="dashboard-content">
              <h2>Home Dashboard Content</h2>
            </div>
          </>
        );
    }
  };

  return (
    <div className="main-container">
      {renderContent()}
    </div>
  );
};

export default Main;