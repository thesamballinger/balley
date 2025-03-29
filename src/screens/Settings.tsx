import React from 'react';
import { 
  FaEnvelope, 
  FaCrown, 
  FaUserCog, 
  FaDatabase, 
  FaArchive, 
  FaQuestionCircle, 
  FaFileAlt, 
  FaLock, 
  FaApple, 
  FaSignOutAlt, 
  FaChevronRight 
} from 'react-icons/fa';
import '../styles/screens/Settings.css';

const Settings: React.FC = () => {
  // Mock data
  const userEmail = 'samgballinger@gmail.com';
  const subscriptionType = 'ChatGPT Pro';
  const appVersion = '1.2024.346 (1734386520)';
  
  return (
    <div className="settings-container">
      <div className="settings-content">
        {/* Account Section */}
        <div className="settings-section">
          <h2 className="section-title">Account</h2>
          
          <div className="settings-item">
            <div className="item-left">
              <FaEnvelope className="item-icon" />
              <span className="item-label">Email</span>
            </div>
            <div className="item-right">
              <span className="item-value">{userEmail}</span>
            </div>
          </div>
          
          <div className="settings-item">
            <div className="item-left">
              <FaCrown className="item-icon" />
              <span className="item-label">Subscription</span>
            </div>
            <div className="item-right">
              <span className="item-value">{subscriptionType}</span>
            </div>
          </div>
          
          <div className="settings-item clickable">
            <div className="item-left">
              <FaUserCog className="item-icon" />
              <span className="item-label">Personalization</span>
            </div>
            <div className="item-right">
              <FaChevronRight className="chevron-icon" />
            </div>
          </div>
          
          <div className="settings-item clickable">
            <div className="item-left">
              <FaDatabase className="item-icon" />
              <span className="item-label">Data Controls</span>
            </div>
            <div className="item-right">
              <FaChevronRight className="chevron-icon" />
            </div>
          </div>
          
          <div className="settings-item clickable">
            <div className="item-left">
              <FaArchive className="item-icon" />
              <span className="item-label">Archived Chats</span>
            </div>
            <div className="item-right">
              <FaChevronRight className="chevron-icon" />
            </div>
          </div>
        </div>
        
        {/* About Section */}
        <div className="settings-section">
          <h2 className="section-title">About</h2>
          
          <div className="settings-item clickable">
            <div className="item-left">
              <FaQuestionCircle className="item-icon" />
              <span className="item-label">Help Center</span>
            </div>
          </div>
          
          <div className="settings-item clickable">
            <div className="item-left">
              <FaFileAlt className="item-icon" />
              <span className="item-label">Terms of Use</span>
            </div>
          </div>
          
          <div className="settings-item clickable">
            <div className="item-left">
              <FaLock className="item-icon" />
              <span className="item-label">Privacy Policy</span>
            </div>
          </div>
          
          <div className="settings-item">
            <div className="item-left">
              <FaApple className="item-icon" />
              <span className="item-label">ChatGPT for macOS</span>
            </div>
            <div className="item-right">
              <span className="item-value version-number">{appVersion}</span>
            </div>
          </div>
        </div>
        
        {/* Logout Section */}
        <div className="settings-section">
          <div className="settings-item clickable logout-item">
            <div className="item-left">
              <FaSignOutAlt className="item-icon logout-icon" />
              <span className="item-label">Log out</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
