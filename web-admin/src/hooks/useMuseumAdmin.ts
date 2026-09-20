import { useCallback, useEffect, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import type { ActionResult, ExhibitState } from 'museum-shared-types';

const SERVER_URL = import.meta.env.VITE_SERVER_URL ?? 'http://localhost:4000';
const initialState: ExhibitState = { artifacts: [], activeArtifactId: '', rotation: 0, exhibitMode: 'normal', systemStatus: 'online', visitorCount: 0, interactionCount: 0, lastAction: 'Connecting', connectedClients: { mobile: 0, tablet: 0, web: 0 }, updatedAt: Date.now() };

export function useMuseumAdmin() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [state, setState] = useState(initialState);
  const [connected, setConnected] = useState(false);
  const [message, setMessage] = useState('');
  useEffect(() => {
    const connection = io(SERVER_URL, { reconnection: true, reconnectionAttempts: Infinity });
    connection.on('connect', () => { setConnected(true); setMessage(''); connection.emit('client:register', 'web'); });
    connection.on('disconnect', () => setConnected(false));
    connection.on('connect_error', () => setMessage('Unable to reach the exhibit server.'));
    connection.on('state:sync', setState);
    connection.on('state:updated', setState);
    setSocket(connection);
    return () => { connection.close(); };
  }, []);
  const command = useCallback((event: string, payload?: unknown) => new Promise<ActionResult>(resolve => {
    if (!socket?.connected) { const result = { ok: false, message: 'Server is disconnected.' }; setMessage(result.message); resolve(result); return; }
    const acknowledgement = (result: ActionResult) => { setMessage(result.ok ? 'Change applied successfully.' : result.message ?? 'Change failed.'); resolve(result); };
    payload === undefined ? socket.emit(event, acknowledgement) : socket.emit(event, payload, acknowledgement);
  }), [socket]);
  return { state, connected, message, command };
}
