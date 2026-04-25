import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  Animated,
  ScrollView,
} from 'react-native';
import type { ListItem } from '../types';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface DraggableListProps {
  items: ListItem[];
  onReorder: (items: ListItem[]) => void;
  onToggle: (id: string) => void;
}

const INITIAL_ITEMS: ListItem[] = [
  { id: '1', label: 'Review flashcards', emoji: '📚', completed: false },
  { id: '2', label: 'Practice algorithms', emoji: '🧮', completed: false },
  { id: '3', label: 'Read documentation', emoji: '📖', completed: false },
  { id: '4', label: 'Build a side project', emoji: '🚀', completed: false },
  { id: '5', label: 'Watch video lectures', emoji: '🎥', completed: false },
];

const DraggableList: React.FC<DraggableListProps> = ({ items, onReorder, onToggle }) => {
  const scaleAnims = useRef<Record<string, Animated.Value>>(
    Object.fromEntries(items.map((item) => [item.id, new Animated.Value(1)]))
  ).current;

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const newItems = [...items];
    [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    onReorder(newItems);
  };

  const handleMoveDown = (index: number) => {
    if (index === items.length - 1) return;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const newItems = [...items];
    [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    onReorder(newItems);
  };

  const handleToggle = (id: string) => {
    // Pulse animation on toggle
    Animated.sequence([
      Animated.timing(scaleAnims[id], { toValue: 0.95, duration: 80, useNativeDriver: true }),
      Animated.spring(scaleAnims[id], { toValue: 1, useNativeDriver: true, tension: 120, friction: 5 }),
    ]).start();

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onToggle(id);
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {items.map((item, index) => (
        <Animated.View
          key={item.id}
          style={[
            styles.itemContainer,
            item.completed && styles.itemCompleted,
            { transform: [{ scale: scaleAnims[item.id] ?? new Animated.Value(1) }] },
          ]}
        >
          {/* Checkbox */}
          <TouchableOpacity
            onPress={() => handleToggle(item.id)}
            style={[styles.checkbox, item.completed && styles.checkboxChecked]}
          >
            {item.completed && <Text style={styles.checkMark}>✓</Text>}
          </TouchableOpacity>

          {/* Emoji & Label */}
          <Text style={styles.emoji}>{item.emoji}</Text>
          <Text style={[styles.label, item.completed && styles.labelDone]}>
            {item.label}
          </Text>

          {/* Move buttons */}
          <View style={styles.moveButtons}>
            <TouchableOpacity
              onPress={() => handleMoveUp(index)}
              disabled={index === 0}
              style={[styles.moveBtn, index === 0 && styles.moveBtnDisabled]}
            >
              <Text style={styles.moveBtnText}>▲</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleMoveDown(index)}
              disabled={index === items.length - 1}
              style={[styles.moveBtn, index === items.length - 1 && styles.moveBtnDisabled]}
            >
              <Text style={styles.moveBtnText}>▼</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      ))}
    </ScrollView>
  );
};

export { INITIAL_ITEMS };

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  itemCompleted: {
    backgroundColor: 'rgba(74,222,128,0.08)',
    borderColor: 'rgba(74,222,128,0.2)',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#4ade80',
    borderColor: '#4ade80',
  },
  checkMark: {
    color: '#000',
    fontSize: 13,
    fontWeight: '800',
  },
  emoji: {
    fontSize: 20,
    marginRight: 10,
  },
  label: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
  labelDone: {
    color: 'rgba(255,255,255,0.35)',
    textDecorationLine: 'line-through',
  },
  moveButtons: {
    flexDirection: 'column',
    gap: 2,
  },
  moveBtn: {
    padding: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  moveBtnDisabled: {
    opacity: 0.2,
  },
  moveBtnText: {
    color: '#fff',
    fontSize: 11,
  },
});

export default DraggableList;
