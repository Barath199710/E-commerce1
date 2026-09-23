# Task 17 Write-up – Dark Mode & Theme System

## 1. What is a CSS custom property and how is it different from a hardcoded color value? Give an example from your code.

A **CSS custom property** (also known as a **CSS variable**) is an entity defined by a developer that contains a specific value to be reused throughout a document. They are declared using double-dash syntax (e.g., `--bg-primary`) and accessed using the `var()` function (e.g., `background-color: var(--bg-primary)`).

### Differences from Hardcoded Values:
1. **Dynamic Runtime Switching**: Unlike hardcoded values (like `#0f172a` or `#ffffff`), CSS custom properties are evaluated dynamically by the browser's CSS engine. When the value of `--bg-primary` changes on a parent element like `:root[data-theme='dark']`, every element consuming `var(--bg-primary)` instantly updates its styling without requiring component re-renders or DOM mutations.
2. **Centralized Design Tokens**: Custom properties serve as single sources of truth (design tokens). If a color scheme needs updating, you only change the variable definition in one place rather than searching and replacing hundreds of hardcoded hex values.

### Code Example from our Project:

```css
/* In index.css */
:root[data-theme='light'] {
  --bg-primary: #f8fafc;
  --text-primary: #0f172a;
  --card-bg: #ffffff;
  --border-color: #e2e8f0;
}

:root[data-theme='dark'] {
  --bg-primary: #0a0d14;
  --text-primary: #f8fafc;
  --card-bg: #121824;
  --border-color: rgba(255, 255, 255, 0.08);
}

/* Usage in components */
body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.product-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
}
```

---

## 2. Your app detects the user's system theme on first visit. How? Write the exact code that does this.

The app uses the Web API `window.matchMedia()` to query the operating system's media query feature `(prefers-color-scheme: dark)`.

### How it works:
When `window.matchMedia('(prefers-color-scheme: dark)').matches` evaluates to `true`, it indicates that the user's OS or browser setting is set to Dark Mode. Otherwise, it defaults to Light Mode.

### Exact Code Implementation from `ThemeContext.jsx`:

```javascript
const getInitialTheme = () => {
  // 1. Check localStorage first for explicit user choice
  const saved = localStorage.getItem('theme');
  if (saved) return saved;

  // 2. Fall back to system preference detection on first visit
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
};
```

---

## 3. Why is using `data-theme` on the root element better than passing a theme prop to every single component?

Setting `data-theme` on `document.documentElement` (the root `<html>` element) is vastly superior to passing a `theme` prop down the component tree for several architectural and performance reasons:

1. **Eliminates Prop-Drilling & Boilerplate**: You do not need to pass `theme="dark"` or `theme="light"` through dozens of intermediate components that don't directly care about theme values.
2. **Native Browser Optimization & Performance**: When `document.documentElement.setAttribute('data-theme', theme)` runs, the browser re-evaluates CSS variable mappings in CSS engine native code (written in C++). React components do not need to re-render or execute JavaScript style calculations.
3. **Decoupled Architecture**: UI components remain purely visual and agnostic of theme state logic. Components simply reference standard design tokens (`var(...)`), ensuring clean separation of concerns.
4. **Smooth Transitions**: Global transitions (`transition: background-color 0.3s ease, color 0.3s ease`) can be applied seamlessly at the CSS level across all elements simultaneously.

---

## 4. What is `localStorage.getItem('theme')` doing in `getInitialTheme` and why does it take priority over the system preference check?

### Role of `localStorage.getItem('theme')`:
`localStorage.getItem('theme')` checks browser persistent key-value storage for any previously saved theme choice (`'light'` or `'dark'`) saved during a prior session when the user clicked the toggle button.

### Why it takes priority over the system preference check:
1. **Explicit User Choice vs. Implicit OS Setting**: A user's explicit action inside the application (e.g. manually clicking the Dark/Light toggle button) represents intentional user preference within that specific app context.
2. **Persistence Across Reloads**: If system preference took priority on every load, any manual toggle choice made by the user would be erased as soon as they refreshed the page or returned later. Checking `localStorage` first ensures that manual overrides are remembered consistently.
