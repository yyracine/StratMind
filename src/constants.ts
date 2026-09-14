import { BlockType, NodeShape, PriorityLevel, ThemeMode } from './types';

export const BLOCK_CONFIGS: Record<BlockType, {
  label: string;
  defaultColor: string;
  badgeBg: string;
  badgeText: string;
  description: string;
  iconName: string;
}> = {
  goal: {
    label: 'Objectif / KPI',
    defaultColor: '#6366f1',
    badgeBg: 'bg-indigo-500/15',
    badgeText: 'text-indigo-400',
    description: 'Vision maîtresse, KPI cible ou résultat clé stratégique',
    iconName: 'Target'
  },
  concept: {
    label: 'Idée / Concept',
    defaultColor: '#0ea5e9',
    badgeBg: 'bg-sky-500/15',
    badgeText: 'text-sky-400',
    description: 'Axe de réflexion, opportunité, modèle ou composante clé',
    iconName: 'Lightbulb'
  },
  decision: {
    label: 'Décision / Hypothèse',
    defaultColor: '#8b5cf6',
    badgeBg: 'bg-purple-500/15',
    badgeText: 'text-purple-400',
    description: 'Point d\'arbitrage, validation d\'hypothèse ou choix stratégique',
    iconName: 'HelpCircle'
  },
  action: {
    label: 'Action / Tâche',
    defaultColor: '#10b981',
    badgeBg: 'bg-emerald-500/15',
    badgeText: 'text-emerald-400',
    description: 'Livrable opérationnel, étape concrète avec statut et échéance',
    iconName: 'CheckSquare'
  },
  risk: {
    label: 'Risque / Contrainte',
    defaultColor: '#ef4444',
    badgeBg: 'bg-rose-500/15',
    badgeText: 'text-rose-400',
    description: 'Vulnérabilité, point de friction critique ou hypothèse fragile',
    iconName: 'AlertTriangle'
  },
  note: {
    label: 'Note / Post-it',
    defaultColor: '#f59e0b',
    badgeBg: 'bg-amber-500/15',
    badgeText: 'text-amber-400',
    description: 'Mémo libre, citation, feedback terrain ou insight rapide',
    iconName: 'StickyNote'
  }
};

export const COLOR_SWATCHES = [
  '#6366f1', // Indigo
  '#0ea5e9', // Sky
  '#8b5cf6', // Violet
  '#10b981', // Emerald
  '#ef4444', // Red
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#64748b', // Slate
];

export const NODE_SHAPE_CONFIGS: Record<NodeShape, {
  label: string;
  sublabel: string;
  description: string;
}> = {
  rectangle: {
    label: 'Rectangle',
    sublabel: 'Standard',
    description: 'Format classique structuré pour les détails, processus et actions'
  },
  circle: {
    label: 'Cercle',
    sublabel: 'Bulle / Hub',
    description: 'Format circulaire pour idées maîtresses, concepts et brainstorming'
  },
  diamond: {
    label: 'Losange',
    sublabel: 'Décision / Jalon',
    description: 'Format losange pour arbitrages stratégiques, choix et jalons'
  }
};

export const PRIORITY_CONFIGS: Record<PriorityLevel, { label: string; color: string; border: string }> = {
  low: { label: 'Basse', color: 'bg-slate-500/20 text-slate-300', border: 'border-slate-500/30' },
  medium: { label: 'Moyenne', color: 'bg-blue-500/20 text-blue-300', border: 'border-blue-500/30' },
  high: { label: 'Haute', color: 'bg-amber-500/20 text-amber-300', border: 'border-amber-500/40' },
  urgent: { label: 'Critique', color: 'bg-rose-500/20 text-rose-300', border: 'border-rose-500/50' }
};

export const THEME_CONFIGS: Record<ThemeMode, {
  name: string;
  bg: string;
  canvasBg: string;
  panelBg: string;
  panelBorder: string;
  textPrimary: string;
  textSecondary: string;
  dotsClass: string;
}> = {
  midnight: {
    name: 'Sombre Minuit',
    bg: 'bg-[#090d16]',
    canvasBg: '#090d16',
    panelBg: 'bg-[#0f172a]/90 backdrop-blur-md',
    panelBorder: 'border-slate-800/80',
    textPrimary: 'text-slate-100',
    textSecondary: 'text-slate-400',
    dotsClass: 'canvas-dots-midnight'
  },
  dark: {
    name: 'Graphite Pro',
    bg: 'bg-[#18181b]',
    canvasBg: '#18181b',
    panelBg: 'bg-[#27272a]/90 backdrop-blur-md',
    panelBorder: 'border-zinc-700/80',
    textPrimary: 'text-zinc-100',
    textSecondary: 'text-zinc-400',
    dotsClass: 'canvas-dots-dark'
  },
  light: {
    name: 'Clair Minimaliste',
    bg: 'bg-[#f8fafc]',
    canvasBg: '#f8fafc',
    panelBg: 'bg-white/95 backdrop-blur-md',
    panelBorder: 'border-slate-200/90',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-500',
    dotsClass: 'canvas-dots-light'
  },
  sepia: {
    name: 'Sépia Papier',
    bg: 'bg-[#fcf9f2]',
    canvasBg: '#fcf9f2',
    panelBg: 'bg-[#f5efe3]/95 backdrop-blur-md',
    panelBorder: 'border-[#e4d8c5]',
    textPrimary: 'text-[#2e261f]',
    textSecondary: 'text-[#7d6b58]',
    dotsClass: 'canvas-dots-warm'
  }
};
