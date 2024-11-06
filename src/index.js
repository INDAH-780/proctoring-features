class ProctoringLibrary {
  constructor() {
    this.eventLogs = []; // Array to store event logs
    this.initLockdown();
    this.initLogging();
    this.enforceFullscreen();
  }

  // Method to disable right-click, text selection, and common shortcuts
  initLockdown() {
    // Disable right-click
    document.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      this.logEvent("Right-click blocked");
    });

    // Disable text selection
    document.addEventListener("selectstart", (event) => {
      event.preventDefault();
      this.logEvent("Text selection blocked");
    });

    // Disable common shortcuts (Ctrl+C, Ctrl+V, etc.)
    document.addEventListener("keydown", (event) => {
      if (event.ctrlKey || event.metaKey) {
        const forbiddenKeys = ["c", "v", "x", "s", "a"];
        if (forbiddenKeys.includes(event.key.toLowerCase())) {
          event.preventDefault();
          this.logEvent(`Blocked shortcut: ${event.key.toUpperCase()}`);
        }
      }
    });
  }

  // Method to enforce fullscreen and listen for exit attempts
  enforceFullscreen() {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }

    // Detect fullscreen exit and prompt re-entry
    document.addEventListener("fullscreenchange", () => {
      if (!document.fullscreenElement) {
        this.logEvent("Fullscreen exited");
        alert("Please stay in fullscreen mode to continue the exam.");
        // Redirect to fullscreen if exited
        this.enforceFullscreen();
      }
    });
  }

  // Method to initialize event logging for keystrokes, fullscreen exits, tab switches
  initLogging() {
    // Detect keystrokes and log them
    document.addEventListener("keydown", (event) => {
      this.logEvent(`Keystroke detected: ${event.key}`);
    });

    // Detect tab switch or window blur
    window.addEventListener("blur", () => {
      this.logEvent("Tab switch or window blur detected");
    });
  }

  // Method to log events
  logEvent(message) {
    const timestamp = new Date().toISOString();
    this.eventLogs.push({ message, timestamp });
    console.log(`[LOG ${timestamp}] ${message}`);
  }

  // Method to retrieve logs (for later analysis)
  getLogs() {
    return this.eventLogs;
  }
}

// Automatically initialize the library when loaded
const proctoringLibrary = new ProctoringLibrary();
export default proctoringLibrary;
