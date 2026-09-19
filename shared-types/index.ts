export type ClientType = 'mobile' | 'tablet' | 'web';
export type ExhibitMode = 'normal' | 'interactive' | 'maintenance';

export interface Artifact {
  id: string;
  title: string;
  era: string;
  category: string;
  summary: string;
  accentColor: string;
  enabled: boolean;
}

export interface ClientCounts { mobile: number; tablet: number; web: number }

export interface ExhibitState {
  artifacts: Artifact[];
  activeArtifactId: string;
  rotation: number;
  exhibitMode: ExhibitMode;
  systemStatus: 'online' | 'maintenance';
  visitorCount: number;
  interactionCount: number;
  lastAction: string;
  connectedClients: ClientCounts;
  updatedAt: number;
}

export interface ArtifactSelection { artifactId: string }
export interface RotationUpdate { rotation: number }
export interface ArtifactAvailability { artifactId: string; enabled: boolean }
export interface ModeUpdate { mode: ExhibitMode }
export interface ActionResult { ok: boolean; message?: string }
