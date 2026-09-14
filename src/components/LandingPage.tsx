import React, { useState } from 'react';
import {
  BrainCircuit,
  ArrowRight,
  Compass,
  Sparkles,
  Target,
  CheckSquare,
  AlertTriangle,
  HelpCircle,
  Lightbulb,
  Zap,
  Layers,
  ShieldCheck,
  Users,
  Eye,
  TrendingUp,
  Workflow,
  MousePointer,
  ChevronRight
} from 'lucide-react';
import { ThemeMode } from '../types';
import { THEME_CONFIGS } from '../constants';

interface LandingPageProps {
  onStartApp: (templateId?: string) => void;
  theme: ThemeMode;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartApp, theme }) => {
  const [activeTab, setActiveTab] = useState<'strategy' | 'critical' | 'execution' | 'collab'>('strategy');
  const [interactivePos, setInteractivePos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const themeConfig = THEME_CONFIGS[theme];

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - interactivePos.x, y: e.clientY - interactivePos.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setInteractivePos({
      x: Math.max(-120, Math.min(120, e.clientX - dragStart.x)),
      y: Math.max(-60, Math.min(60, e.clientY - dragStart.y))
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const useCases = [
    {
      id: 'leadership',
      title: 'Comités de Direction & Stratégie',
      desc: 'Aligner la vision globale, cartographier les arbitrages critiques et lever les ambiguïtés avant les investissements.',
      metric: '-45% de temps en réunions de cadrage',
      icon: Target,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20'
    },
    {
      id: 'product',
      title: 'Product Managers & Discovery',
      desc: 'Déconstruire les problématiques utilisateurs, cartographier les hypothèses et tester la cohérence de la roadmap.',
      metric: 'Validation rapide des hypothèses',
      icon: Compass,
      color: 'text-sky-400 bg-sky-500/10 border-sky-500/20'
    },
    {
      id: 'consulting',
      title: 'Conseil & Résolution de Problèmes',
      desc: 'Appliquer des cadres rigoureux (5 Pourquoi, First Principles, SWOT) pour déceler les causes racines invisibles.',
      metric: 'Livrables visuels ultra-convaincants',
      icon: Workflow,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20'
    },
    {
      id: 'execution',
      title: 'Équipes Opérationnelles & Sprints',
      desc: 'Transformer instantanément un brainstorm spatial en tâches concrètes, avec priorités, échéances et responsables.',
      metric: 'Zéro déperdition d\'idées',
      icon: CheckSquare,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    }
  ];

  return (
    <div
      id="landing-page"
      className={`h-[calc(100vh-3.5rem)] overflow-y-auto transition-colors duration-200 ${themeConfig.bg} ${themeConfig.textPrimary}`}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Hero Section */}
      <section className="relative px-6 py-12 md:py-20 max-w-6xl mx-auto flex flex-col items-center text-center">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 bg-indigo-500/15 blur-3xl -z-10 pointer-events-none rounded-full" />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Cartographie Mentale & Pensée Critique Nouvelle Génération</span>
        </div>

        {/* Title */}
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight max-w-4xl leading-[1.15] mb-6">
          Transformez le chaos d'idées en <br className="hidden sm:inline" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400">
            décisions stratégiques limpides.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl font-normal leading-relaxed mb-8">
          La fluidité spatiale et l'ergonomie visuelle de <strong className="text-inherit font-semibold">Miró</strong>,
          optimisées pour la rigueur de la pensée critique, la modélisation d'hypothèses et l'exécution opérationnelle.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mb-14">
          <button
            id="landing-cta-start-canvas"
            onClick={() => onStartApp()}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/35 transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            <span>Ouvrir le Canvas Studio</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            id="landing-cta-template-swot"
            onClick={() => onStartApp('swot-analysis-matrix')}
            className={`flex items-center gap-2 px-5 py-3.5 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
              theme === 'light' || theme === 'sepia'
                ? 'bg-white border-slate-300 hover:bg-slate-50 text-slate-800'
                : 'bg-slate-800/80 border-slate-700 hover:bg-slate-800 text-slate-200'
            }`}
          >
            <Target className="w-4 h-4 text-emerald-400" />
            <span>Matrice SWOT</span>
          </button>

          <button
            id="landing-cta-template-whys"
            onClick={() => onStartApp('critical-thinking-5whys')}
            className={`flex items-center gap-2 px-5 py-3.5 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
              theme === 'light' || theme === 'sepia'
                ? 'bg-white border-slate-300 hover:bg-slate-50 text-slate-800'
                : 'bg-slate-800/80 border-slate-700 hover:bg-slate-800 text-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>Méthode des 5 Pourquoi</span>
          </button>
        </div>

        {/* Interactive Miro-like Preview Showcase Card */}
        <div
          id="landing-interactive-showcase"
          className={`w-full max-w-4xl rounded-2xl border p-4 md:p-6 shadow-2xl relative overflow-hidden text-left ${themeConfig.panelBg} ${themeConfig.panelBorder}`}
        >
          <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-3 mb-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-2 font-mono font-medium text-slate-300">Démonstration Interactive : Drag & Connect</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono">
                WebSockets Sync 60fps
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-400 mb-4 flex items-center gap-1.5">
            <MousePointer className="w-3.5 h-3.5 text-indigo-400" />
            <span>Glissez le bloc central pour observer la fluidité géométrique et vectorielle des connecteurs :</span>
          </p>

          {/* Interactive Micro-Board Area */}
          <div className="relative h-64 md:h-72 rounded-xl bg-slate-950/60 border border-slate-800/80 overflow-hidden canvas-dots-dark">
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
              {/* Connector from Left to Center */}
              <path
                d={`M 150 130 C 230 130, ${280 + interactivePos.x} ${130 + interactivePos.y}, ${340 + interactivePos.x} ${130 + interactivePos.y}`}
                fill="none"
                stroke="#6366f1"
                strokeWidth="2.5"
                strokeDasharray="4 4"
              />
              {/* Connector from Center to Right */}
              <path
                d={`M ${500 + interactivePos.x} ${130 + interactivePos.y} C ${570 + interactivePos.x} ${130 + interactivePos.y}, 620 90, 680 90`}
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
              />
              {/* Connector from Center to Bottom Right */}
              <path
                d={`M ${500 + interactivePos.x} ${150 + interactivePos.y} C ${570 + interactivePos.x} ${170 + interactivePos.y}, 620 200, 680 200`}
                fill="none"
                stroke="#ef4444"
                strokeWidth="2.5"
                strokeDasharray="6 3"
              />
            </svg>

            {/* Fixed Left Node */}
            <div className="absolute left-6 top-20 w-44 p-3 rounded-xl bg-slate-900/90 border border-sky-500/40 shadow-md text-white text-xs select-none">
              <div className="flex items-center gap-1.5 text-sky-400 font-semibold mb-1">
                <Lightbulb className="w-3.5 h-3.5" /> Concept Source
              </div>
              <div className="font-bold text-slate-100">Besoins Marché 2026</div>
              <div className="text-[10px] text-slate-400 mt-1">Exigence de rapidité et clarté</div>
            </div>

            {/* Interactive Draggable Center Node */}
            <div
              onMouseDown={handleMouseDown}
              style={{
                transform: `translate(${interactivePos.x}px, ${interactivePos.y}px)`,
                cursor: isDragging ? 'grabbing' : 'grab'
              }}
              className="absolute left-[340px] top-[90px] w-52 p-3.5 rounded-xl bg-gradient-to-b from-indigo-950/90 to-slate-900 border-2 border-indigo-500 shadow-xl shadow-indigo-500/20 text-white text-xs select-none z-20 transition-shadow hover:shadow-indigo-500/35"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="flex items-center gap-1 text-indigo-400 font-bold text-[11px]">
                  <Target className="w-3.5 h-3.5" /> Objectif Maître
                </span>
                <span className="px-1.5 py-0.2 text-[9px] rounded bg-rose-500/20 text-rose-300 font-semibold uppercase">
                  Critique
                </span>
              </div>
              <div className="font-bold text-slate-100 text-xs">Déployer StratMind</div>
              <div className="text-[10px] text-slate-400 mt-1">Déplacez-moi librement sur le canvas !</div>
            </div>

            {/* Right Top Action Node */}
            <div className="absolute right-6 top-10 w-44 p-3 rounded-xl bg-slate-900/90 border border-emerald-500/40 shadow-md text-white text-xs select-none">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
                <CheckSquare className="w-3.5 h-3.5" /> Plan d'Action
              </div>
              <div className="font-bold text-slate-100">MVP Haute Vitesse</div>
              <div className="text-[10px] text-emerald-400 mt-1 font-mono">Statut : En cours</div>
            </div>

            {/* Right Bottom Risk Node */}
            <div className="absolute right-6 top-36 w-44 p-3 rounded-xl bg-slate-900/90 border border-rose-500/40 shadow-md text-white text-xs select-none">
              <div className="flex items-center gap-1.5 text-rose-400 font-semibold mb-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Risque Clé
              </div>
              <div className="font-bold text-slate-100">Surcharge Cognitive</div>
              <div className="text-[10px] text-rose-400 mt-1">Mitigation : Vue filtrée</div>
            </div>

            {/* Subtle simulated peer cursor */}
            <div className="absolute right-40 bottom-6 flex items-center gap-1.5 pointer-events-none animate-pulse">
              <div className="w-3 h-3 border-l-2 border-t-2 border-emerald-400 -rotate-45" />
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500 text-black font-semibold">
                Alex (Stratège)
              </span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between text-xs gap-3">
            <span className="text-slate-400 font-medium">
              Prêt à explorer votre propre cartographie stratégique ?
            </span>
            <button
              onClick={() => onStartApp()}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all cursor-pointer"
            >
              Passer en plein écran
            </button>
          </div>
        </div>
      </section>

      {/* 4 Pillars of StratMind */}
      <section className="px-6 py-14 max-w-6xl mx-auto border-t border-black/5 dark:border-white/10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight mb-3">
            Pourquoi StratMind plutôt qu'un outil de dessin générique ?
          </h2>
          <p className="text-sm text-slate-400">
            La plupart des tableaux blancs virtuels sont des toiles passives. StratMind intègre nativement des modèles de pensée critique pour guider vos arbitrages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`p-5 rounded-2xl border transition-all hover:scale-[1.02] ${themeConfig.panelBg} ${themeConfig.panelBorder}`}>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4 border border-indigo-500/20">
              <Workflow className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base mb-2">Expérience Spatiale Miró</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Zoom fluide au pointeur, déplacement libre des nœuds, alignements magnétiques et connecteurs vectoriels beziers courbés sans saccades.
            </p>
          </div>

          <div className={`p-5 rounded-2xl border transition-all hover:scale-[1.02] ${themeConfig.panelBg} ${themeConfig.panelBorder}`}>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4 border border-purple-500/20">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base mb-2">Pensée Critique Active</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Détectez vos angles morts avec le Red Teaming, remontez aux causes profondes avec les 5 Pourquoi et testez la solidité de vos hypothèses.
            </p>
          </div>

          <div className={`p-5 rounded-2xl border transition-all hover:scale-[1.02] ${themeConfig.panelBg} ${themeConfig.panelBorder}`}>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/20">
              <CheckSquare className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base mb-2">Passage Direct à l'Action</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Basculez d'un clic du canvas visuel à la vue Kanban d'exécution. Les post-its et idées deviennent des tâches cadencées avec statut et priorité.
            </p>
          </div>

          <div className={`p-5 rounded-2xl border transition-all hover:scale-[1.02] ${themeConfig.panelBg} ${themeConfig.panelBorder}`}>
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-4 border border-sky-500/20">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base mb-2">Multi-Joueur & Temps Réel</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Moteur WebSockets avec curseurs de présence, synchronisation instantanée multi-fenêtres, zéro conflit et mode sombre personnalisable.
            </p>
          </div>
        </div>
      </section>

      {/* Cas d'usage détaillés */}
      <section className="px-6 py-14 max-w-6xl mx-auto border-t border-black/5 dark:border-white/10">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-semibold uppercase text-indigo-400 mb-1 tracking-wider">
              Cas d'Usage Concrets
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
              Pensé pour chaque décision stratégique
            </h2>
          </div>
          <button
            onClick={() => onStartApp()}
            className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
          >
            <span>Démarrer immédiatement</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {useCases.map((uc) => {
            const IconComponent = uc.icon;
            return (
              <div
                key={uc.id}
                className={`p-6 rounded-2xl border transition-all hover:border-indigo-500/40 ${themeConfig.panelBg} ${themeConfig.panelBorder}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-xl border ${uc.color}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-semibold">
                    {uc.metric}
                  </span>
                </div>
                <h3 className="text-base font-bold mb-2">{uc.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{uc.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="px-6 py-16 text-center max-w-4xl mx-auto border-t border-black/5 dark:border-white/10 mb-12">
        <div className="p-8 rounded-3xl bg-gradient-to-tr from-indigo-950/60 via-slate-900 to-indigo-900/40 border border-indigo-500/30 text-white shadow-2xl">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold mb-3">
            Passez de la réflexion dispersée au plan d'action validé.
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mb-6">
            Aucun compte requis pour démarrer. Ouvrez une carte, invitez vos pairs ou testez un cadre de pensée critique en quelques secondes.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onStartApp()}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md transition-all cursor-pointer"
            >
              Lancer le Canvas Desktop
            </button>
            <button
              onClick={() => onStartApp('strategy-growth-2026')}
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/20 transition-all cursor-pointer"
            >
              Charger l'Exemple Stratégique Q3/Q4
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
