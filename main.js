const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let win;
let isResizing = false;

function createWindow() {
  win = new BrowserWindow({
    width: 600,
    height: 330,
    resizable: true, // Keep this true
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
    frame: false,
    alwaysOnTop: false,
    transparent: true,
  });

  // Custom function to handle resizing
  const handleResize = (width, height) => {
    isResizing = true;
    win.setSize(width, height);
    setTimeout(() => {
      isResizing = false;
    }, 100); // Small delay to ensure resize is complete
  };

  // Listen for resize attempts
  win.on("will-resize", (event, newBounds) => {
    if (!isResizing) {
      // Prevent manual resizing
      event.preventDefault();
    }
  });

  if (process.env.NODE_ENV === "development") {
    console.log("Loading development URL...");
    win.loadURL("http://localhost:3000");
    win.webContents.openDevTools();
  } else {
    console.log("Loading production file...");
    const filePath = path.join(__dirname, "dist", "index.html");
    console.log(`Loading file: ${filePath}`);
    win
      .loadFile(filePath)
      .then(() => {
        console.log("File loaded successfully.");
      })
      .catch((error) => {
        console.error("Error loading file:", error);
      });
  }

  win.on("closed", () => {
    win = null;
    console.log("Window closed");
  });

  ipcMain.on("close-app", () => {
    if (win) {
      win.close();
      console.log("Close app signal received");
    }
  });

  ipcMain.on("resize-app", (event, { width, height }) => {
    if (win) {
      handleResize(width, height);
      console.log(`Resized app to: ${width}x${height}`);
    }
  });
}

app.whenReady().then(() => {
  console.log("App is ready.");
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
