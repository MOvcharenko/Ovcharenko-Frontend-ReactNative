import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import type { ProgressData } from '../types';

interface StatsBarProps {
  data: ProgressData;
}

const StatsBar: React.FC<StatsBarProps> = ({ data }) => {
  const correctAnim = useRef(new Animated.Value(0)).current;
  const incorrectAnim = useRef(new Animated.Value(0)).current;
  const skippedAnim = useRef(new Animated.Value(0)).current;

  const done = data.correct + data.incorrect + data.skipped;
  const total = data.total || 1;

  useEffect(() => {
    // Staggered animation on mount and update
    Animated.stagger(120, [
      Animated.spring(correctAnim, {
        toValue: data.correct / total,
        useNativeDriver: false,
        tension: 50,
        friction: 7,
      }),
      Animated.spring(incorrectAnim, {
        toValue: data.incorrect / total,
        useNativeDriver: false,
        tension: 50,
        friction: 7,
      }),
      Animated.spring(skippedAnim, {
        toValue: data.skipped / total,
        useNativeDriver: false,
        tension: 50,
        friction: 7,
      }),
    ]).start();
  }, [data]);

  const bars = [
    { anim: correctAnim, color: '#4ade80', label: 'Known', value: data.correct },
    { anim: incorrectAnim, color: '#f87171', label: 'Skipped', value: data.incorrect },
    { anim: skippedAnim, color: '#facc15', label: 'Left', value: data.skipped },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {done} / {data.total} cards done
      </Text>
      <View style={styles.track}>
        {bars.map((bar) => (
          <Animated.View
            key={bar.label}
            style={[
              styles.segment,
              {
                backgroundColor: bar.color,
                flex: bar.anim,
              },
            ]}
          />
        ))}
        {/* Remaining */}
        <View style={{ flex: Math.max(0, 1 - done / total), backgroundColor: 'rgba(255,255,255,0.08)' }} />
      </View>
      <View style={styles.legend}>
        {bars.map((bar) => (
          <View key={bar.label} style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: bar.color }]} />
            <Text style={styles.legendText}>
              {bar.label}: {bar.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  title: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 10,
    textAlign: 'center',
  },
  track: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.08)',
    gap: 2,
  },
  segment: {
    borderRadius: 4,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  legendText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
  },
});

export default StatsBar;
