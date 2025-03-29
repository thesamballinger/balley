import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import SideBar from './components/Sidebar.tsx';
import Main from './components/Main.tsx';

const App = () => {
  const [selectedSection, setSelectedSection] = useState('home');

  // Styles for the root container with light grey background
  const appContainerStyle = {
    minHeight: '100vh',
    backgroundColor: 'lightgrey',
    display: 'flex',
    padding: '1.5rem',
    gap: '1.5rem',
  };

  return (
    <Router>
      <div style={appContainerStyle}>
        {/* Side Bar */}
        <SideBar 
          selectedSection={selectedSection} 
          onSectionSelect={setSelectedSection} 
        />

        {/* Main Panel */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Main selectedSection={selectedSection} />
        </div>
      </div>
    </Router>
  );
};

export default App;