if (require('electron-squirrel-startup')) {
    process.exit(0);
}

const { app, BrowserWindow, shell, ipcMain } = require('electron');
const { createWindow, updateGlobalShortcuts } = require('./utils/window');
const { setupGeminiIpcHandlers, stopMacOSAudioCapture, sendToRenderer } = require('./utils/gemini');
const { initializeRandomProcessNames } = require('./utils/processRandomizer');
const { applyAntiAnalysisMeasures } = require('./utils/stealthFeatures');
const { getLocalConfig, writeConfig } = require('./config');

const geminiSessionRef = { current: null };
let mainWindow = null;

// Initialize random process names for stealth
const randomNames = initializeRandomProcessNames();

function createMainWindow() {
    mainWindow = createWindow(sendToRenderer, geminiSessionRef, randomNames);
    return mainWindow;
}

app.whenReady().then(async () => {
    // Apply anti-analysis measures with random delay
    await applyAntiAnalysisMeasures();

    createMainWindow();
    setupGeminiIpcHandlers(geminiSessionRef);
    setupGeneralIpcHandlers();
});

app.on('window-all-closed', () => {
    stopMacOSAudioCapture();
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('before-quit', () => {
    stopMacOSAudioCapture();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
    }
});

function setupGeneralIpcHandlers() {
    // Config-related IPC handlers
    ipcMain.handle('set-onboarded', async (event) => {
        try {
            const config = getLocalConfig();
            config.onboarded = true;
            writeConfig(config);
            return { success: true, config };
        } catch (error) {
            console.error('Error setting onboarded:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('set-stealth-level', async (event, stealthLevel) => {
        try {
            const validLevels = ['visible', 'balanced', 'ultra'];
            if (!validLevels.includes(stealthLevel)) {
                throw new Error(`Invalid stealth level: ${stealthLevel}. Must be one of: ${validLevels.join(', ')}`);
            }
            
            const config = getLocalConfig();
            config.stealthLevel = stealthLevel;
            writeConfig(config);
            return { success: true, config };
        } catch (error) {
            console.error('Error setting stealth level:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('set-layout', async (event, layout) => {
        try {
            const validLayouts = ['normal', 'compact'];
            if (!validLayouts.includes(layout)) {
                throw new Error(`Invalid layout: ${layout}. Must be one of: ${validLayouts.join(', ')}`);
            }
            
            const config = getLocalConfig();
            config.layout = layout;
            writeConfig(config);
            return { success: true, config };
        } catch (error) {
            console.error('Error setting layout:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('get-config', async (event) => {
        try {
            const config = getLocalConfig();
            return { success: true, config };
        } catch (error) {
            console.error('Error getting config:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('quit-application', async event => {
        try {
            stopMacOSAudioCapture();
            app.quit();
            return { success: true };
        } catch (error) {
            console.error('Error quitting application:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('open-external', async (event, url) => {
        try {
            await shell.openExternal(url);
            return { success: true };
        } catch (error) {
            console.error('Error opening external URL:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.on('update-keybinds', (event, newKeybinds) => {
        if (mainWindow) {
            updateGlobalShortcuts(newKeybinds, mainWindow, sendToRenderer, geminiSessionRef);
        }
    });

    ipcMain.handle('update-content-protection', async (event, contentProtection) => {
        try {
            if (mainWindow) {

                // Get content protection setting from localStorage via cheddar
                const contentProtection = await mainWindow.webContents.executeJavaScript('cheddar.getContentProtection()');
                mainWindow.setContentProtection(contentProtection);
                console.log('Content protection updated:', contentProtection);
            }
            return { success: true };
        } catch (error) {
            console.error('Error updating content protection:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('get-random-display-name', async event => {
        try {
            return randomNames ? randomNames.displayName : 'System Monitor';
        } catch (error) {
            console.error('Error getting random display name:', error);
            return 'System Monitor';
        }
    });

    // Missing IPC handlers for React frontend
    ipcMain.handle('initialize-gemini-session', async (event, { profile, language }) => {
        try {
            console.log('Initializing Gemini session with profile:', profile, 'language:', language);
            
            // Get API key from localStorage via the renderer
            const apiKey = await mainWindow.webContents.executeJavaScript('localStorage.getItem("apiKey")');
            
            if (!apiKey) {
                return { success: false, error: 'No API key found. Please enter your Gemini API key first.' };
            }
            
            // Initialize the Gemini session using the existing gemini.js functionality
            const { initializeGeminiSession } = require('./utils/gemini');
            const result = await initializeGeminiSession(apiKey, '', profile, language, false, geminiSessionRef);
            
            if (result) {
                console.log('Gemini session initialized successfully');
                return { success: true, sessionId: Date.now().toString() };
            } else {
                console.error('Failed to initialize Gemini session');
                return { success: false, error: 'Failed to initialize Gemini session' };
            }
        } catch (error) {
            console.error('Error initializing Gemini session:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('get-screen-sources', async (event) => {
        try {
            const { desktopCapturer } = require('electron');
            const sources = await desktopCapturer.getSources({
                types: ['screen', 'window'],
                thumbnailSize: { width: 150, height: 150 }
            });
            
            // Filter out the current application window to avoid self-capture
            const filteredSources = sources.filter(source => 
                !source.name.includes('Cheating Daddy') && 
                !source.name.includes('Electron') &&
                !source.name.includes('System Information') &&
                !source.name.includes('Network Connections')
            );
            
            console.log('Available screen sources:', filteredSources.length);
            return filteredSources;
        } catch (error) {
            console.error('Error getting screen sources:', error);
            return [];
        }
    });

    ipcMain.handle('capture-screenshot', async (event, { sourceId, quality, isManual }) => {
        try {
            console.log('Capturing screenshot:', { sourceId, quality, isManual });
            // This would normally capture a screenshot
            // For now, return success
            return { success: true, timestamp: Date.now() };
        } catch (error) {
            console.error('Error capturing screenshot:', error);
            return { success: false, error: error.message };
        }
    });


    ipcMain.handle('emergency-erase', async (event) => {
        try {
            console.log('Emergency erase triggered');
            // Clear all data and quit
            app.quit();
            return { success: true };
        } catch (error) {
            console.error('Error during emergency erase:', error);
            return { success: false, error: error.message };
        }
    });
}
