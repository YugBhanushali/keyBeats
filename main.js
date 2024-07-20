const {
  app,
  BrowserWindow,
  Tray,
  Menu,
  ipcMain,
  systemPreferences,
} = require("electron");
const path = require("path");
const fs = require("fs");
const { keySounds } = require("./audioFiles/audioModules/audioModule");

let tray = null;
let win = null;

function createWindow() {
  win = new BrowserWindow({
    width: 700,
    height: 600,
    show: true, // Changed to true
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile("index.html");
  win.webContents.openDevTools(); // Open DevTools for debugging
}

function createMenu() {
  const soundSets = getSoundSets();
  const menuTemplate = [
    {
      label: "Sound Sets",
      submenu: keySounds.map((set) => ({
        label: set.caption,
        click: () => win.webContents.send("change-sound-set", set.key),
      })),
    },
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  // Menu.setApplicationMenu(menu);
  return menu;
}

function getSoundSets() {
  const audioPath = path.join(__dirname, "assets", "audio");
  return fs
    .readdirSync(audioPath)
    .filter((file) => fs.statSync(path.join(audioPath, file)).isDirectory());
}

function createTray() {
  tray = new Tray(path.join(__dirname, "keySound@2x.png"));
  const contextMenu = Menu.buildFromTemplate([
    { label: "Show/Hide Window", click: toggleWindow },
    {
      label: "Sound 1",
      type: "radio",
      checked: true,
      click: () => selectSound("sound1.mp3"),
    },
    { label: "Sound 2", type: "radio", click: () => selectSound("sound2.mp3") },
    { label: "Sound 3", type: "radio", click: () => selectSound("sound3.mp3") },
    { type: "separator" },
    { label: "Quit", click: () => app.quit() },
  ]);
  tray.setToolTip("Key Sound App");
  const menu = createMenu();
  tray.setContextMenu(menu);
}

function toggleWindow() {
  if (win.isVisible()) {
    win.hide();
  } else {
    win.show();
  }
}

function selectSound(soundFile) {
  win.webContents.send("change-sound", soundFile);
}

app.whenReady().then(() => {
  createWindow();
  createTray();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
