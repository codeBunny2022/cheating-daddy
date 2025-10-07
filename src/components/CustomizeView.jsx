import React from 'react';
import './CustomizeView.css';

const CustomizeView = ({
  selectedProfile,
  selectedLanguage,
  selectedScreenshotInterval,
  selectedImageQuality,
  layoutMode,
  advancedMode,
  onProfileChange,
  onLanguageChange,
  onScreenshotIntervalChange,
  onImageQualityChange,
  onLayoutModeChange,
  onAdvancedModeChange
}) => {
  const profiles = [
    { value: 'interview', label: 'Interview', description: 'Job interview assistance' },
    { value: 'sales', label: 'Sales Call', description: 'Sales conversation help' },
    { value: 'meeting', label: 'Business Meeting', description: 'Professional meeting support' },
    { value: 'presentation', label: 'Presentation', description: 'Public speaking assistance' },
    { value: 'negotiation', label: 'Negotiation', description: 'Negotiation strategy support' },
    { value: 'exam', label: 'Exam Mode', description: 'Academic exam assistance' }
  ];

  const languages = [
    { value: 'en-US', label: 'English (US)' },
    { value: 'en-GB', label: 'English (UK)' },
    { value: 'es-ES', label: 'Spanish' },
    { value: 'fr-FR', label: 'French' },
    { value: 'de-DE', label: 'German' },
    { value: 'it-IT', label: 'Italian' },
    { value: 'pt-BR', label: 'Portuguese (Brazil)' },
    { value: 'ja-JP', label: 'Japanese' },
    { value: 'ko-KR', label: 'Korean' },
    { value: 'zh-CN', label: 'Chinese (Simplified)' }
  ];

  const intervals = [
    { value: 'manual', label: 'Manual Only', description: 'Take screenshots manually' },
    { value: '5', label: '5 seconds', description: 'Capture every 5 seconds' },
    { value: '10', label: '10 seconds', description: 'Capture every 10 seconds' },
    { value: '15', label: '15 seconds', description: 'Capture every 15 seconds' },
    { value: '30', label: '30 seconds', description: 'Capture every 30 seconds' }
  ];

  const qualities = [
    { value: 'low', label: 'Low', description: 'Faster processing, lower quality' },
    { value: 'medium', label: 'Medium', description: 'Balanced quality and speed' },
    { value: 'high', label: 'High', description: 'Best quality, slower processing' }
  ];

  return (
    <div className="customize-view">
      <div className="settings-section">
        <h3>AI Profile</h3>
        <p className="section-description">Choose the AI personality that best fits your situation</p>
        <div className="profile-grid">
          {profiles.map(profile => (
            <div 
              key={profile.value}
              className={`profile-option ${selectedProfile === profile.value ? 'selected' : ''}`}
              onClick={() => onProfileChange(profile.value)}
            >
              <div className="profile-name">{profile.label}</div>
              <div className="profile-description">{profile.description}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="settings-section">
        <h3>Language</h3>
        <p className="section-description">Select your preferred language for AI responses</p>
        <select 
          value={selectedLanguage} 
          onChange={(e) => onLanguageChange(e.target.value)}
          className="language-select"
        >
          {languages.map(lang => (
            <option key={lang.value} value={lang.value}>{lang.label}</option>
          ))}
        </select>
      </div>

      <div className="settings-section">
        <h3>Screenshot Interval</h3>
        <p className="section-description">How often should the app capture your screen?</p>
        <div className="interval-options">
          {intervals.map(interval => (
            <div 
              key={interval.value}
              className={`interval-option ${selectedScreenshotInterval === interval.value ? 'selected' : ''}`}
              onClick={() => onScreenshotIntervalChange(interval.value)}
            >
              <div className="interval-name">{interval.label}</div>
              <div className="interval-description">{interval.description}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="settings-section">
        <h3>Image Quality</h3>
        <p className="section-description">Balance between quality and processing speed</p>
        <div className="quality-options">
          {qualities.map(quality => (
            <div 
              key={quality.value}
              className={`quality-option ${selectedImageQuality === quality.value ? 'selected' : ''}`}
              onClick={() => onImageQualityChange(quality.value)}
            >
              <div className="quality-name">{quality.label}</div>
              <div className="quality-description">{quality.description}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="settings-section">
        <h3>Layout Mode</h3>
        <p className="section-description">Choose your preferred interface size</p>
        <div className="layout-options">
          <div 
            className={`layout-option ${layoutMode === 'normal' ? 'selected' : ''}`}
            onClick={() => onLayoutModeChange('normal')}
          >
            <div className="layout-name">Normal</div>
            <div className="layout-description">Standard interface size</div>
          </div>
          <div 
            className={`layout-option ${layoutMode === 'compact' ? 'selected' : ''}`}
            onClick={() => onLayoutModeChange('compact')}
          >
            <div className="layout-name">Compact</div>
            <div className="layout-description">Smaller interface for more screen space</div>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3>Advanced Features</h3>
        <p className="section-description">Enable additional tools and capabilities</p>
        <div className="advanced-toggle">
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={advancedMode}
              onChange={(e) => onAdvancedModeChange(e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
          <div className="toggle-label">
            <div className="toggle-name">Advanced Mode</div>
            <div className="toggle-description">Enable advanced tools and features</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizeView;
