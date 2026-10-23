import React, { useState } from 'react';
import {
  Wallet,
  Building,
  CreditCard,
  Banknote,
  Coins,
  Sparkles,
  ArrowRightLeft,
  Plus,
  TrendingUp,
  ShieldCheck,
  Edit2,
  Check,
} from 'lucide-react';
import { FinancialAccount } from '../../types/finance';

interface AccountsTabProps {
  tasaBCV: number;
  accounts: FinancialAccount[];
  onUpdateAccountBalance: (id: string, newBalance: number) => void;
  currencyDisplay: 'USD' | 'VES' | 'DUAL';
}

export const AccountsTab: React.FC<AccountsTabProps> = ({
  tasaBCV,
  accounts,
  onUpdateAccountBalance,
  currencyDisplay,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const totalUSD = accounts.reduce((sum, a) => sum + a.saldoUSD, 0);
  const totalVES = accounts.reduce((sum, a) => {
    return sum + (a.moneda === 'VES' ? a.saldo : a.saldoUSD * tasaBCV);
  }, 0);

  const startEdit = (acc: FinancialAccount) => {
    setEditingId(acc.id);
    setEditValue(acc.saldo.toString());
  };

  const saveEdit = (id: string) => {
    const val = parseFloat(editValue);
    if (!isNaN(val)) {
      onUpdateAccountBalance(id, val);
    }
    setEditingId(null);
  };

  const digitalAccounts = accounts.filter((a) => a.tipo === 'digital' || a.tipo === 'crypto');
  const bankAccounts = accounts.filter((a) => a.tipo === 'banco_bs');
  const cashAccounts = accounts.filter((a) => a.tipo === 'efectivo');

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
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-[11px] font-semibold tracking-wider uppercase text-emerald-400">
            Patrimonio Líquido
          </span>
          <h1 className="text-xl font-extrabold text-white tracking-tight">Activos & Billeteras</h1>
        </div>
      </div>

      {/* Main Liquidity Card */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950/40 border border-teal-500/30 shadow-xl space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold uppercase tracking-wider">Total Liquidez Disponible</span>
          <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-mono text-[10px] font-bold">
            {accounts.length} Cuentas
          </span>
        </div>

        <div className="text-3xl font-extrabold text-white font-mono">
          $ {totalUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className="text-xs text-slate-400 font-mono">
          ≈ Bs. {totalVES.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} al cambio oficial
        </div>

        {/* Intangible Capital reminder from Excel */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">Capital Intangible Registrado:</span>
          <span className="font-mono font-bold text-teal-400">$ 328,56</span>
        </div>
      </div>

      {/* Group 1: Efectivo Físico */}
      <div className="space-y-2">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
          Efectivo en Mano ({cashAccounts.length})
        </h2>
        <div className="space-y-2">
          {cashAccounts.map((acc) => (
            <div
              key={acc.id}
              className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${acc.color}20` }}
                >
                  {getAccountIcon(acc.icon)}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{acc.nombre}</div>
                  <div className="text-[11px] text-slate-400">
                    Moneda:{' '}
                    <span className="font-semibold text-slate-300 font-mono">{acc.moneda}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {editingId === acc.id ? (
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      step="0.01"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-24 bg-slate-950 border border-emerald-500 rounded-lg px-2 py-1 text-xs text-white font-mono"
                      autoFocus
                    />
                    <button
                      onClick={() => saveEdit(acc.id)}
                      className="p-1 rounded-lg bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="text-right">
                    <div className="text-sm font-bold text-white font-mono">
                      {acc.moneda === 'VES'
                        ? `Bs. ${acc.saldo.toLocaleString('es-VE')}`
                        : acc.moneda === 'EUR'
                        ? `€ ${acc.saldo.toFixed(2)}`
                        : `$ ${acc.saldo.toFixed(2)}`}
                    </div>
                    {acc.moneda !== 'USD' && (
                      <div className="text-[10px] text-emerald-400 font-mono">
                        ≈ $ {acc.saldoUSD.toFixed(2)} USD
                      </div>
                    )}
                  </div>
                )}
                <button
                  onClick={() => startEdit(acc)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Group 2: Billeteras Digitales & Crypto */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Billeteras Digitales & Apps
          </h2>
          <span className="text-xs font-mono font-bold text-emerald-400">
            Total: $ {digitalAccounts.reduce((sum, a) => sum + a.saldoUSD, 0).toFixed(2)}
          </span>
        </div>
        <div className="space-y-2">
          {digitalAccounts.map((acc) => (
            <div
              key={acc.id}
              className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${acc.color}20` }}
                >
                  {getAccountIcon(acc.icon)}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{acc.nombre}</div>
                  <div className="text-[11px] text-slate-400">
                    Titular: <span className="text-slate-300">{acc.titular || 'Personal'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {editingId === acc.id ? (
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      step="0.01"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-24 bg-slate-950 border border-emerald-500 rounded-lg px-2 py-1 text-xs text-white font-mono"
                      autoFocus
                    />
                    <button
                      onClick={() => saveEdit(acc.id)}
                      className="p-1 rounded-lg bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="text-right">
                    <div className="text-sm font-bold text-white font-mono">
                      $ {acc.saldo.toFixed(2)}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Bs. {(acc.saldo * tasaBCV).toLocaleString('es-VE', { maximumFractionDigits: 0 })}
                    </div>
                  </div>
                )}
                <button
                  onClick={() => startEdit(acc)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Group 3: Cuentas Bancarias en Bolívares */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Bancos en Venezuela (Bs.)
          </h2>
          <span className="text-xs font-mono font-bold text-emerald-400">
            Total: $ {bankAccounts.reduce((sum, a) => sum + a.saldoUSD, 0).toFixed(2)}
          </span>
        </div>
        <div className="space-y-2">
          {bankAccounts.map((acc) => (
            <div
              key={acc.id}
              className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${acc.color}20` }}
                >
                  {getAccountIcon(acc.icon)}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{acc.nombre}</div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    ≈ $ {acc.saldoUSD.toFixed(2)} USD
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {editingId === acc.id ? (
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      step="0.01"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-28 bg-slate-950 border border-emerald-500 rounded-lg px-2 py-1 text-xs text-white font-mono"
                      autoFocus
                    />
                    <button
                      onClick={() => saveEdit(acc.id)}
                      className="p-1 rounded-lg bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="text-right">
                    <div className="text-sm font-bold text-white font-mono">
                      Bs. {acc.saldo.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                )}
                <button
                  onClick={() => startEdit(acc)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
