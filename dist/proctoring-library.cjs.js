"use strict";const e=new class{constructor(){this.eventLogs=[],this.initLockdown(),this.initLogging(),this.enforceFullscreen()}initLockdown(){document.addEventListener("contextmenu",(e=>{e.preventDefault(),this.logEvent("Right-click blocked")})),document.addEventListener("selectstart",(e=>{e.preventDefault(),this.logEvent("Text selection blocked")})),document.addEventListener("keydown",(e=>{if(e.ctrlKey||e.metaKey){["c","v","x","s","a"].includes(e.key.toLowerCase())&&(e.preventDefault(),this.logEvent(`Blocked shortcut: ${e.key.toUpperCase()}`))}}))}enforceFullscreen(){document.documentElement.requestFullscreen&&document.documentElement.requestFullscreen(),document.addEventListener("fullscreenchange",(()=>{document.fullscreenElement||(this.logEvent("Fullscreen exited"),alert("Please stay in fullscreen mode to continue the exam."),this.enforceFullscreen())}))}initLogging(){document.addEventListener("keydown",(e=>{this.logEvent(`Keystroke detected: ${e.key}`)})),window.addEventListener("blur",(()=>{this.logEvent("Tab switch or window blur detected")}))}logEvent(e){const t=(new Date).toISOString();this.eventLogs.push({message:e,timestamp:t}),console.log(`[LOG ${t}] ${e}`)}getLogs(){return this.eventLogs}};module.exports=e;
