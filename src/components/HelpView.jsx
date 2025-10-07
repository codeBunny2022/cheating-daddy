import React from 'react';
import './HelpView.css';

const HelpView = ({ onExternalLinkClick }) => {
  const shortcuts = [
    { key: 'Ctrl/Cmd + Arrow Keys', description: 'Move window position' },
    { key: 'Ctrl/Cmd + \\', description: 'Toggle window visibility' },
    { key: 'Ctrl/Cmd + M', description: 'Toggle click-through mode' },
    { key: 'Ctrl/Cmd + Enter', description: 'Start session or take screenshot' },
    { key: 'Ctrl/Cmd + [', description: 'Previous response' },
    { key: 'Ctrl/Cmd + ]', description: 'Next response' },
    { key: 'Ctrl/Cmd + Shift + ↑', description: 'Scroll response up' },
    { key: 'Ctrl/Cmd + Shift + ↓', description: 'Scroll response down' },
    { key: 'Ctrl/Cmd + Shift + E', description: 'Emergency erase (quit & clear data)' }
  ];

  const features = [
    {
      title: 'Live AI Assistance',
      description: 'Real-time help powered by Google Gemini 2.0 Flash Live',
      icon: '🤖'
    },
    {
      title: 'Screen & Audio Capture',
      description: 'Analyzes what you see and hear for contextual responses',
      icon: '📸'
    },
    {
      title: 'Multiple AI Profiles',
      description: 'Interview, Sales, Meeting, Presentation, Negotiation, and Exam modes',
      icon: '🎭'
    },
    {
      title: 'Stealth Features',
      description: 'Hidden from taskbar, random process names, and content protection',
      icon: '🕵️'
    },
    {
      title: 'Cross-Platform',
      description: 'Works on macOS, Windows, and Linux with platform-specific optimizations',
      icon: '💻'
    }
  ];

  const tips = [
    'Position the window where it won\'t interfere with your work',
    'Use click-through mode when you need to interact with other applications',
    'Try different AI profiles for different scenarios',
    'Enable advanced mode for additional features',
    'Use manual capture mode for more control over when screenshots are taken'
  ];

  return (
    <div className="help-view">
      <div className="help-header">
        <h2>Help & Shortcuts</h2>
        <p className="help-subtitle">Everything you need to know about Cheating Daddy</p>
      </div>

      <div className="help-content">
        <section className="help-section">
          <h3>🚀 Features</h3>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <div className="feature-content">
                  <h4>{feature.title}</h4>
                  <p>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="help-section">
          <h3>⌨️ Keyboard Shortcuts</h3>
          <div className="shortcuts-list">
            {shortcuts.map((shortcut, index) => (
              <div key={index} className="shortcut-item">
                <kbd className="shortcut-key">{shortcut.key}</kbd>
                <span className="shortcut-description">{shortcut.description}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="help-section">
          <h3>💡 Tips & Tricks</h3>
          <ul className="tips-list">
            {tips.map((tip, index) => (
              <li key={index} className="tip-item">{tip}</li>
            ))}
          </ul>
        </section>

        <section className="help-section">
          <h3>🔗 Resources</h3>
          <div className="resources-list">
            <a 
              href="#" 
              onClick={() => onExternalLinkClick('https://cheatingdaddy.com/help/api-key')}
              className="resource-link"
            >
              📖 How to get a Gemini API Key
            </a>
            <a 
              href="#" 
              onClick={() => onExternalLinkClick('https://cheatingdaddy.com/help/setup')}
              className="resource-link"
            >
              🛠️ Setup Guide
            </a>
            <a 
              href="#" 
              onClick={() => onExternalLinkClick('https://cheatingdaddy.com/help/troubleshooting')}
              className="resource-link"
            >
              🔧 Troubleshooting
            </a>
            <a 
              href="#" 
              onClick={() => onExternalLinkClick('https://github.com/sohzm/cheating-daddy')}
              className="resource-link"
            >
              📂 GitHub Repository
            </a>
          </div>
        </section>

        <section className="help-section">
          <h3>⚠️ Important Notes</h3>
          <div className="warning-box">
            <p><strong>Use responsibly:</strong> This tool is designed for educational and professional assistance. Please use it ethically and in accordance with your organization's policies.</p>
            <p><strong>Privacy:</strong> Your API key and conversation data are stored locally. We don't collect or transmit your personal information.</p>
            <p><strong>Performance:</strong> The app works best with a stable internet connection and sufficient system resources.</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HelpView;
