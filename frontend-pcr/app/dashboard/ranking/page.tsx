"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Leaf, Home, BarChart3, Plus, Calendar, Target,
  Droplet, Zap, Flame, Recycle, Bike, CheckCircle2,
  Clock, Edit, Trash2, Award, PlayCircle, CheckSquare, X,
  Search, Eye, Users, Trophy, AlertTriangle, ClipboardCheck,
  TrendingDown, Gauge, Filter, RotateCcw, Check, UserPlus
} from "lucide-react";

type ChallengeType = "Reducción" | "Límite" | "Manual" | "Mixto";
type ChallengeStatus = "Programado" | "Activo" | "Finalizado";
type ChallengeCategory = "Agua" | "Energía" | "Gas" | "Reciclaje" | "Movilidad";

type Reto = {
  id: number;
  name: string;
  description: string;
  category: ChallengeCategory;
  type: ChallengeType;
  goal: string;
  unit: string;
  start: string;
  end: string;
  points: number;
  status: ChallengeStatus;
};

type JoinedChallenge = {
  retoId: number;
  manualDays: number;
  completed: boolean;
  awarded: boolean;
};

type FormState = Omit<Reto, "id" | "points"> & { points: string };

const today = new Date("2026-04-28T12:00:00");

const initialChallenges: Reto[] = [
  {
    id: 1,
    name: "Mes sin plásticos",
    description: "Evita usar plásticos de un solo uso durante el mes y registra tus avances semanales.",
    category: "Reciclaje",
    type: "Manual",
    goal: "5",
    unit: "Días",
    start: "2026-05-01",
    end: "2026-05-31",
    points: 500,
    status: "Programado",
  },
  {
    id: 2,
    name: "Ahorro extremo de agua",
    description: "Reduce tu consumo de agua frente al mes anterior usando duchas cortas y cerrando llaves.",
    category: "Agua",
    type: "Reducción",
    goal: "15",
    unit: "%",
    start: "2026-04-01",
    end: "2026-04-30",
    points: 300,
    status: "Activo",
  },
  {
    id: 3,
    name: "Límite de energía",
    description: "Mantén tu consumo mensual por debajo del límite establecido para ganar puntos ecológicos.",
    category: "Energía",
    type: "Límite",
    goal: "100",
    unit: "kWh",
    start: "2026-04-15",
    end: "2026-05-15",
    points: 250,
    status: "Activo",
  },
  {
    id: 4,
    name: "Semana en bici",
    description: "Usa bicicleta o camina en tus desplazamientos principales durante 5 días.",
    category: "Movilidad",
    type: "Manual",
    goal: "5",
    unit: "Días",
    start: "2026-04-22",
    end: "2026-05-02",
    points: 450,
    status: "Activo",
  },
  {
    id: 5,
    name: "Gas responsable",
    description: "No superes el límite mensual de gas y confirma tus hábitos responsables en cocina.",
    category: "Gas",
    type: "Mixto",
    goal: "20",
    unit: "m³",
    start: "2026-03-01",
    end: "2026-03-31",
    points: 200,
    status: "Finalizado",
  },
];

const userConsumption = {
  Agua: { previous: 28, current: 23, unit: "m³" },
  Energía: { previous: 120, current: 92, unit: "kWh" },
  Gas: { previous: 24, current: 18, unit: "m³" },
};

const rankingUsers = [
  { name: "Nicol", points: 1750, level: "Eco Líder" },
  { name: "Carlos", points: 1390, level: "Ahorrista" },
  { name: "Ana", points: 1180, level: "Recicladora" },
  { name: "Luis", points: 960, level: "Explorador" },
];

function Button({ children, className = "", ...props }: any) {
  return (
    <button className={`rounded-xl px-4 py-2 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed ${className}`} {...props}>
      {children}
    </button>
  );
}

