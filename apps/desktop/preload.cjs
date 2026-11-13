const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("nexoDesktop", {
  enabled: true,
});
