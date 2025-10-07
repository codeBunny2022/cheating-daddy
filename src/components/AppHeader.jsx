import React, { useState, useEffect } from 'react';
import './AppHeader.css';

const AppHeader = ({
  currentView,
  statusText,
  startTime,
  onCustomizeClick,
  onHelpClick,
  onHistoryClick,
  onCloseClick,
  onBackClick,
  onHideToggleClick,
  isClickThrough,
  advancedMode,
  onAdvancedClick
}) => {
  const [elapsedTime, setElapsedTime] = useState('');

  useEffect(() => {
    let timerInterval = null;

    if (currentView === 'assistant' && startTime) {
      timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setElapsedTime(`${elapsed}s`);
      }, 1000);
    } else {
      setElapsedTime('');
    }

    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [currentView, startTime]);

  const getViewTitle = () => {
    const titles = {
      onboarding: 'Welcome to Cheating Daddy',
      main: 'Cheating Daddy',
      customize: 'Customize',
      help: 'Help & Shortcuts',
      history: 'Conversation History',
      advanced: 'Advanced Tools',
      assistant: 'Cheating Daddy',
    };
    return titles[currentView] || 'Cheating Daddy';
  };

  const isNavigationView = () => {
    const navigationViews = ['customize', 'help', 'history', 'advanced'];
    return navigationViews.includes(currentView);
  };

  const CmdIcon = () => (
    <svg width="14px" height="14px" viewBox="0 0 24 24" strokeWidth="2" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 6V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
      <path d="M15 6V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
      <path
        d="M9 6C9 4.34315 7.65685 3 6 3C4.34315 3 3 4.34315 3 6C3 7.65685 4.34315 9 6 9H18C19.6569 9 21 7.65685 21 6C21 4.34315 19.6569 3 18 3C16.3431 3 15 4.34315 15 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M9 18C9 19.6569 7.65685 21 6 21C4.34315 21 3 19.6569 3 18C3 16.3431 4.34315 15 6 15H18C19.6569 15 21 16.3431 21 18C21 19.6569 19.6569 21 18 21C16.3431 21 15 19.6569 15 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );

  const EnterIcon = () => (
    <svg width="14px" height="14px" strokeWidth="2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10.25 19.25L6.75 15.75L10.25 12.25"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M6.75 15.75H12.75C14.9591 15.75 16.75 13.9591 16.75 11.75V4.75"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );

  return (
    <div className="header">
      <div className="header-title">{getViewTitle()}</div>
      <div className="header-actions">
        {currentView === 'assistant' && (
          <>
            <span>{elapsedTime}</span>
            <span>{statusText}</span>
          </>
        )}
        {currentView === 'main' && (
          <>
            <button className="icon-button" onClick={onHistoryClick}>
              <svg
                width="24px"
                height="24px"
                strokeWidth="1.7"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                color="currentColor"
              >
                <path
                  d="M12 21V7C12 5.89543 12.8954 5 14 5H21.4C21.7314 5 22 5.26863 22 5.6V18.7143"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                ></path>
                <path
                  d="M12 21V7C12 5.89543 11.1046 5 10 5H2.6C2.26863 5 2 5.26863 2 5.6V18.7143"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                ></path>
                <path d="M14 19L22 19" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"></path>
                <path d="M10 19L2 19" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"></path>
                <path
                  d="M12 21C12 19.8954 12.8954 19 14 19"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M12 21C12 19.8954 11.1046 19 10 19"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </button>
            {advancedMode && (
              <button className="icon-button" onClick={onAdvancedClick} title="Advanced Tools">
                <svg
                  width="24px"
                  strokeWidth="1.7"
                  height="24px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  color="currentColor"
                >
                  <path d="M18.5 15L5.5 15" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"></path>
                  <path
                    d="M16 4L8 4"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                  <path
                    d="M9 4.5L9 10.2602C9 10.7376 8.82922 11.1992 8.51851 11.5617L3.48149 17.4383C3.17078 17.8008 3 18.2624 3 18.7398V19C3 20.1046 3.89543 21 5 21L19 21C20.1046 21 21 20.1046 21 19V18.7398C21 18.2624 20.8292 17.8008 20.5185 17.4383L15.4815 11.5617C15.1708 11.1992 15 10.7376 15 10.2602L15 4.5"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                  <path
                    d="M12 9.01L12.01 8.99889"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                  <path
                    d="M11 2.01L11.01 1.99889"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              </button>
            )}
            <button className="icon-button" onClick={onCustomizeClick}>
              <svg
                width="24px"
                height="24px"
                strokeWidth="1.7"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                color="currentColor"
              >
                <path
                  d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M19.6224 10.3954L18.5247 7.7448L20 6L18 4L16.2647 5.48295L13.5578 4.36974L12.9353 2H10.981L10.3491 4.40113L7.70441 5.51596L6 4L4 6L5.45337 7.78885L4.3725 10.4463L2 11V13L4.40111 13.6555L5.51575 16.2997L4 18L6 20L7.79116 18.5403L10.397 19.6123L11 22H13L13.6045 19.6132L16.2551 18.5155C16.6969 18.8313 18 20 18 20L20 18L18.5159 16.2494L19.6139 13.598L21.9999 12.9772L22 11L19.6224 10.3954Z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </button>
            <button className="icon-button" onClick={onHelpClick}>
              <svg
                width="24px"
                height="24px"
                strokeWidth="1.7"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                color="currentColor"
              >
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M9 9C9 5.49997 14.5 5.5 14.5 9C14.5 11.5 12 10.9999 12 13.9999"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M12 18.01L12.01 17.9989"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </button>
          </>
        )}
        {currentView === 'assistant' ? (
          <>
            <button onClick={onHideToggleClick} className="button">
              Hide&nbsp;&nbsp;<span className="key" style={{pointerEvents: 'none'}}>{cheddar.isMacOS ? 'Cmd' : 'Ctrl'}</span>&nbsp;&nbsp;<span className="key">\</span>
            </button>
            <button onClick={onCloseClick} className="icon-button window-close">
              <svg
                width="24px"
                height="24px"
                strokeWidth="1.7"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                color="currentColor"
              >
                <path
                  d="M6.75827 17.2426L12.0009 12M17.2435 6.75736L12.0009 12M12.0009 12L6.75827 6.75736M12.0009 12L17.2435 17.2426"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </button>
          </>
        ) : (
          <button onClick={isNavigationView() ? onBackClick : onCloseClick} className="icon-button window-close">
            <svg
              width="24px"
              height="24px"
              strokeWidth="1.7"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              color="currentColor"
            >
              <path
                d="M6.75827 17.2426L12.0009 12M17.2435 6.75736L12.0009 12M12.0009 12L6.75827 6.75736M12.0009 12L17.2435 17.2426"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default AppHeader;
