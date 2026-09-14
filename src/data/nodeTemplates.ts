import { PredefinedNodeTemplate } from '../types';

export const PREDEFINED_NODE_TEMPLATES: PredefinedNodeTemplate[] = [
  {
    id: 'swot-analysis',
    name: 'Matrice SWOT Complète',
    subtitle: 'Forces, Faiblesses, Opportunités & Menaces',
    description: 'Structure stratégique à 4 quadrants articulée autour d\'un axe de décision ou d\'un produit.',
    category: 'strategy',
    icon: 'Target',
    accentColor: '#10b981',
    defaultCentralTitle: 'Analyse SWOT : [Votre Sujet / Produit]',
    nodes: [
      {
        relativeX: 0,
        relativeY: 0,
        type: 'goal',
        title: 'Analyse SWOT : [Votre Sujet / Produit]',
        description: 'Diagnostic stratégique interne et externe pour orienter la prise de décision.',
        color: '#6366f1',
        priority: 'urgent',
        tags: ['SWOT', 'Diagnostic', 'Stratégie']
      },
      {
        relativeX: -360,
        relativeY: -150,
        type: 'concept',
        title: '💪 Forces (Strengths)',
        description: 'Avantages concurrentiels, compétences clés, technologie propriétaire et actifs uniques.',
        color: '#10b981',
        priority: 'high',
        tags: ['Interne', 'Forces']
      },
      {
        relativeX: 360,
        relativeY: -150,
        type: 'risk',
        title: '⚠️ Faiblesses (Weaknesses)',
        description: 'Dette technique, limites de bande passante, dépendances critiques ou lacunes de compétences.',
        color: '#f59e0b',
        priority: 'high',
        tags: ['Interne', 'Faiblesses']
      },
      {
        relativeX: -360,
        relativeY: 150,
        type: 'goal',
        title: '🚀 Opportunités (Opportunities)',
        description: 'Évolutions du marché, nouvelles attentes clients, faiblesses des concurrents ou partenariats.',
        color: '#0ea5e9',
        priority: 'medium',
        tags: ['Externe', 'Opportunités']
      },
      {
        relativeX: 360,
        relativeY: 150,
        type: 'risk',
        title: '🛡️ Menaces (Threats)',
        description: 'Arrivée de nouveaux entrants, risques réglementaires, instabilité économique ou churn.',
        color: '#ef4444',
        priority: 'urgent',
        tags: ['Externe', 'Menaces']
      }
    ],
    edges: [
      { sourceIndex: 0, targetIndex: 1, label: 'Forces internes', color: '#10b981', style: 'curved', direction: 'forward' },
      { sourceIndex: 0, targetIndex: 2, label: 'Faiblesses internes', color: '#f59e0b', style: 'curved', direction: 'forward' },
      { sourceIndex: 0, targetIndex: 3, label: 'Leviers marché', color: '#0ea5e9', style: 'curved', direction: 'forward' },
      { sourceIndex: 0, targetIndex: 4, label: 'Menaces externes', color: '#ef4444', style: 'curved', direction: 'forward' }
    ]
  },
  {
    id: 'brainstorming-bubbles',
    name: 'Bulles de Brainstorming & Idéation',
    subtitle: 'Grappe d\'idées divergentes et convergentes',
    description: 'Dispersion radiale d\'idées créatives : rupture, quick wins, insights terrain et hypothèses.',
    category: 'brainstorm',
    icon: 'Lightbulb',
    accentColor: '#0ea5e9',
    defaultCentralTitle: 'Session Brainstorming : [Challenge Clé]',
    nodes: [
      {
        relativeX: 0,
        relativeY: 0,
        type: 'concept',
        title: 'Session Brainstorming : [Challenge Clé]',
        description: 'Comment pourrions-nous résoudre ce problème sous un angle inédit ?',
        color: '#0ea5e9',
        priority: 'high',
        tags: ['Idéation', 'Challenge']
      },
      {
        relativeX: -360,
        relativeY: -160,
        type: 'concept',
        title: '💡 Idée de Rupture (Moonshot)',
        description: 'Approche non conventionnelle qui remet en cause les règles établies de l\'industrie.',
        color: '#8b5cf6',
        priority: 'high',
        tags: ['Rupture', 'Innovation']
      },
      {
        relativeX: 360,
        relativeY: -160,
        type: 'action',
        title: '⚡ Quick Win (Impact Immédiat)',
        description: 'Solution simple déployable en moins de 48h sans ressource technique lourde.',
        color: '#10b981',
        priority: 'urgent',
        status: 'in_progress',
        tags: ['QuickWin', 'Action']
      },
      {
        relativeX: 380,
        relativeY: 150,
        type: 'goal',
        title: '🌟 Expérience Utilisateur Idéale',
        description: 'Scénario idéal où l\'effort cognitif de l\'utilisateur final est réduit à zéro.',
        color: '#0ea5e9',
        priority: 'medium',
        tags: ['UX', 'Valeur']
      },
      {
        relativeX: -360,
        relativeY: 150,
        type: 'decision',
        title: '❓ Hypothèse & Doute à Valider',
        description: 'Quelle est la conviction sous-jacente la plus risquée à tester en premier ?',
        color: '#ec4899',
        priority: 'high',
        tags: ['Hypothèse', 'Arbitrage']
      },
      {
        relativeX: 0,
        relativeY: 270,
        type: 'note',
        title: '📝 Verbatim & Insight Utilisateur',
        description: '"Les utilisateurs nous ont dit : Nous voulons aller 3x plus vite sans changer nos habitudes."',
        color: '#f59e0b',
        tags: ['Feedback', 'Terrain']
      }
    ],
    edges: [
      { sourceIndex: 0, targetIndex: 1, label: 'Axe rupture', color: '#8b5cf6', style: 'curved', direction: 'forward' },
      { sourceIndex: 0, targetIndex: 2, label: 'Action rapide', color: '#10b981', style: 'curved', direction: 'forward' },
      { sourceIndex: 0, targetIndex: 3, label: 'Vision cible', color: '#0ea5e9', style: 'curved', direction: 'forward' },
      { sourceIndex: 0, targetIndex: 4, label: 'À vérifier', color: '#ec4899', style: 'curved', direction: 'forward' },
      { sourceIndex: 0, targetIndex: 5, label: 'Preuve terrain', color: '#f59e0b', style: 'dashed', direction: 'forward' }
    ]
  },
  {
    id: 'problem-solution-action',
    name: 'Problème → Solution → Action',
    subtitle: 'Chaîne de valeur de la friction au résultat',
    description: 'Transforme un point de douleur identifié en hypothèse validable et en plan d\'action concret.',
    category: 'critical_thinking',
    icon: 'CheckSquare',
    accentColor: '#8b5cf6',
    defaultCentralTitle: 'Friction Client : Temps de chargement excessif',
    nodes: [
      {
        relativeX: -420,
        relativeY: 0,
        type: 'risk',
        title: '🛑 Point de Friction Identifié',
        description: 'Description factuelle du problème, son coût pour l\'organisation et son impact utilisateur.',
        color: '#ef4444',
        priority: 'urgent',
        tags: ['Problème', 'Friction']
      },
      {
        relativeX: 0,
        relativeY: 0,
        type: 'decision',
        title: '🧭 Hypothèse de Résolution',
        description: 'Si nous simplifions l\'architecture à 3 étapes, le taux d\'abandon chutera de 40%.',
        color: '#8b5cf6',
        priority: 'high',
        tags: ['Hypothèse', 'Solution']
      },
      {
        relativeX: 420,
        relativeY: -90,
        type: 'action',
        title: '🛠️ Plan de Test & MVP',
        description: 'Prototyper et déployer un test A/B sur 20% du trafic pendant 7 jours.',
        color: '#10b981',
        priority: 'high',
        status: 'in_progress',
        dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        tags: ['Action', 'MVP']
      },
      {
        relativeX: 420,
        relativeY: 90,
        type: 'goal',
        title: '🎯 Métrique Clé de Succès (KPI)',
        description: 'Taux de complétion > 75% et temps moyen passé inférieur à 45 secondes.',
        color: '#0ea5e9',
        priority: 'high',
        tags: ['KPI', 'Succès']
      }
    ],
    edges: [
      { sourceIndex: 0, targetIndex: 1, label: 'Résolu par', color: '#8b5cf6', style: 'curved', direction: 'forward' },
      { sourceIndex: 1, targetIndex: 2, label: 'Validé par', color: '#10b981', style: 'curved', direction: 'forward' },
      { sourceIndex: 1, targetIndex: 3, label: 'Mesuré par', color: '#0ea5e9', style: 'curved', direction: 'forward' }
    ]
  },
  {
    id: 'five-whys',
    name: 'Les 5 Pourquoi (Causes Racines)',
    subtitle: 'Diagnostic de causalité en profondeur',
    description: 'Remonte méthodiquement du symptôme observable jusqu\'à la cause racine organisationnelle.',
    category: 'critical_thinking',
    icon: 'HelpCircle',
    accentColor: '#f59e0b',
    defaultCentralTitle: 'Symptôme de Défaillance Observable',
    nodes: [
      {
        relativeX: -450,
        relativeY: 0,
        type: 'risk',
        title: '1. Symptôme Observable',
        description: 'Le client a reçu sa commande avec 4 jours de retard.',
        color: '#ef4444',
        priority: 'high',
        tags: ['Pourquoi1', 'Symptôme']
      },
      {
        relativeX: -150,
        relativeY: 0,
        type: 'decision',
        title: '2. Pourquoi ? (Cause Directe)',
        description: 'L\'équipe logistique n\'avait pas reçu l\'étiquette d\'expédition à temps.',
        color: '#f59e0b',
        priority: 'medium',
        tags: ['Pourquoi2']
      },
      {
        relativeX: 150,
        relativeY: 0,
        type: 'decision',
        title: '3. Pourquoi ? (Processus)',
        description: 'Le webhook entre le CRM et le transporteur a échoué silencieusement.',
        color: '#8b5cf6',
        priority: 'medium',
        tags: ['Pourquoi3']
      },
      {
        relativeX: 450,
        relativeY: 0,
        type: 'risk',
        title: '4. Pourquoi ? (Système)',
        description: 'Aucune alerte de surveillance ni fallback automatique n\'avaient été configurés.',
        color: '#ec4899',
        priority: 'high',
        tags: ['Pourquoi4']
      },
      {
        relativeX: 150,
        relativeY: 170,
        type: 'goal',
        title: '5. Cause Racine Fondamentale',
        description: 'Absence de gouvernance sur les intégrations critiques tierces et absence de tests d\'intégration.',
        color: '#6366f1',
        priority: 'urgent',
        tags: ['CauseRacine', 'Systémique']
      },
      {
        relativeX: 450,
        relativeY: 170,
        type: 'action',
        title: '✅ Remédiation Systémique Définitive',
        description: 'Mettre en place un circuit de retry avec alerting Slack + tests end-to-end automatisés.',
        color: '#10b981',
        priority: 'urgent',
        status: 'in_progress',
        tags: ['PlanAction', 'Résolution']
      }
    ],
    edges: [
      { sourceIndex: 0, targetIndex: 1, label: 'Pourquoi ?', color: '#f59e0b', style: 'curved', direction: 'forward' },
      { sourceIndex: 1, targetIndex: 2, label: 'Pourquoi ?', color: '#8b5cf6', style: 'curved', direction: 'forward' },
      { sourceIndex: 2, targetIndex: 3, label: 'Pourquoi ?', color: '#ec4899', style: 'curved', direction: 'forward' },
      { sourceIndex: 3, targetIndex: 4, label: 'Cause ultime', color: '#6366f1', style: 'curved', direction: 'forward' },
      { sourceIndex: 4, targetIndex: 5, label: 'Action corrective', color: '#10b981', style: 'curved', direction: 'forward' }
    ]
  },
  {
    id: 'okr-cluster',
    name: 'Cadre OKR (Objectif & Key Results)',
    subtitle: 'Alignement stratégique et métriques quantifiées',
    description: 'Relie une ambition qualitative forte à 3 résultats clés chiffrés et un indicateur de risque.',
    category: 'productivity',
    icon: 'Target',
    accentColor: '#6366f1',
    defaultCentralTitle: '🎯 Objectif (O) : Devenir la référence marché',
    nodes: [
      {
        relativeX: -320,
        relativeY: 0,
        type: 'goal',
        title: '🎯 Objectif (O) : [Ambition Trimestre]',
        description: 'Accélérer l\'adoption produit tout en garantissant un niveau de satisfaction sans compromis.',
        color: '#6366f1',
        priority: 'urgent',
        tags: ['OKR', 'Objectif']
      },
      {
        relativeX: 180,
        relativeY: -140,
        type: 'action',
        title: '📊 KR 1 : Chiffre d\'Affaires / ARR',
        description: 'Passer de 50k€ à 120k€ de MRR avec un coût d\'acquisition inférieur à 180€.',
        color: '#10b981',
        priority: 'urgent',
        status: 'in_progress',
        tags: ['KR', 'Revenus']
      },
      {
        relativeX: 180,
        relativeY: 0,
        type: 'action',
        title: '👥 KR 2 : Adoption & Taux d\'Usage Actif',
        description: 'Atteindre 15 000 utilisateurs actifs hebdomadaires (WAU) avec 4 sessions/semaine.',
        color: '#0ea5e9',
        priority: 'high',
        status: 'in_progress',
        tags: ['KR', 'Usage']
      },
      {
        relativeX: 180,
        relativeY: 140,
        type: 'action',
        title: '⭐ KR 3 : Satisfaction Client (NPS)',
        description: 'Maintenir un Net Promoter Score (NPS) > 65 avec moins de 1.5% de churn mensuel.',
        color: '#8b5cf6',
        priority: 'high',
        status: 'backlog',
        tags: ['KR', 'Qualité']
      },
      {
        relativeX: 520,
        relativeY: 0,
        type: 'risk',
        title: '⚠️ Risque de Goulot d\'Étranglement',
        description: 'Saturation du support client si le volume d\'inscriptions dépasse les prévisions.',
        color: '#ef4444',
        priority: 'high',
        tags: ['GardeFou', 'Risque']
      }
    ],
    edges: [
      { sourceIndex: 0, targetIndex: 1, label: 'KR 1', color: '#10b981', style: 'curved', direction: 'forward' },
      { sourceIndex: 0, targetIndex: 2, label: 'KR 2', color: '#0ea5e9', style: 'curved', direction: 'forward' },
      { sourceIndex: 0, targetIndex: 3, label: 'KR 3', color: '#8b5cf6', style: 'curved', direction: 'forward' },
      { sourceIndex: 2, targetIndex: 4, label: 'Garde-fou', color: '#ef4444', style: 'dashed', direction: 'forward' }
    ]
  },
  {
    id: 'pros-and-cons',
    name: 'Pour & Contre (Arbitrage Décisionnel)',
    subtitle: 'Balance des bénéfices, risques et compromis',
    description: 'Compare les arguments favorables et défavorables d\'un choix stratégique structurant.',
    category: 'strategy',
    icon: 'Scale',
    accentColor: '#ec4899',
    defaultCentralTitle: 'Décision : Migration vers une architecture Micro-Frontends',
    nodes: [
      {
        relativeX: 0,
        relativeY: 0,
        type: 'decision',
        title: '⚖️ Décision à Arbitrer : [Choix Stratégique]',
        description: 'Arbitrage structurant nécessitant une analyse rigoureuse des gains versus les coûts d\'opportunité.',
        color: '#ec4899',
        priority: 'urgent',
        tags: ['Décision', 'Arbitrage']
      },
      {
        relativeX: -360,
        relativeY: -90,
        type: 'concept',
        title: '✅ Bénéfice Clé (Argument Pour #1)',
        description: 'Autonomie accrue des équipes de développement et déploiements indépendants.',
        color: '#10b981',
        priority: 'high',
        tags: ['Pour', 'Bénéfice']
      },
      {
        relativeX: -360,
        relativeY: 90,
        type: 'concept',
        title: '✅ Gain d\'Échelle (Argument Pour #2)',
        description: 'Réduction du temps de build et résilience accrue en cas de panne isolée.',
        color: '#10b981',
        priority: 'medium',
        tags: ['Pour', 'Scalabilité']
      },
      {
        relativeX: 360,
        relativeY: -90,
        type: 'risk',
        title: '❌ Complexité Opérationnelle (Contre #1)',
        description: 'Gouvernance du versioning complexe et surcharge cognitive pour l\'infrastructure.',
        color: '#ef4444',
        priority: 'high',
        tags: ['Contre', 'Risque']
      },
      {
        relativeX: 360,
        relativeY: 90,
        type: 'risk',
        title: '❌ Coût Initial de Transition (Contre #2)',
        description: 'Ralentissement estimé de 3 semaines sur la roadmap fonctionnalités pendant la bascule.',
        color: '#ef4444',
        priority: 'medium',
        tags: ['Contre', 'Coût']
      },
      {
        relativeX: 0,
        relativeY: 180,
        type: 'action',
        title: '🏁 Verdict & Mesure de Sécurisation',
        description: 'Lancer un POC de 2 semaines sur un service non critique avant toute décision définitive.',
        color: '#6366f1',
        priority: 'urgent',
        status: 'in_progress',
        tags: ['Verdict', 'Action']
      }
    ],
    edges: [
      { sourceIndex: 0, targetIndex: 1, label: 'Pour', color: '#10b981', style: 'curved', direction: 'forward' },
      { sourceIndex: 0, targetIndex: 2, label: 'Pour', color: '#10b981', style: 'curved', direction: 'forward' },
      { sourceIndex: 0, targetIndex: 3, label: 'Contre', color: '#ef4444', style: 'curved', direction: 'forward' },
      { sourceIndex: 0, targetIndex: 4, label: 'Contre', color: '#ef4444', style: 'curved', direction: 'forward' },
      { sourceIndex: 0, targetIndex: 5, label: 'Compromis', color: '#6366f1', style: 'curved', direction: 'forward' }
    ]
  }
];
