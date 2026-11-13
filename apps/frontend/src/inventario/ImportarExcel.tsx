import { useState } from "react";
import type { ImportIssue, ImportPreview, ImportResult } from "@nexo/contracts";
import { importarExcel, previsualizarImportacion } from "./api";

function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("No se pudo leer el archivo."));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}

function IssueTable({ issues, warnings = false }: { issues: ImportIssue[]; warnings?: boolean }) {
  return (
    <div className="table-scroll">
      <table className="data-table compact">
        <thead><tr><th>Fila</th><th>Campo</th><th>Motivo</th></tr></thead>
        <tbody>
          {issues.map((issue, index) => (
            <tr
              className={warnings ? issue.campo === "Artículo" ? "import-duplicate-row" : "import-warning-row" : undefined}
              key={`${issue.fila}-${issue.campo}-${index}`}
            >
              <td>{issue.fila}</td><td>{issue.campo ?? "—"}</td><td>{issue.motivo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ImportarExcel() {
  const [archivo, setArchivo] = useState<string | null>(null);
  const [nombre, setNombre] = useState("");
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [hoja, setHoja] = useState("");
  const [resultado, setResultado] = useState<ImportResult | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function selectFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError(null);
    setResultado(null);
    if (!file.name.toLowerCase().endsWith(".xlsx")) {
      setError("Selecciona un libro Excel con extensión .xlsx.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("El archivo supera el límite de 10 MB.");
      return;
    }
    try {
      const encoded = await readFile(file);
      const inspected = await previsualizarImportacion(encoded);
      setArchivo(encoded);
      setNombre(file.name);
      setPreview(inspected);
      setHoja(inspected.hojaSeleccionada);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No se pudo inspeccionar el archivo.");
    }
  }

  async function changeSheet(value: string) {
    if (!archivo) return;
    setHoja(value);
    setError(null);
    try {
      setPreview(await previsualizarImportacion(archivo, value));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No se pudo leer la hoja.");
    }
  }

  async function submit() {
    if (!archivo || !hoja) return;
    setCargando(true);
    setError(null);
    try {
      setResultado(await importarExcel(nombre, archivo, hoja));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No se pudo completar la importación.");
    } finally {
      setCargando(false);
    }
  }

  const instruccionesAdvertencias = [
    resultado?.advertencias.some((issue) => issue.campo === "Artículo") && "Se seleccionó la última fila de cada código repetido; las filas del grupo están resaltadas.",
    resultado?.advertencias.some((issue) => issue.campo === "On hand") && "On hand inválido se trató como vacío: se conservó el valor existente o se dejó sin dato en artículos nuevos.",
  ].filter(Boolean).join(" ");

  return (
    <section className="page-section narrow-section">
      <div className="split-layout">
        <article className="form-card card">
          <div className="card-heading">
            <div>
              <p className="eyebrow">CARGA CONTROLADA</p>
              <h2>Selecciona un libro Excel</h2>
              <p>Se aceptan archivos .xlsx de hasta 10 MB y 10.000 filas de datos.</p>
            </div>
          </div>
          <div className="upload-drop">
            <span className="upload-icon">⇧</span>
            <strong>{nombre || "Elige un archivo para comenzar"}</strong>
            <p>Las diez columnas oficiales deben estar en la primera fila. Estado y Acción se ignoran.</p>
            <label className="button secondary" htmlFor="excel-file">
              Seleccionar archivo
              <input
                id="excel-file"
                type="file"
                accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                onChange={(event) => void selectFile(event)}
                hidden
              />
            </label>
          </div>
          {preview && (
            <div className="preview-box">
              <div className="inline-heading">
                <div>
                  <h3>Vista previa de estructura</h3>
                  <p>{preview.filasEstimadas.toLocaleString("es-BO")} filas estimadas · {preview.hojas.length} hoja(s)</p>
                </div>
                <label>
                  Hoja
                  <select value={hoja} onChange={(event) => void changeSheet(event.target.value)}>
                    {preview.hojas.map((sheet) => <option key={sheet}>{sheet}</option>)}
                  </select>
                </label>
              </div>
              <div className="chip-list">
                {preview.encabezados.map((header) => <span className="chip" key={header}>{header}</span>)}
              </div>
              <button className="button primary" type="button" onClick={() => void submit()} disabled={cargando}>
                {cargando ? "Procesando filas..." : "Importar datos"}
              </button>
            </div>
          )}
          {error && <p className="form-error" role="alert">{error}</p>}
        </article>
        <aside className="card help-card">
          <p className="eyebrow">REGLAS DE IMPORTACIÓN</p>
          <h2>Antes de cargar</h2>
          <ul className="check-list">
            <li><span>✓</span><div><strong>Artículo es obligatorio</strong><p>El código se conserva tal como se escribe, quitando espacios externos.</p></div></li>
            <li><span>✓</span><div><strong>Los campos vacíos son válidos</strong><p>Al actualizar un código existente, una celda vacía borra ese valor.</p></div></li>
            <li><span>✓</span><div><strong>Errores por fila</strong><p>Las filas válidas se guardan y cada rechazo muestra su fila y motivo.</p></div></li>
            <li><span>✓</span><div><strong>La fecha va aparte</strong><p>La fecha de vencimiento no se lee desde Excel; se registra en el artículo.</p></div></li>
          </ul>
        </aside>
      </div>
      {resultado && (
        <article className="card result-card">
          <div className="inline-heading">
            <div>
              <p className="eyebrow">RESULTADO</p>
              <h2>{resultado.incompletas || resultado.rechazadas ? "Importación parcial" : "Importación procesada"}</h2>
              <p>{resultado.archivo} · hoja {resultado.hoja}</p>
            </div>
            <span className={`result-mark ${resultado.rechazadas ? "warning" : "success"}`}>{resultado.rechazadas ? "!" : "✓"}</span>
          </div>
          <div className="result-stats">
            <div><strong>{resultado.filasLeidas}</strong><span>filas leídas</span></div>
            <div><strong className="text-success">{resultado.importadas}</strong><span>importadas</span></div>
            <div><strong className={resultado.rechazadas ? "text-danger" : ""}>{resultado.rechazadas}</strong><span>rechazadas</span></div>
            <div><strong>{resultado.vacias}</strong><span>vacías</span></div>
          </div>
          {resultado.advertencias.length > 0 && (
            <div className="import-warnings">
              <h3>Filas marcadas</h3>
              <p>{instruccionesAdvertencias}</p>
              <IssueTable issues={resultado.advertencias} warnings />
            </div>
          )}
          {resultado.errores.length > 0 && <IssueTable issues={resultado.errores} />}
        </article>
      )}
    </section>
  );
}
