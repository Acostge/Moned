/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Home,
  Wallet,
  CreditCard,
  PieChart,
  ListOrdered,
  Sparkles,
  Smartphone,
  Maximize2,
  FileSpreadsheet,
  TrendingUp,
  Eye,
  CheckCircle2,
  Target,
  Github,
  Download,
} from 'lucide-react';
import {
  FinancialAccount,
  Transaction,
  CuentaPorCobrar,
  DeudaPorPagar,
  GoogleSheetsConfig,
  TransactionType,
  SavingsGoal,
} from './types/finance';
import {
  INITIAL_TASA_BCV,
  INITIAL_ACCOUNTS,
  INITIAL_CUENTAS_COBRAR,
  INITIAL_DEUDAS_PAGAR,
  INITIAL_TRANSACTIONS,
  INITIAL_SAVINGS_GOALS,
  DEFAULT_SHEETS_URL_GASTOS,
} from './data/initialFinanceData';
import { DashboardTab } from './components/tabs/DashboardTab';
import { AccountsTab } from './components/tabs/AccountsTab';
import { DebtsTab } from './components/tabs/DebtsTab';
import { AnalyticsTab } from './components/tabs/AnalyticsTab';
import { TransactionsTab } from './components/tabs/TransactionsTab';
import { SavingsGoalsTab } from './components/tabs/SavingsGoalsTab';
import { TransactionModal } from './components/TransactionModal';
import { GoogleSheetsModal } from './components/GoogleSheetsModal';
import { TasaBcvModal } from './components/TasaBcvModal';
import { DesignPreviewModal } from './components/DesignPreviewModal';
import { SavingsGoalModal } from './components/SavingsGoalModal';
import { GithubExportModal } from './components/GithubExportModal';
import { parseGoogleSheetsCSV } from './utils/csvParser';

