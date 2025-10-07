import React, { useState, useEffect, useRef } from 'react';
import './AssistantView.css';

const AssistantView = ({
  responses,
  currentResponseIndex,
  selectedProfile,
  onSendText,
  shouldAnimateResponse,
  onResponseIndexChanged,
  onResponseAnimationComplete
}) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const responseRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [responses]);

  useEffect(() => {
    if (shouldAnimateResponse && responseRef.current) {
      const element = responseRef.current;
      element.classList.add('typing-animation');
      
      const timer = setTimeout(() => {
        element.classList.remove('typing-animation');
        onResponseAnimationComplete();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [shouldAnimateResponse, onResponseAnimationComplete]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && !isTyping) {
      setIsTyping(true);
      onSendText(message.trim());
      setMessage('');
      
      setTimeout(() => {
        setIsTyping(false);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const navigateResponse = (direction) => {
    const newIndex = direction === 'prev' 
      ? Math.max(0, currentResponseIndex - 1)
      : Math.min(responses.length - 1, currentResponseIndex + 1);
    
    if (newIndex !== currentResponseIndex) {
      onResponseIndexChanged(newIndex);
    }
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
      interview: 'Interview Assistant',
      sales: 'Sales Coach',
      meeting: 'Meeting Helper',
      presentation: 'Presentation Aid',
      negotiation: 'Negotiation Expert',
      exam: 'Exam Helper'
    };
    return names[profile] || 'AI Assistant';
  };

  return (
    <div className="assistant-view">
      <div className="assistant-header">
        <div className="profile-info">
          <span className="profile-icon">{getProfileIcon(selectedProfile)}</span>
          <span className="profile-name">{getProfileName(selectedProfile)}</span>
        </div>
        <div className="response-navigation">
          <button 
            className="nav-button"
            onClick={() => navigateResponse('prev')}
            disabled={currentResponseIndex <= 0}
            title="Previous Response (Ctrl+[)"
          >
            ←
          </button>
          <span className="response-counter">
            {currentResponseIndex + 1} / {responses.length}
          </span>
          <button 
            className="nav-button"
            onClick={() => navigateResponse('next')}
            disabled={currentResponseIndex >= responses.length - 1}
            title="Next Response (Ctrl+])"
          >
            →
          </button>
        </div>
      </div>

      <div className="responses-container">
        {responses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🤖</div>
            <h3>Ready to Assist</h3>
            <p>Start your session and I'll help you with real-time responses based on your screen content.</p>
            <div className="shortcuts-hint">
              <p><strong>Shortcuts:</strong></p>
              <p>• <kbd>Ctrl+Enter</kbd> - Take screenshot</p>
              <p>• <kbd>Ctrl+[</kbd> / <kbd>Ctrl+]</kbd> - Navigate responses</p>
              <p>• <kbd>Ctrl+M</kbd> - Toggle click-through</p>
            </div>
          </div>
        ) : (
          <div className="responses-list">
            {responses.map((response, index) => (
              <div 
                key={index}
                className={`response-item ${index === currentResponseIndex ? 'active' : ''}`}
                onClick={() => onResponseIndexChanged(index)}
              >
                <div className="response-header">
                  <span className="response-number">#{index + 1}</span>
                  <span className="response-time">
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>
                <div 
                  className={`response-content ${index === currentResponseIndex && shouldAnimateResponse ? 'typing' : ''}`}
                  ref={index === currentResponseIndex ? responseRef : null}
                >
                  {response}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="message-input-container">
        <form onSubmit={handleSendMessage} className="message-form">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message to the AI assistant..."
            className="message-input"
            rows="2"
            disabled={isTyping}
          />
          <button 
            type="submit" 
            className="send-button"
            disabled={!message.trim() || isTyping}
          >
            {isTyping ? '⏳' : '➤'}
          </button>
        </form>
        <div className="input-hint">
          Press <kbd>Enter</kbd> to send, <kbd>Shift+Enter</kbd> for new line
        </div>
      </div>
    </div>
  );
};

export default AssistantView;
