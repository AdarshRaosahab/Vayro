# UX & Accessibility Checklist

## Typography & Spacing
- [ ] **Scale**: Headings follow the `tokens.css` scale (H1=48px, H2=32px, etc.).
- [ ] **Rhythm**: Vertical spacing uses the 8pt grid (`space-md`, `space-lg`).
- [ ] **Line Length**: Text containers max-width is appropriate for reading (approx 65 chars).

## Accessibility (a11y)
- [ ] **Contrast**: Text meets WCAG AA (4.5:1) against background.
- [ ] **Focus**: All interactive elements have visible focus rings (`focus-visible`).
- [ ] **Keyboard**: Can navigate entire site using Tab/Enter/Space.
- [ ] **Skip Link**: "Skip to content" link exists on all pages.
- [ ] **Labels**: Inputs have associated labels; icons have `aria-label`.
- [ ] **Modals**: Trap focus, close on Esc, have `role="dialog"`.

## Touch Targets
- [ ] **Mobile**: Buttons and links are at least 44x44px.
- [ ] **Spacing**: Adequate space between touch targets to prevent mis-taps.

## Motion
- [ ] **Reduced Motion**: Animations are disabled/reduced when `prefers-reduced-motion` is set.
- [ ] **Performance**: Animations use `transform` and `opacity` only.

## Microcopy
- [ ] **Action-Oriented**: Buttons start with verbs (Create, Save, Delete).
- [ ] **Clarity**: Error messages explain what went wrong and how to fix it.
- [ ] **Tone**: Professional, minimal, "founder-grade".
