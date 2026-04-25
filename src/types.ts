// ─── Card & Deck Types ───────────────────────────────────────────────────────

export interface FlashCard {
  id: string;
  question: string;
  answer: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export type SwipeDirection = 'left' | 'right' | 'up' | 'none';

export interface SwipeResult {
  cardId: string;
  direction: SwipeDirection;
  correct: boolean;
}

// ─── Draggable List Types ────────────────────────────────────────────────────

export interface ListItem {
  id: string;
  label: string;
  emoji: string;
  completed: boolean;
}

// ─── Progress Types ──────────────────────────────────────────────────────────

export interface ProgressData {
  total: number;
  correct: number;
  incorrect: number;
  skipped: number;
}

// ─── Component Prop Types ────────────────────────────────────────────────────

export interface SwipeCardProps {
  card: FlashCard;
  onSwipe: (direction: SwipeDirection) => void;
  isTop: boolean;
  index: number;
}

export interface ProgressRingProps {
  progress: number; // 0–1
  size: number;
  strokeWidth: number;
  color: string;
  label?: string;
}

export interface DraggableItemProps {
  item: ListItem;
  index: number;
  onToggle: (id: string) => void;
}

export interface CategoryBadgeProps {
  category: string;
  difficulty: FlashCard['difficulty'];
}
