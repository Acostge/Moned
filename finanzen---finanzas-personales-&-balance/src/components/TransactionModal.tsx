import React, { useState } from 'react';
import { X, ArrowDownRight, ArrowUpRight, DollarSign, Calendar, Tag, CreditCard, FileText } from 'lucide-react';
import { Transaction, FinancialAccount, TransactionType } from '../types/finance';
import { INITIAL_EXPENSE_CATEGORIES } from '../data/initialFinanceData';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  tasaBCV: number;
  accounts: FinancialAccount[];
  initialType?: TransactionType;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onAddTransaction,
  tasaBCV,
  accounts,
  initialType = 'Egreso',
}) => {
  const [tipo, setTipo] = useState<TransactionType>(initialType);
  const [currencyMode, setCurrencyMode] = useState<'USD' | 'VES'>('USD');
  const [amountInput, setAmountInput] = useState<string>('');
  const [categoria, setCategoria] = useState<string>(INITIAL_EXPENSE_CATEGORIES[0].nombre);
  const [concepto, setConcepto] = useState<string>('');
  const [cuentaId, setCuentaId] = useState<string>(accounts[0]?.id || 'mercantil-bs');
  const [fecha, setFecha] = useState<string>(new Date().toISOString().split('T')[0]);
  const [comentarios, setComentarios] = useState<string>('');

  if (!isOpen) return null;

  const rawAmount = parseFloat(amountInput) || 0;
  const montoUSD = currencyMode === 'USD' ? rawAmount : (rawAmount > 0 && tasaBCV > 0 ? +(rawAmount / tasaBCV).toFixed(2) : 0);
  const montoBs = currencyMode === 'VES' ? rawAmount : +(rawAmount * tasaBCV).toFixed(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (montoUSD <= 0) return;

    onAddTransaction({
      ano: new Date(fecha).getFullYear() || 2026,
      fecha,
      tipo,
      categoria,
      concepto: concepto.trim() || (tipo === 'Egreso' ? 'Gasto registrado' : 'Ingreso registrado'),
      montoUSD,
      tasaBs: tasaBCV,
      montoBs,
      cuentaId,
      comentarios: comentarios.trim() || undefined,
    });

    setAmountInput('');
    setConcepto('');
    setComentarios('');
    onClose();
  };

  const quickConcepts = tipo === 'Egreso'
    ? ['Compras en Gama', 'Compras en Unicasa', 'Recarga Movistar', 'Recarga Metro', 'Pago de Netflix', 'Mototaxi WM', 'Mango Bajito']
    : ['Ingresos Mami por Ropa', 'Retorno de Inversión', 'Bono de Desempeño', 'Reembolso'];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${tipo === 'Egreso' ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
              {tipo === 'Egreso' ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {tipo === 'Egreso' ? 'Registrar Gasto' : 'Registrar Ingreso'}
              </h3>
              <p className="text-xs text-slate-400">
                Tasa BCV del día: <span className="text-emerald-400 font-medium">Bs. {tasaBCV.toLocaleString('es-VE')}</span>
              </p>
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
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* Tipo Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => setTipo('Egreso')}
              className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                tipo === 'Egreso'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ArrowDownRight className="w-4 h-4 text-rose-400" />
              Gasto (Egreso)
            </button>
            <button
              type="button"
              onClick={() => setTipo('Ingreso')}
              className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                tipo === 'Ingreso'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ArrowUpRight className="w-4 h-4 text-emerald-400" />
              Ingreso (+)
            </button>
          </div>

          {/* Amount Input with Currency Switcher */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-medium">Monto</span>
              <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700">
                <button
                  type="button"
                  onClick={() => setCurrencyMode('USD')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                    currencyMode === 'USD' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  $ USD
                </button>
                <button
                  type="button"
                  onClick={() => setCurrencyMode('VES')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                    currencyMode === 'VES' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Bs.
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                {currencyMode === 'USD' ? <DollarSign className="w-5 h-5 text-emerald-400" /> : <span className="text-sm font-bold text-emerald-400">Bs.</span>}
              </div>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="0.00"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-2xl py-3 pl-12 pr-4 text-xl font-bold text-white placeholder-slate-600 focus:outline-none transition-colors"
                autoFocus
              />
            </div>

            {/* Realtime conversion preview */}
            {rawAmount > 0 && (
              <div className="flex items-center justify-between px-2 py-1 text-xs text-slate-400 bg-slate-950/40 rounded-xl border border-slate-800/60">
                <span>Equivalente en {currencyMode === 'USD' ? 'Bolívares (BCV)' : 'Dólares ($)'}:</span>
                <span className="font-bold text-emerald-400">
                  {currencyMode === 'USD'
                    ? `Bs. ${montoBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    : `$ ${montoUSD.toFixed(2)} USD`}
                </span>
              </div>
            )}
          </div>

          {/* Categoría */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              Categoría
            </label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-2xl py-2.5 px-3.5 text-sm text-white focus:outline-none transition-colors"
            >
              {INITIAL_EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat.nombre} value={cat.nombre}>
                  {cat.nombre}
                </option>
              ))}
              {tipo === 'Ingreso' && (
                <>
                  <option value="Sueldo / Salario">Sueldo / Salario</option>
                  <option value="Retorno de Inversión">Retorno de Inversión</option>
                  <option value="Reembolsos">Reembolsos</option>
                  <option value="Bonos">Bonos</option>
                  <option value="Cobranzas">Cobranzas Recibidas</option>
                </>
              )}
            </select>
          </div>

          {/* Concepto / Descripción */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              Concepto / Detalle
            </label>
            <input
              type="text"
              placeholder="Ej. Compras en Gama, Pago Netflix, etc."
              value={concepto}
              onChange={(e) => setConcepto(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-2xl py-2.5 px-3.5 text-sm text-white placeholder-slate-600 focus:outline-none transition-colors"
              required
            />
            {/* Quick chips */}
            <div className="flex gap-1.5 overflow-x-auto pt-1 pb-0.5 no-scrollbar">
              {quickConcepts.slice(0, 4).map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => setConcepto(tag)}
                  className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white shrink-0 cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Cuenta / Origen */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                Cuenta / Billetera
              </label>
              <select
                value={cuentaId}
                onChange={(e) => setCuentaId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-2xl py-2 px-3 text-xs text-white focus:outline-none transition-colors"
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.nombre} ({acc.moneda})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Fecha
              </label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-2xl py-2 px-3 text-xs text-white focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={montoUSD <= 0}
              className={`w-full py-3.5 rounded-2xl font-bold text-sm shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 ${
                montoUSD > 0
                  ? tipo === 'Egreso'
                    ? 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/25'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/25'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <span>{tipo === 'Egreso' ? 'Guardar Gasto' : 'Guardar Ingreso'}</span>
              {montoUSD > 0 && <span className="font-mono">($ {montoUSD.toFixed(2)})</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
