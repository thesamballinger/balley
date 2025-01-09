import React, { useState } from 'react';
import SideBar from './components/Sidebar.tsx';
import Main from './components/Main.tsx';

const App = () => {
  const [selectedSection, setSelectedSection] = useState('home');

  // Styles for the root container to have a light grey background and a flex layout
  const appContainerStyle = {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    display: 'flex',
  };

  return (
    <div style={appContainerStyle}>
      {/* Side Bar */}
      <SideBar 
        selectedSection={selectedSection} 
        onSectionSelect={setSelectedSection} 
      />

      {/* Main Panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginRight: '2rem' }}>
        <Main selectedSection={selectedSection} />
      </div>
    </div>
  );
};

export default App;