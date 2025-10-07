// React-compatible renderer utilities
const { ipcRenderer } = require('electron');

// Initialize random display name for UI components
window.randomDisplayName = null;

// Request random display name from main process
ipcRenderer
    .invoke('get-random-display-name')
    .then(name => {
        window.randomDisplayName = name;
        console.log('Set random display name:', name);
    })
    .catch(err => {
        console.warn('Could not get random display name:', err);
        window.randomDisplayName = 'System Monitor';
    });

let mediaStream = null;
let screenshotInterval = null;
let audioContext = null;
let audioProcessor = null;
let micAudioProcessor = null;
let audioBuffer = [];
const SAMPLE_RATE = 24000;
const AUDIO_CHUNK_DURATION = 0.1; // seconds
const BUFFER_SIZE = 4096; // Increased buffer size for smoother audio

let hiddenVideo = null;
let offscreenCanvas = null;
let offscreenContext = null;
let currentImageQuality = 'medium'; // Store current image quality for manual screenshots

const isLinux = process.platform === 'linux';
const isMacOS = process.platform === 'darwin';

// Token tracking system for rate limiting
let tokenTracker = {
    tokens: [], // Array of {timestamp, count, type} objects
    audioStartTime: null,

    // Add tokens to the tracker
    addTokens(count, type = 'image') {
        const now = Date.now();
        this.tokens.push({
            timestamp: now,
            count: count,
            type: type,
        });

        // Clean up old tokens (older than 1 minute)
        this.tokens = this.tokens.filter(token => now - token.timestamp < 60000);
    },

    // Check if we can make a request based on rate limits
    canMakeRequest(type = 'image') {
        const now = Date.now();
        const oneMinuteAgo = now - 60000;

        // Count tokens in the last minute
        const recentTokens = this.tokens.filter(token => token.timestamp > oneMinuteAgo);
        const imageTokens = recentTokens.filter(token => token.type === 'image').reduce((sum, token) => sum + token.count, 0);
        const audioTokens = recentTokens.filter(token => token.type === 'audio').reduce((sum, token) => sum + token.count, 0);

        // Rate limits: 20 images per minute, 10 audio requests per minute
        if (type === 'image' && imageTokens >= 20) {
            return false;
        }
        if (type === 'audio' && audioTokens >= 10) {
            return false;
        }

        return true;
    },

    // Get current token usage
    getUsage() {
        const now = Date.now();
        const oneMinuteAgo = now - 60000;
        const recentTokens = this.tokens.filter(token => token.timestamp > oneMinuteAgo);
        
        return {
            imageTokens: recentTokens.filter(token => token.type === 'image').reduce((sum, token) => sum + token.count, 0),
            audioTokens: recentTokens.filter(token => token.type === 'audio').reduce((sum, token) => sum + token.count, 0),
        };
    }
};

// React-compatible app state management
let appState = {
    currentView: 'main',
    layoutMode: 'normal',
    responses: [],
    currentResponseIndex: -1,
    statusText: '',
    startTime: null,
    sessionActive: false,
    isClickThrough: false,
    awaitingNewResponse: false,
    shouldAnimateResponse: false
};

// React component reference
let reactAppRef = null;

// Set React app reference
function setReactAppRef(ref) {
    reactAppRef = ref;
}

// Update app state
function updateAppState(newState) {
    appState = { ...appState, ...newState };
    if (reactAppRef) {
        reactAppRef.setState(newState);
    }
}

// Get current view
function getCurrentView() {
    return appState.currentView;
}

// Get layout mode
function getLayoutMode() {
    return appState.layoutMode;
}

// Set status
function setStatus(text) {
    updateAppState({ statusText: text });
    if (reactAppRef && reactAppRef.setStatus) {
        reactAppRef.setStatus(text);
    }
}

// Set response
function setResponse(response) {
    const newResponses = [...appState.responses, response];
    updateAppState({ 
        responses: newResponses,
        currentResponseIndex: newResponses.length - 1,
        shouldAnimateResponse: true
    });
    if (reactAppRef && reactAppRef.setResponse) {
        reactAppRef.setResponse(response);
    }
}

