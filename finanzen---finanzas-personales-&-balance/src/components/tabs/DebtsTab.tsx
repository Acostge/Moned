import React, { useState } from 'react';
import {
  CreditCard,
  Coins,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { CuentaPorCobrar, DeudaPorPagar } from '../../types/finance';

interface DebtsTabProps {
  tasaBCV: number;
  cuentasCobrar: CuentaPorCobrar[];
  deudasPagar: DeudaPorPagar[];
  currencyDisplay: 'USD' | 'VES' | 'DUAL';
  onMarkAsPaid: (id: string, type: 'cobrar' | 'pagar') => void;
  onAddDebtOrReceivable: (item: any, type: 'cobrar' | 'pagar') => void;
}

export const DebtsTab: React.FC<DebtsTabProps> = ({
  tasaBCV,
  cuentasCobrar,
  deudasPagar,
  currencyDisplay,
  onMarkAsPaid,
}) => {
  const [activeSubtab, setActiveSubtab] = useState<'cobrar' | 'cashea' | 'deudas' | 'blacklist'>('cobrar');
  const [searchQuery, setSearchQuery] = useState('');

  const regularCxC = cuentasCobrar.filter((c) => !c.isBlacklist);
  const blacklistCxC = cuentasCobrar.filter((c) => c.isBlacklist);
  const casheaDeudas = deudasPagar.filter((d) => d.tipo === 'cashea' || d.tipo === 'inversion');
  const cashDeudas = deudasPagar.filter((d) => d.tipo !== 'cashea' && d.tipo !== 'inversion');

  const totalRegularCxC = regularCxC.reduce((sum, c) => sum + (c.status === 'pendiente' ? c.montoUSD : 0), 0);
  const totalBlacklistCxC = blacklistCxC.reduce((sum, c) => sum + (c.status === 'pendiente' ? c.montoUSD : 0), 0);
  const totalCashea = casheaDeudas.reduce((sum, d) => sum + d.montoUSD, 0);
  const totalCashDeudas = cashDeudas.reduce((sum, d) => sum + d.montoUSD, 0);

  const formatMoney = (usd: number) => {
    if (currencyDisplay === 'VES') {
      return `Bs. ${(usd * tasaBCV).toLocaleString('es-VE', { maximumFractionDigits: 0 })}`;
    }
    return `$ ${usd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-[11px] font-semibold tracking-wider uppercase text-emerald-400">
            Control de Flujos
          </span>
          <h1 className="text-xl font-extrabold text-white tracking-tight">Cobranzas & Deudas</h1>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-400 block font-medium">Balance Neto</span>
          <span
            className={`text-sm font-bold font-mono ${
              totalRegularCxC - (totalCashea + totalCashDeudas) >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {formatMoney(totalRegularCxC - (totalCashea + totalCashDeudas))}
          </span>
        </div>
      </div>

      {/* Top 2 Highlight Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3.5 rounded-3xl bg-emerald-950/30 border border-emerald-500/30">
          <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-medium mb-1">
            <Coins className="w-4 h-4 text-emerald-400" />
            <span>Por Cobrar Activo</span>
          </div>
          <div className="text-lg font-extrabold text-white font-mono">
            {formatMoney(totalRegularCxC)}
          </div>
          <p className="text-[10px] text-emerald-400/80 mt-0.5">
            {regularCxC.filter((c) => c.status === 'pendiente').length} personas activas
          </p>
        </div>

        <div className="p-3.5 rounded-3xl bg-rose-950/30 border border-rose-500/30">
          <div className="flex items-center gap-1.5 text-xs text-rose-300 font-medium mb-1">
            <CreditCard className="w-4 h-4 text-rose-400" />
            <span>Por Pagar Total</span>
          </div>
          <div className="text-lg font-extrabold text-white font-mono">
            {formatMoney(totalCashea + totalCashDeudas)}
          </div>
          <p className="text-[10px] text-rose-400/80 mt-0.5">
            Cashea: {formatMoney(totalCashea)}
          </p>
        </div>
      </div>

      {/* Subtabs Pill Selector */}
      <div className="flex gap-1.5 p-1 bg-slate-900 rounded-2xl border border-slate-800 text-xs overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveSubtab('cobrar')}
          className={`flex-1 min-w-[100px] py-2 px-2.5 rounded-xl text-center font-bold transition-all cursor-pointer ${
            activeSubtab === 'cobrar'
              ? 'bg-emerald-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          x Cobrar (${totalRegularCxC.toFixed(0)})
        </button>

        <button
          onClick={() => setActiveSubtab('cashea')}
          className={`flex-1 min-w-[100px] py-2 px-2.5 rounded-xl text-center font-bold transition-all cursor-pointer ${
            activeSubtab === 'cashea'
              ? 'bg-emerald-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Cashea & Créditos
        </button>

        <button
          onClick={() => setActiveSubtab('deudas')}
          className={`flex-1 min-w-[90px] py-2 px-2.5 rounded-xl text-center font-bold transition-all cursor-pointer ${
            activeSubtab === 'deudas'
              ? 'bg-emerald-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          TDC & Bancos
        </button>

        <button
          onClick={() => setActiveSubtab('blacklist')}
          className={`flex-1 min-w-[85px] py-2 px-2.5 rounded-xl text-center font-bold transition-all cursor-pointer ${
            activeSubtab === 'blacklist'
              ? 'bg-rose-500 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Blacklist ({blacklistCxC.length})
        </button>
      </div>

      {/* Section 1: Cuentas Por Cobrar Activas */}
      {activeSubtab === 'cobrar' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Personas que te deben (Préstamos acordados)</span>
            <span className="font-mono font-bold text-emerald-400">{formatMoney(totalRegularCxC)}</span>
          </div>

          <div className="space-y-2">
            {regularCxC.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors flex items-center justify-between"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{item.nombre}</span>
                    {item.status === 'cobrado' && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                        Cobrado
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{item.observaciones}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right font-mono">
                    <div className="text-sm font-bold text-emerald-400">{formatMoney(item.montoUSD)}</div>
                    <div className="text-[10px] text-slate-500">
                      Bs. {(item.montoUSD * tasaBCV).toLocaleString('es-VE', { maximumFractionDigits: 0 })}
                    </div>
                  </div>

                  <button
                    onClick={() => onMarkAsPaid(item.id, 'cobrar')}
                    className={`p-2 rounded-xl transition-colors cursor-pointer ${
                      item.status === 'cobrado'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-400'
                    }`}
                    title={item.status === 'cobrado' ? 'Marcar como pendiente' : 'Marcar como cobrado'}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 2: Cashea & Créditos de Inversión */}
      {activeSubtab === 'cashea' && (
        <div className="space-y-3">
          <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-950/40 via-purple-950/30 to-slate-900 border border-purple-500/30 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-white">Créditos Cashea y Fondos de Inversión</p>
              <p className="text-[11px] text-slate-400">Total comprometido por pagar</p>
            </div>
            <span className="text-sm font-extrabold text-purple-400 font-mono">
              {formatMoney(totalCashea)}
            </span>
          </div>

          <div className="space-y-2.5">
            {casheaDeudas.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{item.nombre}</span>
                      <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 text-[10px] font-bold">
                        {item.tipo.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{item.observaciones}</p>
                  </div>
                  <div className="text-right font-mono">
                    <div className="text-sm font-bold text-rose-400">{formatMoney(item.montoUSD)}</div>
                    <div className="text-[10px] text-slate-500">
                      Bs. {(item.montoUSD * tasaBCV).toLocaleString('es-VE', { maximumFractionDigits: 0 })}
                    </div>
                  </div>
                </div>

                {/* Cashea cuotas progress if applicable */}
                {item.cuotas && (
                  <div className="pt-2 border-t border-slate-800/80 space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>
                        Cuotas pagadas: <strong className="text-white">{item.cuotas.pagadas}</strong> de {item.cuotas.total}
                      </span>
                      <span>Monto por cuota: <strong className="text-white font-mono">${item.cuotas.montoCuota.toFixed(2)}</strong></span>
                    </div>
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden flex gap-1 p-0.5">
                      {Array.from({ length: item.cuotas.total }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-full flex-1 rounded-full ${
                            i < item.cuotas!.pagadas ? 'bg-emerald-500' : 'bg-slate-800'
                          }`}
                        ></div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 3: Deudas en Cash & Tarjetas de Crédito */}
      {activeSubtab === 'deudas' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Tarjetas de crédito y préstamos bancarios</span>
            <span className="font-mono font-bold text-rose-400">{formatMoney(totalCashDeudas)}</span>
          </div>

          <div className="space-y-2">
            {cashDeudas.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{item.nombre}</span>
                    <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 text-[10px] font-bold">
                      {item.tipo.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{item.observaciones}</p>
                </div>

                <div className="text-right font-mono">
                  <div className="text-sm font-bold text-rose-400">{formatMoney(item.montoUSD)}</div>
                  <div className="text-[10px] text-slate-500">
                    Bs. {(item.montoUSD * tasaBCV).toLocaleString('es-VE', { maximumFractionDigits: 0 })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 4: Blacklist (Deudores en mora) */}
      {activeSubtab === 'blacklist' && (
        <div className="space-y-3">
          <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/40 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-rose-300">Préstamos en Cash (Blacklist)</p>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Total deudor en mora: <strong className="text-white font-mono">{formatMoney(totalBlacklistCxC)}</strong>. Registros antiguos o con riesgo de incobrabilidad.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {blacklistCxC.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800/80 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{item.nombre}</span>
                    <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 text-[10px] font-bold">
                      Moroso
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{item.observaciones}</p>
                </div>

                <div className="text-right font-mono">
                  <div className="text-sm font-bold text-rose-400 font-bold">{formatMoney(item.montoUSD)}</div>
                  <div className="text-[10px] text-slate-500">
                    Bs. {(item.montoUSD * tasaBCV).toLocaleString('es-VE', { maximumFractionDigits: 0 })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
