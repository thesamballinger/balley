import React from 'react';
import '../styles/Main.css';
import Employees from '../screens/Employees.tsx';
import BalleyAI from '../screens/BalleyAI.tsx';
import Payroll from '../screens/Payroll.tsx';
import Home from '../screens/Home.tsx';
import Settings from '../screens/Settings.tsx';
import Profile from '../screens/Profile.tsx';

interface MainProps {
  selectedSection: string;
}

const Main: React.FC<MainProps> = ({ selectedSection }) => {
  const renderContent = () => {
    switch (selectedSection) {
      case 'home':
        return <Home />;
      case 'payroll':
        return <Payroll />;
      case 'employees':
        return <Employees />;
      case 'balley A.I.':
        return <BalleyAI />;
      case 'settings':
        return <Settings />;
      case 'profile':
        return <Profile />;
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