const { ipcRenderer } = require("electron");
const { GlobalKeyboardListener } = require("node-global-key-listener");
const path = require("path");
const fs = require("fs");

let audioContext;
let soundBuffer;
let currentSoundPath = path.join(__dirname, "/assets/GENERIC_R3.mp3");

console.log("Renderer process started");
console.log("Current sound:", currentSoundPath);

// Initialize audio context
function initAudio() {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  loadSound(currentSoundPath);
}

// Load sound file
function loadSound(filePath) {
  console.log("Loading sound:", filePath);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error("Error reading sound file:", err);
      return;
    }
    audioContext.decodeAudioData(
      data.buffer,
      (buffer) => {
        soundBuffer = buffer;
        console.log("Sound loaded successfully");
      },
      (err) => console.error("Error decoding audio data:", err)
    );
  });
}

// Play sound function
function playSound() {
  if (!audioContext || !soundBuffer) return;

  const source = audioContext.createBufferSource();
  source.buffer = soundBuffer;
  source.connect(audioContext.destination);
  source.start(0);
}

// Set up key event listener
const v = new GlobalKeyboardListener();

v.addListener(function (e, down) {
  if (down && e.state === "DOWN" && e.name !== "UNKNOWN") {
    if (e.name !== "MOUSE LEFT" && e.name !== "MOUSE RIGHT") {
      console.log("Key pressed:", e.name);
      playSound();
    }
  }
});

ipcRenderer.on("change-sound", (event, soundFile) => {
  console.log("Changing sound to:", soundFile);
  currentSoundPath = path.join(__dirname, soundFile);
  loadSound(currentSoundPath);
  console.log("New current sound:", currentSoundPath);
});

// Initialize audio on page load
document.addEventListener("DOMContentLoaded", initAudio);

console.log("Key listener set up");
