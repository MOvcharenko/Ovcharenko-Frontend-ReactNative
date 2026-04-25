import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import type { SwipeCardProps, SwipeDirection } from '../types';

const { width: SCREEN_W } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_W * 0.3;
const SWIPE_OUT_DURATION = 300;

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: '#4ade80',
  medium: '#facc15',
  hard: '#f87171',
};

const SwipeCard: React.FC<SwipeCardProps> = ({ card, onSwipe, isTop, index }) => {
  const [flipped, setFlipped] = useState(false);
  const position = useRef(new Animated.ValueXY()).current;
  const flipAnim = useRef(new Animated.Value(0)).current;

  // ── PanResponder ────────────────────────────────────────────────────────────
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => isTop,
      onMoveShouldSetPanResponder: () => isTop,
      onPanResponderMove: (_evt, gestureState) => {
        position.setValue({ x: gestureState.dx, y: gestureState.dy });
      },
      onPanResponderRelease: (_evt, gestureState) => {
        if (gestureState.dx > SWIPE_THRESHOLD) {
          forceSwipe('right');
        } else if (gestureState.dx < -SWIPE_THRESHOLD) {
          forceSwipe('left');
        } else {
          resetPosition();
        }
      },
    })
  ).current;

  const forceSwipe = (direction: SwipeDirection) => {
    const x = direction === 'right' ? SCREEN_W * 1.5 : -SCREEN_W * 1.5;
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: true,
    }).start(() => onSwipe(direction));
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: true,
      tension: 40,
      friction: 6,
    }).start();
  };

  // ── Flip animation ───────────────────────────────────────────────────────────
  const handleFlip = () => {
    const toValue = flipped ? 0 : 1;
    Animated.spring(flipAnim, {
      toValue,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start();
    setFlipped(!flipped);
  };

  // Interpolations for card rotation on drag
  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_W, 0, SCREEN_W],
    outputRange: ['-20deg', '0deg', '20deg'],
    extrapolate: 'clamp',
  });

  // Green overlay when swiping right, red when swiping left
  const rightLabelOpacity = position.x.interpolate({
    inputRange: [0, SWIPE_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const leftLabelOpacity = position.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  // Flip front/back faces
  const frontOpacity = flipAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 0, 0] });
  const backOpacity = flipAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0, 1] });
  const frontRotateY = flipAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const backRotateY = flipAnim.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] });

  // Stack scale for cards behind top
  const cardScale = isTop ? 1 : 1 - index * 0.04;
  const cardTranslateY = isTop ? 0 : index * 10;

  const cardStyle = isTop
    ? {
        transform: [
          { translateX: position.x },
          { translateY: position.y },
          { rotate },
          { scale: cardScale },
        ],
      }
    : {
        transform: [{ scale: cardScale }, { translateY: cardTranslateY }],
      };

  return (
    <Animated.View
      style={[styles.card, cardStyle]}
      {...(isTop ? panResponder.panHandlers : {})}
    >
      <TouchableOpacity activeOpacity={1} onPress={isTop ? handleFlip : undefined} style={styles.touchable}>
        {/* CORRECT label */}
        <Animated.View style={[styles.swipeLabel, styles.correctLabel, { opacity: rightLabelOpacity }]}>
          <Text style={styles.swipeLabelText}>✓ KNOW IT</Text>
        </Animated.View>

        {/* SKIP label */}
        <Animated.View style={[styles.swipeLabel, styles.skipLabel, { opacity: leftLabelOpacity }]}>
          <Text style={styles.swipeLabelText}>✗ SKIP</Text>
        </Animated.View>

        {/* Category & difficulty badge */}
        <View style={styles.badge}>
          <View style={[styles.difficultyDot, { backgroundColor: DIFFICULTY_COLORS[card.difficulty] }]} />
          <Text style={styles.badgeText}>{card.category}</Text>
        </View>

        {/* Front face – Question */}
        <Animated.View
          style={[
            styles.face,
            { opacity: frontOpacity, transform: [{ rotateY: frontRotateY }] },
          ]}
        >
          <Text style={styles.faceLabel}>QUESTION</Text>
          <Text style={styles.questionText}>{card.question}</Text>
          <Text style={styles.tapHint}>Tap to reveal answer</Text>
        </Animated.View>

        {/* Back face – Answer */}
        <Animated.View
          style={[
            styles.face,
            styles.backFace,
            { opacity: backOpacity, transform: [{ rotateY: backRotateY }] },
          ]}
        >
          <Text style={styles.faceLabel}>ANSWER</Text>
          <Text style={styles.answerText}>{card.answer}</Text>
          <Text style={styles.tapHint}>Swipe right if you knew it ↗</Text>
        </Animated.View>

        {/* Swipe hint arrows */}
        {isTop && (
          <View style={styles.swipeHints}>
            <Text style={styles.hintArrow}>← Skip</Text>
            <Text style={styles.hintArrow}>Know it →</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    width: SCREEN_W - 40,
    height: 420,
    borderRadius: 24,
    backgroundColor: '#1e1b4b',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
  touchable: {
    flex: 1,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    marginBottom: 0,
    gap: 6,
  },
  difficultyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  badgeText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  face: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    paddingTop: 60,
    backfaceVisibility: 'hidden',
  },
  backFace: {
    backgroundColor: '#312e81',
  },
  faceLabel: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 11,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 20,
  },
  questionText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 32,
  },
  answerText: {
    color: '#a5b4fc',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 30,
  },
  tapHint: {
    position: 'absolute',
    bottom: 60,
    color: 'rgba(255,255,255,0.3)',
    fontSize: 12,
  },
  swipeLabel: {
    position: 'absolute',
    top: 28,
    zIndex: 10,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 2,
  },
  correctLabel: {
    right: 24,
    borderColor: '#4ade80',
    backgroundColor: 'rgba(74,222,128,0.15)',
  },
  skipLabel: {
    left: 24,
    borderColor: '#f87171',
    backgroundColor: 'rgba(248,113,113,0.15)',
  },
  swipeLabelText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 1,
  },
  swipeHints: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  hintArrow: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 11,
  },
});

export default SwipeCard;
