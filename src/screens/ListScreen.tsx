import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import DraggableList, { INITIAL_ITEMS } from '../components/DraggableList';
import type { ListItem } from '../types';

interface ListScreenProps {
  onNavigate: (screen: 'deck' | 'list' | 'stats') => void;
  activeTab: string;
}

const ListScreen: React.FC<ListScreenProps> = ({ onNavigate, activeTab }) => {
  const [items, setItems] = useState<ListItem[]>(INITIAL_ITEMS);

  const completedCount = items.filter((i) => i.completed).length;

  const handleToggle = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const handleReorder = (newItems: ListItem[]) => {
    setItems(newItems);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Study Plan</Text>
        <Text style={styles.subtitle}>
          {completedCount}/{items.length} complete
        </Text>
      </View>

      <Text style={styles.hint}>Use ▲▼ arrows to reorder • Tap to complete</Text>

      <View style={styles.listContainer}>
        <DraggableList items={items} onReorder={handleReorder} onToggle={handleToggle} />
      </View>

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
  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: '#818cf8',
    fontSize: 14,
    marginTop: 4,
  },
  hint: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    backgroundColor: '#0f0d2e',
    paddingBottom: 28,
    paddingTop: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    borderRadius: 12,
  },
  tabActive: { backgroundColor: 'rgba(99,102,241,0.15)' },
  tabIcon: { fontSize: 20 },
  tabLabel: { color: 'rgba(255,255,255,0.35)', fontSize: 11 },
  tabLabelActive: { color: '#818cf8', fontWeight: '600' },
});

export default ListScreen;
