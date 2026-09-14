import React, { useState, useRef, useCallback } from 'react';
import { MapNode, MapEdge, CanvasTransform, ThemeMode } from '../types';
import { THEME_CONFIGS } from '../constants';
import { Map as MapIcon, ChevronDown, ChevronUp, Maximize2, Compass } from 'lucide-react';

interface CanvasMinimapProps {
  nodes: MapNode[];
  edges: MapEdge[];
  transform: CanvasTransform;
  containerWidth: number;
  containerHeight: number;
  onNavigateTo: (worldX: number, worldY: number) => void;
  onFitCanvas: () => void;
  theme: ThemeMode;
  searchQuery?: string;
}

export const CanvasMinimap: React.FC<CanvasMinimapProps> = ({
  nodes,
  edges,
  transform,
  containerWidth,
  containerHeight,
  onNavigateTo,
  onFitCanvas,
  theme,
  searchQuery
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const themeConfig = THEME_CONFIGS[theme];

  // Minimap dimensions in UI pixels
  const minimapWidth = 220;
  const minimapHeight = 140;

  // Viewport bounds in world space
  const safeW = containerWidth > 0 ? containerWidth : 1200;
  const safeH = containerHeight > 0 ? containerHeight : 800;

  const vpWorldX = -transform.x / transform.scale;
  const vpWorldY = -transform.y / transform.scale;
  const vpWorldW = safeW / transform.scale;
  const vpWorldH = safeH / transform.scale;

  // Compute world bounding box enclosing all nodes and current viewport
  let minX = vpWorldX;
  let minY = vpWorldY;
  let maxX = vpWorldX + vpWorldW;
  let maxY = vpWorldY + vpWorldH;

  if (nodes.length > 0) {
    nodes.forEach((n) => {
      const s = n.shape || 'rectangle';
      const w = s === 'circle' ? 240 : s === 'diamond' ? 260 : (n.type === 'note' ? 220 : 260);
      const h = s === 'circle' ? 240 : s === 'diamond' ? 220 : 120;
      minX = Math.min(minX, n.x);
      minY = Math.min(minY, n.y);
      maxX = Math.max(maxX, n.x + w);
      maxY = Math.max(maxY, n.y + h);
    });
  }

  // Add margin around content in world space
  const margin = 350;
  minX -= margin;
  minY -= margin;
  maxX += margin;
  maxY += margin;

  const worldWidth = Math.max(100, maxX - minX);
  const worldHeight = Math.max(100, maxY - minY);

  // Compute uniform scale factor to fit world bounding box into minimap
  const scaleX = minimapWidth / worldWidth;
  const scaleY = minimapHeight / worldHeight;
  const mapScale = Math.min(scaleX, scaleY);

  // Center the scaled content inside the minimap
  const offsetX = (minimapWidth - worldWidth * mapScale) / 2;
  const offsetY = (minimapHeight - worldHeight * mapScale) / 2;

  // World to minimap screen coordinate mapping
  const toMinimapX = (wx: number) => offsetX + (wx - minX) * mapScale;
  const toMinimapY = (wy: number) => offsetY + (wy - minY) * mapScale;

  // Minimap screen coordinate to world coordinate mapping
  const toWorldX = (mx: number) => minX + (mx - offsetX) / mapScale;
  const toWorldY = (my: number) => minY + (my - offsetY) / mapScale;

  // Viewport indicator coordinates
  const vpMinimapX = toMinimapX(vpWorldX);
  const vpMinimapY = toMinimapY(vpWorldY);
  const vpMinimapW = Math.max(10, vpWorldW * mapScale);
  const vpMinimapH = Math.max(8, vpWorldH * mapScale);

  // Handle pointer navigation
  const handlePointerAction = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (!svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const localX = Math.max(0, Math.min(minimapWidth, e.clientX - rect.left));
      const localY = Math.max(0, Math.min(minimapHeight, e.clientY - rect.top));

      const targetWorldX = toWorldX(localX);
      const targetWorldY = toWorldY(localY);

      onNavigateTo(targetWorldX, targetWorldY);
    },
    [minX, minY, offsetX, offsetY, mapScale, minimapWidth, minimapHeight, onNavigateTo]
  );

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    e.stopPropagation();
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    handlePointerAction(e);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isDragging) return;
    e.stopPropagation();
    handlePointerAction(e);
  };

  const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    if (isDragging) {
      e.stopPropagation();
      setIsDragging(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Ignore if pointer capture already released
      }
    }
  };

  return (
    <div
      id="canvas-minimap-overlay"
      className={`fixed bottom-6 right-6 z-20 flex flex-col items-end select-none transition-all duration-200 ${
        isCollapsed ? 'opacity-90 hover:opacity-100' : ''
      }`}
    >
      {isCollapsed ? (
        /* Collapsed Minimap Pill */
        <button
          onClick={() => setIsCollapsed(false)}
          className={`flex items-center gap-2 px-3 py-2 rounded-2xl border shadow-xl backdrop-blur-xl transition-all hover:scale-105 cursor-pointer ${themeConfig.panelBg} ${themeConfig.panelBorder} text-inherit group`}
          title="Afficher la minimap / vue d'ensemble"
        >
          <div className="w-6 h-6 rounded-lg bg-indigo-500/15 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
            <Compass className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-semibold text-slate-300">Minimap</span>
          <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
        </button>
      ) : (
        /* Expanded Minimap Panel */
        <div
          className={`rounded-2xl border shadow-2xl backdrop-blur-xl overflow-hidden ${themeConfig.panelBg} ${themeConfig.panelBorder} text-inherit w-[236px]`}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-black/5 dark:border-white/10 bg-black/5 dark:bg-black/20">
            <div className="flex items-center gap-1.5">
              <MapIcon className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-xs font-bold tracking-tight text-slate-300">Vue d'ensemble</span>
              <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {nodes.length}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={onFitCanvas}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Recentrer sur tout le contenu (F)"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsCollapsed(true)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Masquer la minimap"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Minimap SVG Render Canvas */}
          <div className="p-2 flex justify-center bg-black/10 dark:bg-black/40">
            <svg
              ref={svgRef}
              width={minimapWidth}
              height={minimapHeight}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className="rounded-xl border border-black/10 dark:border-white/10 bg-black/20 dark:bg-black/60 cursor-crosshair overflow-hidden touch-none"
              style={{
                backgroundImage:
                  theme === 'light' || theme === 'sepia'
                    ? 'radial-gradient(#94a3b8 0.75px, transparent 0.75px)'
                    : 'radial-gradient(#334155 0.75px, transparent 0.75px)',
                backgroundSize: '12px 12px'
              }}
            >
              {/* Render edges in minimap */}
              {edges.map((edge) => {
                const sNode = nodes.find((n) => n.id === edge.source);
                const tNode = nodes.find((n) => n.id === edge.target);
                if (!sNode || !tNode) return null;

                const sx = toMinimapX(sNode.x + 130);
                const sy = toMinimapY(sNode.y + 60);
                const tx = toMinimapX(tNode.x + 130);
                const ty = toMinimapY(tNode.y + 60);

                return (
                  <line
                    key={edge.id}
                    x1={sx}
                    y1={sy}
                    x2={tx}
                    y2={ty}
                    stroke={edge.color || '#6366f1'}
                    strokeWidth="1"
                    strokeOpacity="0.45"
                  />
                );
              })}

              {/* Render miniature nodes */}
              {nodes.map((node) => {
                const shape = node.shape || 'rectangle';
                const baseW = shape === 'circle' ? 240 : shape === 'diamond' ? 260 : (node.type === 'note' ? 220 : 260);
                const baseH = shape === 'circle' ? 240 : shape === 'diamond' ? 220 : 120;
                const w = baseW * mapScale;
                const h = baseH * mapScale;
                const nx = toMinimapX(node.x);
                const ny = toMinimapY(node.y);

                const query = searchQuery ? searchQuery.trim().toLowerCase() : '';
                const isMatched = Boolean(
                  query &&
                    (node.title.toLowerCase().includes(query) ||
                      node.description?.toLowerCase().includes(query) ||
                      node.tags?.some((t) => t.toLowerCase().includes(query)))
                );
                const isDimmed = Boolean(query && !isMatched);
                const fillColor = isMatched ? '#fbbf24' : node.color || '#6366f1';
                const strokeColor = isMatched ? '#f59e0b' : undefined;
                const opacityVal = isDimmed ? 0.25 : isMatched ? 1 : 0.85;

                if (shape === 'circle') {
                  const r = Math.max(isMatched ? 3 : 2, Math.min(w, h) / 2);
                  return (
                    <circle
                      key={node.id}
                      cx={nx + w / 2}
                      cy={ny + h / 2}
                      r={r}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={isMatched ? 1 : 0}
                      opacity={opacityVal}
                      className="transition-opacity hover:opacity-100"
                    />
                  );
                }

                if (shape === 'diamond') {
                  const points = `${nx + w / 2},${ny} ${nx + w},${ny + h / 2} ${nx + w / 2},${ny + h} ${nx},${ny + h / 2}`;
                  return (
                    <polygon
                      key={node.id}
                      points={points}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={isMatched ? 1 : 0}
                      opacity={opacityVal}
                      className="transition-opacity hover:opacity-100"
                    />
                  );
                }

                return (
                  <rect
                    key={node.id}
                    x={nx}
                    y={ny}
                    width={Math.max(isMatched ? 6 : 4, w)}
                    height={Math.max(isMatched ? 5 : 3, h)}
                    rx={Math.max(1, 2 * mapScale)}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={isMatched ? 1 : 0}
                    opacity={opacityVal}
                    className="transition-opacity hover:opacity-100"
                  />
                );
              })}

              {/* Viewport Box overlay */}
              <rect
                x={vpMinimapX}
                y={vpMinimapY}
                width={vpMinimapW}
                height={vpMinimapH}
                fill="#6366f1"
                fillOpacity="0.16"
                stroke="#818cf8"
                strokeWidth="1.5"
                rx="3"
                className="cursor-move pointer-events-none transition-[stroke] duration-150"
              />
            </svg>
          </div>

          {/* Quick status bar */}
          <div className="px-3 py-1.5 flex items-center justify-between text-[10px] text-slate-400 border-t border-black/5 dark:border-white/5 bg-black/5 dark:bg-black/10">
            <span className="truncate">Cliquez pour vous déplacer</span>
            <span className="font-mono">{Math.round(transform.scale * 100)}%</span>
          </div>
        </div>
      )}
    </div>
  );
};
