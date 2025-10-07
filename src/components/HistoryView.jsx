import React, { useState, useEffect } from 'react';
import './HistoryView.css';

const HistoryView = () => {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Load conversation history from localStorage
    const loadHistory = () => {
      try {
        const history = JSON.parse(localStorage.getItem('conversationHistory') || '[]');
        setSessions(history);
      } catch (error) {
        console.error('Failed to load conversation history:', error);
        setSessions([]);
      }
    };

    loadHistory();
  }, []);

  const filteredSessions = sessions.filter(session =>
    session.profile.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.responses.some(response => 
      response.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getProfileIcon = (profile) => {
    const icons = {
      interview: '💼',
      sales: '💰',
      meeting: '🤝',
      presentation: '🎤',
      negotiation: '⚖️',
      exam: '📝'
    };
    return icons[profile] || '🤖';
  };

  const getProfileName = (profile) => {
    const names = {
      interview: 'Interview',
      sales: 'Sales Call',
      meeting: 'Business Meeting',
      presentation: 'Presentation',
      negotiation: 'Negotiation',
      exam: 'Exam'
    };
    return names[profile] || 'Unknown';
  };

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all conversation history?')) {
      localStorage.removeItem('conversationHistory');
      setSessions([]);
      setSelectedSession(null);
    }
  };

  const deleteSession = (sessionId) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      const updatedSessions = sessions.filter(session => session.id !== sessionId);
      setSessions(updatedSessions);
      localStorage.setItem('conversationHistory', JSON.stringify(updatedSessions));
      
      if (selectedSession && selectedSession.id === sessionId) {
        setSelectedSession(null);
      }
    }
  };

  return (
    <div className="history-view">
      <div className="history-header">
        <h2>Conversation History</h2>
        <div className="history-actions">
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button onClick={clearHistory} className="clear-button">
            Clear All
          </button>
        </div>
      </div>

      <div className="history-content">
        {sessions.length === 0 ? (
          <div className="empty-history">
            <div className="empty-icon">📝</div>
            <h3>No Conversation History</h3>
            <p>Your conversation sessions will appear here once you start using the assistant.</p>
          </div>
        ) : (
          <div className="history-layout">
            <div className="sessions-list">
              <h3>Recent Sessions ({filteredSessions.length})</h3>
              <div className="sessions-container">
                {filteredSessions.map((session) => (
                  <div
                    key={session.id}
                    className={`session-item ${selectedSession?.id === session.id ? 'selected' : ''}`}
                    onClick={() => setSelectedSession(session)}
                  >
                    <div className="session-header">
                      <div className="session-profile">
                        <span className="profile-icon">{getProfileIcon(session.profile)}</span>
                        <span className="profile-name">{getProfileName(session.profile)}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSession(session.id);
                        }}
                        className="delete-session"
                        title="Delete session"
                      >
                        ×
                      </button>
                    </div>
                    <div className="session-info">
                      <div className="session-date">{formatDate(session.timestamp)}</div>
                      <div className="session-stats">
                        {session.responses.length} responses
                      </div>
                    </div>
                    <div className="session-preview">
                      {session.responses[0]?.substring(0, 100)}
                      {session.responses[0]?.length > 100 && '...'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedSession && (
              <div className="session-details">
                <div className="session-details-header">
                  <h3>Session Details</h3>
                  <div className="session-meta">
                    <span className="session-profile">
                      {getProfileIcon(selectedSession.profile)} {getProfileName(selectedSession.profile)}
                    </span>
                    <span className="session-date">{formatDate(selectedSession.timestamp)}</span>
                  </div>
                </div>
                <div className="responses-container">
                  {selectedSession.responses.map((response, index) => (
                    <div key={index} className="response-item">
                      <div className="response-header">
                        <span className="response-number">#{index + 1}</span>
                        <span className="response-time">
                          {new Date(selectedSession.timestamp + (index * 30000)).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="response-content">{response}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryView;
