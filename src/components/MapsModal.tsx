import React, { useState } from 'react';
import {
  FolderOpen,
  X,
  Plus,
  Trash2,
  Copy,
  Upload,
  Download,
  Target,
  HelpCircle,
  TrendingUp,
  Atom,
  CheckCircle2,
  Calendar,
  Layers
} from 'lucide-react';
import { MapSummary, MindMap, ThemeMode } from '../types';
import { THEME_CONFIGS } from '../constants';

interface MapsModalProps {
  currentMapId: string;
  mapsList: MapSummary[];
  onSelectMap: (mapId: string) => void;
  onCreateNewMap: (title: string, category: MindMap['category'], templateId?: string) => void;
  onDeleteMap: (mapId: string) => void;
  onClose: () => void;
  onImportJSON: (jsonString: string) => void;
  theme: ThemeMode;
}

export const MapsModal: React.FC<MapsModalProps> = ({
  currentMapId,
  mapsList,
  onSelectMap,
  onCreateNewMap,
  onDeleteMap,
  onClose,
  onImportJSON,
  theme
}) => {
  const [activeTab, setActiveTab] = useState<'my_maps' | 'templates'>('my_maps');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<MindMap['category']>('strategy');
  const [searchQuery, setSearchQuery] = useState('');

  const themeConfig = THEME_CONFIGS[theme];

  const templates: {
    id: string;
    title: string;
    desc: string;
    category: MindMap['category'];
    icon: React.ComponentType<{ className?: string }>;
    accent: string;
  }[] = [
    {
      id: 'swot-analysis-matrix',
      title: 'Matrice SWOT Stratégique',
      desc: 'Forces, Faiblesses, Opportunités et Menaces articulées autour d\'un cap décisionnel.',
      category: 'strategy',
      icon: Target,
      accent: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
    },
    {
      id: 'critical-thinking-5whys',
      title: 'Les 5 Pourquoi (Causes Racines)',
      desc: 'Méthode d\'investigation critique pour remonter du symptôme à la cause fondamentale.',
      category: 'critical_thinking',
      icon: HelpCircle,
      accent: 'text-amber-400 bg-amber-500/10 border-amber-500/30'
    },
    {
      id: 'strategy-growth-2026',
      title: 'Stratégie de Croissance & Expansion',
      desc: 'Objectif maître, hypothèses marché, gestion des risques et plan opérationnel.',
      category: 'strategy',
      icon: TrendingUp,
      accent: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30'
    },
    {
      id: 'first-principles-template',
      title: 'Principes Premiers & Déconstruction',
      desc: 'Remise à plat sans présupposés historiques pour réinventer une offre ou une solution.',
      category: 'critical_thinking',
      icon: Atom,
      accent: 'text-purple-400 bg-purple-500/10 border-purple-500/30'
    }
  ];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onCreateNewMap(newTitle.trim(), newCategory);
    setNewTitle('');
    onClose();
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onImportJSON(content);
        onClose();
      }
    };
    reader.readAsText(file);
  };

  const filteredMaps = mapsList.filter(m =>
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none animate-fadeIn">
      <div
        className={`w-full max-w-2xl rounded-2xl border shadow-2xl p-6 ${themeConfig.panelBg} ${themeConfig.panelBorder} text-inherit flex flex-col max-h-[85vh]`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-black/5 dark:border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600/15 text-indigo-400 border border-indigo-500/20">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Gestionnaire de Cartes Stratégiques</h3>
              <p className="text-xs text-slate-400">
                Organisez, sauvegardez et dupliquez vos cartographies cognitives
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

        {/* Tabs */}
        <div className="flex items-center justify-between gap-2 border-b border-black/5 dark:border-white/10 pb-3 mb-4 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('my_maps')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'my_maps'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-inherit'
              }`}
            >
              Mes Cartes Actives ({mapsList.length})
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'templates'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-inherit'
              }`}
            >
              Modèles & Frameworks
            </button>
          </div>

          {/* Import JSON */}
          <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer text-xs font-medium">
            <Upload className="w-3.5 h-3.5 text-indigo-400" />
            <span>Importer JSON</span>
            <input type="file" accept=".json" onChange={handleFileInput} className="hidden" />
          </label>
        </div>

        {/* Tab 1: My Maps */}
        {activeTab === 'my_maps' && (
          <div className="flex-1 overflow-y-auto pr-1 space-y-4">
            {/* Create New Inline Form */}
            <form onSubmit={handleCreate} className="flex gap-2 p-2 rounded-xl bg-black/5 dark:bg-black/20 border border-black/5 dark:border-white/5">
              <input
                type="text"
                placeholder="Titre de la nouvelle carte..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="flex-1 text-xs px-3 py-1.5 rounded-lg bg-transparent border border-black/10 dark:border-white/10 outline-none text-inherit focus:border-indigo-500"
              />
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="text-xs px-2 py-1.5 rounded-lg bg-black/10 dark:bg-slate-800 border border-black/10 dark:border-white/10 outline-none text-inherit"
              >
                <option value="strategy">Stratégie</option>
                <option value="critical_thinking">Pensée Critique</option>
                <option value="productivity">Productivité</option>
                <option value="brainstorm">Brainstorming</option>
              </select>
              <button
                type="submit"
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Créer</span>
              </button>
            </form>

            {/* Maps List */}
            <div className="space-y-2">
              {filteredMaps.map((m) => {
                const isCurrent = m.id === currentMapId;
                return (
                  <div
                    key={m.id}
                    className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                      isCurrent
                        ? 'border-indigo-500 bg-indigo-500/10 shadow-sm'
                        : 'border-black/5 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20'
                    }`}
                  >
                    <div
                      onClick={() => {
                        onSelectMap(m.id);
                        onClose();
                      }}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-xs text-inherit">{m.title}</span>
                        {isCurrent && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold">
                            Actuelle
                          </span>
                        )}
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-black/10 dark:bg-white/10 uppercase font-mono text-slate-400">
                          {m.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{m.description}</p>
                      <div className="text-[10px] text-slate-400 font-mono mt-1 flex items-center gap-3">
                        <span>{m.nodeCount} nœuds</span>
                        <span>{m.edgeCount} connexions</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          onSelectMap(m.id);
                          onClose();
                        }}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                          isCurrent
                            ? 'bg-indigo-600 text-white'
                            : 'border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5'
                        }`}
                      >
                        {isCurrent ? 'Ouverte' : 'Ouvrir'}
                      </button>

                      {mapsList.length > 1 && (
                        <button
                          onClick={() => onDeleteMap(m.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-500/15 text-rose-400 cursor-pointer"
                          title="Supprimer la carte"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Framework Templates */}
        {activeTab === 'templates' && (
          <div className="flex-1 overflow-y-auto pr-1 space-y-3">
            <p className="text-xs text-slate-400 mb-2">
              Démarrez une nouvelle carte structurée selon une méthodologie de réflexion éprouvée :
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {templates.map((tpl) => {
                const Icon = tpl.icon;
                return (
                  <div
                    key={tpl.id}
                    className={`p-4 rounded-xl border ${themeConfig.panelBg} ${themeConfig.panelBorder} hover:border-indigo-500/40 transition-all flex flex-col justify-between`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`p-1.5 rounded-lg border ${tpl.accent}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <h5 className="font-bold text-xs">{tpl.title}</h5>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                        {tpl.desc}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        onCreateNewMap(tpl.title, tpl.category, tpl.id);
                        onClose();
                      }}
                      className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Utiliser ce Modèle</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
