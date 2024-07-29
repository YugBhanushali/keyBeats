const { app, BrowserWindow, ipcMain, nativeImage } = require("electron");
const { menubar } = require("menubar");
const path = require("path");

const isDev = process.env.NODE_ENV === "development";

if (isDev) {
  try {
    require("electron-reloader")(module);
  } catch (_) {}
}

// ... rest of your main.js code

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 700,
    height: 600,
    show: false, // Changed to true
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  mainWindow.loadFile("index.html");
  // mainWindow.webContents.openDevTools(); // Open DevTools for debugging
}

let trayImage = nativeImage.createFromPath(
  path.join(__dirname, "assets", "images", "keyBeatsTemplate@2x.png")
);
const mb = menubar({
  index: "file://" + path.join(__dirname, "menu.html"),
  icon: trayImage,
  preloadWindow: true,
  browserWindow: {
    width: 260,
    height: 192,
    resizable: false,
    useContentSize: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      additionalArguments: [`--app-path=${__dirname}`],
    },
  },
});

mb.on("ready", () => {
  console.log("Menubar app is ready");
});

mb.on("after-create-window", () => {
  // mainWindow = mb.window;

  if (process.env.NODE_ENV === "development") {
    // mainWindow.openDevTools();
  }
});

app.whenReady().then(() => {
  createWindow();
});

ipcMain.on("quit-app", () => {
  app.quit();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