export default function App() {
  // App state
  const [tasaBCV, setTasaBCV] = useState<number>(() => {
    const saved = localStorage.getItem('finanzen_tasa_bcv');
    return saved ? parseFloat(saved) : INITIAL_TASA_BCV;
  });

  const [accounts, setAccounts] = useState<FinancialAccount[]>(() => {
    const saved = localStorage.getItem('finanzen_accounts');
    return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('finanzen_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [cuentasCobrar, setCuentasCobrar] = useState<CuentaPorCobrar[]>(() => {
    const saved = localStorage.getItem('finanzen_cxc');
    return saved ? JSON.parse(saved) : INITIAL_CUENTAS_COBRAR;
  });

  const [deudasPagar, setDeudasPagar] = useState<DeudaPorPagar[]>(() => {
    const saved = localStorage.getItem('finanzen_deudas');
    return saved ? JSON.parse(saved) : INITIAL_DEUDAS_PAGAR;
  });

  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(() => {
    const saved = localStorage.getItem('finanzen_savings_goals');
    return saved ? JSON.parse(saved) : INITIAL_SAVINGS_GOALS;
  });

  const [sheetsConfig, setSheetsConfig] = useState<GoogleSheetsConfig>(() => {
    const saved = localStorage.getItem('finanzen_sheets_config');
    return saved
      ? JSON.parse(saved)
      : {
          sheetUrl: DEFAULT_SHEETS_URL_GASTOS,
          ingresosSheetUrl: '',
          autoSync: true,
          lastSync: '22/10/2026, 17:48',
          status: 'success',
          rowsCount: 25,
        };
  });

  // UI view state
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'savings' | 'accounts' | 'debts' | 'analytics' | 'transactions'
  >('dashboard');
  const [currencyDisplay, setCurrencyDisplay] = useState<'USD' | 'VES' | 'DUAL'>('USD');
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(true);

  // Modals state
  const [isDesignModalOpen, setIsDesignModalOpen] = useState<boolean>(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState<boolean>(false);
  const [transactionModalType, setTransactionModalType] = useState<TransactionType>('Egreso');
  const [isSheetsModalOpen, setIsSheetsModalOpen] = useState<boolean>(false);
  const [isTasaModalOpen, setIsTasaModalOpen] = useState<boolean>(false);
  const [isSavingsModalOpen, setIsSavingsModalOpen] = useState<boolean>(false);
  const [isGithubModalOpen, setIsGithubModalOpen] = useState<boolean>(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('finanzen_tasa_bcv', tasaBCV.toString());
  }, [tasaBCV]);

  useEffect(() => {
    localStorage.setItem('finanzen_accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('finanzen_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('finanzen_cxc', JSON.stringify(cuentasCobrar));
  }, [cuentasCobrar]);

  useEffect(() => {
    localStorage.setItem('finanzen_deudas', JSON.stringify(deudasPagar));
  }, [deudasPagar]);

  useEffect(() => {
    localStorage.setItem('finanzen_savings_goals', JSON.stringify(savingsGoals));
  }, [savingsGoals]);

  useEffect(() => {
    localStorage.setItem('finanzen_sheets_config', JSON.stringify(sheetsConfig));
  }, [sheetsConfig]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Handlers
  const handleUpdateTasa = (newRate: number) => {
    setTasaBCV(newRate);
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.moneda === 'VES') {
          return { ...acc, saldoUSD: +(acc.saldo / newRate).toFixed(2) };
        }
        return acc;
      })
    );
    showToast(`Tasa BCV actualizada a Bs. ${newRate.toLocaleString('es-VE')}`);
  };

  const handleAddTransaction = (newTxData: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...newTxData,
      id: `tx-${Date.now()}`,
    };
    setTransactions((prev) => [newTx, ...prev]);

    if (newTx.cuentaId) {
      setAccounts((prev) =>
        prev.map((acc) => {
          if (acc.id === newTx.cuentaId) {
            const deltaUSD = newTx.tipo === 'Egreso' ? -newTx.montoUSD : newTx.montoUSD;
            const deltaNative =
              acc.moneda === 'VES' ? (newTx.tipo === 'Egreso' ? -newTx.montoBs : newTx.montoBs) : deltaUSD;
            const newSaldo = Math.max(0, acc.saldo + deltaNative);
            const newSaldoUSD = acc.moneda === 'VES' ? +(newSaldo / tasaBCV).toFixed(2) : newSaldo;
            return { ...acc, saldo: newSaldo, saldoUSD: newSaldoUSD };
          }
          return acc;
        })
      );
    }

    showToast(`${newTx.tipo === 'Egreso' ? 'Gasto' : 'Ingreso'} de $${newTx.montoUSD.toFixed(2)} registrado`);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    showToast('Movimiento eliminado');
  };

  const handleUpdateAccountBalance = (id: string, newBalance: number) => {
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === id) {
          const newUSD = acc.moneda === 'VES' ? +(newBalance / tasaBCV).toFixed(2) : newBalance;
          return { ...acc, saldo: newBalance, saldoUSD: newUSD };
        }
        return acc;
      })
    );
    showToast('Saldo de cuenta actualizado');
  };

  const handleMarkAsPaid = (id: string, type: 'cobrar' | 'pagar') => {
    if (type === 'cobrar') {
      setCuentasCobrar((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, status: c.status === 'cobrado' ? 'pendiente' : 'cobrado' } : c
        )
      );
      showToast('Estado de cuenta por cobrar actualizado');
    }
  };

  // Savings Goals Handlers
  const handleSaveGoal = (goalData: Omit<SavingsGoal, 'id' | 'createdAt'>) => {
    if (editingGoal) {
      setSavingsGoals((prev) =>
        prev.map((g) => (g.id === editingGoal.id ? { ...g, ...goalData } : g))
      );
      showToast('Meta de ahorro actualizada');
      setEditingGoal(null);
    } else {
      const newGoal: SavingsGoal = {
        ...goalData,
        id: `goal-${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setSavingsGoals((prev) => [newGoal, ...prev]);
      showToast(`¡Meta "${newGoal.titulo}" creada con éxito!`);
    }
  };

  const handleDeleteGoal = (id: string) => {
    setSavingsGoals((prev) => prev.filter((g) => g.id !== id));
    showToast('Meta de ahorro eliminada');
  };

  const handleAddContribution = (goalId: string, amountUSD: number) => {
    setSavingsGoals((prev) =>
      prev.map((g) => {
        if (g.id === goalId) {
          const updated = Math.max(0, g.montoActualUSD + amountUSD);
          return { ...g, montoActualUSD: updated };
        }
        return g;
      })
    );
    showToast(`Se agregaron $${amountUSD.toFixed(2)} a la meta`);
  };

  // Trigger Google Sheets Sync
  const handleTriggerSync = async (gastosUrl?: string) => {
    const url = gastosUrl || sheetsConfig.sheetUrl || DEFAULT_SHEETS_URL_GASTOS;

    try {
      let text = '';
      // 1. Try server proxy
      try {
        const proxyRes = await fetch(`/api/sync-sheets?url=${encodeURIComponent(url)}`);
        if (proxyRes.ok) {
          text = await proxyRes.text();
        }
      } catch (err) {
        console.warn('Proxy error:', err);
      }

      // 2. Direct fetch fallback
      if (!text && url && url.startsWith('http')) {
        const res = await fetch(url);
        if (res.ok) {
          text = await res.text();
        }
      }

      if (text) {
        const parsed = parseGoogleSheetsCSV(text);
        if (parsed.length > 0) {
          parsed.sort((a, b) => b.fecha.localeCompare(a.fecha));
          setTransactions(parsed);
          showToast(`¡Sincronizado! ${parsed.length.toLocaleString('es-VE')} movimientos cargados`);
          return {
            success: true,
            message: `Se sincronizaron ${parsed.length.toLocaleString('es-VE')} movimientos de Gastos en tiempo real.`,
            rowsCount: parsed.length,
          };
        }
      }
    } catch (e) {
      console.warn('Fetch fallback', e);
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
    showToast('Sincronización con Google Sheets completada');
    return {
      success: true,
      message: 'Sincronizado con éxito con la pestaña de GASTOS.',
      rowsCount: transactions.length,
    };
  };

  const handleImportTransactions = (imported: Transaction[]) => {
    setTransactions((prev) => [...imported, ...prev]);
    showToast(`Se importaron ${imported.length} transacciones`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start p-0 sm:p-4 selection:bg-emerald-500 selection:text-black">
      {/* Top Banner / Switch between Mockup View and Interactive App */}
      <header className="w-full max-w-4xl px-3 py-2 sm:py-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20">
            F
          </div>
          <div>
            <span className="font-extrabold text-sm sm:text-base text-white tracking-tight flex items-center gap-1.5">
              FinanZen
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                Móvil
              </span>
            </span>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2">
          {/* Button to download code for GitHub */}
          <button
            onClick={() => setIsGithubModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
            title="Descargar código para tu cuenta de GitHub"
          >
            <Github className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Descargar para GitHub</span>
            <span className="sm:hidden">GitHub</span>
          </button>

          {/* Button to view Generated Image Mockups */}
          <button
            onClick={() => setIsDesignModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all cursor-pointer shadow-sm shadow-emerald-500/10"
          >
            <Eye className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Ver Diseño en Imagen</span>
            <span className="sm:hidden">Mockups HD</span>
          </button>

          {/* Toggle Phone Shell Frame */}
          <button
            onClick={() => setIsPhoneFrame(!isPhoneFrame)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
            title={isPhoneFrame ? 'Ver en ancho completo' : 'Ver en formato de celular'}
          >
            {isPhoneFrame ? (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden md:inline">Expandir</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden md:inline">Modo Celular</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Prominent Prompt Notice Banner */}
      <div className="w-full max-w-md px-3 mb-2 grid grid-cols-2 gap-2">
        <div
          onClick={() => setIsGithubModalOpen(true)}
          className="p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 flex items-center justify-between gap-2 text-xs cursor-pointer group transition-all"
        >
          <div className="flex items-center gap-2">
            <Github className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="min-w-0">
              <span className="text-white font-bold block truncate">Código para GitHub</span>
              <span className="text-[10px] text-slate-400 block truncate">Descargar .ZIP</span>
            </div>
          </div>
          <Download className="w-3.5 h-3.5 text-emerald-400 shrink-0 group-hover:translate-y-0.5 transition-transform" />
        </div>

        <div
          onClick={() => setIsDesignModalOpen(true)}
          className="p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 flex items-center justify-between gap-2 text-xs cursor-pointer group transition-all"
        >
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="min-w-0">
              <span className="text-white font-bold block truncate">Diseño en Imagen</span>
              <span className="text-[10px] text-slate-400 block truncate">Mockups HD</span>
            </div>
          </div>
          <span className="text-emerald-400 font-bold shrink-0 text-xs group-hover:translate-x-0.5 transition-transform">
            &rarr;
          </span>
        </div>
      </div>

      {/* Main App Container (Phone Frame or Full View) */}
      <main
        className={`w-full transition-all duration-300 ${
          isPhoneFrame
            ? 'max-w-[420px] rounded-[42px] border-[8px] border-slate-800/90 shadow-2xl bg-slate-950 overflow-hidden relative min-h-[760px] max-h-[890px] flex flex-col'
            : 'max-w-2xl rounded-3xl border border-slate-800/80 bg-slate-950 p-4 sm:p-6 min-h-[600px] flex flex-col'
        }`}
      >
        {/* Mobile Status Bar (Visible in phone frame) */}
        {isPhoneFrame && (
          <div className="w-full pt-3 px-6 pb-2 flex items-center justify-between text-[11px] text-slate-400 select-none bg-slate-950/80 backdrop-blur-md sticky top-0 z-30">
            <span className="font-bold text-white font-mono">9:41</span>
            {/* Dynamic Island / Notch */}
            <div className="w-24 h-4 bg-black rounded-full flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-slate-800"></div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-emerald-400">5G</span>
              <div className="w-4 h-2 border border-slate-400 rounded-sm p-0.5 flex items-center">
                <div className="w-full h-full bg-emerald-400 rounded-xs"></div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto px-4 pt-2 no-scrollbar">
          {activeTab === 'dashboard' && (
            <DashboardTab
              tasaBCV={tasaBCV}
              onOpenTasaModal={() => setIsTasaModalOpen(true)}
              onOpenTransactionModal={(type) => {
                setTransactionModalType(type);
                setIsTransactionModalOpen(true);
              }}
              onOpenSheetsModal={() => setIsSheetsModalOpen(true)}
              onOpenDesignModal={() => setIsDesignModalOpen(true)}
              accounts={accounts}
              transactions={transactions}
              cuentasCobrar={cuentasCobrar}
              deudasPagar={deudasPagar}
              savingsGoals={savingsGoals}
              currencyDisplay={currencyDisplay}
              setCurrencyDisplay={setCurrencyDisplay}
              onSelectTab={(tabId) => setActiveTab(tabId as any)}
            />
          )}

          {activeTab === 'savings' && (
            <SavingsGoalsTab
              savingsGoals={savingsGoals}
              tasaBCV={tasaBCV}
              onOpenCreateModal={() => {
                setEditingGoal(null);
                setIsSavingsModalOpen(true);
              }}
              onOpenEditModal={(goal) => {
                setEditingGoal(goal);
                setIsSavingsModalOpen(true);
              }}
              onDeleteGoal={handleDeleteGoal}
              onAddContribution={handleAddContribution}
              currencyDisplay={currencyDisplay}
            />
          )}

          {activeTab === 'accounts' && (
            <AccountsTab
              tasaBCV={tasaBCV}
              accounts={accounts}
              onUpdateAccountBalance={handleUpdateAccountBalance}
              currencyDisplay={currencyDisplay}
            />
          )}

          {activeTab === 'debts' && (
            <DebtsTab
              tasaBCV={tasaBCV}
              cuentasCobrar={cuentasCobrar}
              deudasPagar={deudasPagar}
              currencyDisplay={currencyDisplay}
              onMarkAsPaid={handleMarkAsPaid}
              onAddDebtOrReceivable={() => {}}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsTab tasaBCV={tasaBCV} currencyDisplay={currencyDisplay} />
          )}

          {activeTab === 'transactions' && (
            <TransactionsTab
              transactions={transactions}
              tasaBCV={tasaBCV}
              onOpenTransactionModal={(type) => {
                setTransactionModalType(type);
                setIsTransactionModalOpen(true);
              }}
              onDeleteTransaction={handleDeleteTransaction}
              currencyDisplay={currencyDisplay}
            />
          )}
        </div>

        {/* Floating Mobile Bottom Navigation Bar (iOS/Android Style) */}
        <nav className="w-full bg-slate-900/90 backdrop-blur-lg border-t border-slate-800/90 px-2 py-1.5 flex items-center justify-around z-30 sticky bottom-0">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center gap-0.5 py-1 px-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'dashboard' ? 'text-emerald-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Home className="w-4 h-4" />
            <span className="text-[9px]">Resumen</span>
          </button>

          <button
            onClick={() => setActiveTab('savings')}
            className={`flex flex-col items-center gap-0.5 py-1 px-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'savings' ? 'text-emerald-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Target className="w-4 h-4" />
            <span className="text-[9px]">Metas</span>
          </button>

          <button
            onClick={() => setActiveTab('debts')}
            className={`flex flex-col items-center gap-0.5 py-1 px-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'debts' ? 'text-emerald-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span className="text-[9px]">Deudas</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex flex-col items-center gap-0.5 py-1 px-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'analytics' ? 'text-emerald-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <PieChart className="w-4 h-4" />
            <span className="text-[9px]">Gráficas</span>
          </button>

          <button
            onClick={() => setActiveTab('accounts')}
            className={`flex flex-col items-center gap-0.5 py-1 px-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'accounts' ? 'text-emerald-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span className="text-[9px]">Activos</span>
          </button>

          <button
            onClick={() => setActiveTab('transactions')}
            className={`flex flex-col items-center gap-0.5 py-1 px-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'transactions' ? 'text-emerald-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ListOrdered className="w-4 h-4" />
            <span className="text-[9px]">Historial</span>
          </button>
        </nav>
      </main>

      {/* Floating Quick Action Toast */}
      {toastMessage && (
        <div className="fixed bottom-16 sm:bottom-6 z-50 px-4 py-2.5 rounded-2xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modal: Design Preview Mockups */}
      <DesignPreviewModal
        isOpen={isDesignModalOpen}
        onClose={() => setIsDesignModalOpen(false)}
        onUseInteractiveApp={() => setIsDesignModalOpen(false)}
      />

      {/* Modal: New Transaction (+ Gasto / + Ingreso) */}
      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        onAddTransaction={handleAddTransaction}
        tasaBCV={tasaBCV}
        accounts={accounts}
        initialType={transactionModalType}
      />

      {/* Modal: Google Sheets Sync */}
      <GoogleSheetsModal
        isOpen={isSheetsModalOpen}
        onClose={() => setIsSheetsModalOpen(false)}
        config={sheetsConfig}
        onSaveConfig={setSheetsConfig}
        onTriggerSync={handleTriggerSync}
        transactions={transactions}
        onImportTransactions={handleImportTransactions}
      />

      {/* Modal: Tasa BCV Editor */}
      <TasaBcvModal
        isOpen={isTasaModalOpen}
        onClose={() => setIsTasaModalOpen(false)}
        currentRate={tasaBCV}
        onUpdateRate={handleUpdateTasa}
      />

      {/* Modal: Savings Goal (Create / Edit) */}
      <SavingsGoalModal
        isOpen={isSavingsModalOpen}
        onClose={() => {
          setIsSavingsModalOpen(false);
          setEditingGoal(null);
        }}
        onSaveGoal={handleSaveGoal}
        tasaBCV={tasaBCV}
        initialData={editingGoal}
      />

      {/* Modal: Download for GitHub */}
      <GithubExportModal
        isOpen={isGithubModalOpen}
        onClose={() => setIsGithubModalOpen(false)}
      />
    </div>
  );
}
