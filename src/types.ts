export type BlockType = 'concept' | 'decision' | 'action' | 'goal' | 'risk' | 'note';

export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus = 'backlog' | 'in_progress' | 'completed';

export type NodeShape = 'rectangle' | 'circle' | 'diamond';

export interface MapNode {
  id: string;
  type: BlockType;
  title: string;
  description?: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  color: string;
  shape?: NodeShape;
  priority?: PriorityLevel;
  tags: string[];
  status?: TaskStatus;
  dueDate?: string;
  assignee?: string;
  icon?: string;
}

export type EdgeLineType = 'curved' | 'straight' | 'step';
export type EdgeStrokeStyle = 'solid' | 'dashed';
export type EdgeDirection = 'forward' | 'both' | 'none';

export interface MapEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  style?: 'solid' | 'dashed' | 'curved'; // backwards compatibility
  lineType?: EdgeLineType; // 'curved' (courbe) | 'straight' (droite) | 'step' (angulaire / orthogonale)
  strokeStyle?: EdgeStrokeStyle; // 'solid' (pleine) | 'dashed' (pointillés)
  color?: string;
  direction?: EdgeDirection; // 'forward' | 'both' | 'none'
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

export interface MapSummary {
  id: string;
  title: string;
  description: string;
  category: 'strategy' | 'critical_thinking' | 'productivity' | 'brainstorm';
  theme: string;
  nodeCount: number;
  edgeCount: number;
  updatedAt: string;
  createdAt: string;
}

export interface CanvasTransform {
  x: number;
  y: number;
  scale: number;
}

export type ThemeMode = 'midnight' | 'dark' | 'light' | 'sepia';

export interface CollaboratorCursor {
  userId: string;
  userName: string;
  userColor: string;
  x: number;
  y: number;
}

export interface ActiveUser {
  userId: string;
  userName: string;
  userColor: string;
}

export type CanvasTool = 'select' | 'pan' | 'move_all' | 'connect' | 'add_concept' | 'add_goal' | 'add_action' | 'add_decision' | 'add_risk' | 'add_note';

export type ActiveAppView = 'landing' | 'canvas' | 'action_plan';

export interface NodeTemplateItem {
  relativeX: number;
  relativeY: number;
  type: BlockType;
  title: string;
  description?: string;
  color?: string;
  priority?: PriorityLevel;
  tags?: string[];
  status?: TaskStatus;
  dueDate?: string;
}

export interface NodeTemplateEdge {
  sourceIndex: number;
  targetIndex: number;
  label?: string;
  style?: 'solid' | 'dashed' | 'curved';
  color?: string;
  direction?: 'forward' | 'both' | 'none';
}

export interface PredefinedNodeTemplate {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  category: 'strategy' | 'brainstorm' | 'critical_thinking' | 'productivity';
  icon: string;
  accentColor: string;
  defaultCentralTitle: string;
  nodes: NodeTemplateItem[];
  edges: NodeTemplateEdge[];
}
