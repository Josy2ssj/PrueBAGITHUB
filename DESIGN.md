# Brand Studio — Design System

## Principles

- **Neutral canvas**: The UI never competes with the brand being designed
- **Spacious**: Generous whitespace communicates quality
- **Editorial**: Typography-first, content-focused
- **Restrained**: Minimal decoration, no gratuitous gradients
- **Functional**: Every element serves a purpose

## Typography

| Role | Font | Weight | Size | Usage |
|------|------|--------|------|-------|
| UI Labels | Inter | 600 | 12px | Section labels, metadata |
| Body | Inter | 400 | 14px | General text |
| Headings | Inter | 600 | 20px | Module titles |
| Display | DM Serif Display | 400 | — | Brand preview contexts |

- Base size: 14px
- Line height: 1.5 (body), 1.2 (headings)
- Letter spacing: -0.01em (headings), 0.04em (labels uppercase)

## Spacing Scale

```
--space-1: 4px   (tight)
--space-2: 8px   (compact)
--space-3: 12px  (default inner)
--space-4: 16px  (default gap)
--space-6: 24px  (section padding)
--space-8: 32px  (module padding)
```

## Colors

### Surfaces
- `--color-surface`: #FAFAFA (page background)
- `--color-surface-raised`: #FFFFFF (cards, panels)
- `--color-surface-overlay`: #FFFFFF (modals, popovers)

### Borders
- `--color-border`: #E5E5E5 (primary)
- `--color-border-subtle`: #F0F0F0 (secondary, dividers)

### Text
- `--color-text-primary`: #171717
- `--color-text-secondary`: #525252
- `--color-text-tertiary`: #A3A3A3

### Semantic
- `--color-accent`: #2563EB (links, active states)
- `--color-success`: #16A34A
- `--color-warning`: #D97706
- `--color-error`: #DC2626

## Radius

| Token | Value | Usage |
|-------|-------|-------|
| sm | 4px | Badges, small elements |
| md | 8px | Buttons, inputs |
| lg | 12px | Panels, cards |
| xl | 16px | Modals, large containers |
| full | 9999px | Avatars, pills |

## Shadows

```
--shadow-sm: 0 1px 2px rgba(0,0,0,0.04)
--shadow-md: 0 4px 12px rgba(0,0,0,0.06)
--shadow-lg: 0 8px 24px rgba(0,0,0,0.08)
--shadow-float: 0 12px 40px rgba(0,0,0,0.12)
```

## Navigation

### Sidebar
- Width: 224px (w-56)
- Items: 32px height, 8px vertical gap
- Active: black background, white text
- Hover: subtle surface background
- Progress dots: 8px circles (gray/yellow/green)

### Module Header
- Title: 20px semibold
- Subtitle: 14px secondary color
- Actions: right-aligned, primary + secondary buttons

## Controls

### Buttons
- Primary: black bg, white text, 8px radius, 13px font
- Secondary: white bg, border, 8px radius
- Ghost: transparent, subtle hover

### Inputs
- Height: 40px
- Border: 1px solid border color
- Focus: accent border + 3px accent/10% ring
- Radius: 8px

### Badges
- Draft: gray bg, gray text
- Proposed: amber bg, amber text
- Approved: green bg, green text
- Font: 11px, 600 weight, uppercase

## Dialogs / Modals

- Backdrop: black/20% + blur-sm
- Container: white, 2xl radius, shadow-2xl
- Max width: 448px (forms), 672px (complex)
- Padding: 32px

## AI States

| State | Visual |
|-------|--------|
| Idle | Sparkles icon, muted |
| Thinking | Pulse animation, "Thinking..." text |
| Success | Green check, result displayed |
| Error | Warning icon, dismissible message |
| Unavailable | Gray icon, "AI unavailable" text |

## Approval States

| State | Badge | Dot |
|-------|-------|-----|
| DRAFT | Gray | Gray |
| PROPOSED | Amber | Yellow |
| APPROVED | Green | Green |

## Motion

- Duration: 150ms (micro), 300ms (transitions)
- Easing: ease (default), ease-in-out (transforms)
- Fade in: opacity 0→1 + translateY 4px→0
- Hover lift: translateY -1px
- Loading: pulse-soft (2s infinite)

## Accessibility

- Minimum contrast: 4.5:1 (body text), 3:1 (large text)
- Focus visible: 2px accent outline
- Touch targets: minimum 32px
- Keyboard navigation: all interactive elements tabbable
- Screen reader: aria-labels on icon-only buttons

## Layout

- Sidebar: fixed left, 224px
- Main content: flex-1, overflow-y scroll
- Copilot: fixed right, 320px (toggleable)
- Content max-width: 896px (max-w-4xl) centered
- Module padding: 32px
