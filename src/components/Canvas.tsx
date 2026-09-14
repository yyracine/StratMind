import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  BlockType,
  CanvasTool,
  CanvasTransform,
  CollaboratorCursor,
  MapEdge,
  MapNode,
  MindMap,
  ThemeMode
} from '../types';
import { BLOCK_CONFIGS, THEME_CONFIGS } from '../constants';
import { NodeItem } from './NodeItem';
import { CanvasToolbar } from './CanvasToolbar';
import { NodeInspector } from './NodeInspector';
import { AIAssistModal } from './AIAssistModal';
import { NodeTemplateModal } from './NodeTemplateModal';
import { CanvasMinimap } from './CanvasMinimap';
import { realtimeSync } from '../services/websocket';
import { PredefinedNodeTemplate } from '../types';
import { X, Sparkles, Trash2, ArrowRight, Move, Search, Tv, EyeOff, Maximize2 } from 'lucide-react';

interface CanvasHistoryEntry {
  nodes: MapNode[];
  edges: MapEdge[];
  description?: string;
}

const cloneSnapshot = (nodes: MapNode[], edges: MapEdge[], description?: string): CanvasHistoryEntry => ({
  nodes: nodes.map((n) => ({
    ...n,
    tags: n.tags ? [...n.tags] : []
  })),
  edges: edges.map((e) => ({ ...e })),
  description
});

interface CanvasProps {
  map: MindMap;
  onUpdateMap: (updated: Partial<MindMap>) => void;
  onUpdateNode: (node: Partial<MapNode> & { id: string }) => void;
  onDeleteNode: (nodeId: string) => void;
  onAddNode: (node: MapNode) => void;
  onAddEdge: (edge: MapEdge) => void;
  onDeleteEdge: (edgeId: string) => void;
  collaboratorCursors: Map<string, CollaboratorCursor>;
  theme: ThemeMode;
  targetNodeToFocus?: string | null;
  onClearTargetNodeToFocus?: () => void;
  fitCanvasTrigger?: number;
  onClearFitCanvasTrigger?: () => void;
  searchQuery?: string;
  onClearSearchQuery?: () => void;
  isPresentationMode?: boolean;
  onTogglePresentation?: () => void;
}

