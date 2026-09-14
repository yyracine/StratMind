import express from 'express';
import http from 'http';
import path from 'path';
import { WebSocketServer, WebSocket } from 'ws';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;
app.use(express.json({ limit: '10mb' }));

// Types for Maps & Nodes
export interface MapNode {
  id: string;
  type: 'concept' | 'decision' | 'action' | 'goal' | 'risk' | 'note';
  title: string;
  description?: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  color: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  tags: string[];
  status?: 'backlog' | 'in_progress' | 'completed';
  dueDate?: string;
  assignee?: string;
  icon?: string;
}

export interface MapEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  style?: 'solid' | 'dashed' | 'curved';
  color?: string;
  direction?: 'forward' | 'both' | 'none';
}

export interface MindMap {
  id: string;
  title: string;
  description: string;
  category: 'strategy' | 'critical_thinking' | 'productivity' | 'brainstorm';
  theme: string;
  nodes: MapNode[];
  edges: MapEdge[];
  updatedAt: string;
  createdAt: string;
}

// In-memory initial templates & user maps
const starterMaps: MindMap[] = [
  {
    id: 'strategy-growth-2026',
    title: 'Stratégie de Croissance & Expansion Q3/Q4',
    description: 'Cartographie stratégique d\'alignement : Objectifs clés, hypothèses de marché, risques et plan d\'action opérationnel.',
    category: 'strategy',
    theme: 'indigo',
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    nodes: [
      {
        id: 'node-core',
        type: 'goal',
        title: 'Doubler l\'ARR et Déployer le Produit Enterprise',
        description: 'Cap stratégique : 2.4M€ ARR d\'ici fin d\'année avec 95% de satisfaction client.',
        x: 450,
        y: 280,
        color: '#6366f1',
        priority: 'urgent',
        tags: ['Cap 2026', 'Objectif Principal'],
        status: 'in_progress',
        icon: 'Target'
      },
      {
        id: 'node-market',
        type: 'concept',
        title: 'Positionnement & Valeur Différenciante',
        description: 'Miro-like canvas dédié à la prise de décision rapide et à l\'exécution.',
        x: 100,
        y: 120,
        color: '#0ea5e9',
        priority: 'high',
        tags: ['Positionnement', 'Product'],
        status: 'in_progress',
        icon: 'Compass'
      },
      {
        id: 'node-decision',
        type: 'decision',
        title: 'Hypothèse : Focus Grands Comptes vs PLG Mid-Market',
        description: 'Tester l\'attraction sur les équipes produit et stratégiques de 50 à 500 employés.',
        x: 100,
        y: 440,
        color: '#8b5cf6',
        priority: 'high',
        tags: ['Hypothèse', 'Go-To-Market'],
        status: 'in_progress',
        icon: 'HelpCircle'
      },
      {
        id: 'node-risk',
        type: 'risk',
        title: 'Risque : Dépendance Technique & Friction Onboarding',
        description: 'L\'expérience de cartographie doit être instantanée sans apprentissage complexe.',
        x: 820,
        y: 120,
        color: '#ef4444',
        priority: 'urgent',
        tags: ['Risque Majeur', 'UX'],
        status: 'in_progress',
        icon: 'AlertTriangle'
      },
      {
        id: 'node-action-1',
        type: 'action',
        title: 'Lancer le MVP Desktop Canvas Haute Performance',
        description: 'Moteur de canvas fluide, zoom infini, raccourcis claviers ultra-réactifs.',
        x: 820,
        y: 320,
        color: '#10b981',
        priority: 'high',
        tags: ['Sprint 1', 'Engineering'],
        status: 'in_progress',
        dueDate: '2026-10-15',
        assignee: 'Core Team',
        icon: 'Zap'
      },
      {
        id: 'node-action-2',
        type: 'action',
        title: 'Audit de Pensée Critique & Red Teaming',
        description: 'Confronter nos 5 hypothèses centrales aux retours de 10 directeurs stratégie.',
        x: 820,
        y: 470,
        color: '#10b981',
        priority: 'medium',
        tags: ['Audit', 'Validation'],
        status: 'backlog',
        dueDate: '2026-10-30',
        assignee: 'Lead Strategy',
        icon: 'CheckCircle2'
      },
      {
        id: 'node-note',
        type: 'note',
        title: 'Note de Synthèse Stratégique',
        description: 'Prioriser la rapidité d\'adoption et la clarté visuelle. Moins de bruit, plus d\'impact décisionnel.',
        x: 460,
        y: 500,
        color: '#f59e0b',
        priority: 'low',
        tags: ['Principes'],
        status: 'completed',
        icon: 'StickyNote'
      }
    ],
    edges: [
      { id: 'edge-1', source: 'node-market', target: 'node-core', label: 'Alimente', style: 'curved', color: '#6366f1', direction: 'forward' },
      { id: 'edge-2', source: 'node-decision', target: 'node-core', label: 'Conditionne', style: 'curved', color: '#8b5cf6', direction: 'forward' },
      { id: 'edge-3', source: 'node-core', target: 'node-risk', label: 'Exposition', style: 'dashed', color: '#ef4444', direction: 'forward' },
      { id: 'edge-4', source: 'node-core', target: 'node-action-1', label: 'Exécute', style: 'curved', color: '#10b981', direction: 'forward' },
      { id: 'edge-5', source: 'node-core', target: 'node-action-2', label: 'Valide', style: 'curved', color: '#10b981', direction: 'forward' },
      { id: 'edge-6', source: 'node-core', target: 'node-note', label: 'Contexte', style: 'dashed', color: '#f59e0b', direction: 'none' }
    ]
  },
  {
    id: 'critical-thinking-5whys',
    title: 'Analyse Critique : Les 5 Pourquoi & Causes Racines',
    description: 'Cadre méthodologique pour identifier les causes fondamentales d\'un problème stratégique.',
    category: 'critical_thinking',
    theme: 'emerald',
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    nodes: [
      {
        id: 'why-problem',
        type: 'risk',
        title: 'Problème Observé : Baisse de Vélocité Stratégique',
        description: 'Les arbitrages clés prennent 3 semaines de trop en comité de direction.',
        x: 100,
        y: 260,
        color: '#ef4444',
        priority: 'urgent',
        tags: ['Symptôme', 'Problème'],
        status: 'in_progress',
        icon: 'AlertCircle'
      },
      {
        id: 'why-1',
        type: 'concept',
        title: 'Pourquoi 1 : Trop d\'options non formalisées',
        description: 'Chaque partie prenante apporte ses hypothèses sans format unifié.',
        x: 360,
        y: 260,
        color: '#f59e0b',
        priority: 'high',
        tags: ['Niveau 1'],
        status: 'in_progress',
        icon: 'HelpCircle'
      },
      {
        id: 'why-2',
        type: 'concept',
        title: 'Pourquoi 2 : Manque de critères de validation objectifs',
        description: 'Pas de matrice d\'impact/effort partagée avant la réunion.',
        x: 620,
        y: 260,
        color: '#f59e0b',
        priority: 'high',
        tags: ['Niveau 2'],
        status: 'in_progress',
        icon: 'HelpCircle'
      },
      {
        id: 'why-root',
        type: 'decision',
        title: 'Cause Racine : Absence de Cartographie Visuelle Vivante',
        description: 'Les idées restent cloisonnées dans des documents textuels longs et peu lisibles.',
        x: 880,
        y: 260,
        color: '#8b5cf6',
        priority: 'urgent',
        tags: ['Cause Racine'],
        status: 'in_progress',
        icon: 'CheckCircle2'
      },
      {
        id: 'why-sol',
        type: 'action',
        title: 'Plan : Standardiser les revues sur Canvas StratMind',
        description: 'Modèle décisionnel imposé en amont de chaque arbitrage.',
        x: 880,
        y: 440,
        color: '#10b981',
        priority: 'high',
        tags: ['Résolution'],
        status: 'backlog',
        icon: 'Zap'
      }
    ],
    edges: [
      { id: 'w-e1', source: 'why-problem', target: 'why-1', label: 'Pourquoi ?', style: 'curved', color: '#f59e0b', direction: 'forward' },
      { id: 'w-e2', source: 'why-1', target: 'why-2', label: 'Pourquoi ?', style: 'curved', color: '#f59e0b', direction: 'forward' },
      { id: 'w-e3', source: 'why-2', target: 'why-root', label: 'Cause fondamentale', style: 'curved', color: '#8b5cf6', direction: 'forward' },
      { id: 'w-e4', source: 'why-root', target: 'why-sol', label: 'Action corrective', style: 'curved', color: '#10b981', direction: 'forward' }
    ]
  },
  {
    id: 'swot-analysis-matrix',
    title: 'Matrice SWOT & Pensée Stratégique',
    description: 'Analyse des Forces, Faiblesses, Opportunités et Menaces pour cadrer un pivot ou nouveau produit.',
    category: 'strategy',
    theme: 'blue',
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    nodes: [
      { id: 'swot-center', type: 'goal', title: 'Nouveau Produit B2B : Canvas Stratégique', description: 'Évaluation des leviers et vulnérabilités.', x: 480, y: 280, color: '#3b82f6', priority: 'high', tags: ['SWOT'], icon: 'Compass' },
      { id: 'swot-s', type: 'concept', title: 'Forces (Strengths) : Fluidité & Vitesse Miró', description: 'Ergonomie native ultra-rapide, rendu vectoriel sans latence.', x: 160, y: 120, color: '#10b981', priority: 'high', tags: ['Force'], icon: 'ShieldCheck' },
      { id: 'swot-w', type: 'risk', title: 'Faiblesses (Weaknesses) : Notoriété initiale', description: 'Nécessite d\'établir la preuve de valeur face aux géants.', x: 800, y: 120, color: '#f59e0b', priority: 'medium', tags: ['Faiblesse'], icon: 'AlertCircle' },
      { id: 'swot-o', type: 'action', title: 'Opportunités (Opportunities) : Fatigue des docs Word', description: 'Les managers veulent des visuels clairs et directement exploitables.', x: 160, y: 440, color: '#0ea5e9', priority: 'high', tags: ['Opportunité'], icon: 'TrendingUp' },
      { id: 'swot-t', type: 'decision', title: 'Menaces (Threats) : Commoditisation', description: 'Continuer d\'innover sur la pensée critique et l\'aide décisionnelle assistée.', x: 800, y: 440, color: '#ef4444', priority: 'high', tags: ['Menace'], icon: 'Crosshair' }
    ],
    edges: [
      { id: 'swot-1', source: 'swot-center', target: 'swot-s', label: 'Capitaliser', style: 'curved', color: '#10b981' },
      { id: 'swot-2', source: 'swot-center', target: 'swot-w', label: 'Atténuer', style: 'dashed', color: '#f59e0b' },
      { id: 'swot-3', source: 'swot-center', target: 'swot-o', label: 'Saisir', style: 'curved', color: '#0ea5e9' },
      { id: 'swot-4', source: 'swot-center', target: 'swot-t', label: 'Surveiller', style: 'dashed', color: '#ef4444' }
    ]
  }
];