function Badge({ children, className = "" }: any) {
  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${className}`}>{children}</span>;
}

function Card({ children, className = "" }: any) {
  return <div className={`rounded-2xl border bg-white ${className}`}>{children}</div>;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Agua": return <Droplet className="h-4 w-4 text-blue-500" />;
    case "Energía": return <Zap className="h-4 w-4 text-amber-500" />;
    case "Gas": return <Flame className="h-4 w-4 text-orange-500" />;
    case "Reciclaje": return <Recycle className="h-4 w-4 text-emerald-500" />;
    case "Movilidad": return <Bike className="h-4 w-4 text-purple-500" />;
    default: return <Leaf className="h-4 w-4 text-emerald-500" />;
  }
};

const getTypeIcon = (type: ChallengeType) => {
  switch (type) {
    case "Reducción": return <TrendingDown className="h-4 w-4" />;
    case "Límite": return <Gauge className="h-4 w-4" />;
    case "Manual": return <ClipboardCheck className="h-4 w-4" />;
    case "Mixto": return <CheckSquare className="h-4 w-4" />;
  }
};

const getStatusBadge = (status: ChallengeStatus) => {
  switch (status) {
    case "Programado": return <Badge className="bg-slate-100 text-slate-600 border border-slate-200">Programado</Badge>;
    case "Activo": return <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200">Activo</Badge>;
    case "Finalizado": return <Badge className="bg-blue-100 text-blue-700 border border-blue-200">Finalizado</Badge>;
  }
};

const formatDate = (date: string) => {
  if (!date) return "Sin fecha";
  return new Date(`${date}T00:00:00`).toLocaleDateString("es-ES", { month: "short", day: "numeric" });
};

const calculateStatus = (start: string, end: string): ChallengeStatus => {
  const startDate = new Date(`${start}T00:00:00`);
  const endDate = new Date(`${end}T23:59:59`);
  if (today < startDate) return "Programado";
  if (today > endDate) return "Finalizado";
  return "Activo";
};

const overlapsDates = (aStart: string, aEnd: string, bStart: string, bEnd: string) => {
  const startA = new Date(`${aStart}T00:00:00`).getTime();
  const endA = new Date(`${aEnd}T23:59:59`).getTime();
  const startB = new Date(`${bStart}T00:00:00`).getTime();
  const endB = new Date(`${bEnd}T23:59:59`).getTime();
  return startA <= endB && endA >= startB;
};

const getVerificationText = (reto: Reto) => {
  if (reto.type === "Reducción") return `Automático: compara el consumo actual con el anterior. Meta: reducir ${reto.goal}${reto.unit}.`;
  if (reto.type === "Límite") return `Automático: valida que el consumo no supere ${reto.goal} ${reto.unit}.`;
  if (reto.type === "Manual") return `Manual: el usuario marca ${reto.goal} ${reto.unit.toLowerCase()} completados.`;
  return `Mixto: valida consumo y además solicita confirmación manual del usuario.`;
};

const getAutoProgress = (reto: Reto) => {
  const data = userConsumption[reto.category as keyof typeof userConsumption];

  if (!data) return { progress: 35, detail: "Este reto se valida con acciones registradas por el usuario.", completed: false };

  if (reto.type === "Reducción" || reto.type === "Mixto") {
    const reduction = Math.max(0, ((data.previous - data.current) / data.previous) * 100);
    const goal = Number(reto.goal) || 1;
    return {
      progress: Math.min(100, Math.round((reduction / goal) * 100)),
      detail: `Has reducido ${reduction.toFixed(1)}% de una meta de ${goal}%.`,
      completed: reduction >= goal,
    };
  }

  if (reto.type === "Límite") {
    const limit = Number(reto.goal) || 1;
    const progress = data.current <= limit ? 100 : Math.max(0, Math.round((limit / data.current) * 100));
    return {
      progress,
      detail: `Consumo actual: ${data.current} ${data.unit}. Límite: ${limit} ${reto.unit}.`,
      completed: data.current <= limit,
    };
  }

  return { progress: 0, detail: "Registra tus días para completar el reto.", completed: false };
};

export default function RankingPage() {
  const [view, setView] = useState<"user" | "admin">("user");
  const [retos, setRetos] = useState<Reto[]>(initialChallenges);
  const [joinedChallenges, setJoinedChallenges] = useState<JoinedChallenge[]>([
    { retoId: 2, manualDays: 0, completed: false, awarded: false },
    { retoId: 4, manualDays: 2, completed: false, awarded: false },
  ]);
  const [message, setMessage] = useState("");
  const [points, setPoints] = useState(1250);

  const notify = (text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 3500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="mx-auto px-4 h-16 flex items-center justify-between max-w-6xl">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
              <Leaf className="h-5 w-5" />
            </div>
            <span className="font-bold text-xl text-slate-800">EcoHabits</span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-slate-500 hover:text-slate-900 font-medium flex items-center gap-2">
              <Home className="h-4 w-4" /> Inicio
            </Link>
            <Link href="/dashboard" className="text-slate-500 hover:text-slate-900 font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4" /> Dashboard
            </Link>
            <Link href="/dashboard/ranking" className="text-emerald-600 font-medium flex items-center gap-2">
              <Target className="h-4 w-4" /> Retos
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button onClick={() => setView("user")} className={`px-4 py-1.5 rounded-lg text-xs font-medium ${view === "user" ? "bg-white shadow-sm" : "text-slate-500"}`}>
                Usuario
              </button>
              <button onClick={() => setView("admin")} className={`px-4 py-1.5 rounded-lg text-xs font-medium ${view === "admin" ? "bg-white shadow-sm" : "text-slate-500"}`}>
                Admin
              </button>
            </div>
            <div className="h-8 w-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-medium">U</div>
          </div>
        </div>
      </header>

      <main className="flex-1 mx-auto px-4 py-8 max-w-6xl w-full">
        {message && (
          <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 shadow-sm">
            {message}
          </div>
        )}

        {view === "admin" ? (
          <AdminView retos={retos} setRetos={setRetos} notify={notify} />
        ) : (
          <UserView
            retos={retos}
            joinedChallenges={joinedChallenges}
            setJoinedChallenges={setJoinedChallenges}
            points={points}
            setPoints={setPoints}
            notify={notify}
          />
        )}
      </main>
    </div>
  );
}

function AdminView({ retos, setRetos, notify }: { retos: Reto[]; setRetos: any; notify: (text: string) => void }) {
  const emptyForm: FormState = {
    name: "",
    description: "",
    category: "Agua",
    type: "Reducción",
    goal: "",
    unit: "%",
    start: "",
    end: "",
    points: "",
    status: "Programado",
  };

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [categoryFilter, setCategoryFilter] = useState("Todas");
  const [selectedReto, setSelectedReto] = useState<Reto | null>(null);

  const stats = useMemo(() => ({
    active: retos.filter((r) => r.status === "Activo").length,
    scheduled: retos.filter((r) => r.status === "Programado").length,
    finished: retos.filter((r) => r.status === "Finalizado").length,
    points: retos.reduce((sum, r) => sum + r.points, 0),
  }), [retos]);

  const filteredRetos = useMemo(() => {
    return retos.filter((reto) => {
      const matchesSearch = `${reto.name} ${reto.description} ${reto.category} ${reto.type}`.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "Todos" || reto.status === statusFilter;
      const matchesCategory = categoryFilter === "Todas" || reto.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [retos, search, statusFilter, categoryFilter]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    const nextForm = { ...form, [name]: value };

    if (name === "start" || name === "end") {
      if (nextForm.start && nextForm.end) {
        nextForm.status = calculateStatus(nextForm.start, nextForm.end);
      }
    }

    if (name === "type") {
      if (value === "Manual") nextForm.unit = "Días";
      if (value === "Reducción") nextForm.unit = "%";
      if (value === "Límite") nextForm.unit = nextForm.category === "Energía" ? "kWh" : "m³";
    }

    setForm(nextForm);
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setOpen(false);
  };

  const saveChallenge = () => {
    if (!form.name.trim() || !form.description.trim() || !form.start || !form.end || !form.goal || !form.points) {
      notify("⚠ Completa nombre, descripción, meta, puntos y fechas.");
      return;
    }

    if (new Date(form.start) > new Date(form.end)) {
      notify("⚠ La fecha de inicio no puede ser mayor que la fecha final.");
      return;
    }

    if (Number(form.goal) <= 0 || Number(form.points) <= 0) {
      notify("⚠ La meta y los puntos deben ser mayores que cero.");
      return;
    }

    const duplicate = retos.some(
      (r) =>
        r.id !== editingId &&
        r.category === form.category &&
        r.type === form.type &&
        overlapsDates(form.start, form.end, r.start, r.end)
    );

    if (duplicate) {
      notify("⚠ Ya existe un reto de esa categoría y tipo que se cruza con esas fechas.");
      return;
    }

    const finalChallenge: Reto = {
      ...form,
      id: editingId ?? Date.now(),
      points: Number(form.points),
      status: calculateStatus(form.start, form.end),
    };

    if (editingId) {
      setRetos(retos.map((r) => (r.id === editingId ? finalChallenge : r)));
      notify("✅ Reto actualizado correctamente.");
    } else {
      setRetos([finalChallenge, ...retos]);
      notify("✅ Reto creado correctamente.");
    }

    resetForm();
  };

  const editChallenge = (reto: Reto) => {
    setForm({ ...reto, points: String(reto.points) });
    setEditingId(reto.id);
    setOpen(true);
  };

  const deleteChallenge = (id: number) => {
    const reto = retos.find((r) => r.id === id);
    const confirmDelete = window.confirm(`¿Eliminar el reto "${reto?.name}"?`);
    if (!confirmDelete) return;

    setRetos(retos.filter((r) => r.id !== id));
    notify("🗑 Reto eliminado correctamente.");
  };

  const duplicateChallenge = (reto: Reto) => {
    const copy: Reto = {
      ...reto,
      id: Date.now(),
      name: `${reto.name} copia`,
      status: "Programado",
      start: "",
      end: "",
    };
    setForm({ ...copy, points: String(copy.points) });
    setEditingId(null);
    setOpen(true);
    notify("📋 Copia preparada. Ajusta las fechas antes de guardar.");
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("Todos");
    setCategoryFilter("Todas");
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Gestión de Retos Ambientales</h1>
          <p className="text-slate-500 mt-1">Crea, edita, filtra y programa los retos para la comunidad.</p>
        </div>

        <Button onClick={() => setOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 shadow-sm">
          <Plus className="h-4 w-4" /> Crear Reto
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard icon={<PlayCircle className="h-6 w-6" />} label="Retos Activos" value={stats.active} color="emerald" />
        <StatCard icon={<Calendar className="h-6 w-6" />} label="Programados" value={stats.scheduled} color="blue" />
        <StatCard icon={<CheckCircle2 className="h-6 w-6" />} label="Finalizados" value={stats.finished} color="slate" />
        <StatCard icon={<Award className="h-6 w-6" />} label="Puntos en juego" value={stats.points} color="amber" />
      </div>

      <Card className="border-slate-200 shadow-sm p-5">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_180px_180px_auto] gap-3">
          <div className="relative">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nombre, categoría o tipo..." className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border border-slate-200 rounded-xl px-4 py-2 bg-white">
            <option>Todos</option>
            <option>Activo</option>
            <option>Programado</option>
            <option>Finalizado</option>
          </select>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="border border-slate-200 rounded-xl px-4 py-2 bg-white">
            <option>Todas</option>
            <option>Agua</option>
            <option>Energía</option>
            <option>Gas</option>
            <option>Reciclaje</option>
            <option>Movilidad</option>
          </select>
          <Button onClick={clearFilters} className="border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center gap-2 justify-center">
            <RotateCcw className="h-4 w-4" /> Limpiar
          </Button>
        </div>
      </Card>

      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-medium">Nombre</th>
                <th className="px-6 py-4 font-medium">Categoría</th>
                <th className="px-6 py-4 font-medium">Tipo</th>
                <th className="px-6 py-4 font-medium">Fechas</th>
                <th className="px-6 py-4 font-medium">Meta</th>
                <th className="px-6 py-4 font-medium">Puntos</th>
                <th className="px-6 py-4 font-medium">Estado</th>
                <th className="px-6 py-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredRetos.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-slate-500">
                    No hay retos con esos filtros.
                  </td>
                </tr>
              ) : filteredRetos.map((reto) => (
                <tr key={reto.id} className="bg-white border-b border-slate-100 hover:bg-slate-50/60 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-900">{reto.name}</p>
                    <p className="text-xs text-slate-500 max-w-[260px] truncate">{reto.description}</p>
                  </td>
                  <td className="px-6 py-4"><div className="flex gap-2 items-center text-slate-600">{getCategoryIcon(reto.category)} {reto.category}</div></td>
                  <td className="px-6 py-4"><div className="flex gap-2 items-center text-slate-600">{getTypeIcon(reto.type)} {reto.type}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-600">{formatDate(reto.start)} - {formatDate(reto.end)}</td>
                  <td className="px-6 py-4 text-slate-600">{reto.goal} {reto.unit}</td>
                  <td className="px-6 py-4 text-emerald-600 font-bold">+{reto.points}</td>
                  <td className="px-6 py-4">{getStatusBadge(reto.status)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button title="Ver detalle" onClick={() => setSelectedReto(reto)} className="h-8 w-8 flex items-center justify-center text-slate-400 hover:text-emerald-600"><Eye className="h-4 w-4" /></button>
                      <button title="Editar" onClick={() => editChallenge(reto)} className="h-8 w-8 flex items-center justify-center text-slate-400 hover:text-blue-600"><Edit className="h-4 w-4" /></button>
                      <button title="Duplicar" onClick={() => duplicateChallenge(reto)} className="h-8 w-8 flex items-center justify-center text-slate-400 hover:text-amber-600"><ClipboardCheck className="h-4 w-4" /></button>
                      <button title="Eliminar" onClick={() => deleteChallenge(reto.id)} className="h-8 w-8 flex items-center justify-center text-slate-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{editingId ? "Editar Reto" : "Crear Nuevo Reto"}</h2>
                <p className="text-sm text-slate-500 mt-1">La fecha se valida para evitar retos duplicados o cruzados.</p>
              </div>
              <button onClick={resetForm} className="text-slate-400 hover:text-slate-700"><X /></button>
            </div>

            <div className="grid gap-4">
              <input name="name" value={form.name} onChange={handleChange} placeholder="Nombre del reto" className="border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              <textarea name="description" value={form.description} onChange={handleChange} placeholder="Descripción" className="border border-slate-200 rounded-xl px-4 py-2 min-h-24 focus:outline-none focus:ring-2 focus:ring-emerald-500" />

              <div className="grid md:grid-cols-2 gap-4">
                <select name="category" value={form.category} onChange={handleChange} className="border border-slate-200 rounded-xl px-4 py-2 bg-white">
                  <option>Agua</option><option>Energía</option><option>Gas</option><option>Reciclaje</option><option>Movilidad</option>
                </select>
                <select name="type" value={form.type} onChange={handleChange} className="border border-slate-200 rounded-xl px-4 py-2 bg-white">
                  <option>Reducción</option><option>Límite</option><option>Manual</option><option>Mixto</option>
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <input name="goal" value={form.goal} onChange={handleChange} type="number" placeholder="Meta" className="border border-slate-200 rounded-xl px-4 py-2" />
                <select name="unit" value={form.unit} onChange={handleChange} className="border border-slate-200 rounded-xl px-4 py-2 bg-white">
                  <option>%</option><option>kWh</option><option>m³</option><option>Días</option><option>$</option>
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <input name="start" value={form.start} onChange={handleChange} type="date" className="border border-slate-200 rounded-xl px-4 py-2" />
                <input name="end" value={form.end} onChange={handleChange} type="date" className="border border-slate-200 rounded-xl px-4 py-2" />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <input name="points" value={form.points} onChange={handleChange} type="number" placeholder="Puntos" className="border border-slate-200 rounded-xl px-4 py-2" />
                <div className="border border-slate-200 rounded-xl px-4 py-2 bg-slate-50 text-sm text-slate-600 flex items-center gap-2">
                  <Filter className="h-4 w-4" /> Estado automático: <strong>{form.start && form.end ? calculateStatus(form.start, form.end) : "Pendiente"}</strong>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-sm text-emerald-800 flex gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <p>{form.type === "Reducción" ? "Este reto se verificará comparando consumo anterior vs consumo actual." : form.type === "Límite" ? "Este reto se verificará revisando que el consumo no supere el límite." : form.type === "Manual" ? "Este reto se verificará con checklist de días completados." : "Este reto combina datos automáticos y confirmación manual."}</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button onClick={resetForm} className="border border-slate-200 text-slate-600 hover:bg-slate-50">Cancelar</Button>
              <Button onClick={saveChallenge} className="bg-emerald-600 hover:bg-emerald-700 text-white">Guardar Reto</Button>
            </div>
          </div>
        </div>
      )}

      {selectedReto && (
        <DetailModal reto={selectedReto} onClose={() => setSelectedReto(null)} />
      )}
    </div>
  );
}

function UserView({ retos, joinedChallenges, setJoinedChallenges, points, setPoints, notify }: any) {
  const [tab, setTab] = useState<"active" | "available" | "ranking">("active");
  const activeRetos = retos.filter((reto: Reto) => joinedChallenges.some((j: JoinedChallenge) => j.retoId === reto.id));
  const availableRetos = retos.filter((reto: Reto) => reto.status !== "Finalizado" && !joinedChallenges.some((j: JoinedChallenge) => j.retoId === reto.id));
  const weeklyChallenge = retos.find((reto: Reto) => reto.status === "Activo") ?? retos[0];

  const joinChallenge = (reto: Reto) => {
    if (joinedChallenges.some((j: JoinedChallenge) => j.retoId === reto.id)) {
      notify("🌱 Ya estás participando en este reto.");
      return;
    }

    setJoinedChallenges([...joinedChallenges, { retoId: reto.id, manualDays: 0, completed: false, awarded: false }]);
    notify(`🌱 Te uniste a: ${reto.name}`);
  };

  const leaveChallenge = (retoId: number) => {
    setJoinedChallenges(joinedChallenges.filter((j: JoinedChallenge) => j.retoId !== retoId));
    notify("Reto removido de tus retos activos.");
  };

  const markDay = (reto: Reto) => {
    const requiredDays = Math.max(1, Number(reto.goal) || 5);

    setJoinedChallenges(joinedChallenges.map((item: JoinedChallenge) => {
      if (item.retoId !== reto.id) return item;
      const nextDays = Math.min(requiredDays, item.manualDays + 1);
      const completed = nextDays >= requiredDays;
      return { ...item, manualDays: nextDays, completed };
    }));

    const current = joinedChallenges.find((j: JoinedChallenge) => j.retoId === reto.id);
    const nextDays = Math.min(requiredDays, (current?.manualDays ?? 0) + 1);

    if (nextDays >= requiredDays) {
      notify("🏆 ¡Completaste el reto manual! Ahora puedes reclamar tus puntos.");
    } else {
      notify(`✅ Día ${nextDays} marcado correctamente.`);
    }
  };

  const verifyChallenge = (reto: Reto) => {
    const auto = getAutoProgress(reto);

    if (reto.type === "Manual") {
      const joined = joinedChallenges.find((j: JoinedChallenge) => j.retoId === reto.id);
      const requiredDays = Math.max(1, Number(reto.goal) || 5);
      if ((joined?.manualDays ?? 0) >= requiredDays) {
        completeAndAward(reto);
      } else {
        notify("⚠ Aún faltan días por marcar para completar este reto.");
      }
      return;
    }

    if (auto.completed) {
      completeAndAward(reto);
    } else {
      notify("⚠ Todavía no cumples la meta. Sigue avanzando.");
    }
  };

  const completeAndAward = (reto: Reto) => {
    const joined = joinedChallenges.find((j: JoinedChallenge) => j.retoId === reto.id);
    if (joined?.awarded) {
      notify("✅ Este reto ya fue completado y sus puntos ya fueron entregados.");
      return;
    }

    setJoinedChallenges(joinedChallenges.map((j: JoinedChallenge) => j.retoId === reto.id ? { ...j, completed: true, awarded: true } : j));
    setPoints(points + reto.points);
    notify(`🏆 ¡Reto completado! Ganaste ${reto.points} puntos.`);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between gap-4 flex-col md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Retos Ambientales</h1>
          <p className="text-slate-500 mt-2 max-w-2xl">Únete a retos semanales, reduce tu huella ecológica y acumula puntos.</p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
          <Award className="h-5 w-5 text-emerald-600" />
          <span className="font-semibold text-emerald-700">{points.toLocaleString("es-CO")} Pts</span>
        </div>
      </div>

      {weeklyChallenge && (
        <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-md p-8 relative overflow-hidden">
          <div className="absolute -right-12 -top-12 opacity-10"><Target className="h-64 w-64 text-emerald-600" /></div>
          <div className="relative z-10 grid md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2 space-y-4">
              <Badge className="bg-emerald-600 text-white">Reto destacado</Badge>
              <h2 className="text-3xl font-bold text-slate-900">{weeklyChallenge.name}</h2>
              <p className="text-slate-600 text-lg">{weeklyChallenge.description}</p>
              <div className="flex flex-wrap gap-4">
                <span className="bg-white/70 px-3 py-1.5 rounded-full border flex gap-2 items-center text-sm"><Clock className="h-4 w-4 text-blue-500" /> {formatDate(weeklyChallenge.start)} - {formatDate(weeklyChallenge.end)}</span>
                <span className="bg-white/70 px-3 py-1.5 rounded-full border flex gap-2 items-center text-sm"><Target className="h-4 w-4 text-rose-500" /> Meta: {weeklyChallenge.goal} {weeklyChallenge.unit}</span>
                <span className="bg-white/70 px-3 py-1.5 rounded-full border flex gap-2 items-center text-sm font-bold text-emerald-700"><Award className="h-4 w-4" /> +{weeklyChallenge.points} Pts</span>
              </div>
            </div>
            <Button onClick={() => joinChallenge(weeklyChallenge)} className="text-lg h-14 px-8 rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-lg flex items-center gap-2 justify-center">
              <UserPlus className="h-5 w-5" /> Unirme al Reto
            </Button>
          </div>
        </Card>
      )}

      <div className="bg-slate-100 p-1 rounded-xl grid grid-cols-3 md:w-[520px]">
        <button onClick={() => setTab("active")} className={`rounded-lg px-4 py-2 text-sm font-medium ${tab === "active" ? "bg-white shadow-sm text-slate-900" : "text-slate-500"}`}>Mis Retos</button>
        <button onClick={() => setTab("available")} className={`rounded-lg px-4 py-2 text-sm font-medium ${tab === "available" ? "bg-white shadow-sm text-slate-900" : "text-slate-500"}`}>Disponibles</button>
        <button onClick={() => setTab("ranking")} className={`rounded-lg px-4 py-2 text-sm font-medium ${tab === "ranking" ? "bg-white shadow-sm text-slate-900" : "text-slate-500"}`}>Ranking</button>
      </div>

      {tab === "active" && (
        <div className="space-y-4">
          {activeRetos.length === 0 ? (
            <Card className="p-8 text-center border-slate-200 shadow-sm">
              <Target className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-900">Aún no tienes retos activos</h3>
              <p className="text-slate-500 mt-1">Entra a Retos Disponibles y únete a uno.</p>
            </Card>
          ) : activeRetos.map((reto: Reto) => (
            <ActiveChallengeCard
              key={reto.id}
              reto={reto}
              joined={joinedChallenges.find((j: JoinedChallenge) => j.retoId === reto.id)}
              onMarkDay={markDay}
              onVerify={verifyChallenge}
              onLeave={leaveChallenge}
            />
          ))}
        </div>
      )}

      {tab === "available" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableRetos.map((reto: Reto) => (
            <AvailableChallengeCard key={reto.id} reto={reto} onJoin={joinChallenge} />
          ))}
        </div>
      )}

      {tab === "ranking" && (
        <RankingPanel points={points} />
      )}
    </div>
  );
}

function StatCard({ icon, label, value, color }: any) {
  const colors: any = {
    emerald: "bg-emerald-100 text-emerald-600",
    blue: "bg-blue-100 text-blue-600",
    slate: "bg-slate-100 text-slate-600",
    amber: "bg-amber-100 text-amber-600",
  };

  return (
    <Card className="border-slate-200 shadow-sm p-6 flex items-center gap-4">
      <div className={`${colors[color]} p-3 rounded-xl`}>{icon}</div>
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </Card>
  );
}

function ActiveChallengeCard({ reto, joined, onMarkDay, onVerify, onLeave }: any) {
  const auto = getAutoProgress(reto);
  const requiredDays = Math.max(1, Number(reto.goal) || 5);
  const manualProgress = reto.type === "Manual" ? Math.round(((joined?.manualDays ?? 0) / requiredDays) * 100) : auto.progress;
  const progress = reto.type === "Manual" ? manualProgress : auto.progress;
  const isCompleted = joined?.completed || joined?.awarded;

  return (
    <Card className={`${isCompleted ? "border-emerald-200 bg-emerald-50/40" : "border-slate-200"} shadow-sm hover:shadow-md transition-shadow p-6`}>
      <div className="flex flex-col md:flex-row gap-6 justify-between">
        <div className="flex-1 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-slate-100 p-2 rounded-lg">{getCategoryIcon(reto.category)}</div>
              <div>
                <h3 className={`font-semibold text-slate-900 text-lg ${isCompleted ? "line-through opacity-70" : ""}`}>{reto.name}</h3>
                <p className="text-sm text-slate-500">{reto.category} • {reto.type}</p>
              </div>
            </div>
            {isCompleted ? <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200">Completado</Badge> : <Badge className="bg-amber-50 text-amber-700 border border-amber-200">En progreso</Badge>}
          </div>

          <p className="text-sm text-slate-600">{reto.type === "Manual" ? `Has marcado ${joined?.manualDays ?? 0} de ${requiredDays} días.` : auto.detail}</p>

          {reto.type === "Manual" ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {Array.from({ length: requiredDays }).map((_, index) => {
                const day = index + 1;
                const done = day <= (joined?.manualDays ?? 0);
                return (
                  <button key={day} onClick={() => !done && onMarkDay(reto)} className={`flex flex-col items-center justify-center p-2 rounded-lg border w-16 h-16 transition ${done ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-white border-slate-300 text-slate-700 hover:border-emerald-400 hover:bg-slate-50"}`}>
                    <span className="text-xs font-medium mb-1">Día {day}</span>
                    {done ? <CheckCircle2 className="h-5 w-5" /> : <CheckSquare className="h-5 w-5" />}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-slate-700">Progreso del reto</span>
                <span className="text-emerald-600">{progress}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col items-end justify-between border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 min-w-[170px] gap-3">
          <div className="text-right w-full">
            <span className="text-sm text-slate-500 block">Recompensa</span>
            <span className="font-bold text-xl text-emerald-600">+{reto.points} Pts</span>
          </div>
          <div className="flex flex-col gap-2 w-full">
            {reto.type === "Manual" && !isCompleted && (
              <Button onClick={() => onMarkDay(reto)} className="bg-slate-900 hover:bg-slate-800 text-white text-sm">Marcar avance</Button>
            )}
            <Button onClick={() => onVerify(reto)} className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm flex items-center gap-2 justify-center">
              <Check className="h-4 w-4" /> Verificar
            </Button>
            {!isCompleted && <button onClick={() => onLeave(reto.id)} className="text-xs text-slate-400 hover:text-red-600">Abandonar reto</button>}
          </div>
        </div>
      </div>
    </Card>
  );
}

