import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Search,
  X,
  Target,
  Lightbulb,
  HelpCircle,
  CheckSquare,
  AlertTriangle,
  StickyNote,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  CornerDownLeft
} from 'lucide-react';
import { BlockType, MapNode, ThemeMode } from '../types';
import { BLOCK_CONFIGS, PRIORITY_CONFIGS, THEME_CONFIGS } from '../constants';

interface NodeSearchBarProps {
  nodes: MapNode[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectNode: (nodeId: string) => void;
  theme: ThemeMode;
  selectedNodeId?: string | null;
}

const TYPE_ICONS: Record<BlockType, React.ComponentType<{ className?: string }>> = {
  goal: Target,
  concept: Lightbulb,
  decision: HelpCircle,
  action: CheckSquare,
  risk: AlertTriangle,
  note: StickyNote
};

export const NodeSearchBar: React.FC<NodeSearchBarProps> = ({
  nodes,
  searchQuery,
  onSearchChange,
  onSelectNode,
  theme,
  selectedNodeId
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [typeFilter, setTypeFilter] = useState<BlockType | 'all'>('all');

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const themeConfig = THEME_CONFIGS[theme];
  const isDark = theme === 'midnight' || theme === 'dark';

  // Global shortcut (Ctrl+K, Cmd+K, or /) to focus search
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable);

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (e.key === '/' && !isInput) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter nodes based on query & type
  const filteredNodes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    let list = nodes;
    if (typeFilter !== 'all') {
      list = list.filter((n) => n.type === typeFilter);
    }

    if (!query) {
      return list;
    }

    return list
      .map((node) => {
        const titleMatch = node.title.toLowerCase().includes(query);
        const descMatch = node.description?.toLowerCase().includes(query) || false;
        const tagMatch = node.tags?.some((t) => t.toLowerCase().includes(query)) || false;
        const typeConfig = BLOCK_CONFIGS[node.type];
        const typeMatch = typeConfig?.label.toLowerCase().includes(query) || false;

        let score = 0;
        if (titleMatch) {
          score += node.title.toLowerCase().startsWith(query) ? 100 : 50;
        }
        if (descMatch) score += 20;
        if (tagMatch) score += 15;
        if (typeMatch) score += 10;

        return { node, score, titleMatch, descMatch, tagMatch };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.node);
  }, [nodes, searchQuery, typeFilter]);

  // Reset selected index when filtered list changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredNodes.length, searchQuery, typeFilter]);

