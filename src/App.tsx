import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ActiveAppView, ActiveUser, CollaboratorCursor, MapEdge, MapNode, MapSummary, MindMap, ThemeMode } from './types';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { Canvas } from './components/Canvas';
import { StrategicActionView } from './components/StrategicActionView';
import { MapsModal } from './components/MapsModal';
import { realtimeSync } from './services/websocket';
import { THEME_CONFIGS } from './constants';

const DEFAULT_MAP_ID = 'strategy-growth-2026';

export default function App() {
  const [currentView, setCurrentView] = useState<ActiveAppView>('canvas');
  const [theme, setTheme] = useState<ThemeMode>(() => {
    return (localStorage.getItem('stratmind_theme') as ThemeMode) || 'midnight';
  });

  const [currentMap, setCurrentMap] = useState<MindMap | null>(null);
  const [mapsList, setMapsList] = useState<MapSummary[]>([]);
  const [isMapsModalOpen, setIsMapsModalOpen] = useState(false);
  const [targetNodeToFocus, setTargetNodeToFocus] = useState<string | null>(null);
  const [fitCanvasTrigger, setFitCanvasTrigger] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isPresentationMode, setIsPresentationMode] = useState(false);

  const handleTogglePresentation = useCallback(() => {
    setIsPresentationMode((prev) => !prev);
  }, []);

  const handleFitCanvas = useCallback(() => {
    setCurrentView('canvas');
    setFitCanvasTrigger((prev) => prev + 1);
  }, []);

  const handleSelectNodeFromSearch = useCallback((nodeId: string) => {
    setSelectedNodeId(nodeId);
    setTargetNodeToFocus(nodeId);
    setCurrentView('canvas');
  }, []);

  // Real-time state
  const [isConnected, setIsConnected] = useState(false);
  const [latency, setLatency] = useState(14);
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [collaboratorCursors, setCollaboratorCursors] = useState<Map<string, CollaboratorCursor>>(new Map());

  // Avoid sync echo loops
  const isRemoteUpdateRef = useRef(false);

  // Sync theme with localStorage & document class
  useEffect(() => {
    localStorage.setItem('stratmind_theme', theme);
    if (theme === 'light' || theme === 'sepia') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, [theme]);

  // Load maps list
  const loadMapsList = useCallback(async () => {
    try {
      const res = await fetch('/api/maps');
      const data = await res.json();
      if (data.maps) {
        setMapsList(data.maps);
      }
    } catch (e) {
      console.warn('Error loading maps list:', e);
    }
  }, []);

  // Load specific map
  const loadMap = useCallback(async (mapId: string) => {
    try {
      const res = await fetch(`/api/maps/${mapId}`);
      const data = await res.json();
      if (data.map) {
        setCurrentMap(data.map);
        // Connect WebSocket to this map's room
        realtimeSync.connect(mapId);
      }
    } catch (e) {
      console.warn('Error loading map:', e);
    }
  }, []);

  // Initial Boot
  useEffect(() => {
    loadMapsList();
    loadMap(DEFAULT_MAP_ID);
  }, [loadMapsList, loadMap]);

  // WebSocket Event Subscriptions
  useEffect(() => {
    const unsubConn = realtimeSync.on('connection:change', (status: boolean) => {
      setIsConnected(status);
    });

    const unsubLatency = realtimeSync.on('latency:update', (lat: number) => {
      setLatency(lat);
    });

    const unsubInit = realtimeSync.on('init', (data: any) => {
      if (data.activeUsers) setActiveUsers(data.activeUsers);
      if (data.map) {
        isRemoteUpdateRef.current = true;
        setCurrentMap(data.map);
        setTimeout(() => {
          isRemoteUpdateRef.current = false;
        }, 50);
      }
    });

    const unsubPresence = realtimeSync.on('presence:update', (data: any) => {
      if (data.activeUsers) setActiveUsers(data.activeUsers);
    });

    const unsubCursor = realtimeSync.on('cursor', (data: any) => {
      setCollaboratorCursors((prev) => {
        const next = new Map(prev);
        next.set(data.userId, {
          userId: data.userId,
          userName: data.userName,
          userColor: data.userColor,
          x: data.x,
          y: data.y
        });
        return next;
      });
    });

    // Remote node mutations
    const unsubNodeCreate = realtimeSync.on('node:create', (data: any) => {
      isRemoteUpdateRef.current = true;
      setCurrentMap((prev) => {
        if (!prev || prev.nodes.some((n) => n.id === data.node.id)) return prev;
        return { ...prev, nodes: [...prev.nodes, data.node] };
      });
      setTimeout(() => (isRemoteUpdateRef.current = false), 50);
    });

    const unsubNodeUpdate = realtimeSync.on('node:update', (data: any) => {
      isRemoteUpdateRef.current = true;
      setCurrentMap((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          nodes: prev.nodes.map((n) => (n.id === data.node.id ? { ...n, ...data.node } : n))
        };
      });
      setTimeout(() => (isRemoteUpdateRef.current = false), 50);
    });

    const unsubNodeDelete = realtimeSync.on('node:delete', (data: any) => {
      isRemoteUpdateRef.current = true;
      setCurrentMap((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          nodes: prev.nodes.filter((n) => n.id !== data.nodeId),
          edges: prev.edges.filter((e) => e.source !== data.nodeId && e.target !== data.nodeId)
        };
      });
      setTimeout(() => (isRemoteUpdateRef.current = false), 50);
    });

    // Remote edge mutations
    const unsubEdgeCreate = realtimeSync.on('edge:create', (data: any) => {
      isRemoteUpdateRef.current = true;
      setCurrentMap((prev) => {
        if (!prev || prev.edges.some((e) => e.id === data.edge.id)) return prev;
        return { ...prev, edges: [...prev.edges, data.edge] };
      });
      setTimeout(() => (isRemoteUpdateRef.current = false), 50);
    });

    const unsubEdgeDelete = realtimeSync.on('edge:delete', (data: any) => {
      isRemoteUpdateRef.current = true;
      setCurrentMap((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          edges: prev.edges.filter((e) => e.id !== data.edgeId)
        };
      });
      setTimeout(() => (isRemoteUpdateRef.current = false), 50);
    });

    const unsubMapSync = realtimeSync.on('map:sync', (data: any) => {
      isRemoteUpdateRef.current = true;
      setCurrentMap((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          nodes: data.nodes || prev.nodes,
          edges: data.edges || prev.edges
        };
      });
      setTimeout(() => (isRemoteUpdateRef.current = false), 50);
    });

    return () => {
      unsubConn();
      unsubLatency();
      unsubInit();
      unsubPresence();
      unsubCursor();
      unsubNodeCreate();
      unsubNodeUpdate();
      unsubNodeDelete();
      unsubEdgeCreate();
      unsubEdgeDelete();
      unsubMapSync();
    };
  }, []);

  // Save map changes to backend and notify peers
  const syncMapToBackend = useCallback((mapToSave: MindMap) => {
    fetch(`/api/maps/${mapToSave.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mapToSave)
    }).catch((e) => console.warn('Sync PUT failed:', e));
  }, []);

  // Node Actions
  const handleUpdateNode = useCallback(
    (updated: Partial<MapNode> & { id: string }) => {
      setCurrentMap((prev) => {
        if (!prev) return prev;
        const nextNodes = prev.nodes.map((n) => (n.id === updated.id ? { ...n, ...updated } : n));
        const nextMap = { ...prev, nodes: nextNodes, updatedAt: new Date().toISOString() };
        syncMapToBackend(nextMap);
        return nextMap;
      });

      if (!isRemoteUpdateRef.current) {
        realtimeSync.sendNodeUpdate(updated);
      }
    },
    [syncMapToBackend]
  );

  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      setCurrentMap((prev) => {
        if (!prev) return prev;
        const nextNodes = prev.nodes.filter((n) => n.id !== nodeId);
        const nextEdges = prev.edges.filter((e) => e.source !== nodeId && e.target !== nodeId);
        const nextMap = { ...prev, nodes: nextNodes, edges: nextEdges, updatedAt: new Date().toISOString() };
        syncMapToBackend(nextMap);
        return nextMap;
      });

      if (!isRemoteUpdateRef.current) {
        realtimeSync.sendNodeDelete(nodeId);
      }
    },
    [syncMapToBackend]
  );

  const handleAddNode = useCallback(
    (newNode: MapNode) => {
      setCurrentMap((prev) => {
        if (!prev) return prev;
        const nextMap = { ...prev, nodes: [...prev.nodes, newNode], updatedAt: new Date().toISOString() };
        syncMapToBackend(nextMap);
        return nextMap;
      });

      if (!isRemoteUpdateRef.current) {
        realtimeSync.sendNodeCreate(newNode);
      }
    },
    [syncMapToBackend]
  );

  const handleAddEdge = useCallback(
    (newEdge: MapEdge) => {
      setCurrentMap((prev) => {
        if (!prev) return prev;
        const nextMap = { ...prev, edges: [...prev.edges, newEdge], updatedAt: new Date().toISOString() };
        syncMapToBackend(nextMap);
        return nextMap;
      });

      if (!isRemoteUpdateRef.current) {
        realtimeSync.sendEdgeCreate(newEdge);
      }
    },
    [syncMapToBackend]
  );

  const handleDeleteEdge = useCallback(
    (edgeId: string) => {
      setCurrentMap((prev) => {
        if (!prev) return prev;
        const nextMap = { ...prev, edges: prev.edges.filter((e) => e.id !== edgeId), updatedAt: new Date().toISOString() };
        syncMapToBackend(nextMap);
        return nextMap;
      });

      if (!isRemoteUpdateRef.current) {
        realtimeSync.sendEdgeDelete(edgeId);
      }
    },
    [syncMapToBackend]
  );

  const handleUpdateMap = useCallback(
    (updatedPartial: Partial<MindMap>) => {
      setCurrentMap((prev) => {
        if (!prev) return prev;
        const nextMap = { ...prev, ...updatedPartial, updatedAt: new Date().toISOString() };
        syncMapToBackend(nextMap);
        if (updatedPartial.nodes || updatedPartial.edges) {
          realtimeSync.sendMapSync(nextMap.nodes, nextMap.edges);
        }
        return nextMap;
      });
    },
    [syncMapToBackend]
  );

  // Map Management
  const handleSelectMap = (mapId: string) => {
    loadMap(mapId);
  };

  const handleCreateNewMap = async (title: string, category: MindMap['category'], templateId?: string) => {
    try {
      let initialNodes: MapNode[] | undefined;
      let initialEdges: MapEdge[] | undefined;

      if (templateId) {
        // Fetch template from server
        const res = await fetch(`/api/maps/${templateId}`);
        const data = await res.json();
        if (data.map) {
          initialNodes = data.map.nodes;
          initialEdges = data.map.edges;
        }
      }

      const res = await fetch('/api/maps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          nodes: initialNodes,
          edges: initialEdges
        })
      });
      const data = await res.json();
      if (data.map) {
        setCurrentMap(data.map);
        loadMapsList();
        realtimeSync.connect(data.map.id);
        setCurrentView('canvas');
      }
    } catch (e) {
      console.warn('Error creating new map:', e);
    }
  };

  const handleDeleteMap = async (mapId: string) => {
    try {
      await fetch(`/api/maps/${mapId}`, { method: 'DELETE' });
      await loadMapsList();
      if (currentMap?.id === mapId) {
        loadMap(DEFAULT_MAP_ID);
      }
    } catch (e) {
      console.warn('Error deleting map:', e);
    }
  };

  // Export Map
  const handleExport = (format: 'json' | 'markdown') => {
    if (!currentMap) return;

    if (format === 'json') {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentMap, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `${currentMap.title.replace(/\s+/g, '_')}_stratmind.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } else if (format === 'markdown') {
      let md = `# ${currentMap.title}\n\n`;
      md += `*Catégorie : ${currentMap.category.toUpperCase()} | Date : ${new Date().toLocaleDateString('fr-FR')}*\n\n`;
      md += `> ${currentMap.description}\n\n`;

      const goals = currentMap.nodes.filter((n) => n.type === 'goal');
      const concepts = currentMap.nodes.filter((n) => n.type === 'concept');
      const decisions = currentMap.nodes.filter((n) => n.type === 'decision');
      const actions = currentMap.nodes.filter((n) => n.type === 'action');
      const risks = currentMap.nodes.filter((n) => n.type === 'risk');

      if (goals.length > 0) {
        md += `## 🎯 Objectifs Stratégiques & KPIs\n`;
        goals.forEach((g) => {
          md += `- **${g.title}** : ${g.description || 'N/A'}\n`;
        });
        md += `\n`;
      }

      if (decisions.length > 0) {
        md += `## 🧭 Hypothèses & Points d'Arbitrage\n`;
        decisions.forEach((d) => {
          md += `- **${d.title}** (Priorité: ${d.priority || 'moyenne'}) : ${d.description || 'N/A'}\n`;
        });
        md += `\n`;
      }

      if (risks.length > 0) {
        md += `## ⚠️ Risques Majeurs & Vulnérabilités\n`;
        risks.forEach((r) => {
          md += `- **[${r.priority?.toUpperCase() || 'MOYEN'}] ${r.title}** : ${r.description || 'N/A'}\n`;
        });
        md += `\n`;
      }

      if (actions.length > 0) {
        md += `## ✅ Plan d'Action Opérationnel\n`;
        actions.forEach((a) => {
          const check = a.status === 'completed' ? '[x]' : '[ ]';
          md += `- ${check} **${a.title}** ${a.assignee ? `(@${a.assignee})` : ''} ${
            a.dueDate ? `[Échéance: ${a.dueDate}]` : ''
          }\n  ${a.description || ''}\n`;
        });
        md += `\n`;
      }

      const dataStr = 'data:text/markdown;charset=utf-8,' + encodeURIComponent(md);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `${currentMap.title.replace(/\s+/g, '_')}_synthese.md`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    }
  };

  // Import JSON
  const handleImportJSON = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.title && Array.isArray(parsed.nodes)) {
        const id = 'map-import-' + Date.now().toString(36);
        const importedMap: MindMap = {
          ...parsed,
          id,
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString()
        };
        fetch('/api/maps', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(importedMap)
        }).then(() => {
          setCurrentMap(importedMap);
          loadMapsList();
          realtimeSync.connect(importedMap.id);
          setCurrentView('canvas');
        });
      }
    } catch (e) {
      alert('Format de fichier JSON invalide.');
    }
  };

  const themeConfig = THEME_CONFIGS[theme];

  return (
    <div id="stratmind-app-root" className={`h-screen w-screen flex flex-col overflow-hidden ${themeConfig.bg} ${themeConfig.textPrimary}`}>
      {/* Top Navbar */}
      {currentMap && !isPresentationMode && (
        <Navbar
          currentView={currentView}
          setCurrentView={setCurrentView}
          currentMap={currentMap}
          onOpenMapsModal={() => setIsMapsModalOpen(true)}
          onNewMap={() => setIsMapsModalOpen(true)}
          theme={theme}
          setTheme={setTheme}
          activeUsers={activeUsers}
          isConnected={isConnected}
          latency={latency}
          onExport={handleExport}
          onFitCanvas={handleFitCanvas}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectNode={handleSelectNodeFromSearch}
          selectedNodeId={selectedNodeId}
          isPresentationMode={isPresentationMode}
          onTogglePresentation={handleTogglePresentation}
        />
      )}

      {/* Main View Area */}
      <main className="flex-1 relative overflow-hidden">
        {currentView === 'landing' && (
          <LandingPage
            onStartApp={(templateId) => {
              if (templateId) {
                loadMap(templateId);
              }
              setCurrentView('canvas');
            }}
            theme={theme}
          />
        )}

        {currentView === 'canvas' && currentMap && (
          <Canvas
            map={currentMap}
            onUpdateMap={handleUpdateMap}
            onUpdateNode={handleUpdateNode}
            onDeleteNode={handleDeleteNode}
            onAddNode={handleAddNode}
            onAddEdge={handleAddEdge}
            onDeleteEdge={handleDeleteEdge}
            collaboratorCursors={collaboratorCursors}
            theme={theme}
            targetNodeToFocus={targetNodeToFocus}
            onClearTargetNodeToFocus={() => setTargetNodeToFocus(null)}
            fitCanvasTrigger={fitCanvasTrigger}
            onClearFitCanvasTrigger={() => setFitCanvasTrigger(0)}
            searchQuery={searchQuery}
            onClearSearchQuery={() => setSearchQuery('')}
            isPresentationMode={isPresentationMode}
            onTogglePresentation={handleTogglePresentation}
          />
        )}

        {currentView === 'action_plan' && currentMap && (
          <StrategicActionView
            map={currentMap}
            theme={theme}
            onUpdateNode={handleUpdateNode}
            onNavigateToNodeOnCanvas={(nodeId) => {
              setTargetNodeToFocus(nodeId);
              setCurrentView('canvas');
            }}
            onExportMarkdown={() => handleExport('markdown')}
          />
        )}
      </main>

      {/* Maps Manager Modal */}
      {isMapsModalOpen && currentMap && (
        <MapsModal
          currentMapId={currentMap.id}
          mapsList={mapsList}
          onSelectMap={handleSelectMap}
          onCreateNewMap={handleCreateNewMap}
          onDeleteMap={handleDeleteMap}
          onClose={() => setIsMapsModalOpen(false)}
          onImportJSON={handleImportJSON}
          theme={theme}
        />
      )}
    </div>
  );
}
