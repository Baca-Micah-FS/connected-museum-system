import type { ExhibitState } from 'museum-shared-types';

export const exhibitState: ExhibitState = {
  artifacts: [
    { id: 'astrolabe', title: 'Mariner Astrolabe', era: '1600s', category: 'Navigation', accentColor: '#44d7b6', enabled: true, summary: 'A precision instrument used by sailors to determine latitude from the position of the stars.' },
    { id: 'camera', title: 'Bellows Camera', era: '1890s', category: 'Photography', accentColor: '#ffb45b', enabled: true, summary: 'An early field camera that captured detailed images on fragile glass photographic plates.' },
    { id: 'radio', title: 'Cathedral Radio', era: '1930s', category: 'Communication', accentColor: '#8da2ff', enabled: true, summary: 'A household radio that brought news, music, and serialized entertainment into the home.' },
    { id: 'computer', title: 'Personal Computer', era: '1980s', category: 'Computing', accentColor: '#f47e9b', enabled: true, summary: 'An early personal computer that helped move digital tools from institutions into everyday life.' },
  ],
  activeArtifactId: 'astrolabe',
  rotation: 0,
  exhibitMode: 'interactive',
  systemStatus: 'online',
  visitorCount: 0,
  interactionCount: 0,
  lastAction: 'Exhibit initialized',
  connectedClients: { mobile: 0, tablet: 0, web: 0 },
  updatedAt: Date.now(),
};

export function touchState(action: string): void {
  exhibitState.lastAction = action;
  exhibitState.interactionCount += 1;
  exhibitState.updatedAt = Date.now();
}
