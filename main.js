// const { app, BrowserWindow, ipcMain, Menu } = require("electron");
// const { menubar } = require("menubar");
// const path = require("path");
// const { keySounds } = require("./audioFiles/audioModules/audioModule");

// let mainWindow;
// let currentSoundSet = "alpaca";
// let currentVolume = 15;

// const mb = menubar({
//   index: "file://" + path.join(__dirname, "volume.html"),
//   icon: path.join(__dirname, "assets", "images", "keyBeats@2x.png"),
//   preloadWindow: true,
//   browserWindow: {
//     width: 300,
//     height: 400,
//     webPreferences: {
//       nodeIntegration: true,
//       contextIsolation: false,
//     },
//   },
// });

// mb.on("ready", () => {
//   console.log("Menubar app is ready");
//   createMenu();
// });

// function createMenu() {
//   const contextMenu = Menu.buildFromTemplate([
//     {
//       label: "Sound Sets",
//       submenu: keySounds.map((set) => ({
//         label: set.caption,
//         type: "radio",
//         checked: set.key === currentSoundSet,
//         click: () => {
//           currentSoundSet = set.key;
//           mainWindow.webContents.send("change-sound-set", set.key);
//         },
//       })),
//     },
//     { type: "separator" },
//     {
//       label: "Volume Control",
//       submenu: [
//         {
//           label: `Volume: ${currentVolume}`,
//           enabled: false,
//           id: "volume-label",
//         },
//         {
//           label: "Increase Volume",
//           click: (menuItem, browserWindow, event) => {
//             event.preventDefault();
//             if (currentVolume < 20) {
//               currentVolume++;
//               updateVolumeLabel(menuItem.menu);
//               mainWindow.webContents.send("change-volume", currentVolume);
//             }
//           },
//         },
//         {
//           label: "Decrease Volume",
//           click: (menuItem, browserWindow, event) => {
//             event.preventDefault();
//             if (currentVolume > 10) {
//               currentVolume--;
//               updateVolumeLabel(menuItem.menu);
//               mainWindow.webContents.send("change-volume", currentVolume);
//             }
//           },
//         },
//       ],
//     },
//     { type: "separator" },
//     { label: "Quit", click: () => app.quit() },
//   ]);

//   mb.tray.setContextMenu(contextMenu);
// }

// function updateVolumeLabel(menu) {
//   const volumeLabel = menu.getMenuItemById("volume-label");
//   if (volumeLabel) {
//     volumeLabel.label = `Volume: ${currentVolume}`;
//   }
//   createMenu(); // Refresh the entire menu
// }

// ipcMain.on("sound-set-changed", (event, newSoundSet) => {
//   currentSoundSet = newSoundSet;
//   createMenu();
// });

// mb.on("after-create-window", () => {
//   mainWindow = mb.window;

//   // if (process.env.NODE_ENV === "development") {
//   //   mainWindow.openDevTools();
//   // }
// });

// app.on("window-all-closed", () => {
//   if (process.platform !== "darwin") {
//     app.quit();
//   }
// });

const { app, BrowserWindow, ipcMain } = require("electron");
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

const mb = menubar({
  index: "file://" + path.join(__dirname, "test.html"),
  icon: path.join(__dirname, "assets", "images", "keyBeats@2x.png"),
  preloadWindow: true,
  browserWindow: {
    width: 260,
    height: 192,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  },
});

mb.on("ready", () => {
  console.log("Menubar app is ready");
});

mb.on("after-create-window", () => {
  mainWindow = mb.window;

  if (process.env.NODE_ENV === "development") {
    // mainWindow.openDevTools();
  }
});

ipcMain.on("quit-app", () => {
  app.quit();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
