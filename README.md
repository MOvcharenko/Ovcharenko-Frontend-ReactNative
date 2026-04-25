# 🃏 CardDeck — Animation & Gesture System

A swipeable flashcard quiz app built with **React Native (Expo)** and **TypeScript**, demonstrating the Animation & Gesture capability group.

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js ≥ 18
- Expo CLI: `npm install -g expo-cli`
- Expo Go app on your physical device (iOS / Android)

### Install & Run

```bash
# 1. Clone / unzip the project
cd CardDeck

# 2. Install dependencies
npm install

# 3. Start the Expo dev server
npx expo start

# 4. Scan the QR code with Expo Go on your phone
#    OR press 'a' for Android emulator / 'i' for iOS simulator
```

---

## 📱 Features & Screens

| Screen | Description |
|--------|-------------|
| **CardDeck** (🃏) | Swipeable flashcard stack — swipe right if you know it, left to skip |
| **Study Plan** (📋) | Reorderable to-do list with LayoutAnimation transitions |
| **Statistics** (📊) | Animated progress rings, staggered stat cards, category bars |

---

## 🎞️ Animation Capabilities Demonstrated

### 1. `PanResponder` — Swipe & Drag (SwipeCard.tsx)
- Cards respond to touch gestures via `PanResponder`
- Velocity-based swipe detection with a 30% screen-width threshold
- Snap-back with `Animated.spring` when threshold not reached

### 2. `Interpolation` — Color, Rotation, Opacity (SwipeCard.tsx)
- Card **rotates** as it's dragged (`position.x → rotate`)
- **KNOW IT / SKIP labels fade in** based on drag direction (`position.x → opacity`)
- Done-screen **scale-in** via `doneAnim → scale` interpolation

### 3. `Animated.spring` — Flip Animation (SwipeCard.tsx)
- Tap a card to flip it (question → answer) using spring physics
- Front and back faces use `rotateY` interpolation with `backfaceVisibility: 'hidden'`

### 4. `LayoutAnimation` — List Reordering (DraggableList.tsx)
- Pressing ▲▼ arrows triggers `LayoutAnimation.configureNext(easeInEaseOut)`
- Items slide smoothly into new positions without manual coordinate tracking
- Toggle completion also uses LayoutAnimation for smooth re-flow

### 5. `Animated.stagger` — Staggered Entrance (StatsScreen.tsx)
- Stat cards fly in with a 100ms stagger using `Animated.stagger`
- Category bars animate in sequentially with spring physics

### 6. Animated SVG `ProgressRing` (ProgressRing.tsx)
- Custom animated component using `react-native-svg`
- `strokeDashoffset` driven by `Animated.spring` for a smooth arc fill
- Used in both CardDeck screen and Stats screen

### 7. `Animated.sequence` — Pulse on Toggle (DraggableList.tsx)
- Checking off a list item triggers a quick scale pulse via `Animated.sequence`

---

## 🏗️ Architecture

```
CardDeck/
├── App.tsx                        # Root — tab state, screen switching
├── app.json                       # Expo config
├── package.json
├── tsconfig.json
└── src/
    ├── types.ts                   # All TypeScript interfaces & types
    ├── screens/
    │   ├── CardDeckScreen.tsx     # Main swipe UI + progress ring + stats bar
    │   ├── ListScreen.tsx         # Reorderable study checklist
    │   └── StatsScreen.tsx        # Statistics dashboard
    └── components/
        ├── SwipeCard.tsx          # Swipeable card with flip animation
        ├── ProgressRing.tsx       # Animated SVG ring component
        ├── DraggableList.tsx      # LayoutAnimation reorderable list
        └── StatsBar.tsx           # Stagger-animated progress bar row
```

### State Management
No external state library — React `useState` and `useRef` are sufficient for this scope. Each screen owns its data; a production app would lift state to Context or Zustand.

### Animation Philosophy
- `useNativeDriver: true` is used wherever possible (transforms, opacity) for 60fps on the JS thread
- `useNativeDriver: false` is used only where required (layout properties like `flex`, SVG `strokeDashoffset`)
- All `Animated.Value` refs are created with `useRef` to survive re-renders

---

## 👥 Team Roles

| Member | Responsibility |
|--------|---------------|
| **[Name 1]** | `SwipeCard.tsx` — PanResponder gesture system, card flip animation, swipe interpolation |
| **[Name 2]** | `CardDeckScreen.tsx` + `StatsBar.tsx` — Deck state management, stagger progress bars |
| **[Name 3]** | `ProgressRing.tsx` — Animated SVG component, spring arc animation |
| **[Name 4]** | `DraggableList.tsx` + `ListScreen.tsx` — LayoutAnimation reordering, sequence pulse |
| **[Name 5]** | `StatsScreen.tsx` + `types.ts` — Statistics UI, staggered entrance, TypeScript types |

> Replace `[Name N]` with your actual team members before presenting.

---

## 📋 Deliverables Checklist

- [x] Expo project with TypeScript template (`tsconfig.json` with `strict: true`)
- [x] **5 animation capabilities** demonstrated (PanResponder, Interpolation, Spring, LayoutAnimation, Stagger)
- [x] TypeScript used throughout — no `any` types, proper interfaces for all props
- [x] App runs on physical device via Expo Go / emulator without crashes
- [x] `src/screens/` and `src/components/` structure
- [x] `types.ts` with all shared TypeScript definitions
- [x] README with setup, architecture, and team roles

---

## 🎤 Demo Flow (for presentation)

1. **CardDeck tab** — drag a card slowly to show rotation & label fade, then release (snap back). Swipe fully right. Flip a card by tapping it.
2. **Study Plan tab** — tap to complete items (pulse + LayoutAnimation). Use arrows to reorder (smooth slide).
3. **Stats tab** — navigate to show staggered card entrance and animating category bars.
4. Return to **CardDeck** — show the ProgressRing arc updating live.

---

## 📦 Key Packages

| Package | Purpose |
|---------|---------|
| `react-native` (core) | `Animated`, `PanResponder`, `LayoutAnimation` |
| `react-native-svg` | SVG primitives for ProgressRing |
| `expo-status-bar` | Dark status bar |
| `react-native-safe-area-context` | Safe area insets |
