"use client";

import { useMemo, useState } from "react";
import { AlertCircle, FileUp, Loader2, X } from "lucide-react";
import type { DashboardRecord, ParsedEpmResult } from "../lib/epmPdfParser";
import { parseEpmPdf, sortPeriods } from "../lib/epmPdfParser";

type Props = {
  open: boolean;
  onClose: () => void;
  existingRecords: DashboardRecord[];
  onConfirmImport: (records: DashboardRecord[]) => void;
};

export default function EpmUploadModal({
  open,
  onClose,
  existingRecords,
  onConfirmImport,
}: Props) {
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ParsedEpmResult | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const existingMonths = useMemo(
    () => new Set(existingRecords.map((r) => r.month)),
    [existingRecords]
  );

  const preview = useMemo(() => {
    if (!result?.isEpm) return null;

    const newRecords: DashboardRecord[] = [];
    const duplicates: DashboardRecord[] = [];

    for (const record of result.records) {
      if (existingMonths.has(record.month)) {
        duplicates.push(record);
      } else {
        newRecords.push(record);
      }
    }

    return {
      newRecords: sortPeriods(newRecords),
      duplicates: sortPeriods(duplicates),
    };
  }, [result, existingMonths]);

  async function handleFileChange(file: File | null) {
    if (!file) return;

    setFileName(file.name);
    setErrorMessage("");
    setResult(null);
    setLoading(true);

    try {
      const parsed = await parseEpmPdf(file);
      setResult(parsed);

      if (!parsed.isEpm) {
        setErrorMessage(parsed.message || "No fue posible validar el PDF.");
      }
    } catch (error) {
      setErrorMessage("Ocurrió un error leyendo el PDF.");
    } finally {
      setLoading(false);
    }
  }

  function handleConfirm() {
    if (!preview) return;
    onConfirmImport(preview.newRecords);
    handleClose();
  }

  function handleClose() {
    setFileName("");
    setLoading(false);
    setResult(null);
    setErrorMessage("");
    onClose();
  }

  if (!open) return null;

  const showInstructions = !!errorMessage;

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Importar factura EPM
            </h2>
            <p className="text-sm text-slate-500">
              Sube tu PDF, revisa los datos detectados y confirma antes de cargar.
            </p>
          </div>

          <button
            onClick={handleClose}
            className="rounded-lg p-2 hover:bg-slate-100"
          >
            <X className="h-5 w-5 text-slate-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="rounded-xl border-2 border-dashed border-slate-300 p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
              <FileUp className="h-6 w-6 text-emerald-600" />
            </div>

            <label className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-emerald-600 px-5 py-3 text-white font-medium hover:bg-emerald-700">
              Seleccionar PDF
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
              />
            </label>

            <p className="mt-3 text-sm text-slate-500">
              Solo se admite factura EPM en PDF.
            </p>

            {fileName && (
              <p className="mt-2 text-sm text-slate-700">
                Archivo: <span className="font-medium">{fileName}</span>
              </p>
            )}
          </div>

          {loading && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
              <span className="text-slate-700">Leyendo factura EPM...</span>
            </div>
          )}

          {showInstructions && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 space-y-3">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-amber-900">
                    El archivo no corresponde a una factura EPM válida
                  </h3>
                  <p className="text-sm text-amber-800 mt-1">{errorMessage}</p>
                </div>
              </div>

              <div className="text-sm text-slate-700 space-y-1">
                <p className="font-medium">Cómo descargar el recibo EPM:</p>
                <p>1. Ingresa a https://www.epm.com.co/</p>
                <p>2. Ve a “Paga tu factura”</p>
                <p>3. Regístrate o inicia sesión</p>
                <p>4. Entra a “Pagar servicios públicos”</p>
                <p>5. Selecciona la factura</p>
                <p>6. Da clic en descargar PDF</p>
                <p>
                  7. Si no aparece, puede que aún no haya llegado o que no tengas
                  inscrita la factura virtual
                </p>
              </div>
            </div>
          )}

          {preview && (
            <div className="space-y-6">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-600">
                  Período principal detectado:
                </p>
                <p className="text-lg font-semibold text-slate-900">
                  {result?.currentPeriod}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <h3 className="font-semibold text-emerald-900 mb-3">
                    Se importarán
                  </h3>

                  {preview.newRecords.length === 0 ? (
                    <p className="text-sm text-slate-600">
                      No hay meses nuevos por importar.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {preview.newRecords.map((record) => (
                        <PreviewCard key={record.month} record={record} />
                      ))}
                    </div>
                  )}
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <h3 className="font-semibold text-slate-900 mb-3">
                    Ya existentes
                  </h3>

                  {preview.duplicates.length === 0 ? (
                    <p className="text-sm text-slate-600">
                      No hay duplicados.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {preview.duplicates.map((record) => (
                        <PreviewCard key={record.month} record={record} muted />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                Los costos de los meses históricos extraídos desde la gráfica pueden
                quedar en 0 si el recibo no los trae explícitos. El mes actual sí se
                importa con su costo detectado en el resumen.
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={handleClose}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-700 hover:bg-slate-100"
          >
            Cancelar
          </button>

          <button
            onClick={handleConfirm}
            disabled={!preview || preview.newRecords.length === 0}
            className="rounded-lg bg-slate-900 px-4 py-2 text-white disabled:opacity-50"
          >
            Confirmar e importar
          </button>
        </div>
      </div>
    </div>
  );
}

function PreviewCard({
  record,
  muted = false,
}: {
  record: DashboardRecord;
  muted?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-3 ${
        muted
          ? "border-slate-200 bg-slate-50"
          : "border-emerald-200 bg-white"
      }`}
    >
      <p className="font-semibold text-slate-900">{record.month}</p>
      <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-slate-700">
        <p>Agua: {record.water} m³</p>
        <p>Energía: {record.energy} kWh</p>
        <p>Gas: {record.gas} m³</p>
        <p>Costo: ${record.cost.toLocaleString("es-CO")}</p>
      </div>
    </div>
  );
}