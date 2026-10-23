export type Currency = 'USD' | 'VES' | 'EUR';

export type TransactionType = 'Egreso' | 'Ingreso';

export interface Transaction {
  id: string;
  ano: number;
  fecha: string;
  tipo: TransactionType;
  categoria: string;
  concepto: string;
  montoUSD: number;
  tasaBs: number;
  montoBs: number;
  cuentaId?: string;
  comentarios?: string;
}

export interface FinancialAccount {
  id: string;
  nombre: string;
  titular?: string;
  tipo: 'efectivo' | 'banco_bs' | 'banco_usd' | 'digital' | 'crypto';
  moneda: 'USD' | 'VES' | 'EUR';
  saldo: number; // Saldo en la moneda nativa
  saldoUSD: number; // Equivalente en USD
  color: string;
  icon: string;
}

export interface CuentaPorCobrar {
  id: string;
  nombre: string;
  montoUSD: number;
  observaciones: string;
  fecha?: string;
  isBlacklist?: boolean;
  status: 'pendiente' | 'parcial' | 'cobrado';
}

export interface DeudaPorPagar {
  id: string;
  nombre: string;
  montoUSD: number;
  tipo: 'tarjeta' | 'prestamo' | 'cashea' | 'personal' | 'inversion';
  observaciones: string;
  cuotas?: { total: number; pagadas: number; montoCuota: number };
  fechaVencimiento?: string;
}

export interface CategorySummary {
  nombre: string;
  totalUSD: number;
  porcentaje: number;
  color: string;
  icon: string;
  conteo: number;
}

export interface MonthSummary {
  mes: string;
  ingresoBase: number;
  ingresoExtras: number;
  ingresoTotal: number;
  egresos: number;
  balanceNeto: number;
}

export interface SavingsGoal {
  id: string;
  titulo: string;
  montoObjetivoUSD: number;
  montoActualUSD: number;
  fechaLimite: string; // YYYY-MM-DD
  categoriaIcono: string; // Target, Car, Home, Laptop, Plane, Shield, PiggyBank, Heart, Sparkles
  color: string;
  notas?: string;
  createdAt: string;
}

export interface GoogleSheetsConfig {
  sheetUrl: string; // Primary / Gastos sheet
  ingresosSheetUrl?: string; // Optional Ingresos sheet URL
  autoSync: boolean;
  lastSync: string | null;
  status: 'idle' | 'syncing' | 'success' | 'error';
  errorMessage?: string;
  rowsCount?: number;
}
