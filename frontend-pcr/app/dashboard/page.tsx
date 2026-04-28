"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Home,
  Settings,
  Upload,
  Download,
  Zap,
  Droplet,
  Flame,
  TrendingDown,
  Trophy,
  AlertCircle,
  CheckCircle2,
  Leaf,
  Pencil,
  X,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import EpmUploadModal from "../../components/EpmUploadModal";
import type { DashboardRecord } from "../../lib/epmPdfParser.ts";

type ConsumptionRecord = DashboardRecord;

const STORAGE_KEY = "eco-dashboard-records";

const monthOptions = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const CURRENT_DATE = new Date();
const CURRENT_YEAR = CURRENT_DATE.getFullYear();
const CURRENT_MONTH_INDEX = CURRENT_DATE.getMonth();

const yearOptions = Array.from(
  { length: CURRENT_YEAR - 2024 + 1 },
  (_, i) => String(2024 + i)
);

export default function DashboardPage() {
  const [records, setRecords] = useState<ConsumptionRecord[]>([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [energy, setEnergy] = useState("");
  const [water, setWater] = useState("");
  const [gas, setGas] = useState("");
  const [cost, setCost] = useState("");
  const [editingRecordMonth, setEditingRecordMonth] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const availableMonths =
    selectedYear === String(CURRENT_YEAR)
      ? monthOptions.slice(0, CURRENT_MONTH_INDEX + 1)
      : monthOptions;

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setRecords(JSON.parse(saved));
      } catch {
        setRecords([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }, [records]);

  const sortedRecords = [...records].sort((a, b) =>
    normalizePeriod(a.month) > normalizePeriod(b.month) ? 1 : -1
  );

  const latestRecord =
    sortedRecords.length > 0 ? sortedRecords[sortedRecords.length - 1] : null;
  const previousRecord =
    sortedRecords.length > 1 ? sortedRecords[sortedRecords.length - 2] : null;

  const energyData = sortedRecords.map((r) => ({
    name: shortMonth(r.month),
    value: r.energy,
  }));

  const waterData = sortedRecords.map((r) => ({
    name: shortMonth(r.month),
    value: r.water,
  }));

  const gasData = sortedRecords.map((r) => ({
    name: shortMonth(r.month),
    value: r.gas,
  }));

  const totalCost = sortedRecords.reduce((sum, r) => sum + r.cost, 0);

  const efficiencyPercent = useMemo(() => {
    if (!latestRecord) return 0;

    let score = 0;
    if (latestRecord.energy <= 200) score += 25;
    if (latestRecord.water <= 15) score += 25;
    if (latestRecord.gas <= 20) score += 25;
    if (latestRecord.cost <= 150000) score += 25;

    return score;
  }, [latestRecord]);

  const efficiencyData = [
    { name: "Eficiente", value: efficiencyPercent, color: "#10b981" },
    { name: "Por mejorar", value: 100 - efficiencyPercent, color: "#e2e8f0" },
  ];

  function resetForm() {
    setSelectedMonth("");
    setSelectedYear("");
    setEnergy("");
    setWater("");
    setGas("");
    setCost("");
    setEditingRecordMonth(null);
  }

  function handleSave() {
    if (!selectedMonth || !selectedYear || !energy || !water || !gas || !cost) {
      alert("Completa todos los campos.");
      return;
    }

    if (!availableMonths.includes(selectedMonth)) {
      alert("El mes seleccionado no es válido para el año elegido.");
      return;
    }

    const period = `${selectedMonth} ${selectedYear}`;

    const newRecord: ConsumptionRecord = {
      month: period,
      energy: Number(energy),
      water: Number(water),
      gas: Number(gas),
      cost: Number(cost),
    };

    if (editingRecordMonth) {
      const duplicatedPeriod =
        period !== editingRecordMonth &&
        records.some((r) => r.month === period);

      if (duplicatedPeriod) {
        alert("Ya existe otro registro para ese mes y año.");
        return;
      }

      setRecords((prev) =>
        prev.map((r) => (r.month === editingRecordMonth ? newRecord : r))
      );
      resetForm();
      return;
    }

    const exists = records.some((r) => r.month === period);
    if (exists) {
      alert("Ya existe un registro para ese mes y año.");
      return;
    }

    setRecords((prev) => [...prev, newRecord]);
    resetForm();
  }

  function handleEdit(record: ConsumptionRecord) {
    const [monthName, year] = record.month.split(" ");
    setSelectedMonth(monthName);
    setSelectedYear(year);
    setEnergy(String(record.energy));
    setWater(String(record.water));
    setGas(String(record.gas));
    setCost(String(record.cost));
    setEditingRecordMonth(record.month);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleClearAll() {
    const ok = confirm("¿Seguro que quieres borrar todos los datos?");
    if (!ok) return;
    setRecords([]);
    localStorage.removeItem(STORAGE_KEY);
    resetForm();
  }

  function handleConfirmImport(importedRecords: ConsumptionRecord[]) {
    setRecords((prev) => {
      const existing = new Map(prev.map((r) => [r.month, r]));
      for (const record of importedRecords) {
        if (!existing.has(record.month)) {
          existing.set(record.month, record);
        }
      }
      return Array.from(existing.values());
    });
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
              <Leaf className="h-5 w-5" />
            </div>
            <span className="font-bold text-2xl text-slate-800 tracking-tight">
              EcoTrack
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-slate-500 hover:text-slate-900 font-medium transition-colors flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Inicio
            </Link>

            <Link
              href="/dashboard"
              className="text-emerald-600 font-medium flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Dashboard de Indicadores
            </Link>

            <Link
              href="/dashboard/ranking"
              className="text-slate-500 hover:text-slate-900 font-medium transition-colors flex items-center gap-2"
            >
              <Trophy className="h-4 w-4" />
              Ranking Ecológico
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <button className="text-slate-500 hover:text-slate-900">
              <Settings className="h-5 w-5" />
            </button>

            <div className="h-8 w-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-medium shadow-sm">
              U
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-5xl font-bold text-slate-900 tracking-tight">
              Panel de Consumo Responsable
            </h1>
            <p className="text-slate-500 mt-3 max-w-2xl text-lg">
              Monitorea tu consumo de energía, agua, gas y costos mensuales para
              tomar decisiones más sostenibles.
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">
            <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-slate-700 hover:bg-slate-50 shadow-sm">
              <Download className="h-4 w-4" />
              Exportar PDF
            </button>

            <button
              onClick={handleClearAll}
              className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-3 text-red-600 hover:bg-red-50 shadow-sm"
            >
              Borrar datos
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            title="Energía (Este mes)"
            value={latestRecord ? String(latestRecord.energy) : "--"}
            unit="kWh"
            trend={getTrendText(latestRecord?.energy, previousRecord?.energy)}
            icon={<Zap className="h-4 w-4" />}
            iconBg="bg-amber-100"
            iconColor="text-amber-600"
          />

          <MetricCard
            title="Agua (Este mes)"
            value={latestRecord ? String(latestRecord.water) : "--"}
            unit="m³"
            trend={getTrendText(latestRecord?.water, previousRecord?.water)}
            icon={<Droplet className="h-4 w-4" />}
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
          />

          <MetricCard
            title="Gas (Este mes)"
            value={latestRecord ? String(latestRecord.gas) : "--"}
            unit="m³"
            trend={getTrendText(latestRecord?.gas, previousRecord?.gas)}
            icon={<Flame className="h-4 w-4" />}
            iconBg="bg-orange-100"
            iconColor="text-orange-600"
          />

          <DarkCostCard totalCost={totalCost} hasData={records.length > 0} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="flex flex-col gap-6">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="bg-emerald-50 border-b border-emerald-100 px-6 py-4 flex items-center gap-3">
                <div className="bg-white p-1.5 rounded-md shadow-sm text-emerald-600">
                  <Upload className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-emerald-900">
                    Carga Automática
                  </h3>
                  <p className="text-xs text-emerald-700">
                    Extrae datos de tu factura EPM
                  </p>
                </div>
              </div>

              <div className="p-6">
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer group">
                  <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-4 group-hover:bg-emerald-100 transition">
                    <Upload className="h-6 w-6 text-slate-400 group-hover:text-emerald-600" />
                  </div>

                  <h4 className="font-medium text-slate-900 mb-1">
                    Subir factura en PDF
                  </h4>
                  <p className="text-sm text-slate-500 mb-4 max-w-[220px]">
                    Sube tu factura para extraer automáticamente los datos
                  </p>

                  <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-sm rounded-lg py-3"
                  >
                    Seleccionar Archivo
                  </button>
                </div>

                <div className="mt-4 flex items-start gap-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  <p>
                    Formato sugerido: factura de servicios EPM en PDF. Si no es
                    una factura EPM válida, se mostrará una guía para descargarla.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="px-6 pt-6 pb-4 border-b border-slate-100">
                <h3 className="text-lg font-semibold text-slate-800">
                  {editingRecordMonth ? "Editar Registro" : "Ingreso Manual"}
                </h3>
                <p className="text-sm text-slate-500">
                  {editingRecordMonth
                    ? `Editando: ${editingRecordMonth}`
                    : "Registra la información de tu factura"}
                </p>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-2">
                      Año
                    </label>
                    <select
                      value={selectedYear}
                      onChange={(e) => {
                        const newYear = e.target.value;
                        setSelectedYear(newYear);
                        setSelectedMonth("");
                      }}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700"
                    >
                      <option value="">Selecciona un año</option>
                      {yearOptions.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-2">
                      Mes
                    </label>
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      disabled={!selectedYear}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700 disabled:bg-slate-100 disabled:text-slate-400"
                    >
                      <option value="">
                        {selectedYear
                          ? "Selecciona un mes"
                          : "Primero selecciona un año"}
                      </option>
                      {availableMonths.map((month) => (
                        <option key={month} value={month}>
                          {month}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    label="Energía (kWh)"
                    placeholder="Ej: 185"
                    value={energy}
                    onChange={setEnergy}
                  />
                  <FormInput
                    label="Agua (m³)"
                    placeholder="Ej: 14"
                    value={water}
                    onChange={setWater}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    label="Gas (m³)"
                    placeholder="Ej: 20"
                    value={gas}
                    onChange={setGas}
                  />
                  <FormInput
                    label="Costo Total ($)"
                    placeholder="Ej: 145200"
                    value={cost}
                    onChange={setCost}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium shadow-sm rounded-lg py-3"
                  >
                    {editingRecordMonth ? "Actualizar Datos" : "Guardar Datos"}
                  </button>

                  {editingRecordMonth && (
                    <button
                      onClick={resetForm}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-700 hover:bg-slate-50"
                    >
                      <X className="h-4 w-4" />
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="px-6 pt-6 pb-0">
                <h3 className="text-lg font-semibold text-slate-800">
                  Análisis de Consumo
                </h3>
                <p className="text-sm text-slate-500">
                  Evolución de los meses registrados
                </p>
              </div>

              <div className="pt-8 pb-4 px-6">
                <div className="h-[280px] w-full">
                  {energyData.length === 0 ? (
                    <EmptyChart text="Aún no hay datos registrados." />
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={energyData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="#e2e8f0"
                        />
                        <XAxis
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#64748b", fontSize: 12 }}
                          dy={10}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#64748b", fontSize: 12 }}
                          dx={-10}
                        />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#f59e0b"
                          strokeWidth={3}
                          dot={{
                            r: 6,
                            fill: "#fff",
                            stroke: "#f59e0b",
                            strokeWidth: 2,
                          }}
                          activeDot={{
                            r: 8,
                            fill: "#f59e0b",
                            stroke: "#fff",
                            strokeWidth: 2,
                          }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="px-6 pt-6 pb-2">
                  <h3 className="text-base font-semibold text-slate-800">
                    Consumo de Agua
                  </h3>
                </div>

                <div className="px-6 pb-6">
                  <div className="h-[200px] w-full mt-4">
                    {waterData.length === 0 ? (
                      <EmptyChart text="Sin datos de agua todavía." />
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={waterData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#e2e8f0"
                          />
                          <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#64748b", fontSize: 12 }}
                            dy={10}
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#64748b", fontSize: 12 }}
                          />
                          <Tooltip />
                          <Bar
                            dataKey="value"
                            fill="#3b82f6"
                            radius={[4, 4, 0, 0]}
                            name="m³"
                            barSize={36}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="px-6 pt-6 pb-0">
                  <h3 className="text-base font-semibold text-slate-800">
                    Índice de Eficiencia
                  </h3>
                </div>

                <div className="flex flex-col items-center justify-center pt-2 px-6 pb-6">
                  <div className="h-[160px] w-full relative flex items-center justify-center">
                    {records.length === 0 ? (
                      <div className="text-slate-400 text-sm">
                        Sin datos para calcular.
                      </div>
                    ) : (
                      <>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={efficiencyData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              startAngle={90}
                              endAngle={-270}
                              dataKey="value"
                              stroke="none"
                            >
                              {efficiencyData.map((entry, index) => (
                                <Cell key={index} fill={entry.color} />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>

                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-3xl font-bold text-slate-800">
                            {efficiencyPercent}%
                          </span>
                          <span className="text-xs font-medium text-emerald-600 uppercase tracking-wider">
                            Eficiencia
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="mt-2 w-full bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-start gap-3">
                    <div className="bg-emerald-100 p-1.5 rounded-full text-emerald-600 shrink-0 mt-0.5">
                      <Leaf className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {records.length === 0 ? "Empieza a registrar" : "Buen trabajo"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {records.length === 0
                          ? "Cuando guardes tus primeros datos aquí aparecerá tu análisis."
                          : "Tu porcentaje se calcula con base en tu último registro."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {records.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  Historial registrado
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-slate-500 border-b">
                        <th className="py-3">Mes</th>
                        <th className="py-3">Energía</th>
                        <th className="py-3">Agua</th>
                        <th className="py-3">Gas</th>
                        <th className="py-3">Costo</th>
                        <th className="py-3">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedRecords.map((r) => (
                        <tr key={r.month} className="border-b last:border-b-0">
                          <td className="py-3">{r.month}</td>
                          <td className="py-3">{r.energy} kWh</td>
                          <td className="py-3">{r.water} m³</td>
                          <td className="py-3">{r.gas} m³</td>
                          <td className="py-3">
                            ${r.cost.toLocaleString("es-CO")}
                          </td>
                          <td className="py-3">
                            <button
                              onClick={() => handleEdit(r)}
                              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-700 hover:bg-slate-50"
                            >
                              <Pencil className="h-4 w-4" />
                              Editar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        <EpmUploadModal
          open={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          existingRecords={records}
          onConfirmImport={handleConfirmImport}
        />
      </main>
    </div>
  );
}

function MetricCard({
  title,
  value,
  unit,
  trend,
  icon,
  iconBg,
  iconColor,
}: {
  title: string;
  value: string;
  unit: string;
  trend: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}) {
  const isEmpty = value === "--";

  return (
    <div className="relative rounded-2xl border border-slate-200 shadow-sm overflow-hidden bg-white p-6">
      <div className="absolute top-0 right-0 p-4 opacity-10">{icon}</div>

      <div className="relative z-10">
        <div className="text-sm font-medium text-slate-500 flex items-center gap-2">
          <div className={`p-1.5 rounded-md ${iconBg} ${iconColor}`}>
            {icon}
          </div>
          {title}
        </div>

        <div className="flex items-baseline gap-2 mt-4">
          <span className="text-3xl font-bold text-slate-900">{value}</span>
          {!isEmpty && (
            <span className="text-sm text-slate-500 font-medium">{unit}</span>
          )}
        </div>

        <div className="mt-3 text-sm">
          {isEmpty ? (
            <span className="text-slate-400">Sin datos todavía</span>
          ) : (
            <div className="flex items-center gap-1 font-medium text-emerald-600 bg-emerald-50 w-fit px-2 py-0.5 rounded-full">
              <TrendingDown className="h-3.5 w-3.5" />
              <span>{trend}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DarkCostCard({
  totalCost,
  hasData,
}: {
  totalCost: number;
  hasData: boolean;
}) {
  return (
    <div className="relative rounded-2xl border border-slate-200 shadow-sm bg-slate-900 text-white overflow-hidden p-6">
      <div className="absolute -right-4 -bottom-4 opacity-10">
        <BarChart3 className="h-32 w-32" />
      </div>

      <div className="relative z-10">
        <div className="text-sm font-medium text-slate-300 flex items-center justify-between">
          <span>Costo Total Acumulado</span>
          {hasData && (
            <span className="bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-full text-xs font-medium">
              Activo
            </span>
          )}
        </div>

        <div className="flex items-baseline gap-1 mt-4">
          {hasData ? (
            <>
              <span className="text-xl font-medium text-slate-300">$</span>
              <span className="text-3xl font-bold">
                {totalCost.toLocaleString("es-CO")}
              </span>
            </>
          ) : (
            <span className="text-3xl font-bold">--</span>
          )}
        </div>

        <div className="mt-3 flex items-center gap-2 text-sm text-slate-300">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>
            {hasData ? "Tus datos se están acumulando." : "Sin registros aún."}
          </span>
        </div>
      </div>
    </div>
  );
}

function FormInput({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-700 block mb-2">
        {label}
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500"
      />
    </div>
  );
}

function EmptyChart({ text }: { text: string }) {
  return (
    <div className="h-full w-full flex items-center justify-center text-slate-400 text-sm">
      {text}
    </div>
  );
}

function shortMonth(month: string) {
  return month.split(" ")[0].slice(0, 3);
}

function normalizePeriod(period: string) {
  const monthOptions = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const [monthName, year] = period.split(" ");
  const monthIndex = monthOptions.indexOf(monthName);
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
}

function getTrendText(current?: number, previous?: number) {
  if (current === undefined) return "";
  if (previous === undefined || previous === 0) return "Primer registro";

  const diff = ((current - previous) / previous) * 100;
  const abs = Math.abs(diff).toFixed(1);

  if (diff < 0) return `${abs}% menos que el mes anterior`;
  if (diff > 0) return `${abs}% más que el mes anterior`;
  return "Igual al mes anterior";
}