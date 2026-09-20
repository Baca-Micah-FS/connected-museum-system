import { useCallback, useEffect, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import type { ActionResult, ExhibitState } from 'museum-shared-types';

const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL ?? 'http://localhost:4000';
const initialState: ExhibitState = { artifacts: [], activeArtifactId: '', rotation: 0, exhibitMode: 'normal', systemStatus: 'online', visitorCount: 0, interactionCount: 0, lastAction: 'Connecting', connectedClients: { mobile: 0, tablet: 0, web: 0 }, updatedAt: Date.now() };

export function useExhibitConnection() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [state, setState] = useState(initialState);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    const connection = io(SERVER_URL, { reconnection: true, reconnectionAttempts: Infinity });
    connection.on('connect', () => { setConnected(true); setError(''); connection.emit('client:register', 'mobile'); });
    connection.on('disconnect', () => setConnected(false));
    connection.on('connect_error', () => setError('Unable to reach the exhibit server.'));
    connection.on('state:sync', setState);
    connection.on('state:updated', setState);
    setSocket(connection);
    return () => { connection.close(); };
  }, []);
  const emit = useCallback((event: string, payload?: unknown) => new Promise<ActionResult>(resolve => {
    if (!socket?.connected) { resolve({ ok: false, message: 'The exhibit is disconnected.' }); return; }
    const acknowledgement = (result: ActionResult) => { if (!result.ok) setError(result.message ?? 'Action failed.'); else setError(''); resolve(result); };
    payload === undefined ? socket.emit(event, acknowledgement) : socket.emit(event, payload, acknowledgement);
  }), [socket]);
  return { state, connected, error, emit };
}
