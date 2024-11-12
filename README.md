# ProctoringLibrary

An open source JavaScript library designed to ensure a secure and fair online exam environment. It prevents common cheating techniques by implementing browser lockdown features, enforcing fullscreen mode, and periodically capturing screenshots at intervals. It also tracks suspicious activities, such as tab/window switches and restricted keyboard shortcuts.

## Features

- **Browser Lockdown**: 
  - Disables right-click, text selection, and common keyboard shortcuts (e.g., Ctrl+C, Ctrl+V, etc.).
  - Logs and alerts users about blocked actions.
  
- **Fullscreen Enforcement**: 
  - Automatically switches the page to fullscreen mode when the exam starts.
  - Detects and logs fullscreen exits, prompting the user to return to fullscreen.

- **Activity Logging**: 
  - Logs key events such as keystrokes, window/tab switches, and fullscreen changes.
  - Real-time alerts for suspicious activities.
  
- **Screenshot Capture**:
  - Periodically captures screenshots at set intervals (default: every 10 minutes).
  - Optionally logs and stores screenshots to prevent unauthorized activity.

- **Suspicious Activity Detection**:
  - Alerts for actions like Alt+Tab, Meta+Tab, or window blur (possible tab switching).

## Installation

To include the ProctoringLibrary in your project, you can use the following methods.

### Using npm:

If you're using npm in your project, you can install the library with:

```bash
npm install proctoringlibrary

```
### In Node.js Project
- If you're using npm in your Node.js project, you can install the library and then use it as follows:
- Import and initialize the library in your JavaScript file:

```javascript
const ProctoringLibrary = require('proctoringlibrary');

// Initialize the proctoring functionality
const proctoringLibrary = new ProctoringLibrary();

// You can now call its methods, for example:
proctoringLibrary.startScreenshotCapture();
```
- Run your application:
- This will enable the proctoring functionality in your Node.js application.

### In React.js Project

- If you're using npm with a React.js project, here's how you can install and use the ProctoringLibrary:
- After installing the library, you can import it into your React components as follows:

```javascript
import ProctoringLibrary from 'proctoring-features';
```

### Limitations

- **Permissions**: Modern browsers may prompt users for permission to share their screen. This may not be ideal for some use cases, but it is a necessary browser security feature.
- **Browser Compatibility:** While the library works in most modern browsers, fullscreen behavior may vary slightly between browsers.
- **Screenshot Capture:** Requires the user to grant permission for screen capture.

### Contributing
- We welcome contributions! If you have suggestions, improvements, or bug fixes, feel free to fork the repository, make changes, and submit a pull request.

## License
- This library is released under the MIT License.