  // Scroll active item into view
  useEffect(() => {
    if (isOpen && listRef.current) {
      const activeEl = listRef.current.children[selectedIndex] as HTMLElement | undefined;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex, isOpen]);

  const handleSelect = (nodeId: string) => {
    onSelectNode(nodeId);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else if (filteredNodes.length > 0) {
        setSelectedIndex((prev) => (prev + 1) % filteredNodes.length);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else if (filteredNodes.length > 0) {
        setSelectedIndex((prev) => (prev - 1 + filteredNodes.length) % filteredNodes.length);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredNodes.length > 0 && selectedIndex < filteredNodes.length) {
        handleSelect(filteredNodes[selectedIndex].id);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      if (searchQuery) {
        onSearchChange('');
      } else {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSearchChange('');
    inputRef.current?.focus();
  };

  const handleCycleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (filteredNodes.length === 0) return;
    const currentIdx = filteredNodes.findIndex((n) => n.id === selectedNodeId);
    const nextIdx = (currentIdx + 1) % filteredNodes.length;
    handleSelect(filteredNodes[nextIdx].id);
  };

  const handleCyclePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (filteredNodes.length === 0) return;
    const currentIdx = filteredNodes.findIndex((n) => n.id === selectedNodeId);
    const prevIdx = (currentIdx - 1 + filteredNodes.length) % filteredNodes.length;
    handleSelect(filteredNodes[prevIdx].id);
  };

  // Helper to highlight matching text in title
  const renderHighlightedText = (text: string, query: string) => {
    if (!query.trim()) return <span>{text}</span>;
    const trimmed = query.trim();
    const parts = text.split(new RegExp(`(${trimmed})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === trimmed.toLowerCase() ? (
            <mark
              key={i}
              className="bg-indigo-500/25 text-indigo-300 font-semibold px-0.5 rounded"
            >
              {part}
            </mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    );
  };

  const activeMatchedIndex = useMemo(() => {
    if (!selectedNodeId) return -1;
    return filteredNodes.findIndex((n) => n.id === selectedNodeId);
  }, [filteredNodes, selectedNodeId]);

  return (
    <div
      ref={containerRef}
      id="node-search-bar-container"
      className="relative flex-1 max-w-[180px] sm:max-w-[240px] md:max-w-[320px] lg:max-w-[380px]"
    >
      {/* Search Input Bar */}
      <div
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs transition-all duration-150 ${
          isOpen
            ? 'ring-2 ring-indigo-500/40 border-indigo-500 shadow-md'
            : isDark
            ? 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
            : 'border-slate-200 bg-slate-100/80 hover:border-slate-300'
        }`}
      >
        <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />

        <input
          ref={inputRef}
          id="nav-node-search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => {
            onSearchChange(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Rechercher un nœud..."
          className="w-full bg-transparent border-none outline-none text-xs text-inherit placeholder:text-slate-400 font-medium"
        />

        {/* Counter or clear or shortcuts */}
        {searchQuery ? (
          <div className="flex items-center gap-1 shrink-0">
            {filteredNodes.length > 0 && (
              <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-400">
                {activeMatchedIndex >= 0 ? `${activeMatchedIndex + 1}/` : ''}
                {filteredNodes.length}
              </span>
            )}

            {filteredNodes.length > 1 && (
              <div className="flex items-center text-slate-400">
                <button
                  type="button"
                  onClick={handleCyclePrev}
                  title="Nœud précédent (Haut)"
                  className="p-0.5 hover:text-indigo-400 cursor-pointer"
                >
                  <ChevronUp className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={handleCycleNext}
                  title="Nœud suivant (Bas)"
                  className="p-0.5 hover:text-indigo-400 cursor-pointer"
                >
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>
            )}

            <button
              type="button"
              id="nav-search-clear-btn"
              onClick={handleClear}
              title="Effacer la recherche (Échap)"
              className="p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 text-slate-400 hover:text-inherit cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <kbd
            onClick={() => inputRef.current?.focus()}
            className="hidden sm:inline-block text-[10px] font-mono font-medium px-1.5 py-0.5 rounded border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 text-slate-400 cursor-pointer shrink-0"
            title="Raccourci clavier"
          >
            ⌘K
          </kbd>
        )}
      </div>

      {/* Dropdown Results Panel */}
      {isOpen && (
        <div
          id="node-search-results-dropdown"
          className={`absolute left-0 top-full mt-1.5 w-[300px] sm:w-[380px] md:w-[440px] max-h-[440px] rounded-xl border shadow-2xl overflow-hidden z-50 flex flex-col backdrop-blur-xl animate-in fade-in-50 slide-in-from-top-1 ${
            isDark
              ? 'bg-[#0f172a]/95 border-slate-700/80 text-slate-100'
              : 'bg-white/95 border-slate-200 text-slate-900'
          }`}
        >
          {/* Filter Pills Header */}
          <div className="px-3 py-2 border-b border-black/5 dark:border-white/5 flex items-center justify-between gap-1 overflow-x-auto select-none">
            <div className="flex items-center gap-1 text-[11px]">
              <button
                type="button"
                onClick={() => setTypeFilter('all')}
                className={`px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${
                  typeFilter === 'all'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-inherit hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                Tous ({nodes.length})
              </button>
              {(['goal', 'concept', 'decision', 'action', 'risk', 'note'] as BlockType[]).map((type) => {
                const count = nodes.filter((n) => n.type === type).length;
                if (count === 0) return null;
                const config = BLOCK_CONFIGS[type];
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setTypeFilter(type)}
                    className={`px-2 py-0.5 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer ${
                      typeFilter === type
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-inherit hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    {config.label.split(' / ')[0]} ({count})
                  </button>
                );
              })}
            </div>

            <span className="text-[10px] font-mono text-slate-400 shrink-0 hidden sm:inline">
              {filteredNodes.length} résultat{filteredNodes.length > 1 ? 's' : ''}
            </span>
          </div>

          {/* Results List */}
          <div ref={listRef} className="overflow-y-auto max-h-[320px] p-1.5 divide-y divide-black/5 dark:divide-white/5">
            {filteredNodes.length === 0 ? (
              <div className="py-8 px-4 text-center">
                <Search className="w-8 h-8 mx-auto text-slate-400/50 mb-2" />
                <p className="text-xs font-semibold text-slate-300">
                  Aucun nœud correspondant à « {searchQuery} »
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Vérifiez l'orthographe ou changez de filtre de catégorie.
                </p>
              </div>
            ) : (
              filteredNodes.map((node, index) => {
                const isItemActive = index === selectedIndex;
                const isSelectedOnCanvas = node.id === selectedNodeId;
                const config = BLOCK_CONFIGS[node.type] || BLOCK_CONFIGS.concept;
                const IconComponent = TYPE_ICONS[node.type] || Lightbulb;
                const priorityConfig = node.priority ? PRIORITY_CONFIGS[node.priority] : null;

                return (
                  <div
                    key={node.id}
                    id={`search-item-${node.id}`}
                    onClick={() => handleSelect(node.id)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`group flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                      isItemActive
                        ? isDark
                          ? 'bg-indigo-600/20 text-white'
                          : 'bg-indigo-50 text-indigo-950'
                        : isSelectedOnCanvas
                        ? isDark
                          ? 'bg-white/5'
                          : 'bg-slate-100/80'
                        : 'hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    {/* Left: Icon & Node Details */}
                    <div className="flex items-start gap-2.5 min-w-0 flex-1">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-sm mt-0.5"
                        style={{ backgroundColor: `${node.color}25`, color: node.color }}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>

                      <div className="flex flex-col min-w-0 flex-1 text-left">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold truncate">
                            {renderHighlightedText(node.title, searchQuery)}
                          </span>

                          {isSelectedOnCanvas && (
                            <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-400">
                              Actuel
                            </span>
                          )}
                        </div>

                        {node.description && (
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">
                            {renderHighlightedText(node.description, searchQuery)}
                          </p>
                        )}

                        {/* Meta Tags / Badges */}
                        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                          <span
                            className={`text-[9px] font-semibold px-1.5 py-0.2 rounded ${config.badgeBg} ${config.badgeText}`}
                          >
                            {config.label.split(' / ')[0]}
                          </span>

                          {node.status && (
                            <span
                              className={`text-[9px] font-medium px-1.5 py-0.2 rounded ${
                                node.status === 'completed'
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : node.status === 'in_progress'
                                  ? 'bg-amber-500/20 text-amber-400'
                                  : 'bg-slate-500/20 text-slate-400'
                              }`}
                            >
                              {node.status === 'completed'
                                ? 'Terminé'
                                : node.status === 'in_progress'
                                ? 'En cours'
                                : 'Backlog'}
                            </span>
                          )}

                          {priorityConfig && (
                            <span
                              className={`text-[9px] font-medium px-1.5 py-0.2 rounded ${priorityConfig.color}`}
                            >
                              {priorityConfig.label}
                            </span>
                          )}

                          {node.tags &&
                            node.tags.slice(0, 2).map((tag, tIdx) => (
                              <span
                                key={tIdx}
                                className="text-[9px] text-slate-400 bg-black/10 dark:bg-white/5 px-1.5 py-0.2 rounded"
                              >
                                #{tag}
                              </span>
                            ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: Jump Action Indicator */}
                    <div className="flex items-center gap-1.5 shrink-0 text-slate-400 group-hover:text-indigo-400">
                      <span className="text-[10px] hidden sm:inline font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Aller au nœud
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer with keyboard hints */}
          <div className="px-3 py-2 border-t border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 flex items-center justify-between text-[10px] text-slate-400 select-none">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="font-mono bg-black/10 dark:bg-white/10 px-1 py-0.5 rounded">↑</kbd>
                <kbd className="font-mono bg-black/10 dark:bg-white/10 px-1 py-0.5 rounded">↓</kbd>
                Naviguer
              </span>
              <span className="flex items-center gap-1">
                <kbd className="font-mono bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                  <CornerDownLeft className="w-2.5 h-2.5" /> Entrée
                </kbd>
                Sélectionner
              </span>
            </div>
            <span className="flex items-center gap-1">
              <kbd className="font-mono bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded">Échap</kbd>
              Fermer
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
