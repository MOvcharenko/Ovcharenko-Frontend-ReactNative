import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import ProgressRing from '../components/ProgressRing';

interface StatsScreenProps {
  onNavigate: (screen: 'deck' | 'list' | 'stats') => void;
  activeTab: string;
}

interface StatCardData {
  label: string;
  value: string;
  color: string;
  emoji: string;
}

const SAMPLE_STATS: StatCardData[] = [
  { label: 'Cards Studied', value: '142', color: '#818cf8', emoji: '🃏' },
  { label: 'Correct', value: '98', color: '#4ade80', emoji: '✅' },
  { label: 'Skipped', value: '44', color: '#f87171', emoji: '⏭️' },
  { label: 'Streak', value: '7 days', color: '#facc15', emoji: '🔥' },
];

const CATEGORY_PROGRESS: { label: string; progress: number; color: string }[] = [
  { label: 'JavaScript', progress: 0.82, color: '#facc15' },
  { label: 'Algorithms', progress: 0.65, color: '#818cf8' },
  { label: 'React', progress: 0.9, color: '#4ade80' },
  { label: 'Systems', progress: 0.3, color: '#f87171' },
  { label: 'Design', progress: 0.55, color: '#fb923c' },
];

const StatsScreen: React.FC<StatsScreenProps> = ({ onNavigate, activeTab }) => {
  const cardAnims = useRef(SAMPLE_STATS.map(() => new Animated.Value(0))).current;
  const barAnims = useRef(CATEGORY_PROGRESS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    // Stagger card entrance
    Animated.stagger(
      100,
      cardAnims.map((anim) =>
        Animated.spring(anim, { toValue: 1, useNativeDriver: true, tension: 60, friction: 8 })
      )
    ).start();

    // Stagger bar animations
    Animated.stagger(
      80,
      barAnims.map((anim, i) =>
        Animated.spring(anim, {
          toValue: CATEGORY_PROGRESS[i].progress,
          useNativeDriver: false,
          tension: 50,
          friction: 7,
        })
      )
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Statistics</Text>
        <Text style={styles.subtitle}>Your learning journey</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {/* Overall Progress Ring */}
        <View style={styles.ringRow}>
          <View style={styles.ringItem}>
            <ProgressRing progress={0.69} size={100} strokeWidth={9} color="#818cf8" label="Overall" />
          </View>
          <View style={styles.ringItem}>
            <ProgressRing progress={0.82} size={100} strokeWidth={9} color="#4ade80" label="Today" />
          </View>
          <View style={styles.ringItem}>
            <ProgressRing progress={0.45} size={100} strokeWidth={9} color="#facc15" label="Week" />
          </View>
        </View>

        {/* Stat Cards - Staggered entry */}
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.statGrid}>
          {SAMPLE_STATS.map((stat, i) => (
            <Animated.View
              key={stat.label}
              style={[
                styles.statCard,
                {
                  opacity: cardAnims[i],
                  transform: [
                    {
                      translateY: cardAnims[i].interpolate({
                        inputRange: [0, 1],
                        outputRange: [30, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Text style={styles.statEmoji}>{stat.emoji}</Text>
              <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </Animated.View>
          ))}
        </View>

        {/* Category progress bars */}
        <Text style={styles.sectionTitle}>By Category</Text>
        {CATEGORY_PROGRESS.map((cat, i) => (
          <View key={cat.label} style={styles.catRow}>
            <Text style={styles.catLabel}>{cat.label}</Text>
            <View style={styles.catTrack}>
              <Animated.View
                style={[
                  styles.catBar,
                  {
                    backgroundColor: cat.color,
                    width: barAnims[i].interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
            </View>
            <Text style={[styles.catPercent, { color: cat.color }]}>
              {Math.round(cat.progress * 100)}%
            </Text>
          </View>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Tabs */}
      <View style={styles.tabBar}>
        {(['deck', 'list', 'stats'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => onNavigate(tab)}
          >
            <Text style={styles.tabIcon}>
              {tab === 'deck' ? '🃏' : tab === 'list' ? '📋' : '📊'}
            </Text>
            <Text style={[styles.tabLabel, activeTab === tab && styles.tabLabelActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0d2e' },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 8,
  },
  title: { color: '#fff', fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 4 },
  scroll: { flex: 1, paddingHorizontal: 20 },
  ringRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginBottom: 8,
  },
  ringItem: { alignItems: 'center' },
  sectionTitle: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: 24,
    marginBottom: 12,
  },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '47%',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  statEmoji: { fontSize: 22 },
  statValue: { fontSize: 26, fontWeight: '800' },
  statLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 12 },
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 10,
  },
  catLabel: { color: '#fff', fontSize: 13, width: 90 },
  catTrack: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  catBar: { height: '100%', borderRadius: 3 },
  catPercent: { fontSize: 12, fontWeight: '700', width: 36, textAlign: 'right' },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    backgroundColor: '#0f0d2e',
    paddingBottom: 28,
    paddingTop: 10,
  },
  tab: { flex: 1, alignItems: 'center', gap: 4, paddingVertical: 6, borderRadius: 12 },
  tabActive: { backgroundColor: 'rgba(99,102,241,0.15)' },
  tabIcon: { fontSize: 20 },
  tabLabel: { color: 'rgba(255,255,255,0.35)', fontSize: 11 },
  tabLabelActive: { color: '#818cf8', fontWeight: '600' },
});

export default StatsScreen;