// Initialize Gemini session
async function initializeGemini(profile, language) {
    try {
        console.log('Initializing Gemini session with profile:', profile, 'language:', language);
        const result = await ipcRenderer.invoke('initialize-gemini-session', {
            profile,
            language
        });
        
        if (result.success) {
            console.log('Gemini session initialized successfully');
            console.log('Session ID:', result.sessionId);
            // Update app state to reflect active session
            updateAppState({ 
                sessionActive: true,
                statusText: 'Session active - AI ready to assist'
            });
        } else {
            console.error('Failed to initialize Gemini session:', result.error);
            updateAppState({ 
                sessionActive: false,
                statusText: `Session failed: ${result.error}`
            });
        }
        
        return result;
    } catch (error) {
        console.error('Failed to initialize Gemini:', error);
        updateAppState({ 
            sessionActive: false,
            statusText: `Session error: ${error.message}`
        });
        return { success: false, error: error.message };
    }
}

// Start capture
function startCapture(interval, quality) {
    currentImageQuality = quality;
    
    if (interval === 'manual') {
        console.log('Manual capture mode enabled');
        return;
    }

    const intervalMs = parseInt(interval) * 1000;
    screenshotInterval = setInterval(() => {
        captureScreenshot(quality);
    }, intervalMs);

    console.log(`Started capture with ${interval}s interval`);
}

// Stop capture
function stopCapture() {
    if (screenshotInterval) {
        clearInterval(screenshotInterval);
        screenshotInterval = null;
    }
    console.log('Stopped capture');
}

// Send text message
async function sendTextMessage(message) {
    try {
        console.log('Sending text message:', message);
        const result = await ipcRenderer.invoke('send-text-message', message);
        console.log('Text message result:', result);
        return result;
    } catch (error) {
        console.error('Failed to send text message:', error);
        return { success: false, error: error.message };
    }
}

// Handle shortcut
function handleShortcut(shortcutKey) {
    console.log('Shortcut triggered:', shortcutKey);
    
    if (appState.currentView === 'main') {
        // Start session
        if (reactAppRef && reactAppRef.handleStart) {
            reactAppRef.handleStart();
        }
    } else if (appState.currentView === 'assistant') {
        // Take manual screenshot
        captureScreenshot(currentImageQuality, true);
    }
}

// Capture screenshot
async function captureScreenshot(imageQuality = 'medium', isManual = false) {
    if (!tokenTracker.canMakeRequest('image')) {
        console.log('Rate limit exceeded for images');
        return;
    }

    try {
        const sources = await ipcRenderer.invoke('get-screen-sources');
        if (sources && sources.length > 0) {
            const result = await ipcRenderer.invoke('capture-screenshot', {
                sourceId: sources[0].id,
                quality: imageQuality,
                isManual
            });
            
            if (result.success) {
                tokenTracker.addTokens(1, 'image');
                console.log('Screenshot captured successfully');
            }
        }
    } catch (error) {
        console.error('Failed to capture screenshot:', error);
    }
}

// Setup audio processing
function setupAudioProcessing() {
    if (audioContext) {
        return;
    }

    audioContext = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: SAMPLE_RATE
    });

    console.log('Audio context initialized');
}

// Initialize conversation storage
function initConversationStorage() {
    // Initialize conversation storage
    console.log('Conversation storage initialized');
}

// Get all conversation sessions
function getAllConversationSessions() {
    return [];
}

// Get conversation session
function getConversationSession(sessionId) {
    return null;
}

// Create consolidated cheddar object for React
const cheddar = {
    // Element access
    element: () => reactAppRef,
    e: () => reactAppRef,

    // App state functions
    getCurrentView: () => appState.currentView,
    getLayoutMode: () => appState.layoutMode,

    // Status and response functions
    setStatus: (text) => setStatus(text),
    setResponse: (response) => setResponse(response),

    // Core functionality
    initializeGemini,
    startCapture,
    stopCapture,
    sendTextMessage,
    handleShortcut,

    // Conversation history functions
    getAllConversationSessions,
    getConversationSession,
    initConversationStorage,

    // Content protection function
    getContentProtection: () => {
        const contentProtection = localStorage.getItem('contentProtection');
        return contentProtection !== null ? contentProtection === 'true' : true;
    },

    // Platform detection
    isLinux: isLinux,
    isMacOS: isMacOS,

    // React-specific functions
    setReactAppRef,
    updateAppState,
    getAppState: () => appState
};

// Make it globally available
window.cheddar = cheddar;

// Export for React components
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { cheddar, setReactAppRef, updateAppState };
}
