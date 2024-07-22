const {
  app,
  BrowserWindow,
  Tray,
  Menu,
  ipcMain,
  systemPreferences,
  nativeImage,
} = require("electron");
const path = require("path");
const fs = require("fs");
const { keySounds } = require("./audioFiles/audioModules/audioModule");

let tray = null;
let win = null;
let currentSoundSet = "alpaca"; // Default sound set, adjust as needed
let currentVolume = 10;

function createWindow() {
  win = new BrowserWindow({
    width: 700,
    height: 600,
    show: true, // Changed to true
    icon: path.join(__dirname, "build", "Frame3.icns"),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  win.loadFile("index.html");
  // win.webContents.openDevTools(); // Open DevTools for debugging
}

function createMenu() {
  const menuTemplate = [
    { type: "separator" },
    {
      label: win.isVisible() ? "Hide Window" : "Show Window",
      click: toggleWindow,
    },
    { type: "separator" },
    {
      label: app.dock.isVisible() ? "Hide from Dock" : "Show in Dock",
      click: () => {
        toggleDockVisibility(!app.dock.isVisible());
        updateTrayMenu();
      },
    },
    { type: "separator" },
    {
      label: "Sound Sets",
      submenu: keySounds.map((set) => ({
        label: set.caption,
        type: "radio",
        checked: set.key === currentSoundSet,
        click: () => {
          currentSoundSet = set.key;
          win.webContents.send("change-sound-set", set.key);
          tray.setContextMenu(createMenu());
        },
      })),
    },
    { type: "separator" },
    {
      label: "Volume Control",
      submenu: [
        {
          label: `Volume: ${currentVolume}`,
          enabled: false,
          id: "volume-label",
        },
        {
          label: "Increase Volume",
          click: (menuItem, browserWindow, event) => {
            event.preventDefault(); // Prevent menu from closing
            if (currentVolume < 20) {
              currentVolume++;
              updateVolumeLabel(menuItem.menu);
              win.webContents.send("change-volume", currentVolume);
            }
          },
        },
        {
          label: "Decrease Volume",
          click: (menuItem, browserWindow, event) => {
            event.preventDefault(); // Prevent menu from closing
            if (currentVolume > 10) {
              currentVolume--;
              updateVolumeLabel(menuItem.menu);
              win.webContents.send("change-volume", currentVolume);
            }
          },
        },
      ],
    },
    { type: "separator" },
    { label: "Quit", click: () => app.quit() },
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  // Menu.setApplicationMenu(menu);
  return menu;
}

function createTray() {
  const trayImage = nativeImage.createFromPath(
    path.join(__dirname, "assets", "images", "keyBeats@2x.png")
  );
  tray = new Tray(trayImage.resize({ width: 16, height: 16 }));
  tray.setToolTip("KeyBeats");
  const menu = createMenu();
  tray.setContextMenu(menu);
}

function updateTrayMenu() {
  tray.setContextMenu(createMenu());
}

function toggleWindow() {
  if (win.isVisible()) {
    win.hide();
  } else {
    win.show();
  }
  updateTrayMenu();
}
function selectSound(soundFile) {
  win.webContents.send("change-sound", soundFile);
}

// Add this function
function toggleDockVisibility(show) {
  if (process.platform === "darwin") {
    if (show) {
      app.dock.show();
    } else {
      app.dock.hide();
    }
  }
}

// Listen for sound set changes from renderer
ipcMain.on("sound-set-changed", (event, newSoundSet) => {
  currentSoundSet = newSoundSet;
  tray.setContextMenu(createMenu());
});

app.whenReady().then(() => {
  createWindow();
  createTray();

  toggleDockVisibility(false); // Hide from dock by default
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
