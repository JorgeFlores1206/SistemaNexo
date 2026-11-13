const { app, BrowserWindow, dialog } = require("electron");
const { spawn } = require("node:child_process");
const { existsSync } = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "../..");
let backend;

function startBackend() {
  const entry = path.join(root, "apps", "backend", "dist", "main.js");
  if (!existsSync(entry)) {
    throw new Error("La API no está compilada. Ejecuta npm run build antes de abrir Nexo.");
  }

  // process.execPath is Electron when this file runs inside the desktop app;
  // use the regular Node executable for the NestJS child process.
  backend = spawn(process.platform === "win32" ? "node.exe" : "node", [entry], {
    cwd: root,
    env: { ...process.env, NEXO_DESKTOP: "1" },
    windowsHide: true,
    stdio: "ignore",
  });
}

async function createWindow() {
  const window = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1100,
    minHeight: 700,
    backgroundColor: "#f5f7fb",
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  await new Promise((resolve) => setTimeout(resolve, 1200));
  await window.loadFile(path.join(root, "apps", "frontend", "dist", "index.html"));
}

app.whenReady().then(async () => {
  try {
    startBackend();
    await createWindow();
  } catch (error) {
    dialog.showErrorBox("Nexo no pudo iniciar", error.message);
    app.quit();
  }
});

app.on("window-all-closed", () => {
  if (backend) backend.kill();
  if (process.platform !== "darwin") app.quit();
});

app.on("before-quit", () => {
  if (backend) backend.kill();
});
