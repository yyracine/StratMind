import React, { useState } from 'react';
import {
  Download,
  Laptop,
  CheckCircle,
  HardDrive,
  WifiOff,
  ExternalLink,
  Sparkles,
  HelpCircle,
  X
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { ThemeMode } from '../types';
import { THEME_CONFIGS } from '../constants';

interface PWAInstallButtonProps {
  theme: ThemeMode;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ theme }) => {
  const { isInstallable, isInstalled, isStandalone, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  const themeConfig = THEME_CONFIGS[theme];

  const handleInstallClick = async () => {
    if (isInstallable) {
      const outcome = await install();
      if (outcome) {
        setInstallSuccess(true);
        setTimeout(() => setInstallSuccess(false), 4000);
        return;
      }
    }
    // If not directly triggerable (e.g. inside iframe or unsupported browser), show the guided dialog
    setShowModal(true);
  };

  return (
    <>
      {/* Navbar button */}
      <button
        id="nav-install-pc-btn"
        type="button"
        onClick={handleInstallClick}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
          isStandalone
            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
            : isInstallable
            ? 'border-indigo-500/50 bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-500/20'
            : 'border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-slate-300 hover:text-white'
        }`}
        title="Installer StratMind comme application PC de bureau autonome et portable"
      >
        <Laptop className="w-3.5 h-3.5" />
        <span className="hidden xl:inline">
          {isStandalone ? 'App PC Active' : 'Installer sur PC'}
        </span>
      </button>

      {/* Guide Modal for Desktop & Portable Installation */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div
            className={`w-full max-w-lg rounded-2xl shadow-2xl border p-6 ${themeConfig.panelBg} ${themeConfig.panelBorder} text-inherit relative`}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-slate-400 hover:text-inherit cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-md">
                <Laptop className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  Installer StratMind sur votre PC
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Portable & Hors-Ligne
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Application de bureau autonome et légère pour Windows, macOS et Linux.
                </p>
              </div>
            </div>

            {/* Content Steps */}
            <div className="space-y-3.5 text-xs text-slate-300">
              {/* Option 1: Native PWA Desktop Install */}
              <div className="p-3 rounded-xl border border-indigo-500/30 bg-indigo-500/10">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    Option 1 : Installation Progressive Web App (PWA)
                  </span>
                  {isInstallable && (
                    <button
                      onClick={async () => {
                        const ok = await install();
                        if (ok) setShowModal(false);
                      }}
                      className="px-2.5 py-1 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[11px] cursor-pointer transition-colors"
                    >
                      Installer maintenant
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed mb-2">
                  Transforme instantanément StratMind en véritable application PC avec raccourci sur le bureau, fenêtre autonome sans barre d'adresse et exécution fluide.
                </p>
                <div className="bg-black/30 p-2 rounded-lg font-mono text-[11px] text-slate-300 space-y-1">
                  <div>1. Dans Chrome / Edge : Cliquez sur l'icône 🖥️ ou ➕ tout à droite de la barre d'adresse.</div>
                  <div>2. Cliquez sur <strong>« Installer StratMind »</strong>.</div>
                  <div>3. L'application apparaît dans vos applications Windows/Mac avec son icône dédiée.</div>
                </div>
              </div>

              {/* Option 2: Mode Portable & 100% Hors-Ligne */}
              <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                <div className="font-bold text-emerald-400 flex items-center gap-1.5 mb-1">
                  <WifiOff className="w-4 h-4" />
                  Mode Portable & Fonctionnement 100% Autonome
                </div>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-300 leading-relaxed">
                  <li><strong>Aucun compte requis :</strong> Vos cartes mentales, tâches et modèles sont stockés en local sur votre PC (LocalStorage & Cache).</li>
                  <li><strong>Zéro dépendance réseau :</strong> Le service worker précharge tous les styles, polices et composants pour fonctionner sans internet.</li>
                  <li><strong>Emportez sur clé USB :</strong> Utilisez l'outil d'export JSON pour sauvegarder et restaurer vos maps d'un PC à un autre en 2 clics.</li>
                </ul>
              </div>

              {/* Option 3: Dossier de Build Portable (Standalone Distribution) */}
              <div className="p-3 rounded-xl border border-sky-500/20 bg-sky-500/5">
                <div className="font-bold text-sky-400 flex items-center gap-1.5 mb-1">
                  <HardDrive className="w-4 h-4" />
                  Build Portable Compilé (dist/)
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Le dossier compilé de l'application est prêt dans <code className="bg-black/30 px-1 py-0.5 rounded text-sky-300">dist/</code>. Vous pouvez lancer un serveur portable léger (ou double-cliquer via n'importe quel lanceur local) sans aucune installation de base de données.
                </p>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="mt-5 pt-3 border-t border-black/10 dark:border-white/10 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                Compatible Windows 10/11, macOS, Linux
              </span>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
