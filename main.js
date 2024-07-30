const { app, BrowserWindow, ipcMain, nativeImage } = require("electron");
const { menubar } = require("menubar");
const path = require("path");
const { autoUpdater } = require("electron-updater");

const isDev = process.env.NODE_ENV === "development";

if (isDev) {
  try {
    require("electron-reloader")(module);
  } catch (_) {}
}

let mainWindow;
let mb;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 700,
    height: 600,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  mainWindow.loadFile("index.html");
}

let trayImage = nativeImage.createFromPath(
  path.join(__dirname, "assets", "images", "keyBeatsTemplate@2x.png")
);

function createMenubar() {
  mb = menubar({
    index: "file://" + path.join(__dirname, "menu.html"),
    icon: trayImage,
    preloadWindow: true,
    browserWindow: {
      width: 260,
      height: 192, // Increased height to accommodate update button
      resizable: false,
      useContentSize: true,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        additionalArguments: [
          `--app-path=${__dirname}`,
          `--app-version=${app.getVersion()}`,
        ],
      },
    },
  });

  mb.on("ready", () => {
    console.log("Menubar app is ready");
    checkForUpdates();
  });

  mb.on("after-create-window", () => {
    if (process.env.NODE_ENV === "development") {
      mb.window.openDevTools();
    }
  });
}

function checkForUpdates() {
  if (isDev) return;

  autoUpdater.autoDownload = false;
  autoUpdater.checkForUpdates();

  autoUpdater.on("update-available", () => {
    mb.window.webContents.send("update-available");
  });

  autoUpdater.on("download-progress", (progressObj) => {
    mb.window.webContents.send("download-progress", progressObj);
  });

  autoUpdater.on("update-downloaded", () => {
    mb.window.webContents.send("update-downloaded");
  });
}

app.whenReady().then(() => {
  createWindow();
  createMenubar();
});

ipcMain.on("quit-app", () => {
  app.quit();
});

ipcMain.on("start-download", () => {
  autoUpdater.downloadUpdate();
});

ipcMain.on("install-update", () => {
  autoUpdater.quitAndInstall();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
