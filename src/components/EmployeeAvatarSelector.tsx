import React, { useState, useEffect } from 'react';

interface EmployeeAvatarSelectorProps {
  initialSeed?: string;
  onSelect: (avatarUrl: string) => void;
}

const EmployeeAvatarSelector: React.FC<EmployeeAvatarSelectorProps> = ({ initialSeed, onSelect }) => {
  const [currentSeed, setCurrentSeed] = useState(initialSeed || Math.random().toString(36).substring(7));
  const [avatarStyle, setAvatarStyle] = useState('personas');
  
  const avatarStyles = [
    { id: 'personas', name: 'Personas' },
    { id: 'avataaars', name: 'Avataaars' },
    { id: 'bottts', name: 'Bottts' },
    { id: 'micah', name: 'Micah' },
    { id: 'adventurer', name: 'Adventurer' },
    { id: 'lorelei', name: 'Lorelei' }
  ];

  const generateRandomSeed = () => {
    const newSeed = Math.random().toString(36).substring(7);
    setCurrentSeed(newSeed);
  };

  useEffect(() => {
    const avatarUrl = `https://api.dicebear.com/7.x/${avatarStyle}/svg?seed=${currentSeed}`;
    onSelect(avatarUrl);
  }, [currentSeed, avatarStyle, onSelect]);

  return (
    <div style={{ textAlign: 'center' }}>
      <img 
        src={`https://api.dicebear.com/7.x/${avatarStyle}/svg?seed=${currentSeed}`}
        alt="Employee avatar"
        style={{ 
          width: '150px', 
          height: '150px', 
          borderRadius: '50%',
          marginBottom: '1rem',
          backgroundColor: '#f0f0f0',
          border: '2px solid #ddd'
        }}
      />
      
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Avatar Style:</label>
        <select 
          value={avatarStyle}
          onChange={(e) => setAvatarStyle(e.target.value)}
          style={{ 
            padding: '0.5rem', 
            borderRadius: '4px',
            border: '1px solid #ddd',
            width: '100%',
            maxWidth: '250px'
          }}
        >
          {avatarStyles.map(style => (
            <option key={style.id} value={style.id}>{style.name}</option>
          ))}
        </select>
      </div>
      
      <button
        onClick={generateRandomSeed}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        Generate Random Avatar
      </button>
    </div>
  );
};

export default EmployeeAvatarSelector;
