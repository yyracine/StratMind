import React, { useState } from 'react';
import {
  BrainCircuit,
  LayoutGrid,
  Sparkles,
  CheckCircle,
  FolderOpen,
  Download,
  Moon,
  Sun,
  Share2,
  Users,
  Activity,
  Plus,
  Compass,
  FileText,
  ListTodo,
  Maximize2,
  Tv
} from 'lucide-react';
import { ActiveAppView, ActiveUser, MindMap, ThemeMode } from '../types';
import { THEME_CONFIGS } from '../constants';
import { NodeSearchBar } from './NodeSearchBar';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  currentView: ActiveAppView;
  setCurrentView: (view: ActiveAppView) => void;
  currentMap: MindMap;
  onOpenMapsModal: () => void;
  onNewMap: () => void;
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
  activeUsers: ActiveUser[];
  isConnected: boolean;
  latency: number;
  onExport: (format: 'json' | 'markdown') => void;
  onFitCanvas: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectNode: (nodeId: string) => void;
  selectedNodeId?: string | null;
  isPresentationMode?: boolean;
  onTogglePresentation?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  currentMap,
  onOpenMapsModal,
  onNewMap,
  theme,
  setTheme,
  activeUsers,
  isConnected,
  latency,
  onExport,
  onFitCanvas,
  searchQuery,
  onSearchChange,
  onSelectNode,
  selectedNodeId,
  isPresentationMode,
  onTogglePresentation
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const themeConfig = THEME_CONFIGS[theme];

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <header
      id="app-navbar"
      className={`h-14 border-b flex items-center justify-between px-3 md:px-5 transition-colors duration-200 select-none z-30 relative ${themeConfig.panelBg} ${themeConfig.panelBorder} ${themeConfig.textPrimary}`}
    >
      {/* Left: Brand & Map Selector */}
      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        <button
          id="nav-brand-btn"
          onClick={() => setCurrentView('landing')}
          className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
          title="Retour à l'accueil"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span
              className={`font-display font-bold text-sm tracking-tight flex items-center gap-1.5 transition-colors ${
                theme === 'light' || theme === 'sepia'
                  ? 'text-slate-900 group-hover:text-indigo-600'
                  : 'text-white group-hover:text-indigo-200'
              }`}
            >
              StratMind
              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                PRO
              </span>
            </span>
          </div>
        </button>

        <div className="hidden sm:block h-5 w-[1px] bg-slate-300 dark:bg-slate-800" />

        {/* Map Switcher Pill */}
        <button
          id="nav-map-selector-btn"
          onClick={onOpenMapsModal}
          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all hover:border-indigo-500/40 cursor-pointer ${
            theme === 'light' || theme === 'sepia'
              ? 'bg-slate-100/80 border-slate-200 text-slate-800'
              : 'bg-slate-900/60 border-slate-800 text-slate-200'
          }`}
          title="Gérer les cartes"
        >
          <FolderOpen className="w-3.5 h-3.5 text-indigo-400" />
          <span className="max-w-[90px] sm:max-w-[130px] md:max-w-[180px] truncate font-semibold">
            {currentMap.title}
          </span>
          <span className="hidden lg:inline text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/15 text-indigo-400 font-mono">
            {currentMap.nodes.length} nœuds
          </span>
        </button>
      </div>

      {/* Middle: Node Search Bar */}
      <div className="flex items-center justify-center flex-1 mx-2 md:mx-4 min-w-0">
        <NodeSearchBar
          nodes={currentMap.nodes}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          onSelectNode={onSelectNode}
          theme={theme}
          selectedNodeId={selectedNodeId}
        />
      </div>

      {/* Center-Right: View Switcher */}
      <div className="hidden sm:flex items-center gap-0.5 bg-black/10 dark:bg-white/5 p-1 rounded-xl border border-black/5 dark:border-white/5 text-xs font-medium shrink-0">
        <button
          id="nav-view-canvas"
          onClick={() => setCurrentView('canvas')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
            currentView === 'canvas'
              ? 'bg-indigo-600 text-white shadow-sm font-semibold'
              : 'text-slate-400 hover:text-inherit'
          }`}
          title="Vue Canvas Miró"
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span className="hidden xl:inline">Canvas Miró</span>
        </button>

        <button
          id="nav-view-action-plan"
          onClick={() => setCurrentView('action_plan')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
            currentView === 'action_plan'
              ? 'bg-indigo-600 text-white shadow-sm font-semibold'
              : 'text-slate-400 hover:text-inherit'
          }`}
          title="Vue Plan d'Action"
        >
          <ListTodo className="w-3.5 h-3.5" />
          <span className="hidden xl:inline">Plan d'Action</span>
        </button>

        <button
          id="nav-view-landing"
          onClick={() => setCurrentView('landing')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
            currentView === 'landing'
              ? 'bg-indigo-600 text-white shadow-sm font-semibold'
              : 'text-slate-400 hover:text-inherit'
          }`}
          title="Vision & Cas d'usage"
        >
          <Compass className="w-3.5 h-3.5" />
          <span className="hidden xl:inline">Vision</span>
        </button>
      </div>

      {/* Right Controls: Real-time status, Users, Theme, Export */}
      <div className="flex items-center gap-2">
        {/* Real-time sync badge */}
        <div
          id="nav-sync-badge"
          className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-mono border border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
          title={`Synchronisation active via WebSockets (Latence: ${latency || 12}ms)`}
        >
          <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          <span>{isConnected ? 'Temps Réel' : 'Connexion...'}</span>
          {isConnected && <span className="text-[10px] opacity-75">{latency > 0 ? `${latency}ms` : '14ms'}</span>}
        </div>

        {/* Collaborators Avatar Stack */}
        <button
          id="nav-collaborators-btn"
          onClick={() => setShowUsersModal(!showUsersModal)}
          className="flex items-center -space-x-1.5 cursor-pointer px-1 py-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
          title={`${activeUsers.length || 1} participant(s) actif(s)`}
        >
          {(activeUsers.length > 0 ? activeUsers.slice(0, 3) : [{ userId: 'self', userName: 'Vous', userColor: '#6366f1' }]).map((u, i) => (
            <div
              key={u.userId || i}
              className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-slate-900 ring-1 ring-white/10"
              style={{ backgroundColor: u.userColor }}
              title={u.userName}
            >
              {u.userName.slice(0, 1).toUpperCase()}
            </div>
          ))}
          {activeUsers.length > 3 && (
            <div className="w-6 h-6 rounded-full bg-slate-800 text-[9px] font-bold text-slate-300 flex items-center justify-center border-2 border-slate-900">
              +{activeUsers.length - 3}
            </div>
          )}
        </button>

        {/* PWA / Application Portable PC Installer */}
        <PWAInstallButton theme={theme} />

        {/* Zoom to Fit (Ajuster la vue pour voir tous les nœuds) */}
        <button
          id="nav-fit-canvas-btn"
          onClick={onFitCanvas}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-black/5 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-slate-400 hover:text-indigo-400 dark:hover:text-indigo-300 transition-colors cursor-pointer text-xs font-medium"
          title="Ajuster la vue à l'ensemble des nœuds (Zoom-to-Fit) - Touche F"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Ajuster la vue</span>
        </button>

        {/* Mode Présentation (plein écran immersif sans UI pour revues de stratégie) */}
        {currentView === 'canvas' && onTogglePresentation && (
          <button
            id="nav-presentation-mode-btn"
            onClick={onTogglePresentation}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer text-xs font-medium ${
              isPresentationMode
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-500/20'
                : 'border-black/5 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-slate-400 hover:text-indigo-400 dark:hover:text-indigo-300'
            }`}
            title="Mode Présentation (Masquer toute l'UI pour vos revues) - Touche P"
          >
            <Tv className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Présentation</span>
          </button>
        )}

        {/* Theme switcher */}
        <div className="relative">
          <button
            id="nav-theme-btn"
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            className="p-2 rounded-lg border border-black/5 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-slate-400 hover:text-inherit transition-colors cursor-pointer"
            title="Thème et Mode Sombre"
          >
            {theme === 'light' || theme === 'sepia' ? (
              <Sun className="w-4 h-4 text-amber-500" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-400" />
            )}
          </button>

          {showThemeMenu && (
            <div className={`absolute right-0 mt-2 w-44 rounded-xl shadow-xl border p-1 z-50 ${themeConfig.panelBg} ${themeConfig.panelBorder}`}>
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Ambiance Visuelle
              </div>
              {(['midnight', 'dark', 'light', 'sepia'] as ThemeMode[]).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setTheme(t);
                    setShowThemeMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between cursor-pointer ${
                    theme === t ? 'bg-indigo-600/15 text-indigo-400 font-semibold' : 'text-inherit hover:bg-white/5'
                  }`}
                >
                  <span>{THEME_CONFIGS[t].name}</span>
                  {theme === t && <CheckCircle className="w-3.5 h-3.5 text-indigo-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Export Menu */}
        <div className="relative">
          <button
            id="nav-export-btn"
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="p-2 rounded-lg border border-black/5 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-slate-400 hover:text-inherit transition-colors cursor-pointer"
            title="Exporter la carte"
          >
            <Download className="w-4 h-4" />
          </button>

          {showExportMenu && (
            <div className={`absolute right-0 mt-2 w-52 rounded-xl shadow-xl border p-1 z-50 ${themeConfig.panelBg} ${themeConfig.panelBorder}`}>
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Exporter la Carte
              </div>
              <button
                onClick={() => {
                  onExport('markdown');
                  setShowExportMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 hover:bg-white/5 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Plan Stratégique (Markdown)</span>
              </button>
              <button
                onClick={() => {
                  onExport('json');
                  setShowExportMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 hover:bg-white/5 cursor-pointer"
              >
                <Download className="w-4 h-4 text-indigo-400" />
                <span>Sauvegarde JSON StratMind</span>
              </button>
            </div>
          )}
        </div>

        {/* Share / Copy link */}
        <button
          id="nav-share-btn"
          onClick={handleShare}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
          title="Copier le lien pour inviter des collaborateurs"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{copiedLink ? 'Lien copié !' : 'Partager'}</span>
        </button>
      </div>

      {/* Collaborators Modal */}
      {showUsersModal && (
        <div className={`absolute top-16 right-5 w-64 rounded-xl shadow-2xl border p-3 z-50 ${themeConfig.panelBg} ${themeConfig.panelBorder}`}>
          <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
            <span className="text-xs font-semibold flex items-center gap-1.5">
              <Users className="w-4 h-4 text-indigo-400" /> Collaborateurs actifs
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">
              {activeUsers.length || 1} en ligne
            </span>
          </div>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {(activeUsers.length > 0 ? activeUsers : [{ userId: 'self', userName: 'Vous (Stratège)', userColor: '#6366f1' }]).map((u) => (
              <div key={u.userId} className="flex items-center gap-2 text-xs py-1 px-1.5 rounded hover:bg-white/5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: u.userColor }} />
                <span className="font-medium truncate">{u.userName}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-2 border-t border-white/10 text-[11px] text-slate-400">
            Chaque collaborateur voit les mouvements de curseurs et les modifications en direct.
          </div>
        </div>
      )}
    </header>
  );
};
