import React, { useState } from 'react';
import './OnboardingView.css';

const OnboardingView = ({ onComplete, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Welcome to Cheating Daddy',
      subtitle: 'Your AI-powered assistant for interviews, meetings, and more',
      content: (
        <div className="welcome-content">
          <div className="welcome-icon">🤖</div>
          <p>Cheating Daddy is a real-time AI assistant that helps you during video calls, interviews, presentations, and meetings.</p>
          <div className="features-preview">
            <div className="feature-item">
              <span className="feature-icon">📸</span>
              <span>Screen & Audio Capture</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🎭</span>
              <span>Multiple AI Profiles</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🕵️</span>
              <span>Stealth Features</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'How It Works',
      subtitle: 'Simple setup, powerful results',
      content: (
        <div className="how-it-works">
          <div className="step-item">
            <div className="step-number">1</div>
            <div className="step-content">
              <h4>Enter Your API Key</h4>
              <p>Get a free Gemini API key from Google AI Studio</p>
            </div>
          </div>
          <div className="step-item">
            <div className="step-number">2</div>
            <div className="step-content">
              <h4>Choose Your Profile</h4>
              <p>Select the AI personality that fits your situation</p>
            </div>
          </div>
          <div className="step-item">
            <div className="step-number">3</div>
            <div className="step-content">
              <h4>Start Your Session</h4>
              <p>The AI will analyze your screen and provide real-time assistance</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Key Features',
      subtitle: 'Everything you need to know',
      content: (
        <div className="key-features">
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h4>Live AI Assistance</h4>
            <p>Real-time help powered by Google Gemini 2.0 Flash Live</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🖥️</div>
            <h4>Screen Analysis</h4>
            <p>Captures and analyzes your screen content for contextual responses</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎤</div>
            <h4>Audio Processing</h4>
            <p>Listens to conversations and provides relevant assistance</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🕵️</div>
            <h4>Stealth Mode</h4>
            <p>Hidden from taskbar with random process names for discretion</p>
          </div>
        </div>
      )
    },
    {
      title: 'Keyboard Shortcuts',
      subtitle: 'Master these shortcuts for maximum efficiency',
      content: (
        <div className="shortcuts-guide">
          <div className="shortcut-group">
            <h4>Navigation</h4>
            <div className="shortcut-list">
              <div className="shortcut-item">
                <kbd>Ctrl/Cmd + Arrow Keys</kbd>
                <span>Move window</span>
              </div>
              <div className="shortcut-item">
                <kbd>Ctrl/Cmd + \</kbd>
                <span>Toggle visibility</span>
              </div>
              <div className="shortcut-item">
                <kbd>Ctrl/Cmd + M</kbd>
                <span>Toggle click-through</span>
              </div>
            </div>
          </div>
          <div className="shortcut-group">
            <h4>AI Interaction</h4>
            <div className="shortcut-list">
              <div className="shortcut-item">
                <kbd>Ctrl/Cmd + Enter</kbd>
                <span>Start session / Take screenshot</span>
              </div>
              <div className="shortcut-item">
                <kbd>Ctrl/Cmd + [</kbd>
                <span>Previous response</span>
              </div>
              <div className="shortcut-item">
                <kbd>Ctrl/Cmd + ]</kbd>
                <span>Next response</span>
              </div>
            </div>
          </div>
          <div className="shortcut-group">
            <h4>Emergency</h4>
            <div className="shortcut-list">
              <div className="shortcut-item emergency">
                <kbd>Ctrl/Cmd + Shift + E</kbd>
                <span>Emergency erase (quit & clear data)</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Ready to Start',
      subtitle: 'You\'re all set! Let\'s begin your AI-powered journey',
      content: (
        <div className="ready-content">
          <div className="ready-icon">🚀</div>
          <p>You now have everything you need to get started with Cheating Daddy.</p>
          <div className="tips">
            <h4>Pro Tips:</h4>
            <ul>
              <li>Position the window where it won't interfere with your work</li>
              <li>Use click-through mode when you need to interact with other apps</li>
              <li>Try different AI profiles for different scenarios</li>
              <li>Enable advanced mode for additional features</li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      localStorage.setItem('onboardingCompleted', 'true');
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipOnboarding = () => {
    localStorage.setItem('onboardingCompleted', 'true');
    onComplete();
  };

  return (
    <div className="onboarding-view">
      <div className="onboarding-container">
        <div className="onboarding-header">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
          <div className="step-indicator">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>

        <div className="onboarding-content">
          <div className="step-content">
            <h2>{steps[currentStep].title}</h2>
            <p className="step-subtitle">{steps[currentStep].subtitle}</p>
            <div className="step-body">
              {steps[currentStep].content}
            </div>
          </div>
        </div>

        <div className="onboarding-footer">
          <div className="footer-actions">
            <button 
              onClick={skipOnboarding} 
              className="skip-button"
            >
              Skip Tutorial
            </button>
            <div className="navigation-buttons">
              {currentStep > 0 && (
                <button 
                  onClick={prevStep} 
                  className="nav-button prev"
                >
                  ← Back
                </button>
              )}
              <button 
                onClick={nextStep} 
                className="nav-button next"
              >
                {currentStep === steps.length - 1 ? 'Get Started' : 'Next →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingView;
