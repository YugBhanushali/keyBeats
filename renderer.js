// const { ipcRenderer } = require("electron");
// const { GlobalKeyboardListener } = require("node-global-key-listener");
// const path = require("path");
// const { keySounds } = require("./audioFiles/audioModules/audioModule");
// const fs = require("fs").promises;

// let audioContext;
// let currentSoundSet = "alpaca"; // Default sound set
// let soundBuffers = {};

// console.log("Renderer process started");

// let gainNode;
// let volumeLevel = 10;

// // Initialize audio context
// function initAudio() {
//   // audioContext = new (window.AudioContext || window.webkitAudioContext)();
//   // loadSoundSet(currentSoundSet);
//   audioContext = new (window.AudioContext || window.webkitAudioContext)();
//   gainNode = audioContext.createGain();
//   gainNode.connect(audioContext.destination);
//   updateVolume(volumeLevel);
//   loadSoundSet(currentSoundSet);
// }

// // Add this function to update the volume
// function updateVolume(value) {
//   volumeLevel = value;
//   if (gainNode) {
//     gainNode.gain.setValueAtTime(value, audioContext.currentTime);
//   }
// }

// // Load sound set
// async function loadSoundSet(soundSetKey) {
//   console.log("Loading sound set:", soundSetKey);
//   const soundSet = keySounds.find((set) => set.key === soundSetKey);
//   if (!soundSet) {
//     console.error("Sound set not found:", soundSetKey);
//     return;
//   }

//   soundBuffers = { press: {}, release: {} };

//   // Load press sounds
//   for (const [key, audioPath] of Object.entries(soundSet.press)) {
//     await loadSound(audioPath, key, "press");
//   }

//   // Load release sounds
//   for (const [key, audioPath] of Object.entries(soundSet.release)) {
//     await loadSound(audioPath, key, "release");
//   }

//   console.log("Sound set loaded:", soundSetKey);
// }

// // Load individual sound
// async function loadSound(audioPath, soundName, type) {
//   try {
//     const data = await fs.readFile(audioPath);
//     const arrayBuffer = data.buffer;
//     const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
//     soundBuffers[type][soundName] = audioBuffer;
//     console.log(`${type} sound loaded:`, soundName);
//   } catch (error) {
//     console.error("Error loading sound:", error, "Path:", audioPath);
//   }
// }

// // Play sound function
// function playSound(soundName, type) {
//   let bufferToPlay;
//   if (
//     ["SPACE", "ENTER", "BACKSPACE"].includes(soundName) &&
//     soundBuffers[type][soundName]
//   ) {
//     bufferToPlay = soundBuffers[type][soundName];
//   } else {
//     // Randomly select a generic sound
//     const genericKeys = Object.keys(soundBuffers[type]).filter((key) =>
//       key.startsWith("GENERIC")
//     );
//     const randomGenericKey =
//       genericKeys[Math.floor(Math.random() * genericKeys.length)];
//     bufferToPlay = soundBuffers[type][randomGenericKey];
//   }

//   if (audioContext && bufferToPlay) {
//     const source = audioContext.createBufferSource();
//     source.buffer = bufferToPlay;
//     source.connect(gainNode);
//     source.start(0);
//   }
// }

// // Set up key event listener
// const v = new GlobalKeyboardListener();

// v.addListener(function (e, down) {
//   let soundName = e.name.toUpperCase();
//   if (soundName === "RETURN") soundName = "ENTER";

//   if (e.name !== "MOUSE LEFT" && e.name !== "MOUSE RIGHT") {
//     if (down && e.state === "DOWN") {
//       console.log("Key pressed:", e.name);
//       playSound(soundName, "press");
//     } else {
//       console.log("Key released:", e.name);
//       playSound(soundName, "release");
//     }
//   }
// });

// // ipcRenderer.on("change-sound-set", (event, soundSet) => {
// //   console.log("Changing sound set to:", soundSet);
// //   currentSoundSet = soundSet;
// //   loadSoundSet(currentSoundSet);
// // });

// ipcRenderer.on("change-sound-set", (event, soundSet) => {
//   console.log("Changing sound set to:", soundSet);
//   currentSoundSet = soundSet;
//   loadSoundSet(currentSoundSet);

