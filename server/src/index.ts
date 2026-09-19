import cors from 'cors';
import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import type { ActionResult, ArtifactAvailability, ArtifactSelection, ClientType, ModeUpdate, RotationUpdate } from 'museum-shared-types';
import { exhibitState, touchState } from './state.js';

const app = express();
app.use(cors());
app.get('/health', (_request, response) => response.json({ status: 'ok', updatedAt: exhibitState.updatedAt }));

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*', methods: ['GET', 'POST'] } });
const clientBySocket = new Map<string, ClientType>();
const validClientTypes: ClientType[] = ['mobile', 'tablet', 'web'];

function broadcastState(): void { io.emit('state:updated', exhibitState); }
function acknowledge(callback: ((result: ActionResult) => void) | undefined, result: ActionResult): void { callback?.(result); }

io.on('connection', socket => {
  socket.emit('state:sync', exhibitState);

  socket.on('client:register', (clientType: ClientType, callback?: (result: ActionResult) => void) => {
    if (!validClientTypes.includes(clientType) || clientBySocket.has(socket.id)) {
      acknowledge(callback, { ok: false, message: 'Invalid or duplicate client registration.' });
      return;
    }
    clientBySocket.set(socket.id, clientType);
    exhibitState.connectedClients[clientType] += 1;
    exhibitState.updatedAt = Date.now();
    broadcastState();
    acknowledge(callback, { ok: true });
  });

  socket.on('artifact:selected', ({ artifactId }: ArtifactSelection, callback?: (result: ActionResult) => void) => {
    const artifact = exhibitState.artifacts.find(item => item.id === artifactId);
    if (!artifact?.enabled || exhibitState.exhibitMode === 'maintenance') {
      acknowledge(callback, { ok: false, message: 'That artifact is not available.' });
      return;
    }
    exhibitState.activeArtifactId = artifactId;
    exhibitState.rotation = 0;
    touchState(`Selected ${artifact.title}`);
    broadcastState();
    acknowledge(callback, { ok: true });
  });

  socket.on('artifact:rotate', ({ rotation }: RotationUpdate, callback?: (result: ActionResult) => void) => {
    if (!Number.isFinite(rotation) || exhibitState.exhibitMode !== 'interactive') {
      acknowledge(callback, { ok: false, message: 'Rotation is unavailable in the current mode.' });
      return;
    }
    exhibitState.rotation = ((rotation % 360) + 360) % 360;
    touchState('Visitor rotated the active artifact');
    broadcastState();
    acknowledge(callback, { ok: true });
  });

  socket.on('visitor:entered', (callback?: (result: ActionResult) => void) => {
    exhibitState.visitorCount += 1;
    touchState('A visitor began an exhibit session');
    broadcastState();
    acknowledge(callback, { ok: true });
  });

  socket.on('artifact:enabled', ({ artifactId, enabled }: ArtifactAvailability, callback?: (result: ActionResult) => void) => {
    const artifact = exhibitState.artifacts.find(item => item.id === artifactId);
    if (!artifact || typeof enabled !== 'boolean') {
      acknowledge(callback, { ok: false, message: 'Invalid artifact availability update.' });
      return;
    }
    artifact.enabled = enabled;
    if (!exhibitState.artifacts.find(item => item.id === exhibitState.activeArtifactId)?.enabled) {
      exhibitState.activeArtifactId = exhibitState.artifacts.find(item => item.enabled)?.id ?? '';
    }
    touchState(`${artifact.title} ${enabled ? 'enabled' : 'disabled'}`);
    broadcastState();
    acknowledge(callback, { ok: true });
  });

  socket.on('exhibit:mode', ({ mode }: ModeUpdate, callback?: (result: ActionResult) => void) => {
    if (!['normal', 'interactive', 'maintenance'].includes(mode)) {
      acknowledge(callback, { ok: false, message: 'Invalid exhibit mode.' });
      return;
    }
    exhibitState.exhibitMode = mode;
    exhibitState.systemStatus = mode === 'maintenance' ? 'maintenance' : 'online';
    touchState(`Exhibit mode changed to ${mode}`);
    broadcastState();
    acknowledge(callback, { ok: true });
  });

  socket.on('exhibit:reset', (callback?: (result: ActionResult) => void) => {
    exhibitState.activeArtifactId = exhibitState.artifacts.find(item => item.enabled)?.id ?? '';
    exhibitState.rotation = 0;
    exhibitState.visitorCount = 0;
    exhibitState.interactionCount = 0;
    exhibitState.lastAction = 'Exhibit reset by administrator';
    exhibitState.updatedAt = Date.now();
    broadcastState();
    acknowledge(callback, { ok: true });
  });

  socket.on('disconnect', () => {
    const clientType = clientBySocket.get(socket.id);
    if (!clientType) return;
    exhibitState.connectedClients[clientType] = Math.max(0, exhibitState.connectedClients[clientType] - 1);
    clientBySocket.delete(socket.id);
    exhibitState.updatedAt = Date.now();
    broadcastState();
  });
});

const port = Number(process.env.PORT) || 4000;
httpServer.listen(port);