export const Canvas: React.FC<CanvasProps> = ({
  map,
  onUpdateMap,
  onUpdateNode,
  onDeleteNode,
  onAddNode,
  onAddEdge,
  onDeleteEdge,
  collaboratorCursors,
  theme,
  targetNodeToFocus,
  onClearTargetNodeToFocus,
  fitCanvasTrigger,
  onClearFitCanvasTrigger,
  searchQuery,
  onClearSearchQuery,
  isPresentationMode,
  onTogglePresentation
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Viewport Transform
  const [transform, setTransform] = useState<CanvasTransform>({ x: 100, y: 80, scale: 1 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const pointerDownPosRef = useRef<{ x: number; y: number } | null>(null);

  // Move All Nodes state
  const [isDraggingAll, setIsDraggingAll] = useState(false);
  const dragAllStartRef = useRef<{ clientX: number; clientY: number; nodes: MapNode[] } | null>(null);

  // Current Tool & Selection
  const [tool, setTool] = useState<CanvasTool>('select');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

  // Node Dragging State
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [nodeDragOffset, setNodeDragOffset] = useState({ x: 0, y: 0 });

  // Connection Dragging State
  const [connectingSourceId, setConnectingSourceId] = useState<string | null>(null);
  const [connectStartPos, setConnectStartPos] = useState<{ x: number; y: number } | null>(null);
  const [connectCurrentPos, setConnectCurrentPos] = useState<{ x: number; y: number } | null>(null);

  // AI Modal
  const [aiModalNode, setAiModalNode] = useState<MapNode | null>(null);

  // Pre-defined Node Templates Modal
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [templateTargetNode, setTemplateTargetNode] = useState<MapNode | null>(null);

  // Undo / Redo History Stacks
  const [undoStack, setUndoStack] = useState<CanvasHistoryEntry[]>([]);
  const [redoStack, setRedoStack] = useState<CanvasHistoryEntry[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const lastMapIdRef = useRef(map.id);
  const dragStartSnapshotRef = useRef<CanvasHistoryEntry | null>(null);
  const lastTextEditTimeRef = useRef<number>(0);
  const lastEditedNodeIdRef = useRef<string | null>(null);

  // Reset history stack when switching maps
  useEffect(() => {
    if (lastMapIdRef.current !== map.id) {
      lastMapIdRef.current = map.id;
      setUndoStack([]);
      setRedoStack([]);
    }
  }, [map.id]);

  const showToast = useCallback((msg: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(msg);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 1800);
  }, []);

  // Push current snapshot before mutation
  const pushUndoSnapshot = useCallback(
    (description?: string) => {
      setUndoStack((prev) => [...prev, cloneSnapshot(map.nodes, map.edges, description)].slice(-50));
      setRedoStack([]);
    },
    [map.nodes, map.edges]
  );

  // Undo Action
  const handleUndo = useCallback(() => {
    setUndoStack((prevUndo) => {
      if (prevUndo.length === 0) return prevUndo;

      const previousSnapshot = prevUndo[prevUndo.length - 1];
      const newUndo = prevUndo.slice(0, -1);

      // Save current state to redo
      setRedoStack((prevRedo) => [...prevRedo, cloneSnapshot(map.nodes, map.edges)].slice(-50));

      onUpdateMap({
        nodes: previousSnapshot.nodes,
        edges: previousSnapshot.edges
      });

      if (selectedNodeId && !previousSnapshot.nodes.some((n) => n.id === selectedNodeId)) {
        setSelectedNodeId(null);
      }
      if (selectedEdgeId && !previousSnapshot.edges.some((e) => e.id === selectedEdgeId)) {
        setSelectedEdgeId(null);
      }

      showToast('Action annulée (Ctrl+Z)');
      return newUndo;
    });
  }, [map.nodes, map.edges, onUpdateMap, selectedNodeId, selectedEdgeId, showToast]);

  // Redo Action
  const handleRedo = useCallback(() => {
    setRedoStack((prevRedo) => {
      if (prevRedo.length === 0) return prevRedo;

      const nextSnapshot = prevRedo[prevRedo.length - 1];
      const newRedo = prevRedo.slice(0, -1);

      // Save current state to undo
      setUndoStack((prevUndo) => [...prevUndo, cloneSnapshot(map.nodes, map.edges)].slice(-50));

      onUpdateMap({
        nodes: nextSnapshot.nodes,
        edges: nextSnapshot.edges
      });

      showToast('Action rétablie (Ctrl+Y)');
      return newRedo;
    });
  }, [map.nodes, map.edges, onUpdateMap, showToast]);

  // History-tracked node update
  const handleUpdateNodeWithHistory = useCallback(
    (updated: Partial<MapNode> & { id: string }) => {
      const isTextEdit = updated.title !== undefined || updated.description !== undefined;
      const now = Date.now();

      if (isTextEdit) {
        if (lastEditedNodeIdRef.current !== updated.id || now - lastTextEditTimeRef.current > 1000) {
          pushUndoSnapshot('Modification texte');
        }
        lastTextEditTimeRef.current = now;
        lastEditedNodeIdRef.current = updated.id;
      } else {
        pushUndoSnapshot('Modification de nœud');
        lastTextEditTimeRef.current = 0;
        lastEditedNodeIdRef.current = null;
      }

      onUpdateNode(updated);
    },
    [pushUndoSnapshot, onUpdateNode]
  );

  // History-tracked node delete
  const handleDeleteNodeWithHistory = useCallback(
    (nodeId: string) => {
      pushUndoSnapshot('Supprimer le nœud');
      onDeleteNode(nodeId);
      setSelectedNodeId(null);
    },
    [pushUndoSnapshot, onDeleteNode]
  );

  // History-tracked edge delete
  const handleDeleteEdgeWithHistory = useCallback(
    (edgeId: string) => {
      pushUndoSnapshot('Supprimer le lien');
      onDeleteEdge(edgeId);
      setSelectedEdgeId(null);
    },
    [pushUndoSnapshot, onDeleteEdge]
  );

  // Settings
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });

  const themeConfig = THEME_CONFIGS[theme];

  // Measure container dimensions with ResizeObserver
  useEffect(() => {
    if (!containerRef.current) return;
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerDimensions({ width: rect.width, height: rect.height });
      }
    };

    updateDimensions();
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(containerRef.current);
    window.addEventListener('resize', updateDimensions);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  // Jump/pan canvas viewport to specific world coordinates (used by Minimap)
  const handleNavigateTo = useCallback((worldX: number, worldY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setTransform((prev) => ({
      ...prev,
      x: Math.round(rect.width / 2 - worldX * prev.scale),
      y: Math.round(rect.height / 2 - worldY * prev.scale)
    }));
  }, []);

  // Convert screen coordinates to world canvas coordinates
  const screenToWorld = useCallback(
    (screenX: number, screenY: number) => {
      if (!containerRef.current) return { x: 0, y: 0 };
      const rect = containerRef.current.getBoundingClientRect();
      const x = (screenX - rect.left - transform.x) / transform.scale;
      const y = (screenY - rect.top - transform.y) / transform.scale;
      return { x, y };
    },
    [transform]
  );

  // Focus on specific node if requested
  useEffect(() => {
    if (targetNodeToFocus && containerRef.current) {
      const node = map.nodes.find((n) => n.id === targetNodeToFocus);
      if (node) {
        const rect = containerRef.current.getBoundingClientRect();
        const nodeW = node.type === 'note' ? 220 : 260;
        const nodeH = 100;
        const targetScale = 1;
        setTransform({
          x: Math.round(rect.width / 2 - (node.x + nodeW / 2) * targetScale),
          y: Math.round(rect.height / 2 - (node.y + nodeH / 2) * targetScale),
          scale: targetScale
        });
        setSelectedNodeId(node.id);
        if (onClearTargetNodeToFocus) onClearTargetNodeToFocus();
      }
    }
  }, [targetNodeToFocus, map.nodes, onClearTargetNodeToFocus]);

  // Zoom to point
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (!containerRef.current) return;

    // Trackpad pinch vs pan
    if (e.ctrlKey || e.metaKey) {
      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
      const newScale = Math.min(2.5, Math.max(0.2, transform.scale * zoomFactor));

      const worldX = (mouseX - transform.x) / transform.scale;
      const worldY = (mouseY - transform.y) / transform.scale;

      setTransform({
        x: mouseX - worldX * newScale,
        y: mouseY - worldY * newScale,
        scale: newScale
      });
    } else {
      // Normal pan with wheel
      setTransform((prev) => ({
        ...prev,
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY
      }));
    }
  };

  // Broadcast cursor to collaborators
  const handlePointerMove = (e: React.PointerEvent) => {
    const world = screenToWorld(e.clientX, e.clientY);
    realtimeSync.sendCursor(Math.round(world.x), Math.round(world.y));

    // Handle moving all nodes together
    if (isDraggingAll && dragAllStartRef.current) {
      const dx = (e.clientX - dragAllStartRef.current.clientX) / transform.scale;
      const dy = (e.clientY - dragAllStartRef.current.clientY) / transform.scale;
      const movedNodes = dragAllStartRef.current.nodes.map((n) => ({
        ...n,
        x: Math.round(n.x + dx),
        y: Math.round(n.y + dy)
      }));
      onUpdateMap({ nodes: movedNodes });
      return;
    }

    // Handle canvas panning
    if (isPanning) {
      setTransform((prev) => ({
        ...prev,
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      }));
      return;
    }

    // Handle node dragging
    if (draggingNodeId) {
      let targetX = world.x - nodeDragOffset.x;
      let targetY = world.y - nodeDragOffset.y;

      if (snapToGrid) {
        targetX = Math.round(targetX / 20) * 20;
        targetY = Math.round(targetY / 20) * 20;
      }

      onUpdateNode({ id: draggingNodeId, x: targetX, y: targetY });
      return;
    }

    // Handle rubberband connection line
    if (connectingSourceId && connectStartPos) {
      setConnectCurrentPos({ x: world.x, y: world.y });
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    // If tool is 'move_all', clicking anywhere initiates moving the entire map!
    if (tool === 'move_all' && e.button === 0) {
      setIsDraggingAll(true);
      dragAllStartRef.current = {
        clientX: e.clientX,
        clientY: e.clientY,
        nodes: map.nodes.map((n) => ({ ...n, tags: n.tags ? [...n.tags] : [] }))
      };
      pushUndoSnapshot('Déplacer tous les nœuds');
      return;
    }

    const isNodeOrControl = (e.target as HTMLElement)?.closest(
      '[id^="node-"], button, input, textarea, aside, [id="canvas-minimap-overlay"], [id="node-inspector-panel"]'
    );

    // Left click on background or middle click starts panning
    if ((e.button === 0 && !isNodeOrControl) || e.button === 1) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
      pointerDownPosRef.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDraggingAll) {
      setIsDraggingAll(false);
      dragAllStartRef.current = null;
      showToast('Carte repositionnée');
      return;
    }

    if (pointerDownPosRef.current) {
      const dist = Math.hypot(e.clientX - pointerDownPosRef.current.x, e.clientY - pointerDownPosRef.current.y);
      if (dist < 6) {
        setSelectedNodeId(null);
        setSelectedEdgeId(null);
      }
      pointerDownPosRef.current = null;
    }

    setIsPanning(false);

    // If node was dragged, verify if coordinates changed to save single undo step
    if (draggingNodeId && dragStartSnapshotRef.current) {
      const origNode = dragStartSnapshotRef.current.nodes.find((n) => n.id === draggingNodeId);
      const currNode = map.nodes.find((n) => n.id === draggingNodeId);
      if (origNode && currNode && (origNode.x !== currNode.x || origNode.y !== currNode.y)) {
        setUndoStack((prev) => [...prev, dragStartSnapshotRef.current!].slice(-50));
        setRedoStack([]);
      }
      dragStartSnapshotRef.current = null;
    }
    setDraggingNodeId(null);

    // If connecting line was released, check if released over another node
    if (connectingSourceId) {
      const world = screenToWorld(e.clientX, e.clientY);
      // Check collision with other nodes
      const targetNode = map.nodes.find((n) => {
        if (n.id === connectingSourceId) return false;
        const width = n.type === 'note' ? 220 : 260;
        const height = 120;
        return (
          world.x >= n.x &&
          world.x <= n.x + width &&
          world.y >= n.y &&
          world.y <= n.y + height
        );
      });

      if (targetNode) {
        // Push snapshot before creating edge
        pushUndoSnapshot('Connexion de nœuds');
        // Create new edge
        const newEdge: MapEdge = {
          id: 'edge-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 5),
          source: connectingSourceId,
          target: targetNode.id,
          style: 'curved',
          color: '#6366f1',
          direction: 'forward',
          label: 'Lie à'
        };
        onAddEdge(newEdge);
      }

      setConnectingSourceId(null);
      setConnectStartPos(null);
      setConnectCurrentPos(null);
    }
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput =
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement)?.isContentEditable;

      if (isInput) {
        return;
      }

      // Undo: Ctrl+Z or Cmd+Z (without Shift)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z') && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
        return;
      }

      // Redo: Ctrl+Y or Ctrl+Shift+Z or Cmd+Shift+Z
      if (
        (e.ctrlKey || e.metaKey) &&
        (((e.key === 'z' || e.key === 'Z') && e.shiftKey) || e.key === 'y' || e.key === 'Y')
      ) {
        e.preventDefault();
        handleRedo();
        return;
      }

      if ((e.ctrlKey || e.metaKey) && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setTool('move_all');
        showToast('Mode Déplacer toute la carte activé (M)');
        return;
      }

      if (e.key === 'm' || e.key === 'M') {
        setTool((prev) => (prev === 'move_all' ? 'select' : 'move_all'));
        showToast(tool === 'move_all' ? 'Mode Sélection (V)' : 'Mode Déplacer toute la carte (M)');
        return;
      }

      if (e.key === 'p' || e.key === 'P') {
        if (onTogglePresentation) {
          onTogglePresentation();
          showToast(!isPresentationMode ? 'Mode Présentation activé' : 'Mode Édition rétabli');
        }
        return;
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedNodeId) {
          handleDeleteNodeWithHistory(selectedNodeId);
        } else if (selectedEdgeId) {
          handleDeleteEdgeWithHistory(selectedEdgeId);
        }
      } else if (e.key === 'v' || e.key === 'V') {
        setTool('select');
        showToast('Mode Sélection (V)');
      } else if (e.key === 'h' || e.key === 'H') {
        setTool('pan');
        showToast('Mode Panoramique (H)');
      } else if (e.key === 'f' || e.key === 'F') {
        handleFitCanvas();
      } else if (e.key === 't' || e.key === 'T') {
        setIsTemplateModalOpen(true);
        const currNode = map.nodes.find((n) => n.id === selectedNodeId) || null;
        setTemplateTargetNode(currNode);
      } else if (e.key === '+' || e.key === '=') {
        handleZoom(1.15);
      } else if (e.key === '-') {
        handleZoom(0.85);
      } else if (e.key === 'Escape') {
        if (isPresentationMode && onTogglePresentation) {
          onTogglePresentation();
          showToast('Mode Édition rétabli');
        }
        setSelectedNodeId(null);
        setSelectedEdgeId(null);
        setConnectingSourceId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    selectedNodeId,
    selectedEdgeId,
    handleUndo,
    handleRedo,
    handleDeleteNodeWithHistory,
    handleDeleteEdgeWithHistory,
    map.nodes,
    isPresentationMode,
    onTogglePresentation
  ]);

  // Zoom Helpers
  const handleZoom = (factor: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const newScale = Math.min(2.5, Math.max(0.2, transform.scale * factor));
    const worldX = (centerX - transform.x) / transform.scale;
    const worldY = (centerY - transform.y) / transform.scale;

    setTransform({
      x: centerX - worldX * newScale,
      y: centerY - worldY * newScale,
      scale: newScale
    });
  };

  const handleZoomReset = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setTransform({
      x: rect.width / 2 - 400,
      y: rect.height / 2 - 300,
      scale: 1
    });
  };

  // Fit all nodes into viewport
  const handleFitCanvas = useCallback(() => {
    if (!containerRef.current || map.nodes.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();

    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    map.nodes.forEach((n) => {
      const s = n.shape || 'rectangle';
      const nodeW = s === 'circle' ? 240 : s === 'diamond' ? 260 : (n.type === 'note' ? 220 : 260);
      const nodeH = s === 'circle' ? 240 : s === 'diamond' ? 220 : 140;
      minX = Math.min(minX, n.x);
      maxX = Math.max(maxX, n.x + nodeW);
      minY = Math.min(minY, n.y);
      maxY = Math.max(maxY, n.y + nodeH);
    });

    const contentWidth = maxX - minX + 160;
    const contentHeight = maxY - minY + 160;

    const scaleX = rect.width / contentWidth;
    const scaleY = rect.height / contentHeight;
    const newScale = Math.min(1.2, Math.max(0.25, Math.min(scaleX, scaleY)));

    const midX = (minX + maxX) / 2;
    const midY = (minY + maxY) / 2;

    setTransform({
      x: Math.round(rect.width / 2 - midX * newScale),
      y: Math.round(rect.height / 2 - midY * newScale),
      scale: newScale
    });
  }, [map.nodes]);

  // Handle external fit canvas trigger (e.g. from navbar zoom-to-fit button)
  useEffect(() => {
    if (fitCanvasTrigger && fitCanvasTrigger > 0) {
      handleFitCanvas();
      if (onClearFitCanvasTrigger) {
        onClearFitCanvasTrigger();
      }
    }
  }, [fitCanvasTrigger, handleFitCanvas, onClearFitCanvasTrigger]);

  // Auto-arrange nodes in clean strategic tree hierarchy
  const handleAutoLayout = () => {
    if (map.nodes.length === 0) return;
    pushUndoSnapshot('Réorganisation automatique');

    // Arrange roots and branches
    const visited = new Set<string>();
    const rootNodes = map.nodes.filter(
      (n) => !map.edges.some((e) => e.target === n.id) || n.type === 'goal'
    );

    const roots = rootNodes.length > 0 ? rootNodes : [map.nodes[0]];
    const newNodes = [...map.nodes];

    let startY = 140;
    roots.forEach((root) => {
      const idx = newNodes.findIndex((n) => n.id === root.id);
      if (idx !== -1) {
        newNodes[idx] = { ...newNodes[idx], x: 120, y: startY };
        visited.add(root.id);
      }

      // Find children
      const children = map.edges
        .filter((e) => e.source === root.id)
        .map((e) => e.target);

      let childY = startY - (children.length * 70);
      children.forEach((cId) => {
        const cIdx = newNodes.findIndex((n) => n.id === cId);
        if (cIdx !== -1 && !visited.has(cId)) {
          newNodes[cIdx] = { ...newNodes[cIdx], x: 480, y: Math.max(100, childY) };
          visited.add(cId);

          // Find grandchildren
          const grandChildren = map.edges
            .filter((e) => e.source === cId)
            .map((e) => e.target);
          let grandChildY = childY;
          grandChildren.forEach((gcId) => {
            const gcIdx = newNodes.findIndex((n) => n.id === gcId);
            if (gcIdx !== -1 && !visited.has(gcId)) {
              newNodes[gcIdx] = { ...newNodes[gcIdx], x: 840, y: Math.max(100, grandChildY) };
              visited.add(gcId);
              grandChildY += 160;
            }
          });

          childY += 180;
        }
      });

      startY += Math.max(260, children.length * 160);
    });

    onUpdateMap({ nodes: newNodes });
    setTimeout(handleFitCanvas, 100);
  };

  // Node Selection & Dragging Initiation
  const handleSelectNode = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    // If in move_all mode, clicking on a node drags ALL nodes together!
    if (tool === 'move_all' && e.button === 0) {
      setIsDraggingAll(true);
      dragAllStartRef.current = {
        clientX: e.clientX,
        clientY: e.clientY,
        nodes: map.nodes.map((n) => ({ ...n, tags: n.tags ? [...n.tags] : [] }))
      };
      pushUndoSnapshot('Déplacer tous les nœuds');
      return;
    }

    setSelectedNodeId(nodeId);
    setSelectedEdgeId(null);

    const world = screenToWorld(e.clientX, e.clientY);
    const node = map.nodes.find((n) => n.id === nodeId);
    if (node) {
      setDraggingNodeId(nodeId);
      setNodeDragOffset({
        x: world.x - node.x,
        y: world.y - node.y
      });
      // Capture snapshot before dragging commences
      dragStartSnapshotRef.current = cloneSnapshot(map.nodes, map.edges, 'Déplacement');
    }
  };

  // Start connection from handle
  const handleStartConnect = (nodeId: string, handlePos: { x: number; y: number }, e: React.MouseEvent) => {
    e.stopPropagation();
    setConnectingSourceId(nodeId);
    setConnectStartPos(handlePos);
    setConnectCurrentPos(handlePos);
  };

  // Add block on canvas
  const handleAddBlock = (type: BlockType) => {
    if (!containerRef.current) return;
    pushUndoSnapshot('Ajout de bloc');
    const rect = containerRef.current.getBoundingClientRect();
    const centerWorld = screenToWorld(rect.width / 2, rect.height / 2);

    const cfg = BLOCK_CONFIGS[type];
    const newNode: MapNode = {
      id: 'node-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 5),
      type,
      title: `Nouveau ${cfg.label.split('/')[0]}`,
      description: cfg.description,
      x: Math.round(centerWorld.x - 130 + (Math.random() * 60 - 30)),
      y: Math.round(centerWorld.y - 60 + (Math.random() * 60 - 30)),
      color: cfg.defaultColor,
      priority: 'high',
      tags: [cfg.label.split('/')[0]],
      status: type === 'action' ? 'in_progress' : undefined,
      dueDate: type === 'action' ? new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0] : undefined
    };

    onAddNode(newNode);
    setSelectedNodeId(newNode.id);
  };

  // Duplicate node
  const handleDuplicateNode = (sourceNode: MapNode) => {
    pushUndoSnapshot('Duplication de nœud');
    const newNode: MapNode = {
      ...sourceNode,
      id: 'node-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 5),
      title: `${sourceNode.title} (Copie)`,
      x: sourceNode.x + 40,
      y: sourceNode.y + 40
    };
    onAddNode(newNode);
    setSelectedNodeId(newNode.id);
  };

  // Apply branches generated by AI Assist
  const handleApplyAIBranches = (
    parentNode: MapNode,
    branches: { type: MapNode['type']; title: string; desc: string; color: string; priority: MapNode['priority'] }[]
  ) => {
    pushUndoSnapshot('Branches IA');
    const newNodes: MapNode[] = [];
    const newEdges: MapEdge[] = [];

    const spacing = 160;
    const startY = parentNode.y - ((branches.length - 1) * spacing) / 2;

    branches.forEach((b, idx) => {
      const childId = 'node-' + Date.now().toString(36) + '-' + idx;
      const childNode: MapNode = {
        id: childId,
        type: b.type,
        title: b.title,
        description: b.desc,
        color: b.color,
        priority: b.priority,
        x: parentNode.x + 360,
        y: startY + idx * spacing,
        tags: ['Généré', b.type],
        status: b.type === 'action' ? 'backlog' : undefined
      };
      newNodes.push(childNode);

      const edge: MapEdge = {
        id: 'edge-' + Date.now().toString(36) + '-' + idx,
        source: parentNode.id,
        target: childId,
        style: 'curved',
        color: b.color,
        direction: 'forward',
        label: b.type === 'action' ? 'Action' : b.type === 'risk' ? 'Risque' : 'Ramification'
      };
      newEdges.push(edge);
    });

    onUpdateMap({
      nodes: [...map.nodes, ...newNodes],
      edges: [...map.edges, ...newEdges]
    });
  };

  // Apply pre-defined node cluster template (SWOT, Brainstorming bubbles, etc.)
  const handleApplyTemplate = (
    template: PredefinedNodeTemplate,
    customTitle: string,
    connectToNodeId?: string
  ) => {
    if (!containerRef.current) return;
    pushUndoSnapshot('Ajout de modèle');
    const rect = containerRef.current.getBoundingClientRect();

    let originX: number;
    let originY: number;

    const anchorNode = connectToNodeId ? map.nodes.find((n) => n.id === connectToNodeId) : null;
    if (anchorNode) {
      originX = anchorNode.x + 520;
      originY = anchorNode.y;
    } else {
      const centerWorld = screenToWorld(rect.width / 2, rect.height / 2);
      originX = centerWorld.x;
      originY = centerWorld.y;
    }

    const baseTimestamp = Date.now().toString(36);
    const nodeIds = template.nodes.map(
      (_, i) => 'node-' + baseTimestamp + '-' + i + '-' + Math.random().toString(36).substring(2, 6)
    );

    const newNodes: MapNode[] = template.nodes.map((tNode, idx) => {
      const finalTitle = idx === 0 && customTitle.trim() ? customTitle.trim() : tNode.title;
      const cfg = BLOCK_CONFIGS[tNode.type] || BLOCK_CONFIGS.concept;
      return {
        id: nodeIds[idx],
        type: tNode.type,
        title: finalTitle,
        description: tNode.description,
        x: Math.round(originX + tNode.relativeX - 130),
        y: Math.round(originY + tNode.relativeY - 55),
        color: tNode.color || cfg.defaultColor,
        priority: tNode.priority || 'high',
        tags: tNode.tags ? [...tNode.tags] : [cfg.label.split('/')[0]],
        status: tNode.status || (tNode.type === 'action' ? 'in_progress' : undefined),
        dueDate:
          tNode.type === 'action'
            ? new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
            : undefined
      };
    });

    const newEdges: MapEdge[] = template.edges.map((tEdge, i) => ({
      id: 'edge-' + baseTimestamp + '-' + i + '-' + Math.random().toString(36).substring(2, 6),
      source: nodeIds[tEdge.sourceIndex],
      target: nodeIds[tEdge.targetIndex],
      label: tEdge.label,
      color: tEdge.color || '#6366f1',
      style: tEdge.style || 'curved',
      direction: tEdge.direction || 'forward'
    }));

    if (anchorNode) {
      newEdges.push({
        id: 'edge-' + baseTimestamp + '-conn-' + Math.random().toString(36).substring(2, 6),
        source: anchorNode.id,
        target: nodeIds[0],
        label: template.name.split(' ')[0],
        color: template.accentColor || '#6366f1',
        style: 'curved',
        direction: 'forward'
      });
    }

    onUpdateMap({
      nodes: [...map.nodes, ...newNodes],
      edges: [...map.edges, ...newEdges]
    });

    setSelectedNodeId(nodeIds[0]);
    setSelectedEdgeId(null);
  };

  const selectedNode = map.nodes.find((n) => n.id === selectedNodeId) || null;

  // Calculate curve path for edge
  const getEdgePath = (edge: MapEdge) => {
    const sourceNode = map.nodes.find((n) => n.id === edge.source);
    const targetNode = map.nodes.find((n) => n.id === edge.target);
    if (!sourceNode || !targetNode) return null;

    const getNodeDims = (n: MapNode) => {
      const s = n.shape || 'rectangle';
      if (s === 'circle') return { w: 240, h: 240 };
      if (s === 'diamond') return { w: 260, h: 220 };
      return { w: n.type === 'note' ? 220 : 260, h: 120 };
    };

    const sourceDim = getNodeDims(sourceNode);
    const targetDim = getNodeDims(targetNode);
    const sourceW = sourceDim.w;
    const targetW = targetDim.w;
    const sourceH = sourceDim.h;
    const targetH = targetDim.h;

    let sx = sourceNode.x + sourceW;
    let sy = sourceNode.y + sourceH / 2;
    let tx = targetNode.x;
    let ty = targetNode.y + targetH / 2;

    // If target is to the left of source
    if (targetNode.x + targetW < sourceNode.x) {
      sx = sourceNode.x;
      tx = targetNode.x + targetW;
    }

    const dx = Math.abs(tx - sx) * 0.5;
    const cx1 = sx + (tx > sx ? dx : -dx);
    const cy1 = sy;
    const cx2 = tx + (tx > sx ? -dx : dx);
    const cy2 = ty;

    const midX = (sx + tx) / 2;
    const midY = (sy + ty) / 2;

    return {
      d: `M ${sx} ${sy} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${tx} ${ty}`,
      midX,
      midY,
      sx,
      sy,
      tx,
      ty
    };
  };

  return (
    <div
      id="miro-canvas-container"
      ref={containerRef}
      onWheel={handleWheel}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      style={{
        backgroundColor: themeConfig.canvasBg,
        cursor: isDraggingAll
          ? 'grabbing'
          : tool === 'move_all'
          ? 'move'
          : isPanning
          ? 'grabbing'
          : tool === 'pan'
          ? 'grab'
          : 'default'
      }}
      className={`relative w-full h-[calc(100vh-3.5rem)] overflow-hidden select-none ${themeConfig.dotsClass}`}
    >
      {/* World Transform Layer */}
      <div
        id="canvas-world-layer"
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          transformOrigin: '0 0'
        }}
        className="absolute inset-0 pointer-events-none"
      >
        {/* SVG Edges Layer */}
        <svg className="absolute inset-0 w-[8000px] h-[8000px] pointer-events-none overflow-visible">
          <defs>
            <marker
              id="arrowhead-forward"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#6366f1" />
            </marker>
            <marker
              id="arrowhead-selected"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#ec4899" />
            </marker>
          </defs>

          {/* Render Connections */}
          {map.edges.map((edge) => {
            const edgePath = getEdgePath(edge);
            if (!edgePath) return null;
            const isEdgeSelected = selectedEdgeId === edge.id;

            return (
              <g key={edge.id} className="pointer-events-auto">
                {/* Thick invisible click stroke */}
                <path
                  d={edgePath.d}
                  fill="none"
                  stroke="transparent"
                  strokeWidth="16"
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedEdgeId(edge.id);
                    setSelectedNodeId(null);
                  }}
                />

                {/* Visible stylized bezier line */}
                <path
                  d={edgePath.d}
                  fill="none"
                  stroke={isEdgeSelected ? '#ec4899' : edge.color || '#6366f1'}
                  strokeWidth={isEdgeSelected ? '3.5' : '2.5'}
                  strokeDasharray={edge.style === 'dashed' ? '6 4' : undefined}
                  markerEnd={isEdgeSelected ? 'url(#arrowhead-selected)' : 'url(#arrowhead-forward)'}
                  className="transition-colors duration-150"
                />

                {/* Connection Label badge */}
                {edge.label && (
                  <g
                    transform={`translate(${edgePath.midX}, ${edgePath.midY})`}
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedEdgeId(edge.id);
                    }}
                  >
                    <rect
                      x="-35"
                      y="-11"
                      width="70"
                      height="22"
                      rx="6"
                      fill={theme === 'light' || theme === 'sepia' ? '#ffffff' : '#0f172a'}
                      stroke={isEdgeSelected ? '#ec4899' : '#475569'}
                      strokeWidth="1.5"
                    />
                    <text
                      textAnchor="middle"
                      dy="4"
                      fontSize="10"
                      fontWeight="600"
                      fill={theme === 'light' || theme === 'sepia' ? '#334155' : '#cbd5e1'}
                    >
                      {edge.label}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Rubberband line while dragging connection */}
          {connectingSourceId && connectStartPos && connectCurrentPos && (
            <path
              d={`M ${connectStartPos.x} ${connectStartPos.y} C ${(connectStartPos.x + connectCurrentPos.x) / 2} ${connectStartPos.y}, ${(connectStartPos.x + connectCurrentPos.x) / 2} ${connectCurrentPos.y}, ${connectCurrentPos.x} ${connectCurrentPos.y}`}
              fill="none"
              stroke="#6366f1"
              strokeWidth="2.5"
              strokeDasharray="5 5"
              markerEnd="url(#arrowhead-forward)"
            />
          )}
        </svg>

        {/* HTML Nodes Layer */}
        <div className="absolute inset-0 pointer-events-none">
          {map.nodes.map((node) => {
            const query = searchQuery ? searchQuery.trim().toLowerCase() : '';
            const isMatched = Boolean(
              query &&
                (node.title.toLowerCase().includes(query) ||
                  node.description?.toLowerCase().includes(query) ||
                  node.tags?.some((t) => t.toLowerCase().includes(query)))
            );
            const isDimmed = Boolean(query && !isMatched);

            return (
              <NodeItem
                key={node.id}
                node={node}
                isSelected={selectedNodeId === node.id}
                theme={theme}
                onSelect={handleSelectNode}
                onUpdate={handleUpdateNodeWithHistory}
                onDelete={handleDeleteNodeWithHistory}
                onStartConnect={handleStartConnect}
                onOpenAIForNode={(n) => setAiModalNode(n)}
                scale={transform.scale}
                isSearchMatched={isMatched}
                isSearchDimmed={isDimmed}
              />
            );
          })}

          {/* Realtime Collaborator Cursors */}
          {Array.from(collaboratorCursors.values()).map((cursor: CollaboratorCursor) => (
            <div
              key={cursor.userId}
              style={{
                transform: `translate(${cursor.x}px, ${cursor.y}px)`,
                pointerEvents: 'none'
              }}
              className="absolute z-40 transition-transform duration-75 ease-out flex items-start gap-1"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill={cursor.userColor}
                stroke="#000000"
                strokeWidth="1.5"
                className="drop-shadow-md"
              >
                <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87a.5.5 0 0 0 .35-.85L6.35 2.85a.5.5 0 0 0-.85.36Z" />
              </svg>
              <span
                style={{ backgroundColor: cursor.userColor }}
                className="text-[10px] font-bold text-white px-1.5 py-0.5 rounded shadow-md whitespace-nowrap"
              >
                {cursor.userName}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Move All Nodes Active Mode Banner */}
      {!isPresentationMode && tool === 'move_all' && (
        <div
          className="fixed top-16 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5 px-4 py-2 rounded-full border shadow-2xl backdrop-blur-xl bg-indigo-950/90 border-indigo-500/40 text-indigo-100 text-xs font-semibold animate-in fade-in slide-in-from-top-2"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-ping" />
          <Move className="w-3.5 h-3.5 text-indigo-300" />
          <span>Mode Déplacement Global : Glissez n'importe où pour déplacer toute la carte</span>
          <button
            onClick={() => {
              setTool('select');
              showToast('Mode Sélection rétabli');
            }}
            className="ml-2 px-2.5 py-0.5 rounded-full bg-indigo-500/30 hover:bg-indigo-500/50 text-white text-[11px] font-medium transition-colors cursor-pointer"
          >
            Terminer (V)
          </button>
        </div>
      )}

      {/* Active Search Filter Banner */}
      {!isPresentationMode && searchQuery && searchQuery.trim() && tool !== 'move_all' && (
        <div
          id="canvas-search-filter-banner"
          className={`fixed top-16 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-3.5 py-1.5 rounded-full border shadow-xl backdrop-blur-xl text-xs font-semibold animate-in fade-in slide-in-from-top-2 ${
            theme === 'light' || theme === 'sepia'
              ? 'bg-white/95 border-indigo-200 text-slate-900 shadow-indigo-500/10'
              : 'bg-slate-900/95 border-indigo-500/40 text-slate-100 shadow-indigo-500/20'
          }`}
        >
          <Search className="w-3.5 h-3.5 text-indigo-400" />
          <span>Filtre actif :</span>
          <span className="font-semibold text-indigo-400">« {searchQuery} »</span>
          {onClearSearchQuery && (
            <button
              onClick={onClearSearchQuery}
              className="ml-1 p-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-slate-400 hover:text-inherit cursor-pointer"
              title="Effacer le filtre"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Presentation Mode Floating Controls (Discreet HUD to exit or fit view) */}
      {isPresentationMode && (
        <div
          id="canvas-presentation-hud"
          className="fixed top-4 right-4 z-40 flex items-center gap-2 px-3.5 py-2 rounded-2xl border shadow-2xl backdrop-blur-xl bg-slate-900/90 border-slate-700/60 text-slate-200 animate-in fade-in slide-in-from-top-3 group transition-opacity hover:opacity-100 opacity-75"
        >
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 mr-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span className="hidden sm:inline">Mode Présentation</span>
          </div>

          <div className="h-4 w-[1px] bg-slate-700 mx-1 hidden sm:block" />

          <button
            onClick={handleFitCanvas}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1.5"
            title="Ajuster la vue (F)"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Centrer</span>
          </button>

          <button
            id="exit-presentation-btn"
            onClick={onTogglePresentation}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            title="Quitter le mode présentation (P ou Échap)"
          >
            <EyeOff className="w-3.5 h-3.5" />
            <span>Quitter</span>
            <kbd className="hidden sm:inline px-1 py-0.2 rounded bg-indigo-800 text-[10px] font-mono ml-0.5">P</kbd>
          </button>
        </div>
      )}

      {/* Floating Toolbar */}
      {!isPresentationMode && (
        <CanvasToolbar
          tool={tool}
          setTool={setTool}
          onAddBlock={handleAddBlock}
          onOpenTemplates={() => {
            setIsTemplateModalOpen(true);
            setTemplateTargetNode(selectedNode);
          }}
          canUndo={undoStack.length > 0}
          canRedo={redoStack.length > 0}
          onUndo={handleUndo}
          onRedo={handleRedo}
          scale={transform.scale}
          onZoomIn={() => handleZoom(1.15)}
          onZoomOut={() => handleZoom(0.85)}
          onZoomReset={handleZoomReset}
          onFitCanvas={handleFitCanvas}
          onAutoLayout={handleAutoLayout}
          snapToGrid={snapToGrid}
          setSnapToGrid={setSnapToGrid}
          theme={theme}
          isPresentationMode={isPresentationMode}
          onTogglePresentation={onTogglePresentation}
        />
      )}

      {/* Selected Edge Quick Actions Bar */}
      {!isPresentationMode && selectedEdgeId && (
        <div
          className={`fixed bottom-24 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-2 rounded-xl border shadow-2xl z-30 ${themeConfig.panelBg} ${themeConfig.panelBorder} text-inherit`}
        >
          <span className="text-xs font-semibold text-slate-400">Lien sélectionné</span>
          <button
            onClick={() => {
              const edge = map.edges.find((e) => e.id === selectedEdgeId);
              if (edge) {
                const label = prompt('Modifier le libellé du lien :', edge.label || '');
                if (label !== null && label !== edge.label) {
                  pushUndoSnapshot('Renommer le lien');
                  onUpdateMap({
                    edges: map.edges.map((e) => (e.id === edge.id ? { ...e, label } : e))
                  });
                }
              }
            }}
            className="px-2 py-1 rounded bg-black/10 dark:bg-white/10 hover:bg-white/20 text-xs font-medium cursor-pointer"
          >
            Renommer
          </button>
          <button
            onClick={() => handleDeleteEdgeWithHistory(selectedEdgeId)}
            className="px-2 py-1 rounded bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-xs font-semibold flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Supprimer le lien</span>
          </button>
          <button
            onClick={() => setSelectedEdgeId(null)}
            className="p-1 text-slate-400 hover:text-inherit cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Floating Node Inspector Sidebar */}
      {!isPresentationMode && selectedNode && (
        <NodeInspector
          node={selectedNode}
          onClose={() => setSelectedNodeId(null)}
          onUpdate={handleUpdateNodeWithHistory}
          onDelete={handleDeleteNodeWithHistory}
          onDuplicate={handleDuplicateNode}
          onOpenAI={(n) => setAiModalNode(n)}
          onOpenTemplateForNode={(n) => {
            setTemplateTargetNode(n);
            setIsTemplateModalOpen(true);
          }}
          theme={theme}
        />
      )}

      {/* Undo/Redo Action Toast */}
      {toastMessage && (
        <div
          className={`fixed top-16 left-1/2 -translate-x-1/2 z-40 px-3.5 py-1.5 rounded-full border shadow-xl backdrop-blur-md text-xs font-semibold flex items-center gap-2 transition-all pointer-events-none ${themeConfig.panelBg} ${themeConfig.panelBorder} text-inherit`}
        >
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Strategic AI Assist Modal */}
      {!isPresentationMode && aiModalNode && (
        <AIAssistModal
          node={aiModalNode}
          onClose={() => setAiModalNode(null)}
          onApplyBranches={handleApplyAIBranches}
          theme={theme}
        />
      )}

      {/* Pre-defined Node Templates Modal */}
      {!isPresentationMode && (
        <NodeTemplateModal
          isOpen={isTemplateModalOpen}
          onClose={() => {
            setIsTemplateModalOpen(false);
            setTemplateTargetNode(null);
          }}
          onApplyTemplate={handleApplyTemplate}
          selectedNode={templateTargetNode || selectedNode}
          theme={theme}
        />
      )}

      {/* Minimap Viewport Overlay */}
      {!isPresentationMode && (
        <CanvasMinimap
          nodes={map.nodes}
          edges={map.edges}
          transform={transform}
          containerWidth={containerDimensions.width}
          containerHeight={containerDimensions.height}
          onNavigateTo={handleNavigateTo}
          onFitCanvas={handleFitCanvas}
          theme={theme}
          searchQuery={searchQuery}
        />
      )}
    </div>
  );
};
