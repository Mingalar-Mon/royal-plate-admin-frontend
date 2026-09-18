# Color Theme — Royal Plate Admin Frontend

> Design-system reference for the Royal Plate Admin color palette, Tailwind mapping, CSS variables, preset schemas and runtime theming.
> Sources verified from codebase 2026-09-18.

## 1. Overview

*   **Framework:** Tailwind CSS v4 (`@import 'tailwindcss'` + `@config '../../../../tailwind.config.cjs'`).
*   **Strategy:** All semantic colors are CSS variables (`var(--*)`) injected at `:root` / `.dark` and re-mapped by `preset-theme-schema.config.ts` at runtime. Tailwind only references the variables — no hardcoded hex in utility classes.
*   **Dark mode:** `darkMode: 'class'` — toggle `.dark` on `<html>`.
*   **Font:** `Inter` (300/400/600/700) `src/assets/styles/app.css:1`.
*   **Default brand:** Royal Plate burgundy `#6e1423` + gold `#c9a227`.

---

## 2. Source of Truth Files

| Concern | File | Key Section |
| :--- | :--- | :--- |
| Tailwind palette → CSS var mapping | `tailwind.config.cjs:58-87` | `theme.extend.colors` |
| Canonical CSS variables (light + dark) | `src/assets/styles/tailwind/index.css:5-71` | `@layer theme { :root, .dark }` |
| Preset schemas (switchable at runtime) | `src/configs/preset-theme-schema.config.ts` | `default`/`dark`/`green`/`purple`/`orange` |
| Variable → DOM injection | `src/utils/hooks/useThemeSchema.ts:14-22` | `mapTheme()` → `root.style.setProperty` |
| Persisted state | `src/store/themeStore.ts:20-44` | `themeSchema`, `mode`, `setSchema`/`setMode` |
| Default config | `src/configs/theme.config.ts:20-30` | `themeSchema: ''`, `mode: 'light'` |
| Global bootstrap | `src/components/template/Theme.tsx:3` | `useThemeSchema()` |
| Type definitions | `src/@types/theme.ts`, `src/constants/theme.constant.ts` | `Mode`, `Direction`, `LayoutType` |
| Component styles | `src/assets/styles/components/_button.css`, `src/assets/styles/tailwind/index.css:165-182` | `.button`, `.btn-restaurant-solid` |

---

## 3. Core Palette

### 3.1 Brand

| Token | CSS Var | Light Hex | Dark Hex | Tailwind | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Primary | `--primary` | `#6e1423` | `#6e1423` | `bg-primary` `text-primary` `border-primary` `ring-primary` | CTA, active nav `TabNav.tsx:38`, Pagination active, DatePicker selected |
| Primary Deep | `--primary-deep` | `#4a0d16` | `#4a0d16` | `bg-primary-deep` | Hover pressed, gradient `Notification.tsx:136` `from-[#2a0a10] via-primary-deep to-primary` |
| Primary Mild | `--primary-mild` | `#8a2a35` | `#8a2a35` | `bg-primary-mild` `text-primary-mild` `hover:bg-primary-mild` | Hover state `Button.tsx:128`, Bell icon `NotificationToggle.tsx:14` |
| Primary Subtle | `--primary-subtle` | `#6e14231a` (10% opacity) | `#6e14231a` | `bg-primary-subtle` | Hover bg `Select Option`, `NotificationToggle.tsx:13` `hover:bg-primary-subtle` |
| Neutral | `--neutral` | `#ffffff` | `#ffffff` | `bg-neutral` `text-neutral` | Button solid text `Button.tsx:127`, inverted surfaces |
| Gold | `--gold` | `#c9a227` | `#c9a227` | `bg-gold` `text-gold` | Restaurant-specific accent, `UserProfileDropdown.tsx:42` |
| Gold Light | `--gold-light` | `#e9c66a` | `#e9c66a` | `bg-gold-light` | Spinner in gold button `index.css:179` |
| Gold Dark | `--gold-dark` | `#a8861d` | `#a8861d` | `bg-gold-dark` | Hover gold `btn-restaurant-solid:hover` `index.css:174` |

