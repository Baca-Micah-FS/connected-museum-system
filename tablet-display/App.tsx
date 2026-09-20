import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useExhibitMonitor } from './src/hooks/useExhibitMonitor';

export default function App() {
  const { width } = useWindowDimensions();
  const { state, connected } = useExhibitMonitor();
  const artifact = state.artifacts.find(item => item.id === state.activeArtifactId);
  const totalClients = Object.values(state.connectedClients).reduce((sum, value) => sum + value, 0);
  return <SafeAreaProvider><SafeAreaView style={styles.safe}><StatusBar style="light" /><ScrollView contentContainerStyle={styles.screen}>
    <View style={styles.header}><View><Text style={styles.eyebrow}>NEXUS MUSEUM</Text><Text style={styles.title}>Live Exhibit Monitor</Text></View><View style={styles.headerStatus}><View style={[styles.statusDot, connected && styles.online]} /><Text style={styles.statusText}>{connected ? 'SYSTEM ONLINE' : 'RECONNECTING'}</Text><Text style={styles.mode}>{state.exhibitMode.toUpperCase()}</Text></View></View>
    <View style={[styles.mainGrid, width < 760 && styles.mainGridNarrow]}>
      <View style={styles.feature}>
        <View style={styles.featureTop}><View><Text style={styles.label}>NOW VIEWING</Text><Text style={styles.artifactTitle}>{artifact?.title ?? 'No active artifact'}</Text><Text style={styles.artifactMeta}>{artifact?.era} · {artifact?.category}</Text></View><Text style={[styles.angle, { color: artifact?.accentColor ?? '#44d7b6' }]}>{Math.round(state.rotation)}°</Text></View>
        <View style={styles.stage}><View style={styles.orbit}><View style={[styles.artifactVisual, { borderColor: artifact?.accentColor ?? '#44d7b6', transform: [{ rotate: `${state.rotation}deg` }] }]}><View style={[styles.visualCore, { backgroundColor: artifact?.accentColor ?? '#44d7b6' }]} /></View></View><View style={styles.stageLine} /></View>
        <Text style={styles.summary}>{artifact?.summary}</Text>
      </View>
      <View style={styles.sideColumn}>
        <View style={styles.card}><Text style={styles.label}>LIVE ACTIVITY</Text><Metric label="Visitors" value={state.visitorCount} color="#44d7b6" /><Metric label="Interactions" value={state.interactionCount} color="#8da2ff" /><Metric label="Connected devices" value={totalClients} color="#ffb45b" /></View>
        <View style={styles.card}><Text style={styles.label}>CLIENT STATUS</Text>{Object.entries(state.connectedClients).map(([name, count]) => <View key={name} style={styles.clientRow}><Text style={styles.clientName}>{name}</Text><View style={styles.clientTrack}><View style={[styles.clientFill, { width: `${Math.min(100, count * 35)}%` }]} /></View><Text style={styles.clientCount}>{count}</Text></View>)}</View>
      </View>
    </View>
    <View style={styles.timeline}><View style={[styles.timelineMarker, { backgroundColor: artifact?.accentColor ?? '#44d7b6' }]} /><View><Text style={styles.label}>LATEST SYSTEM ACTIVITY</Text><Text style={styles.action}>{state.lastAction}</Text></View><Text style={styles.timestamp}>{new Date(state.updatedAt).toLocaleTimeString()}</Text></View>
  </ScrollView></SafeAreaView></SafeAreaProvider>;
}

function Metric({ label, value, color }: { label: string; value: number; color: string }) {
  return <View style={styles.metric}><View><Text style={styles.metricLabel}>{label}</Text><Text style={[styles.metricValue, { color }]}>{value}</Text></View><View style={styles.metricChart}>{[0.35, 0.6, 0.45, 0.8, 1].map((height, index) => <View key={index} style={[styles.bar, { height: `${Math.max(15, height * 100)}%`, backgroundColor: color, opacity: 0.35 + index * 0.12 }]} />)}</View></View>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#070d13' }, screen: { padding: 24, gap: 18, minHeight: '100%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, eyebrow: { color: '#44d7b6', letterSpacing: 2, fontSize: 11, fontWeight: '800' }, title: { color: '#f1f5f8', fontSize: 30, fontWeight: '700' },
  headerStatus: { flexDirection: 'row', alignItems: 'center', gap: 8 }, statusDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: '#ef6574' }, online: { backgroundColor: '#44d7b6' }, statusText: { color: '#a9b7c3', fontSize: 11, fontWeight: '700' }, mode: { color: '#07110f', backgroundColor: '#44d7b6', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, fontSize: 10, fontWeight: '800' },
  mainGrid: { flexDirection: 'row', gap: 18, flex: 1 }, mainGridNarrow: { flexDirection: 'column' }, feature: { flex: 2, backgroundColor: '#101923', borderRadius: 18, padding: 20, borderWidth: 1, borderColor: '#21303d' }, featureTop: { flexDirection: 'row', justifyContent: 'space-between' }, label: { color: '#728696', fontSize: 10, fontWeight: '800', letterSpacing: 1.4 },
  artifactTitle: { color: '#f5f7fa', fontSize: 27, fontWeight: '700', marginTop: 7 }, artifactMeta: { color: '#8799a8', marginTop: 4 }, angle: { fontSize: 32, fontWeight: '300' },
  stage: { flex: 1, minHeight: 260, justifyContent: 'center', alignItems: 'center' }, orbit: { width: 230, height: 230, borderRadius: 115, borderWidth: 1, borderColor: '#263746', alignItems: 'center', justifyContent: 'center' }, artifactVisual: { width: 135, height: 135, borderRadius: 68, borderWidth: 4, alignItems: 'center', justifyContent: 'center' }, visualCore: { width: 42, height: 88, borderRadius: 10 }, stageLine: { position: 'absolute', width: '80%', height: 1, backgroundColor: '#263746' }, summary: { color: '#a5b4c0', lineHeight: 20 },
  sideColumn: { flex: 1, gap: 18 }, card: { flex: 1, backgroundColor: '#101923', borderRadius: 18, padding: 18, borderWidth: 1, borderColor: '#21303d', gap: 12 }, metric: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#1d2a35' }, metricLabel: { color: '#8b9ba8', fontSize: 12 }, metricValue: { fontSize: 27, fontWeight: '700' }, metricChart: { height: 34, width: 72, flexDirection: 'row', alignItems: 'flex-end', gap: 4 }, bar: { flex: 1, borderRadius: 2 },
  clientRow: { flexDirection: 'row', alignItems: 'center', gap: 9 }, clientName: { color: '#a6b4bf', width: 55, textTransform: 'capitalize' }, clientTrack: { flex: 1, height: 6, backgroundColor: '#22313d', borderRadius: 4, overflow: 'hidden' }, clientFill: { height: '100%', backgroundColor: '#44d7b6' }, clientCount: { color: '#fff', width: 15, textAlign: 'right' },
  timeline: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#101923', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#21303d' }, timelineMarker: { width: 10, height: 10, borderRadius: 5 }, action: { color: '#dfe6eb', marginTop: 4 }, timestamp: { marginLeft: 'auto', color: '#778a99', fontSize: 11 },
});
