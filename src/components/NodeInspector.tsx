import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Trash2,
  Copy,
  Calendar,
  User,
  Tag,
  Palette,
  Flag,
  CheckSquare,
  AlertCircle,
  Layers,
  Square,
  Circle,
  Diamond,
  Shapes
} from 'lucide-react';
import { BlockType, MapNode, NodeShape, PriorityLevel, TaskStatus, ThemeMode } from '../types';
import { BLOCK_CONFIGS, COLOR_SWATCHES, NODE_SHAPE_CONFIGS, PRIORITY_CONFIGS, THEME_CONFIGS } from '../constants';

interface NodeInspectorProps {
  node: MapNode | null;
  onClose: () => void;
  onUpdate: (updated: Partial<MapNode> & { id: string }) => void;
  onDelete: (id: string) => void;
  onDuplicate: (node: MapNode) => void;
  onOpenAI: (node: MapNode) => void;
  onOpenTemplateForNode?: (node: MapNode) => void;
  theme: ThemeMode;
}

export const NodeInspector: React.FC<NodeInspectorProps> = ({
  node,
  onClose,
  onUpdate,
  onDelete,
  onDuplicate,
  onOpenAI,
  onOpenTemplateForNode,
  theme
}) => {
  if (!node) return null;

  const [newTag, setNewTag] = useState('');
  const themeConfig = THEME_CONFIGS[theme];

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTag.trim()) return;
    const tag = newTag.trim().replace(/^#/, '');
    if (!node.tags.includes(tag)) {
      onUpdate({ id: node.id, tags: [...node.tags, tag] });
    }
    setNewTag('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onUpdate({ id: node.id, tags: node.tags.filter(t => t !== tagToRemove) });
  };

  return (
    <div
      id="node-inspector-panel"
      className={`fixed top-20 right-6 w-80 rounded-2xl border shadow-2xl p-4 z-30 transition-all select-none ${themeConfig.panelBg} ${themeConfig.panelBorder} text-inherit`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-black/5 dark:border-white/10 mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-3.5 h-3.5 rounded-full"
            style={{ backgroundColor: node.color }}
          />
          <span className="font-bold text-xs uppercase tracking-wider text-slate-400">
            Propriétés du Nœud
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-slate-400 hover:text-inherit cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4 max-h-[calc(100vh-14rem)] overflow-y-auto pr-1">
        {/* Title & Description */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Titre
          </label>
          <input
            type="text"
            value={node.title}
            onChange={(e) => onUpdate({ id: node.id, title: e.target.value })}
            className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-black/20 outline-none focus:border-indigo-500 text-inherit"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Description / Contexte
          </label>
          <textarea
            rows={3}
            value={node.description || ''}
            onChange={(e) => onUpdate({ id: node.id, description: e.target.value })}
            placeholder="Détails stratégiques, critères ou métriques..."
            className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-black/20 outline-none focus:border-indigo-500 text-inherit resize-none"
          />
        </div>

        {/* Block Type Picker */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Type de Bloc
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {(Object.keys(BLOCK_CONFIGS) as BlockType[]).map((typeKey) => {
              const cfg = BLOCK_CONFIGS[typeKey];
              const isSelected = node.type === typeKey;
              return (
                <button
                  key={typeKey}
                  onClick={() => onUpdate({ id: node.id, type: typeKey, color: cfg.defaultColor })}
                  className={`p-1.5 rounded-lg border text-[10px] font-medium text-center truncate cursor-pointer transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-500/15 text-indigo-400 font-bold'
                      : 'border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 text-slate-400'
                  }`}
                >
                  {cfg.label.split('/')[0]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Node Shape Selector */}
        <div id="node-shape-selector">
          <div className="flex items-center justify-between mb-1.5">
            <label className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <Shapes className="w-3 h-3" /> Forme Géométrique
            </label>
            <span className="text-[10px] text-indigo-400 font-semibold">
              {NODE_SHAPE_CONFIGS[node.shape || 'rectangle']?.label}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {(['rectangle', 'circle', 'diamond'] as NodeShape[]).map((shapeKey) => {
              const shapeCfg = NODE_SHAPE_CONFIGS[shapeKey];
              const isSelected = (node.shape || 'rectangle') === shapeKey;
              return (
                <button
                  key={shapeKey}
                  type="button"
                  id={`shape-select-${shapeKey}`}
                  onClick={() => onUpdate({ id: node.id, shape: shapeKey })}
                  title={shapeCfg.description}
                  className={`flex flex-col items-center justify-center py-2 px-1.5 rounded-xl border text-center cursor-pointer transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-500/15 text-indigo-400 font-bold ring-1 ring-indigo-500/40 shadow-sm'
                      : 'border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="mb-1 flex items-center justify-center">
                    {shapeKey === 'rectangle' && <Square className="w-4 h-4" />}
                    {shapeKey === 'circle' && <Circle className="w-4 h-4" />}
                    {shapeKey === 'diamond' && <Diamond className="w-4 h-4" />}
                  </div>
                  <span className="text-[11px] leading-tight font-semibold">{shapeCfg.label}</span>
                  <span className="text-[9px] opacity-60 leading-tight mt-0.5 truncate max-w-full">
                    {shapeCfg.sublabel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Color Palette */}
        <div>
          <label className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            <Palette className="w-3 h-3" /> Couleur Thématique
          </label>
          <div className="flex items-center gap-2">
            {COLOR_SWATCHES.map((color) => (
              <button
                key={color}
                onClick={() => onUpdate({ id: node.id, color })}
                style={{ backgroundColor: color }}
                className={`w-6 h-6 rounded-full transition-transform cursor-pointer ${
                  node.color === color ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-slate-900' : 'hover:scale-110 opacity-80'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Priority Selector */}
        <div>
          <label className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            <Flag className="w-3 h-3" /> Niveau de Priorité
          </label>
          <div className="grid grid-cols-4 gap-1">
            {(['low', 'medium', 'high', 'urgent'] as PriorityLevel[]).map((p) => {
              const pCfg = PRIORITY_CONFIGS[p];
              const isSelected = node.priority === p;
              return (
                <button
                  key={p}
                  onClick={() => onUpdate({ id: node.id, priority: p })}
                  className={`py-1 rounded text-[10px] font-semibold border transition-all cursor-pointer ${
                    isSelected
                      ? `${pCfg.color} ${pCfg.border} ring-1 ring-indigo-400`
                      : 'border-black/5 dark:border-white/5 opacity-60 hover:opacity-100'
                  }`}
                >
                  {pCfg.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Task Status (if action block) */}
        {node.type === 'action' && (
          <div>
            <label className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              <CheckSquare className="w-3 h-3 text-emerald-400" /> Statut d'Exécution
            </label>
            <div className="grid grid-cols-3 gap-1">
              {[
                { key: 'backlog', label: 'À planifier' },
                { key: 'in_progress', label: 'En cours' },
                { key: 'completed', label: 'Terminé' }
              ].map((s) => (
                <button
                  key={s.key}
                  onClick={() => onUpdate({ id: node.id, status: s.key as TaskStatus })}
                  className={`py-1 rounded text-[10px] font-semibold border cursor-pointer ${
                    node.status === s.key
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'border-black/5 dark:border-white/5 opacity-60 hover:opacity-100'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Assignee & Due Date */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              <User className="w-3 h-3" /> Responsable
            </label>
            <input
              type="text"
              placeholder="ex: Alex / PM"
              value={node.assignee || ''}
              onChange={(e) => onUpdate({ id: node.id, assignee: e.target.value })}
              className="w-full text-xs px-2 py-1 rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-black/20 outline-none focus:border-indigo-500 text-inherit"
            />
          </div>

          <div>
            <label className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              <Calendar className="w-3 h-3" /> Échéance
            </label>
            <input
              type="date"
              value={node.dueDate || ''}
              onChange={(e) => onUpdate({ id: node.id, dueDate: e.target.value })}
              className="w-full text-xs px-2 py-1 rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-black/20 outline-none focus:border-indigo-500 text-inherit"
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            <Tag className="w-3 h-3" /> Étiquettes
          </label>
          <div className="flex flex-wrap gap-1 mb-2">
            {node.tags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[10px] font-mono"
              >
                #{t}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(t)}
                  className="hover:text-rose-400 cursor-pointer"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            ))}
          </div>
          <form onSubmit={handleAddTag} className="flex gap-1">
            <input
              type="text"
              placeholder="Ajouter tag..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="flex-1 text-xs px-2 py-1 rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-black/20 outline-none text-inherit"
            />
            <button
              type="submit"
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"
            >
              +
            </button>
          </form>
        </div>

        {/* AI Strategic Assist & Template Expansion Buttons */}
        <div className="pt-2 border-t border-black/5 dark:border-white/10 space-y-2">
          {onOpenTemplateForNode && (
            <button
              onClick={() => onOpenTemplateForNode(node)}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 font-semibold text-xs transition-all cursor-pointer"
              title="Créer une grappe de nœuds connectée à ce nœud"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>Développer via un Modèle (SWOT, OKR...)</span>
            </button>
          )}

          <button
            onClick={() => onOpenAI(node)}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Assistant Pensée Critique & Stratégie</span>
          </button>
        </div>

        {/* Duplicate & Delete Actions */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => onDuplicate(node)}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-xs font-medium cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Dupliquer</span>
          </button>
          <button
            onClick={() => onDelete(node.id)}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-medium cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Supprimer</span>
          </button>
        </div>
      </div>
    </div>
  );
};
