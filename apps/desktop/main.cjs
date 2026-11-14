const { app, BrowserWindow, dialog } = require("electron");
const { existsSync, readFileSync } = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "../..");

// Nexo no trae credenciales embebidas: un archivo "nexo.env" junto al ejecutable
// (o en la raíz del proyecto en desarrollo) debe definir DATABASE_URL, DIRECT_URL
// y SESSION_SECRET antes de abrir la app. Ver nexo.env.example.
function loadExternalEnvFile() {
  // process.resourcesPath apunta a la carpeta "resources" del ejecutable empaquetado;
  // en desarrollo (electron .) no existe, así que se omite.
  const candidates = [
    process.resourcesPath ? path.join(path.dirname(process.resourcesPath), "nexo.env") : null,
    path.join(root, "nexo.env"),
  ].filter(Boolean);
  for (const file of candidates) {
    if (!existsSync(file)) continue;
    for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
      const match = /^\s*([\w.-]+)\s*=\s*(.*)\s*$/.exec(line);
      if (match) process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
    }
    return;
  }
  throw new Error("No se encontró nexo.env junto al ejecutable. Copia nexo.env.example, complétalo con tus credenciales y vuelve a intentarlo.");
}

function startBackend() {
  const entry = path.join(root, "apps", "backend", "dist", "main.js");
  if (!existsSync(entry)) {
    throw new Error("La API no está compilada. Ejecuta npm run build antes de abrir Nexo.");
  }
  // Se ejecuta en el mismo proceso de Electron (que trae su propio Node embebido),
  // por lo que no se necesita Node.js instalado en el equipo de destino.
  require(entry);
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
    loadExternalEnvFile();
    startBackend();
    await createWindow();
  } catch (error) {
    dialog.showErrorBox("Nexo no pudo iniciar", error instanceof Error ? error.message : String(error));
    app.quit();
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
