import React, { useState } from 'react';
import { X, Smartphone, Sparkles, CheckCircle2, ChevronRight, Eye, Layers } from 'lucide-react';

interface DesignPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUseInteractiveApp: () => void;
}

export const DesignPreviewModal: React.FC<DesignPreviewModalProps> = ({
  isOpen,
  onClose,
  onUseInteractiveApp,
}) => {
  const [selectedMockup, setSelectedMockup] = useState<1 | 2>(1);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                Diseño Visual de la App Móvil
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium">
                  Mockup HD
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Diseño conceptual para tu celular basado en tus tablas de Excel (2026, BCV, Cashea, Deudas)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mockup Tabs Selector */}
        <div className="px-4 sm:px-6 pt-3 pb-1 border-b border-slate-800/80 flex gap-2 bg-slate-900/60 overflow-x-auto">
          <button
            onClick={() => setSelectedMockup(1)}
            className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              selectedMockup === 1
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            Pantalla 1: Balance, Cuentas & Registros
          </button>
          <button
            onClick={() => setSelectedMockup(2)}
            className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              selectedMockup === 2
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            Pantalla 2: Gráficas de Gastos, Cashea & Deudas
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Mockup Phone Display */}
          <div className="lg:col-span-6 flex justify-center items-center">
            <div className="relative group max-w-[320px] sm:max-w-[360px] w-full rounded-3xl overflow-hidden border border-emerald-500/30 shadow-2xl shadow-emerald-500/10">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 z-10 pointer-events-none">
                <span className="text-xs text-white font-medium flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-emerald-400" />
                  Diseño de interfaz para smartphone
                </span>
              </div>

              {selectedMockup === 1 ? (
                <img
                  src="/src/assets/images/finance_app_dashboard_mockup_1792714337594.jpg"
                  alt="Diseño de Pantalla Principal de Finanzas para Celular"
                  className="w-full h-auto object-contain rounded-3xl"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <img
                  src="/src/assets/images/finance_app_analytics_mockup_1792714337986.jpg"
                  alt="Diseño de Analítica de Gastos y Deudas para Celular"
                  className="w-full h-auto object-contain rounded-3xl"
                  referrerPolicy="no-referrer"
                />
              )}
            </div>
          </div>

          {/* Details & Structure Explanation */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                {selectedMockup === 1 ? 'Arquitectura Pantalla 1' : 'Arquitectura Pantalla 2'}
              </span>
              <h3 className="text-lg font-bold text-white mt-1">
                {selectedMockup === 1
                  ? 'Dashboard & Movimiento Económico'
                  : 'Gráficas de Categorías & Control de Deudas'}
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {selectedMockup === 1
                  ? 'Pensada para usarse con una sola mano en el celular. Integra tu balance total ($11.637,07), la conversión dual con Tasa BCV (886,23 Bs/$), botones de acceso rápido y carrusel de tus billeteras y bancos.'
                  : 'Gráfica donut de tus categorías donde más gastas (Consumo/Hogar, Otros Gastos, Seguro Médico, Remodelación) y desglose de Cuentas por Cobrar ($5.694,53) y Créditos Cashea ($5.930,26).'}
              </p>
            </div>

            {/* Checklist of spreadsheet features matching Excel */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-300">Elementos extraídos de tus tablas:</div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Bimonetario ($ / Bs):</strong> Muestra valores en USD y cálculo instantáneo en Bolívares a tasa oficial BCV.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Botones de Registro Rápido:</strong> Botones de un toque para <em>+ Registrar Gasto</em> y <em>+ Registrar Ingreso</em> al instante.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Sincronización Google Sheets:</strong> Botón dedicado para enlazar tu Excel en la nube y actualizar la base de datos.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Control de Créditos Cashea:</strong> Seguimiento de cuotas en Traki, SoyTechno y JUMP con sus fechas y progreso.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Cuentas por Cobrar & Blacklist:</strong> Separa cobranzas activas regulares de personas en lista de morosos.
                  </span>
                </li>
              </ul>
            </div>

            {/* CTA to Interactive App */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  onClose();
                  onUseInteractiveApp();
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
              >
                <Smartphone className="w-4 h-4" />
                <span>Probar App Móvil Interactiva</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={onClose}
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
              >
                Cerrar Visor
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
