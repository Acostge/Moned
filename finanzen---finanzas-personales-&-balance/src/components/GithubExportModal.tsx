import React from 'react';
import {
  X,
  Github,
  Download,
  FolderArchive,
  FileCode2,
  CheckCircle2,
  Globe,
  Sparkles,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';

interface GithubExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GithubExportModal: React.FC<GithubExportModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-white">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Tus Archivos para GitHub</h3>
              <p className="text-xs text-slate-400">Descarga tu proyecto completo para que sea 100% tuyo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 space-y-1">
            <p className="font-bold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ¡Aquí tienes el código completo empaquetado!
            </p>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              He preparado los archivos en paquetes <code>.ZIP</code> descargables con un solo clic. Puedes guardarlos en tu computadora, subirlos a tu cuenta de GitHub y alojarlos donde tú prefieras.
            </p>
          </div>

          {/* Download Cards */}
          <div className="space-y-2.5">
            {/* Option 1: Full Source Code */}
            <a
              href="/downloads/finanzen-codigo-fuente.zip"
              download="finanzen-codigo-fuente.zip"
              className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 transition-all flex items-center justify-between group block"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <FolderArchive className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-xs sm:text-sm">
                      1. Código Fuente Completo (.ZIP)
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                      Recomendado
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Incluye <code>src/</code>, componentes, Vite, TypeScript, parser de Sheets y estilos.
                  </p>
                </div>
              </div>

              <div className="shrink-0 pl-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Download className="w-4 h-4 font-bold" />
                </div>
              </div>
            </a>

            {/* Option 2: Pre-compiled static web dist */}
            <a
              href="/downloads/finanzen-web-produccion.zip"
              download="finanzen-web-produccion.zip"
              className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-blue-500/50 transition-all flex items-center justify-between group block"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <FileCode2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-xs sm:text-sm">
                      2. Web Compilada Lista (Carpeta dist)
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono font-bold">
                      GitHub Pages
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Tiene el <code>index.html</code> listo para arrastrar directo a GitHub Pages o Netlify.
                  </p>
                </div>
              </div>

              <div className="shrink-0 pl-2">
                <div className="w-8 h-8 rounded-xl bg-blue-500 text-slate-950 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Download className="w-4 h-4 font-bold" />
                </div>
              </div>
            </a>
          </div>

          {/* Simple step by step on how to upload to GitHub */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-emerald-400" />
              ¿Cómo subirlo a tu cuenta de GitHub paso a paso?
            </h4>
            <ol className="list-decimal pl-4 space-y-1.5 text-[11px] text-slate-300">
              <li>
                Descarga el archivo <strong>"Código Fuente Completo (.ZIP)"</strong> con el botón verde de arriba.
              </li>
              <li>
                Descomprime la carpeta en tu computadora (clic derecho &gt; <em>Extraer aquí</em>).
              </li>
              <li>
                Ve a tu GitHub en el navegador: <a href="https://github.com/new" target="_blank" rel="noreferrer" className="text-emerald-400 underline font-semibold">github.com/new</a> y crea un repositorio nuevo (ej. <code>mi-app-finanzas</code>).
              </li>
              <li>
                En la página de tu nuevo repositorio, haz clic en <strong>"Upload an existing file"</strong> (o sube los archivos con Git si usas consola).
              </li>
              <li>
                Arrastra todos los archivos extraídos y dale a <strong>"Commit changes"</strong>.
              </li>
              <li>
                <strong>¡Listo!</strong> Si conectas tu repositorio con <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-emerald-400 underline">Vercel.com</a> (gratis), tendrás tu propia app con tu dominio o enlace personalizado para tu teléfono.
              </li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">Archivos listos para producción</span>
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
