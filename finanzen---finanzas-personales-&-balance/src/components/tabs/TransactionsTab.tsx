import React, { useState } from 'react';
import {
  Search,
  Filter,
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  Tag,
  DollarSign,
  Plus,
  Trash2,
} from 'lucide-react';
import { Transaction, TransactionType } from '../../types/finance';
import { INITIAL_EXPENSE_CATEGORIES } from '../../data/initialFinanceData';

interface TransactionsTabProps {
  transactions: Transaction[];
  tasaBCV: number;
  onOpenTransactionModal: (type: TransactionType) => void;
  onDeleteTransaction: (id: string) => void;
  currencyDisplay: 'USD' | 'VES' | 'DUAL';
}

export const TransactionsTab: React.FC<TransactionsTabProps> = ({
  transactions,
  tasaBCV,
  onOpenTransactionModal,
  onDeleteTransaction,
  currencyDisplay,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'Egreso' | 'Ingreso'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.concepto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.categoria.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'ALL' || t.tipo === typeFilter;
    const matchesCategory = categoryFilter === 'ALL' || t.categoria === categoryFilter;
    return matchesSearch && matchesType && matchesCategory;
  });

  const totalGastosUSD = filteredTransactions
    .filter((t) => t.tipo === 'Egreso')
    .reduce((sum, t) => sum + t.montoUSD, 0);

  const totalIngresosUSD = filteredTransactions
    .filter((t) => t.tipo === 'Ingreso')
    .reduce((sum, t) => sum + t.montoUSD, 0);

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
            Relación de Gastos
          </span>
          <h1 className="text-xl font-extrabold text-white tracking-tight">Historial de Movimientos</h1>
        </div>

        <button
          onClick={() => onOpenTransactionModal('Egreso')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nuevo</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute inset-y-0 left-0 pl-3 w-4 h-4 text-slate-400 flex items-center pointer-events-none my-auto" />
          <input
            type="text"
            placeholder="Buscar por concepto o categoría..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-2xl py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
          <button
            onClick={() => setTypeFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl font-medium shrink-0 cursor-pointer ${
              typeFilter === 'ALL'
                ? 'bg-slate-700 text-white font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Todos ({transactions.length})
          </button>
          <button
            onClick={() => setTypeFilter('Egreso')}
            className={`px-3 py-1.5 rounded-xl font-medium shrink-0 cursor-pointer ${
              typeFilter === 'Egreso'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-rose-300'
            }`}
          >
            Gastos (-)
          </button>
          <button
            onClick={() => setTypeFilter('Ingreso')}
            className={`px-3 py-1.5 rounded-xl font-medium shrink-0 cursor-pointer ${
              typeFilter === 'Ingreso'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-emerald-300'
            }`}
          >
            Ingresos (+)
          </button>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-300 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none shrink-0"
          >
            <option value="ALL">Todas las Categorías</option>
            {INITIAL_EXPENSE_CATEGORIES.map((cat) => (
              <option key={cat.nombre} value={cat.nombre}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filtered Totals Bar */}
      <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs font-mono">
        <span className="text-slate-400 font-sans">
          {filteredTransactions.length} movimiento(s)
        </span>
        <div className="flex items-center gap-3">
          {totalGastosUSD > 0 && (
            <span className="text-rose-400 font-bold">
              Egresos: -{formatMoney(totalGastosUSD)}
            </span>
          )}
          {totalIngresosUSD > 0 && (
            <span className="text-emerald-400 font-bold">
              Ingresos: +{formatMoney(totalIngresosUSD)}
            </span>
          )}
        </div>
      </div>

      {/* Transaction List */}
      <div className="space-y-2">
        {filteredTransactions.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs rounded-2xl bg-slate-900/40 border border-slate-800">
            No se encontraron movimientos con esos filtros.
          </div>
        ) : (
          filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    tx.tipo === 'Egreso'
                      ? 'bg-rose-500/10 text-rose-400'
                      : 'bg-emerald-500/10 text-emerald-400'
                  }`}
                >
                  {tx.tipo === 'Egreso' ? (
                    <ArrowDownRight className="w-5 h-5" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-bold text-white truncate">
                    {tx.concepto}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                    <span className="text-emerald-400/90 font-medium">{tx.categoria}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {tx.fecha}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <div className="text-right font-mono">
                  <div
                    className={`text-xs sm:text-sm font-bold ${
                      tx.tipo === 'Egreso' ? 'text-white' : 'text-emerald-400'
                    }`}
                  >
                    {tx.tipo === 'Egreso' ? '-' : '+'}$ {tx.montoUSD.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Bs. {tx.montoBs.toLocaleString('es-VE', { maximumFractionDigits: 0 })}
                  </div>
                </div>

                <button
                  onClick={() => onDeleteTransaction(tx.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-all cursor-pointer"
                  title="Eliminar movimiento"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
