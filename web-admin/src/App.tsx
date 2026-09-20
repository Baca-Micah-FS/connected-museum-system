import './App.css';
import type { ExhibitMode } from 'museum-shared-types';
import { useMuseumAdmin } from './hooks/useMuseumAdmin';

const modes: ExhibitMode[] = ['normal', 'interactive', 'maintenance'];
export default function App() {
  const { state, connected, message, command } = useMuseumAdmin();
  const activeArtifact = state.artifacts.find(item => item.id === state.activeArtifactId);
  const totalClients = Object.values(state.connectedClients).reduce((sum, value) => sum + value, 0);
  const reset = () => { if (window.confirm('Reset visitor and interaction statistics?')) void command('exhibit:reset'); };
  return <div className="app-shell">
    <header><div><p className="eyebrow">NEXUS MUSEUM</p><h1>Curator Control Center</h1><p className="subtitle">Connected exhibit administration and monitoring</p></div><div className={`connection ${connected ? 'online' : ''}`}><span />{connected ? 'System online' : 'Reconnecting'}</div></header>
    {message && <div className="notice">{message}</div>}
    <main>
      <section className="overview-grid">
        <article className="hero-card"><div className="card-heading"><div><p className="label">LIVE EXHIBIT</p><h2>{activeArtifact?.title ?? 'No artifact active'}</h2><p>{activeArtifact?.era} · {activeArtifact?.category}</p></div><strong style={{ color: activeArtifact?.accentColor }}>{Math.round(state.rotation)}°</strong></div><div className="hero-stage"><div className="orbit"><div className="artifact" style={{ borderColor: activeArtifact?.accentColor, transform: `rotate(${state.rotation}deg)` }}><i style={{ background: activeArtifact?.accentColor }} /></div></div></div><p className="summary">{activeArtifact?.summary}</p></article>
        <div className="metric-column"><Metric title="Visitors" value={state.visitorCount} detail="Recorded sessions"/><Metric title="Interactions" value={state.interactionCount} detail="State-changing actions"/><Metric title="Clients" value={totalClients} detail="Currently connected"/><article className="activity-card"><p className="label">LATEST ACTIVITY</p><p>{state.lastAction}</p><small>{new Date(state.updatedAt).toLocaleTimeString()}</small></article></div>
      </section>
      <section className="admin-grid">
        <article className="panel"><div className="panel-title"><div><p className="label">EXHIBIT CONFIGURATION</p><h2>Operating mode</h2></div><span className={state.systemStatus}>{state.systemStatus}</span></div><div className="mode-grid">{modes.map(mode => <button key={mode} className={state.exhibitMode === mode ? 'selected' : ''} onClick={() => void command('exhibit:mode', { mode })}>{mode}<small>{mode === 'interactive' ? 'Gestures enabled' : mode === 'maintenance' ? 'Visitor controls locked' : 'Standard viewing'}</small></button>)}</div><button className="reset" onClick={reset}>Reset exhibit statistics</button></article>
        <article className="panel"><div className="panel-title"><div><p className="label">COLLECTION MANAGEMENT</p><h2>Artifact availability</h2></div><span>{state.artifacts.filter(item => item.enabled).length}/{state.artifacts.length} open</span></div><div className="artifact-admin-list">{state.artifacts.map(artifact => <div className="artifact-row" key={artifact.id}><i style={{ background: artifact.accentColor }}/><div><strong>{artifact.title}</strong><small>{artifact.era} · {artifact.category}</small></div><button className={artifact.enabled ? 'enabled' : ''} onClick={() => void command('artifact:enabled', { artifactId: artifact.id, enabled: !artifact.enabled })}>{artifact.enabled ? 'Enabled' : 'Disabled'}</button></div>)}</div></article>
      </section>
      <section className="clients"><div><p className="label">CONNECTED INTERFACES</p><h2>System network</h2></div>{Object.entries(state.connectedClients).map(([name,count])=><article key={name}><span className={count ? 'client-dot active' : 'client-dot'}/><div><strong>{name}</strong><small>{count ? 'Connected' : 'Waiting'}</small></div><b>{count}</b></article>)}</section>
    </main>
    <footer><span>Connected Museum Prototype</span><span>Socket.IO · TypeScript · React</span></footer>
  </div>;
}

function Metric({ title, value, detail }: { title: string; value: number; detail: string }) { return <article className="metric-card"><p className="label">{title}</p><strong>{value}</strong><small>{detail}</small><div className="spark">{[35,60,48,75,92,70].map((height,index)=><i key={index} style={{height:`${height}%`}}/>)}</div></article>; }
