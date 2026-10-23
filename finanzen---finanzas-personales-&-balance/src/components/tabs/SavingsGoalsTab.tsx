import React, { useState } from 'react';
import {
  Target,
  Plus,
  Shield,
  Car,
  Home,
  Laptop,
  PiggyBank,
  Plane,
  Heart,
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  TrendingUp,
  DollarSign,
  AlertCircle,
  MoreVertical,
  Trash2,
  Edit2,
  ChevronRight,
  ArrowUpRight,
  X,
} from 'lucide-react';
import { SavingsGoal } from '../../types/finance';

interface SavingsGoalsTabProps {
  savingsGoals: SavingsGoal[];
  tasaBCV: number;
  onOpenCreateModal: () => void;
  onOpenEditModal: (goal: SavingsGoal) => void;
  onDeleteGoal: (id: string) => void;
  onAddContribution: (goalId: string, amountUSD: number) => void;
  currencyDisplay: 'USD' | 'VES' | 'DUAL';
}

export const SavingsGoalsTab: React.FC<SavingsGoalsTabProps> = ({
  savingsGoals,
  tasaBCV,
  onOpenCreateModal,
  onOpenEditModal,
  onDeleteGoal,
  onAddContribution,
  currencyDisplay,
}) => {
  const [selectedGoalForDeposit, setSelectedGoalForDeposit] = useState<SavingsGoal | null>(null);
  const [depositAmount, setDepositAmount] = useState<string>('');

  // Global calculations
  const totalObjetivoUSD = savingsGoals.reduce((sum, g) => sum + g.montoObjetivoUSD, 0);
  const totalActualUSD = savingsGoals.reduce((sum, g) => sum + g.montoActualUSD, 0);
  const globalPercentage = totalObjetivoUSD > 0 ? (totalActualUSD / totalObjetivoUSD) * 100 : 0;

  const formatMoney = (usd: number) => {
    if (currencyDisplay === 'VES') {
      return `Bs. ${(usd * tasaBCV).toLocaleString('es-VE', { maximumFractionDigits: 0 })}`;
    }
    return `$ ${usd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getGoalIcon = (iconName: string, color: string) => {
    const props = { className: 'w-5 h-5', style: { color } };
    switch (iconName) {
      case 'Shield':
        return <Shield {...props} />;
      case 'Car':
        return <Car {...props} />;
      case 'Home':
        return <Home {...props} />;
      case 'Laptop':
        return <Laptop {...props} />;
      case 'Plane':
        return <Plane {...props} />;
      case 'Heart':
        return <Heart {...props} />;
      case 'Sparkles':
        return <Sparkles {...props} />;
      case 'PiggyBank':
        return <PiggyBank {...props} />;
      default:
        return <Target {...props} />;
    }
  };

  const calculateDaysRemaining = (deadlineStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadline = new Date(deadlineStr);
    deadline.setHours(0, 0, 0, 0);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoalForDeposit) return;
    const amount = parseFloat(depositAmount);
    if (!isNaN(amount) && amount !== 0) {
      onAddContribution(selectedGoalForDeposit.id, amount);
      setSelectedGoalForDeposit(null);
      setDepositAmount('');
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-[11px] font-semibold tracking-wider uppercase text-emerald-400 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5" />
            Planificación Financiera
          </span>
          <h1 className="text-xl font-extrabold text-white tracking-tight">Metas de Ahorro</h1>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nueva Meta</span>
        </button>
      </div>

      {/* Global Progress Hero Card */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-500/30 shadow-xl space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold uppercase tracking-wider">Ahorro Total en Metas</span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
            {savingsGoals.length} Metas Activas
          </span>
        </div>

        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {formatMoney(totalActualUSD)}
            </div>
            <div className="text-xs text-slate-400 font-mono mt-0.5">
              Objetivo total combinado: <strong className="text-white">{formatMoney(totalObjetivoUSD)}</strong>
            </div>
          </div>

          <div className="text-right">
            <span className="text-2xl font-black font-mono text-emerald-400">
              {globalPercentage.toFixed(1)}%
            </span>
            <span className="text-[10px] text-slate-400 block">Completado</span>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="space-y-1">
          <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-teal-500 via-emerald-400 to-emerald-500 rounded-full transition-all duration-700 shadow-sm shadow-emerald-500/50"
              style={{ width: `${Math.min(100, globalPercentage)}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>Faltan: {formatMoney(Math.max(0, totalObjetivoUSD - totalActualUSD))}</span>
            <span>Ahorro Real en tu Excel: $10.700,00</span>
          </div>
        </div>
      </div>

      {/* List of Goals */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Tus Objetivos Financieros
          </h2>
          <span className="text-[11px] text-emerald-400 font-medium">
            Tasa BCV: Bs. {tasaBCV.toLocaleString('es-VE')}
          </span>
        </div>

        {savingsGoals.length === 0 ? (
          <div className="p-8 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">No tienes metas de ahorro aún</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Crea tu primera meta con un monto objetivo y fecha límite para monitorear tu avance con una barra de porcentaje.
              </p>
            </div>
            <button
              onClick={onOpenCreateModal}
              className="py-2 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Crear Mi Primera Meta</span>
            </button>
          </div>
        ) : (
          savingsGoals.map((goal) => {
            const pct = goal.montoObjetivoUSD > 0 ? (goal.montoActualUSD / goal.montoObjetivoUSD) * 100 : 0;
            const daysLeft = calculateDaysRemaining(goal.fechaLimite);
            const isCompleted = goal.montoActualUSD >= goal.montoObjetivoUSD;
            const faltante = Math.max(0, goal.montoObjetivoUSD - goal.montoActualUSD);

            // Months left estimate for suggested monthly savings
            const monthsLeft = Math.max(1, Math.round(daysLeft / 30));
            const suggestedMonthly = faltante > 0 && daysLeft > 0 ? faltante / monthsLeft : 0;

            return (
              <div
                key={goal.id}
                className="p-4 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-3 relative overflow-hidden group shadow-lg"
              >
                {/* Accent top border strip */}
                <div
                  className="absolute top-0 left-0 right-0 h-1 transition-all"
                  style={{ backgroundColor: goal.color }}
                ></div>

                {/* Card Top: Title, Icon, Days Remaining */}
                <div className="flex items-start justify-between gap-3 pt-1">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border"
                      style={{
                        backgroundColor: `${goal.color}20`,
                        borderColor: `${goal.color}40`,
                      }}
                    >
                      {getGoalIcon(goal.categoriaIcono, goal.color)}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white truncate">{goal.titulo}</h3>
                        {isCompleted && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold shrink-0 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Alcanzada 🎉
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <span className="flex items-center gap-1 font-mono">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {goal.fechaLimite}
                        </span>
                        <span>•</span>
                        <span
                          className={`font-semibold ${
                            daysLeft < 0
                              ? 'text-rose-400'
                              : daysLeft < 30
                              ? 'text-amber-400'
                              : 'text-slate-300'
                          }`}
                        >
                          {daysLeft < 0
                            ? 'Venció'
                            : daysLeft === 0
                            ? 'Vence hoy'
                            : `${daysLeft} días restantes`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions (Edit / Delete) */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => onOpenEditModal(goal)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Editar meta"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteGoal(goal.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Eliminar meta"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Amount and Percentage Status */}
                <div className="flex items-baseline justify-between pt-1">
                  <div>
                    <div className="text-lg font-extrabold text-white font-mono">
                      {formatMoney(goal.montoActualUSD)}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      de {formatMoney(goal.montoObjetivoUSD)} objetivo
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-black font-mono" style={{ color: goal.color }}>
                      {pct.toFixed(1)}%
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {isCompleted ? '100% completado' : `Faltan ${formatMoney(faltante)}`}
                    </div>
                  </div>
                </div>

                {/* Progress Bar (Percentage Visualizer) */}
                <div className="space-y-1">
                  <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800/80">
                    <div
                      className="h-full rounded-full transition-all duration-700 shadow-sm"
                      style={{
                        width: `${Math.min(100, Math.max(0, pct))}%`,
                        backgroundColor: goal.color,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Card Bottom: Suggested monthly savings and deposit action */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2 text-[11px]">
                  <div className="min-w-0">
                    {!isCompleted && suggestedMonthly > 0 ? (
                      <span className="text-slate-400 block truncate">
                        Ahorro mensual sugerido:{' '}
                        <strong className="text-white font-mono">${suggestedMonthly.toFixed(2)}/mes</strong>
                      </span>
                    ) : (
                      <span className="text-slate-400 block truncate">
                        {goal.notas || 'Meta establecida'}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setSelectedGoalForDeposit(goal);
                      setDepositAmount('');
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer shrink-0 shadow-sm"
                    style={{
                      backgroundColor: `${goal.color}25`,
                      color: goal.color,
                      borderColor: `${goal.color}40`,
                      borderWidth: 1,
                    }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Aportar</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Quick Deposit Submodal */}
      {selectedGoalForDeposit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-white"
                  style={{ backgroundColor: `${selectedGoalForDeposit.color}30` }}
                >
                  <Plus className="w-4 h-4" style={{ color: selectedGoalForDeposit.color }} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Aportar a la Meta</h4>
                  <p className="text-[11px] text-slate-400 truncate max-w-[180px]">
                    {selectedGoalForDeposit.titulo}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedGoalForDeposit(null)}
                className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleDepositSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Monto a Aportar ($ USD)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-sm font-bold text-emerald-400">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="50.00"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl py-2.5 pl-8 pr-3 text-lg font-bold text-white font-mono focus:outline-none"
                    autoFocus
                  />
                </div>
                {parseFloat(depositAmount) > 0 && (
                  <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                    ≈ Bs. {(parseFloat(depositAmount) * tasaBCV).toLocaleString('es-VE')} al cambio BCV
                  </span>
                )}
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex gap-1.5">
                {[10, 25, 50, 100].map((amt) => (
                  <button
                    type="button"
                    key={amt}
                    onClick={() => setDepositAmount(amt.toString())}
                    className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold transition-colors cursor-pointer"
                  >
                    +${amt}
                  </button>
                ))}
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedGoalForDeposit(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!parseFloat(depositAmount)}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirmar Aporte</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
