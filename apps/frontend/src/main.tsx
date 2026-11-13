import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

const root = document.getElementById("root");
if (root) createRoot(root).render(<StrictMode><App /></StrictMode>);

export function frontendEntry() {
  return "Nexo frontend consumes the NestJS API";
}

export { ReporteMensualVencimientos, ResultadoGeneracion, Reportes, obtenerReporte } from "./reportes-programados";
export { Dashboard } from "./dashboard";
export { default as App } from "./App";
