import React, { useState, useRef } from 'react';
import {
  Target,
  Lightbulb,
  HelpCircle,
  CheckSquare,
  AlertTriangle,
  StickyNote,
  Check,
  Calendar,
  User,
  Plus,
  Trash2,
  Sparkles,
  Link as LinkIcon
} from 'lucide-react';
import { MapNode, PriorityLevel, TaskStatus, ThemeMode } from '../types';
import { BLOCK_CONFIGS, PRIORITY_CONFIGS } from '../constants';

interface NodeItemProps {
  node: MapNode;
  isSelected: boolean;
  theme: ThemeMode;
  onSelect: (nodeId: string, e: React.MouseEvent) => void;
  onUpdate: (updated: Partial<MapNode> & { id: string }) => void;
  onDelete: (nodeId: string) => void;
  onStartConnect: (nodeId: string, handlePos: { x: number; y: number }, e: React.MouseEvent) => void;
  onOpenAIForNode: (node: MapNode) => void;
  scale: number;
  isSearchMatched?: boolean;
  isSearchDimmed?: boolean;
}

export const NodeItem: React.FC<NodeItemProps> = ({
  node,
  isSelected,
  theme,
  onSelect,
  onUpdate,
  onDelete,
  onStartConnect,
  onOpenAIForNode,
  scale,
  isSearchMatched,
  isSearchDimmed
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(node.title);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [descValue, setDescValue] = useState(node.description || '');

  const blockConfig = BLOCK_CONFIGS[node.type] || BLOCK_CONFIGS.concept;
  const priorityConfig = node.priority ? PRIORITY_CONFIGS[node.priority] : null;

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    if (titleValue.trim() && titleValue !== node.title) {
      onUpdate({ id: node.id, title: titleValue.trim() });
    } else {
      setTitleValue(node.title);
    }
  };

  const handleDescSubmit = () => {
    setIsEditingDesc(false);
    if (descValue !== node.description) {
      onUpdate({ id: node.id, description: descValue.trim() });
    }
  };

  const toggleTaskStatus = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextStatus: TaskStatus =
      node.status === 'completed' ? 'backlog' : node.status === 'backlog' ? 'in_progress' : 'completed';
    onUpdate({ id: node.id, status: nextStatus });
  };

  // Render block icon
  const renderIcon = () => {
    const iconProps = { className: 'w-3.5 h-3.5' };
    switch (node.type) {
      case 'goal':
        return <Target {...iconProps} />;
      case 'decision':
        return <HelpCircle {...iconProps} />;
      case 'action':
        return <CheckSquare {...iconProps} />;
      case 'risk':
        return <AlertTriangle {...iconProps} />;
      case 'note':
        return <StickyNote {...iconProps} />;
      default:
        return <Lightbulb {...iconProps} />;
    }
  };

  const isSticky = node.type === 'note';
  const shape = node.shape || 'rectangle';

  const nodeWidth = shape === 'circle' ? 240 : shape === 'diamond' ? 260 : (isSticky ? 220 : 260);
  const nodeHeight = shape === 'circle' ? 240 : shape === 'diamond' ? 220 : undefined;

  // Exact anchor positions for connecting edges
  const topAnchor = {
    x: node.x + (shape === 'circle' ? 120 : shape === 'diamond' ? 130 : (isSticky ? 110 : 130)),
    y: node.y
  };
  const rightAnchor = {
    x: node.x + (shape === 'circle' ? 240 : shape === 'diamond' ? 260 : (isSticky ? 220 : 260)),
    y: node.y + (shape === 'circle' ? 120 : shape === 'diamond' ? 110 : 60)
  };
  const bottomAnchor = {
    x: node.x + (shape === 'circle' ? 120 : shape === 'diamond' ? 130 : (isSticky ? 110 : 130)),
    y: node.y + (shape === 'circle' ? 240 : shape === 'diamond' ? 220 : 120)
  };
  const leftAnchor = {
    x: node.x,
    y: node.y + (shape === 'circle' ? 120 : shape === 'diamond' ? 110 : 60)
  };

  // Common background/theme styling
  const isLightTheme = theme === 'light' || theme === 'sepia';

  return (
    <div
      id={`node-${node.id}`}
      onClick={(e) => onSelect(node.id, e)}
      style={{
        transform: `translate(${node.x}px, ${node.y}px)`,
        width: nodeWidth,
        height: nodeHeight,
        borderColor: shape !== 'diamond' && isSelected ? node.color : undefined
      }}
      className={`absolute pointer-events-auto select-none cursor-pointer transition-all duration-200 group ${
        shape === 'diamond'
          ? 'relative'
          : shape === 'circle'
          ? `rounded-full flex flex-col items-center justify-center p-4 text-center ${
              isSticky
                ? 'bg-amber-100 dark:bg-amber-950/85 border-2 border-amber-300 dark:border-amber-700/70 shadow-lg text-slate-900 dark:text-amber-100'
                : isLightTheme
                ? 'bg-white/95 border-2 border-slate-200/90 shadow-md text-slate-800'
                : 'bg-slate-900/95 border-2 border-slate-800/90 shadow-lg text-slate-100'
            }`
          : `rounded-2xl ${
              isSticky
                ? 'bg-amber-100 dark:bg-amber-950/80 border-2 border-amber-300 dark:border-amber-700/70 shadow-lg text-slate-900 dark:text-amber-100 rotate-[-0.8deg] hover:rotate-0'
                : isLightTheme
                ? 'bg-white/95 border-2 border-slate-200/90 shadow-md text-slate-800'
                : 'bg-slate-900/90 border-2 border-slate-800/90 shadow-lg text-slate-100'
            }`
      } ${
        shape !== 'diamond' && isSelected
          ? 'ring-2 ring-offset-2 ring-indigo-500 shadow-xl shadow-indigo-500/25 z-20'
          : shape !== 'diamond' && isSearchMatched
          ? 'ring-2 ring-offset-1 ring-amber-400 dark:ring-amber-300 shadow-xl shadow-amber-500/25 z-10'
          : isSearchDimmed
          ? 'opacity-30 hover:opacity-100 hover:z-10'
          : shape !== 'diamond'
          ? 'hover:shadow-md hover:border-slate-400/50'
          : ''
      }`}
    >
      {/* Diamond SVG Background Layer */}
      {shape === 'diamond' && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
          viewBox="0 0 260 220"
        >
          {/* Subtle Outer Drop-Shadow / Glow */}
          <polygon
            points="130,5 255,110 130,215 5,110"
            fill={
              isSticky
                ? isLightTheme
                  ? '#fef3c7'
                  : '#451a03'
                : isLightTheme
                ? '#ffffff'
                : '#0f172a'
            }
            fillOpacity={isLightTheme ? 0.98 : 0.95}
            stroke={
              isSelected
                ? node.color
                : isSearchMatched
                ? '#f59e0b'
                : isLightTheme
                ? '#cbd5e1'
                : '#334155'
            }
            strokeWidth={isSelected ? 3 : isSearchMatched ? 2.5 : 2}
            strokeLinejoin="round"
            className="transition-colors duration-200"
          />
          {/* Selection Ring for Diamond */}
          {isSelected && (
            <polygon
              points="130,1 259,110 130,219 1,110"
              fill="none"
              stroke="#6366f1"
              strokeWidth="2"
              strokeDasharray="4 3"
              strokeOpacity="0.8"
            />
          )}
          {isSearchMatched && !isSelected && (
            <polygon
              points="130,2 258,110 130,218 2,110"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2"
              strokeOpacity="0.9"
            />
          )}
        </svg>
      )}

      {/* Search match badge */}
      {isSearchMatched && !isSelected && (
        <div className="absolute -top-2.5 -right-2 z-30 flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[9px] font-bold shadow-md shadow-amber-500/30">
          <span>Trouvé</span>
        </div>
      )}

      {/* 4 Connection Ports (Appear on hover or when selected) */}
      {/* Top Handle */}
      <div
        className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-white dark:bg-slate-800 border-2 border-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-crosshair z-30 hover:scale-125 shadow-sm"
        title="Glisser pour connecter"
        onMouseDown={(e) => {
          e.stopPropagation();
          onStartConnect(node.id, topAnchor, e);
        }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 pointer-events-none" />
      </div>

      {/* Right Handle */}
      <div
        className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white dark:bg-slate-800 border-2 border-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-crosshair z-30 hover:scale-125 shadow-sm"
        title="Glisser pour connecter"
        onMouseDown={(e) => {
          e.stopPropagation();
          onStartConnect(node.id, rightAnchor, e);
        }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 pointer-events-none" />
      </div>

      {/* Bottom Handle */}
      <div
        className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-white dark:bg-slate-800 border-2 border-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-crosshair z-30 hover:scale-125 shadow-sm"
        title="Glisser pour connecter"
        onMouseDown={(e) => {
          e.stopPropagation();
          onStartConnect(node.id, bottomAnchor, e);
        }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 pointer-events-none" />
      </div>

      {/* Left Handle */}
      <div
        className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white dark:bg-slate-800 border-2 border-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-crosshair z-30 hover:scale-125 shadow-sm"
        title="Glisser pour connecter"
        onMouseDown={(e) => {
          e.stopPropagation();
          onStartConnect(node.id, leftAnchor, e);
        }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 pointer-events-none" />
      </div>

      {/* Content Rendering: Dedicated inner layouts for Rectangle, Circle, and Diamond */}
      {shape === 'circle' ? (
        <div className="relative z-10 w-full flex flex-col items-center justify-center px-3 py-2 max-w-[195px] text-center">
          {/* Top badges */}
          <div className="flex items-center gap-1.5 mb-1.5 flex-wrap justify-center">
            <div
              className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-semibold uppercase"
              style={{
                backgroundColor: `${node.color}20`,
                color: node.color
              }}
            >
              {renderIcon()}
              <span>{blockConfig.label.split('/')[0]}</span>
            </div>

            {priorityConfig && (
              <span
                className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase border ${priorityConfig.color} ${priorityConfig.border}`}
              >
                {priorityConfig.label}
              </span>
            )}
          </div>

          {/* Action Task Status Checkbox (if type === 'action') */}
          {node.type === 'action' && (
            <div
              onClick={toggleTaskStatus}
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[10px] mb-1.5 font-medium transition-colors cursor-pointer ${
                node.status === 'completed'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 line-through'
                  : node.status === 'in_progress'
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  : 'bg-slate-500/15 text-slate-400 border border-slate-500/20'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                  node.status === 'completed'
                    ? 'bg-emerald-500 border-emerald-500 text-black'
                    : 'border-slate-400'
                }`}
              >
                {node.status === 'completed' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
              </div>
              <span className="truncate">
                {node.status === 'completed'
                  ? 'Terminé'
                  : node.status === 'in_progress'
                  ? 'En cours'
                  : 'À planifier'}
              </span>
            </div>
          )}

          {/* Title */}
          {isEditingTitle ? (
            <input
              autoFocus
              type="text"
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleTitleSubmit();
                if (e.key === 'Escape') {
                  setTitleValue(node.title);
                  setIsEditingTitle(false);
                }
              }}
              className="w-full text-center text-xs font-bold bg-transparent border-b border-indigo-500 outline-none pb-0.5 text-inherit"
            />
          ) : (
            <h4
              onDoubleClick={(e) => {
                e.stopPropagation();
                setIsEditingTitle(true);
              }}
              className={`text-xs font-bold leading-tight tracking-tight line-clamp-2 ${
                node.status === 'completed' ? 'line-through opacity-70' : ''
              }`}
              title="Double-clic pour renommer"
            >
              {node.title}
            </h4>
          )}

          {/* Description */}
          {isEditingDesc ? (
            <textarea
              autoFocus
              rows={2}
              value={descValue}
              onChange={(e) => setDescValue(e.target.value)}
              onBlur={handleDescSubmit}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setDescValue(node.description || '');
                  setIsEditingDesc(false);
                }
              }}
              className="w-full text-[10px] mt-1 p-1 rounded bg-black/10 dark:bg-black/30 border border-indigo-500/40 outline-none text-inherit resize-none text-center"
            />
          ) : (
            node.description && (
              <p
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  setIsEditingDesc(true);
                }}
                className="text-[10px] opacity-75 mt-1 line-clamp-2 leading-tight"
                title="Double-clic pour modifier"
              >
                {node.description}
              </p>
            )
          )}

          {/* Footer Details */}
          {((node.tags && node.tags.length > 0) || node.dueDate || node.assignee) && (
            <div className="mt-1.5 flex flex-wrap items-center justify-center gap-1 text-[8px]">
              {node.tags.slice(0, 2).map((t, idx) => (
                <span
                  key={idx}
                  className="px-1 py-0.2 rounded bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 font-mono opacity-80"
                >
                  #{t}
                </span>
              ))}

              {node.dueDate && (
                <span className="flex items-center gap-0.5 text-[8px] text-amber-400 font-mono">
                  <Calendar className="w-2 h-2" />
                  {node.dueDate.slice(5)}
                </span>
              )}

              {node.assignee && (
                <span className="flex items-center gap-0.5 text-[8px] text-indigo-400 truncate max-w-[70px]">
                  <User className="w-2 h-2" />
                  {node.assignee}
                </span>
              )}
            </div>
          )}
        </div>
      ) : shape === 'diamond' ? (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-10 py-5 text-center">
          {/* Top badges */}
          <div className="flex items-center gap-1 mb-1 justify-center">
            <div
              className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase"
              style={{
                backgroundColor: `${node.color}20`,
                color: node.color
              }}
            >
              {renderIcon()}
              <span>{blockConfig.label.split('/')[0]}</span>
            </div>

            {priorityConfig && (
              <span
                className={`text-[8px] px-1.5 py-0.2 rounded-full font-bold uppercase border ${priorityConfig.color} ${priorityConfig.border}`}
              >
                {priorityConfig.label}
              </span>
            )}
          </div>

          {/* Action Task Status Checkbox (if type === 'action') */}
          {node.type === 'action' && (
            <div
              onClick={toggleTaskStatus}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] mb-1 font-medium transition-colors cursor-pointer ${
                node.status === 'completed'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 line-through'
                  : node.status === 'in_progress'
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  : 'bg-slate-500/15 text-slate-400 border border-slate-500/20'
              }`}
            >
              <div
                className={`w-3 h-3 rounded flex items-center justify-center border ${
                  node.status === 'completed'
                    ? 'bg-emerald-500 border-emerald-500 text-black'
                    : 'border-slate-400'
                }`}
              >
                {node.status === 'completed' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
              </div>
              <span className="truncate max-w-[100px]">
                {node.status === 'completed' ? 'Terminé' : node.status === 'in_progress' ? 'En cours' : 'À planifier'}
              </span>
            </div>
          )}

          {/* Title */}
          {isEditingTitle ? (
            <input
              autoFocus
              type="text"
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleTitleSubmit();
                if (e.key === 'Escape') {
                  setTitleValue(node.title);
                  setIsEditingTitle(false);
                }
              }}
              className="w-full text-center text-xs font-bold bg-transparent border-b border-indigo-500 outline-none pb-0.5 text-inherit"
            />
          ) : (
            <h4
              onDoubleClick={(e) => {
                e.stopPropagation();
                setIsEditingTitle(true);
              }}
              className={`text-xs font-bold leading-tight tracking-tight line-clamp-2 max-w-[170px] ${
                node.status === 'completed' ? 'line-through opacity-70' : ''
              }`}
              title="Double-clic pour renommer"
            >
              {node.title}
            </h4>
          )}

          {/* Description */}
          {isEditingDesc ? (
            <textarea
              autoFocus
              rows={2}
              value={descValue}
              onChange={(e) => setDescValue(e.target.value)}
              onBlur={handleDescSubmit}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setDescValue(node.description || '');
                  setIsEditingDesc(false);
                }
              }}
              className="w-full text-[10px] mt-1 p-1 rounded bg-black/10 dark:bg-black/30 border border-indigo-500/40 outline-none text-inherit resize-none text-center"
            />
          ) : (
            node.description && (
              <p
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  setIsEditingDesc(true);
                }}
                className="text-[10px] opacity-75 mt-1 line-clamp-2 leading-tight max-w-[170px]"
                title="Double-clic pour modifier"
              >
                {node.description}
              </p>
            )
          )}

          {/* Footer Details */}
          {((node.tags && node.tags.length > 0) || node.dueDate || node.assignee) && (
            <div className="mt-1 flex flex-wrap items-center justify-center gap-1 text-[8px]">
              {node.tags.slice(0, 2).map((t, idx) => (
                <span
                  key={idx}
                  className="px-1 py-0.2 rounded bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 font-mono opacity-80"
                >
                  #{t}
                </span>
              ))}

              {node.dueDate && (
                <span className="flex items-center gap-0.5 text-[8px] text-amber-400 font-mono">
                  <Calendar className="w-2 h-2" />
                  {node.dueDate.slice(5)}
                </span>
              )}

              {node.assignee && (
                <span className="flex items-center gap-0.5 text-[8px] text-indigo-400 truncate max-w-[65px]">
                  <User className="w-2 h-2" />
                  {node.assignee}
                </span>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Classic Rectangle Layout */
        <>
          {/* Top Header Stripe */}
          <div className="p-3 pb-2">
            <div className="flex items-center justify-between mb-2">
              {/* Block Type Badge */}
              <div
                className="flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide uppercase"
                style={{
                  backgroundColor: `${node.color}20`,
                  color: node.color
                }}
              >
                {renderIcon()}
                <span>{blockConfig.label.split('/')[0]}</span>
              </div>

              {/* Priority Pill */}
              {priorityConfig && (
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase border ${priorityConfig.color} ${priorityConfig.border}`}
                >
                  {priorityConfig.label}
                </span>
              )}
            </div>

            {/* Action Task Status Checkbox (if type === 'action') */}
            {node.type === 'action' && (
              <div
                onClick={toggleTaskStatus}
                className={`flex items-center gap-2 px-2 py-1 rounded-lg text-xs mb-2 font-medium transition-colors cursor-pointer ${
                  node.status === 'completed'
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 line-through'
                    : node.status === 'in_progress'
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    : 'bg-slate-500/15 text-slate-400 border border-slate-500/20'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center border ${
                    node.status === 'completed'
                      ? 'bg-emerald-500 border-emerald-500 text-black'
                      : 'border-slate-400'
                  }`}
                >
                  {node.status === 'completed' && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span>
                  {node.status === 'completed'
                    ? 'Tâche Réalisée'
                    : node.status === 'in_progress'
                    ? 'En cours d\'exécution'
                    : 'À planifier (Backlog)'}
                </span>
              </div>
            )}

            {/* Title Editing / Viewing */}
            {isEditingTitle ? (
              <input
                autoFocus
                type="text"
                value={titleValue}
                onChange={(e) => setTitleValue(e.target.value)}
                onBlur={handleTitleSubmit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleTitleSubmit();
                  if (e.key === 'Escape') {
                    setTitleValue(node.title);
                    setIsEditingTitle(false);
                  }
                }}
                className="w-full text-xs font-bold bg-transparent border-b border-indigo-500 outline-none pb-0.5 text-inherit"
              />
            ) : (
              <h4
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  setIsEditingTitle(true);
                }}
                className={`text-xs font-bold leading-snug tracking-tight ${
                  node.status === 'completed' ? 'line-through opacity-70' : ''
                }`}
                title="Double-clic pour renommer"
              >
                {node.title}
              </h4>
            )}

            {/* Description Editing / Viewing */}
            {isEditingDesc ? (
              <textarea
                autoFocus
                rows={2}
                value={descValue}
                onChange={(e) => setDescValue(e.target.value)}
                onBlur={handleDescSubmit}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setDescValue(node.description || '');
                    setIsEditingDesc(false);
                  }
                }}
                className="w-full text-[11px] mt-1.5 p-1 rounded bg-black/10 dark:bg-black/30 border border-indigo-500/40 outline-none text-inherit resize-none"
              />
            ) : (
              node.description && (
                <p
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    setIsEditingDesc(true);
                  }}
                  className="text-[11px] opacity-75 mt-1.5 line-clamp-3 leading-relaxed"
                  title="Double-clic pour modifier"
                >
                  {node.description}
                </p>
              )
            )}
          </div>

          {/* Footer Details: Tags, Due Date, Assignee */}
          {((node.tags && node.tags.length > 0) || node.dueDate || node.assignee) && (
            <div className="px-3 pb-2.5 pt-1 flex flex-wrap items-center gap-1.5 border-t border-black/5 dark:border-white/5 text-[10px]">
              {node.tags.map((t, idx) => (
                <span
                  key={idx}
                  className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 font-mono text-[9px] opacity-80"
                >
                  #{t}
                </span>
              ))}

              {node.dueDate && (
                <span className="flex items-center gap-1 text-[9px] text-amber-400 font-mono">
                  <Calendar className="w-2.5 h-2.5" />
                  {node.dueDate}
                </span>
              )}

              {node.assignee && (
                <span className="flex items-center gap-1 text-[9px] text-indigo-400">
                  <User className="w-2.5 h-2.5" />
                  {node.assignee}
                </span>
              )}
            </div>
          )}
        </>
      )}

      {/* Floating Quick Action Overlay when Selected */}
      {isSelected && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute -bottom-9 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-slate-900 border border-slate-700/90 rounded-lg p-1 shadow-2xl z-40 text-slate-300"
        >
          <button
            onClick={() => onOpenAIForNode(node)}
            className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"
            title="Développer avec la Pensée Critique / IA"
          >
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>Développer</span>
          </button>

          <button
            onClick={() => onDelete(node.id)}
            className="p-1 rounded hover:bg-rose-500/20 text-rose-400 cursor-pointer"
            title="Supprimer le nœud"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};
