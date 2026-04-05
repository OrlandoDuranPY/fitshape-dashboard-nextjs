# Fitshape Dashboard — Interface Design System

## Product Context

**Who:** Gym coaches and trainers. They manage clients, routines, and sessions. Physical people who open the dashboard between sessions — they need fast, high-signal reads.

**Feel:** Athletic scoreboard. Precise, no-nonsense, high contrast. Like a training facility display — geometric and purposeful, not decorative.

---

## Direction & Tokens

**Typography:** `font-heading` (Chakra Petch) for all navigation labels, metric numbers, card titles, and the logo. `font-sans` for body text and descriptions.

**Brand:** `text-brand` / `bg-brand` → `#ff0a54` — vivid red, used for active states, urgent metrics, and primary accents. Single accent color — never introduce a second.

**Text hierarchy:**
- `text-foreground` — primary values, active nav items
- `text-muted-foreground` — labels, titles, inactive nav items
- `text-brand` — active/urgent state, links on hover

**Depth strategy:** Borders-only. `border border-border` (or `border-gray/20`) for cards. No drop shadows. Elevation comes from surface tints, not shadows.

**Surfaces:**
- Page background: `bg-background`
- Sidebar / cards: `bg-card-surface`
- Icon containers / active tints: `bg-brand/10`

**Spacing base:** `4` (1rem). Components use `p-4` or `p-5`. Gaps use `gap-2`, `gap-3`, `gap-4`.

**Border radius:** `rounded-lg` for buttons and nav items, `rounded-xl` for cards and modals.

---

## Signature Elements

**Left border indicator** — Active nav items get `border-l-2 border-brand pl-2.5`. Inactive items get `border-l-2 border-transparent pl-2.5` with `hover:border-brand`. This is the position marker — like a lane line in a track.

**Icon container** — Icons that represent a section or category live in `p-2 rounded-lg bg-brand/10 text-brand`. Never raw icons floating in space.

**Semantic number color** — Metric card values turn `text-brand` when their stat variant is `"brand"` (urgent). The number itself signals status before the user reads the badge.

---

## Component Patterns

### Nav Item (link)
```tsx
className={`px-3 py-2 w-full rounded-lg flex items-center gap-3 font-heading font-medium text-sm transition-colors border-l-2 pl-2.5 ${
  isActive
    ? "bg-brand/10 text-brand border-brand"
    : "text-muted-foreground hover:bg-brand/10 hover:text-brand hover:border-brand border-transparent"
}`}
```

### Nav Item (dropdown trigger)
Same as link, plus `cursor-pointer` and `ChevronDown` with `transition-transform duration-300`.

### Dropdown children container
```tsx
<div className="ml-5 mt-1 flex flex-col gap-0.5 border-l border-brand/20 pl-3">
```

### Child link
```tsx
className={`px-3 py-1.5 rounded-md font-heading text-sm font-medium transition-colors ${
  isActive
    ? "text-brand"
    : "text-muted-foreground hover:bg-brand/10 hover:text-brand"
}`}
```

### Metric Card stat variants
```tsx
const statClasses = {
  brand:   "bg-brand/10 text-brand border-brand/20",
  success: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
  warning: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
  muted:   "bg-muted text-muted-foreground border-transparent",
};
```

### Metric Card structure
- `CardHeader`: `text-sm font-medium text-muted-foreground` title + icon in `p-2 rounded-lg bg-brand/10 text-brand` container
- Value: `font-heading font-bold text-3xl tracking-tight` — `text-brand` if urgent, `text-foreground` otherwise
- Footer: `Badge` with stat variant left, `ArrowRight` link right

---

## What to Avoid

- Multiple accent colors — `text-brand` is the only accent
- `dark:text-white/50` — use `text-muted-foreground` (handles both modes)
- Raw floating icons — always wrap in a tinted container
- Drop shadows on cards — borders only
- `font-heading` on body/description text — reserved for headings, numbers, and nav labels
