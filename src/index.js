//modules implemented
/* Browser lockdown 
-right clicked using the contextmenu event handler 
-text selection using the selectstart event listener
- various shotcuts using the kedown event listener
*/

/* fullscreen
-fullscreen enforcement using the requestfullscreen event
-exit fullscreen using the exitfullscreen event handler */

class ProctoringLibrary {
  constructor() {
    this.eventLogs = [];
    this.suspiciousActivities = [];
    this.screenshotInterval = null;
    this.altKeyActive = false;

    this.initLockdown();
    this.initLogging();
    this.enforceFullscreen();
    this.startScreenshotCapture();
    this.detectWindowSwitching();
  }

  showAlert(message) {
    // alert(message); // Basic alert for user
  }

  // Method to disable right-click, text selection, and common shortcuts
  initLockdown() {
    document.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      this.logEvent("Right-click blocked");
    });

    document.addEventListener("selectstart", (event) => {
      event.preventDefault();
      this.logEvent("Text selection blocked");
    });

    document.addEventListener("keydown", (event) => {
      if (event.ctrlKey || event.metaKey) {
        const forbiddenKeys = ["c", "v", "x", "s", "a"];
        if (forbiddenKeys.includes(event.key.toLowerCase())) {
          event.preventDefault();
          this.logEvent(`Blocked shortcut: ${event.key.toUpperCase()}`);
          this.notifySuspiciousActivity(
            `Blocked shortcut: ${event.key.toUpperCase()}`
          );
        }
      }
    });
  }

  // Method to enforce fullscreen and listen for exit attempts
 
  enforceFullscreen() {
    console.log("Attempting to enter fullscreen"); 
    const elem = document.documentElement;

    if (elem.requestFullscreen) {
      elem
        .requestFullscreen()
        .then(() => console.log("Fullscreen activated"))
        .catch((error) =>
          console.error("Failed to activate fullscreen:", error)
        );
    } else if (elem.mozRequestFullScreen) {
      /* Firefox */
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      /* Chrome, Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      /* IE */
      elem.msRequestFullscreen();
    }
  }

  // Fullscreen exit handler
  handleFullscreenChange() {
    if (
      !document.fullscreenElement &&
      !document.webkitFullscreenElement &&
      !document.mozFullScreenElement &&
      !document.msFullscreenElement
    ) {
      this.logEvent("Fullscreen exited");
      this.notifySuspiciousActivity("Fullscreen exited");
      //alert("Please stay in fullscreen mode to continue the exam.");
      this.enforceFullscreen(); 
    }
  }

  // Method to initialize event logging for keystrokes, fullscreen exits, tab switches
  initLogging() {
    window.addEventListener("blur", () => {
      this.logEvent("Tab switch or window blur detected");
      this.notifySuspiciousActivity("Tab switch detected");
    });

    // Alt+Tab detection
    document.addEventListener("keydown", (event) => {
      if (event.altKey && event.key === "Tab") {
        this.logEvent("Alt+Tab detected");
        this.notifySuspiciousActivity("Attempted window/tab switch (Alt+Tab)");
      }
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

  // Periodic screenshot capture
  startScreenshotCapture() {
    this.screenshotInterval = setInterval(() => {
      this.captureScreenshot();
    }, 600000); 
  }

  // Method to capture a screenshot
  captureScreenshot() {
    // Check if the browser supports screen capture
    if (navigator.mediaDevices.getDisplayMedia) {
      navigator.mediaDevices
        .getDisplayMedia({ video: true })
        .then((stream) => {
          const videoTrack = stream.getVideoTracks()[0];
          const imageCapture = new ImageCapture(videoTrack);

          // Grab the screenshot (frame from the video)
          imageCapture
            .grabFrame()
            .then((bitmap) => {
              const canvas = document.createElement("canvas");
              canvas.width = bitmap.width;
              canvas.height = bitmap.height;
              const context = canvas.getContext("2d");
              context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

              const imgData = canvas.toDataURL("image/png");
              this.logEvent("Screenshot captured");

              // Optional: Do something with the image data (e.g., send to the server)
              console.log("Captured screenshot as image data:", imgData);

              // Stop the stream after capture
              stream.getTracks().forEach((track) => track.stop());
            })
            .catch((error) => {
              this.logEvent("Screenshot capture failed");
              console.error("Screenshot capture failed:", error);
            });
        })
        .catch((error) => {
          this.logEvent("Screen capture failed");
          console.error("Screen capture failed:", error);
        });
    } else {
      this.logEvent("Screen capture not supported");
      console.error("Screen capture is not supported by this browser");
    }
  }

  // Real-time notification for suspicious activities
  notifySuspiciousActivity(activity) {
    const timestamp = new Date().toISOString();
    this.suspiciousActivities.push({ activity, timestamp });
    this.showAlert(`Warning: ${activity}`);
  }

  // Save events to session storage
  saveToSessionStorage(key, data) {
    sessionStorage.setItem(key, JSON.stringify(data));
  }

  // Method to detect Alt+Tab or Windows+Tab switches
  detectWindowSwitching() {
    document.addEventListener("keydown", (event) => {
      if (event.key === "Alt") {
        this.altKeyActive = true;
      } else if (this.altKeyActive && event.key === "Tab") {
        this.logEvent("Alt+Tab detected");
        this.notifySuspiciousActivity("Attempted window switch (Alt+Tab)");
      } else if (event.key === "Meta") {
        // Detect Windows (Meta)+Tab as another common switch
        this.logEvent("Meta key pressed");
        this.notifySuspiciousActivity(
          "Attempted window switch (Windows/Meta key)"
        );
      }
    });

    document.addEventListener("keyup", (event) => {
      if (event.key === "Alt") {
        this.altKeyActive = false;
      }
    });

    window.addEventListener("blur", () => {
      this.logEvent("Window blur detected (potential tab switch)");
      this.notifySuspiciousActivity("Tab or window switch detected");
    });
  }

  // Method to compile a session summary
  generateSessionSummary() {
    const summary = {
      totalEvents: this.eventLogs.length,
      suspiciousActivities: this.suspiciousActivities,
      eventLog: this.eventLogs,
    };
    console.table(summary);
    return summary;
  }

  // Method to end session and clear intervals
  endSession() {
    clearInterval(this.screenshotInterval);
    const sessionSummary = this.generateSessionSummary();
    this.logEvent("Session ended");
    return sessionSummary;
  }
}

// Automatically initialize the library when loaded
const proctoringLibrary = new ProctoringLibrary();
export default proctoringLibrary;
