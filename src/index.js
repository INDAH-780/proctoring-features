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
    //setting up arrays to store logs for all activities
    this.eventLogs = [];
    this.suspiciousActivities = [];
    this.screenshotInterval = null;
    this.altKeyActive = false;
    this.timerInterval = null;
    this.elapsedTime = 0;
    this.totalExamDuration = null;

    //innitialising the various functions to be used in the library
    this.initLockdown();
    this.initLogging();
    this.enforceFullscreen();
    this.startScreenshotCapture();
    this.detectWindowSwitching();
    this.createNotificationModal();
    this.addFullscreenListener();
    this.setExamDuration(this.totalExamDuration);
  }

  // Public method to allow the user to set exam duration from their application, to ensure flexibility
  setExamDuration(duration) {
    if (duration && duration > 0) {
      this.totalExamDuration = duration;
      this.startTimerNotification();
    }
  }

  //creating all modals to be used as popups
  // custom notification modal, the overall notification modal
  createNotificationModal() {
    if (document.getElementById("notification-modal")) return;
    //creating a div for the modal, which will contain a header and a body
    const modal = document.createElement("div");

    //this style goes forthe modal's container, the div
    modal.id = "notification-modal";
    modal.style.display = "none";
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.backgroundColor = "#fff";
    modal.style.border = "2px solid #333";
    modal.style.borderRadius = "12px";
    modal.style.padding = "40px";
    modal.style.zIndex = "1000";
    modal.style.boxShadow = "0px 10px 20px rgba(0, 0, 0, 0.1)";
    modal.style.maxWidth = "300px";
    modal.style.width = "90%";
    modal.style.minHeight = "50px";
    modal.style.overflowY = "auto";
    modal.style.transition = "all 0.3s ease-in-out";

    // the header is a container in the main modal, created and styled
    const header = document.createElement("div");
    header.style.fontSize = "20px";
    header.style.fontWeight = "bold";
    header.style.color = "#333";
    header.style.marginBottom = "20px";
    header.innerText = "Alert!";
    modal.appendChild(header);

    const message = document.createElement("span");
    message.id = "modal-message";
    message.style.fontSize = "18px";
    message.style.color = "#333";
    message.style.lineHeight = "1.5";
    message.style.marginBottom = "20px";
    modal.appendChild(message);
    document.body.appendChild(modal);
  }

  // the body of the header contains a dynamic message with respect to the type of suspicious activity
  showNotification(message) {
    const modalMessage = document.getElementById("modal-message");
    modalMessage.innerText = message;

    //At this level the modal is shown, with a visibility time of 2 seconds
    const modal = document.getElementById("notification-modal");
    modal.style.display = "block";
    modal.style.opacity = "0";
    setTimeout(() => {
      modal.style.opacity = "1";
    }, 10);

    setTimeout(() => {
      modal.style.opacity = "0";
      setTimeout(() => {
        modal.style.display = "none";
      }, 300);
    }, 5000);
  }

  // Real-time notification for suspicious activities
  notifySuspiciousActivity(activity) {
    const timestamp = new Date().toISOString();
    this.suspiciousActivities.push({ activity, timestamp });
    this.showNotification(`${activity}`);
  }

  //Logic for the event listener
  addFullscreenListener() {
    document.addEventListener("fullscreenchange", () => {
      if (document.fullscreenElement) {
        this.startTimerNotification();
      }
    });

    document.addEventListener("webkitfullscreenchange", () => {
      if (document.webkitFullscreenElement) {
        this.startTimerNotification();
      }
    });

    document.addEventListener("mozfullscreenchange", () => {
      if (document.mozFullScreenElement) {
        this.startTimerNotification();
      }
    });

    document.addEventListener("msfullscreenchange", () => {
      if (document.msFullscreenElement) {
        this.startTimerNotification();
      }
    });
  }

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
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  }

  handleFullscreenChange() {
    if (
      !document.fullscreenElement &&
      !document.webkitFullscreenElement &&
      !document.mozFullScreenElement &&
      !document.msFullscreenElement
    ) {
      this.logEvent("Fullscreen exited");
      this.notifySuspiciousActivity("Fullscreen exited");
      this.enforceFullscreen();
    }
  }

  //Logic for the timer
  startTimerNotification() {
    if (this.totalExamDuration) {
      this.showNotification(
        `The exam will be written in ${this.totalExamDuration} minutes.`
      );
    }

    this.timerInterval = setInterval(() => {
      const remainingTime = this.totalExamDuration - this.elapsedTime;
      if (remainingTime <= 0) {
        clearInterval(this.timerInterval);
        this.showNotification("Time's up! Exam session has ended.");
      } else {
        this.showNotification(
          `You have been writing for ${this.elapsedTime} minutes. ${remainingTime} minutes remaining.`
        );
        this.elapsedTime++;
      }
    }, 900000);
  }

  // Method to detect window switching with Alt key press
  detectWindowSwitching() {
    const handleKeyDown = (event) => {
      if (event.altKey) {
        this.logEvent("Alt key pressed");
        this.notifySuspiciousActivity(
          "You cannot switch tabs during the exam. Please stay on this tab."
        );
        event.preventDefault();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
  }

  //for right click, text selection, keydown press
  initLockdown() {
    document.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      this.logEvent("Right-click blocked");
      this.notifySuspiciousActivity("Right-click is disabled during the exam.");
    });

    document.addEventListener("selectstart", (event) => {
      event.preventDefault();
      this.logEvent("Text selection blocked");
      this.notifySuspiciousActivity(
        "Text selection is disabled during the exam."
      );
    });

    document.addEventListener("keydown", (event) => {
      if (event.ctrlKey || event.metaKey) {
        const forbiddenKeys = ["c", "v", "x", "s", "a"];
        if (forbiddenKeys.includes(event.key.toLowerCase())) {
          event.preventDefault();
          this.logEvent(`Blocked shortcut: ${event.key.toUpperCase()}`);
          this.notifySuspiciousActivity(
            `Shortcut ${event.key.toUpperCase()} is disabled during the exam.`
          );
        }
      }
    });
  }

  //alt tab and blur event
  initLogging() {
    window.addEventListener("blur", () => {
      this.logEvent("Tab switch or window blur detected");
      this.notifySuspiciousActivity("Tab switch detected");
    });

    document.addEventListener("keydown", (event) => {
      if (event.altKey && event.key === "Tab") {
        this.logEvent("Alt+Tab detected");
        this.notifySuspiciousActivity("Attempted window/tab switch (Alt+Tab)");
      }
    });
  }

  //snapshots
  startScreenshotCapture() {
    this.screenshotInterval = setInterval(() => {
      this.captureScreenshot();
    }, 600000);
  }

  // Method to capture both screen and user's face (webcam)
  captureScreenshot() {
    if (
      navigator.mediaDevices.getDisplayMedia &&
      navigator.mediaDevices.getUserMedia
    ) {
      // Capture the screen
      navigator.mediaDevices
        .getDisplayMedia({ video: true })
        .then((screenStream) => {
          // Capture the user's face
          navigator.mediaDevices
            .getUserMedia({ video: { facingMode: "user" } })
            .then((faceStream) => {
              // Create a canvas to combine both streams
              const canvas = document.createElement("canvas");
              const context = canvas.getContext("2d");

              // Get screen and face video tracks
              const screenTrack = screenStream.getVideoTracks()[0];
              const faceTrack = faceStream.getVideoTracks()[0];

              // Create video elements for both streams
              const screenVideo = document.createElement("video");
              const faceVideo = document.createElement("video");

              screenVideo.srcObject = new MediaStream([screenTrack]);
              faceVideo.srcObject = new MediaStream([faceTrack]);

              screenVideo.onloadedmetadata = () => {
                faceVideo.onloadedmetadata = () => {
                  // Set canvas dimensions to fit both video streams
                  canvas.width = screenVideo.videoWidth;
                  canvas.height =
                    screenVideo.videoHeight + faceVideo.videoHeight;

                  // Draw both the screen and face streams onto the canvas
                  context.drawImage(
                    screenVideo,
                    0,
                    0,
                    canvas.width,
                    screenVideo.videoHeight
                  );
                  context.drawImage(
                    faceVideo,
                    0,
                    screenVideo.videoHeight,
                    canvas.width,
                    faceVideo.videoHeight
                  );

                  // Convert canvas to image and log the screenshot
                  const imgData = canvas.toDataURL("image/png");
                  this.logEvent("Screenshot captured with screen and face");

                  // Stop both streams
                  screenStream.getTracks().forEach((track) => track.stop());
                  faceStream.getTracks().forEach((track) => track.stop());
                };
                faceVideo.play();
              };
              screenVideo.play();
            })
            .catch((error) => {
              this.logEvent("Face capture failed");
              console.error("Face capture failed:", error);
            });
        })
        .catch((error) => {
          this.logEvent("Screen capture failed");
          console.error("Screen capture failed:", error);
        });
    } else {
      this.logEvent("Screen capture or webcam not supported");
      console.error(
        "Screen capture or webcam is not supported by this browser"
      );
    }
  }

  //event logs
  logEvent(message) {
    const timestamp = new Date().toISOString();
    this.eventLogs.push({ message, timestamp });
    console.log(`[LOG ${timestamp}] ${message}`);
  }

  getLogs() {
    return this.eventLogs;
  }

  saveToSessionStorage(key, data) {
    sessionStorage.setItem(key, JSON.stringify(data));
  }

  generateSessionSummary() {
    const summary = {
      totalEvents: this.eventLogs.length,
      suspiciousActivities: this.suspiciousActivities,
      eventLog: this.eventLogs,
    };
    console.table(summary);
    return summary;
  }

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





