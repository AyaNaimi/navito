# Navito Travel App — Design Strategy

## Design Philosophy: Modern Nomadic Minimalism

**Design Movement:** Inspired by contemporary travel apps (Airbnb, Google Maps) merged with North African cultural warmth. Clean, purposeful interfaces with subtle cultural references and vibrant accent colors.

### Core Principles

1. **Information Hierarchy Over Decoration** — Every element serves navigation or discovery; no visual noise
2. **Tactile Feedback** — Cards, shadows, and micro-interactions create a sense of physical interaction
3. **Cultural Authenticity** — Warm earth tones (ochre, terracotta) paired with modern neutrals; Arabic/Darija typography respected
4. **Mobile-First Fluidity** — Bottom navigation, horizontal scrolls, and swipe-friendly interactions dominate

### Color Philosophy

- **Primary Accent:** Warm terracotta (`#D97706`) — represents Moroccan earth, hospitality, and energy
- **Secondary Accent:** Deep teal (`#0F766E`) — represents water, trust, and exploration
- **Neutrals:** Warm off-white (`#FFFBF0`) for backgrounds, charcoal (`#1F2937`) for text
- **Emotional Intent:** Inviting warmth balanced with modern clarity; colors evoke both adventure and safety

### Layout Paradigm

- **Bottom Navigation Bar** — 5 main sections (Explore, Transport, Food, Sorties, Find a Guide) always accessible
- **Horizontal Card Scrolls** — For discovering places, restaurants, guides; encourages browsing
- **Full-Width Bottom Sheets** — Detail views slide up from bottom, maintaining context
- **Asymmetric Grids** — Feature cards vary in size; hero sections use diagonal cuts or overlapping elements

### Signature Elements

1. **Terracotta Accent Bars** — Subtle left/top borders on cards and sections; ties to Moroccan architecture
2. **Rounded Corners with Depth** — Cards have soft shadows and 12px border radius; creates tactile feel
3. **Icon + Text Pairings** — Every action has a clear icon (lucide-react) + descriptive label

### Interaction Philosophy

- **Smooth Transitions** — All state changes (tab switches, sheet opens) use 300ms easing
- **Haptic Feedback Hints** — Buttons scale slightly on press; cards lift on hover (desktop)
- **Progressive Disclosure** — Expandable sections reveal details without page jumps
- **Loading States** — Skeleton loaders and spinners maintain visual continuity

### Animation Guidelines

- **Page Transitions:** Fade-in (200ms) when switching tabs; no jarring jumps
- **Card Reveals:** Staggered entrance (100ms delay between items) for lists
- **Bottom Sheet:** Slide-up animation (300ms cubic-bezier(0.4, 0, 0.2, 1))
- **Hover Effects:** Subtle scale (1.02) and shadow lift on interactive elements

### Typography System

- **Display Font:** "Playfair Display" (serif, bold) — Section titles, hero headings; conveys elegance
- **Body Font:** "Inter" (sans-serif, 400/500/600) — All body text, labels, navigation
- **Hierarchy:**
  - H1: 32px Playfair Display, bold
  - H2: 24px Playfair Display, bold
  - H3: 18px Inter, 600
  - Body: 14px Inter, 400
  - Small: 12px Inter, 400

---

## Design Decisions Log

**Chosen Approach:** Modern Nomadic Minimalism

This approach balances the practical needs of travelers (clear information, quick access) with the emotional experience of discovery. The warm terracotta accents honor Moroccan heritage without feeling kitsch, while the modern layout ensures usability on any device. Bottom navigation keeps all features one tap away, and horizontal scrolls encourage exploration rather than forcing users through rigid lists.

**Why This Works for Navito:**
- Travelers need **clarity** (minimalism) and **confidence** (warmth + cultural respect)
- Mobile-first bottom nav is proven for travel apps (Google Maps, Airbnb)
- Horizontal scrolls reduce cognitive load; users browse naturally
- Terracotta + teal palette is distinctive yet professional
