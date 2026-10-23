import React, { useState } from 'react';
import { X, TrendingUp, Check, RefreshCw } from 'lucide-react';

interface TasaBcvModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRate: number;
  onUpdateRate: (newRate: number) => void;
}

export const TasaBcvModal: React.FC<TasaBcvModalProps> = ({
  isOpen,
  onClose,
  currentRate,
  onUpdateRate,
}) => {
  const [rateInput, setRateInput] = useState<string>(currentRate.toString());

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(rateInput);
    if (parsed > 0) {
      onUpdateRate(parsed);
      onClose();
    }
  };

  const presetRates = [880.11, 883.40, 886.23, 895.00, 920.00];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-5 overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Actualizar Tasa BCV</h3>
              <p className="text-[11px] text-slate-400">Tipo de cambio oficial (Bs/$)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="pt-4 space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">
              Tasa del Día (Bolívares por Dólar)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-xs font-bold text-emerald-400">
                Bs.
              </span>
              <input
                type="number"
                step="0.01"
                min="1"
                required
                value={rateInput}
                onChange={(e) => setRateInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl py-2.5 pl-11 pr-3 text-lg font-bold text-white focus:outline-none"
                autoFocus
              />
            </div>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">Valores recientes en tus hojas:</span>
            <div className="flex flex-wrap gap-1.5">
              {presetRates.map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setRateInput(preset.toString())}
                  className={`px-2.5 py-1 text-xs rounded-lg font-mono transition-colors cursor-pointer ${
                    parseFloat(rateInput) === preset
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Bs. {preset}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Guardar Tasa</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
