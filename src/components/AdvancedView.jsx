import React, { useState, useEffect } from 'react';
import './AdvancedView.css';

const AdvancedView = () => {
  const [settings, setSettings] = useState({
    stealthLevel: 'balanced',
    contentProtection: true,
    autoHide: false,
    randomizeNames: true,
    emergencyErase: false,
    debugMode: false,
    customPrompt: '',
    rateLimit: 'normal'
  });

  const [stats, setStats] = useState({
    totalSessions: 0,
    totalResponses: 0,
    averageResponseTime: 0,
    uptime: 0
  });

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = JSON.parse(localStorage.getItem('advancedSettings') || '{}');
    setSettings(prev => ({ ...prev, ...savedSettings }));

    // Load stats
    const history = JSON.parse(localStorage.getItem('conversationHistory') || '[]');
    const totalSessions = history.length;
    const totalResponses = history.reduce((sum, session) => sum + session.responses.length, 0);
    
    setStats({
      totalSessions,
      totalResponses,
      averageResponseTime: 2.5, // Mock data
      uptime: Date.now() - (localStorage.getItem('appStartTime') || Date.now())
    });
  }, []);

  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('advancedSettings', JSON.stringify(newSettings));
  };

  const formatUptime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  const stealthLevels = [
    { value: 'visible', label: 'Visible', description: 'Normal visibility, no stealth features' },
    { value: 'balanced', label: 'Balanced', description: 'Some stealth features enabled' },
    { value: 'ultra', label: 'Ultra Stealth', description: 'Maximum stealth and hiding' }
  ];

  const rateLimits = [
    { value: 'low', label: 'Low (10/min)', description: 'Conservative rate limiting' },
    { value: 'normal', label: 'Normal (20/min)', description: 'Standard rate limiting' },
    { value: 'high', label: 'High (50/min)', description: 'Aggressive rate limiting' }
  ];

  const performEmergencyErase = () => {
    if (window.confirm('This will immediately quit the application and clear all data. Are you sure?')) {
      // Clear all data
      localStorage.clear();
      // Trigger emergency erase via IPC
      if (window.require) {
        const { ipcRenderer } = window.require('electron');
        ipcRenderer.invoke('emergency-erase');
      }
    }
  };

  const exportData = () => {
    const data = {
      settings,
      history: JSON.parse(localStorage.getItem('conversationHistory') || '[]'),
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cheating-daddy-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (data.settings) {
            setSettings(data.settings);
            localStorage.setItem('advancedSettings', JSON.stringify(data.settings));
          }
          if (data.history) {
            localStorage.setItem('conversationHistory', JSON.stringify(data.history));
          }
          alert('Data imported successfully!');
        } catch (error) {
          alert('Failed to import data: Invalid file format');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="advanced-view">
      <div className="advanced-header">
        <h2>Advanced Tools</h2>
        <p className="advanced-subtitle">Power user settings and system information</p>
      </div>

      <div className="advanced-content">
        <section className="advanced-section">
          <h3>🕵️ Stealth Settings</h3>
          <div className="settings-group">
            <div className="setting-item">
              <label className="setting-label">Stealth Level</label>
              <div className="stealth-options">
                {stealthLevels.map(level => (
                  <div 
                    key={level.value}
                    className={`stealth-option ${settings.stealthLevel === level.value ? 'selected' : ''}`}
                    onClick={() => handleSettingChange('stealthLevel', level.value)}
                  >
                    <div className="stealth-name">{level.label}</div>
                    <div className="stealth-description">{level.description}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="setting-item">
              <label className="setting-label">Content Protection</label>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={settings.contentProtection}
                  onChange={(e) => handleSettingChange('contentProtection', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
              <span className="setting-description">Prevent screenshots of the application</span>
            </div>

            <div className="setting-item">
              <label className="setting-label">Randomize Process Names</label>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={settings.randomizeNames}
                  onChange={(e) => handleSettingChange('randomizeNames', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
              <span className="setting-description">Use random process names for stealth</span>
            </div>
          </div>
        </section>

        <section className="advanced-section">
          <h3>⚙️ Performance Settings</h3>
          <div className="settings-group">
            <div className="setting-item">
              <label className="setting-label">Rate Limiting</label>
              <select 
                value={settings.rateLimit}
                onChange={(e) => handleSettingChange('rateLimit', e.target.value)}
                className="rate-limit-select"
              >
                {rateLimits.map(limit => (
                  <option key={limit.value} value={limit.value}>
                    {limit.label} - {limit.description}
                  </option>
                ))}
              </select>
            </div>

            <div className="setting-item">
              <label className="setting-label">Debug Mode</label>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={settings.debugMode}
                  onChange={(e) => handleSettingChange('debugMode', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
              <span className="setting-description">Enable detailed logging and debugging</span>
            </div>
          </div>
        </section>

        <section className="advanced-section">
          <h3>📊 System Statistics</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value">{stats.totalSessions}</div>
              <div className="stat-label">Total Sessions</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{stats.totalResponses}</div>
              <div className="stat-label">Total Responses</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{stats.averageResponseTime}s</div>
              <div className="stat-label">Avg Response Time</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{formatUptime(stats.uptime)}</div>
              <div className="stat-label">Session Uptime</div>
            </div>
          </div>
        </section>

        <section className="advanced-section">
          <h3>💾 Data Management</h3>
          <div className="data-actions">
            <button onClick={exportData} className="action-button export">
              📤 Export Data
            </button>
            <label className="action-button import">
              📥 Import Data
              <input 
                type="file" 
                accept=".json" 
                onChange={importData}
                style={{ display: 'none' }}
              />
            </label>
            <button 
              onClick={performEmergencyErase} 
              className="action-button emergency"
            >
              🚨 Emergency Erase
            </button>
          </div>
        </section>

        <section className="advanced-section">
          <h3>🎯 Custom Prompt</h3>
          <div className="custom-prompt-container">
            <textarea
              value={settings.customPrompt}
              onChange={(e) => handleSettingChange('customPrompt', e.target.value)}
              placeholder="Enter custom instructions for the AI assistant..."
              className="custom-prompt-input"
              rows="4"
            />
            <div className="prompt-hint">
              Custom prompts will be added to the system prompt for all AI interactions.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdvancedView;
