# Navito Design System: Vibe 1 (Minimalist)

This design system is inspired by premium, minimalist workspaces (Apple/Notion style). It focuses on high-quality typography, generous whitespace, and subtle shadows.

## Visual Tokens

### Colors
- **Background**: `#FAFAFA` (Main container background)
- **Surface**: `#FFFFFF` (Card and modal surfaces)
- **Primary Text**: `#171717` (Headers, body text)
- **Muted Text**: `#737373` (Captions, labels)
- **Border**: `#E5E5E5` (Thin borders for separation)
- **Primary Accent**: `#171717` (Buttons, active states)
- **Secondary Accent**: `#F5F5F7` (Badge backgrounds, secondary buttons)

### Typography
- **Core Sans**: Inter or Geist (Sans-serif)
- **Scale**: Refined (Slightly smaller, elegant sizing)
- **Weights**: Semibold (13px headers), Medium (11px labels), Bold (15px app title)

### Spacing & Borders
- **Border Radius**: `2xl` (16px) for cards, `full` for interactive elements.
- **Shadows**: Subtle, soft shadows for depth.
- **Padding**: Focused on generous whitespace around content.

### Components Logic
- **Cards**: Aspect ratio 4/5 for imagery.
- **Badges**: 10px font size, thin borders.
- **Buttons**: Hover effects focus on slight scaling or very subtle color shifts.

## Implementation Guidelines
- Use `tailwind-merge` and `clsx` for classes.
- Use Lucide icons for all iconography.
- Use `framer-motion` for subtle entry and hover transitions.