// In-memory maps store
const mapsStore = new Map<string, MindMap>();
starterMaps.forEach(m => mapsStore.set(m.id, m));

// REST API Endpoints
app.get('/api/maps', (req, res) => {
  const list = Array.from(mapsStore.values()).map(m => ({
    id: m.id,
    title: m.title,
    description: m.description,
    category: m.category,
    theme: m.theme,
    nodeCount: m.nodes.length,
    edgeCount: m.edges.length,
    updatedAt: m.updatedAt,
    createdAt: m.createdAt
  }));
  res.json({ maps: list });
});

app.get('/api/maps/:id', (req, res) => {
  const map = mapsStore.get(req.params.id);
  if (!map) {
    return res.status(404).json({ error: 'Carte introuvable' });
  }
  res.json({ map });
});

app.post('/api/maps', (req, res) => {
  const { title, description, category, theme, nodes, edges } = req.body;
  const id = 'map-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6);
  const newMap: MindMap = {
    id,
    title: title || 'Nouvelle Carte Stratégique',
    description: description || 'Cartographie collaborative pour la prise de décision',
    category: category || 'strategy',
    theme: theme || 'indigo',
    nodes: nodes || [
      {
        id: 'node-root',
        type: 'goal',
        title: title || 'Problématique Centrale',
        description: 'Définissez votre vision ou question directrice ici.',
        x: 400,
        y: 260,
        color: '#6366f1',
        priority: 'high',
        tags: ['Point de départ'],
        status: 'in_progress',
        icon: 'Target'
      }
    ],
    edges: edges || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  mapsStore.set(id, newMap);
  res.status(201).json({ map: newMap });
});

app.put('/api/maps/:id', (req, res) => {
  const existing = mapsStore.get(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Carte introuvable' });
  }
  const updated: MindMap = {
    ...existing,
    ...req.body,
    id: req.params.id,
    updatedAt: new Date().toISOString()
  };
  mapsStore.set(req.params.id, updated);
  res.json({ map: updated });
});

app.delete('/api/maps/:id', (req, res) => {
  if (mapsStore.size <= 1) {
    return res.status(400).json({ error: 'Impossible de supprimer la dernière carte active.' });
  }
  const deleted = mapsStore.delete(req.params.id);
  res.json({ success: deleted });
});

// AI Strategic Assistant Endpoint
app.post('/api/ai/strategic-assist', async (req, res) => {
  try {
    const { nodeTitle, nodeType, nodeDescription, assistMode, mapTheme } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    // If no API key or in preview environment without key, generate robust contextual heuristics
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      const heuristics: Record<string, { type: MapNode['type']; title: string; desc: string; color: string; priority: MapNode['priority'] }[]> = {
        'red_team': [
          { type: 'risk', title: 'Biais de confirmation', desc: 'Quelles données contradictoires ignorons-nous volontairement ?', color: '#ef4444', priority: 'urgent' },
          { type: 'decision', title: 'Scénario du pire (Pre-Mortem)', desc: 'Si cette initiative échoue dans 6 mois, quelle sera la raison principale ?', color: '#8b5cf6', priority: 'high' },
          { type: 'concept', title: 'Hypothèse non vérifiée', desc: 'La dépendance clé repose sur l\'acceptation immédiate des utilisateurs.', color: '#0ea5e9', priority: 'medium' }
        ],
        'action_plan': [
          { type: 'action', title: 'Étape 1 : Valider le périmètre restreint (MVP)', desc: 'Tester la proposition de valeur sur un groupe test de 5 utilisateurs clés.', color: '#10b981', priority: 'high' },
          { type: 'action', title: 'Étape 2 : Mesurer le retour sur investissement', desc: 'Définir les métriques de succès clés (gain de temps, réduction d\'erreurs).', color: '#10b981', priority: 'medium' },
          { type: 'goal', title: 'Livrable final validé', desc: 'Documentation décisionnelle et feuille de route partagée.', color: '#6366f1', priority: 'high' }
        ],
        '5_whys': [
          { type: 'concept', title: 'Pourquoi ce blocage survient-il ?', desc: 'Les responsabilités et critères de décision ne sont pas explicites.', color: '#f59e0b', priority: 'high' },
          { type: 'decision', title: 'Cause sous-jacente', desc: 'Manque d\'alignement sur la vision globale et les priorités de l\'équipe.', color: '#8b5cf6', priority: 'medium' },
          { type: 'action', title: 'Action de rupture', desc: 'Clarifier les objectifs opérationnels et standardiser le processus d\'arbitrage.', color: '#10b981', priority: 'high' }
        ],
        'first_principles': [
          { type: 'concept', title: 'Vérités fondamentales inaltérables', desc: 'Déconstruire le sujet jusqu\'aux faits physiques et économiques certains.', color: '#0ea5e9', priority: 'high' },
          { type: 'decision', title: 'Reconstruction logique', desc: 'Si nous repartions de zéro sans héritage historique, comment ferions-nous ?', color: '#8b5cf6', priority: 'high' },
          { type: 'action', title: 'Solution minimale viable', desc: 'Concevoir l\'architecture la plus directe sans étapes superflues.', color: '#10b981', priority: 'urgent' }
        ]
      };

      const selected = heuristics[assistMode] || heuristics['red_team'];
      return res.json({
        success: true,
        source: 'heuristic',
        branches: selected
      });
    }

    // Use modern @google/genai SDK with gemini-3.8-flash
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Tu es un expert mondial en stratégie d'entreprise, pensée critique et cartographie cognitive (façon Miró / First Principles / Red Teaming).
L'utilisateur étudie ce nœud sur sa carte mentale :
- Titre : "${nodeTitle}"
- Type de bloc : "${nodeType}"
- Description : "${nodeDescription || 'Non spécifiée'}"
- Thème général : "${mapTheme || 'Stratégie'}"

Mode d'assistance demandé : "${assistMode}" (choix possibles : 'red_team' pour contradiction/angles morts/risques, 'action_plan' pour plan d'action concret en 3 étapes, '5_whys' pour cause racine, 'first_principles' pour déconstruction aux principes premiers).

Génère 3 sous-nœuds stratégiques ultra-pertinents et percutants pour développer ce nœud.
Réponds UNIQUEMENT avec un objet JSON strictement valide au format suivant :
{
  "branches": [
    {
      "type": "concept" | "decision" | "action" | "goal" | "risk" | "note",
      "title": "Titre concis (max 60 caractères)",
      "desc": "Description analytique précise (max 150 caractères)",
      "color": "code hex (#10b981 pour action, #ef4444 pour risque, #8b5cf6 pour décision, #0ea5e9 pour concept, #6366f1 pour goal, #f59e0b pour note)",
      "priority": "low" | "medium" | "high" | "urgent"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text || '{}';
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      // fallback if JSON parsing error
      parsed = { branches: [] };
    }

    res.json({
      success: true,
      source: 'gemini',
      branches: parsed.branches && parsed.branches.length ? parsed.branches : [
        { type: 'action', title: 'Plan d\'exécution clarifié', desc: 'Définir les critères clés d\'acceptation.', color: '#10b981', priority: 'high' }
      ]
    });

  } catch (err: any) {
    console.error('Erreur Strategic AI Assist:', err);
    res.json({
      success: true,
      source: 'fallback',
      branches: [
        { type: 'risk', title: 'Analyse d\'impact & Risque', desc: 'Vérifier la faisabilité sous contrainte de temps.', color: '#ef4444', priority: 'high' },
        { type: 'action', title: 'Action immédiate', desc: 'Attribuer un responsable et une échéance claire.', color: '#10b981', priority: 'medium' }
      ]
    });
  }
});

// Real-Time WebSockets Server
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

interface ClientInfo {
  ws: WebSocket;
  mapId: string;
  userId: string;
  userName: string;
  userColor: string;
}

const clients = new Map<WebSocket, ClientInfo>();
const userColors = ['#f43f5e', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#84cc16'];

function broadcastToMap(mapId: string, message: any, excludeWs?: WebSocket) {
  const payload = JSON.stringify(message);
  for (const [ws, info] of clients.entries()) {
    if (info.mapId === mapId && ws.readyState === WebSocket.OPEN && ws !== excludeWs) {
      ws.send(payload);
    }
  }
}

function getActiveUsersInMap(mapId: string) {
  const users: { userId: string; userName: string; userColor: string }[] = [];
  const seen = new Set<string>();
  for (const info of clients.values()) {
    if (info.mapId === mapId && !seen.has(info.userId)) {
      seen.add(info.userId);
      users.push({
        userId: info.userId,
        userName: info.userName,
        userColor: info.userColor
      });
    }
  }
  return users;
}

wss.on('connection', (ws) => {
  const clientColor = userColors[Math.floor(Math.random() * userColors.length)];
  const randomId = 'user_' + Math.random().toString(36).substring(2, 7);
  const randomName = 'Stratège ' + Math.floor(Math.random() * 900 + 100);

  const clientInfo: ClientInfo = {
    ws,
    mapId: 'strategy-growth-2026',
    userId: randomId,
    userName: randomName,
    userColor: clientColor
  };
  clients.set(ws, clientInfo);

  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data.toString());

      if (msg.type === 'join') {
        clientInfo.mapId = msg.mapId || clientInfo.mapId;
        if (msg.userName) clientInfo.userName = msg.userName;
        if (msg.userColor) clientInfo.userColor = msg.userColor;

        // Send current map state to joining client
        const currentMap = mapsStore.get(clientInfo.mapId);
        ws.send(JSON.stringify({
          type: 'init',
          userId: clientInfo.userId,
          userName: clientInfo.userName,
          userColor: clientInfo.userColor,
          map: currentMap,
          activeUsers: getActiveUsersInMap(clientInfo.mapId)
        }));

        // Broadcast to others that a user joined
        broadcastToMap(clientInfo.mapId, {
          type: 'presence:update',
          activeUsers: getActiveUsersInMap(clientInfo.mapId)
        }, ws);
      }

      else if (msg.type === 'cursor') {
        // Broadcast mouse cursor to others in room
        broadcastToMap(clientInfo.mapId, {
          type: 'cursor',
          userId: clientInfo.userId,
          userName: clientInfo.userName,
          userColor: clientInfo.userColor,
          x: msg.x,
          y: msg.y
        }, ws);
      }

      else if (msg.type === 'node:create' || msg.type === 'node:update' || msg.type === 'node:delete' ||
               msg.type === 'edge:create' || msg.type === 'edge:delete' || msg.type === 'map:sync') {
        // Update server store authoritative state
        const map = mapsStore.get(clientInfo.mapId);
        if (map) {
          if (msg.type === 'node:create') {
            const exists = map.nodes.some(n => n.id === msg.node.id);
            if (!exists) map.nodes.push(msg.node);
          } else if (msg.type === 'node:update') {
            const idx = map.nodes.findIndex(n => n.id === msg.node.id);
            if (idx !== -1) map.nodes[idx] = { ...map.nodes[idx], ...msg.node };
          } else if (msg.type === 'node:delete') {
            map.nodes = map.nodes.filter(n => n.id !== msg.nodeId);
            map.edges = map.edges.filter(e => e.source !== msg.nodeId && e.target !== msg.nodeId);
          } else if (msg.type === 'edge:create') {
            const exists = map.edges.some(e => e.id === msg.edge.id);
            if (!exists) map.edges.push(msg.edge);
          } else if (msg.type === 'edge:delete') {
            map.edges = map.edges.filter(e => e.id !== msg.edgeId);
          } else if (msg.type === 'map:sync') {
            map.nodes = msg.nodes || map.nodes;
            map.edges = msg.edges || map.edges;
          }
          map.updatedAt = new Date().toISOString();
        }

        // Broadcast delta mutation to peers
        broadcastToMap(clientInfo.mapId, {
          ...msg,
          fromUserId: clientInfo.userId,
          fromUserName: clientInfo.userName
        }, ws);
      }

      else if (msg.type === 'ping') {
        ws.send(JSON.stringify({ type: 'pong', time: msg.time }));
      }
    } catch (e) {
      console.error('WS parse error:', e);
    }
  });

  ws.on('close', () => {
    const currentMapId = clientInfo.mapId;
    clients.delete(ws);
    broadcastToMap(currentMapId, {
      type: 'presence:update',
      activeUsers: getActiveUsersInMap(currentMapId)
    });
  });
});

// Vite Integration
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`StratMind Server running on http://localhost:${PORT}`);
  });
}

start();