function AvailableChallengeCard({ reto, onJoin }: any) {
  return (
    <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow p-5">
      <div className="flex justify-between items-start">
        <div className="bg-slate-100 p-2 rounded-lg">{getCategoryIcon(reto.category)}</div>
        <Badge className="bg-slate-100 text-slate-600 border border-slate-200">{reto.type}</Badge>
      </div>
      <h3 className="font-bold text-slate-900 mt-4">{reto.name}</h3>
      <p className="text-sm text-slate-500 mt-1 min-h-[42px]">{reto.description}</p>
      <div className="grid grid-cols-2 gap-2 mt-4 text-xs text-slate-500">
        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDate(reto.start)} - {formatDate(reto.end)}</span>
        <span className="flex items-center gap-1"><Target className="h-3 w-3" /> {reto.goal} {reto.unit}</span>
      </div>
      <div className="flex justify-between items-center mt-5 border-t border-slate-100 pt-4">
        <span className="font-bold text-emerald-600 flex items-center gap-1"><Award className="h-4 w-4" /> +{reto.points} pts</span>
        <Button onClick={() => onJoin(reto)} className="border border-slate-200 hover:bg-slate-50 hover:text-emerald-600 text-sm">Unirme</Button>
      </div>
    </Card>
  );
}

function RankingPanel({ points }: { points: number }) {
  const ranking = [{ name: "Tú", points, level: points >= 1600 ? "Eco Líder" : "Participante" }, ...rankingUsers.filter((user) => user.name !== "Nicol")]
    .sort((a, b) => b.points - a.points);

  return (
    <Card className="border-slate-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Ranking Ecológico</h2>
          <p className="text-slate-500 text-sm">Top de usuarios con mejores hábitos sostenibles.</p>
        </div>
        <Trophy className="h-8 w-8 text-amber-500" />
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {ranking.slice(0, 3).map((user, index) => (
          <div key={user.name} className={`rounded-2xl p-5 text-center border ${index === 0 ? "bg-amber-50 border-amber-200" : index === 1 ? "bg-slate-50 border-slate-200" : "bg-orange-50 border-orange-200"}`}>
            <p className="text-3xl mb-2">{index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}</p>
            <h3 className="font-bold text-slate-900">{user.name}</h3>
            <p className="text-sm text-slate-500">{user.level}</p>
            <p className="font-bold text-emerald-600 mt-2">{user.points} pts</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {ranking.map((user, index) => (
          <div key={user.name} className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4 hover:bg-slate-50">
            <div className="flex items-center gap-3">
              <span className="font-bold text-slate-500 w-7">#{index + 1}</span>
              <div className="h-9 w-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">{user.name[0]}</div>
              <div>
                <p className="font-semibold text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-500">{user.level}</p>
              </div>
            </div>
            <span className="font-bold text-emerald-600">{user.points} pts</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function DetailModal({ reto, onClose }: { reto: Reto; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200 mb-3">{reto.category}</Badge>
            <h2 className="text-2xl font-bold text-slate-900">{reto.name}</h2>
            <p className="text-slate-500 mt-1">{reto.description}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700"><X /></button>
        </div>

        <div className="grid md:grid-cols-2 gap-3 mt-6 text-sm">
          <InfoBox icon={<Target className="h-4 w-4" />} label="Meta" value={`${reto.goal} ${reto.unit}`} />
          <InfoBox icon={<Award className="h-4 w-4" />} label="Puntos" value={`+${reto.points}`} />
          <InfoBox icon={<Calendar className="h-4 w-4" />} label="Inicio" value={reto.start} />
          <InfoBox icon={<Clock className="h-4 w-4" />} label="Fin" value={reto.end} />
          <InfoBox icon={getTypeIcon(reto.type)} label="Tipo" value={reto.type} />
          <InfoBox icon={<CheckCircle2 className="h-4 w-4" />} label="Estado" value={reto.status} />
        </div>

        <div className="mt-5 bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm text-slate-600">
          <strong>Forma de verificación:</strong> {getVerificationText(reto)}
        </div>

        <div className="flex justify-end mt-6">
          <Button onClick={onClose} className="bg-slate-900 hover:bg-slate-800 text-white">Cerrar</Button>
        </div>
      </div>
    </div>
  );
}

function InfoBox({ icon, label, value }: any) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 flex items-center gap-3">
      <div className="text-emerald-600">{icon}</div>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="font-semibold text-slate-900">{value}</p>
      </div>
    </div>
  );
}
