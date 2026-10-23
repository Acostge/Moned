import React, { useState } from 'react';
import {
  X,
  Target,
  Shield,
  Car,
  Home,
  Laptop,
  PiggyBank,
  Plane,
  Heart,
  Sparkles,
  Calendar,
  DollarSign,
  FileText,
  Check,
} from 'lucide-react';
import { SavingsGoal } from '../types/finance';

interface SavingsGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveGoal: (goal: Omit<SavingsGoal, 'id' | 'createdAt'>) => void;
  tasaBCV: number;
  initialData?: SavingsGoal | null;
}

const AVAILABLE_ICONS = [
  { name: 'Target', label: 'Objetivo', icon: Target },
  { name: 'Shield', label: 'Seguridad', icon: Shield },
  { name: 'PiggyBank', label: 'Ahorro', icon: PiggyBank },
  { name: 'Car', label: 'Vehículo', icon: Car },
  { name: 'Home', label: 'Hogar', icon: Home },
  { name: 'Laptop', label: 'Tecnología', icon: Laptop },
  { name: 'Plane', label: 'Viaje', icon: Plane },
  { name: 'Sparkles', label: 'Inversión', icon: Sparkles },
  { name: 'Heart', label: 'Salud', icon: Heart },
];

const AVAILABLE_COLORS = [
  '#10b981', // emerald
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#f59e0b', // amber
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#f97316', // orange
  '#64748b', // slate
];

export const SavingsGoalModal: React.FC<SavingsGoalModalProps> = ({
  isOpen,
  onClose,
  onSaveGoal,
  tasaBCV,
  initialData,
}) => {
  const [titulo, setTitulo] = useState(initialData?.titulo || '');
  const [montoObjetivo, setMontoObjetivo] = useState(initialData?.montoObjetivoUSD?.toString() || '');
  const [montoActual, setMontoActual] = useState(initialData?.montoActualUSD?.toString() || '0');
  const [fechaLimite, setFechaLimite] = useState(
    initialData?.fechaLimite ||
      new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [categoriaIcono, setCategoriaIcono] = useState(initialData?.categoriaIcono || 'Target');
  const [color, setColor] = useState(initialData?.color || '#10b981');
  const [notas, setNotas] = useState(initialData?.notas || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const objetivo = parseFloat(montoObjetivo);
    const actual = parseFloat(montoActual) || 0;

    if (!titulo.trim() || isNaN(objetivo) || objetivo <= 0) return;

    onSaveGoal({
      titulo: titulo.trim(),
      montoObjetivoUSD: objetivo,
      montoActualUSD: actual,
      fechaLimite,
      categoriaIcono,
      color,
      notas: notas.trim() || undefined,
    });

    onClose();
  };

  const objetivoNum = parseFloat(montoObjetivo) || 0;
  const actualNum = parseFloat(montoActual) || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: `${color}30`, borderColor: color, borderWidth: 1 }}
            >
              <Target className="w-5 h-5" style={{ color }} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {initialData ? 'Editar Meta de Ahorro' : 'Nueva Meta de Ahorro'}
              </h3>
              <p className="text-xs text-slate-400">Define tu objetivo financiero y fecha límite</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Título de la meta */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Nombre o Título de la Meta</label>
            <input
              type="text"
              required
              placeholder="Ej. Fondo de Emergencia, Moto, Remodelación..."
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-2xl py-2.5 px-3.5 text-sm text-white placeholder-slate-600 focus:outline-none transition-colors"
              autoFocus
            />
          </div>

          {/* Montos: Objetivo y Actual */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                Monto Objetivo ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="1"
                required
                placeholder="Ej. 1000.00"
                value={montoObjetivo}
                onChange={(e) => setMontoObjetivo(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-2xl py-2.5 px-3 text-sm font-bold text-white placeholder-slate-600 focus:outline-none font-mono"
              />
              {objetivoNum > 0 && (
                <span className="text-[10px] text-slate-500 font-mono block">
                  ≈ Bs. {(objetivoNum * tasaBCV).toLocaleString('es-VE', { maximumFractionDigits: 0 })}
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300 flex items-center gap-1">
                <PiggyBank className="w-3.5 h-3.5 text-teal-400" />
                Ya Ahorrado ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={montoActual}
                onChange={(e) => setMontoActual(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-2xl py-2.5 px-3 text-sm font-bold text-white placeholder-slate-600 focus:outline-none font-mono"
              />
              {actualNum > 0 && (
                <span className="text-[10px] text-emerald-400 font-mono block">
                  {objetivoNum > 0 ? `${((actualNum / objetivoNum) * 100).toFixed(1)}% completado` : ''}
                </span>
              )}
            </div>
          </div>

          {/* Fecha Límite */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              Fecha Límite para Cumplirla
            </label>
            <input
              type="date"
              required
              value={fechaLimite}
              onChange={(e) => setFechaLimite(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-2xl py-2.5 px-3.5 text-xs text-white focus:outline-none font-mono"
            />
          </div>

          {/* Selector de Icono */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Ícono representativo</label>
            <div className="grid grid-cols-5 gap-2">
              {AVAILABLE_ICONS.map((item) => {
                const IconComponent = item.icon;
                const isSelected = categoriaIcono === item.name;
                return (
                  <button
                    type="button"
                    key={item.name}
                    onClick={() => setCategoriaIcono(item.name)}
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="text-[9px] truncate w-full text-center">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selector de Color */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Color distintivo</label>
            <div className="flex items-center gap-2">
              {AVAILABLE_COLORS.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full transition-transform cursor-pointer flex items-center justify-center ${
                    color === c ? 'scale-115 ring-2 ring-white ring-offset-2 ring-offset-slate-900' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: c }}
                >
                  {color === c && <Check className="w-3.5 h-3.5 text-slate-950 font-bold" />}
                </button>
              ))}
            </div>
          </div>

          {/* Notas u Observaciones */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              Notas o Motivación (Opcional)
            </label>
            <input
              type="text"
              placeholder="Ej. Aporte semanal de $25 desde los ingresos de logística"
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-2xl py-2 px-3 text-xs text-white placeholder-slate-600 focus:outline-none"
            />
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!titulo.trim() || objetivoNum <= 0}
              className={`w-full py-3.5 rounded-2xl font-bold text-sm shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 ${
                titulo.trim() && objetivoNum > 0
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/25'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>{initialData ? 'Guardar Cambios' : 'Crear Meta de Ahorro'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