> `.btn-restaurant-solid` `src/assets/styles/tailwind/index.css:166-182` is the only un-layered override: `bg: var(--gold)` + `color: var(--primary-deep)` `hover: var(--gold-dark)`. Use for **Restaurant login** CTA only.

### 3.2 Semantic

| Token | Var | Hex | Subtle Hex | Tailwind |
| :--- | :--- | :--- | :--- | :--- |
| Error | `--error` | `#ff6a55` | `#ff6a551a` (10%) | `bg-error` `text-error` `bg-error-subtle` |
| Success | `--success` | `#10b981` | `#05eb7624` (14%) | `bg-success` `bg-success-subtle` |
| Info | `--info` | `#2a85ff` | `#2a85ff1a` | `bg-info` `bg-info-subtle` |
| Warning | `--warning` | `#f59e0b` | `#ffd40045` | `bg-warning` `bg-warning-subtle` |

Subtle = semantic color + 2-digit alpha (`1a` ≈ 10%, `24` ≈ 14%, `45` ≈ 27%). Used for badges, alerts, `Progress` indeterminate.

### 3.3 Neutrals & Text

| Token | Var | Hex |
| :--- | :--- | :--- |
| `gray-50` | `--gray-50` | `#fafafa` |
| `gray-100` | `--gray-100` | `#f5f5f5` — `body` `bg-gray-100` |
| `gray-200` | `--gray-200` | `#e5e5e5` — default `border-color` `index.css:79` |
| `gray-300` | `--gray-300` | `#d4d4d4` |
| `gray-400` | `--gray-400` | `#a3a3a3` |
| `gray-500` | `--gray-500` | `#737373` |
| `gray-600` | `--gray-600` | `#525252` |
| `gray-700` | `--gray-700` | `#404040` |
| `gray-800` | `--gray-800` | `#262626` |
| `gray-900` | `--gray-900` | `#171717` — heading `text-gray-900` `index.css:115` |
| `gray-950` | `--gray-950` | `#0a0a0a` — `dark:bg-gray-950` |
| `text-primary` | `--text-primary` | `#171717` light / `#f5f5f5` dark |
| `text-secondary` | `--text-secondary` | `#525252` light / `#d4d4d4` dark — `body` color |
| `text-muted` | `--text-muted` | `#737373` light / `#a3a3a3` dark |

Typography `src/assets/styles/tailwind/index.css:113-157`: `h1` clamp 1.75-2.25rem … `h6` 1rem, all `font-bold text-gray-900 dark:text-gray-100`. Utility helpers: `.text-content-primary` / `secondary` / `muted`, `.text-primary-strong` (`var(--primary-deep)` light, `var(--primary-mild)` dark).

### 3.4 Dark Mode Pair

`src/assets/styles/tailwind/index.css:39-70` `.dark` currently mirrors `:root` (same hex) — prepared for inversion. Preset `dark` schema in `preset-theme-schema.config.ts:27-42` inverts at runtime: `light: #18181b` → `dark: #ffffff` primary.

Global dark activation: `tailwind.config.cjs:11` `darkMode: 'class'`, managed by `useDarkMode.ts` via `useThemeStore.mode`.

---

## 4. Tailwind Mapping

`tailwind.config.cjs:58-87`

```js
extend: {
  colors: {
    'primary': 'var(--primary)',
    'primary-deep': 'var(--primary-deep)',
    'primary-mild': 'var(--primary-mild)',
    'primary-subtle': 'var(--primary-subtle)',
    'gold': 'var(--gold)',
    'gold-light': 'var(--gold-light)',
    'gold-dark': 'var(--gold-dark)',
    'error': 'var(--error)',
    'error-subtle': 'var(--error-subtle)',
    'success': 'var(--success)',
    'success-subtle': 'var(--success-subtle)',
    'info': 'var(--info)',
    'info-subtle': 'var(--info-subtle)',
    'warning': 'var(--warning)',
    'warning-subtle': 'var(--warning-subtle)',
    'neutral': 'var(--neutral)',
    'gray-50': 'var(--gray-50)', // ... up to gray-950
  }
}
```

