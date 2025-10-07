# Cheating Daddy - React Version

A sophisticated real-time AI assistant built with Electron and React, designed to provide contextual help during video calls, interviews, presentations, and meetings.

## 🚀 Features

### Core Functionality
- **Live AI Assistance** - Real-time help powered by Google Gemini 2.0 Flash Live
- **Screen & Audio Capture** - Analyzes what you see and hear for contextual responses
- **Multiple AI Profiles** - Interview, Sales, Meeting, Presentation, Negotiation, and Exam modes
- **Stealth Features** - Hidden from taskbar, random process names, and content protection
- **Cross-Platform** - Works on macOS, Windows, and Linux

### UI Improvements (React Version)
- **Modern React Interface** - Clean, intuitive design with React components
- **Comprehensive Settings** - Advanced customization options
- **Interactive Onboarding** - Step-by-step tutorial for new users
- **Conversation History** - View and manage past sessions
- **Advanced Tools** - Power user features and system statistics
- **Responsive Design** - Adapts to different screen sizes and layouts

## 🛠️ Technology Stack

- **Frontend**: React 18 with modern hooks
- **Desktop**: Electron with Electron Forge
- **Styling**: CSS3 with CSS variables for theming
- **Build**: Webpack with Babel for React compilation
- **AI**: Google Gemini 2.0 Flash Live API

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sohzm/cheating-daddy.git
   cd cheating-daddy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the application**
   ```bash
   npm run build:dev
   ```

4. **Start the application**
   ```bash
   npm start
   ```

## 🎯 Usage

### Getting Started
1. **First Launch**: Complete the interactive onboarding tutorial
2. **API Key**: Enter your Gemini API key (get one from [Google AI Studio](https://aistudio.google.com/))
3. **Choose Profile**: Select the AI personality that fits your situation
4. **Start Session**: Begin your AI-powered assistance

### AI Profiles
- **Interview** 💼 - Job interview assistance
- **Sales Call** 💰 - Sales conversation help
- **Business Meeting** 🤝 - Professional meeting support
- **Presentation** 🎤 - Public speaking assistance
- **Negotiation** ⚖️ - Negotiation strategy support
- **Exam Mode** 📝 - Academic exam assistance

### Keyboard Shortcuts
- `Ctrl/Cmd + Arrow Keys` - Move window position
- `Ctrl/Cmd + \` - Toggle window visibility
- `Ctrl/Cmd + M` - Toggle click-through mode
- `Ctrl/Cmd + Enter` - Start session or take screenshot
- `Ctrl/Cmd + [` - Previous response
- `Ctrl/Cmd + ]` - Next response
- `Ctrl/Cmd + Shift + E` - Emergency erase (quit & clear data)

## 🎨 UI Components

### Main Views
- **MainView** - API key entry and session start
- **AssistantView** - Real-time AI interaction
- **CustomizeView** - Settings and preferences
- **HistoryView** - Conversation history management
- **HelpView** - Documentation and shortcuts
- **AdvancedView** - Power user tools
- **OnboardingView** - Interactive tutorial

### Key Features
- **Responsive Design** - Adapts to different window sizes
- **Dark Theme** - Professional dark interface
- **Smooth Animations** - Polished user experience
- **Accessibility** - Keyboard navigation and screen reader support

## 🔧 Development

### Project Structure
```
src/
├── components/          # React components
│   ├── AppHeader.jsx   # Header with navigation
│   ├── MainView.jsx    # Main interface
│   ├── AssistantView.jsx # AI interaction
│   ├── CustomizeView.jsx # Settings
│   ├── HistoryView.jsx # Conversation history
│   ├── HelpView.jsx    # Help and documentation
│   ├── AdvancedView.jsx # Advanced tools
│   └── OnboardingView.jsx # Tutorial
├── utils/              # Utility functions
├── App.jsx            # Main React app
├── App.css            # Global styles
└── index-react.js     # React entry point
```

### Building for Production
```bash
# Development build
npm run build:dev

# Production build
npm run build

# Package for distribution
npm run make
```

### Platform-Specific Builds
```bash
# macOS
npm run make -- --platform=darwin

# Windows
npm run make -- --platform=win32

# Linux
npm run make -- --platform=linux
```

## 🚨 Stealth Features

### Security & Privacy
- **Content Protection** - Prevents screenshots of the application
- **Random Process Names** - Uses random process names for stealth
- **Hidden from Taskbar** - Option to hide from system taskbar
- **Emergency Erase** - Instantly quit and clear all data
- **Local Storage** - All data stored locally, no cloud transmission

### Anti-Detection
- **Process Name Randomization** - Changes process name on startup
- **Window Title Masking** - Uses generic window titles
- **Content Protection** - Prevents screen capture of the app
- **Stealth Mode** - Ultra-stealth mode for maximum discretion

## 📊 Advanced Features

### System Statistics
- Total sessions and responses
- Average response time
- Session uptime tracking
- Performance metrics

### Data Management
- Export conversation history
- Import backup data
- Emergency data erasure
- Local data encryption

### Customization
- Custom AI prompts
- Rate limiting controls
- Debug mode
- Advanced stealth settings

## 🔒 Privacy & Security

- **Local Processing** - All data processed locally
- **No Cloud Storage** - No data transmitted to external servers
- **API Key Security** - Stored locally with encryption
- **Emergency Erase** - Instant data deletion capability
- **Content Protection** - Prevents unauthorized screenshots

## 🐛 Troubleshooting

### Common Issues
1. **Build Errors** - Ensure all dependencies are installed
2. **API Key Issues** - Verify your Gemini API key is valid
3. **Permission Errors** - Grant screen recording permissions
4. **Performance Issues** - Adjust rate limiting settings

### Debug Mode
Enable debug mode in Advanced Settings for detailed logging and troubleshooting information.

## 📝 License

This project is for educational and professional assistance purposes. Please use responsibly and in accordance with your organization's policies.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## ⚠️ Disclaimer

This tool is designed for educational and professional assistance. Please use it ethically and in accordance with your organization's policies. The developers are not responsible for any misuse of this software.

---

**Built with ❤️ using React, Electron, and Google Gemini AI**
