import { useRef } from 'react';
import { PanResponder, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { useExhibitConnection } from './src/hooks/useExhibitConnection';

export default function App() {
  const { state, connected, error, emit } = useExhibitConnection();
  const rotationStart = useRef(0);
  const stateRef = useRef(state);
  const emitRef = useRef(emit);
  stateRef.current = state;
  emitRef.current = emit;
  const activeArtifact = state.artifacts.find(item => item.id === state.activeArtifactId);
  const gesture = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => { rotationStart.current = stateRef.current.rotation; },
    onPanResponderMove: (_event, movement) => {
      void emitRef.current('artifact:rotate', { rotation: rotationStart.current + movement.dx });
    },
    onPanResponderRelease: () => { void Haptics.selectionAsync(); },
  })).current;
  const selectArtifact = async (artifactId: string) => {
    const result = await emit('artifact:selected', { artifactId });
    if (result.ok) await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };
  const startVisit = async () => {
    const result = await emit('visitor:entered');
    if (result.ok) await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return <SafeAreaProvider><SafeAreaView style={styles.safe}>
    <StatusBar style="light" />
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.header}>
        <View><Text style={styles.eyebrow}>NEXUS MUSEUM</Text><Text style={styles.title}>Exhibit Controller</Text></View>
        <View style={styles.connection}><View style={[styles.dot, connected && styles.dotOnline]} /><Text style={styles.connectionText}>{connected ? 'Connected' : 'Offline'}</Text></View>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={styles.session}>
        <View><Text style={styles.sectionLabel}>VISITOR SESSION</Text><Text style={styles.sessionText}>{state.visitorCount} visitors recorded today</Text></View>
        <Pressable style={styles.sessionButton} onPress={startVisit}><Text style={styles.sessionButtonText}>Start visit</Text></Pressable>
      </View>
      <Text style={styles.sectionLabel}>SELECT AN ARTIFACT</Text>
      <View style={styles.artifactList}>{state.artifacts.map(artifact => {
        const selected = artifact.id === state.activeArtifactId;
        return <Pressable disabled={!artifact.enabled} onPress={() => selectArtifact(artifact.id)} key={artifact.id} style={[styles.artifactCard, selected && { borderColor: artifact.accentColor }, !artifact.enabled && styles.disabled]}>
          <View style={[styles.artifactSwatch, { backgroundColor: artifact.accentColor }]} />
          <View style={styles.artifactCopy}><Text style={styles.artifactTitle}>{artifact.title}</Text><Text style={styles.artifactMeta}>{artifact.era} · {artifact.category}</Text></View>
          <Text style={[styles.selection, selected && { color: artifact.accentColor }]}>{selected ? 'ACTIVE' : artifact.enabled ? 'VIEW' : 'CLOSED'}</Text>
        </Pressable>;
      })}</View>
      <View style={styles.interactionCard}>
        <Text style={styles.sectionLabel}>TOUCH INTERACTION</Text><Text style={styles.interactionTitle}>{activeArtifact?.title ?? 'No artifact available'}</Text><Text style={styles.summary}>{activeArtifact?.summary}</Text>
        <View style={styles.gestureArea} {...gesture.panHandlers}>
          <View style={[styles.object, { borderColor: activeArtifact?.accentColor ?? '#44d7b6', transform: [{ rotate: `${state.rotation}deg` }] }]}><View style={[styles.objectCore, { backgroundColor: activeArtifact?.accentColor ?? '#44d7b6' }]} /></View>
          <Text style={styles.gestureHint}>Drag left or right to rotate</Text><Text style={styles.rotation}>{Math.round(state.rotation)}°</Text>
        </View>
      </View>
      <View style={styles.footerRow}><Text style={styles.mode}>Mode: {state.exhibitMode}</Text><Text style={styles.lastAction}>{state.lastAction}</Text></View>
    </ScrollView>
  </SafeAreaView></SafeAreaProvider>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#09111a' },
  screen: { padding: 20, paddingBottom: 40, gap: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  eyebrow: { color: '#44d7b6', fontSize: 11, fontWeight: '800', letterSpacing: 2 },
  title: { color: '#f4f7fb', fontSize: 28, fontWeight: '700' },
  connection: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#121e29', paddingHorizontal: 10, paddingVertical: 7, borderRadius: 20 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ef6574' },
  dotOnline: { backgroundColor: '#44d7b6' },
  connectionText: { color: '#b8c5d1', fontSize: 11 },
  error: { color: '#ffd0d4', backgroundColor: '#4d2027', padding: 10, borderRadius: 8 },
  session: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#121e29', borderRadius: 14, padding: 14 },
  sectionLabel: { color: '#7f93a5', fontSize: 10, fontWeight: '800', letterSpacing: 1.4 },
  sessionText: { color: '#e7edf3', marginTop: 5 },
  sessionButton: { backgroundColor: '#44d7b6', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  sessionButtonText: { color: '#07120f', fontWeight: '800' },
  artifactList: { gap: 8 },
  artifactCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#111c26', borderWidth: 1, borderColor: '#223241', padding: 12, borderRadius: 12 },
  disabled: { opacity: 0.4 }, artifactSwatch: { width: 10, height: 42, borderRadius: 5 }, artifactCopy: { flex: 1 },
  artifactTitle: { color: '#f1f5f8', fontWeight: '700', fontSize: 15 }, artifactMeta: { color: '#8092a1', fontSize: 11, marginTop: 3 },
  selection: { color: '#647685', fontSize: 10, fontWeight: '800' },
  interactionCard: { backgroundColor: '#111c26', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#223241' },
  interactionTitle: { color: '#fff', fontSize: 22, fontWeight: '700', marginTop: 7 }, summary: { color: '#9fb0be', lineHeight: 19, marginTop: 7 },
  gestureArea: { height: 230, marginTop: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: '#09131c', borderRadius: 14 },
  object: { width: 110, height: 110, borderRadius: 55, borderWidth: 3, alignItems: 'center', justifyContent: 'center' }, objectCore: { width: 34, height: 70, borderRadius: 8 },
  gestureHint: { color: '#8294a3', fontSize: 12, marginTop: 18 }, rotation: { position: 'absolute', right: 14, top: 14, color: '#d8e1e8', fontWeight: '700' },
  footerRow: { gap: 5 }, mode: { color: '#44d7b6', fontWeight: '700', textTransform: 'capitalize' }, lastAction: { color: '#7f93a5', fontSize: 11 },
});
