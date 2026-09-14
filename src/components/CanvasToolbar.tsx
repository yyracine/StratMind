import React from 'react';
import {
  MousePointer,
  Hand,
  Target,
  Lightbulb,
  HelpCircle,
  CheckSquare,
  AlertTriangle,
  StickyNote,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Tv,
  Sparkles,
  GitMerge,
  Undo2,
  Redo2,
  Share2,
  Grid,
  Layers,
  Move
} from 'lucide-react';
import { BlockType, CanvasTool, ThemeMode } from '../types';
import { THEME_CONFIGS } from '../constants';

interface CanvasToolbarProps {
  tool: CanvasTool;
  setTool: (t: CanvasTool) => void;
  onAddBlock: (type: BlockType) => void;
  onOpenTemplates: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  onFitCanvas: () => void;
  onAutoLayout: () => void;
  snapToGrid: boolean;
  setSnapToGrid: (val: boolean) => void;
  theme: ThemeMode;
  isPresentationMode?: boolean;
  onTogglePresentation?: () => void;
}

export const CanvasToolbar: React.FC<CanvasToolbarProps> = ({
  tool,
  setTool,
  onAddBlock,
  onOpenTemplates,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  scale,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onFitCanvas,
  onAutoLayout,
  snapToGrid,
  setSnapToGrid,
  theme,
  isPresentationMode,
  onTogglePresentation
}) => {
  const themeConfig = THEME_CONFIGS[theme];

  return (
    <aside
      aria-label="Barre d'outils du canvas"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 select-none"
    >
      {/* Primary Creation & Mode Pill */}
      <div
        className={`flex items-center gap-1 p-1.5 rounded-2xl border shadow-2xl backdrop-blur-xl ${themeConfig.panelBg} ${themeConfig.panelBorder}`}
      >
        {/* Undo & Redo Controls */}
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={`p-2 rounded-xl transition-all ${
            canUndo
              ? 'text-slate-300 hover:text-white hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer active:scale-95'
              : 'text-slate-500 dark:text-slate-600 cursor-not-allowed opacity-30'
          }`}
          title={canUndo ? "Annuler la dernière action (Ctrl+Z / Cmd+Z)" : "Rien à annuler"}
        >
          <Undo2 className="w-4 h-4" />
          <span className="sr-only">Annuler</span>
        </button>

        <button
          onClick={onRedo}
          disabled={!canRedo}
          className={`p-2 rounded-xl transition-all ${
            canRedo
              ? 'text-slate-300 hover:text-white hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer active:scale-95'
              : 'text-slate-500 dark:text-slate-600 cursor-not-allowed opacity-30'
          }`}
          title={canRedo ? "Rétablir l'action (Ctrl+Y / Cmd+Shift+Z)" : "Rien à rétablir"}
        >
          <Redo2 className="w-4 h-4" />
          <span className="sr-only">Rétablir</span>
        </button>

        <div className="h-5 w-[1px] bg-slate-300 dark:bg-slate-700/80 mx-0.5" />

        <button
          onClick={() => setTool('select')}
          className={`p-2 rounded-xl transition-all cursor-pointer ${
            tool === 'select'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-inherit hover:bg-black/5 dark:hover:bg-white/5'
          }`}
          title="Sélectionner & Déplacer un élément (V)"
        >
          <MousePointer className="w-4 h-4" />
        </button>

        <button
          onClick={() => setTool('move_all')}
          className={`p-2 rounded-xl transition-all cursor-pointer ${
            tool === 'move_all'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-inherit hover:bg-black/5 dark:hover:bg-white/5'
          }`}
          title="Déplacer tous les nœuds de la carte (M ou Ctrl+A)"
        >
          <Move className="w-4 h-4" />
        </button>

        <button
          onClick={() => setTool('pan')}
          className={`p-2 rounded-xl transition-all cursor-pointer ${
            tool === 'pan'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-inherit hover:bg-black/5 dark:hover:bg-white/5'
          }`}
          title="Déplacer la vue / Panoramique (Main, H ou Espace)"
        >
          <Hand className="w-4 h-4" />
        </button>

        <div className="h-5 w-[1px] bg-slate-300 dark:bg-slate-700/80 mx-0.5" />

        {/* Node creation buttons */}
        <button
          onClick={() => onAddBlock('goal')}
          className="p-2 rounded-xl text-indigo-400 hover:bg-indigo-500/15 transition-all cursor-pointer group relative"
          title="Ajouter un Objectif / KPI"
        >
          <Target className="w-4 h-4" />
          <span className="sr-only">Objectif</span>
        </button>

        <button
          onClick={() => onAddBlock('concept')}
          className="p-2 rounded-xl text-sky-400 hover:bg-sky-500/15 transition-all cursor-pointer group relative"
          title="Ajouter une Idée / Concept"
        >
          <Lightbulb className="w-4 h-4" />
          <span className="sr-only">Concept</span>
        </button>

        <button
          onClick={() => onAddBlock('decision')}
          className="p-2 rounded-xl text-purple-400 hover:bg-purple-500/15 transition-all cursor-pointer group relative"
          title="Ajouter une Décision / Hypothèse"
        >
          <HelpCircle className="w-4 h-4" />
          <span className="sr-only">Décision</span>
        </button>

        <button
          onClick={() => onAddBlock('action')}
          className="p-2 rounded-xl text-emerald-400 hover:bg-emerald-500/15 transition-all cursor-pointer group relative"
          title="Ajouter une Action / Tâche"
        >
          <CheckSquare className="w-4 h-4" />
          <span className="sr-only">Action</span>
        </button>

        <button
          onClick={() => onAddBlock('risk')}
          className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/15 transition-all cursor-pointer group relative"
          title="Ajouter un Risque / Contrainte"
        >
          <AlertTriangle className="w-4 h-4" />
          <span className="sr-only">Risque</span>
        </button>

        <button
          onClick={() => onAddBlock('note')}
          className="p-2 rounded-xl text-amber-400 hover:bg-amber-500/15 transition-all cursor-pointer group relative"
          title="Ajouter un Post-it / Note libre"
        >
          <StickyNote className="w-4 h-4" />
          <span className="sr-only">Note</span>
        </button>

        {/* Pre-defined Node Templates Button */}
        <button
          onClick={onOpenTemplates}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 hover:from-indigo-500/30 hover:to-purple-500/30 text-indigo-300 border border-indigo-500/30 shadow-sm transition-all cursor-pointer group"
          title="Insérer un modèle de nœuds (SWOT, Brainstorming, OKRs, 5 Pourquoi...) - Touche T"
        >
          <Layers className="w-4 h-4 text-indigo-400 group-hover:rotate-6 transition-transform" />
          <span className="text-xs font-semibold">Modèles</span>
        </button>

        <div className="h-5 w-[1px] bg-slate-300 dark:bg-slate-700/80 mx-0.5" />

        {/* Auto Align / Layout */}
        <button
          onClick={onAutoLayout}
          className="p-2 rounded-xl text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all cursor-pointer"
          title="Réorganisation Stratégique Automatique (Arbre décisionnel)"
        >
          <GitMerge className="w-4 h-4" />
        </button>

        {/* Snap to grid toggle */}
        <button
          onClick={() => setSnapToGrid(!snapToGrid)}
          className={`p-2 rounded-xl transition-all cursor-pointer ${
            snapToGrid ? 'text-indigo-400 bg-indigo-500/15' : 'text-slate-400 hover:text-inherit'
          }`}
          title={snapToGrid ? 'Magnétisme grille activé' : 'Magnétisme désactivé'}
        >
          <Grid className="w-4 h-4" />
        </button>
      </div>

      {/* Zoom and Fit Controls Pill */}
      <div
        className={`flex items-center gap-1 p-1.5 rounded-2xl border shadow-2xl backdrop-blur-xl ${themeConfig.panelBg} ${themeConfig.panelBorder}`}
      >
        <button
          onClick={onZoomOut}
          className="p-2 rounded-xl text-slate-400 hover:text-inherit hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
          title="Zoom Arrière (-)"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <button
          onClick={onZoomReset}
          className="px-2 py-1 text-xs font-mono font-medium rounded-lg text-slate-300 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
          title="Réinitialiser zoom à 100%"
        >
          {Math.round(scale * 100)}%
        </button>

        <button
          onClick={onZoomIn}
          className="p-2 rounded-xl text-slate-400 hover:text-inherit hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
          title="Zoom Avant (+)"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <div className="h-4 w-[1px] bg-slate-300 dark:bg-slate-700 mx-0.5" />

        <button
          onClick={onFitCanvas}
          className="p-2 rounded-xl text-slate-400 hover:text-inherit hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
          title="Ajuster la vue à tout le contenu (F)"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {onTogglePresentation && (
          <>
            <div className="h-4 w-[1px] bg-slate-300 dark:bg-slate-700 mx-0.5" />
            <button
              onClick={onTogglePresentation}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                isPresentationMode
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                  : 'text-slate-400 hover:text-indigo-400 dark:hover:text-indigo-300 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
              title="Mode Présentation (P) - Masquer l'interface pour vos revues stratégiques"
            >
              <Tv className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </aside>
  );
};
