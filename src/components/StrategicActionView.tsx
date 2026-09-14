import React, { useState } from 'react';
import {
  CheckSquare,
  Target,
  AlertTriangle,
  HelpCircle,
  Calendar,
  User,
  Plus,
  ArrowRight,
  Sparkles,
  Check,
  Clock,
  FileDown
} from 'lucide-react';
import { MapNode, MindMap, PriorityLevel, TaskStatus, ThemeMode } from '../types';
import { THEME_CONFIGS, PRIORITY_CONFIGS } from '../constants';

interface StrategicActionViewProps {
  map: MindMap;
  theme: ThemeMode;
  onUpdateNode: (updated: Partial<MapNode> & { id: string }) => void;
  onNavigateToNodeOnCanvas: (nodeId: string) => void;
  onExportMarkdown: () => void;
}

export const StrategicActionView: React.FC<StrategicActionViewProps> = ({
  map,
  theme,
  onUpdateNode,
  onNavigateToNodeOnCanvas,
  onExportMarkdown
}) => {
  const themeConfig = THEME_CONFIGS[theme];

  const actionNodes = map.nodes.filter(n => n.type === 'action');
  const goalNodes = map.nodes.filter(n => n.type === 'goal');
  const riskNodes = map.nodes.filter(n => n.type === 'risk');
  const decisionNodes = map.nodes.filter(n => n.type === 'decision');

  const completedCount = actionNodes.filter(n => n.status === 'completed').length;
  const inProgressCount = actionNodes.filter(n => n.status === 'in_progress').length;
  const backlogCount = actionNodes.filter(n => n.status === 'backlog' || !n.status).length;
  const progressPercent = actionNodes.length > 0 ? Math.round((completedCount / actionNodes.length) * 100) : 0;

  const urgentRisks = riskNodes.filter(r => r.priority === 'urgent' || r.priority === 'high');

  const handleStatusChange = (nodeId: string, newStatus: TaskStatus) => {
    onUpdateNode({ id: nodeId, status: newStatus });
  };

  const columns: { status: TaskStatus; title: string; color: string; count: number }[] = [
    { status: 'backlog', title: 'À Planifier (Backlog)', color: 'text-slate-400 border-slate-700', count: backlogCount },
    { status: 'in_progress', title: 'En Cours d\'Exécution', color: 'text-amber-400 border-amber-500/40', count: inProgressCount },
    { status: 'completed', title: 'Terminé / Validé', color: 'text-emerald-400 border-emerald-500/40', count: completedCount }
  ];

  return (
    <div
      id="strategic-action-view"
      className={`h-[calc(100vh-3.5rem)] overflow-y-auto p-4 md:p-8 transition-colors duration-200 select-none ${themeConfig.bg} ${themeConfig.textPrimary}`}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Summary Banner */}
        <div
          className={`p-6 rounded-2xl border shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${themeConfig.panelBg} ${themeConfig.panelBorder}`}
        >
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 font-mono">
                Feuille de Route Stratégique
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 font-semibold">
                {map.category.toUpperCase()}
              </span>
            </div>
            <h2 className="text-2xl font-bold font-display tracking-tight">{map.title}</h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">{map.description}</p>
          </div>

          {/* KPI and Progress widget */}
          <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
            <div className="text-center">
              <div className="text-2xl font-bold font-mono text-emerald-400">
                {progressPercent}%
              </div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">
                Taux de Réalisation
              </div>
            </div>

            <div className="h-10 w-[1px] bg-slate-300 dark:bg-slate-800" />

            <div className="text-center">
              <div className="text-2xl font-bold font-mono text-indigo-400">
                {actionNodes.length}
              </div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">
                Actions Identifiées
              </div>
            </div>

            <div className="h-10 w-[1px] bg-slate-300 dark:bg-slate-800" />

            <button
              onClick={onExportMarkdown}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
            >
              <FileDown className="w-4 h-4" />
              <span>Exporter en Synthèse</span>
            </button>
          </div>
        </div>

        {/* Strategic Overview Row: Goals & Urgent Risks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Goals / Objectives */}
          <div className={`p-5 rounded-2xl border ${themeConfig.panelBg} ${themeConfig.panelBorder}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-indigo-400">
                <Target className="w-4 h-4" /> Objectifs Stratégiques & KPIs ({goalNodes.length})
              </span>
            </div>
            <div className="space-y-2">
              {goalNodes.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Aucun objectif défini sur cette carte.</p>
              ) : (
                goalNodes.map(g => (
                  <div
                    key={g.id}
                    onClick={() => onNavigateToNodeOnCanvas(g.id)}
                    className="p-3 rounded-xl border border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-500/10 transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-xs text-inherit">{g.title}</div>
                      {g.description && <div className="text-[11px] text-slate-400 mt-0.5">{g.description}</div>}
                    </div>
                    <ArrowRight className="w-4 h-4 text-indigo-400 opacity-60 hover:opacity-100" />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Risks & Friction */}
          <div className={`p-5 rounded-2xl border ${themeConfig.panelBg} ${themeConfig.panelBorder}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-rose-400">
                <AlertTriangle className="w-4 h-4" /> Risques Majeurs & Points de Friction ({riskNodes.length})
              </span>
            </div>
            <div className="space-y-2">
              {riskNodes.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Aucun risque formalisé pour l'instant.</p>
              ) : (
                riskNodes.map(r => (
                  <div
                    key={r.id}
                    onClick={() => onNavigateToNodeOnCanvas(r.id)}
                    className="p-3 rounded-xl border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-xs text-inherit flex items-center gap-2">
                        <span>{r.title}</span>
                        {r.priority && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 uppercase font-mono">
                            {r.priority}
                          </span>
                        )}
                      </div>
                      {r.description && <div className="text-[11px] text-slate-400 mt-0.5">{r.description}</div>}
                    </div>
                    <ArrowRight className="w-4 h-4 text-rose-400 opacity-60 hover:opacity-100" />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Action Board (Kanban Columns) */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-emerald-400" />
              <span>Tableau Opérationnel d'Exécution</span>
            </h3>
            <span className="text-xs text-slate-400">
              Glissez ou cliquez pour changer l'état d'avancement
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {columns.map(col => {
              const colNodes = actionNodes.filter(n => (n.status || 'backlog') === col.status);
              return (
                <div
                  key={col.status}
                  className={`p-4 rounded-2xl border ${themeConfig.panelBg} ${themeConfig.panelBorder} flex flex-col min-h-[360px]`}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-black/5 dark:border-white/10 mb-3">
                    <span className={`font-bold text-xs uppercase tracking-wider ${col.color}`}>
                      {col.title}
                    </span>
                    <span className="w-5 h-5 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center text-[10px] font-mono font-bold">
                      {colNodes.length}
                    </span>
                  </div>

                  <div className="space-y-3 flex-1">
                    {colNodes.length === 0 ? (
                      <div className="h-32 flex items-center justify-center text-xs text-slate-400 italic">
                        Aucune tâche dans cette colonne.
                      </div>
                    ) : (
                      colNodes.map(node => (
                        <div
                          key={node.id}
                          className="p-3.5 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-black/30 shadow-sm hover:shadow-md transition-all group"
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h5 className="font-bold text-xs leading-snug">{node.title}</h5>
                            {node.priority && (
                              <span
                                className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold uppercase ${
                                  PRIORITY_CONFIGS[node.priority].color
                                }`}
                              >
                                {PRIORITY_CONFIGS[node.priority].label}
                              </span>
                            )}
                          </div>

                          {node.description && (
                            <p className="text-[11px] text-slate-400 mb-2 leading-relaxed">
                              {node.description}
                            </p>
                          )}

                          <div className="flex flex-wrap items-center justify-between text-[10px] gap-2 pt-2 border-t border-black/5 dark:border-white/5">
                            <div className="flex items-center gap-2 text-slate-400">
                              {node.assignee && (
                                <span className="flex items-center gap-1 text-indigo-400">
                                  <User className="w-3 h-3" />
                                  {node.assignee}
                                </span>
                              )}
                              {node.dueDate && (
                                <span className="flex items-center gap-1 text-amber-400 font-mono">
                                  <Calendar className="w-3 h-3" />
                                  {node.dueDate}
                                </span>
                              )}
                            </div>

                            {/* Status mover buttons */}
                            <div className="flex items-center gap-1">
                              {col.status !== 'backlog' && (
                                <button
                                  onClick={() => handleStatusChange(node.id, 'backlog')}
                                  className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 text-[9px] hover:bg-white/20 cursor-pointer"
                                  title="Passer en Backlog"
                                >
                                  ← Backlog
                                </button>
                              )}
                              {col.status !== 'in_progress' && (
                                <button
                                  onClick={() => handleStatusChange(node.id, 'in_progress')}
                                  className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9px] hover:bg-amber-500/30 cursor-pointer"
                                  title="Passer En Cours"
                                >
                                  En Cours
                                </button>
                              )}
                              {col.status !== 'completed' && (
                                <button
                                  onClick={() => handleStatusChange(node.id, 'completed')}
                                  className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] hover:bg-emerald-500/30 cursor-pointer"
                                  title="Marquer Terminé"
                                >
                                  ✓ Terminer
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