All utilities (`bg-*`, `text-*`, `border-*`, `ring-*`, `from-*`) resolve to the CSS variables. No hex in JSX — always use token.

---

## 5. CSS Variables Reference

| Variable | Default (light) | Class | Typical Usage |
| :--- | :--- | :--- | :--- |
| `--primary` | `#6e1423` | `bg-primary` | Solid primary CTA `Button.tsx:126` |
| `--primary-deep` | `#4a0d16` | `bg-primary-deep` `text-primary-strong` | Pressed / gradient end |
| `--primary-mild` | `#8a2a35` | `hover:bg-primary-mild` `text-primary-mild` | Hover, icons |
| `--primary-subtle` | `#6e14231a` | `bg-primary-subtle` | Selected row `Select/Option.tsx:23`, hover bg |
| `--neutral` | `#ffffff` | `text-neutral` | Text on primary |
| `--gold` | `#c9a227` | `bg-gold` | Restaurant accent |
| `--error` | `#ff6a55` | `text-error` | Danger, delete hover `RatingList` |
| `--gray-*` | `#fafafa` → `#0a0a0a` | `bg-gray-100` | Body, borders (`_button.css` ring) |

Set via `mapTheme()` `src/utils/hooks/useThemeSchema.ts:14`:

```ts
'--primary': variables.primary
'--primary-deep': variables.primaryDeep
'--primary-mild': variables.primaryMild
'--primary-subtle': variables.primarySubtle
'--neutral': variables.neutral
```

---

## 6. Preset Theme Schemas

`src/configs/preset-theme-schema.config.ts:95-101`

| Schema | Key | Light — `primary` / `deep` / `mild` / `subtle` | Dark — `primary` / `deep` / `mild` / `subtle` | Neutral |
| :--- | :--- | :--- | :--- | :--- |
| **default** | `default` | `#6e1423` / `#4a0d16` / `#8a2a35` / `#6e14231a` | same | `#ffffff` |
| **dark** | `dark` | `#18181b` / `#09090b` / `#27272a` / `#18181b0d` | `#ffffff` / `#09090b` / `#e5e7eb` / `#ffffff1a` | `#ffffff` → `#111827` |
| **green** | `green` | `#0CAF60` / `#088d50` / `#34c779` / `#0CAF601a` | same | `#ffffff` |
| **purple** | `purple` | `#8C62FF` / `#704acc` / `#a784ff` / `#8C62FF1a` | same | `#ffffff` |
| **orange** | `orange` | `#fb732c` / `#cc5c24` / `#fc8f56` / `#fb732c1a` | same | `#ffffff` |

`defaultTheme` == Royal Plate. Configure switcher `src/components/template/ThemeConfigurator/ThemeSwitcher.tsx:20` previews `value[mode].primary`.

---

## 7. Runtime Theming

```
preset-theme-schema.config.ts  →  useThemeSchema.ts:mapTheme()  →  document.documentElement.style.setProperty('--primary', ...)
                                      ↑
                              useThemeStore (zustand persist 'theme')
                                themeSchema: string ('', 'default','dark','green'...)
                                mode: 'light'|'dark'
                                setSchema(payload) / setMode(payload)
                                      ↑
                              Theme.tsx: useThemeSchema() useEffect([themeSchema, mode])
```

*   Persistence: `zustand/middleware persist` key `theme` in `localStorage`.
*   Switching: `useThemeStore.getState().setSchema('green')` or `ThemeSwitcher.tsx:18` `ring-2 ring-primary` active.
*   Adding a schema: add entry to `presetThemeSchemaConfig` map — automatically picked up by `applyTheme()` `useThemeSchema.ts:28-30`.

Default store `src/configs/theme.config.ts:20` → `themeSchema: ''` (falls back to `:root` CSS), `controlSize: 'md'`, `layout: collapsibleSide`.

---

## 8. Typography & Surfaces

