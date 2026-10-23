import React, { useState } from 'react';
import { PieChart, TrendingUp, ArrowDownRight, ArrowUpRight, Calendar, Filter, Sparkles } from 'lucide-react';
import { INITIAL_EXPENSE_CATEGORIES, INITIAL_MONTHS_2026, HISTORICAL_ANNUAL_DATA } from '../../data/initialFinanceData';

interface AnalyticsTabProps {
  tasaBCV: number;
  currencyDisplay: 'USD' | 'VES' | 'DUAL';
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ tasaBCV, currencyDisplay }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'2026' | 'historico'>('2026');
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // Compute category totals based on period
  const categoriesWithValues = INITIAL_EXPENSE_CATEGORIES.map((c) => ({
    nombre: c.nombre,
    totalUSD: selectedPeriod === '2026' ? c.total2026 : c.totalHistorico,
    color: c.color,
  })).sort((a, b) => b.totalUSD - a.totalUSD);

  const grandTotal = categoriesWithValues.reduce((sum, c) => sum + c.totalUSD, 0);

  // Compute SVG Donut Chart Paths
  let accumulatedAngle = 0;
  const radius = 64;
  const strokeWidth = 24;
  const circumference = 2 * Math.PI * radius;

  const donutSlices = categoriesWithValues.slice(0, 7).map((cat) => {
    const percentage = grandTotal > 0 ? (cat.totalUSD / grandTotal) : 0;
    const strokeDasharray = `${percentage * circumference} ${circumference}`;
    const strokeDashoffset = -accumulatedAngle * circumference;
    accumulatedAngle += percentage;
    return {
      ...cat,
      percentage: (percentage * 100).toFixed(1),
      strokeDasharray,
      strokeDashoffset,
    };
  });

  const formatMoney = (usd: number) => {
    if (currencyDisplay === 'VES') {
      return `Bs. ${(usd * tasaBCV).toLocaleString('es-VE', { maximumFractionDigits: 0 })}`;
    }
    return `$ ${usd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Tab Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-[11px] font-semibold tracking-wider uppercase text-emerald-400">
            Analítica de Gastos
          </span>
          <h1 className="text-xl font-extrabold text-white tracking-tight">Categorías & Tendencias</h1>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setSelectedPeriod('2026')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedPeriod === '2026' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Año 2026
          </button>
          <button
            onClick={() => setSelectedPeriod('historico')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedPeriod === 'historico' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Histórico Total
          </button>
        </div>
      </div>

      {/* Donut Chart Visual Card */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <PieChart className="w-4 h-4 text-emerald-400" />
            Distribución del Gasto ({selectedPeriod === '2026' ? '2026' : 'Acumulado 2019-2026'})
          </span>
          <span className="text-xs font-bold font-mono text-emerald-400">
            {formatMoney(grandTotal)}
          </span>
        </div>

        {/* Circular Donut Graphic */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="text-slate-800"
                strokeWidth={strokeWidth}
                stroke="currentColor"
                fill="transparent"
              />
              {donutSlices.map((slice) => (
                <circle
                  key={slice.nombre}
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke={slice.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={slice.strokeDasharray}
                  strokeDashoffset={slice.strokeDashoffset}
                  fill="transparent"
                  className="transition-all duration-300 hover:opacity-80"
                  onMouseEnter={() => setHoveredCategory(slice.nombre)}
                  onMouseLeave={() => setHoveredCategory(null)}
                />
              ))}
            </svg>

            {/* Donut Center Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2 pointer-events-none">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">
                {hoveredCategory || 'Mayor Gasto'}
              </span>
              <span className="text-sm font-extrabold text-white font-mono leading-tight">
                {hoveredCategory
                  ? formatMoney(categoriesWithValues.find((c) => c.nombre === hoveredCategory)?.totalUSD || 0)
                  : `${donutSlices[0]?.percentage}%`}
              </span>
              <span className="text-[10px] text-emerald-400 font-medium truncate max-w-[100px]">
                {hoveredCategory ? '' : donutSlices[0]?.nombre}
              </span>
            </div>
          </div>

          {/* Top 4 Legend Quick Pill List */}
          <div className="grid grid-cols-2 gap-2 w-full sm:w-auto">
            {donutSlices.slice(0, 6).map((item) => (
              <div
                key={item.nombre}
                className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2"
              >
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-white truncate">{item.nombre}</div>
                  <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between gap-1">
                    <span>{item.percentage}%</span>
                    <span className="font-semibold text-slate-300">{formatMoney(item.totalUSD)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mes a Mes 2026 (Ingresos vs Egresos) */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-white">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>Movimiento Mensual 2026 (Ingresos vs Egresos)</span>
          </div>
          <div className="flex items-center gap-3 text-[10px]">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded bg-emerald-500"></span> Ingresos
            </span>
            <span className="flex items-center gap-1 text-rose-400 font-medium">
              <span className="w-2 h-2 rounded bg-rose-500"></span> Egresos
            </span>
          </div>
        </div>

        {/* Bar chart comparison */}
        <div className="space-y-2 pt-1">
          {INITIAL_MONTHS_2026.map((m) => {
            const maxVal = 4200;
            const ingPct = Math.min(100, (m.ingresoTotal / maxVal) * 100);
            const egPct = Math.min(100, (m.egresos / maxVal) * 100);
            return (
              <div key={m.mes} className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-300 w-8">{m.mes}</span>
                  <div className="flex items-center gap-3 font-mono text-[10px]">
                    <span className="text-emerald-400">$ {m.ingresoTotal.toFixed(0)}</span>
                    <span className="text-rose-400">$ {m.egresos.toFixed(0)}</span>
                    <span
                      className={`font-bold ${
                        m.balanceNeto >= 0 ? 'text-emerald-300' : 'text-rose-300'
                      }`}
                    >
                      {m.balanceNeto >= 0 ? '+' : ''}$ {m.balanceNeto.toFixed(0)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-1 h-2 bg-slate-950 rounded-full overflow-hidden p-0.5">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${ingPct}%` }}
                    title={`Ingreso: $${m.ingresoTotal}`}
                  ></div>
                  <div
                    className="h-full bg-rose-500 rounded-full transition-all duration-500"
                    style={{ width: `${egPct}%` }}
                    title={`Egreso: $${m.egresos}`}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detalle Completo de Categorías */}
      <div className="space-y-2">
        <h2 className="text-sm font-bold text-white">Todas las Categorías de Gasto</h2>
        <div className="space-y-2">
          {categoriesWithValues.map((cat, idx) => {
            const pct = grandTotal > 0 ? (cat.totalUSD / grandTotal) * 100 : 0;
            return (
              <div
                key={cat.nombre}
                className="p-3 rounded-2xl bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-500 font-bold w-4">
                      {idx + 1}
                    </span>
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }}></div>
                    <span className="font-bold text-white">{cat.nombre}</span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="font-bold text-white text-xs">{formatMoney(cat.totalUSD)}</span>
                    <span className="text-[10px] text-slate-400 ml-1.5 font-sans">({pct.toFixed(1)}%)</span>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: cat.color }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Histórico Comparativo Anual (2019 - 2026) */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white">Promedios Históricos Anuales</span>
          <span className="text-[10px] text-slate-400">Desde 2019 hasta 2026</span>
        </div>

        <div className="space-y-2">
          {HISTORICAL_ANNUAL_DATA.map((h) => (
            <div
              key={h.ano}
              className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="font-bold text-white font-mono">{h.ano}</span>
                <span className="text-[10px] text-slate-400">
                  Total: $ {h.ingresos.toLocaleString()} / $ {h.egresos.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span className="text-emerald-400 font-semibold">
                  +${h.promIngreso.toFixed(0)}/mes
                </span>
                <span className="text-rose-400 font-semibold">
                  -${h.promEgreso.toFixed(0)}/mes
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
