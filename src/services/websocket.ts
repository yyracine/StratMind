import { ActiveUser, CollaboratorCursor, MapEdge, MapNode, MindMap } from '../types';

type MessageHandler = (data: any) => void;

class RealtimeSyncService {
  private ws: WebSocket | null = null;
  private mapId: string = '';
  private userName: string = '';
  private userColor: string = '';
  private handlers: Map<string, Set<MessageHandler>> = new Map();
  private pingInterval: any = null;
  private reconnectTimeout: any = null;
  public latency: number = 0;
  public isConnected: boolean = false;
  public currentUserId: string = '';

  constructor() {
    const savedName = localStorage.getItem('stratmind_username');
    this.userName = savedName || 'Stratège ' + Math.floor(Math.random() * 900 + 100);
    const colors = ['#f43f5e', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#3b82f6'];
    this.userColor = colors[Math.floor(Math.random() * colors.length)];
  }

  public connect(mapId: string) {
    this.mapId = mapId;
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.send({ type: 'join', mapId, userName: this.userName, userColor: this.userColor });
      return;
    }

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const url = `${protocol}//${window.location.host}`;
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        this.isConnected = true;
        this.trigger('connection:change', true);
        this.send({ type: 'join', mapId: this.mapId, userName: this.userName, userColor: this.userColor });
        this.startPing();
      };

      this.ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'init') {
            this.currentUserId = msg.userId;
            if (msg.userName) this.userName = msg.userName;
            if (msg.userColor) this.userColor = msg.userColor;
          } else if (msg.type === 'pong') {
            this.latency = Math.max(1, Date.now() - msg.time);
            this.trigger('latency:update', this.latency);
          }
          this.trigger(msg.type, msg);
        } catch (e) {
          console.error('Error handling WS message', e);
        }
      };

      this.ws.onclose = () => {
        this.isConnected = false;
        this.trigger('connection:change', false);
        this.stopPing();
        // Auto-reconnect after 2.5s
        if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = setTimeout(() => {
          if (!this.isConnected) {
            this.connect(this.mapId);
          }
        }, 2500);
      };

      this.ws.onerror = (err) => {
        console.warn('WebSocket connection error:', err);
      };
    } catch (err) {
      console.warn('WS Init failed:', err);
    }
  }

  public disconnect() {
    this.stopPing();
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
  }

  public setIdentity(name: string, color: string) {
    this.userName = name;
    this.userColor = color;
    localStorage.setItem('stratmind_username', name);
    this.send({ type: 'join', mapId: this.mapId, userName: name, userColor: color });
  }

  public getIdentity() {
    return { userName: this.userName, userColor: this.userColor, userId: this.currentUserId };
  }

  private startPing() {
    this.stopPing();
    this.pingInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.send({ type: 'ping', time: Date.now() });
      }
    }, 4000);
  }

  private stopPing() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  public send(data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  public sendCursor(x: number, y: number) {
    this.send({ type: 'cursor', x, y });
  }

  public sendNodeCreate(node: MapNode) {
    this.send({ type: 'node:create', node });
  }

  public sendNodeUpdate(node: Partial<MapNode> & { id: string }) {
    this.send({ type: 'node:update', node });
  }

  public sendNodeDelete(nodeId: string) {
    this.send({ type: 'node:delete', nodeId });
  }

  public sendEdgeCreate(edge: MapEdge) {
    this.send({ type: 'edge:create', edge });
  }

  public sendEdgeDelete(edgeId: string) {
    this.send({ type: 'edge:delete', edgeId });
  }

  public sendMapSync(nodes: MapNode[], edges: MapEdge[]) {
    this.send({ type: 'map:sync', nodes, edges });
  }

  public on(event: string, handler: MessageHandler) {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);
    return () => this.off(event, handler);
  }

  public off(event: string, handler: MessageHandler) {
    const set = this.handlers.get(event);
    if (set) {
      set.delete(handler);
    }
  }

  private trigger(event: string, data: any) {
    const set = this.handlers.get(event);
    if (set) {
      set.forEach(cb => cb(data));
    }
  }
}

export const realtimeSync = new RealtimeSyncService();