*   Font stack `tailwind.config.cjs:13-48` `sans: Inter, ui-sans-serif…`
*   Body `index.css:87` `text-sm bg-gray-100 dark:bg-gray-950` `color: var(--text-secondary)` `font-size: 0.9375rem`.
*   Headings `index.css:113-152` clamp responsive, `text-gray-900 dark:text-gray-100`.
*   Surfaces: Card `AdaptiveCard`, `Dialog`, `Table` use `bg-white dark:bg-gray-800/70`, borders `gray-200 dark:gray-700`.

---

## 9. Usage Guidelines

### 9.1 Do / Don't

| Do | Don't |
| :--- | :--- |
| Use `bg-primary text-neutral` for primary CTA `Button solid` | Don't hardcode `#6e1423` in JSX — use `var(--primary)` / `bg-primary` |
| Use `bg-primary-subtle text-primary` for selected/hover states | Don't use `primary` for destructive — use `error` (`#ff6a55`) |
| Use `gold` only for restaurant-domain accents (`btn-restaurant-solid`) | Don't use `gold` for generic primary buttons |
| Use `primary-mild` for `hover:bg-primary-mild`, `primary-deep` for active | Don't create new hex without adding to `index.css` + `tailwind.config.cjs` |
| Use `gray-100..950` for backgrounds/borders, `text-muted` for secondary | Don't use `neutral` as page bg — it is button text |

### 9.2 Component Examples

```tsx
// Primary CTA
<Button variant="solid" className="bg-primary text-neutral hover:bg-primary-mild">Publish reply</Button>

// Secondary
<Button variant="default" className="hover:border-primary hover:text-primary">Edit</Button>

// Destructive (RatingList delete)
<Button variant="default" className="!text-red-500 hover:!bg-red-50 hover:!border-red-200"> <TbTrash/> </Button>

// Subtle/Selected
<div className="bg-primary-subtle text-primary">Selected option</div>
<div className="bg-success-subtle text-success">Success badge</div>

// Gold restaurant button
<button className="btn-restaurant-solid">Restaurant Login</button>

// Typography
<p className="text-content-primary">Heading</p>
<p className="text-content-muted">Muted metadata</p>
```

---

## 10. How to Add / Switch Theme

### 10.1 Add new theme

1.  Edit `src/configs/preset-theme-schema.config.ts` — add:

```ts
const tealTheme: ThemeVariables = {
  light: { primary: '#0d9488', primaryDeep: '#0f766e', primaryMild: '#14b8a6', primarySubtle: '#0d94880d', neutral: '#ffffff' },
  dark:  { primary: '#0d9488', primaryDeep: '#0f766e', primaryMild: '#14b8a6', primarySubtle: '#0d94880d', neutral: '#ffffff' },
}
// ...
export default { ... , teal: tealTheme }
```

2.  No need to touch `tailwind.config.cjs` — variables already mapped.
3.  Optionally add a swatch button in `ThemeSwitcher.tsx`.

### 10.2 Switch at runtime

```ts
import { useThemeStore } from '@/store/themeStore'
const setSchema = useThemeStore(s => s.setSchema)
const setMode = useThemeStore(s => s.setMode)
setSchema('purple') // or 'green' / 'orange' / 'dark' / 'default'
setMode('dark') // toggles :root ↔ .dark
```

`useThemeSchema.ts:45` effect applies automatically.

---

## 11. File Reference Index

```
tailwind.config.cjs
src/assets/styles/tailwind/index.css
src/assets/styles/app.css
src/assets/styles/components/_button.css
src/configs/preset-theme-schema.config.ts
src/configs/theme.config.ts
src/@types/theme.ts
src/constants/theme.constant.ts
src/store/themeStore.ts
src/utils/hooks/useThemeSchema.ts
src/utils/hooks/useDarkMode.ts
src/components/template/Theme.tsx
src/components/template/ThemeConfigurator/
```

> Keep `index.css` `:root`/`.dark` and `preset-theme-schema.config.ts` in sync when changing brand colors. Run `npm run build` after edits — Tailwind `safelist.txt` not required (colors are vars).