//   // Inform the main process that the sound set has changed
//   ipcRenderer.send("sound-set-changed", soundSet);
// });

// // Initialize audio on page load
// document.addEventListener("DOMContentLoaded", initAudio);

// console.log("Key listener set up");

const { ipcRenderer } = require("electron");
const { GlobalKeyboardListener } = require("node-global-key-listener");
const path = require("path");
const { keySounds } = require("./audioFiles/audioModules/audioModule");
const fs = require("fs").promises;

let audioContext;
let currentSoundSet = "alpaca";
let soundBuffers = {};
let gainNode;
let volumeLevel = 15;

console.log("Renderer process started");

function initAudio() {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  gainNode = audioContext.createGain();
  gainNode.connect(audioContext.destination);
  updateVolume(volumeLevel);
  loadSoundSet(currentSoundSet);
}

async function loadSoundSet(soundSetKey) {
  console.log("Loading sound set:", soundSetKey);
  const soundSet = keySounds.find((set) => set.key === soundSetKey);
  if (!soundSet) {
    console.error("Sound set not found:", soundSetKey);
    return;
  }

  soundBuffers = { press: {}, release: {} };

  for (const [key, audioPath] of Object.entries(soundSet.press)) {
    await loadSound(audioPath, key, "press");
  }

  for (const [key, audioPath] of Object.entries(soundSet.release)) {
    await loadSound(audioPath, key, "release");
  }

  console.log("Sound set loaded:", soundSetKey);
}

async function loadSound(audioPath, soundName, type) {
  try {
    const data = await fs.readFile(audioPath);
    const arrayBuffer = data.buffer;
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    soundBuffers[type][soundName] = audioBuffer;
    console.log(`${type} sound loaded:`, soundName);
  } catch (error) {
    console.error("Error loading sound:", error, "Path:", audioPath);
  }
}

function playSound(soundName, type) {
  let bufferToPlay;
  if (
    ["SPACE", "ENTER", "BACKSPACE"].includes(soundName) &&
    soundBuffers[type][soundName]
  ) {
    bufferToPlay = soundBuffers[type][soundName];
  } else {
    const genericKeys = Object.keys(soundBuffers[type]).filter((key) =>
      key.startsWith("GENERIC")
    );
    const randomGenericKey =
      genericKeys[Math.floor(Math.random() * genericKeys.length)];
    bufferToPlay = soundBuffers[type][randomGenericKey];
  }

  if (audioContext && bufferToPlay) {
    const source = audioContext.createBufferSource();
    source.buffer = bufferToPlay;
    source.connect(gainNode);
    source.start(0);
  }
}

function updateVolume(value) {
  volumeLevel = value;
  if (gainNode) {
    const gainValue = (value - 10) / 5;
    gainNode.gain.setValueAtTime(gainValue, audioContext.currentTime);
  }
  document.getElementById("volumeValue").textContent = value;
}

const v = new GlobalKeyboardListener();

v.addListener(function (e, down) {
  let soundName = e.name.toUpperCase();
  if (soundName === "RETURN") soundName = "ENTER";

  if (e.name !== "MOUSE LEFT" && e.name !== "MOUSE RIGHT") {
    if (down && e.state === "DOWN") {
      console.log("Key pressed:", e.name);
      playSound(soundName, "press");
    } else {
      console.log("Key released:", e.name);
      playSound(soundName, "release");
    }
  }
});

function initUI() {
  const soundSetSelect = document.getElementById("soundSetSelect");
  const volumeSlider = document.getElementById("volumeSlider");
  const quitButton = document.getElementById("quitButton");

  // Populate sound set options
  keySounds.forEach((set) => {
    const option = document.createElement("option");
    option.value = set.key;
    option.textContent = set.caption;
    soundSetSelect.appendChild(option);
  });

  // Set initial values
  soundSetSelect.value = currentSoundSet;
  volumeSlider.value = volumeLevel;

  // Event listeners
  soundSetSelect.addEventListener("change", (e) => {
    currentSoundSet = e.target.value;
    loadSoundSet(currentSoundSet);
  });

  volumeSlider.addEventListener("input", (e) => {
    updateVolume(parseInt(e.target.value));
  });

  quitButton.addEventListener("click", () => {
    ipcRenderer.send("quit-app");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initAudio();
  initUI();
});

console.log("Key listener set up");
