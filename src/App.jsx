import React, { useState, useEffect, useCallback, useRef } from 'react';
import AppHeader from './components/AppHeader';
import MainView from './components/MainView';
import CustomizeView from './components/CustomizeView';
import HelpView from './components/HelpView';
import HistoryView from './components/HistoryView';
import AssistantView from './components/AssistantView';
import OnboardingView from './components/OnboardingView';
import AdvancedView from './components/AdvancedView';

const App = () => {
  const appRef = useRef(null);
  const [currentView, setCurrentView] = useState(
    localStorage.getItem('onboardingCompleted') ? 'main' : 'onboarding'
  );
  const [statusText, setStatusText] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(
    localStorage.getItem('selectedProfile') || 'interview'
  );
  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem('selectedLanguage') || 'en-US'
  );
  const [selectedScreenshotInterval, setSelectedScreenshotInterval] = useState(
    localStorage.getItem('selectedScreenshotInterval') || '5'
  );
  const [selectedImageQuality, setSelectedImageQuality] = useState(
    localStorage.getItem('selectedImageQuality') || 'medium'
  );
  const [layoutMode, setLayoutMode] = useState(
    localStorage.getItem('layoutMode') || 'normal'
  );
  const [advancedMode, setAdvancedMode] = useState(
    localStorage.getItem('advancedMode') === 'true'
  );
  const [responses, setResponses] = useState([]);
  const [currentResponseIndex, setCurrentResponseIndex] = useState(-1);
  const [isClickThrough, setIsClickThrough] = useState(false);
  const [awaitingNewResponse, setAwaitingNewResponse] = useState(false);
  const [shouldAnimateResponse, setShouldAnimateResponse] = useState(false);

  // Apply layout mode to document root
  useEffect(() => {
    if (layoutMode === 'compact') {
      document.documentElement.classList.add('compact-layout');
    } else {
      document.documentElement.classList.remove('compact-layout');
    }
  }, [layoutMode]);

  // Set up IPC listeners and renderer integration
  useEffect(() => {
    if (window.require) {
      const { ipcRenderer } = window.require('electron');
      
      const handleUpdateResponse = (_, response) => {
        setResponse(response);
      };
      
      const handleUpdateStatus = (_, status) => {
        setStatus(status);
      };
      
      const handleClickThroughToggled = (_, isEnabled) => {
        setIsClickThrough(isEnabled);
      };

      ipcRenderer.on('update-response', handleUpdateResponse);
      ipcRenderer.on('update-status', handleUpdateStatus);
      ipcRenderer.on('click-through-toggled', handleClickThroughToggled);

      // Set up renderer integration
      if (window.cheddar && window.cheddar.setReactAppRef) {
        window.cheddar.setReactAppRef(appRef.current);
      }

      return () => {
        ipcRenderer.removeAllListeners('update-response');
        ipcRenderer.removeAllListeners('update-status');
        ipcRenderer.removeAllListeners('click-through-toggled');
      };
    }
  }, []);

  // Update renderer reference when component mounts
  useEffect(() => {
    if (window.cheddar && window.cheddar.setReactAppRef) {
      window.cheddar.setReactAppRef({
        setStatus,
        setResponse,
        handleStart,
        setState: (newState) => {
          Object.keys(newState).forEach(key => {
            if (key === 'currentView') setCurrentView(newState[key]);
            if (key === 'statusText') setStatusText(newState[key]);
            if (key === 'startTime') setStartTime(newState[key]);
            if (key === 'isRecording') setIsRecording(newState[key]);
            if (key === 'sessionActive') setSessionActive(newState[key]);
            if (key === 'selectedProfile') setSelectedProfile(newState[key]);
            if (key === 'selectedLanguage') setSelectedLanguage(newState[key]);
            if (key === 'responses') setResponses(newState[key]);
            if (key === 'currentResponseIndex') setCurrentResponseIndex(newState[key]);
            if (key === 'isClickThrough') setIsClickThrough(newState[key]);
            if (key === 'awaitingNewResponse') setAwaitingNewResponse(newState[key]);
            if (key === 'shouldAnimateResponse') setShouldAnimateResponse(newState[key]);
          });
        }
      });
    }
  }, []);

  const setStatus = useCallback((text) => {
    setStatusText(text);
  }, []);

  const setResponse = useCallback((response) => {
    // Check if this looks like a filler response
    const isFillerResponse =
      response.length < 30 &&
      (response.toLowerCase().includes('hmm') ||
        response.toLowerCase().includes('okay') ||
        response.toLowerCase().includes('next') ||
        response.toLowerCase().includes('go on') ||
        response.toLowerCase().includes('continue'));

    if (awaitingNewResponse || responses.length === 0) {
      // Always add as new response when explicitly waiting for one
      setResponses(prev => [...prev, response]);
      setCurrentResponseIndex(responses.length);
      setAwaitingNewResponse(false);
    } else if (!isFillerResponse && responses.length > 0) {
      // For substantial responses, update the last one (streaming behavior)
      setResponses(prev => [...prev.slice(0, prev.length - 1), response]);
    } else {
      // For filler responses, add as new
      setResponses(prev => [...prev, response]);
      setCurrentResponseIndex(responses.length);
    }
    setShouldAnimateResponse(true);
  }, [awaitingNewResponse, responses.length]);

  // Header event handlers
  const handleCustomizeClick = () => {
    setCurrentView('customize');
  };

  const handleHelpClick = () => {
    setCurrentView('help');
  };

  const handleHistoryClick = () => {
    setCurrentView('history');
  };

  const handleAdvancedClick = () => {
    setCurrentView('advanced');
  };

  const handleClose = async () => {
    if (currentView === 'customize' || currentView === 'help' || currentView === 'history') {
      setCurrentView('main');
    } else if (currentView === 'assistant') {
      cheddar.stopCapture();

      // Close the session
      if (window.require) {
        const { ipcRenderer } = window.require('electron');
        await ipcRenderer.invoke('close-session');
      }
      setSessionActive(false);
      setCurrentView('main');
      console.log('Session closed');
    } else {
      // Quit the entire application
      if (window.require) {
        const { ipcRenderer } = window.require('electron');
        await ipcRenderer.invoke('quit-application');
      }
    }
  };

  const handleHideToggle = async () => {
    if (window.require) {
      const { ipcRenderer } = window.require('electron');
      await ipcRenderer.invoke('toggle-window-visibility');
    }
  };

  // Main view event handlers
  const handleStart = async () => {
    // check if api key is empty do nothing
    const apiKey = localStorage.getItem('apiKey')?.trim();
    if (!apiKey || apiKey === '') {
      // Trigger the red blink animation on the API key input
      const mainView = document.querySelector('[data-component="main-view"]');
      if (mainView && mainView.triggerApiKeyError) {
        mainView.triggerApiKeyError();
      }
      return;
    }

    try {
      setStatus('Initializing AI session...');
      const result = await cheddar.initializeGemini(selectedProfile, selectedLanguage);
      
      if (result.success) {
        // Pass the screenshot interval as string (including 'manual' option)
        cheddar.startCapture(selectedScreenshotInterval, selectedImageQuality);
        setResponses([]);
        setCurrentResponseIndex(-1);
        setStartTime(Date.now());
        setCurrentView('assistant');
        setStatus('Session active - AI ready to assist');
      } else {
        setStatus(`Session failed: ${result.error}`);
        console.error('Failed to initialize session:', result.error);
      }
    } catch (error) {
      setStatus(`Session error: ${error.message}`);
      console.error('Error starting session:', error);
    }
  };

  const handleAPIKeyHelp = async () => {
    if (window.require) {
      const { ipcRenderer } = window.require('electron');
      await ipcRenderer.invoke('open-external', 'https://cheatingdaddy.com/help/api-key');
    }
  };

  // Customize view event handlers
  const handleProfileChange = (profile) => {
    setSelectedProfile(profile);
    localStorage.setItem('selectedProfile', profile);
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    localStorage.setItem('selectedLanguage', language);
  };

  const handleScreenshotIntervalChange = (interval) => {
    setSelectedScreenshotInterval(interval);
    localStorage.setItem('selectedScreenshotInterval', interval);
  };

  const handleImageQualityChange = (quality) => {
    setSelectedImageQuality(quality);
    localStorage.setItem('selectedImageQuality', quality);
  };

  const handleAdvancedModeChange = (advancedMode) => {
    setAdvancedMode(advancedMode);
    localStorage.setItem('advancedMode', advancedMode.toString());
  };

  const handleBackClick = () => {
    setCurrentView('main');
  };

  // Help view event handlers
  const handleExternalLinkClick = async (url) => {
    if (window.require) {
      const { ipcRenderer } = window.require('electron');
      await ipcRenderer.invoke('open-external', url);
    }
  };

  // Assistant view event handlers
  const handleSendText = async (message) => {
    const result = await window.cheddar.sendTextMessage(message);

    if (!result.success) {
      console.error('Failed to send message:', result.error);
      setStatus('Error sending message: ' + result.error);
    } else {
      setStatus('Message sent...');
      setAwaitingNewResponse(true);
    }
  };

  const handleResponseIndexChanged = (index) => {
    setCurrentResponseIndex(index);
    setShouldAnimateResponse(false);
  };

  // Onboarding event handlers
  const handleOnboardingComplete = () => {
    setCurrentView('main');
  };

  const handleLayoutModeChange = async (newLayoutMode) => {
    setLayoutMode(newLayoutMode);
    localStorage.setItem('layoutMode', newLayoutMode);
    
    if (newLayoutMode === 'compact') {
      document.documentElement.classList.add('compact-layout');
    } else {
      document.documentElement.classList.remove('compact-layout');
    }

    // Notify main process about layout change for window resizing
    if (window.require) {
      try {
        const { ipcRenderer } = window.require('electron');
        await ipcRenderer.invoke('update-sizes');
      } catch (error) {
        console.error('Failed to update sizes in main process:', error);
      }
    }
  };

  // Notify main process of view change
  useEffect(() => {
    if (window.require) {
      const { ipcRenderer } = window.require('electron');
      ipcRenderer.send('view-changed', currentView);
    }
  }, [currentView]);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'onboarding':
        return (
          <OnboardingView
            onComplete={handleOnboardingComplete}
            onClose={handleClose}
          />
        );

      case 'main':
        return (
          <MainView
            onStart={handleStart}
            onAPIKeyHelp={handleAPIKeyHelp}
            onLayoutModeChange={handleLayoutModeChange}
          />
        );

      case 'customize':
        return (
          <CustomizeView
            selectedProfile={selectedProfile}
            selectedLanguage={selectedLanguage}
            selectedScreenshotInterval={selectedScreenshotInterval}
            selectedImageQuality={selectedImageQuality}
            layoutMode={layoutMode}
            advancedMode={advancedMode}
            onProfileChange={handleProfileChange}
            onLanguageChange={handleLanguageChange}
            onScreenshotIntervalChange={handleScreenshotIntervalChange}
            onImageQualityChange={handleImageQualityChange}
            onLayoutModeChange={handleLayoutModeChange}
            onAdvancedModeChange={handleAdvancedModeChange}
          />
        );

      case 'help':
        return (
          <HelpView onExternalLinkClick={handleExternalLinkClick} />
        );

      case 'history':
        return <HistoryView />;

      case 'advanced':
        return <AdvancedView />;

      case 'assistant':
        return (
          <AssistantView
            responses={responses}
            currentResponseIndex={currentResponseIndex}
            selectedProfile={selectedProfile}
            onSendText={handleSendText}
            shouldAnimateResponse={shouldAnimateResponse}
            onResponseIndexChanged={handleResponseIndexChanged}
            onResponseAnimationComplete={() => {
              setShouldAnimateResponse(false);
            }}
          />
        );

      default:
        return <div>Unknown view: {currentView}</div>;
    }
  };

  const mainContentClass = `main-content ${
    currentView === 'assistant' ? 'assistant-view' : 
    currentView === 'onboarding' ? 'onboarding-view' : 'with-border'
  }`;

  return (
    <div className="window-container">
      <div className="container">
        <AppHeader
          currentView={currentView}
          statusText={statusText}
          startTime={startTime}
          advancedMode={advancedMode}
          onCustomizeClick={handleCustomizeClick}
          onHelpClick={handleHelpClick}
          onHistoryClick={handleHistoryClick}
          onAdvancedClick={handleAdvancedClick}
          onCloseClick={handleClose}
          onBackClick={handleBackClick}
          onHideToggleClick={handleHideToggle}
          isClickThrough={isClickThrough}
        />
        <div className={mainContentClass}>
          <div className="view-container">{renderCurrentView()}</div>
        </div>
      </div>
    </div>
  );
};

export default App;
