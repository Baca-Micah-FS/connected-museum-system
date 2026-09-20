import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import type { ExhibitState } from 'museum-shared-types';

const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL ?? 'http://localhost:4000';
const initialState: ExhibitState = { artifacts: [], activeArtifactId: '', rotation: 0, exhibitMode: 'normal', systemStatus: 'online', visitorCount: 0, interactionCount: 0, lastAction: 'Connecting', connectedClients: { mobile: 0, tablet: 0, web: 0 }, updatedAt: Date.now() };

export function useExhibitMonitor() {
  const [state, setState] = useState(initialState);
  const [connected, setConnected] = useState(false);
  useEffect(() => {
    const socket = io(SERVER_URL, { reconnection: true, reconnectionAttempts: Infinity });
    socket.on('connect', () => { setConnected(true); socket.emit('client:register', 'tablet'); });
    socket.on('disconnect', () => setConnected(false));
    socket.on('state:sync', setState);
    socket.on('state:updated', setState);
    return () => { socket.close(); };
  }, []);
  return { state, connected };
}
