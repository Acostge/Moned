import React from 'react';
import {
  TrendingUp,
  ArrowDownRight,
  ArrowUpRight,
  FileSpreadsheet,
  Wallet,
  Building,
  CreditCard,
  Banknote,
  Coins,
  ChevronRight,
  Sparkles,
  ArrowRightLeft,
  ShieldAlert,
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
  Target,
} from 'lucide-react';
import { FinancialAccount, Transaction, CuentaPorCobrar, DeudaPorPagar, SavingsGoal } from '../../types/finance';

interface DashboardTabProps {
  tasaBCV: number;
  onOpenTasaModal: () => void;
  onOpenTransactionModal: (type: 'Egreso' | 'Ingreso') => void;
  onOpenSheetsModal: () => void;
  onOpenDesignModal: () => void;
  accounts: FinancialAccount[];
  transactions: Transaction[];
  cuentasCobrar: CuentaPorCobrar[];
  deudasPagar: DeudaPorPagar[];
  savingsGoals: SavingsGoal[];
  currencyDisplay: 'USD' | 'VES' | 'DUAL';
  setCurrencyDisplay: (mode: 'USD' | 'VES' | 'DUAL') => void;
  onSelectTab: (tabId: string) => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  tasaBCV,
  onOpenTasaModal,
  onOpenTransactionModal,
  onOpenSheetsModal,
  onOpenDesignModal,
  accounts,
  transactions,
  cuentasCobrar,
  deudasPagar,
  savingsGoals,
  currencyDisplay,
  setCurrencyDisplay,
  onSelectTab,
}) => {
  // Financial totals matching Excel
  const totalIngresos = 34711.95;
  const totalEgresos = 23074.88;
  const totalCapitalNeto = 11637.07;
  const ahorroReal = 10700.00;

  // Calculos en Bolívares
  const totalCapitalNetoBs = totalCapitalNeto * tasaBCV;
  const totalIngresosBs = totalIngresos * tasaBCV;
  const totalEgresosBs = totalEgresos * tasaBCV;

  const totalCuentasCobrar = cuentasCobrar
    .filter((c) => !c.isBlacklist && c.status === 'pendiente')
    .reduce((sum, c) => sum + c.montoUSD, 0);

  const totalDeudas = deudasPagar.reduce((sum, d) => sum + d.montoUSD, 0);
  const totalLiquidez = accounts.reduce((sum, a) => sum + a.saldoUSD, 0);

  const formatMoney = (usdAmount: number, forceCurrency?: 'USD' | 'VES') => {
    const mode = forceCurrency || currencyDisplay;
    if (mode === 'VES') {
      const bs = usdAmount * tasaBCV;
      return `Bs. ${bs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `$ ${usdAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getAccountIcon = (iconName: string) => {
    switch (iconName) {
      case 'Banknote':
        return <Banknote className="w-4 h-4 text-emerald-400" />;
      case 'Building':
        return <Building className="w-4 h-4 text-blue-400" />;
      case 'CreditCard':
        return <CreditCard className="w-4 h-4 text-purple-400" />;
      case 'Coins':
        return <Coins className="w-4 h-4 text-amber-400" />;
      case 'Bitcoin':
        return <Coins className="w-4 h-4 text-yellow-400" />;
      default:
        return <Wallet className="w-4 h-4 text-teal-400" />;
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Top Bar / Profile & BCV Pill */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-[11px] font-semibold tracking-wider uppercase text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Finanzas 2026
          </span>
          <h1 className="text-xl font-extrabold text-white tracking-tight">Balance General</h1>
        </div>

        {/* BCV Rate Pill */}
        <button
          onClick={onOpenTasaModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-emerald-500/30 hover:border-emerald-500 text-xs shadow-sm transition-all cursor-pointer group"
          title="Tasa oficial BCV. Clic para editar."
        >
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
          <span className="text-slate-400 text-[11px]">BCV:</span>
          <span className="font-mono font-bold text-white text-xs">Bs. {tasaBCV.toLocaleString('es-VE')}</span>
        </button>
      </div>

      {/* Currency Switcher Chips */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-400 text-[11px]">Moneda de visualización:</span>
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setCurrencyDisplay('USD')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
              currencyDisplay === 'USD'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            $ USD
          </button>
          <button
            onClick={() => setCurrencyDisplay('VES')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
              currencyDisplay === 'VES'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Bs. VES
          </button>
          <button
            onClick={() => setCurrencyDisplay('DUAL')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
              currencyDisplay === 'DUAL'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Dual ($/Bs)
          </button>
        </div>
      </div>

      {/* Main Capital Balance Card (Hero) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/40 border border-emerald-500/30 p-5 shadow-xl shadow-emerald-950/20">
        <div className="absolute top-0 right-0 w-44 h-44 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Capital Total Neto
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Ahorro Real: $ {ahorroReal.toLocaleString('en-US')}
            </span>
          </div>

          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-mono">
              {currencyDisplay === 'VES'
                ? `Bs. ${totalCapitalNetoBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                : `$ ${totalCapitalNeto.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </div>
            {(currencyDisplay === 'DUAL' || currencyDisplay === 'USD') && (
              <div className="text-xs text-slate-400 mt-0.5 font-mono">
                ≈ Bs. {totalCapitalNetoBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} en Tasa BCV
              </div>
            )}
            {currencyDisplay === 'VES' && (
              <div className="text-xs text-emerald-400 mt-0.5 font-mono">
                ≈ $ {totalCapitalNeto.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
              </div>
            )}
          </div>

          {/* Quick Metrics Bar: Ingresos vs Egresos 2026 */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800/80">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <ArrowUpRight className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Total Ingresos</span>
                <span className="text-xs font-bold text-emerald-400 font-mono">
                  {formatMoney(totalIngresos)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <ArrowDownRight className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Total Egresos</span>
                <span className="text-xs font-bold text-rose-400 font-mono">
                  {formatMoney(totalEgresos)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons (Registrar Gasto, Ingreso, Sheets) */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => onOpenTransactionModal('Egreso')}
          className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 active:scale-95 transition-all cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center group-hover:scale-105 transition-transform">
            <ArrowDownRight className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-rose-300">Registrar Gasto</span>
        </button>

        <button
          onClick={() => onOpenTransactionModal('Ingreso')}
          className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 active:scale-95 transition-all cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
            <ArrowUpRight className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-emerald-300">Registrar Ingreso</span>
        </button>

        <button
          onClick={onOpenSheetsModal}
          className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/25 active:scale-95 transition-all cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center group-hover:scale-105 transition-transform">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-teal-300">Sincronizar Sheets</span>
        </button>
      </div>

      {/* Metas de Ahorro Highlight Card */}
      <div
        onClick={() => onSelectTab('savings')}
        className="p-3.5 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 hover:border-emerald-400/60 transition-all cursor-pointer group shadow-lg"
      >
        <div className="flex items-center justify-between text-xs mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white block">Metas de Ahorro</span>
              <span className="text-[10px] text-slate-400">{savingsGoals.length} objetivos en progreso</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold font-mono text-emerald-400">
              {savingsGoals.reduce((sum, g) => sum + g.montoObjetivoUSD, 0) > 0
                ? (
                    (savingsGoals.reduce((sum, g) => sum + g.montoActualUSD, 0) /
                      savingsGoals.reduce((sum, g) => sum + g.montoObjetivoUSD, 0)) *
                    100
                  ).toFixed(1)
                : 0}
              %
            </span>
            <span className="text-[10px] text-slate-400 block font-mono">
              {formatMoney(savingsGoals.reduce((sum, g) => sum + g.montoActualUSD, 0))} / {formatMoney(savingsGoals.reduce((sum, g) => sum + g.montoObjetivoUSD, 0))}
            </span>
          </div>
        </div>

        {/* Mini progress bar */}
        <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(
                100,
                savingsGoals.reduce((sum, g) => sum + g.montoObjetivoUSD, 0) > 0
                  ? (savingsGoals.reduce((sum, g) => sum + g.montoActualUSD, 0) /
                      savingsGoals.reduce((sum, g) => sum + g.montoObjetivoUSD, 0)) *
                      100
                  : 0
              )}%`,
            }}
          ></div>
        </div>

        <div className="flex items-center justify-between pt-2 text-[10px] text-slate-400">
          <span>Próxima: <strong className="text-white">{savingsGoals[0]?.titulo || 'Sin metas'}</strong></span>
          <span className="text-emerald-400 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
            Ver metas y progresos &rarr;
          </span>
        </div>
      </div>

      {/* Sub-cards: Activos vs Pasivos/Deudas & Cuentas por Cobrar */}
      <div className="grid grid-cols-2 gap-3">
        {/* Activos Card */}
        <div
          onClick={() => onSelectTab('accounts')}
          className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 cursor-pointer transition-all active:scale-98 group"
        >
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span>Activos & Liquidez</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
          <div className="text-base sm:text-lg font-bold text-white font-mono">
            {formatMoney(totalLiquidez)}
          </div>
          <span className="text-[10px] text-emerald-400 font-medium">Ver {accounts.length} Cuentas &rarr;</span>
        </div>

        {/* Pasivos & Deudas Card */}
        <div
          onClick={() => onSelectTab('debts')}
          className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-rose-500/40 cursor-pointer transition-all active:scale-98 group"
        >
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span>Pasivos & Cashea</span>
            <ArrowDownRight className="w-3.5 h-3.5 text-rose-400 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" />
          </div>
          <div className="text-base sm:text-lg font-bold text-white font-mono">
            {formatMoney(totalDeudas)}
          </div>
          <span className="text-[10px] text-rose-400 font-medium">Ver Deudas & Créditos &rarr;</span>
        </div>
      </div>

      {/* Cuentas por Cobrar Alert Card */}
      <div
        onClick={() => onSelectTab('debts')}
        className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between cursor-pointer hover:bg-amber-500/15 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Cuentas por Cobrar Pendientes</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">
                {cuentasCobrar.filter((c) => !c.isBlacklist && c.status === 'pendiente').length}
              </span>
            </div>
            <div className="text-xs font-mono font-bold text-amber-300 mt-0.5">
              {formatMoney(totalCuentasCobrar)}
            </div>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-amber-400" />
      </div>

      {/* Billeteras & Cuentas Carousel */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">Mis Cuentas & Billeteras</h2>
          <button
            onClick={() => onSelectTab('accounts')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer"
          >
            Ver todas
          </button>
        </div>

        <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-1 px-1 no-scrollbar">
          {accounts.slice(0, 6).map((account) => (
            <div
              key={account.id}
              onClick={() => onSelectTab('accounts')}
              className="w-36 shrink-0 p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${account.color}20` }}
                >
                  {getAccountIcon(account.icon)}
                </div>
                <span className="text-[10px] font-bold text-slate-400 font-mono">
                  {account.moneda}
                </span>
              </div>
              <div>
                <p className="text-[11px] text-slate-300 truncate font-medium">{account.nombre}</p>
                <p className="text-xs font-bold text-white font-mono mt-0.5">
                  {account.moneda === 'VES'
                    ? `Bs. ${account.saldo.toLocaleString('es-VE', { maximumFractionDigits: 0 })}`
                    : `$ ${account.saldo.toFixed(2)}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gastos Recientes (from user sheet) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">Últimos Movimientos</h2>
          <button
            onClick={() => onSelectTab('transactions')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer"
          >
            Historial
          </button>
        </div>

        <div className="space-y-1.5">
          {transactions.slice(0, 5).map((tx) => (
            <div
              key={tx.id}
              className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between hover:bg-slate-900 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    tx.tipo === 'Egreso' ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'
                  }`}
                >
                  {tx.tipo === 'Egreso' ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{tx.concepto}</p>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <span className="text-emerald-400/80 font-medium">{tx.categoria}</span>
                    <span>•</span>
                    <span>{tx.fecha.slice(5)}</span>
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div
                  className={`text-xs font-bold font-mono ${
                    tx.tipo === 'Egreso' ? 'text-white' : 'text-emerald-400'
                  }`}
                >
                  {tx.tipo === 'Egreso' ? '-' : '+'} $ {tx.montoUSD.toFixed(2)}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  Bs. {tx.montoBs.toLocaleString('es-VE', { maximumFractionDigits: 0 })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Design Preview Banner (Answers: "Ojo quiero ver el diseño en imagen primero") */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/40 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">¿Quieres ver el diseño visual en imagen?</p>
            <p className="text-[11px] text-slate-400">Ver mockups HD generados para tu celular</p>
          </div>
        </div>
        <button
          onClick={onOpenDesignModal}
          className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-md shadow-emerald-500/20"
        >
          Ver Mockup
        </button>
      </div>
    </div>
  );
};
