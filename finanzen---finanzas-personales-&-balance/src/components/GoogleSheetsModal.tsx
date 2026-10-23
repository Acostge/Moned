import React, { useState } from 'react';
import {
  X,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Download,
  Upload,
  ExternalLink,
  HelpCircle,
  Github,
  Globe,
  Layers,
} from 'lucide-react';
import { GoogleSheetsConfig, Transaction } from '../types/finance';
import { parseGoogleSheetsCSV } from '../utils/csvParser';
import { DEFAULT_SHEETS_URL_GASTOS } from '../data/initialFinanceData';

interface GoogleSheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: GoogleSheetsConfig;
  onSaveConfig: (config: GoogleSheetsConfig) => void;
  onTriggerSync: (gastosUrl?: string, ingresosUrl?: string) => Promise<{ success: boolean; message: string; rowsCount?: number }>;
  transactions: Transaction[];
  onImportTransactions: (imported: Transaction[]) => void;
}

export const GoogleSheetsModal: React.FC<GoogleSheetsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  onTriggerSync,
  transactions,
  onImportTransactions,
}) => {
  const [gastosUrl, setGastosUrl] = useState(config.sheetUrl || DEFAULT_SHEETS_URL_GASTOS);
  const [ingresosUrl, setIngresosUrl] = useState(config.ingresosSheetUrl || '');
  const [autoSync, setAutoSync] = useState(config.autoSync ?? true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({
    type: config.status === 'success' ? 'success' : 'idle',
    message: config.lastSync ? `Última sincronización: ${config.lastSync}` : 'Hoja de Gastos vinculada y lista.',
  });
  const [activeTab, setActiveTab] = useState<'sync' | 'ingresos_guide' | 'github_guide'>('sync');

  if (!isOpen) return null;

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncStatus({ type: 'idle', message: 'Descargando y procesando hoja desde Google Sheets...' });

    // Save updated config
    const updated: GoogleSheetsConfig = {
      sheetUrl: gastosUrl,
      ingresosSheetUrl: ingresosUrl,
      autoSync,
      lastSync: new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' }),
      status: 'syncing',
    };
    onSaveConfig(updated);

    try {
      let csvText = '';
      // 1. Try server-side proxy (bypasses browser CORS & redirects)
      try {
        const proxyRes = await fetch(`/api/sync-sheets?url=${encodeURIComponent(gastosUrl)}`);
        if (proxyRes.ok) {
          csvText = await proxyRes.text();
        }
      } catch (proxyErr) {
        console.warn('Proxy fetch failed, trying direct:', proxyErr);
      }

      // 2. Direct client fetch fallback
      if (!csvText && gastosUrl && gastosUrl.startsWith('http')) {
        const directRes = await fetch(gastosUrl);
        if (directRes.ok) {
          csvText = await directRes.text();
        }
      }

      if (csvText) {
        const parsed = parseGoogleSheetsCSV(csvText);
        if (parsed.length > 0) {
          // Sort newest first
          parsed.sort((a, b) => b.fecha.localeCompare(a.fecha));
          onImportTransactions(parsed);
          setSyncStatus({
            type: 'success',
            message: `¡Éxito! Se sincronizaron ${parsed.length.toLocaleString('es-VE')} movimientos de Gastos directamente desde tu Google Sheet.`,
          });
          onSaveConfig({ ...updated, status: 'success', rowsCount: parsed.length });
          setIsSyncing(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Sync error:', err);
    }

    // Fallback sync trigger if CORS or offline
    const result = await onTriggerSync(gastosUrl, ingresosUrl);
    setIsSyncing(false);

    if (result.success) {
      setSyncStatus({
        type: 'success',
        message: result.message || `Sincronización completada con éxito.`,
      });
      onSaveConfig({ ...updated, status: 'success', rowsCount: result.rowsCount });
    } else {
      setSyncStatus({
        type: 'error',
        message: result.message || 'Error al conectar con la hoja. Revisa el enlace.',
      });
      onSaveConfig({ ...updated, status: 'error', errorMessage: result.message });
    }
  };

  const handleExportCSV = () => {
    const headers = ['Fecha', 'Tipo', 'Concepto', 'Ingreso $', 'Egreso $', 'Tasa Bs', 'Total en Bs'];
    const rows = transactions.map((t) => [
      t.fecha,
      `"${t.categoria}"`,
      `"${t.concepto.replace(/"/g, '""')}"`,
      t.tipo === 'Ingreso' ? t.montoUSD.toFixed(2) : '',
      t.tipo === 'Egreso' ? t.montoUSD.toFixed(2) : '',
      t.tasaBs.toFixed(2),
      t.montoBs.toFixed(2),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `FinanZen_Gastos_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = parseGoogleSheetsCSV(text);

        if (parsed.length > 0) {
          onImportTransactions(parsed);
          setSyncStatus({
            type: 'success',
            message: `¡Éxito! Se importaron ${parsed.length} movimientos desde tu archivo.`,
          });
        } else {
          setSyncStatus({
            type: 'error',
            message: 'No se encontraron filas válidas en el archivo seleccionado.',
          });
        }
      } catch (err) {
        setSyncStatus({
          type: 'error',
          message: 'Error al leer el archivo. Asegúrate de que sea formato CSV o TSV.',
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Sincronización con Google Sheets</h3>
              <p className="text-xs text-slate-400">Vincula tus hojas de GASTOS e INGRESOS</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-tabs selector */}
        <div className="flex border-b border-slate-800 px-4 pt-2 gap-2 bg-slate-950/40 text-xs">
          <button
            onClick={() => setActiveTab('sync')}
            className={`pb-2.5 px-3 font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'sync'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Sincronizar
          </button>
          <button
            onClick={() => setActiveTab('ingresos_guide')}
            className={`pb-2.5 px-3 font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'ingresos_guide'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            ¿Cómo vincular INGRESOS?
          </button>
          <button
            onClick={() => setActiveTab('github_guide')}
            className={`pb-2.5 px-3 font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'github_guide'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Github className="w-3.5 h-3.5" />
            <span>Publicar en GitHub</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          {activeTab === 'sync' && (
            <>
              {/* Status Alert Banner */}
              {syncStatus.message && (
                <div
                  className={`p-3 rounded-2xl flex items-start gap-2.5 border ${
                    syncStatus.type === 'success'
                      ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                      : syncStatus.type === 'error'
                      ? 'bg-rose-950/40 border-rose-500/30 text-rose-300'
                      : 'bg-slate-800/60 border-slate-700 text-slate-300'
                  }`}
                >
                  {syncStatus.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : syncStatus.type === 'error' ? (
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  ) : (
                    <RefreshCw className="w-4 h-4 text-slate-400 shrink-0 mt-0.5 animate-spin" />
                  )}
                  <span className="text-xs font-medium leading-relaxed">{syncStatus.message}</span>
                </div>
              )}

              {/* URL 1: Pestaña GASTOS (Ya configurada) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                    Enlace CSV de la pestaña GASTOS (Activo)
                  </label>
                  <span className="text-[10px] text-emerald-400 font-medium">Vinculado</span>
                </div>
                <input
                  type="text"
                  value={gastosUrl}
                  onChange={(e) => setGastosUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl py-2 px-3 text-[11px] text-white font-mono focus:outline-none"
                />
              </div>

              {/* URL 2: Pestaña INGRESOS */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    Enlace CSV de la pestaña INGRESOS (Opcional)
                  </label>
                  <button
                    type="button"
                    onClick={() => setActiveTab('ingresos_guide')}
                    className="text-[10px] text-teal-400 hover:underline cursor-pointer"
                  >
                    ¿Cómo sacarlo?
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Pega el enlace publicado de la pestaña INGRESOS aquí..."
                  value={ingresosUrl}
                  onChange={(e) => setIngresosUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl py-2 px-3 text-[11px] text-white font-mono placeholder-slate-600 focus:outline-none"
                />
              </div>

              {/* Auto Sync Toggle */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <div>
                  <p className="font-medium text-slate-200 text-xs">Auto-sincronizar al iniciar la app</p>
                  <p className="text-[11px] text-slate-500">Mantener tus saldos y gastos al día con Sheets</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoSync}
                    onChange={(e) => setAutoSync(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              {/* Sync CTA Button */}
              <button
                type="button"
                onClick={handleSync}
                disabled={isSyncing}
                className={`w-full py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all ${
                  isSyncing
                    ? 'bg-slate-800 text-slate-400'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/25'
                }`}
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Conectando con Google Sheets...' : 'Sincronizar Datos Ahora'}</span>
              </button>

              {/* Backup & CSV options */}
              <div className="pt-2 border-t border-slate-800/80 space-y-2">
                <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                  Opciones de Respaldo Local
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-slate-200 cursor-pointer transition-colors text-center">
                    <Upload className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Importar CSV</span>
                    <input type="file" accept=".csv,.txt" onChange={handleFileUpload} className="hidden" />
                  </label>

                  <button
                    type="button"
                    onClick={handleExportCSV}
                    className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-slate-200 cursor-pointer transition-colors text-center"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Exportar CSV</span>
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === 'ingresos_guide' && (
            <div className="space-y-3 p-1">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-slate-300">
                <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  Cómo publicar la pestaña "INGRESOS":
                </h4>
                <ol className="list-decimal pl-4 space-y-2 text-slate-400 text-xs">
                  <li>En tu archivo de Google Sheets, ve arriba a <strong>Archivo &gt; Compartir &gt; Publicar en la web</strong>.</li>
                  <li>
                    En la ventana que se abre, donde dice <em>"Todo el documento"</em>, haz clic y cámbialo por la pestaña <strong>INGRESOS</strong>.
                  </li>
                  <li>
                    En el selector de formato al lado (que suele decir <em>Página web</em>), cámbialo a <strong>Valores separados por comas (.csv)</strong>.
                  </li>
                  <li>
                    Haz clic en el botón <strong>Publicar</strong> (o copia el enlace si ya estaba publicado).
                  </li>
                  <li>
                    El enlace generado terminará en algo como <code className="text-emerald-300 bg-slate-900 px-1 py-0.5 rounded">pub?gid=...&single=true&output=csv</code>.
                  </li>
                  <li>Cópialo, ven a esta ventana y pégalo en el campo <strong>"Enlace CSV de la pestaña INGRESOS"</strong>.</li>
                </ol>
              </div>

              <button
                onClick={() => setActiveTab('sync')}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
              >
                Volver a Sincronización
              </button>
            </div>
          )}

          {activeTab === 'github_guide' && (
            <div className="space-y-3 p-1">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-slate-300">
                <div className="flex items-center gap-2">
                  <Github className="w-5 h-5 text-white" />
                  <h4 className="font-bold text-white text-xs">Guía para publicar tu App en GitHub</h4>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Para publicar el código en GitHub y tener tu app web online disponible en tu teléfono con enlace propio (usando <strong>GitHub Pages</strong> o <strong>Vercel</strong> gratis):
                </p>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <p><strong>1. Generar la compilación para producción:</strong></p>
                  <pre className="p-2 rounded-xl bg-slate-900 text-emerald-400 font-mono text-[11px]">npm run build</pre>
                  <p className="text-[11px] text-slate-400">Esto creará la carpeta <code>dist/</code> con el <code>index.html</code> listo y optimizado.</p>

                  <p className="pt-1"><strong>2. Crear tu repositorio en GitHub:</strong></p>
                  <pre className="p-2 rounded-xl bg-slate-900 text-emerald-400 font-mono text-[11px]">
                    git init{"\n"}git add .{"\n"}git commit -m "FinanZen App"{"\n"}git branch -M main{"\n"}git remote add origin TU_REPOSITORIO_GITHUB{"\n"}git push -u origin main
                  </pre>

                  <p className="pt-1"><strong>3. Publicación automática gratuita:</strong></p>
                  <p className="text-[11px] text-slate-400">
                    Puedes conectar tu repositorio con <strong>Vercel</strong> o <strong>Netlify</strong> (1 clic gratis), o usar <strong>GitHub Pages</strong> apuntando a la rama con los archivos de <code>dist</code>.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('sync')}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
              >
                Entendido, volver
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950/80 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
