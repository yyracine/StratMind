import React, { useState } from 'react';
import {
  Sparkles,
  X,
  ShieldAlert,
  ListOrdered,
  HelpCircle,
  Atom,
  ArrowRight,
  Check,
  Loader2
} from 'lucide-react';
import { MapNode, ThemeMode } from '../types';
import { THEME_CONFIGS } from '../constants';

interface AIAssistModalProps {
  node: MapNode;
  onClose: () => void;
  onApplyBranches: (
    parentNode: MapNode,
    branches: { type: MapNode['type']; title: string; desc: string; color: string; priority: MapNode['priority'] }[]
  ) => void;
  theme: ThemeMode;
}

type AssistMode = 'red_team' | 'action_plan' | '5_whys' | 'first_principles';

export const AIAssistModal: React.FC<AIAssistModalProps> = ({
  node,
  onClose,
  onApplyBranches,
  theme
}) => {
  const [assistMode, setAssistMode] = useState<AssistMode>('red_team');
  const [loading, setLoading] = useState(false);
  const [generatedBranches, setGeneratedBranches] = useState<
    { type: MapNode['type']; title: string; desc: string; color: string; priority: MapNode['priority'] }[] | null
  >(null);

  const themeConfig = THEME_CONFIGS[theme];

  const frameworks: {
    id: AssistMode;
    title: string;
    desc: string;
    icon: React.ComponentType<{ className?: string }>;
    accent: string;
  }[] = [
    {
      id: 'red_team',
      title: 'Red Teaming & Biais Cognitifs',
      desc: 'Détecte les contradictions, vulnérabilités et angles morts cachés.',
      icon: ShieldAlert,
      accent: 'text-rose-400 bg-rose-500/10 border-rose-500/30'
    },
    {
      id: 'action_plan',
      title: 'Découpage Opérationnel (Plan d\'Action)',
      desc: 'Transforme l\'idée en 3 jalons d\'exécution concrets et mesurables.',
      icon: ListOrdered,
      accent: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
    },
    {
      id: '5_whys',
      title: 'Les 5 Pourquoi (Causes Racines)',
      desc: 'Remonte jusqu\'à la cause première et fondamentale du blocage.',
      icon: HelpCircle,
      accent: 'text-amber-400 bg-amber-500/10 border-amber-500/30'
    },
    {
      id: 'first_principles',
      title: 'Principes Premiers (First Principles)',
      desc: 'Déconstruit le sujet jusqu\'aux vérités de base incontestables.',
      icon: Atom,
      accent: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30'
    }
  ];

  const handleGenerate = async () => {
    setLoading(true);
    setGeneratedBranches(null);
    try {
      const res = await fetch('/api/ai/strategic-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nodeTitle: node.title,
          nodeType: node.type,
          nodeDescription: node.description,
          assistMode,
          mapTheme: 'Stratégie & Pensée Critique'
        })
      });
      const data = await res.json();
      if (data.branches && data.branches.length > 0) {
        setGeneratedBranches(data.branches);
      }
    } catch (err) {
      console.error('Erreur appel IA assist:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInsert = () => {
    if (generatedBranches && generatedBranches.length > 0) {
      onApplyBranches(node, generatedBranches);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none animate-fadeIn">
      <div
        className={`w-full max-w-xl rounded-2xl border shadow-2xl p-6 ${themeConfig.panelBg} ${themeConfig.panelBorder} text-inherit`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-black/5 dark:border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-base">Assistant Stratégie & Pensée Critique</h3>
              <p className="text-xs text-slate-400">
                Nœud sélectionné : <span className="font-semibold text-inherit">"{node.title}"</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-slate-400 hover:text-inherit cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Framework Selection */}
        <div className="mb-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            1. Choisissez un cadre de raisonnement
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {frameworks.map((fw) => {
              const Icon = fw.icon;
              const isSelected = assistMode === fw.id;
              return (
                <button
                  key={fw.id}
                  onClick={() => {
                    setAssistMode(fw.id);
                    setGeneratedBranches(null);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-500/15 shadow-sm'
                      : 'border-black/5 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`p-1.5 rounded-lg border ${fw.accent}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-semibold text-xs leading-tight">{fw.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">{fw.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Generate Button */}
        {!generatedBranches && (
          <button
            disabled={loading}
            onClick={handleGenerate}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analyse critique et génération en cours...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Générer les ramifications stratégiques</span>
              </>
            )}
          </button>
        )}

        {/* Generated Preview */}
        {generatedBranches && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                2. Branches stratégiques générées ({generatedBranches.length})
              </label>
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="text-[11px] text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3" /> Régénérer
              </button>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {generatedBranches.map((b, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-black/30 flex items-start justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: b.color }}
                      />
                      <span className="font-bold">{b.title}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-black/10 dark:bg-white/10 font-mono uppercase">
                        {b.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Insertion Button */}
            <div className="flex items-center gap-2 pt-2 border-t border-black/5 dark:border-white/10">
              <button
                onClick={handleInsert}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Insérer et connecter sur la carte</span>
              </button>
              <button
                onClick={onClose}
                className="px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-xs font-semibold cursor-pointer"
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
