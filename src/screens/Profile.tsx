import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaGlobe, FaClock, FaLanguage, FaPaypal, FaEllipsisH, FaPlus, FaCheck } from 'react-icons/fa';
import '../styles/screens/Profile.css';

const Profile: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userData, setUserData] = useState({
    fullName: 'Gavano Rawles',
    nickName: '',
    email: 'gavanorawles@gmail.com',
    gender: '',
    country: '',
    language: '',
    timezone: '',
    additionalEmails: [
      { email: 'alexarawles@gmail.com', addedDate: '1 month ago' }
    ]
  });
  
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 'paypal-1',
      type: 'PayPal',
      details: 'Verified',
      isConnected: true,
      icon: 'paypal'
    }
  ]);
  
  const [editing, setEditing] = useState({
    fullName: false,
    nickName: false,
    gender: false,
    country: false,
    language: false,
    timezone: false
  });
  
  // Generate avatar if no profile image is set
  useEffect(() => {
    if (!profileImage) {
      const avatarUrl = `https://api.dicebear.com/7.x/personas/svg?seed=${userData.fullName}`;
      setProfileImage(avatarUrl);
    }
    
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [userData.fullName, profileImage]);
  
  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Toggle edit mode for a field
  const toggleEdit = (field: keyof typeof editing) => {
    setEditing(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };
  
  // Handle profile image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Add new email address
  const handleAddEmail = () => {
    // In a real app, this would show a modal or form
    const newEmail = prompt('Enter new email address:');
    if (newEmail && newEmail.includes('@')) {
      setUserData(prev => ({
        ...prev,
        additionalEmails: [
          ...prev.additionalEmails,
          { email: newEmail, addedDate: 'Just now' }
        ]
      }));
    }
  };
  
  // Generate background color based on name
  const getBackgroundColor = (name: string) => {
    const colors = ['#ff9999', '#99ccff', '#99ff99', '#ffcc99', '#cc99ff', '#ff99cc'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };
  
  return (
    <div className="settings-container">
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading settings...</p>
        </div>
      ) : (
        <>
          {/* Profile Header */}
          <div className="profile-header">
            <div className="profile-image-container" style={{ backgroundColor: getBackgroundColor(userData.fullName) }}>
              <img 
                src={profileImage || `https://api.dicebear.com/7.x/personas/svg?seed=${userData.fullName}`} 
                alt="Profile" 
                className="profile-image" 
              />
              <label className="image-upload-overlay">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  className="image-upload-input" 
                />
                <span>Change</span>
              </label>
            </div>
            <div className="profile-info">
              <h2>{userData.fullName}</h2>
              <p>{userData.email}</p>
            </div>
          </div>
          
          {/* Personal Information Section */}
          <div className="settings-section">
            {/* Full Name */}
            <div className="settings-field">
              <label>Full Name</label>
              {editing.fullName ? (
                <div className="edit-field">
                  <input 
                    type="text" 
                    value={userData.fullName} 
                    onChange={(e) => handleInputChange('fullName', e.target.value)} 
                    className="settings-input" 
                    placeholder="Your Full Name"
                  />
                  <button 
                    className="save-button" 
                    onClick={() => toggleEdit('fullName')}
                  >
                    <FaCheck />
                  </button>
                </div>
              ) : (
                <div className="display-field" onClick={() => toggleEdit('fullName')}>
                  <input 
                    type="text" 
                    value={userData.fullName} 
                    readOnly 
                    className="settings-input-readonly" 
                    placeholder="Your Full Name"
                  />
                </div>
              )}
            </div>
            
            {/* Nick Name */}
            <div className="settings-field">
              <label>Nick Name</label>
              {editing.nickName ? (
                <div className="edit-field">
                  <input 
                    type="text" 
                    value={userData.nickName} 
                    onChange={(e) => handleInputChange('nickName', e.target.value)} 
                    className="settings-input" 
                    placeholder="Your Nick Name"
                  />
                  <button 
                    className="save-button" 
                    onClick={() => toggleEdit('nickName')}
                  >
                    <FaCheck />
                  </button>
                </div>
              ) : (
                <div className="display-field" onClick={() => toggleEdit('nickName')}>
                  <input 
                    type="text" 
                    value={userData.nickName} 
                    readOnly 
                    className="settings-input-readonly" 
                    placeholder="Your Nick Name"
                  />
                </div>
              )}
            </div>
            
            {/* Gender */}
            <div className="settings-field">
              <label>Gender</label>
              {editing.gender ? (
                <div className="edit-field">
                  <select 
                    value={userData.gender} 
                    onChange={(e) => handleInputChange('gender', e.target.value)} 
                    className="settings-input"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="non-binary">Non-binary</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                  <button 
                    className="save-button" 
                    onClick={() => toggleEdit('gender')}
                  >
                    <FaCheck />
                  </button>
                </div>
              ) : (
                <div className="display-field" onClick={() => toggleEdit('gender')}>
                  <input 
                    type="text" 
                    value={userData.gender} 
                    readOnly 
                    className="settings-input-readonly" 
                    placeholder="Your Gender"
                  />
                </div>
              )}
            </div>
            
            {/* Country */}
            <div className="settings-field">
              <label>Country</label>
              {editing.country ? (
                <div className="edit-field">
                  <select 
                    value={userData.country} 
                    onChange={(e) => handleInputChange('country', e.target.value)} 
                    className="settings-input"
                  >
                    <option value="">Select Country</option>
                    <option value="us">United States</option>
                    <option value="ca">Canada</option>
                    <option value="uk">United Kingdom</option>
                    <option value="au">Australia</option>
                    {/* Add more countries as needed */}
                  </select>
                  <button 
                    className="save-button" 
                    onClick={() => toggleEdit('country')}
                  >
                    <FaCheck />
                  </button>
                </div>
              ) : (
                <div className="display-field" onClick={() => toggleEdit('country')}>
                  <input 
                    type="text" 
                    value={userData.country} 
                    readOnly 
                    className="settings-input-readonly" 
                    placeholder="Your Country"
                  />
                </div>
              )}
            </div>
            
            {/* Language */}
            <div className="settings-field">
              <label>Language</label>
              {editing.language ? (
                <div className="edit-field">
                  <select 
                    value={userData.language} 
                    onChange={(e) => handleInputChange('language', e.target.value)} 
                    className="settings-input"
                  >
                    <option value="">Select Language</option>
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    {/* Add more languages as needed */}
                  </select>
                  <button 
                    className="save-button" 
                    onClick={() => toggleEdit('language')}
                  >
                    <FaCheck />
                  </button>
                </div>
              ) : (
                <div className="display-field" onClick={() => toggleEdit('language')}>
                  <input 
                    type="text" 
                    value={userData.language} 
                    readOnly 
                    className="settings-input-readonly" 
                    placeholder="Your Language"
                  />
                </div>
              )}
            </div>
            
            {/* Time Zone */}
            <div className="settings-field">
              <label>Time Zone</label>
              {editing.timezone ? (
                <div className="edit-field">
                  <select 
                    value={userData.timezone} 
                    onChange={(e) => handleInputChange('timezone', e.target.value)} 
                    className="settings-input"
                  >
                    <option value="">Select Time Zone</option>
                    <option value="est">Eastern Time (ET)</option>
                    <option value="cst">Central Time (CT)</option>
                    <option value="mst">Mountain Time (MT)</option>
                    <option value="pst">Pacific Time (PT)</option>
                    {/* Add more timezones as needed */}
                  </select>
                  <button 
                    className="save-button" 
                    onClick={() => toggleEdit('timezone')}
                  >
                    <FaCheck />
                  </button>
                </div>
              ) : (
                <div className="display-field" onClick={() => toggleEdit('timezone')}>
                  <input 
                    type="text" 
                    value={userData.timezone} 
                    readOnly 
                    className="settings-input-readonly" 
                    placeholder="Your Time Zone"
                  />
                </div>
              )}
            </div>
          </div>
          
          {/* Email Addresses Section */}
          <div className="settings-section">
            <h3>My email Address</h3>
            
            <div className="email-list">
              {userData.additionalEmails.map((item, index) => (
                <div className="email-item" key={index}>
                  <div className="email-icon">
                    <FaEnvelope />
                  </div>
                  <div className="email-details">
                    <div className="email-address">{item.email}</div>
                    <div className="email-date">{item.addedDate}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="add-email-button" onClick={handleAddEmail}>
              <FaPlus /> Add Email Address
            </button>
          </div>
          
          {/* Payment Methods Section */}
          <div className="settings-section">
            <h3>Payment Method</h3>
            <div className="payment-section-header">
              <span>Withdraw Method</span>
              <button className="options-button">
                <FaEllipsisH />
              </button>
            </div>
            
            <div className="payment-methods">
              {paymentMethods.map((method) => (
                <div className="payment-method-item" key={method.id}>
                  <div className="payment-method-icon">
                    {method.type === 'PayPal' && <FaPaypal />}
                  </div>
                  <div className="payment-method-details">
                    <div className="payment-method-name">{method.type}</div>
                    <div className="payment-method-status">{method.details}</div>
                  </div>
                  {method.isConnected && (
                    <div className="connection-status">
                      <FaCheck /> Connected
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
