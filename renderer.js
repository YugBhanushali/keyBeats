const { ipcRenderer } = require("electron");
const { GlobalKeyboardListener } = require("node-global-key-listener");
const path = require("path");
const fs = require("fs");

let audioContext;
let soundBuffers = { press: {}, release: {} };
let currentSoundSet = "mxblack";
let genericSounds = [];

console.log("Renderer process started");

// Initialize audio context
function initAudio() {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  loadSoundSet(currentSoundSet);
}

// Load sound set
function loadSoundSet(soundSet) {
  console.log("Loading sound set:", soundSet);
  loadSoundsForType(soundSet, "press");
  loadSoundsForType(soundSet, "release");
}

// Load sounds for a specific type (press or release)
function loadSoundsForType(soundSet, type) {
  const soundSetPath = path.join(__dirname, "assets", "audio", soundSet, type);
  fs.readdir(soundSetPath, (err, files) => {
    if (err) {
      console.error(`Error reading ${type} sound directory:`, err);
      return;
    }
    genericSounds = [];
    files.forEach((file) => {
      if (file.endsWith(".mp3")) {
        const soundName = file.replace(".mp3", "");
        loadSound(path.join(soundSetPath, file), soundName, type);
        if (soundName.startsWith("GENERIC_")) {
          genericSounds.push(soundName);
        }
      }
    });
  });
}

// Load individual sound
function loadSound(filePath, soundName, type) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error("Error reading sound file:", err);
      return;
    }
    audioContext.decodeAudioData(
      data.buffer,
      (buffer) => {
        soundBuffers[type][soundName] = buffer;
        console.log(`${type} sound loaded:`, soundName);
      },
      (err) => console.error("Error decoding audio data:", err)
    );
  });
}

// Play sound function
function playSound(soundName, type) {
  let bufferToPlay;
  if (
    ["BACKSPACE", "ENTER", "SPACE"].includes(soundName) &&
    soundBuffers[type][soundName]
  ) {
    bufferToPlay = soundBuffers[type][soundName];
  } else {
    // Randomly select a generic sound
    const genericSound =
      genericSounds[Math.floor(Math.random() * genericSounds.length)];
    console.log(genericSounds);
    bufferToPlay = soundBuffers[type][genericSound];
  }

  if (audioContext && bufferToPlay) {
    const source = audioContext.createBufferSource();
    source.buffer = bufferToPlay;
    source.connect(audioContext.destination);
    source.start(0);
  }
}

// Set up key event listener
const v = new GlobalKeyboardListener();

v.addListener(function (e, down) {
  if (
    e.state === "DOWN" &&
    e.name !== "MOUSE LEFT" &&
    e.name !== "MOUSE RIGHT"
  ) {
    let soundName = e.name.toUpperCase();
    if (soundName === "RETURN") soundName = "ENTER";

    if (down) {
      console.log("Key pressed:", e.name);
      playSound(soundName, "press");
    } else {
      console.log("Key released:", e.name);
      playSound(soundName, "release");
    }
  }
});

ipcRenderer.on("change-sound-set", (event, soundSet) => {
  console.log("Changing sound set to:", soundSet);
  currentSoundSet = soundSet;
  loadSoundSet(currentSoundSet);
});

// Initialize audio on page load
document.addEventListener("DOMContentLoaded", initAudio);

console.log("Key listener set up");
