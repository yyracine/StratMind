import React, { useState } from 'react';
import {
  X,
  Search,
  Target,
  Lightbulb,
  CheckSquare,
  HelpCircle,
  Scale,
  Sparkles,
  ArrowRight,
  Layers,
  Check,
  AlertTriangle,
  FolderPlus,
  Plus
} from 'lucide-react';
import { PredefinedNodeTemplate, ThemeMode, MapNode } from '../types';
import { PREDEFINED_NODE_TEMPLATES } from '../data/nodeTemplates';
import { THEME_CONFIGS, BLOCK_CONFIGS } from '../constants';

interface NodeTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTemplate: (
    template: PredefinedNodeTemplate,
    customTitle: string,
    connectToNodeId?: string
  ) => void;
  selectedNode: MapNode | null;
  theme: ThemeMode;
}

export const NodeTemplateModal: React.FC<NodeTemplateModalProps> = ({
  isOpen,
  onClose,
  onApplyTemplate,
  selectedNode,
  theme
}) => {
  if (!isOpen) return null;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTemplate, setActiveTemplate] = useState<PredefinedNodeTemplate>(
    PREDEFINED_NODE_TEMPLATES[0]
  );
  const [customTitle, setCustomTitle] = useState(
    PREDEFINED_NODE_TEMPLATES[0].defaultCentralTitle
  );
  const [shouldConnectToSelected, setShouldConnectToSelected] = useState<boolean>(
    Boolean(selectedNode)
  );

  const themeConfig = THEME_CONFIGS[theme];

  const categories = [
    { id: 'all', label: 'Tous les modèles' },
    { id: 'strategy', label: 'Stratégie' },
    { id: 'brainstorm', label: 'Brainstorming' },
    { id: 'critical_thinking', label: 'Pensée Critique' },
    { id: 'productivity', label: 'Productivité' }
  ];

  const filteredTemplates = PREDEFINED_NODE_TEMPLATES.filter((tpl) => {
    const matchesCategory =
      selectedCategory === 'all' || tpl.category === selectedCategory;
    const matchesSearch =
      tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.nodes.some(
        (n) =>
          n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    return matchesCategory && matchesSearch;
  });

  const handleSelectTemplate = (tpl: PredefinedNodeTemplate) => {
    setActiveTemplate(tpl);
    setCustomTitle(tpl.defaultCentralTitle);
  };

  const handleApply = () => {
    onApplyTemplate(
      activeTemplate,
      customTitle.trim() || activeTemplate.defaultCentralTitle,
      shouldConnectToSelected && selectedNode ? selectedNode.id : undefined
    );
    onClose();
  };

  // Render template icon
  const renderTemplateIcon = (iconName: string, className = 'w-5 h-5') => {
    switch (iconName) {
      case 'Target':
        return <Target className={className} />;
      case 'Lightbulb':
        return <Lightbulb className={className} />;
      case 'CheckSquare':
        return <CheckSquare className={className} />;
      case 'HelpCircle':
        return <HelpCircle className={className} />;
      case 'Scale':
        return <Scale className={className} />;
      default:
        return <Layers className={className} />;
    }
  };

  // Count node types in template
  const getNodeTypeCounts = (tpl: PredefinedNodeTemplate) => {
    const counts: Record<string, number> = {};
    tpl.nodes.forEach((n) => {
      counts[n.type] = (counts[n.type] || 0) + 1;
    });
    return counts;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="template-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none animate-fadeIn"
    >
      <div
        className={`w-full max-w-4xl max-h-[90vh] rounded-2xl border shadow-2xl flex flex-col overflow-hidden ${themeConfig.panelBg} ${themeConfig.panelBorder} text-inherit`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-black/5 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 text-white shadow-md">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 id="template-modal-title" className="font-bold text-base flex items-center gap-2">
                <span>Modèles Pré-définis de Nœuds & Grappes</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400">
                  {PREDEFINED_NODE_TEMPLATES.length} Frameworks
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Ajoutez instantanément un ensemble de nœuds reliés (SWOT, Brainstorming, 5 Pourquoi, OKRs...)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-slate-400 hover:text-inherit cursor-pointer transition-colors"
            title="Fermer (Échap)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Tabs */}
        <div className="p-4 border-b border-black/5 dark:border-white/10 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher un modèle (SWOT, Idéation...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 outline-none focus:border-indigo-500 text-inherit placeholder-slate-400"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-inherit hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Body: Split View (List + Detailed Preview / Configuration) */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12">
          {/* Left Column: Templates Grid (7 cols) */}
          <div className="md:col-span-7 p-4 overflow-y-auto space-y-3 border-r border-black/5 dark:border-white/10 max-h-[58vh]">
            {filteredTemplates.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                Aucun modèle ne correspond à votre recherche.
              </div>
            ) : (
              filteredTemplates.map((tpl) => {
                const isSelected = activeTemplate.id === tpl.id;
                const typeCounts = getNodeTypeCounts(tpl);

                return (
                  <div
                    key={tpl.id}
                    onClick={() => handleSelectTemplate(tpl)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer text-left group ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-500/10 shadow-md ring-1 ring-indigo-500/30'
                        : 'border-black/5 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="p-2.5 rounded-xl text-white shadow-sm"
                          style={{ backgroundColor: tpl.accentColor }}
                        >
                          {renderTemplateIcon(tpl.icon, 'w-4 h-4')}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-xs leading-snug">{tpl.name}</h3>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-black/10 dark:bg-white/10 uppercase font-mono text-slate-400">
                              {tpl.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">{tpl.subtitle}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-mono font-bold text-indigo-400 px-2 py-0.5 rounded-full bg-indigo-500/10">
                          {tpl.nodes.length} nœuds
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">
                      {tpl.description}
                    </p>

                    {/* Nodes Composition Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2.5 border-t border-black/5 dark:border-white/5">
                      {Object.entries(typeCounts).map(([type, count]) => {
                        const cfg = BLOCK_CONFIGS[type as keyof typeof BLOCK_CONFIGS];
                        if (!cfg) return null;
                        return (
                          <span
                            key={type}
                            className={`text-[9px] px-1.5 py-0.5 rounded-md font-medium flex items-center gap-1 ${cfg.badgeBg} ${cfg.badgeText}`}
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: cfg.defaultColor }}
                            />
                            <span>
                              {count} {cfg.label.split('/')[0]}
                            </span>
                          </span>
                        );
                      })}
                      <span className="text-[10px] text-slate-400 font-mono ml-auto">
                        {tpl.edges.length} liens
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: Template Inspector & Insertion Configuration (5 cols) */}
          <div className="md:col-span-5 p-5 flex flex-col justify-between overflow-y-auto bg-black/5 dark:bg-black/20 max-h-[58vh]">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: activeTemplate.accentColor }}
                  />
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    Configuration du Modèle
                  </span>
                </div>
                <h3 className="text-base font-bold">{activeTemplate.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{activeTemplate.description}</p>
              </div>

              {/* Title Customization Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  Titre du nœud central / Sujet
                </label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder={activeTemplate.defaultCentralTitle}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 outline-none focus:border-indigo-500 text-inherit font-medium shadow-sm"
                />
                <p className="text-[10px] text-slate-400">
                  Ce titre sera attribué au nœud pilote de la structure.
                </p>
              </div>

              {/* Attach to Selected Node Option if a node is currently selected */}
              {selectedNode && (
                <div className="p-3 rounded-xl border border-indigo-500/20 bg-indigo-500/5 space-y-2">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={shouldConnectToSelected}
                      onChange={(e) => setShouldConnectToSelected(e.target.checked)}
                      className="mt-0.5 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-indigo-400">
                        Connecter au nœud sélectionné
                      </span>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Relie automatiquement le sommet central à{' '}
                        <span className="font-semibold text-inherit">"{selectedNode.title}"</span>.
                      </p>
                    </div>
                  </label>
                </div>
              )}

              {/* Composition Preview */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Arborescence des {activeTemplate.nodes.length} nœuds générés
                </label>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {activeTemplate.nodes.map((node, i) => (
                    <div
                      key={i}
                      className="p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: node.color }}
                        />
                        <span className="truncate font-medium">
                          {i === 0 && customTitle.trim() ? customTitle : node.title}
                        </span>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 uppercase font-mono text-slate-400 shrink-0">
                        {node.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 mt-4 border-t border-black/5 dark:border-white/10 flex items-center gap-2">
              <button
                onClick={handleApply}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Insérer ce modèle sur le canvas</span>
              </button>
              <button
                onClick={onClose}
                className="px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-xs font-semibold cursor-pointer"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
