import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
} from 'react-native';
import SwipeCard from '../components/SwipeCard';
import ProgressRing from '../components/ProgressRing';
import StatsBar from '../components/StatsBar';
import type { FlashCard, SwipeDirection, ProgressData } from '../types';

const { width: SCREEN_W } = Dimensions.get('window');

const CARDS: FlashCard[] = [
  { id: '1', question: 'What is the time complexity of binary search?', answer: 'O(log n) — it halves the search space each step.', category: 'Algorithms', difficulty: 'easy' },
  { id: '2', question: 'What does the "S" in SOLID stand for?', answer: 'Single Responsibility Principle — a class should have only one reason to change.', category: 'Design', difficulty: 'medium' },
  { id: '3', question: 'Explain the difference between == and === in JavaScript.', answer: '== checks value with type coercion; === checks value AND type without coercion.', category: 'JavaScript', difficulty: 'easy' },
  { id: '4', question: 'What is a closure in JavaScript?', answer: 'A function that retains access to its outer lexical scope even after the outer function has returned.', category: 'JavaScript', difficulty: 'medium' },
  { id: '5', question: 'What is the CAP theorem?', answer: 'A distributed system can only guarantee 2 of: Consistency, Availability, Partition tolerance.', category: 'Systems', difficulty: 'hard' },
  { id: '6', question: 'What is memoization?', answer: 'Caching the results of expensive function calls and returning cached result when the same inputs occur again.', category: 'Algorithms', difficulty: 'medium' },
  { id: '7', question: 'What is a React hook?', answer: 'Functions that let you use state and lifecycle features in functional components (e.g. useState, useEffect).', category: 'React', difficulty: 'easy' },
];

interface CardDeckScreenProps {
  onNavigate: (screen: 'deck' | 'list' | 'stats') => void;
  activeTab: string;
}

const CardDeckScreen: React.FC<CardDeckScreenProps> = ({ onNavigate, activeTab }) => {
  const [cards, setCards] = useState<FlashCard[]>(CARDS);
  const [progress, setProgress] = useState<ProgressData>({
    total: CARDS.length,
    correct: 0,
    incorrect: 0,
    skipped: CARDS.length,
  });

  // Animated value for the "all done" screen fade-in
  const doneAnim = useRef(new Animated.Value(0)).current;

  const handleSwipe = useCallback(
    (direction: SwipeDirection) => {
      setCards((prev) => prev.slice(0, -1));
      setProgress((prev) => ({
        ...prev,
        correct: direction === 'right' ? prev.correct + 1 : prev.correct,
        incorrect: direction === 'left' ? prev.incorrect + 1 : prev.incorrect,
        skipped: prev.skipped - 1,
      }));

      if (cards.length === 1) {
        Animated.spring(doneAnim, { toValue: 1, useNativeDriver: true, tension: 50, friction: 8 }).start();
      }
    },
    [cards.length]
  );

  const handleRestart = () => {
    doneAnim.setValue(0);
    setCards(CARDS);
    setProgress({ total: CARDS.length, correct: 0, incorrect: 0, skipped: CARDS.length });
  };

  const doneProgress = (progress.correct + progress.incorrect) / progress.total;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>CardDeck</Text>
        <Text style={styles.cardCount}>
          {Math.max(0, cards.length)} card{cards.length !== 1 ? 's' : ''} left
        </Text>
      </View>

      {/* Progress Ring */}
      <View style={styles.ringContainer}>
        <ProgressRing
          progress={doneProgress}
          size={90}
          strokeWidth={8}
          color="#818cf8"
          label="Done"
        />
      </View>

      {/* Stats Bar */}
      <StatsBar data={progress} />

      {/* Card Stack */}
      <View style={styles.deckArea}>
        {cards.length === 0 ? (
          <Animated.View style={[styles.doneCard, { opacity: doneAnim, transform: [{ scale: doneAnim.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) }] }]}>
            <Text style={styles.doneEmoji}>🎉</Text>
            <Text style={styles.doneTitle}>All done!</Text>
            <Text style={styles.doneSubtitle}>
              You knew {progress.correct} out of {progress.total} cards
            </Text>
            <TouchableOpacity style={styles.restartBtn} onPress={handleRestart}>
              <Text style={styles.restartText}>Restart Deck</Text>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          [...cards].reverse().map((card, reversedIndex) => {
            const index = cards.length - 1 - reversedIndex; // 0 = top
            return (
              <SwipeCard
                key={card.id}
                card={card}
                onSwipe={handleSwipe}
                isTop={index === 0}
                index={index}
              />
            );
          })
        )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 12,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  cardCount: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 14,
  },
  ringContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  deckArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  doneCard: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e1b4b',
    width: SCREEN_W - 40,
    borderRadius: 24,
    padding: 40,
    gap: 12,
  },
  doneEmoji: { fontSize: 48 },
  doneTitle: { color: '#fff', fontSize: 28, fontWeight: '800' },
  doneSubtitle: { color: 'rgba(255,255,255,0.5)', fontSize: 15, textAlign: 'center' },
  restartBtn: {
    marginTop: 16,
    backgroundColor: '#6366f1',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 14,
  },
  restartText: { color: '#fff', fontWeight: '700', fontSize: 15 },
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

export default CardDeckScreen;
